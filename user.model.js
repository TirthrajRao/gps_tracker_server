const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String },
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    mobile: { type: String, default: null }
});

module.exports = mongoose.model('users', userSchema);