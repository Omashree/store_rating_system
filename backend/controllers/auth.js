const pool = require('../models/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { SECRET } = require('../middleware/auth');

exports.register = async (req, res) => {
  const { name, email, password, address } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, 'user')", [name, email, hashed, address]);
  res.json({ success: true });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const [[user]] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
  if (!user) return res.sendStatus(401);
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.sendStatus(401);
  const token = jwt.sign({ id: user.id, role: user.role }, SECRET);
  res.json({ token, role: user.role });
};