const mongoose = require('mongoose');

const guildSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    rank: {
        type: String,
        enum: ['S', 'A', 'B', 'C'],
        default: 'B'
    },
    leader: {
        type: String,
        required: true,
        trim: true
    },
    member_count: {
        type: Number,
        default: 1,
        min: 1
    },
    specialty: {
        type: String,
        default: 'General'
    },
    description: {
        type: String,
        default: 'A gathering of mighty hunters.'
    },
    founded: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive', 'Disbanded'],
        default: 'Active'
    }
}, { timestamps: true });

module.exports = mongoose.model('Guild', guildSchema);
