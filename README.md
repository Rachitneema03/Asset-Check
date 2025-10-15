# LoanTrack Mobile App

A comprehensive React Native mobile application for tracking and verifying loan utilization for beneficiaries and officers.

## Features

### 🔐 Authentication
- **Dual Login System**: Separate login flows for beneficiaries (mobile OTP) and officers (email OTP)
- **OTP Verification**: Secure one-time password verification
- **Biometric Login**: Optional fingerprint/face recognition support
- **Offline Login**: Cached authentication for offline access

### 📱 User Roles

#### Beneficiaries
- Apply for various loan types (Home, Education, Vehicle, Personal, Business, Gold, LAP, Agriculture)
- Upload required documents with geo-tagging
- Track loan application status
- Receive push notifications for updates
- Offline document capture with auto-sync

#### Officers & Managers
- Review loan applications
- Approve, reject, or request clarification
- View detailed application information
- Access reports and analytics
- Two-level approval system (Manager override)

### 🏦 Loan Types
- **Home Loan**: Property financing with document verification
- **Education Loan**: Student financing with admission proof
- **Vehicle Loan**: Auto financing with vehicle documentation
- **Personal Loan**: General purpose financing
- **Business Loan**: Commercial financing with business plans
- **Gold Loan**: Asset-backed lending with gold valuation
- **Loan Against Property (LAP)**: Property-backed financing
- **Agriculture Loan**: Farming and agricultural financing

### 📊 Dashboard & Analytics
- Real-time loan status tracking
- Performance metrics and KPIs
- Loan type breakdown and approval rates
- Recent applications overview
- Export functionality (PDF, CSV)

### 📷 Document Management
- Camera integration for document capture
- File picker for PDF uploads
- Geo-tagged and time-stamped uploads
- Offline document queue
- Automatic sync when online
- Document preview and validation

### 🔔 Notifications
- Push notifications for status updates
- Document upload reminders
- Payment due notifications
- Real-time application updates

### 🌐 Offline Support
- Offline-first architecture
- Local data caching
- Automatic sync when connectivity restored
- Queue management for failed uploads

## Tech Stack

- **Framework**: React Native (Expo)
- **Language**: TypeScript
- **UI Library**: React Native Paper
- **Navigation**: Expo Router (Stack + Bottom Tabs)
- **State Management**: Redux Toolkit
- **Storage**: AsyncStorage + Redux Persist
- **Authentication**: Firebase Authentication (planned)
- **Notifications**: Expo Notifications
- **Camera**: Expo Camera
- **File Picker**: Expo Document Picker
- **Location**: Expo Location
- **Charts**: React Native Chart Kit

## Project Structure

```
src/
├── app/                    # Expo Router pages
│   ├── (tabs)/            # Tab navigation screens
│   │   ├── index.tsx      # Dashboard
│   │   ├── applications.tsx # Applications list
│   │   ├── upload.tsx     # Document upload
│   │   ├── reports.tsx    # Reports (Officers only)
│   │   └── profile.tsx    # User profile
│   ├── auth/              # Authentication screens
│   ├── loan-type/         # Loan type selection
│   └── application/       # Application forms
├── components/            # Reusable UI components
├── constants/             # App constants and theme
├── hooks/                 # Custom React hooks
├── services/              # Business logic services
├── store/                 # Redux store and slices
└── utils/                 # Utility functions
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator or Android Emulator (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd loantrack-mobile
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   ```

### Configuration

1. **Update app configuration** in `app.json`
2. **Configure Firebase** (when implementing)
3. **Set up push notifications** with Expo
4. **Configure API endpoints** in services

## Key Features Implementation

### Authentication Flow
```typescript
// Example authentication flow
const handleLogin = async (phone: string) => {
  await dispatch(sendOTP({ phone }));
  // Navigate to OTP verification
};

const handleVerifyOTP = async (otp: string) => {
  await dispatch(verifyOTP({ otp, phone }));
  // Navigate to dashboard
};
```

### Offline Document Upload
```typescript
// Offline document handling
const uploadDocument = async (file: File) => {
  if (isOnline) {
    await uploadToServer(file);
  } else {
    dispatch(addOfflineDocument(file));
    // Will sync when online
  }
};
```

### Loan Application Process
```typescript
// Application creation
const createApplication = async (data: ApplicationData) => {
  const application = await dispatch(createLoanApplication(data));
  // Navigate to document upload
};
```

## State Management

The app uses Redux Toolkit for state management with the following slices:

- **Auth Slice**: User authentication and profile
- **Loan Slice**: Loan applications and types
- **Offline Slice**: Offline data and sync status
- **Notification Slice**: Push notifications and alerts

## Styling & Theme

The app uses a consistent light theme with:
- **Primary Color**: #2196F3 (Blue)
- **Secondary Color**: #64B5F6 (Light Blue)
- **Background**: #FFFFFF (White)
- **Surface**: #F5F5F5 (Light Gray)
- **Status Colors**: Green (Approved), Orange (Pending), Red (Rejected)

## Testing

```bash
# Run tests
npm test

# Run linting
npm run lint

# Type checking
npm run type-check
```

## Building for Production

```bash
# Build for iOS
expo build:ios

# Build for Android
expo build:android

# Create development build
expo build:android --type development-build
```

## Deployment

1. **Configure app.json** with production settings
2. **Set up Firebase** for authentication and notifications
3. **Configure API endpoints** for production
4. **Build and submit** to app stores

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demo application with mock data and API calls. Replace mock implementations with actual backend integration for production use.