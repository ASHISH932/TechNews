FROM node:10
ENV PORT 8080
EXPOSE 8080

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json .
RUN npm install
COPY . .
RUN npm run-script build

CMD ["node", "build/index.js"]
