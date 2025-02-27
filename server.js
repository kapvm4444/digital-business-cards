const dotenv = require("dotenv")
dotenv.config({path: `${__dirname}/.env`})

process.on('uncaughtException', (error) => {
    console.log(`SYNTAX ERROR`);
    console.log(`${error.name} => ${error.message}`);
    process.exit(1)
})

// const mongoose = require("mongoose");
// mongoose.connect("", {
//     useCreateIndex: true,
//     useNewUrlParser: true,
//     useFindAndModify: false,
//     useUnifiedTopology: true,
// }).then(() => {
//     console.log("DBC Cloud Database is connected")
// })

const app = require("./app")
const port = process.env.PORT || 3000
const server = app.listen(port, () => {
    console.log(`Server is Running on http://127.0.0.1:${port}/`);
})


