import { AppDispatch } from '@/store';
import {
    markDocumentAsUploaded,
    markDocumentUploadFailed,
    markFormAsUploaded,
    markFormUploadFailed,
    setLastSyncTime
} from '@/store/slices/offlineSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

export class OfflineSyncService {
  private static instance: OfflineSyncService;
  private syncInProgress = false;
  private dispatch: AppDispatch | null = null;

  static getInstance(): OfflineSyncService {
    if (!OfflineSyncService.instance) {
      OfflineSyncService.instance = new OfflineSyncService();
    }
    return OfflineSyncService.instance;
  }

  setDispatch(dispatch: AppDispatch) {
    this.dispatch = dispatch;
  }

  async syncOfflineData(): Promise<void> {
    if (this.syncInProgress || !this.dispatch) {
      return;
    }

    this.syncInProgress = true;

    try {
      // Get offline documents and forms from storage
      const offlineData = await AsyncStorage.getItem('offlineData');
      if (!offlineData) {
        return;
      }

      const { documents, forms } = JSON.parse(offlineData);
      
      // Sync documents
      for (const document of documents) {
        if (!document.isUploaded) {
          try {
            await this.uploadDocument(document);
            this.dispatch(markDocumentAsUploaded(document.id));
          } catch (error) {
            this.dispatch(markDocumentUploadFailed({ 
              id: document.id, 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }));
          }
        }
      }

      // Sync forms
      for (const form of forms) {
        if (!form.isUploaded) {
          try {
            await this.uploadForm(form);
            this.dispatch(markFormAsUploaded(form.id));
          } catch (error) {
            this.dispatch(markFormUploadFailed({ 
              id: form.id, 
              error: error instanceof Error ? error.message : 'Upload failed' 
            }));
          }
        }
      }

      // Update last sync time
      this.dispatch(setLastSyncTime(new Date().toISOString()));

    } catch (error) {
      console.error('Offline sync failed:', error);
    } finally {
      this.syncInProgress = false;
    }
  }

  private async uploadDocument(document: any): Promise<void> {
    // Mock API call - replace with actual implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.2) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 1000);
    });
  }

  private async uploadForm(form: any): Promise<void> {
    // Mock API call - replace with actual implementation
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate random success/failure for demo
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Server error'));
        }
      }, 1500);
    });
  }

  async isOnline(): Promise<boolean> {
    try {
      // Simple network check - replace with actual implementation
      const response = await fetch('https://www.google.com', { 
        method: 'HEAD',
        mode: 'no-cors',
        cache: 'no-cache'
      });
      return true;
    } catch {
      return false;
    }
  }

  startPeriodicSync(intervalMs: number = 30000): void {
    setInterval(() => {
      this.isOnline().then(isOnline => {
        if (isOnline) {
          this.syncOfflineData();
        }
      });
    }, intervalMs);
  }
}

export const offlineSyncService = OfflineSyncService.getInstance();
