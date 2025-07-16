FROM node:20-alpine
WORKDIR /usr/src/app

COPY . .

RUN yarn install
RUN yarn run build

EXPOSE 80

CMD ["yarn", "run", "start:prod"]