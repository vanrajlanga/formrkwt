const express = require('express');
const cors = require('cors');
const path = require('path');
const submissionsRouter = require('./routes/submissions');
const exportRouter = require('./routes/export');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

app.use('/api/submissions', submissionsRouter);
app.use('/api/export', exportRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
