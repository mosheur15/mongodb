const express   = require("express");
const router    = new express.Router();
const Student   = require("../models/students")
const joi       = require("joi")

// info: validation
const CreateSchema = new joi.object({
    name    : joi.string().min(3).required(),
    email   : joi.string().email().min(6).required(),
    phone   : joi.string().pattern(/^[0-9]+$/).required(),
    address : joi.string().required(),
})

const UpdateSchema = new joi.object({
    name    : joi.string().min(3),
    email   : joi.string().email().min(6),
    phone   : joi.string().pattern(/^[0-9]+$/),
    address : joi.string(),
})

const QuerySchema = new joi.object({
    page    : joi.string(),
    limit   : joi.string(),
})


// info: create a student
router.post("/students", async (req, res) => {
    try{
        // info: validate data
        let validation = CreateSchema.validate(req.body)
        if (validation.error){
            // info: if data is not valid send 400 bad request.
            res.status(400)
            return res.json({
                success: false,
                message: validation.error.details[0].message,
            })
        }
        let data = validation.value
        
        // info: check unique fields already exists or not.
        let email_exists = await Student.findOne({ email: data.email })
        if (email_exists){
            // info: send 400 bad request
            res.status(400)
            return res.json({
                success: false,
                message: 'Email already exists in the database.'
            })
        }
        
        let phone_exists = await Student.findOne({ phone: data.phone })
        if (phone_exists){
            // info: send 400 bad request
            res.status(400)
            return res.json({
                success: false,
                message: 'Phone number already exists in the database.'
            })
        }
        
        // info: create the student.
        let user = await Student.create(data)
        
        // info: send 201 created
        res.status(201)
        return res.json({
            success: true,
            payload: user,
        })
    }catch(err){
        console.log(err)
        res.status(500)
        return res.json({
            success: false,
            message: 'Internal server error!'
        })
    }
 })
 
 
 // info: read all the student. if student count is big like 10,000 it will be a
 // big problem to send all the data. so we can paginate the students. see models/student.js
 router.get("/students", async (req, res) => {
    try{
        // info: validate query
        let validation = QuerySchema.validate(req.query)
        
        // FAQ: how to pass query?
        // to pass a query you need to write the query in url.
        // example : 'http://localhost:800/student?page=1&limit=10'
        
        // page=1 and limit=10 are 2 query.
        // if you passed a single query do not put '&'.
        
        if (validation.error){
            // info: send 400 bad request
            res.status(400)
            return res.json({
                success: false,
                message: validation.error.details[0].message
            })
        }
        
        // info: get the students
        let { page, limit } = validation.value
        let users = await Student.paginate({}, {
            page    : (page || 1),  // 1 is default page if page not passed.
            limit   : (limit || 10) // 10 is default limit if limit not passed
        })
        
        // info: send 200 ok response
        res.status(200)
        return res.json({
            success: true,
            payload: users
        })
        
    }catch(err){
        console.log(err)
        res.status(500)
        return res.json({
            success: false,
            message: 'Internal server error!'
        })
    }
 })
 
 
// info: read a single student
router.get("/students/:id", async (req, res)=>{
    try{
        try{
            let { id } = req.params
            let user = await Student.findById(id)
            if (!user){
                // info: if student doesn't exists send 404 not found.
                res.status(404)
                return res.json({
                    success: false,
                    message: `'${id}' not found in the database.`
                })
            }
            
            // info: send 200 ok response
            res.status(200)
            return res.json({
                success: true,
                payload: user,
            })
        }catch(err){
            // info: catch mongoose invalid objectId error (CastError)
            if (err.name==='CastError'){
                // info: send 400 bad request error
                res.status(400)
                return res.json({
                    success: false,
                    message: 'Inavlid id.'
                })
            }
            
            // info: handle other errors from next catch block
            throw err
        }
    }catch(err){
        console.log(err)
        res.status(500)
        return res.json({
            success: false,
            message: 'Internal server error'
        })
    }
})
 

// info: update the students by it's id 
router.patch("/students/:id", async (req, res) => {
     try{
         // info: data validation
         let validation = UpdateSchema.validate(req.body)
         if (validation.error){
             // info: send 400 bad request error.
             res.status(400)
             return res.json({
                 success: false,
                 message: validation.error.details[0].message,
             })
         }
         
         // info: check student with given id exists or not.
         let { id } = req.params
         let data = validation.value
         try{
             let user = await Student.findById(id)
             if (!user){
                 // info: if user doesn't exists send 404 not found
                 res.status(404)
                 return res.json({
                     success: false,
                     message: `'${id}' not found.`
                 })
             }
             
             // info: update the student
             user = await Student.findByIdAndUpdate(id, data, {useFindAndModify: false, new: true})
             
             // info: send 200 ok response.
             res.status(200)
             return res.json({
                 success: true,
                 payload: user,
             })
         }catch(err){
             // info: handle mongoose invalid objectId error (CastError)
             if (err.name==='CastError'){
                 // info: send 400 bad request error,
                 res.status(400)
                 return res.json({
                     success: false,
                     message: 'Inavlid id.'
                 })
             }
             
             // info: handle other errors from next catch block
             throw err
         }
     }catch(err){
         console.log(err)
         res.status(500)
         return res.json({
             success: false,
             message: 'Internal server error'
         })
     }
 })
 
 
 // info: delete the students by it's id 
 router.delete("/students/:id", async (req, res) => {
     try {
         let { id } = req.params
         // info: check student with given id exists or not.
         try{
             let user = await Student.findById(id)
             if (!user){
                 // info: send 404 not found error
                 res.status(404)
                 return res.json({
                     success: false,
                     message: `'${id}' not found`,
                 })
             }
             
             // info: delete the Student.
             await Student.findByIdAndDelete(id)
             
             // info: return 200 ok response
             res.status(200)
             return res.json({
                 success: true
             })
         }catch(err){
             // info: handle mongoose invalid objectId error (CastError)
             if (err.name==='CastError'){
                // info: send 400 bad request error.
                res.status(400)
                return res.json({
                    success: false,
                    message: 'Invalid id.'
                })
             }
             
             // info: handle other errors from next catch block
             throw err
         }
     } catch(err){
         console.log(err)
         res.status(500)
         return res.json({
             success: false,
             message: 'Internal server error!'
         })
     }
 })
 

module.exports = router;