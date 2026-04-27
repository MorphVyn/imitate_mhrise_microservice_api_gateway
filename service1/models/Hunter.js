const mongoose = require('mongoose');

const hunterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    weapon: {
        type: String,
        enum: [
            'Great Sword', 'Long Sword', 'Sword and Shield', 'Dual Blades',
            'Hammer', 'Hunting Horn', 'Lance', 'Gunlance',
            'Switch Axe', 'Charge Blade', 'Insect Glaive',
            'Light Bowgun', 'Heavy Bowgun', 'Bow'
        ],
        required: true
    },
    rank: {
        type: Number,
        default: 1,
        min: 1
    },
    element: {
        type: String,
        default: 'None'
    },
    status: {
        type: String,
        enum: ['Active', 'Training', 'Retired', 'Inactive'],
        default: 'Active'
    },
    guild_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Guild',
        default: null
    },
    joined_at: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });

module.exports = mongoose.model('Hunter', hunterSchema);
