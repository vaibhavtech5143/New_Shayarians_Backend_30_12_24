import express from 'express';
import Shayari from '../models/Shayari.js';

const router = express.Router();

/**
 * @swagger
 * /api/shayari:
 *   get:
 *     summary: Get all Shayaris with pagination
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: Successful response
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const shayaris = await Shayari.find().sort({ createdAt: -1 }).skip(skip).limit(limit);
    const total = await Shayari.countDocuments();

    res.json({
      shayaris,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/shayari:
 *   post:
 *     summary: Create a new Shayari
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               genre:
 *                 type: string
 *               content:
 *                 type: string
 *               imageUrls:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Shayari created successfully
 */
router.post('/', async (req, res) => {
  try {
    const shayari = new Shayari(req.body);
    const newShayari = await shayari.save();
    res.status(201).json(newShayari);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/shayari/{id}/like:
 *   patch:
 *     summary: Like a Shayari
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Shayari liked successfully
 */
router.patch('/:id/like', async (req, res) => {
  try {
    const shayari = await Shayari.findById(req.params.id);
    if (!shayari) return res.status(404).json({ message: 'Shayari not found' });

    shayari.likes += 1;
    const updatedShayari = await shayari.save();
    res.json(updatedShayari);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/shayari/{id}/comment:
 *   post:
 *     summary: Add a comment to a Shayari
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               author:
 *                 type: string
 *     responses:
 *       200:
 *         description: Comment added successfully
 */
router.post('/:id/comment', async (req, res) => {
  try {
    const shayari = await Shayari.findById(req.params.id);
    if (!shayari) return res.status(404).json({ message: 'Shayari not found' });

    shayari.comments.push(req.body);
    const updatedShayari = await shayari.save();
    res.json(updatedShayari);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
