//import express
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const http = require('http');

app.use(bodyParser.urlencoded({
    extended: true
}));

//connect to mongoDB
mongoose.connect('mongodb://localhost:27017/PoletnaSola', {
    useNewUrlParser: true
});

const schema = new mongoose.Schema({
    person: Object,
    insuranceType: String,
    validFrom: Date,
    validTo: Date,
    vehicleRegistration: String,
    vehicleType: String,
    vehiclePassed: Number,
    numberOfSpeedingTickets: Number,
    numberOfDrunkDrivingTickets: Number,
})
const Insurance = mongoose.model('Insurance', schema)

app.get("/", (req, res) => {
    res.send("Hello World");
})
app.get("/insurances", (req, res) => {
    Insurance.find({}, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.post("/insurances", (req, res) => {
    // fetch("http://localhost:5000/person/" + req.body.person_id).then(response => response.json()).then(data => {
    // res.send(data);
    // })
    var request = http.request({
        host: 'localhost',
        port: 5000,
        path: '/person/' + req.body.person_id,
        method: 'GET',
        headers: {
            // headers such as "Cookie" can be extracted from req object and sent to /test
        }
    }, function (response) {
        var data = '';
        response.setEncoding('utf8');
        response.on('data', (chunk) => {
            data += chunk;
            const insurance = new Insurance({
                person: JSON.parse(data),
                insuranceType: req.body.insuranceType,
                validFrom: req.body.validFrom,
                validTo: req.body.validTo,
                vehicleRegistration: req.body.vehicleRegistration,
                vehicleType: req.body.vehicleType,
                vehiclePassed: req.body.vehiclePassed,
                numberOfSpeedingTickets: req.body.numberOfSpeedingTickets,
                numberOfDrunkDrivingTickets: req.body.numberOfDrunkDrivingTickets,
            });
            insurance.save((err, data) => {
                if (err) {
                    res.send(err);
                    return
                } else {
                    res.send(data);
                    return
                }
            })
        });
        // response.on('end', () => {
        //     res.end('check result: ' + data);
        // });
    });
    request.end();
    return;
})
app.put("/insurances/:id", (req, res) => {
    const id = req.params.id;
    const insurance = new Insurance({
        person_id: req.body.person_id,
        insuranceType: req.body.insuranceType,
        validFrom: req.body.validFrom,
        validTo: req.body.validTo,
        vehicleRegistration: req.body.vehicleRegistration,
        vehicleType: req.body.vehicleType,
        vehiclePassed: req.body.vehiclePassed,
        numberOfSpeedingTickets: req.body.numberOfSpeedingTickets,
        numberOfDrungDrivingTickets: req.body.numberOfDrungDrivingTickets,
    });
    Insurance.findByIdAndUpdate(id, insurance, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.delete("/insurances/:id", (req, res) => {
    const id = req.params.id;
    Insurance.findByIdAndDelete(id, (err, data) => {
        if (err) {
            res.send(err);
        } else {
            res.send(data);
        }
    })
})
app.listen(5001, () => {
    console.log("Server is running on port 5001");
})