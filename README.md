# chat-less

- [chat-less](#chat-less)
  - [Prerequisites](#prerequisites)
  - [Deployment Instructions](#deployment-instructions)

## Prerequisites
Before deploying the application, ensure the following are installed:

1. **Node.js and npm**\
Download and install from [Node.js official site](https://nodejs.org/en/download/package-manager). npm is included with Node.js.\
Verify installation in your command line/powershell/bash terminal, etc. Or don't, I'm not a cop:

```bash
node -v
npm -v
```

2. **Git**\
Download and install from [Git official site](https://git-scm.com/downloads).\
Verify installation in your command line/powershell/bash terminal, etc. Again, not a cop:
```bash
git --version
```

3. **MongoDB**\
Create a free MongoDB cluster at MongoDB Atlas or set up MongoDB locally by downloading it from MongoDB Downloads.\
Ensure you have connection credentials ready (username, password, and cluster URL). For MongoDB Atlas, refer to their Getting Started Guide.

## Deployment Instructions

1. **Create the Database and Collection**
  - Create a database called `YAP_LESS`.
  - Create a collection within the database called `YPL_MESSAGE`.
  - Alternatively, you can name them whatever you want and you can just update the names in the files prefixed with `mongodb-`. Or you can keep this simple with my repo, up to you. No, no, go on, make your own names. I won't judge. I'm just a file.

1. **Clone the Repository**\
Open your terminal and run:
Alternatively, just use github's GUI to clone the repo. There's a big green `<> Code` button on this page you can click.
I do recommend opening the chat-less folder in your terminal though.
```bash
git clone https://github.com/RigidSeine/chat-less.git
cd chat-less
```

2. **Setup the Server**

  - Navigate to the server folder:

  ```bash
  cd server
  ```

  - Install dependencies (very important!!):

```bash
npm install
```
  - Create a `.env` file for environment variables. This is where your MongoDB credentials go so that you can read and write your database.\
  NEVER SHARE THIS FILE ANYWHERE.\
  How to create file? Open a text file in a text editor (not Microsoft Word, try VS Code or a lightweight text editor that doesn't have an LLM baked into it like Windows notepad... wait a minute.)\
  \
  Here's what you put into the file:
```
MDB_USERNAME=<your_username>
MDB_PW=<your_password>
MDB_CLUSTER_NAME=<your_cluster>
```

3. **Setup the Client**
  - Open a **new terminal (important!)** and navigate to the client folder:
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

4. **Access the Application**
  - Open http://localhost:5173 in your browser.
  - Type away.

5. **Delete System32**
  - I'm kidding. Don't actually do that.
