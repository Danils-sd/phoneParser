FROM node

WORKDIR /app

COPY /package.json /app

RUN npm install

COPY . .

EXPOSE 5010

CMD [ "npm", "start" ]