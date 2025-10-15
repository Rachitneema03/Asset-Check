import { AppDispatch } from '@/store';
import { addNotification } from '@/store/slices/notificationSlice';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export class NotificationService {
  private static instance: NotificationService;
  private dispatch: AppDispatch | null = null;
  private expoPushToken: string | null = null;

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  async initialize(): Promise<void> {
    try {
      // Request permissions
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }

      // Get push token
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#2196F3',
        });
      }

      const token = await Notifications.getExpoPushTokenAsync({
        projectId: 'your-expo-project-id', // Replace with actual project ID
      });
      
      this.expoPushToken = token.data;
      console.log('Expo push token:', this.expoPushToken);

      // Listen for notifications
      this.setupNotificationListeners();

    } catch (error) {
      console.error('Failed to initialize notifications:', error);
    }
  }

  private setupNotificationListeners(): void {
    // Handle notification received while app is running
    Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification received:', notification);
      
      if (this.dispatch) {
        this.dispatch(addNotification({
          title: notification.request.content.title || 'New Notification',
          body: notification.request.content.body || '',
          type: 'info',
        }));
      }
    });

    // Handle notification tapped
    Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
      
      // Handle navigation based on notification data
      const data = response.notification.request.content.data;
      if (data?.screen) {
        // Navigate to specific screen
        // This would need to be implemented with navigation context
      }
    });
  }

  async scheduleLocalNotification(
    title: string,
    body: string,
    data?: any,
    trigger?: Notifications.NotificationTriggerInput
  ): Promise<string> {
    try {
      const notificationId = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          data,
          sound: 'default',
        },
        trigger: trigger || null,
      });

      // Add to Redux store
      if (this.dispatch) {
        this.dispatch(addNotification({
          title,
          body,
          type: 'info',
          data,
        }));
      }

      return notificationId;
    } catch (error) {
      console.error('Failed to schedule notification:', error);
      throw error;
    }
  }

  async sendPushNotification(
    expoPushToken: string,
    title: string,
    body: string,
    data?: any
  ): Promise<void> {
    try {
      const message = {
        to: expoPushToken,
        sound: 'default',
        title,
        body,
        data,
      };

      // In a real app, you would send this to your backend
      // which would then send it via Expo's push service
      console.log('Would send push notification:', message);
      
      // Mock implementation - replace with actual API call
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

    } catch (error) {
      console.error('Failed to send push notification:', error);
      throw error;
    }
  }

  async cancelNotification(notificationId: string): Promise<void> {
    try {
      await Notifications.cancelScheduledNotificationAsync(notificationId);
    } catch (error) {
      console.error('Failed to cancel notification:', error);
    }
  }

  async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error('Failed to cancel all notifications:', error);
    }
  }

  getExpoPushToken(): string | null {
    return this.expoPushToken;
  }

  // Mock methods for demo purposes
  async sendLoanStatusUpdate(applicationId: string, status: string): Promise<void> {
    const statusMessages = {
      approved: 'Your loan application has been approved!',
      rejected: 'Your loan application has been rejected.',
      clarification: 'Your loan application requires clarification.',
      pending: 'Your loan application is under review.',
    };

    const message = statusMessages[status as keyof typeof statusMessages] || 'Your loan application status has been updated.';

    await this.scheduleLocalNotification(
      'Loan Application Update',
      message,
      { applicationId, status }
    );
  }

  async sendDocumentReminder(applicationId: string): Promise<void> {
    await this.scheduleLocalNotification(
      'Document Upload Required',
      'Please upload the required documents to complete your loan application.',
      { applicationId, type: 'document_reminder' }
    );
  }

  async sendPaymentReminder(amount: number, dueDate: string): Promise<void> {
    await this.scheduleLocalNotification(
      'Payment Reminder',
      `Your EMI payment of ₹${amount.toLocaleString()} is due on ${dueDate}.`,
      { type: 'payment_reminder', amount, dueDate }
    );
  }
}

export const notificationService = NotificationService.getInstance();
