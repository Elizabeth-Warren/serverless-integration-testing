FROM node:8.10-stretch

COPY bin/script.sh /usr/local/bin/sls-int-test
RUN chmod +x /usr/local/bin/sls-int-test

RUN npm install -g serverless
