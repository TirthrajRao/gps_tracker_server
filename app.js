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



app.post('/api/data', (req, res, next) => {
    console.log(req.body);
    const newLocation = new locationModel(req.body);

    locationModel.remove((err, location) => {
        if (err) {
            return res.status(500).send("Internal server error")
        } else {
            newLocation.save((err, location) => {
                if (err) {
                    res.status(500).send('Internal server error');
                } else {
                    console.log(location);
                    res.status(201).json({
                        message: 'New location added',
                        data: location
                    });
                }
            });
        }
    });
})



app.post('/api/sendLocation', (req, res) => {

    console.log(req.query);
    console.log({ time: "no time", lat: req.query.lat, long: req.query.lng });
    const newLocation = new locationModel({ time: "no time", lat: req.query.lat, long: req.query.lng });
    console.log(newLocation);

    locationModel.remove((err, location) => {
        console.log(err);
        if (err) {
            return res.status(500).send("Internal server error")
        }
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



});




app.get('/api/getLocation', function (req, res) {



    locationModel.find((err, location) => {
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




const server = http.createServer(app)
server.listen(4000, () => {
    console.log('server started on port 4000 to show changes using nodemon');
});
