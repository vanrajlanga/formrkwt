const express = require('express');
const router = express.Router();
const { getDb, saveDb } = require('../db');

// Create submission
router.post('/', async (req, res) => {
  const { office_number, ownership_type, owners, tenants, allotted_parking } = req.body;

  if (!office_number || !ownership_type || !owners || owners.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const db = await getDb();
  db.run(
    `INSERT INTO submissions (office_number, ownership_type, owners, tenant, allotted_parking)
     VALUES (?, ?, ?, ?, ?)`,
    [
      office_number,
      ownership_type,
      JSON.stringify(owners),
      tenants ? JSON.stringify(tenants) : null,
      JSON.stringify(allotted_parking || []),
    ]
  );
  saveDb();

  const result = db.exec('SELECT last_insert_rowid() as id');
  const id = result[0].values[0][0];

  res.status(201).json({ id, message: 'Submission saved successfully' });
});

// Get all submissions
router.get('/', async (req, res) => {
  const db = await getDb();
  const result = db.exec('SELECT * FROM submissions ORDER BY created_at DESC');

  if (result.length === 0) {
    return res.json([]);
  }

  const columns = result[0].columns;
  const submissions = result[0].values.map((row) => {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });
    obj.owners = JSON.parse(obj.owners);
    // Handle both old single tenant and new tenants array format
    if (obj.tenant) {
      const parsed = JSON.parse(obj.tenant);
      obj.tenants = Array.isArray(parsed) ? parsed : [parsed];
    } else {
      obj.tenants = null;
    }
    delete obj.tenant;
    // Handle both old string and new array format for parking
    if (obj.allotted_parking) {
      try {
        const parsed = JSON.parse(obj.allotted_parking);
        obj.allotted_parking = Array.isArray(parsed) ? parsed : [obj.allotted_parking];
      } catch {
        obj.allotted_parking = [obj.allotted_parking];
      }
    } else {
      obj.allotted_parking = [];
    }
    return obj;
  });

  res.json(submissions);
});

// Delete submission
router.delete('/:id', async (req, res) => {
  const db = await getDb();
  db.run('DELETE FROM submissions WHERE id = ?', [parseInt(req.params.id)]);
  saveDb();
  res.json({ message: 'Deleted successfully' });
});

module.exports = router;
