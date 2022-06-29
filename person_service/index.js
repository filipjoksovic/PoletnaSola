//import express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({
    extended: true
}));

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/PoletnaSola', {
    useNewUrlParser: true
});
const schema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: String,
    isMarried: Boolean,
    dateOfBirth: Date,
    numberOfChildren: Number,
})
const Person = mongoose.model('Person', schema)

app.get("/", (req, res) => {
    res.send("Hello World");
})
app.get("/persons", (req, res) => {
    //get all persons from DB
    Person.find({}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.get("/person/:id", (req, res) => {
    //get person by id from DB
    Person.findById(req.params.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.post("/person/:id", (req, res) => {
    //update person by id from DB
    Person.findByIdAndUpdate(req.params.id, req.body, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.post("/person", (req, res) => {
    //create new person in DB
    const person = new Person({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        isMarried: req.body.isMarried,
        dateOfBirth: req.body.age,
        numberOfChildren: req.body.numberOfChildren,
    })
    person.save()
        .then(() => {
            res.send("Person created")
        }).catch(err => {
            res.send(err)
        })
})
app.delete("/person/:id", (req, res) => {
    //delete person from DB
    Person.findByIdAndDelete(req.params.id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})
