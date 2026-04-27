const express = require('express');
const cors    = require('cors');
require('dotenv').config();

const connectDB = require('./config/db');

const { seedAll } = require('./seed/seed');

const app  = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth',    require('./routes/auth'));
app.use('/api/hunters', require('./routes/hunters'));
app.use('/api/guilds',  require('./routes/guilds'));

app.get('/health', (_req, res) => res.json({
  status:    'online',
  service:   'Guild Service',
  port:      PORT,
  timestamp: new Date().toISOString()
}));

app.use((req, res) => res.status(404).json({
  status:  'error',
  message: `Route ${req.method} ${req.path} not found.`
}));

const startServer = async () => {
  try {
    await connectDB();
    console.log('\nSeeding Guild data...');
    await seedAll();

    app.listen(PORT, () => {
      console.log(`\nGuild Service running on http://localhost:${PORT}`);
      console.log('   Routes: /api/auth | /api/hunters | /api/guilds\n');
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error);
  }
};
startServer();