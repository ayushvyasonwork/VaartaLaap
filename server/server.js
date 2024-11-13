const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dbConnect = require("./config/Database");
dbConnect();
const cookieParser = require('cookie-parser');
// Import routes
const authRoutes = require('./routes/Auth');
const chatRoutes = require('./routes/chatRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',  // Allow connection from React app
    methods: ['GET', 'POST'],
  },
});
// Middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Basic route for testing
app.get('/', (req, res) => {
  res.send('Server is running');
});

// Mount the routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/chats', chatRoutes);
app.use('/api/v1/messages', messageRoutes);

// Handle user connections with socket.io
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Broadcast a message when a user connects
  socket.broadcast.emit('message', 'A new user has joined the chat');

  // Listen for chat message events from clients
  socket.on('chatMessage', (msg) => {
    console.log('Message received:', msg);

    // Emit message to all connected clients
    io.emit('message', msg);
  });

  // Handle user disconnecting
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    io.emit('message', 'A user has left the chat');
  });
});

// Start the server
const PORT = process.env.PORT;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
