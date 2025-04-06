FROM node:20.13.1-alpine

WORKDIR /app

RUN apk add --no-cache yarn

COPY package*.json yarn.lock* ./
RUN yarn install

COPY . .

EXPOSE 3001
CMD ["yarn", "dev"]