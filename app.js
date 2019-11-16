const http = require('http');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const locationModel = require('./location.model');
const userModel = require('./user.model');
const CronJob = require('cron').CronJob;

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

new CronJob('00 00 00 * * *', function () {
    console.log('You will see this message every MidNight');
    reset();
}, null, true, 'Asia/Kolkata');

function reset() {
    var dt = new Date();
    dt.setDate(dt.getDate() - 1);

    locationModel.remove({ date: getFormattedDate(dt) }, (err, location) => {
        if (err) {
            console.log("Internal server error");
        } else {
            console.log(location);
        }
    });
}


//Add User

app.post('/api/addUser', (req, res, next) => {
    console.log(req.body);
    const newUser = new userModel(req.body);
    newUser.save((err, user) => {
        if (err) {
            res.status(500).send('Internal server error');
        } else {
            console.log(user);
            res.status(201).json({
                message: 'New user created',
                data: user
            });
        }
    });
})


//Login Api

app.post('/api/login', (req, res, next) => {

    const newUser = new userModel(req.body);

    console.log("Email for login :::::::::::::::::::::::::: ", newUser.username);

    userModel.find({ username: newUser.username }).exec((err, User) => {
        if (err) {
            console.log("Error  :::::::::::::::::::::::::: ", err);
            return res.status(500).send("Internal server error")
        } else if (User) {
            console.log("login Success  :::::::::::::::::::::::::: ", User);
            if (User.length != 0) {
                res.status(201).json({
                    message: 'Login Success',
                    status: 201,
                    data: User
                });
            }
            else {
                res.status(203).json({
                    message: 'No user found',
                    status: 203
                });
            }
        } else {
            return res.status(404).send("No user found")
        }
    });
})



app.post('/api/time', (req, res) => {

    var indiaTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
    indiaTime = new Date(indiaTime);
    console.log('India time: ' + indiaTime.toLocaleString())

    console.log(indiaTime.getDate() + 20)
    res.send(moment().subtract('days', 2));

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