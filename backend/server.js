const dotenv = require("dotenv")
dotenv.config({path: `${__dirname}/.env`})

process.on('uncaughtException', (error) => {
    console.log(`SYNTAX ERROR`);
    console.log(`${error.name} => ${error.message}`);
    process.exit(1)
})

const connect_url = process.env.MONGO_URL.replace('<PASSWORD>', process.env.MONGO_PASS)

const mongoose = require("mongoose");
mongoose.connect(connect_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
}).then(() => {
    console.log("DBC Cloud Database is connected")
})

const app = require("./app")
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`Server is Running on http://127.0.0.1:${port}/`);
})

process.on('unhandledRejection', (error) => {
    console.log("UNHANDLED REJECTION (RUNTIME ERROR) 💥");
    console.log(`${error.name} => ${error.message}`);
})


