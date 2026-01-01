import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import { verifyAccessToken } from '../utils/jwt.js';
import { Account } from '../modules/auth/models/account.model.js';

// Store connected users
const connectedUsers = new Map<string, string>(); // userId -> socketId

export let io: SocketIOServer;

export const initializeSocket = (server: HTTPServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  // Authentication middleware
  io.use(async (socket: Socket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;

      if (!token) {
        return next(new Error('Authentication token missing'));
      }

      const decoded = verifyAccessToken(token as string);
      if (!decoded || !decoded.userId) {
        return next(new Error('Invalid token'));
      }

      // Attach user info to socket
      socket.data.userId = decoded.userId;
      socket.data.role = decoded.role;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication failed'));
    }
  });

  io.on('connection', async (socket: Socket) => {
    console.log(`🔌 User connected: ${socket.data.userId}`);

    // Store user connection
    connectedUsers.set(socket.data.userId, socket.id);

    // Join user-specific room
    socket.join(`user_${socket.data.userId}`);

    // Join role-specific room
    if (socket.data.role) {
      socket.join(`role_${socket.data.role}`);
    }

    // Handle user events
    socket.on('join_room', (room: string) => {
      socket.join(room);
      console.log(`👤 User ${socket.data.userId} joined room: ${room}`);
    });

    socket.on('leave_room', (room: string) => {
      socket.leave(room);
      console.log(`👤 User ${socket.data.userId} left room: ${room}`);
    });

    // Handle order updates
    socket.on('order_status_update', (data: any) => {
      // Broadcast to user and admins
      io.to(`user_${data.userId}`).emit('order_status_changed', data);
      io.to('role_ADMIN').emit('order_status_changed', data);
      io.to('role_STAFF').emit('order_status_changed', data);
    });

    // Handle notifications
    socket.on('send_notification', (data: any) => {
      const { targetUserId, notification } = data;

      if (targetUserId) {
        // Send to specific user
        io.to(`user_${targetUserId}`).emit('notification', notification);
      } else if (data.targetRole) {
        // Send to role
        io.to(`role_${data.targetRole}`).emit('notification', notification);
      } else {
        // Broadcast to all
        io.emit('notification', notification);
      }
    });

    // Handle chat messages (if implemented)
    socket.on('send_message', (data: any) => {
      const { room, message } = data;
      socket.to(room).emit('message', {
        ...message,
        from: socket.data.userId,
        timestamp: new Date(),
      });
    });

    // Handle typing indicators
    socket.on('typing_start', (data: any) => {
      socket.to(data.room).emit('user_typing', {
        userId: socket.data.userId,
        username: data.username,
      });
    });

    socket.on('typing_stop', (data: any) => {
      socket.to(data.room).emit('user_stop_typing', {
        userId: socket.data.userId,
      });
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      console.log(`🔌 User disconnected: ${socket.data.userId}`);
      connectedUsers.delete(socket.data.userId);
    });
  });

  return io;
};

// Helper functions
export const emitToUser = (userId: string, event: string, data: any) => {
  const socketId = connectedUsers.get(userId);
  if (socketId) {
    io.to(socketId).emit(event, data);
  }
};

export const emitToRole = (role: string, event: string, data: any) => {
  io.to(`role_${role}`).emit(event, data);
};

export const emitToRoom = (room: string, event: string, data: any) => {
  io.to(room).emit(event, data);
};

export const getConnectedUsers = () => {
  return Array.from(connectedUsers.keys());
};

export const isUserOnline = (userId: string): boolean => {
  return connectedUsers.has(userId);
};
