FROM node:11-alpine as builder
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build
CMD ["yarn", "start"]
