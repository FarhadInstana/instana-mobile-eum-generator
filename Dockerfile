FROM node:14
WORKDIR /opt/mobile-app-monitoring-simulator
COPY package.json src .
RUN npm install --production
CMD [ "npm", "start" ]

