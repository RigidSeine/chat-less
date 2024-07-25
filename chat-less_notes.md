# Installation
- Installed Node.js via .msi file.
- Tried running `npx create-react-app client` only to get an error:
`ENOENT: no such file or directory, lstat 'C:\Users\User\AppData\Roaming\npm'`
- Resolved by creating the npm folder in the directory. https://docs.npmjs.com/common-errors#error-enoent-stat-cusersuserappdataroamingnpm-on-windows-7 also has a common errors for npm.
- Upon installing create-react-app, `npm audit` warns of vulnerabilities immediately. It is known that `npm audit` creates a lot of false positives. https://overreacted.io/npm-audit-broken-by-design/
- Because `npm audit` was run, that broke some dependencies.
- Installed `vite` instead using `npm create vite@latest client -- --template react` which allows for cleaning of the destination folder to install new fresh dependencies and files.
- Ran `npm i react-router-dom socket.io-client` to install two packages: 
  - `react-router-dom` is the library for routing in React. It allows the navigation and rendering of diferent components depending on the URL. You get to route to different Views essentially.
  - `socket.io-client` is the client-side library for Socket.IO. Socket.IO is the crux of this app, allowing for real-time event-based communication between the client (browser) and the server. Used in place of standard HTTP requests.
- HarperDB no longer has a free tier. And its lowest tier is hella expensive. So pivoting to MongoDB (Atlas) and trying out NoSQL - which requires getting an account on MongoDB and running `npm install mongodb` (since we're using Node.js).
- New directory created in `src`: `pages\home` along with two files `index.js` and `styles.module.css`.
- `styles.module.css` is a CSS module which allows for local scopes for CSS. In other words, this allows for different CSS namespaces. So you can define a button class in two different CSS modules (e.g. `styles1.module.css` and `styles2.module.css`) and use either one by using `${styles1.button}` or `${styles2.button}`.
- An `index.js` file in the `./pages/home` directory creates the Home module and is exported for use in the `App.jsx` file.
- The `App.jsx` is where the routing is defined by importing `react-router-dom` module.
- Tried running the app and encountered an error saying that my `.pages/home/index.js` was using invalid `.jsx` syntax. And that was because the file extension was incorrect!

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