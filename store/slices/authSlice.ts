import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  role: 'beneficiary' | 'field_officer' | 'manager';
  isVerified: boolean;
  profileImage?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  otpSent: boolean;
  otpVerified: boolean;
  biometricEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  otpSent: false,
  otpVerified: false,
  biometricEnabled: false,
};

// Async thunks
export const sendOTP = createAsyncThunk(
  'auth/sendOTP',
  async ({ phone, email }: { phone?: string; email?: string }) => {
    // Mock API call - replace with actual implementation
    return new Promise<{ success: boolean; message: string }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: 'OTP sent successfully' });
      }, 1000);
    });
  }
);

export const verifyOTP = createAsyncThunk(
  'auth/verifyOTP',
  async ({ otp, phone, email }: { otp: string; phone?: string; email?: string }) => {
    // Mock API call - replace with actual implementation
    return new Promise<{ success: boolean; user: User }>((resolve, reject) => {
      setTimeout(() => {
        if (otp === '123456') {
          const user: User = {
            id: '1',
            name: phone ? 'John Doe' : 'Officer Smith',
            email: email || undefined,
            phone: phone || undefined,
            role: email ? 'field_officer' : 'beneficiary',
            isVerified: true,
          };
          resolve({ success: true, user });
        } else {
          reject(new Error('Invalid OTP'));
        }
      }, 1000);
    });
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    // Mock API call - replace with actual implementation
    return new Promise<{ success: boolean }>((resolve) => {
      setTimeout(() => {
        resolve({ success: true });
      }, 500);
    });
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.otpSent = false;
      state.otpVerified = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Send OTP
      .addCase(sendOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOTP.fulfilled, (state) => {
        state.isLoading = false;
        state.otpSent = true;
      })
      .addCase(sendOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })
      // Verify OTP
      .addCase(verifyOTP.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOTP.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.otpVerified = true;
      })
      .addCase(verifyOTP.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Invalid OTP';
      })
      // Logout
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.otpSent = false;
        state.otpVerified = false;
      })
      .addCase(logout.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const { clearError, setBiometricEnabled, setUser, clearAuth } = authSlice.actions;
export default authSlice.reducer;
