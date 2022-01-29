FROM node:16.13.2

COPY ./package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/
WORKDIR /app
COPY . /app
RUN cd /app
RUN npm run build
CMD ["npm","run","start:prod"]