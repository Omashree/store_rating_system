const pool = require('../models/db');
const bcrypt = require('bcrypt');

exports.listUsers = async (req, res) => {
  const [users] = await pool.query("SELECT id, name, email, address, role FROM users");
  res.json(users);
};

exports.createUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  await pool.query("INSERT INTO users (name, email, password, address, role) VALUES (?, ?, ?, ?, ?)", [name, email, hashed, address, role]);
  res.json({ success: true });
};

exports.updatePassword = async (req, res) => {
  const user_id = req.user.id;
  const { currentPassword, newPassword } = req.body;

  try {
    const [[user]] = await pool.query("SELECT password FROM users WHERE id = ?", [user_id]);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const match = await bcrypt.compare(currentPassword, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Incorrect current password.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [hashedNewPassword, user_id]);

    res.json({ success: true, message: 'Password updated successfully!' });
  } catch (err) {
    console.error("Error updating password:", err);
    res.status(500).json({ error: 'Failed to update password', details: err.message });
  }
};