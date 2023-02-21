

FROM node:16

#Adding our working directory
WORKDIR /usr/src/app

#Running the working directory
COPY package*.json ./

#To run our server
RUN npm install

COPY . .

#On this port
EXPOSE 3000

#With these specified commands
CMD [ "node", "index" ]