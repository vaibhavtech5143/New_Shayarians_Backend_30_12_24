import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setupSwagger } from './swagger.js';
import shayariRoutes from './routes/shayari.js';
import uploadRoutes from './routes/upload.js';
import pollRoutes from './routes/poll.js';
import confessionRoutes from './routes/confession.js';
import chatRoutes from './routes/chat.js';


dotenv.config();

const app = express();
app.use(express.static(path.join(process.cwd(), 'public')));
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(cors());
app.use(express.json());

// Health Route
app.get('/health', (req, res) => {
  res.send('Server is healthy!');
});


app.use("/test", (req, res) => {z
  res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
});
app.use("/chat", (req, res) => {
  res.sendFile(path.join(process.cwd(), 'public', 'chat.html'));
});

// Setup Swagger
setupSwagger(app);

// Routes
app.use('/api/shayari', shayariRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/polls', pollRoutes);
app.use('/api/confessions', confessionRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO Configuration
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', async (data) => {
    try {
      const { roomId, message } = data;
  
      const room = await mongoose.model('ChatRoom').findOne({ roomId });
      if (room) {
        room.messages.push({ content: message });
        await room.save();
  
        // Broadcast to everyone in the room, including the sender
        io.to(roomId).emit('receive_message', {
          content: message,
          sender: socket.id, // Identify the sender
          timestamp: new Date(),
        });
      }
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Start Server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
