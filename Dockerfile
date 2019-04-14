FROM node:10-slim

WORKDIR /app

COPY . /app
COPY src/__fixtures__/test.log /tmp/access.log
RUN npm install

CMD ["npm", "start"]