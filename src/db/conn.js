const mongoose = require("mongoose")

// info: use the could URI to connect with mongodb atlas
const USERNAME  = ''
const PASSWORD  = ''
const DBNAME    = ''
const CLOUD_URI = `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.u003y.mongodb.net/${DBNAME}?retryWrites=true&w=majority`
const LOCAL_URI = 'mongodb://localhost:27017/students-api'

mongoose.connect(LOCAL_URI, {
    useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true,
    useFindAndModify:false
}).then(() => {
    console.log("Connection is Successful");
}).catch((e) => {
    console.log("No connection");
})