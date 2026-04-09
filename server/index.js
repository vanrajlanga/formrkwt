require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });

const express = require('express');
const cors = require('cors');
const path = require('path');
const { ensureSchema } = require('./db');
const submissionsRouter = require('./routes/submissions');
const exportRouter = require('./routes/export');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/auth', authRouter);
app.use('/api/submissions', submissionsRouter);
app.use('/api/export', exportRouter);

// Serve React build in production
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

ensureSchema()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to initialize database:', err);
    // Start server anyway so admin can see error in browser
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT} (DB INIT FAILED)`);
    });
  });
