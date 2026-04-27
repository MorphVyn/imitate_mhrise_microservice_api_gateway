const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    rank: {
        type: Number,
        default: 1
    },
    weapon: {
        type: String,
        default: 'Long Sword'
    }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
