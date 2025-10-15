import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface LoanType {
  id: string;
  name: string;
  description: string;
  icon: string;
  requiredDocuments: string[];
  maxAmount: number;
  interestRate: number;
}

export interface LoanApplication {
  id: string;
  loanType: string;
  amount: number;
  purpose: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected' | 'clarification';
  submittedAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  documents: Document[];
  location?: {
    latitude: number;
    longitude: number;
    address: string;
  };
  notes?: string;
}

export interface Document {
  id: string;
  type: 'image' | 'video' | 'pdf';
  uri: string;
  name: string;
  size: number;
  uploadedAt: string;
  isVerified?: boolean;
}

export interface LoanState {
  loanTypes: LoanType[];
  applications: LoanApplication[];
  currentApplication: LoanApplication | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: LoanState = {
  loanTypes: [
    {
      id: 'home',
      name: 'Home Loan',
      description: 'Finance your dream home',
      icon: 'home',
      requiredDocuments: ['Property Documents', 'Income Proof', 'Identity Proof'],
      maxAmount: 5000000,
      interestRate: 8.5,
    },
    {
      id: 'education',
      name: 'Education Loan',
      description: 'Invest in your future',
      icon: 'school',
      requiredDocuments: ['Admission Letter', 'Fee Structure', 'Identity Proof'],
      maxAmount: 2000000,
      interestRate: 9.0,
    },
    {
      id: 'vehicle',
      name: 'Vehicle Loan',
      description: 'Get your wheels moving',
      icon: 'directions-car',
      requiredDocuments: ['Vehicle Documents', 'Income Proof', 'Identity Proof'],
      maxAmount: 1500000,
      interestRate: 10.5,
    },
    {
      id: 'personal',
      name: 'Personal Loan',
      description: 'Meet your personal needs',
      icon: 'person',
      requiredDocuments: ['Income Proof', 'Identity Proof', 'Address Proof'],
      maxAmount: 1000000,
      interestRate: 12.0,
    },
    {
      id: 'business',
      name: 'Business Loan',
      description: 'Grow your business',
      icon: 'business',
      requiredDocuments: ['Business Plan', 'Financial Statements', 'Identity Proof'],
      maxAmount: 10000000,
      interestRate: 11.5,
    },
    {
      id: 'gold',
      name: 'Gold Loan',
      description: 'Liquidate your gold assets',
      icon: 'diamond',
      requiredDocuments: ['Gold Valuation Certificate', 'Identity Proof'],
      maxAmount: 500000,
      interestRate: 9.5,
    },
    {
      id: 'lap',
      name: 'Loan Against Property',
      description: 'Unlock your property value',
      icon: 'home-work',
      requiredDocuments: ['Property Documents', 'Income Proof', 'Identity Proof'],
      maxAmount: 8000000,
      interestRate: 9.0,
    },
    {
      id: 'agriculture',
      name: 'Agriculture Loan',
      description: 'Support your farming needs',
      icon: 'agriculture',
      requiredDocuments: ['Land Documents', 'Crop Details', 'Identity Proof'],
      maxAmount: 3000000,
      interestRate: 7.5,
    },
  ],
  applications: [],
  currentApplication: null,
  isLoading: false,
  error: null,
};

// Async thunks
export const fetchLoanTypes = createAsyncThunk(
  'loan/fetchLoanTypes',
  async () => {
    // Mock API call - replace with actual implementation
    return new Promise<LoanType[]>((resolve) => {
      setTimeout(() => {
        resolve(initialState.loanTypes);
      }, 500);
    });
  }
);

export const createLoanApplication = createAsyncThunk(
  'loan/createLoanApplication',
  async (application: Omit<LoanApplication, 'id' | 'submittedAt' | 'status'>) => {
    // Mock API call - replace with actual implementation
    return new Promise<LoanApplication>((resolve) => {
      setTimeout(() => {
        const newApplication: LoanApplication = {
          ...application,
          id: Date.now().toString(),
          submittedAt: new Date().toISOString(),
          status: 'pending',
        };
        resolve(newApplication);
      }, 1000);
    });
  }
);

export const updateLoanApplication = createAsyncThunk(
  'loan/updateLoanApplication',
  async ({ id, updates }: { id: string; updates: Partial<LoanApplication> }) => {
    // Mock API call - replace with actual implementation
    return new Promise<LoanApplication>((resolve) => {
      setTimeout(() => {
        const updatedApplication: LoanApplication = {
          id,
          ...updates,
          submittedAt: new Date().toISOString(),
        } as LoanApplication;
        resolve(updatedApplication);
      }, 1000);
    });
  }
);

export const reviewLoanApplication = createAsyncThunk(
  'loan/reviewLoanApplication',
  async ({ 
    id, 
    status, 
    notes, 
    reviewedBy 
  }: { 
    id: string; 
    status: 'approved' | 'rejected' | 'clarification'; 
    notes?: string; 
    reviewedBy: string; 
  }) => {
    // Mock API call - replace with actual implementation
    return new Promise<LoanApplication>((resolve) => {
      setTimeout(() => {
        const reviewedApplication: LoanApplication = {
          id,
          status,
          notes,
          reviewedBy,
          reviewedAt: new Date().toISOString(),
        } as LoanApplication;
        resolve(reviewedApplication);
      }, 1000);
    });
  }
);

const loanSlice = createSlice({
  name: 'loan',
  initialState,
  reducers: {
    setCurrentApplication: (state, action: PayloadAction<LoanApplication | null>) => {
      state.currentApplication = action.payload;
    },
    addDocument: (state, action: PayloadAction<{ applicationId: string; document: Document }>) => {
      const { applicationId, document } = action.payload;
      const application = state.applications.find(app => app.id === applicationId);
      if (application) {
        application.documents.push(document);
      }
      if (state.currentApplication?.id === applicationId) {
        state.currentApplication.documents.push(document);
      }
    },
    removeDocument: (state, action: PayloadAction<{ applicationId: string; documentId: string }>) => {
      const { applicationId, documentId } = action.payload;
      const application = state.applications.find(app => app.id === applicationId);
      if (application) {
        application.documents = application.documents.filter(doc => doc.id !== documentId);
      }
      if (state.currentApplication?.id === applicationId) {
        state.currentApplication.documents = state.currentApplication.documents.filter(
          doc => doc.id !== documentId
        );
      }
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch loan types
      .addCase(fetchLoanTypes.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchLoanTypes.fulfilled, (state, action) => {
        state.isLoading = false;
        state.loanTypes = action.payload;
      })
      .addCase(fetchLoanTypes.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to fetch loan types';
      })
      // Create loan application
      .addCase(createLoanApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createLoanApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        state.applications.push(action.payload);
        state.currentApplication = action.payload;
      })
      .addCase(createLoanApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to create loan application';
      })
      // Update loan application
      .addCase(updateLoanApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateLoanApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = action.payload;
        }
        if (state.currentApplication?.id === action.payload.id) {
          state.currentApplication = action.payload;
        }
      })
      .addCase(updateLoanApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to update loan application';
      })
      // Review loan application
      .addCase(reviewLoanApplication.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(reviewLoanApplication.fulfilled, (state, action) => {
        state.isLoading = false;
        const index = state.applications.findIndex(app => app.id === action.payload.id);
        if (index !== -1) {
          state.applications[index] = { ...state.applications[index], ...action.payload };
        }
        if (state.currentApplication?.id === action.payload.id) {
          state.currentApplication = { ...state.currentApplication, ...action.payload };
        }
      })
      .addCase(reviewLoanApplication.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to review loan application';
      });
  },
});

export const { 
  setCurrentApplication, 
  addDocument, 
  removeDocument, 
  clearError 
} = loanSlice.actions;
export default loanSlice.reducer;
