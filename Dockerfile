FROM node:8.10-stretch

COPY bin/script.sh /usr/local/bin/sls-int-test.sh
RUN chmod +x /usr/local/bin/sls-int-test.sh

RUN npm install -g serverless
