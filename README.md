# chat-less

- [chat-less](#chat-less)
  - [Prerequisites](#prerequisites)
  - [Deployment Instructions](#deployment-instructions)

## Prerequisites
Before deploying the application, ensure the following are installed:

## 1. **Node.js and npm**
You can download and install from [Node.js official site](https://nodejs.org/en/download/package-manager). `npm` is included with Node.js. Alternatively, you can install both `node` and `npm` with `apt` if you're installing `chat-less` on a Linux system:

```bash
sudo apt install nodejs
```

Verify installation in your command line/powershell/bash terminal, etc. Or don't, I'm not a cop:

```bash
node -v
npm -v
```

## 2. **Git**
Download and install from the [Git official site](https://git-scm.com/downloads).\
Verify installation in your command line/powershell/bash terminal, etc. Again, not a cop:
```bash
git --version
```

## 3. **MongoDB**
For the database, you can either create a free MongoDB cluster on [MongoDB Atlas](https://www.mongodb.com/products/platform/atlas-database), or you can install MongoDB locally. 

### Atlas

MongoDB Atlas lets you get up and running relatively quickly. Simply head over to [Atlas](https://www.mongodb.com/products/platform/atlas-database), create an account, and create your cluster. Select the free teir, and choose your desired cluster name and location. 

When prompted to choose a connection, select `Drivers` and ensure that your configuration has the following options:

- Driver: `Node.js`
- Version:`6.7 or later`

Leave this screen open until your cluster has finished provisioning. Once this process has completed, you'll be given your connection string (which will begin with `mongodb+srv://`). This will contain your database username, password, and cluster URL that you will need for your `.env` file. 

### Local

Installing MongoDB locally is easiest on a Linux system. Below are a couple of guides that can help you get it up and running. 

- [Digital Ocean - How To Install MongoDB on Ubuntu 20.04](https://www.digitalocean.com/community/tutorials/how-to-install-mongodb-on-ubuntu-20-04)
- [AskUbuntu - MongoDB depends on libssl1.1 but it is not installable](https://askubuntu.com/questions/1403619/mongodb-install-fails-on-ubuntu-22-04-depends-on-libssl1-1-but-it-is-not-insta)

Ensure you have connection credentials ready (username, password, and cluster URL)

## Deployment Instructions

### 1. **Create the Database and Collection**
  - Create a database called `YAP_LESS`.
  - Create a collection within the database called `YPL_MESSAGE`.
  - Alternatively, you can name them whatever you want and you can just update the names in the files prefixed with `mongodb-`. Or you can keep this simple with my repo, up to you. No, no, go on, make your own names. I won't judge. I'm just a file.

#### 1.1 **Atlas**

If you chose to use Atlas, you can use the web GUI to create your database and collection. 

#### 1.2 **Local**

If you chose to host the database locally, you can use these commands to create a new database and collection (assuming MongoDB is installed and running):

```bash
# connect to local mongodb
mongo

# create new database & collection
use YAP_LESS
db.createCollection("YPL_MESSAGE", {capped: false});
```

### 2. **Clone the `chat-less` Repository**
Open your terminal and run:
Alternatively, just use github's GUI to clone the repo. There's a big green `<> Code` button on this page you can click.
I do recommend opening the chat-less folder in your terminal though.
```bash
git clone https://github.com/RigidSeine/chat-less.git
cd chat-less
```

### 3. **Setup the Server**

  - Navigate to the `server` folder:

  ```bash
  cd server
  ```

  - Install dependencies (very important!!):

```bash
npm install
```
  - Create a `.env` file for environment variables. This is where your MongoDB credentials go so that you can read and write your database.\
  NEVER SHARE THIS FILE ANYWHERE.\
  How to create the file? Open a text file in a text editor (not Microsoft Word, try VS Code or a lightweight text editor that doesn't have an LLM baked into it like Windows notepad... wait a minute.)\
  \
  Here's what you put into the file:
```
MDB_USERNAME=<your_username>
MDB_PW=<your_password>
MDB_CLUSTER_NAME=<your_cluster>
```

### 4. **Setup the Client**
  - Open a **new terminal (important!)** and navigate to the `client` folder:
  ```bash
  cd ../client
  ```

  - Install the dependencies again:
  ```bash
  npm install
  ```

  - Start the development server:
  ```
  npm run dev
  ```

### 5. **Access the Application**
  - Open http://localhost:5173 in your browser.
  - Type away.

### 6. **Delete System32**
  - I'm kidding. Don't actually do that.
