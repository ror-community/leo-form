FROM node:lts-alpine

RUN apk add --update python3 make g++ && rm -rf /var/cache/apk/*

# install simple http server for serving static content
RUN npm install -g http-server

# make the 'app' folder the current working directory
WORKDIR /app

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install and cache project dependencies
RUN npm ci

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

RUN npm run build

EXPOSE 8080

# start app
CMD [ "http-server", "dist" ]
