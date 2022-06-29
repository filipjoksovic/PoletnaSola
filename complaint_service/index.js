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
    insurance: Object,
    dateFiled: Date,
    dateOccured: Date,
    state: String,
    comment: String
})
const Complaint = mongoose.model('Complaint', schema)

app.get("/", (req, res) => {
    res.send("Hello World");
})
app.get("/complaints", (req, res) => {
    Complaint.find({}, (err, complaints) => {
        if (err) {
            console.log(err);
        } else {
            res.send(complaints);
        }
    })
})
app.post("/complaints", (req, res) => {
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
            const person = JSON.parse(data);
            var request = http.request({
                host: 'localhost',
                port: 5001,
                path: '/insurances/' + person._id,
                method: 'GET',
                headers: {
                    // headers such as "Cookie" can be extracted from req object and sent to /test
                }
            }, function (response) {
                var data = '';
                response.setEncoding('utf8');
                response.on('data', (chunk) => {
                    data += chunk;
                    const insurance = JSON.parse(data);
                    const complaint = new Complaint({
                        person: person,
                        insurance: insurance,
                        dateFiled: new Date(),
                        dateOccured: req.body.dateOccured,
                        state: req.body.state,
                        comment: req.body.comment
                    })
                    complaint.save((err, complaint) => {
                        if (err) {
                            console.log(err);
                        } else {
                            res.send(complaint);
                        }
                    }
                    )

                });
            });
            request.end();
          
        });
    });
    res.send("Complaint saved");
})
app.listen(5000, () => {
    console.log("Server is running on port 5000");
})