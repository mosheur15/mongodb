const mongoose = require("mongoose")
const validator = require("validator")

const sturdentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: [true, "Email id already exist"],
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email")
            }
        }
    },
    phone: {
        type: String,
        required: true,
        unique:true
    },
    address: {
        type: String,
        required: true
    }
})

// we will create a new collection 
const Student = new mongoose.model("Student", sturdentSchema)

module.exports=Student