const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchem = new Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    createAt: {
        type: Date,
        default: Date.now
    }
})
module.exports = mongoose.model('users', UserSchem)