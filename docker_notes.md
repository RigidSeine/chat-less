# Intro
- To understand Docker, we'll talk about three concepts.
  - Dockerfile
  - Docker Image
  - Docker Container
- The dockerfile is our blueprint for assembling a docker image, and the docker image is a compact template of the service we're trying to containerise. The docker container is an instance of the aforementioned template, and we can have many of these running at once. 

# Dockerfile

# Docker commands
[`docker build -t [tagName]:[versionName] [path]`](https://docs.docker.com/reference/cli/docker/buildx/build/)
- Builds a docker image from a dockerfile at the specified path and appends it with a tag name and version.
- The `-t` is a parameter that just means "tag".
- You can use `.` for `[path]` to specify the current directory and the dockerfile in the current directory will be used. 

[`docker run -p [boundPort]:[exposedContainerPort]/tcp --network [networkToAttachTo] --name [containerName] [imageName]`
](https://docs.docker.com/reference/cli/docker/container/run/)
- Runs and starts a container using the specified image.
- If the image doesn't have an ongoing process, e.g. if the dockerfile commands only builds files, then the container will shut down after it has completed the build process. It is common to start up containers just to perform calculations.

## Build-run-copy-remove
`docker buildx build -f "client.dockerfile" -t chat-less-client:v03042025 .`
`docker run --name sharky chat-less-client:v03042025`
`docker cp sharky:/app/dist .`
`docker rm sharky`

## Create Network
`docker network create -d bridge my-net`

# Container Networking
- Allows for containers to connect to and communicate with each other.

# Docker Compose
- A script for defining and running multi-container applications - streamlines putting together docker commands.
- Written in YAML.

## Compose Version
- This is now obsolete and not required in a compose file.  

# Troubleshooting
`ERROR: error during connect: Head "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/_ping": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`
- If you get this while trying to run: `docker buildx build -t <imageName> .`
  - Either the Docker engine/daemon isn't running (start up Docker desktop or run the system service).
  - Or you've changed the Dockerfile name to something that isn't just "Dockerfile" and you need `-f "<dockerfileName>"` in the command.

`ERROR: "docker buildx build" requires exactly 1 argument.`
- If you get this, then you're probably missing an `.` at the end for the build context.

`tag does not exist:` when running `docker push`
- If you're trying to push an image to a repo in the remote registry (e.g. Docker Hub) then the image name must use the repo's name.
- For example: \
![List of built images for chat-less with only one of them using the remote repository name](/Notes_images/docker-image-ls.png)
- When trying to run `docker push holyshiznicks/chat-less-server:latest` to push the image to the holyshiznicks namespace (account), only the one with `holyshiznicks/` can be pushed. 
- This can be fixed using `docker tag` to rename the image or by building a new image.

`unable to get image 'holyshiznicks/chat-less-client:latest': error during connect: Get "http://%2F%2F.%2Fpipe%2FdockerDesktopLinuxEngine/v1.47/images/holyshiznicks/chat-less-client:latest/json": open //./pipe/dockerDesktopLinuxEngine: The system cannot find the file specified.`
- Found on running `docker compose up` or `docker compose pull`
- Fix it by starting the Docker engine.