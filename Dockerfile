# build environment
FROM node:13.12.0-alpine

WORKDIR /app

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./

RUN npm install

COPY . ./

EXPOSE 3000

CMD node app.js
