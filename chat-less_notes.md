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
  - Axios is for making API requests
  - CORS is Cross-Origin Resource Sharing - allowing for HTTP requests to be made from one website to another in the browser. This is required for Socket.IO. This can be implemented securely by using a whitelist using the `Access-Control-Allow-Origin` request header.
  - Express is a convenient NodeJS framework for doing back-end (in contrast to using React for front-end. Although we're using React routing for this one). We want Express to make use of middleware.
  - Dotenv is for loading environment variables (e.g. Secrets!)
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
### Importing Syntax
- Default exports are imported without braces.
- Named exports are imported with braces.
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

# MongoDB
- Connecting to it:
```js

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://rigidseine:<password>@chat-less-1.mvqvxkp.mongodb.net/?retryWrites=true&w=majority&appName=chat-less-1";

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