// backend/routes/users.js
const express = require('express');
const verifyJwt = require('../middleware/auth');
const db = require('../config/database');
const router = express.Router();

router.get('/search', verifyJwt, async (req, res) => {
  const { q } = req.query; // single search parameter
  if (!q) {
    return res.status(400).json({ error: "Search query is required" });
  }

  try {
    // We'll look for partial matches in multiple columns:
    //   1) CAST(id AS CHAR)
    //   2) identifier
    //   3) discord
    //   4) license
    //   5) name
    //
    // The LIKE pattern uses %q% for partial matching in each column.
    const sql = `
      SELECT *
      FROM fivem
      WHERE
        CAST(id AS CHAR) LIKE ?
        OR identifier LIKE ?
        OR discord LIKE ?
        OR license LIKE ?
        OR name LIKE ?
    `;
    const likeValue = `%${q}%`;
    const [rows] = await db.execute(sql, [
      likeValue, likeValue, likeValue, likeValue, likeValue
    ]);
    return res.json(rows);
  } catch (err) {
    console.error("Database query error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
