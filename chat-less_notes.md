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
- Annnnd all the node.js dependencies within both the `client` folder and the `server` folder.
  - I accidentally moved all the node_modules into the VM as well but there's likely compatibility issues between Windows binaries and the Linux environment.
  - So I ran `rm -rf node_modules` and just removed them all before running `npm install` which works off the `package_lock.json` file.
- That's the files done (?), so next I created an A record for `chat.tenkiame.org` pointing to the VM's IP address.
- Then I created a new virtual server in the nginx config file mirroring Tenkiame's port 80 setup (Certbot commands need to be run later for the new subdomain).

## Running the app
- So far, everything's been running in dev but it turns out it doesn't quite work the same for production.
- Fortunately, on the client-side there is a script already defined in the `package.json` file for production called `build`. It follows this can (and was) run by using the command: `npm run build`.
- However, there is no such thing defined for the Express back-end. So hunting around has led to two things: 
  - [Installing PM2 to daemonize the app](https://deploybot.com/blog/guest-post-how-to-set-up-and-deploy-nodejs-express-application-for-production)
  - And [setting the `NODE_ENV` variable to `production`.](https://stackoverflow.com/questions/9198310/how-to-set-node-env-to-production-development-in-os-x)