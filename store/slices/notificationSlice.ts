import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'info' | 'success' | 'warning' | 'error';
  timestamp: string;
  isRead: boolean;
  data?: any;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isEnabled: boolean;
  lastNotificationTime: string | null;
}

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
  isEnabled: true,
  lastNotificationTime: null,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'timestamp' | 'isRead'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        isRead: false,
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
      state.lastNotificationTime = notification.timestamp;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        notification.isRead = true;
        state.unreadCount -= 1;
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(notification => {
        notification.isRead = true;
      });
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.isRead) {
        state.unreadCount -= 1;
      }
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setNotificationEnabled: (state, action: PayloadAction<boolean>) => {
      state.isEnabled = action.payload;
    },
    // Mock notifications for demo
    addMockNotifications: (state) => {
      const mockNotifications: Omit<Notification, 'id' | 'timestamp' | 'isRead'>[] = [
        {
          title: 'Loan Application Approved',
          body: 'Your home loan application has been approved. Please check your dashboard for details.',
          type: 'success',
        },
        {
          title: 'Document Upload Required',
          body: 'Please upload your income proof document to complete your application.',
          type: 'warning',
        },
        {
          title: 'Application Status Update',
          body: 'Your vehicle loan application is under review. We will notify you once processed.',
          type: 'info',
        },
        {
          title: 'Payment Reminder',
          body: 'Your monthly EMI payment is due in 3 days. Please ensure sufficient balance.',
          type: 'warning',
        },
        {
          title: 'Welcome to LoanTrack',
          body: 'Thank you for registering with LoanTrack. Start by selecting your loan type.',
          type: 'info',
        },
      ];

      mockNotifications.forEach(notification => {
        const newNotification: Notification = {
          ...notification,
          id: Date.now().toString() + Math.random(),
          timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
          isRead: Math.random() > 0.5,
        };
        state.notifications.push(newNotification);
        if (!newNotification.isRead) {
          state.unreadCount += 1;
        }
      });
    },
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearAllNotifications,
  setNotificationEnabled,
  addMockNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
