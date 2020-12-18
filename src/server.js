const express = require("express")
const cors = require("cors")
const { join } = require("path")
const listEndpoints = require("express-list-endpoints")
const mongoose = require("mongoose")
var multer = require('multer')
// const jwt = require('jsonwebtoken');

const comicsRouter=require("./services/comics")
const usersRouter = require("./services/users")
const profilesRouter = require("./services/profiles")
// const authorsRouter = require("./services/authors")

const {
    notFoundHandler,
    badRequestHandler,
    genericErrorHandler,
  } = require("./errorHandlers")
  

const server = express()

// const older_token= jwt.sign({
//   data: {email:"password"}
// }, 'secret', { expiresIn: '1h' });

const port = process.env.PORT || 7000
const staticFolderPath = join(__dirname, ".../public")
server.use(express.static(staticFolderPath))
server.use(express.json())

server.use(cors())

server.use("/users", usersRouter)
server.use("/comics", comicsRouter)
server.use("/profiles", profilesRouter)

server.use(badRequestHandler)
server.use(notFoundHandler)
server.use(genericErrorHandler)

console.log(listEndpoints(server))

mongoose
  .connect(process.env.MONGOBD_URI || "mongodb://localhost:27017/Solocaps", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  mongoose.connection.on("connect",()=>{
    console.log("Mongoose is connected")
  })
  .then(
    server.listen(port, () => {
      console.log("Running on port", port)
    })
  )
  .catch((err) => console.log(err))