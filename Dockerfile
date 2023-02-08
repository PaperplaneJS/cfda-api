FROM node:12-slim
EXPOSE 9000

WORKDIR /app
ADD . /app/
RUN yarn --registry=https://registry.npmmirror.com

CMD [ "yarn", "cd" ]