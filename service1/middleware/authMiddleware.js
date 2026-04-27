const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || '2410511070';

const verifyToken = (req, res, next) => {
    if (req.headers['x-hunter-id']) {
        req.hunter = {
            id:   req.headers['x-hunter-id'],
            name: req.headers['x-hunter-name'],
            rank: req.headers['x-hunter-rank'],
        };
        return next();
    }

    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            status: 'error',
            message: 'Access denied. No hunter license (token) provided.',
            code: 'NO_TOKEN'
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.hunter = decoded;
        next();
    } catch (err) {
        const msg = err.name === 'TokenExpiredError'
            ? 'Hunter license expired. Please login again.'
            : 'Invalid hunter license.';
        return res.status(401).json({ status: 'error', message: msg });
    }
};

module.exports = { verifyToken };
