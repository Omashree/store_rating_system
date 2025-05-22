const express = require('express');
const cors = require('cors');
require('dotenv').config();
const authRoutes = require('./routes/auth');
const storeRoutes = require('./routes/stores');
const userRoutes = require('./routes/users');
const ratingRoutes = require('./routes/ratings');
const adminRoutes = require('./routes/admin');
const { authenticateJWT } = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/admin', authenticateJWT, adminRoutes);
app.use('/api/stores', authenticateJWT, storeRoutes);
app.use('/api/users', authenticateJWT, userRoutes);
app.use('/api/ratings', authenticateJWT, ratingRoutes);

const PORT = process.env.render_port || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));