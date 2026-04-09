const express = require('express');
const cors = require('cors');
const path = require('path');
const submissionsRouter = require('./routes/submissions');
const exportRouter = require('./routes/export');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API routes
app.use('/api/submissions', submissionsRouter);
app.use('/api/export', exportRouter);

// Serve React build in production
const clientBuild = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientBuild));
app.get('*', (req, res) => {
  res.sendFile(path.join(clientBuild, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
