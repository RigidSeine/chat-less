# Installation - Client-side Dependencies
- Installed Node.js via .msi file.
- Tried running `npx create-react-app client` only to get an error:
`ENOENT: no such file or directory, lstat 'C:\Users\User\AppData\Roaming\npm'`
- Resolved by creating the npm folder in the directory. https://docs.npmjs.com/common-errors#error-enoent-stat-cusersuserappdataroamingnpm-on-windows-7 also has a common errors for npm.
- Upon installing create-react-app, `npm audit` warns of vulnerabilities immediately. It is known that `npm audit` creates a lot of false positives. https://overreacted.io/npm-audit-broken-by-design/
- Because `npm audit` was run, that broke some dependencies.
- Installed `vite` instead using `npm create vite@latest client -- --template react` which allows for cleaning of the destination folder to install new fresh dependencies and files.
- Ran `npm i react-router-dom socket.io-client` to install two packages: 
  - `react-router-dom` is the library for routing in React. It allows the navigation and rendering of diferent components depending on the URL. You get to route to different Views essentially.
  - `socket.io-client` is the client-side library for Socket.IO. Socket.IO is the crux of this app, allowing for real-time event-based communication between the client (browser) and the server. Used in place of standard HTTP requests. Socket.IO uses WebSocket connection whenever possible but will use HTTP long-polling as fallback.
- HarperDB no longer has a free tier. And its lowest tier is hella expensive. So pivoting to MongoDB (Atlas) and trying out NoSQL - which requires getting an account on MongoDB and running `npm install mongodb` (since we're using Node.js).

# Installation - Server-side Dependencies
- Ran `npm i axios cors express socket.io dotenv`
  - **Axios** is for making API requests, specifically async HTTP requests (GET, POST, PUT, etc.). 
  - **CORS** is Cross-Origin Resource Sharing - allowing for HTTP requests to be made from one website to another in the browser. This is required for Socket.IO. This can be implemented securely by using a whitelist using the `Access-Control-Allow-Origin` request header.
  - **Express** is a convenient NodeJS framework for doing back-end (in contrast to using React for front-end. Although we're using React routing for this one). We want Express to make use of middleware.
  - **Dotenv** is for loading environment variables (e.g. Secrets!)
- Also ran `npm i -D nodemon`
  - The `-D` argument is to install the package as a dev dependency.
  - Nodemon saves us from having to restart the server for every change.

# Development - Home Page
- New directory created in `src`: `pages\home` along with two files `index.js` and `styles.module.css`.
- `styles.module.css` is a CSS module which allows for local scopes for CSS. In other words, this allows for different CSS namespaces. So you can define a button class in two different CSS modules (e.g. `styles1.module.css` and `styles2.module.css`) and use either one by using `${styles1.button}` or `${styles2.button}`.
- An `index.js` file in the `./pages/home` directory creates the Home module and is exported for use in the `App.jsx` file.
- The `App.jsx` is where the routing is defined by importing `react-router-dom` module.
- [Error] Tried running the app and encountered an error saying that my `.pages/home/index.js` was using invalid `.jsx` syntax. And that was because the file extension was incorrect!
- The Home module contains the HTML for the homepage.

![Homepage](/Notes_images/homepage-dev-1.png)

- Functionality for the homepage is added to the `App.jsx` file since other pages in the app will require access to the `username` and `chat room` values.
- Handling a lot of this will be:
  - States for storing the submitted values
  - A socket instance to handle communication between clients and the server.
### Importing/Exporting Syntax (ES6 - on this app's client-side)
- Default exports are imported without braces. - `import <MODULE_NAME> from '<FILE_PATH/PACKAGE NAME>';`
- Named exports are imported with braces. - `import { <MODULE_NAME> } from '<FILE_PATH/PACKAGE NAME>';`
- Exporting one module is done via `export default <MODULE_NAME>;`.

### Importing/Exporting Syntax (CommonJS - on this app's server-side)
- Use the require keyword - `require('<FILE_PATH/PACKAGE NAME>');`.
- Exporting one module is done via `module.exports = <MODULE_NAME>;`

### Props
- Props are how you pass states between components.
- Since components work like functions, props are implemented like parameters to a function.
```jsx
// client/src/App.jsx - The parent component
function App() {
  const [username, setUsername] = useState(''); 
  const [room, setRoom] = useState(''); 

  return (
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home //List of props for the Home component
                username={username} 
                setUsername={setUsername} 
                room={room} 
                setRoom={setRoom} 
                socket={socket} 
              />
            }
          />
        </Routes>
      </div>
    </Router>
  );
}
```
```jsx
// client/src/pages/home/index.jsx 
//It then follows that parameters need to be declared in Home
const Home = ({username, setUsername, room, setRoom, socket}) => { 
  //...
};
```
### Function Components
- It's all function components here in the present.
- They're essentially JS functions that return HTML.
- The function names must be capitalised.
- Then they're rendered.
- Like so:
```js
//../src/App.jsx

const App = () => {
  const[username, setUsername] = useState('');
  const[room, setRoom] = useState('');

  return(
    <h1>HELLO MORTAL</h1>;
  );
};

export default App;

```

```js
//..src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

# Development - Server-side
- It all starts with an `index` file. In this case, it's an `index.jsx` file at the root of the server folder. Populated within is the barebones of an Express app which can be found on the [Express website](https://expressjs.com/en/starter/hello-world.html).
- In order to get this up and running, a script needs to be defined in the `package.json` file (also at the root of the server folder). This looks like:
```json
  "scripts": {
    "dev": "nodemon index.jsx"
  }
```
- This defines a script called `dev` that runs the `nodemon` command on `index.jsx` since it's the entry point of this app. This is how we get `nodemon` to monitor and register changes in our Express app without needing to (manually) restart the server.
- The script is run by using the CLI command `npm run dev`. Hey wait a minute, this is similar to running the client React app.

## Hooks
- As per W3, hooks allow function components to have access to state and other React features.
- The common one is `useState`  and it's typically used like `const [VALUE,setVALUE] = useState(DEFAULT_VALUE)`;
- Another one is `useEffect` which allows for the use of side effects. Examples of side effects include: fetching data, directly updating the DOM, and timers.

Speaking of timers:
```js
import { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";

function Timer() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let timer = setTimeout(() => { //Create this timer on render that runs setCount every 1000 seconds
    setCount((count) => count + 1);
  }, 1000);

  return () => clearTimeout(timer) //Clean up function that's run when the component is unmounted
  }, []); //An empty array is passed in as a dependency so useEffect will only be run once. 
          //If nothing is passed in, then useEffect will run every render and that could be any time a value changes on screen
          //A dependency such as `count` could be passed into the array and useEffect will run every time `count` changes.

  return <h1>I've rendered {count} times!</h1>;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Timer />);
```

## Messages (Chat History)
- Making use of React to split the page up into components
  - A: A sidebar on the left displaying the name of the room, the list of users and an action(s) for the room (i.e. leave)
  - B: The chat history istself.
  - C: The message bar and the button to send a message.
  
   ![Things to in the chatroom: 1. Leave.](/Notes_images/thingstodoleave.png)\

- Built the messages part and tried to test joining a room only to get a blank page on app startup.
  - Check the console for errors, kids. I found a couple of errors of includes not being written and so a couple of pages couldn't be found.
  - And if that still doesn't work then check you CSS modules. Accidentally had one spelt as *.module**s**.css instead of *.module.css which ruined everything.
  - Also had issues trying to get the client and server to communicate with each other.
  - The server must have some arbitary port number that it listens on, but it must be separate to the client.
  - On the server-side, the client's port number must be added to the Cross-Origin (COR) whitelist.
    - The client's port number is just decided by the framework when you run the app's client
  - On the client-side, the socket must connect to the server-side's port number.
  - Now, the important part - both the server and client must be running.
  - Behaviour is then driven from the client side.
- New problem: finding issue with `socket.on('receive_message', ())` not firing.
  - **Result**: The event was firing, there was just a missing event not included the code that welcomes the new user. Good to explore the socket documentation a bit more though.
- Also creating the `save message` function to write to the database.
- Of course, we've learnt from the Hack the Box CTFs at this point to sanitise any user input going to the database.
- Following on the nice bit of async with `save message`, `get messages` follows.'
- In creating rendering the chat history, we get to use the `useRef()` hook. It's very similar to the `useState()` hook, but the **changing the ref doesn't trigger a re-render**.
  - In this specific case, we use the hook to manipulate a DOM object by completing the following steps 
  1. Initialising the reference with a `null` value:
  ```jsx
  import {useRef} from 'react';

  function Messages {
    const messagesColumnRef = useRef(null);

    //...//
  }
  ```
  2. In the returned HTML, pass the ref object as a ref object of the DOM node we're manipulating
  ```jsx
    return( 
      <div className={styles.messagesColumn} ref={messagesColumnRef}>
      //..//
    );
  ```
  3. Now we can use whatever HTMLElement behaviour with it:
  ```jsx
    //Whenever the state of messagesReceived updates, use the reference to the DOM object to scroll
    //to the most recent message
    useEffect(() => {
      messagesColumnRef.current.scrollTop = messagesColumnRef.current.scrollHeight;
    }, [messagesReceived]
    );
  ```
- The last on list is component A, the sidebar: this was more of the same. In `./server/index.jsx`, a `chatroom_users` was set up as a way of updating the user list when they joined room. This was leveraged for updating the displayed list of users.

# Javascript Quirky Operators
## Destructuring
- `{socket}` is destructuring the socket object to extract the object's properties.
- This can be done with an array as well using the spread operator.

## Spread
- `...myArray` - copies and returns the elements of the array for use. 
- **Warning**: Usage of spread on large arrays can lead to stack overflows and not the good kind.

## Parentheses Instead Of Curly Braces (For Callback Functions)
- Usually you open callback functions with curly braces `{}`, but if you use parentheses `()`, it's a short form for returning what's enclosed.

## Optional Chaining
- Similar to in C# where you declare a nullable variable with `[TYPE]?`, javascript has optional chaining for when you're chaining (accessing an object property or calling a function): `?.`.
- If the object accessed or the function called is `undefined` or `null`, the expressions evaluates to `undefined` and prevents throwing an error `Error: Cannot read properties of undefined (reading '[NON-EXISTENT PROPERTY]')`

# What the Hell is a Socket?
- According to the (Socket.IO website)[https://socket.io/docs/v4/how-it-works/], it's a bidirectional channel between a Socket.IO server (Node.js) and Socket.IO client (browser, Node.js) established with a **Websocket connection** whenever possible, and will use HTTP long-polling as fallback. So it's a **websocket** that resorts to HTTP long-polling as a last resort for transporting data.
## So What's a Websocket? 
- To understand what a websocket is, we can look to using a HTTP requests as a vehicle for comparison.
### HTTP
- As we know, HTTP, or Hypertext Transfer Protocol, is an internet protocol which acts the basis for how we surf the net.
- We use it to load webpages using hypertext links. They always start with `http://` or `https://`
- It's unidirectional communication protocol where a **client** (e.g. a browser on a computer) sends a **request** (visiting a website) to a **server** (e.g. a machine that is more or less a computer hosting said website) and the **server** sends back a **response** (e.g. the home page of the website).
- After a response is sent, the connection between the client and server is closed. And so, a new HTTP (or HTTPS) request from a client will reesult in a new connection to the server.
- HTTP is a stateless protocol that runs on top of TCP (Transmission Control Protocol). Stateless meaning the server doesn't need to retain the information of a session or the status of every communicatiing partner across requests. This is more important when we get to Websocket. [TODO: more info required on TCP]
- Each HTTP request comprises the protocol version (e.g. HTTP/1.1, HTTP/2), the method (GET, POST, etc.), headers (e.g. content type, content length), host information, etc.

### Websocket
- On the other hand, **Websocket** is also a communication protocol for communicating between a client and a server.
- Websocket however, is bidirectional, stateful protocol so the connection between a client and server is kept alive until it is terminated by either party.
- Websockets start with `ws://` or `wss://`. Not that you're likely to see a URL starting with these unless you work with them.
- The bidirectionality and statefulness allows for two-way realtime communication between the client and server. It's as simple as `websocket.send(data);`.
- Websocket connection also happens over a TCP connection.

### TCP
- Another mainstay of the internet, TCP (Transmission Control Protocol) is a protocol that enables application programs and computing devices to exchange messages over a network by breaking messages down into data packets and rebuilding the messages on the other side. A TCP/IP network uses IP (Internet Protocol) to make sure the data packets reach the right address.
- The term, "handshake" may come to mind when TCP is mentioned. The handshake is the method of establishing a connection between two devices on a TCP/IP network. It works in 3 steps:
1. Device 1 sends a `SYN` (Synchronize) packet to Device 2.
2. Device 2 sends a `SYN-ACK` (Synchronize-Acknowledge) packet to Device 1.
3. Finally, Device 1 sends back an `ACK` (Acknowledge) packet to Device 2. The connection is then established.
- Incidentally, hackers and botnets can stealthily ping to see if a server port is open by completing the first two steps of the handshake and quitting before the third step is complete. Talk about tricky.

### HTTP Long-Polling
- Also a way of doing real-time updates between a client and a server. Long-polling is done by maintaining a request until new data is retrieved from the server or until timeout.
- If new data is available, the server responds with the updated information and a new request is sent by the client to continue the cycle.
- Long-polling however, has greater latency and resource consumption than websockets.

# MongoDB
- Connecting to it:
```js
const { MongoClient, ServerApiVersion } = require('mongodb');

//Always URI encode the username and password using the encodeURIComponent method to ensure they are correctly parsed.
const username = encodeURIComponent('<username-retrieved-from-secret>');
const password = encodeURIComponent('<password-retrieved-from-secret>');
const clusterUrl =  '<cluster-name-retrieved-from-secret>';
const authMechanism = "DEFAULT";

const uri = `mongodb+srv://${username}:${password}@${clusterUrl}/?authMechanism=${authMechanism}`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

```

## MongoDB Terminology
- **Cluster:** A group of databases = SQL Database
- **Database:** A group of collections = SQL Schema
- **Collection:** A group of objects = SQL Table
- **Document:** A record/object = SQL Row
- **Field:** Property of an object = SQL column
- **Projection:** Tool used query specific fields instead of all of them from a collection. = SQL `SELECT <columnA>, <columnB>, <columnC> <,...etc> FROM <table>`  

## MongoDB Commands
- **Insert** = SQL INSERT INTO 
```node.js

```
- **Find()** = SQL SELECT * FROM 
```js
const cursor = db.collection('inventory').find({}); //SELECT * FROM inventory

const cursor = db.collection('inventory').find({ status: 'D' }); //SELECT * FROM inventory WHERE status = 'D'

const cursor = db.collection('inventory').find({
  status: 'A',
  $or: [{ qty: { $lt: 30 } }, { item: { $regex: '^p' } }]
});
//SELECT * FROM inventory WHERE status = "A" AND ( qty < 30 OR item LIKE "p%")
//$and is a valid operator too. This query simply omits it since the additional properties in the object use AND by default.
```

# Deployment
## Nginx Web Server Reverse Proxy Setup And Moving Files
- Since this leveraging an existing web server, we're going to be modifying the nginx config file to set up a virtual server for Chat Less.
- Well first I looked at the config file and it was a pig sty. So I tidied it up a little to have tenkiame.org as the actual server name instead of just `_`.
- Then I figured out that I need to add additional server directives for the ports that nginx will be listening on for the Chat Less app.
- But before that, a new directory adjacent to Tenkiame's directory (`var/www/app`) needs to be created to host all the app files.
  - Any permission issues are fixed with good ol' `sudo chmod 777 chat-less`.
- Then node.js needs to be installed (see https://nodejs.org/en/download/package-manager).
  - One problem: using the `nvm` method caused `node` and `npm` to install in the wrong place and prevent the usage of `npm install [package_name]` later on.
  - This can be fixed by creating `symbolic links` for `node` and `npm` since they're expected to be in the `/usr/local/bin` directory.
  ```bash
    sudo ln -s $(which npm) /usr/local/bin/npm
    sudo ln -s $(which node) /usr/local/bin/node
  ```
  - This can then be verified by using `whereis npm` and `whereis node` which should output `/usr/local/bin/npm` and `/usr/local/bin/node`, respectively.
- Annnnd all the node.js dependencies within both the `client` folder and the `server` folder.
  - I accidentally moved all the node_modules into the VM as well but there's likely compatibility issues between Windows binaries and the Linux environment.
  - So I ran `rm -rf node_modules` and just removed them all before running `npm install` which works off the `package_lock.json` file.
- That's the files done (?), so next I created an A record for `chat.tenkiame.org` pointing to the VM's IP address.
- Then I created a new virtual server in the nginx config file mirroring Tenkiame's port 80 setup.
- At this point, it's fine to run a certbot command to get a new certificate for the subdomain `sudo certbot --nginx -d chat.tenkiame.org`.

## Running the app
- So far, everything's been running in dev but it turns out it doesn't quite work the same for production.
- Fortunately, on the client-side there is a script already defined in the `package.json` file for production called `build`. It follows this can (and was) run by using the command: `npm run build`.
- However, there is no such thing defined for the Express back-end. So hunting around has led to two things: 
  - [Installing PM2 to daemonize the app](https://deploybot.com/blog/guest-post-how-to-set-up-and-deploy-nodejs-express-application-for-production)
  - And [setting the `NODE_ENV` variable to `production`.](https://stackoverflow.com/questions/9198310/how-to-set-node-env-to-production-development-in-os-x)
  - Putting it all together we get a script called `build` - `"build": "NODE_ENV=production pm2 start index.jsx --name chat-less-backend"`
  - This sets the `NODE_ENV` environment variable to `production` with a lifetime of only a session, but it's run everytime it starts up so it should be fine.
  - This also takes the place of a `systemd` service that I used to run TenkiAme
- Since we're using PM2, a PM2 account at `pm2.io` has been created for monitoring purposes. 

## Docker Deployment
- Installed Docker Desktop for convenient GUI to spin up docker containers
- Why containerise our app?
  - For easy portability and scalability.
  - Primarily for creating a CI/CD pipeline - automating the process from code commit to app deployment.
- See /docker_notes.md for more details on docker
- Create two dockerfiles to containerise frontend and backend on the VM.
- Use docker compose to build the containers from the dockerfiles. (https://www.youtube.com/watch?v=Qw9zlE3t8Ko) at file level one above the frontend and backend files (on the VM).
- Configure nginx as a reverse-proxy port forward to docker container.
- Use Github actions to retrieve new files for app updates from Github repo.

### The Backend
- The individual dockerfiles are actually quite simple to write since they're so short. Short enough in fact, that they can be included in these notes.
  
```dockerfile
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
```
- The comments for the most part explain how this works
- **CAVEAT** - The above script used `npm run dev` as the command for starting up the app, and while the non-Docker production command is `npm run build` which is defined as `"NODE_ENV=production pm2 start index.jsx --name chat-less-backend"` we're skipping all that and using `node index.jsx`. 
  - This is because we're moving away from pm2 and the environment variable will be defined in the Docker compose file.
- One thing to note is that `EXPOSE 4000` means that port 4000 is being exposed on the container itself. 4000 is used since the app's backend listens on this.
- This port can then mapped to a port on the host machine and accessed through there.
  - E.g. Let's say I run a container on my local PC. If port 4000 is exposed on the container, then port 12345 of the local PC can be mapped to that container port (`12345:4000`), and I can access the container's port 4000 by going to `http://localhost:12345`.
- Once created, the dockerfile can then be used to build an image with the command `docker build -t chat-less-server:v02042025 .` 
  - The `v02042025` is just the letter `v` for version followed by the current date.
- Since we use Docker Desktop, we can spin up a container using our newly built image while also mapping any local port to the container's exposed port.
- ![Screenshot of newly created docker image](../chat-less/Notes_images/docker-image-example-1.png)
- We can now test this if the container is serving up the backend of the app by testing the backend as if it was being served up on the remote VM.
  - Go to `http://localhost:[mappedPort]/` to get 'Cannot Get /' message since there's nothing to get, but it's not an empty response.
  - Then to go Command Prompt and run `curl "http://localhost:[mappedPort]/socket.io/?EIO=4&transport=polling"` to hopefully receive something like `0{"sid":"lUI2ARZiBAor5OScAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000,"maxPayload":1000000}` as the response (as per [Socket.io's troubleshooting page](https://socket.io/docs/v4/troubleshooting-connection-issues/).)

### The Frontend
- One mistake I made was misremembering that there was a script which ran an ongoing process for the frontend. 
  - This is the case for running the app in Dev, but not in PROD.
- The PROD script actually just creates the build files which can *then* be served up in an ongoing process (aka. a service) by a web server - which in our case is an Nginx process.
- What this means for running a Docker container is that when using a dockerfile that tries to copy app files and build them, the Docker container successfully does so and then immediately shuts down since there is no ongoing service. 
- After much investigating, the common approach for creating the frontend starts by using the same logic as backend's dockerfile by using a (nodejs) base image and copying over the app files.
  - However, it then pivots by using an additional build stage by installing an Nginx base image, moving the build files into the appropriate Nginx folder (`/usr/share/nginx/html`) and letting the container serve that up as the content. 
    - See [Nginx docs](https://docs.nginx.com/nginx/admin-guide/installing-nginx/installing-nginx-docker/) for more details.
    - See [this video](https://www.youtube.com/watch?v=K7PsxBMeBCI) for an example.
    - See [this article](https://www.innokrea.com/dockerizing-the-frontend-do-it-right-with-react-js-vite/) for an example with the Nginx image in the docker file
- So now, the proposed setup is that the frontend will not be served up in a Docker container since the web server (Nginx) currently serves up another app on the same machine.
  - Or is it? Can I infact follow the standard?

### Docker Network
- A network needs to be established between the containers for them to direct traffic to each other.
- This can be done easily by building a bridge traffic with `docker network create -d bridge my-net`
- After this, the network name can be passed in as a argument to the network parameter on docker container commands or included in the docker compose file.
  - Alternatively, if no explicit network name is specified in the docker compose file, then upon running the `docker compose up` command (effectively running the compose file) a default network will be created joining the different services specified in the file. 

### Docker Compose
- Kind of like a parent to the separate docker components built so far.
- A lot of the details included in the commands for creating the docker images and running the containers can be moved into a single script so that they're displayed in a neat markup language as opposed to a list of (terminal) commands.
- By familiarising oneself with the [common docker commands](\docker_notes.md), the docker-compose file becomes pretty simple to build.
- For this script, an image linked to a Docker hub repo is being used (e.g. `holyshiznicks/chat-less-client:latest`)
  - The `chat-less-client` image using the `latest` tag and sits in the `holyshiznicks` repo.
  - By using this, we can use the command `docker compose pull` to pull the latest image from Docker hub.
  - Of course, this means that we need to build the image beforehand and push it to Docker hub.
  - The idea is that this will be done on the Git servers as part of the Github actions.

### Docker Compose Permissions
```sh
>>> docker compose up
unable to get image 'holyshiznicks/chat-less-server:latest': permission denied while trying to connect to the Docker daemon socket at unix:///var/run/docker.sock: Get "http://%2Fvar%2Frun%2Fdocker.sock/v1.49/images/holyshiznicks/chat-less-server:latest/json": dial unix /var/run/docker.sock: connect: permission denied
```
- Basically running docker commands without `sudo` isn't possible with the current user's permissions.
- This [stackoverflow article](https://stackoverflow.com/questions/68653051/using-docker-compose-without-sudo-doesnt-work) shows how add the current user to the docker group to remove the need for `sudo`.
- However, permissions-wise it is basically the same as allowing `sudo` for docker if rootless docker hasn't been set up.
- This one is used to prevent the need for `sudo` in pipeline scripts.

### Application Logging with Docker
- Seems like a massive pain with people on the internet suggesting to either using `stderr` or `stdout` streams or some other tool like Loki.
- We're going to use the volume mounting feature and map a directory on the host machine to a directory on the container that contains all the log files that Winston spits out.
- It's as easy as including  `- ./server/logs:/app/logs:rw` in the list of volumes to mount in the `server` service.

## Troubleshooting
- At this point, navigating to `chat.tenkiame.org` just sends me to the Tenkiame app. 
  - The only detail left out at this point is just that the A record (chat.tenkiame.org) points to the IP address but not to a specific port number.
  - And that's because DNS can't point to a specific port number in the first place.
  - Back to the drawing board of serving up multiple apps in nginx?
    - Change server/indexjs file to include the `get` command? ==> This confirms that the nginx config is correctly serving up two different apps since I can see the Hello World both at [IP_ADDRESS:4000] and `chat.tenkiame.org` with 4000 being the port that the server is listening on. Now the issue is to "pass the correct files into app being served"
    - Update proxy pass to 5173?
      - Good try. But I'm unable to run the app from the `dist` files alone locally since all I ran was `npm run build` (which only builds the distribution files.)
      - No proxy pass - only have nginx listen to the front-end port then try files at the `dist` directory. 🐒🐒🐒
      - New problem: Server is not allowing XMLHttpRequest due to the CORS policy listing `http://localhost:5173` instead of `https://chat.tenkiame.org`.
      - Easily fixed by adding the site into the allow list.
- New problem: Encountering an "o is not iterable" problem since the files are encoded.
```js
  C.useEffect( () => (e.on("last_100_messages", o => {
        n(l => [...o, ...l])
    }
```
- Another new problem: "ERR_CONNECTION_REFUSED" for the initial socket connection on port 4000.
  - Trying to add port inbound rules to see if it works ==> Nope.
  - Maybe needs an additional reverse proxy for socket.io
    - Yep. This is half of the solution. Traffic, of course, needs to go reach our websocket tech that we're using. 
    - Servers are typically reachable at a separate domain or at a specific end-point on the domain and this is the axiom that we work off of in trying to make sense of Socket.IO.
- As described in the [Socket.IO documentation for Reverse Proxying](https://socket.io/docs/v4/reverse-proxy/), there are examples of how to set up the `Nginx` config file. For this specific setup, we're only interested in forwarding the Socket.IO request and letting the `try_files` statement do all the heavy lifting for the client content.
```
  server {
    listen 80;
    root /var/www/html;

    location /socket.io/ {
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header Host $host;

      proxy_pass http://localhost:3000; # Replace this with port number with the one that the server is listening to. For Chat Less, it's 4000. 

      proxy_http_version 1.1;
      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";
    }
  }
```
- The second half of the solution is the connection statement from the client side: `const socket = io.connect('http://localhost:4000');`
- This worked fine in development since both the client and the server were both on the same machine. But of course, the client is well, any machine other than the server machine so localhost is a no-go. It's so obvious and yet I did not realise it until my colleagues pointed it out.
- So what goes there instead? Reading the [Socket.IO documentation for troubleshooting](https://socket.io/docs/v4/troubleshooting-connection-issues/) - for the server-side behaviour to work, the Socket.IO server must be reachable. This can be tested with `curl "<the server URL>/socket.io/?EIO=4&transport=polling"` which returns something like `0{"sid":"Lbo5JLzTotvW3g2LAAAA","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000}`
- Taking this into account, we can make an educated guess for our connect statement and use `const socket = io.connect('https://chat.tenkiame.org');` - and it works!
- Or does it? I think this socket connection is failing because the other problem (`"o is not iterable" `) seems to be happening because the messages aren't being retrieved. But the it works in dev when I change the connection destination back to localhost:4000.
  - However, we can observe that the event is firing (since the console seems to be logging a null value) and therefore there the socket connection is working as intended. So is it a matter of the connection to the database?
- This should've been done a while ago, but we're employing Winston now to log things on the server-side.
- There are a couple of reasons this could be failing:
  1. Invalid authentication e.g. Incorrect credentials, no credentials, etc. 
  2. Connection permissions to the database.
- The logger is great for number 1, though it's a little strenous having to pore through and see where and what the logger is writing.
- Number 2 can be very quick to investigate. In fact, in this case it was the exact issue. The network settings needed to be adjusted to allow all IPs. All it needed was a couple of clicks after logging in to the dashboard.
- [16/01/2025] - Socket.io 502 Error (Bad Gateway) encountered on using the app. 
  - Checked pm2 to see that the app wasn't running therefore logged into VM, moved to `chat-less\server` directory and reran `pm2 start index.jsx --name chat-less-backend` to get it started. App was working immediately without a need for refresh.
- Turns out I accidentally made some commits on a detached head. 
  - Fortunately, this can be rescued by using `git reflog` to find the hash ID of the latest commit that I had made.
  - Then by using `git checkout -b my-new-branch abc123` or `git branch my-new-branch abc123` (where `abc123` is the hash ID), I created a new branch which I could merge into my master branch.

### Deploying on Docker
- Serving up `client/dist` folder and using a container to run the server works seamlessly. The container perfectly replicates the pm2 process.
- By running both containers, a reverse proxy connection is made to the client container which also uses a web server. It's quite simple, in that it listens to only port open (80) and then serves up the client app files sitting in the nginx folder.
```nginx
server{
    listen 80;
    root /usr/share/nginx/html;
    etag on;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```
- Meanwhile the main server block on the VM is the following:
```nginx
server {
#    if ($host = chat.tenkiame.org) {
 #       return 301 https://$host$request_uri;
  #  } # managed by Certbot

	root /var/www/chat-less/client/dist;

	# Add index.php to the list if you are using PHP
	index index.html index.htm index.nginx-debian.html;

	server_name chat.tenkiame.org; # managed by Certbot;

	location / {
		# First attempt to serve request as file, then
		# as directory, then fall back to displaying a 404.
		proxy_pass			http://localhost:5173;
		proxy_http_version	1.1;
		proxy_set_header	Upgrade $http_upgrade;
		proxy_set_header	Connection keep-alive;
		proxy_set_header	Host $host;
		proxy_cache_bypass	$http_upgrade;
		proxy_set_header	X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header	X-Forwarded-Proto $scheme;
	}

	#Socket.IO requests
	location /socket.io/ {
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
	
		proxy_pass http://localhost:4000;

		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}


    listen [::]:443 ssl; # managed by Certbot
    listen 443 ssl; # managed by Certbot
    ssl_certificate /etc/letsencrypt/live/chat.tenkiame.org/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/chat.tenkiame.org/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
```
- This sets up a reverse proxy to forward traffic to the client container.
- It's supposed to forward traffic using the `/socket.io/` endpoint to the server container but that doesn't seem to be working. 
  - "ERR_CONNECTION_REFUSED" for the initial socket connection on port 4000 is occurring again.
  - the Socket.IO server is confirmed reachable since `curl "<the server URL>/socket.io/?EIO=4&transport=polling"` returns the appropriate result and curling port 4000 returns the correct pageless page.
- Perhaps the `location /socket.io/` needs to be in the client container's `nginx.conf file`?
  - No, that doesn't work.
- Turns out the problem and solution are exactly the same, the actual culprit was Docker ignoring the `npm run build` command during the image build.
- Now that the appropriate version of the app is in place, a new problem has occurred: Error 404 for the requesting `https://chat.tenkiame.org/socket.io/?EIO=4&transport=polling`
  - The culprit was a second server block that I had active as an attempt to solve the previous problem. So I had two location blocks for `location /socket.io/ {}` conflicting for incoming traffic. As anticipated from the beginning, only one server block (virtual host) is needed.
- Now to resolve the issue of Docker ignoring the nodejs (vite) build command.