const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const locationSchema = new Schema({
    lat: { type: String },
    long: { type: String },
    date: {type:String},
    time: {type:String}
});

module.exports = mongoose.model('locations', locationSchema);