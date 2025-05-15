#Create the image based on the official Node image from dockerhub
#Using alpine for a lightweight version of Node
#Using this version as its closest to the version used in development
FROM node:20.19-alpine

#Create the app directory and use this as the working directory for subsequent commands
WORKDIR /app 

#Copy the dependency definitions
COPY package*.json ./

# Install dependencies using the Node command
RUN npm install

# Copy over all the code needed
COPY . .

# Expose the port the app the runs in
EXPOSE 4000

# Serve the app by listing out the run command as elements in a list 
CMD ["npm", "run", "dev"]