FROM node:11-alpine
WORKDIR /app
COPY . /app
RUN yarn install
RUN yarn build
CMD ["yarn", "start"]
