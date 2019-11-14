const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const locationModel = require('./location.model');

mongoose.connect('mongodb://localhost:27017/myLocationApp', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Database connected');
    }).catch((err) => {
        console.log(err)
    });

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())



function resetAtMidnight() {
    var now = new Date();
    var night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // the next day, ...
        0, 0, 0 // ...at 00:00:00 hours
    );
    var msToMidnight = night.getTime() - now.getTime();

    setTimeout(function () {
        reset();              //      <-- This is the function being called at midnight.
        resetAtMidnight();    //      Then, reset again next midnight.
    }, msToMidnight);
}

function reset() {

    var dt = new Date();
dt.setDate(d.getDate() - 2);

    //GetDevice by Id get api

        locationModel.findOneAndRemove({ date: getFormattedDate(dt),time: getFormattedTime(dt) }, (err, location) => {
            if (err) {
                return res.status(500).send("Internal server error")
            } else if (device) {
                return res.send(device)
            } else {
                return res.status(404).send("No user found")
            }
        });
    
}


// app.post('/api/sendLocation', (req, res) => {

//     console.log(req.query);
//     console.log({ time: "no time", lat: req.query.lat, long: req.query.lng });
//     const newLocation = new locationModel({ time: "no time", lat: req.query.lat, long: req.query.lng });
//     console.log(newLocation);

//     locationModel.remove((err, location) => {
//         console.log(err);
//         if (err) {
//             return res.status(500).send("Internal server error")
//         }
//         newLocation.save((err, location) => {
//             if (err) {
//                 return res.status(500).send('Internal server error');
//             }
//             console.log(location);
//             return res.status(200).send({
//                 message: 'New location added',
//                 data: location
//             });
//         });
//     });
// });



app.post('/api/time', (req, res) => {

    // var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    // indiaTime = new Date(indiaTime);
    // console.log('India time: ' + indiaTime.toLocaleString())

    // console.log(indiaTime.getDate() + 20)
    // res.send(getFormattedDate(indiaTime));

//     var d = new Date();
// d.setDate(d.getDate() - 2);

// res.send(getFormattedDate(d));

});



app.post('/api/sendLocation', (req, res) => {

    console.log(req.query);

    var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    indiaTime = new Date(indiaTime);
    console.log(getFormattedTime(indiaTime))


    console.log({ time: indiaTime, Date: indiaTime, lat: req.query.lat, long: req.query.lng });
    const newLocation = new locationModel({ time: getFormattedTime(indiaTime), date: getFormattedDate(indiaTime), lat: req.query.lat, long: req.query.lng });
    console.log(newLocation);

    newLocation.save((err, location) => {
        if (err) {
            return res.status(500).send('Internal server error');
        }
        console.log(location);
        return res.status(200).send({
            message: 'New location added',
            data: location
        });
    });
});




app.get('/api/getLocation', function (req, res) {

    const datetime = new locationModel(req.body);

    console.log(req.query.date);

    locationModel.find({ date: req.query.date }).exec((err, location) => {
        if (err) {
            return res.status(500).send("Internal server error")
        } else if (location) {
            res.send(location)
            console.log(location)
            console.log("===============================================================================================")
        } else {
            return res.status(404).send("No record found")
        }
    });
});


function getFormattedDate(today) {
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) { dd = '0' + dd }
    if (mm < 10) { mm = '0' + mm }

    return dd + '-' + mm + '-' + yyyy;
}

function getFormattedTime(today) {
    var hour = today.getHours();
    var minu = today.getMinutes();

    if (minu < 10) { minu = '0' + minu }

    return hour + ':' + minu;
}


const server = http.createServer(app)
server.listen(4001, () => {
    console.log('server started on port 4001 to show changes using nodemon');
});
