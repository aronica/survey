FROM mc2labs/nodejs
MAINTAINER Fred Fu (fangyu.fu@ele.me)
WORKDIR /app
ADD data node_modules public app.css app.js data.csv Dockerfile package.json /app/
VOLUME ["/var/run","/var/log"]
EXPOSE 3000
RUN npm install -g --registry=https://registry.npm.taobao.org