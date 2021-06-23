const express = require("express");
const router = new express.Router();
const Student = require("../models/students")

router.post("/students", async (req, res) => {
    try {
 
         const user = new Student(req.body);
         const createUser = await user.save()
         res.status(201).send(createUser)
         console.log(user);
         
    } catch (err) {
        res.status(400).send(err);
     }
     
 })
 
 // read all students data by it's id
 
 router.get("/students", async (req, res) => {
    try {
 
         const studentsData = await Student.find();
         res.status(201).send(studentsData)
         
    } catch (err) {
        res.status(400).send(err);
     }
     
 })
 
 // read single student data by it's id
 
 router.get("/students/:id", async (req, res) => {
    try {
        const _id=req.params.id
         
        const studentData = await Student.findById({_id:_id})
        if (!studentData) {
            res.send("Page not found").status(404)
        } else {
            res.send(studentData)
        }
         
    } catch (err) {
        res.status(400).send(err);
     }
     
 })
 
 // update the students by it's id 
 
 router.patch("/students/:id", async (req, res) => {
     try {
         const _id = req.params.id;
         const updateStudents = await Student.findByIdAndUpdate(_id, req.body, {
             new:true
         })
         res.send(updateStudents);
     } catch(e){
         res.status(404).send(e);
     }
 })
 
 // delete the students by it's id 
 
 router.delete("/students/:id", async (req, res) => {
     try {
         const _id = req.params.id;
         const deleteStudent = await Student.findByIdAndDelete(_id)
         if (!deleteStudent) {
             res.send("Opps!..not found").status(404)
         } else {
             res.send(deleteStudent);
         }
     } catch(e){
         res.status(404).send(e);
     }
 })
 

module.exports = router;