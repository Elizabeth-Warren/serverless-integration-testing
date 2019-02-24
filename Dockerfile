FROM node:8.10-stretch

COPY bin/script.js /github/workspace/_integration-bootstrap.js

RUN npm install -g serverless

ENTRYPOINT ["node", "/github/workspace/_integration-bootstrap.js"]
