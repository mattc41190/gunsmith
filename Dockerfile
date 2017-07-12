FROM node:8.1.3
RUN npm install -g artillery
RUN mkdir app
COPY . /app
RUN cd /app; npm install
EXPOSE 3333
EXPOSE 80
ENTRYPOINT ["node", "service/server.js"]
