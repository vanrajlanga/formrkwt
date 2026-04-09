const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../auth');

// Create submission (public)
router.post('/', async (req, res) => {
  const { office_number, ownership_type, owners, tenants, allotted_parking } = req.body;

  if (!office_number || !ownership_type || !owners || owners.length === 0) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const [result] = await pool.query(
      `INSERT INTO submissions (office_number, ownership_type, owners, tenants, allotted_parking)
       VALUES (?, ?, ?, ?, ?)`,
      [
        office_number,
        ownership_type,
        JSON.stringify(owners),
        tenants ? JSON.stringify(tenants) : null,
        JSON.stringify(allotted_parking || []),
      ]
    );
    res.status(201).json({ id: result.insertId, message: 'Submission saved successfully' });
  } catch (err) {
    console.error('Insert error:', err);
    res.status(500).json({ error: 'Failed to save submission' });
  }
});

// Get all submissions (admin only)
router.get('/', requireAuth, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC');
    const submissions = rows.map((row) => {
      const obj = { ...row };
      obj.owners = JSON.parse(obj.owners);
      if (obj.tenants) {
        const parsed = JSON.parse(obj.tenants);
        obj.tenants = Array.isArray(parsed) ? parsed : [parsed];
      } else {
        obj.tenants = null;
      }
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
  } catch (err) {
    console.error('Fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Delete submission (admin only)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    await pool.query('DELETE FROM submissions WHERE id = ?', [parseInt(req.params.id)]);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Failed to delete' });
  }
});

module.exports = router;
