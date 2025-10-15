import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface OfflineDocument {
  id: string;
  type: 'image' | 'video' | 'pdf';
  uri: string;
  name: string;
  size: number;
  applicationId: string;
  uploadedAt: string;
  isUploaded: boolean;
  uploadError?: string;
}

export interface OfflineForm {
  id: string;
  formData: any;
  applicationId?: string;
  createdAt: string;
  isUploaded: boolean;
  uploadError?: string;
}

export interface OfflineState {
  documents: OfflineDocument[];
  forms: OfflineForm[];
  isOnline: boolean;
  lastSyncTime: string | null;
  pendingUploads: number;
}

const initialState: OfflineState = {
  documents: [],
  forms: [],
  isOnline: true,
  lastSyncTime: null,
  pendingUploads: 0,
};

const offlineSlice = createSlice({
  name: 'offline',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    addOfflineDocument: (state, action: PayloadAction<OfflineDocument>) => {
      state.documents.push(action.payload);
      state.pendingUploads += 1;
    },
    addOfflineForm: (state, action: PayloadAction<OfflineForm>) => {
      state.forms.push(action.payload);
      state.pendingUploads += 1;
    },
    markDocumentAsUploaded: (state, action: PayloadAction<string>) => {
      const document = state.documents.find(doc => doc.id === action.payload);
      if (document && !document.isUploaded) {
        document.isUploaded = true;
        document.uploadError = undefined;
        state.pendingUploads -= 1;
      }
    },
    markFormAsUploaded: (state, action: PayloadAction<string>) => {
      const form = state.forms.find(f => f.id === action.payload);
      if (form && !form.isUploaded) {
        form.isUploaded = true;
        form.uploadError = undefined;
        state.pendingUploads -= 1;
      }
    },
    markDocumentUploadFailed: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const document = state.documents.find(doc => doc.id === action.payload.id);
      if (document) {
        document.uploadError = action.payload.error;
      }
    },
    markFormUploadFailed: (state, action: PayloadAction<{ id: string; error: string }>) => {
      const form = state.forms.find(f => f.id === action.payload.id);
      if (form) {
        form.uploadError = action.payload.error;
      }
    },
    removeOfflineDocument: (state, action: PayloadAction<string>) => {
      const document = state.documents.find(doc => doc.id === action.payload);
      if (document && !document.isUploaded) {
        state.pendingUploads -= 1;
      }
      state.documents = state.documents.filter(doc => doc.id !== action.payload);
    },
    removeOfflineForm: (state, action: PayloadAction<string>) => {
      const form = state.forms.find(f => f.id === action.payload);
      if (form && !form.isUploaded) {
        state.pendingUploads -= 1;
      }
      state.forms = state.forms.filter(f => f.id !== action.payload);
    },
    clearUploadedData: (state) => {
      state.documents = state.documents.filter(doc => !doc.isUploaded);
      state.forms = state.forms.filter(form => !form.isUploaded);
      state.pendingUploads = state.documents.length + state.forms.length;
    },
    setLastSyncTime: (state, action: PayloadAction<string>) => {
      state.lastSyncTime = action.payload;
    },
    resetOfflineState: (state) => {
      state.documents = [];
      state.forms = [];
      state.pendingUploads = 0;
      state.lastSyncTime = null;
    },
  },
});

export const {
  setOnlineStatus,
  addOfflineDocument,
  addOfflineForm,
  markDocumentAsUploaded,
  markFormAsUploaded,
  markDocumentUploadFailed,
  markFormUploadFailed,
  removeOfflineDocument,
  removeOfflineForm,
  clearUploadedData,
  setLastSyncTime,
  resetOfflineState,
} = offlineSlice.actions;

export default offlineSlice.reducer;
