#Create the image based on the official Node image from dockerhub
#Using alpine for a lightweight version of Node
#Using this version as its closest to the version used in development
FROM node:20.19-alpine AS build-stage

#Create the app directory and use this as the working directory for subsequent commands
WORKDIR /app 

#Copy the dependency definitions
COPY package*.json ./

# Install dependencies using the Node command
RUN npm install

# Copy over all the code needed
COPY . .

# Build the binaries using a pre-defined 'build' script 
# The files created to go to the ./dist folder
RUN ["npm", "run", "build"]

#Use a lightweight nginx image as a base for the new stage
FROM nginx:alpine AS prod

#Copy over the build files from the previous stage to the nginx folder where they'll be served up
COPY --from=build-stage /app/dist /usr/share/nginx/html

#Copy over the nginx config file sitting in the host's current directory
COPY nginx.conf /etc/nginx/conf.d

#Expose port 80
EXPOSE 80

#Run nginx in the foreground and start serving web content after the container starts up
CMD ["nginx", "-g", "daemon off;"]
