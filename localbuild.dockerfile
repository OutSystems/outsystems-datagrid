# Use an official Node.js runtime as the base image
FROM node:22.2.0-slim

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy outsystems-datagrid into the container
COPY . ./

# Build the npm project
RUN npm install
RUN npm run build
RUN npm audit
