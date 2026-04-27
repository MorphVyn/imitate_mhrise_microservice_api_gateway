const express  = require('express');
const bcrypt   = require('bcryptjs');
const jwt      = require('jsonwebtoken');
const User     = require('../models/User');
const { verifyToken } = require('../middleware/authMiddleware');
require('dotenv').config();

const router = express.Router();
const JWT_SECRET     = process.env.JWT_SECRET     || '2410511070';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: 'error',
            message: 'Username and password are required.'
        });
    }

    try {
        const hunter = await User.findOne({ username: username.toLowerCase() });

        if (!hunter) {
            return res.status(401).json({
                status: 'error',
                message: 'Hunter not found. Check your username.'
            });
        }

        const valid = await bcrypt.compare(password, hunter.password);
        if (!valid) {
            return res.status(401).json({
                status: 'error',
                message: 'Incorrect password. Access denied.'
            });
        }

        const payload = {
            id:       hunter._id,
            username: hunter.username,
            name:     hunter.name,   
            rank:     hunter.rank    
        };

        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

        res.json({
            status:  'success',
            message: `Welcome back, ${hunter.name}! Your hunter license is active.`,
            token,
            hunter: {
                id:     hunter._id,
                name:   hunter.name,    
                rank:   hunter.rank,    
                weapon: hunter.weapon   
            }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
});

router.post('/logout', verifyToken, (req, res) => {
    res.json({
        status:  'success',
        message: `Farewell, ${req.hunter.name}! Your session has ended. Hunt well!`
    });
});

router.get('/me', verifyToken, async (req, res) => {
    try {
        const hunter = await User.findById(req.hunter.id).select('-password');
        if (!hunter) {
            return res.status(404).json({ status: 'error', message: 'Hunter not found.' });
        }
        res.json({ status: 'success', data: hunter });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Server error', error: error.message });
    }
});

module.exports = router;
