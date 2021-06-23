const mongoose = require("mongoose")
const paginate = require('mongoose-paginate-v2')

// info: databse Schema
const StudentSchema = new mongoose.Schema({
    name    : { type: String, required: true, minlength: 3 },
    email   : { type: String, required: true },
    phone   : { type: String, required: true },
    address : { type: String, required: true }
})

// info: add pagination plugin
StudentSchema.plugin(paginate)

// we will create a new collection
// info: export the databse model.
module.exports = new mongoose.model("Student", StudentSchema)

// imporved: this line is not required.
//module.exports=Student