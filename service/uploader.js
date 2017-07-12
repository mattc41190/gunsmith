const AWS = require('aws-sdk');
const s3 = new AWS.S3();

function upload(key, results, log,  cb) {
	var resultsBucket = 'bazuka-bird-results';
    results = [results]
	params = {
		Bucket: resultsBucket,
		Key: key,
		Body: JSON.stringify(results)
	};

	s3.putObject(params, function(err, data) {
		if (err) {
			console.log(err)
            cb()
		} else {
			console.log(`Created ${key} \nIncluded: ${key}.json, ${key}.log`);
            cb();
		}
	});
}

module.exports = {
	upload
};
