'use strict';
const Hapi = require('hapi');
const fs = require('fs');
const moment = require('moment');
const spawn = require('child_process').spawn;
const upload = require('./uploader').upload;
const PORT = process.env.PORT || 3333;
const server = new Hapi.Server();
server.connection({ port: PORT});

server.register(require('inert'), (err) => {

	if (err) {
		throw err;
	}

	server.route([{
			method: 'GET',
			path: '/',
			handler: function(request, reply) {
				reply('Run a test by going to /test + JSON {site: mysite.com/, endpoint:profile, duration:10, virtualusers:10}');
			}
		},
		{
			method: 'POST',
			path: '/test',
			handler: function(request, reply) {
				let endpoint = `${request.payload.endpoint}_${moment().format()}` || "NONEERROR"
				fs.writeFile(`./results/${endpoint}.log`, JSON.stringify(request.payload), function(err) {
					if (err) {
						return console.log(err);
					}
					let options = ["quick", "--duration", request.payload.duration, "--rate", request.payload.virtualusers, "--output", `results/${endpoint}.json`, `${request.payload.site}${request.payload.endpoint}`]
					let artillery = spawn("artillery", options)

					artillery.stdout.on('data', (data) => {
						fs.appendFile(`./results/${endpoint}.log`, `\n ${data}`, function(err) {
							if (err) throw err;
						});
					});
					artillery.stderr.on('data', (data) => {
						fs.appendFile(`./results/${endpoint}.log`, `\n ${data}`, function(err) {
							if (err) throw err;
						});
					});
					artillery.on('close', (code) => {
						console.log(`child process exited with code ${code}`);
						fs.appendFile(`./results/${endpoint}.log`, `\n ${code}`, function(err) {
							if (err) throw err;
							console.log("Starting S3 Upload");
							let log = fs.readFileSync(`./results/${endpoint}.log`, 'utf8');
							let reportOptions = ["report", "--output", `./results/${endpoint}.html`,`./results/${endpoint}.json`, ]
							let report = spawn("artillery", reportOptions);
							report.stdout.on('data', (data) => {
								console.log(data);
							});
							report.stderr.on('data', (data) => {
								console.log(data);
							});
							report.stdout.on('close', (code) => {
								upload(endpoint, require(`../results/${endpoint}.json`),log, function() {

								})
							});

						});

					});
					reply(`Running test against ${endpoint}. Log file successfully created and available to monitor`);
				});
			}
		},
		{
			method: 'GET',
			path: '/results/{param*}',
			handler: {
				directory: {
					path: 'results',
					listing: true
				}
			}
		}
	]);

	server.start((err) => {

		if (err) {
			throw err;
		}

		console.log('Server running at:', server.info.uri);
	});
});
