const express = require('express');
const { verifyToken } = require('../middleware/authMiddleware');
const Hunter = require('../models/Hunter');

const router = express.Router();

router.get('/', verifyToken, async (req, res) => {
    try {
        const hunters = await Hunter.find().populate('guild_id', 'name rank');
        res.json({ status: 'success', total: hunters.length, data: hunters });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
});

router.get('/:id', verifyToken, async (req, res) => {
    try {
        const hunter = await Hunter.findById(req.params.id).populate('guild_id', 'name rank');
        if (!hunter) return res.status(404).json({ status: 'error', message: 'Hunter not found.' });
        res.json({ status: 'success', data: hunter });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Invalid ID format or server error.', error: error.message });
    }
});

router.post('/', verifyToken, async (req, res) => {
    const { name, rank, weapon, guild_id, element, status } = req.body;

    if (!name || !weapon) {
        return res.status(400).json({ status: 'error', message: 'name and weapon are required.' });
    }

    try {
        const newHunter = new Hunter({
            name,
            weapon,                     
            rank:      rank    || 1,
            element:   element || 'None',
            status:    status  || 'Active',
            guild_id:  guild_id || null,
            joined_at: new Date()
        });

        await newHunter.save();
        res.status(201).json({ status: 'success', message: 'Hunter registered to the guild!', data: newHunter });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to register hunter.', error: error.message });
    }
});

router.put('/:id', verifyToken, async (req, res) => {
    try {
        const updated = await Hunter.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ status: 'error', message: 'Hunter not found.' });
        res.json({ status: 'success', message: 'Hunter record updated.', data: updated });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Failed to update hunter.', error: error.message });
    }
});

router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const removed = await Hunter.findByIdAndDelete(req.params.id);
        if (!removed) return res.status(404).json({ status: 'error', message: 'Hunter not found.' });
        res.json({ status: 'success', message: `Hunter ${removed.name} has left the guild.`, data: removed });
    } catch (error) {
        res.status(400).json({ status: 'error', message: 'Failed to remove hunter.', error: error.message });
    }
});

module.exports = router;
