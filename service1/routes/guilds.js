const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const Guild   = require('../models/Guild');
const Hunter  = require('../models/Hunter');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const guilds = await Guild.find();
        res.json({ status: 'success', total: guilds.length, data: guilds });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const guild = await Guild.findById(req.params.id);
        if (!guild) return res.status(404).json({ status: 'error', message: 'Guild not found.' });

        const members = await Hunter.find({ guild_id: guild._id });
        res.json({ status: 'success', data: { ...guild.toObject(), members } });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Invalid Guild ID or server error.', error: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name, rank, leader, specialty, description } = req.body;
    if (!name || !leader) {
        return res.status(400).json({ status: 'error', message: 'name and leader are required.' });
    }

    try {
        const newGuild = new Guild({
            name,
            rank:        rank        || 'B',
            leader,
            specialty:   specialty   || 'General',
            description: description || 'A gathering of mighty hunters.',
            member_count: 1,
            founded:     new Date(),
            status:      'Active'
        });
        await newGuild.save();
        res.status(201).json({ status: 'success', message: 'New guild established!', data: newGuild });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create guild.', error: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Guild.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ status: 'error', message: 'Guild not found.' });
        res.json({ status: 'success', message: 'Guild updated.', data: updated });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Failed to update guild.', error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const removed = await Guild.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ status: 'error', message: 'Guild not found.' });
        res.json({ status: 'success', message: `Guild "${removed.name}" disbanded.`, data: removed });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Failed to disband guild.', error: error.message });
    }
});

module.exports = router;
