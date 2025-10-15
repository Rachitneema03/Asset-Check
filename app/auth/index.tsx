import { spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { clearError, sendOTP, verifyOTP } from '@/store/slices/authSlice';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, RadioButton, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthScreen() {
  const [userType, setUserType] = useState<'beneficiary' | 'officer'>('beneficiary');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'input' | 'otp'>('input');
  
  const dispatch = useAppDispatch();
  const { isLoading, error, otpSent, isAuthenticated } = useAppSelector(state => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  React.useEffect(() => {
    if (otpSent && step === 'input') {
      setStep('otp');
    }
  }, [otpSent, step]);

  const handleSendOTP = async () => {
    if (userType === 'beneficiary' && !phone.trim()) {
      return;
    }
    if (userType === 'officer' && !email.trim()) {
      return;
    }

    dispatch(clearError());
    await dispatch(sendOTP({ 
      phone: userType === 'beneficiary' ? phone : undefined,
      email: userType === 'officer' ? email : undefined 
    }));
  };

  const handleVerifyOTP = async () => {
    if (!otp.trim()) return;

    dispatch(clearError());
    await dispatch(verifyOTP({ 
      otp, 
      phone: userType === 'beneficiary' ? phone : undefined,
      email: userType === 'officer' ? email : undefined 
    }));
  };

  const handleBackToInput = () => {
    setStep('input');
    setOtp('');
    dispatch(clearError());
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text variant="headlineMedium" style={styles.title}>
              Welcome to LoanTrack
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Track and verify loan utilization
            </Text>
          </View>

          <Card style={styles.card}>
            <Card.Content>
              {step === 'input' ? (
                <>
                  <Text variant="titleLarge" style={styles.sectionTitle}>
                    Select User Type
                  </Text>
                  
                   <RadioButton.Group onValueChange={(value) => setUserType(value as 'beneficiary' | 'officer')} value={userType}>
                    <View style={styles.radioContainer}>
                      <RadioButton.Item 
                        label="Beneficiary" 
                        value="beneficiary" 
                        style={styles.radioItem}
                      />
                      <RadioButton.Item 
                        label="Officer" 
                        value="officer" 
                        style={styles.radioItem}
                      />
                    </View>
                  </RadioButton.Group>

                  <Text variant="titleMedium" style={styles.inputLabel}>
                    {userType === 'beneficiary' ? 'Mobile Number' : 'Email Address'}
                  </Text>
                  
                  <TextInput
                    mode="outlined"
                    value={userType === 'beneficiary' ? phone : email}
                    onChangeText={userType === 'beneficiary' ? setPhone : setEmail}
                    placeholder={userType === 'beneficiary' ? 'Enter mobile number' : 'Enter email address'}
                    keyboardType={userType === 'beneficiary' ? 'phone-pad' : 'email-address'}
                    style={styles.input}
                    error={!!error}
                  />

                  {error && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {error}
                    </Text>
                  )}

                  <Button
                    mode="contained"
                    onPress={handleSendOTP}
                    loading={isLoading}
                    disabled={isLoading || (userType === 'beneficiary' ? !phone.trim() : !email.trim())}
                    style={styles.button}
                  >
                    Send OTP
                  </Button>
                </>
              ) : (
                <>
                  <Text variant="titleLarge" style={styles.sectionTitle}>
                    Verify OTP
                  </Text>
                  
                  <Text variant="bodyMedium" style={styles.otpDescription}>
                    Enter the 6-digit OTP sent to {userType === 'beneficiary' ? phone : email}
                  </Text>
                  
                  <TextInput
                    mode="outlined"
                    value={otp}
                    onChangeText={setOtp}
                    placeholder="Enter OTP"
                    keyboardType="number-pad"
                    maxLength={6}
                    style={styles.input}
                    error={!!error}
                  />

                  {error && (
                    <Text variant="bodySmall" style={styles.errorText}>
                      {error}
                    </Text>
                  )}

                  <View style={styles.buttonContainer}>
                    <Button
                      mode="outlined"
                      onPress={handleBackToInput}
                      style={[styles.button, styles.backButton]}
                    >
                      Back
                    </Button>
                    <Button
                      mode="contained"
                      onPress={handleVerifyOTP}
                      loading={isLoading}
                      disabled={isLoading || !otp.trim()}
                      style={styles.button}
                    >
                      Verify OTP
                    </Button>
                  </View>
                </>
              )}
            </Card.Content>
          </Card>

          <View style={styles.footer}>
            <Text variant="bodySmall" style={styles.footerText}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: spacing.lg,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    marginTop: spacing.xxl,
  },
  title: {
    textAlign: 'center',
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: spacing.sm,
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
  },
  card: {
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: '#333',
  },
  radioContainer: {
    marginBottom: spacing.lg,
  },
  radioItem: {
    marginBottom: spacing.xs,
  },
  inputLabel: {
    marginBottom: spacing.sm,
    color: '#333',
  },
  input: {
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#F44336',
    marginBottom: spacing.md,
  },
  button: {
    marginTop: spacing.md,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.md,
  },
  backButton: {
    flex: 1,
  },
  otpDescription: {
    marginBottom: spacing.md,
    color: '#666',
  },
  footer: {
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  footerText: {
    textAlign: 'center',
    color: '#999',
  },
});
