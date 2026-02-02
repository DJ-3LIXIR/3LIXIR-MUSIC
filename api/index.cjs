const express = require('express');
const cors = require('cors');
const path = require('path');

// Import your routes
const chatRoutes = require('../client/backend/routes/chat.routes');
const ticketRoutes = require('../client/backend/routes/ticket.routes');
const kbRoutes = require('../client/backend/routes/kb.routes');
const authRoutes = require('../client/backend/routes/auth.routes');

const app = express();

// Middleware
app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/chat', chatRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/kb', kbRoutes);
app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export for Vercel
module.exports = app;
