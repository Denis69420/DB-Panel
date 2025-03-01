// backend/routes/universalSearch.js
require('dotenv').config();
const express = require('express');
const db = require('../config/database');
const verifyJwt = require('../middleware/auth'); // remove if not needed

const router = express.Router();

/**
 * GET /api/search?q=someValue
 * Scans every table & column in your DB for partial matches of 'someValue'.
 * Returns an array of objects:
 *   {
 *     tableName: "some_table",
 *     columnName: "some_column",
 *     dataType: "varchar",
 *     row: { ...entire row from the table... }
 *   }
 */
router.get('/search', verifyJwt, async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ error: "Missing query parameter 'q'." });
  }

  try {
    // 1) Fetch all columns for the DB specified in .env
    const [columns] = await db.query(`
      SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE
      FROM information_schema.columns
      WHERE TABLE_SCHEMA = ?
      ORDER BY TABLE_NAME, COLUMN_NAME
    `, [process.env.DB_NAME]);

    // Allowed data types (expand as needed)
    const textTypes = [
      'char','varchar','text','tinytext','mediumtext','longtext','enum','set'
    ];
    const numericTypes = [
      'int','bigint','smallint','mediumint','tinyint','decimal','float','double'
    ];

    const likeTerm = `%${q}%`;
    const resultsGrouped = [];

    // 2) For each column, if it's text or numeric, do a LIKE query
    for (const col of columns) {
      const { TABLE_NAME, COLUMN_NAME, DATA_TYPE } = col;
      const dataTypeLower = DATA_TYPE.toLowerCase();

      let sql = null;
      if (textTypes.includes(dataTypeLower)) {
        // Text column => direct LIKE
        sql = `SELECT * FROM \`${TABLE_NAME}\` WHERE \`${COLUMN_NAME}\` LIKE ?`;
      } else if (numericTypes.includes(dataTypeLower)) {
        // Numeric => CAST to CHAR for partial match
        sql = `SELECT * FROM \`${TABLE_NAME}\` WHERE CAST(\`${COLUMN_NAME}\` AS CHAR) LIKE ?`;
      }
      // Skip other data types (date, blob, etc.) unless you want to handle them too

      if (!sql) continue;

      const [rows] = await db.query(sql, [likeTerm]);
      if (rows.length > 0) {
        resultsGrouped.push({
          tableName: TABLE_NAME,
          columnName: COLUMN_NAME,
          dataType: DATA_TYPE,
          matches: rows
        });
      }
    }

    // 3) Flatten the results
    const flattened = [];
    for (const group of resultsGrouped) {
      for (const row of group.matches) {
        flattened.push({
          tableName: group.tableName,
          columnName: group.columnName,
          dataType: group.dataType,
          row: row
        });
      }
    }

    // 4) Return the flattened array
    return res.json(flattened);

  } catch (err) {
    console.error("Universal search error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
