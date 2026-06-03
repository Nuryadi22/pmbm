const express = require('express');
const { connectDB, sequelize } = require('./config/db');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
connectDB();

// Sync Database (Create tables if they don't exist)
sequelize.sync({ alter: true }) // use 'alter: true' to update tables if schema changes
  .then(() => console.log('Database synced'))
  .catch(err => console.error('Database sync error:', err));

const path = require('path');

// Routes
const pendaftaranRoutes = require('./routes/pendaftaran');
const adminRoutes = require('./routes/admin');
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/admin', adminRoutes);

// Serve Static Files in Production
if (process.env.NODE_ENV === 'production') {
  const distPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(distPath, 'index.html'));
    }
  });
} else {
  // Basic route for development
  app.get('/', (req, res) => {
    res.send('PPDB MI Cikembulan API is running');
  });
}

// Start server
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

module.exports = app;
