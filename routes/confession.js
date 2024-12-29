import express from 'express';
import Confession from '../models/Confession.js';

const router = express.Router();

/**
 * @swagger
 * /api/confessions:
 *   get:
 *     summary: Get all confessions
 *     responses:
 *       200:
 *         description: List of confessions
 */
router.get('/', async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ createdAt: -1 });
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/confessions:
 *   post:
 *     summary: Add a confession
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *     responses:
 *       201:
 *         description: Confession added successfully
 */
router.post('/', async (req, res) => {
  try {
    const confession = new Confession(req.body);
    const newConfession = await confession.save();
    res.status(201).json(newConfession);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
