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



app.post('/api/sendLocation', (req, res) => {

    console.log(req.query);

    let date_ob = new Date();

    console.log(date_ob);

    console.log({ time: date_ob.Date,Date: date_ob ,lat: req.query.lat, long: req.query.lng });
    const newLocation = new locationModel({ time: getFormattedTime(date_ob), date: getFormattedDate(date_ob), lat: req.query.lat, long: req.query.lng });
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

    let date_ob = new Date();

    const datetime = new locationModel(req.body);

    console.log(date_ob);

    locationModel.find({ date: getFormattedDate(date_ob) }).exec((err, location) => {
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


function getFormattedDate(today) 
{
    var dd   = today.getDate();
    var mm   = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();
    
    if(dd<10)  { dd='0'+dd } 
    if(mm<10)  { mm='0'+mm } 
    
    return dd+'-'+mm+'-'+yyyy;
}

function getFormattedTime(today) 
{
    var hour = today.getHours();
    var minu = today.getMinutes();

    if(minu<10){ minu='0'+minu } 

    return hour+':'+minu;
}


const server = http.createServer(app)
server.listen(4001, () => {
    console.log('server started on port 4001 to show changes using nodemon');
});
