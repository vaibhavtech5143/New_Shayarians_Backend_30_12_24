import express from 'express';
import Poll from '../models/Poll.js';

const router = express.Router();

/**
 * @swagger
 * /api/polls:
 *   get:
 *     summary: Get all active polls
 *     responses:
 *       200:
 *         description: List of active polls
 */
router.get('/', async (req, res) => {
  try {
    const polls = await Poll.find({ expiresAt: { $gte: new Date() } }).sort({ createdAt: -1 });
    res.json(polls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/polls:
 *   post:
 *     summary: Create a new poll
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               question:
 *                 type: string
 *               options:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     text:
 *                       type: string
 *     responses:
 *       201:
 *         description: Poll created successfully
 */
router.post('/', async (req, res) => {
  try {
    const poll = new Poll(req.body);
    const newPoll = await poll.save();
    res.status(201).json(newPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/polls/{id}/vote:
 *   patch:
 *     summary: Vote on a poll option
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: optionIndex
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Vote registered successfully
 */
router.patch('/:id/vote', async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ message: 'Poll not found' });

    const optionIndex = parseInt(req.query.optionIndex);
    if (!poll.options[optionIndex]) return res.status(400).json({ message: 'Invalid option' });

    poll.options[optionIndex].votes += 1;
    const updatedPoll = await poll.save();
    res.json(updatedPoll);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
