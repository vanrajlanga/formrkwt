const express = require('express');
const router = express.Router();
const { pool } = require('../db');
const { requireAuth } = require('../auth');
const ExcelJS = require('exceljs');

async function flattenSubmissions() {
  const [rows] = await pool.query('SELECT * FROM submissions ORDER BY created_at DESC');
  const flat = [];

  for (const row of rows) {
    const owners = JSON.parse(row.owners);
    let tenants = null;
    if (row.tenants) {
      const parsed = JSON.parse(row.tenants);
      tenants = Array.isArray(parsed) ? parsed : [parsed];
    }
    let parking = [];
    if (row.allotted_parking) {
      try {
        const parsed = JSON.parse(row.allotted_parking);
        parking = Array.isArray(parsed) ? parsed : [row.allotted_parking];
      } catch {
        parking = [row.allotted_parking];
      }
    }

    const entry = {
      'ID': row.id,
      'Office Number': row.office_number,
      'Ownership Type': row.ownership_type,
      'Submitted At': row.created_at,
    };

    for (let i = 0; i < 4; i++) {
      const owner = owners[i];
      const num = i + 1;
      entry[`Owner ${num} Name`] = owner ? owner.name : '';
      entry[`Owner ${num} Mobile`] = owner ? owner.mobile : '';
      entry[`Owner ${num} Aadhaar`] = owner ? owner.aadhaar : '';
      entry[`Owner ${num} Vehicle (4 wheel)`] = owner ? owner.vehicle : '';
    }

    for (let i = 0; i < 4; i++) {
      const tenant = tenants ? tenants[i] : null;
      const num = i + 1;
      entry[`Tenant ${num} Name`] = tenant ? tenant.name : '';
      entry[`Tenant ${num} Mobile`] = tenant ? tenant.mobile : '';
      entry[`Tenant ${num} Aadhaar`] = tenant ? tenant.aadhaar : '';
      entry[`Tenant ${num} Vehicle (4 wheel)`] = tenant ? tenant.vehicle : '';
    }

    entry['Allotted Parking Numbers'] = parking.filter(Boolean).join(', ');
    flat.push(entry);
  }

  return flat;
}

router.get('/csv', requireAuth, async (req, res) => {
  try {
    const data = await flattenSubmissions();
    if (data.length === 0) return res.status(404).send('No data to export');

    const headers = Object.keys(data[0]);
    let csv = headers.map((h) => `"${h}"`).join(',') + '\n';
    for (const row of data) {
      csv += headers.map((h) => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=rk_tower_crm_data.csv');
    res.send(csv);
  } catch (err) {
    console.error('CSV export error:', err);
    res.status(500).send('Export failed');
  }
});

router.get('/xlsx', requireAuth, async (req, res) => {
  try {
    const data = await flattenSubmissions();
    if (data.length === 0) return res.status(404).send('No data to export');

    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Submissions');

    const headers = Object.keys(data[0]);
    sheet.addRow(headers);

    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4A148C' },
    };
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };

    for (const row of data) {
      sheet.addRow(headers.map((h) => row[h] || ''));
    }

    sheet.columns.forEach((col) => {
      col.width = 20;
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=rk_tower_crm_data.xlsx');
    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    console.error('XLSX export error:', err);
    res.status(500).send('Export failed');
  }
});

module.exports = router;
