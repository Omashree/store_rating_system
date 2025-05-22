const pool = require('../models/db');

exports.submitRating = async (req, res) => {
  const { store_id, rating } = req.body;
  const user_id = req.user.id;
  try {
    await pool.query(
      `INSERT INTO ratings (store_id, user_id, rating) VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE rating = ?`,
      [store_id, user_id, rating, rating]
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Error submitting rating:", err);
    res.status(500).json({ error: 'Failed to submit rating', details: err.message });
  }
};

exports.getUserRatings = async (req, res) => {
  const user_id = req.user.id;
  try {
    const [ratings] = await pool.query(
      `SELECT r.store_id, s.name as store_name, s.address, r.rating FROM ratings r
       JOIN stores s ON r.store_id = s.id
       WHERE r.user_id = ?`, [user_id]);
    res.json(ratings);
  } catch (err) {
    console.error("Error fetching user ratings:", err);
    res.status(500).json({ error: 'Failed to fetch user ratings', details: err.message });
  }
};

exports.getStoreRatings = async (req, res) => {
  const owner_id = req.user.id;
  try {
    const [stores] = await pool.query(
      `SELECT s.name, AVG(r.rating) as avg_rating, COUNT(r.id) as total_ratings
       FROM stores s
       LEFT JOIN ratings r ON s.id = r.store_id
       WHERE s.owner_id = ?
       GROUP BY s.id`, [owner_id]);
    res.json(stores);
  } catch (err) {
    console.error("Error fetching store ratings:", err);
    res.status(500).json({ error: 'Failed to fetch store ratings', details: err.message });
  }
};

exports.getRatingsCount = async (req, res) => {
  try {
    const [[{ count }]] = await pool.query("SELECT COUNT(*) AS count FROM ratings");
    res.json({ count });
  } catch (err) {
    console.error("Error counting ratings:", err);
    res.status(500).json({ error: 'Failed to count ratings', details: err.message });
  }
};

exports.getUsersWhoRatedMyStores = async (req, res) => {
  try {
    const owner_id = req.user.id;
    const [usersRated] = await pool.query(
      `SELECT u.name AS user_name, u.email AS user_email, s.name AS store_name, r.rating
       FROM ratings r
       JOIN users u ON r.user_id = u.id
       JOIN stores s ON r.store_id = s.id
       WHERE s.owner_id = ?`,
      [owner_id]
    );
    res.json(usersRated);
  } catch (err) {
    console.error("Error fetching users who rated stores:", err);
    res.status(500).json({ error: 'Failed to fetch users who rated stores', details: err.message });
  }
};
