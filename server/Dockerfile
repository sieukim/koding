FROM node:16.13.2 as builder

COPY ./package.json /tmp/package.json
RUN cd /tmp && npm install
RUN mkdir -p /app && cp -a /tmp/node_modules /app/
WORKDIR /app
COPY . /app
RUN cd /app
RUN npm run build

FROM node:16.13.2-alpine
WORKDIR /app
COPY --from=builder /app ./
CMD ["npm","run","start:prod"]
