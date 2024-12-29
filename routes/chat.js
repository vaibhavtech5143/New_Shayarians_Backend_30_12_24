import express from 'express';
import ChatRoom from '../models/ChatRoom.js';

const router = express.Router();

/**
 * @swagger
 * /api/chat:
 *   post:
 *     summary: Create or join a chat room
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               roomId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Chat room retrieved or created
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roomId:
 *                   type: string
 *                 messages:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       content:
 *                         type: string
 *                       timestamp:
 *                         type: string
 */
router.post('/', async (req, res) => {
  try {
    const { roomId } = req.body;
    let chatRoom = await ChatRoom.findOne({ roomId });

    if (!chatRoom) {
      chatRoom = new ChatRoom({ roomId, messages: [] });
      await chatRoom.save();
    }

    res.json(chatRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/chat/{roomId}/messages:
 *   get:
 *     summary: Get messages from a specific chat room
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: List of messages in the chat room
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   content:
 *                     type: string
 *                   timestamp:
 *                     type: string
 *       404:
 *         description: Chat room not found
 *       500:
 *         description: Server error
 */
router.get('/:roomId/messages', async (req, res) => {
  try {
    const { roomId } = req.params;
    const chatRoom = await ChatRoom.findOne({ roomId });

    if (!chatRoom) return res.status(404).json({ message: 'Chat room not found' });

    res.json(chatRoom.messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/**
 * @swagger
 * /api/chat:
 *   get:
 *     summary: Get all live chat rooms
 *     responses:
 *       200:
 *         description: List of live chat rooms
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   roomId:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  try {
    const rooms = await ChatRoom.find({}, 'roomId'); // Only return roomId
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rooms', error: error.message });
  }
});

/**
 * @swagger
 * /api/chat/{roomId}:
 *   delete:
 *     summary: Delete a specific chat room by its ID
 *     parameters:
 *       - in: path
 *         name: roomId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Chat room deleted successfully
 *       404:
 *         description: Chat room not found
 *       500:
 *         description: Server error
 */
router.delete('/:roomId', async (req, res) => {
  try {
    const { roomId } = req.params;
    const deletedRoom = await ChatRoom.findOneAndDelete({ roomId });

    if (!deletedRoom) {
      return res.status(404).json({ message: 'Chat room not found' });
    }

    res.json({ message: `Chat room '${roomId}' deleted successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting room', error: error.message });
  }
});


export default router;
