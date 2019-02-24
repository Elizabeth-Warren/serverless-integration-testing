FROM node:8.10-stretch

COPY "bin/entrypoint.js" "/entrypoint.js"

RUN npm install -g serverless

ENTRYPOINT ["node", "/entrypoint.js"]
