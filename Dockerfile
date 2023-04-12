# Dockerfile

# base image
FROM node:alpine

# create & set working directory
RUN mkdir -p /brahimabdelli

WORKDIR /brahimabdelli

# copy source files
COPY . /brahimabdelli

# ENV NODE_ENV production

# install dependencies
RUN npm install

RUN npm run lint

# start app
RUN npm run build

#RUN npm run cypress

EXPOSE 80
EXPOSE 443



CMD npm run start