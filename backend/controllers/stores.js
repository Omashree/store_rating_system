const pool = require('../models/db');

exports.listStores = async (req, res) => {
  const [stores] = await pool.query(
    `SELECT s.id, s.name, s.email, s.address,
            IFNULL(AVG(r.rating), 0) as rating
     FROM stores s
     LEFT JOIN ratings r ON s.id = r.store_id
     GROUP BY s.id`
  );
  res.json(stores);
};

exports.createStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  await pool.query("INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)", [name, email, address, owner_id]);
  res.json({ success: true });
};