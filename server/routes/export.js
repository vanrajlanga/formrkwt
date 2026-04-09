const express = require('express');
const router = express.Router();
const { getDb } = require('../db');
const ExcelJS = require('exceljs');

async function flattenSubmissions() {
  const db = await getDb();
  const result = db.exec('SELECT * FROM submissions ORDER BY created_at DESC');

  if (result.length === 0) return [];

  const columns = result[0].columns;
  const flat = [];

  for (const row of result[0].values) {
    const obj = {};
    columns.forEach((col, i) => { obj[col] = row[i]; });

    const owners = JSON.parse(obj.owners);
    let tenants = null;
    if (obj.tenant) {
      const parsed = JSON.parse(obj.tenant);
      tenants = Array.isArray(parsed) ? parsed : [parsed];
    }
    let parking = [];
    if (obj.allotted_parking) {
      try {
        const parsed = JSON.parse(obj.allotted_parking);
        parking = Array.isArray(parsed) ? parsed : [obj.allotted_parking];
      } catch {
        parking = [obj.allotted_parking];
      }
    }

    const entry = {
      'ID': obj.id,
      'Office Number': obj.office_number,
      'Ownership Type': obj.ownership_type,
      'Submitted At': obj.created_at,
    };

    // Add owner columns (up to 4)
    for (let i = 0; i < 4; i++) {
      const owner = owners[i];
      const num = i + 1;
      entry[`Owner ${num} Name`] = owner ? owner.name : '';
      entry[`Owner ${num} Mobile`] = owner ? owner.mobile : '';
      entry[`Owner ${num} Aadhaar`] = owner ? owner.aadhaar : '';
      entry[`Owner ${num} Vehicle (4 wheel)`] = owner ? owner.vehicle : '';
    }

    // Add tenant columns (up to 4)
    for (let i = 0; i < 4; i++) {
      const tenant = tenants ? tenants[i] : null;
      const num = i + 1;
      entry[`Tenant ${num} Name`] = tenant ? tenant.name : '';
      entry[`Tenant ${num} Mobile`] = tenant ? tenant.mobile : '';
      entry[`Tenant ${num} Aadhaar`] = tenant ? tenant.aadhaar : '';
      entry[`Tenant ${num} Vehicle (4 wheel)`] = tenant ? tenant.vehicle : '';
    }

    // Add parking columns
    entry['Allotted Parking Numbers'] = parking.filter(Boolean).join(', ');

    flat.push(entry);
  }

  return flat;
}

// Export CSV
router.get('/csv', async (req, res) => {
  const data = await flattenSubmissions();
  if (data.length === 0) {
    return res.status(404).send('No data to export');
  }

  const headers = Object.keys(data[0]);
  let csv = headers.map(h => `"${h}"`).join(',') + '\n';
  for (const row of data) {
    csv += headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(',') + '\n';
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=rk_tower_crm_data.csv');
  res.send(csv);
});

// Export XLSX
router.get('/xlsx', async (req, res) => {
  const data = await flattenSubmissions();
  if (data.length === 0) {
    return res.status(404).send('No data to export');
  }

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
    sheet.addRow(headers.map(h => row[h] || ''));
  }

  sheet.columns.forEach(col => { col.width = 20; });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=rk_tower_crm_data.xlsx');
  await workbook.xlsx.write(res);
  res.end();
});

module.exports = router;
