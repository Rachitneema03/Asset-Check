import { spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createLoanApplication, updateLoanApplication } from '@/store/slices/loanSlice';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Divider, Text, TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApplicationFormScreen() {
  const [amount, setAmount] = useState('');
  const [purpose, setPurpose] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const dispatch = useAppDispatch();
  const { currentApplication, loanTypes, isLoading } = useAppSelector(state => state.loan);
  const { user } = useAppSelector(state => state.auth);

  const selectedLoanType = loanTypes.find(type => type.id === currentApplication?.loanType);

  useEffect(() => {
    if (currentApplication) {
      setAmount(currentApplication.amount.toString());
      setPurpose(currentApplication.purpose);
    }
  }, [currentApplication]);

  const handleSubmit = async () => {
    if (!amount.trim() || !purpose.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    if (selectedLoanType && amountValue > selectedLoanType.maxAmount) {
      Alert.alert('Error', `Amount cannot exceed ₹${selectedLoanType.maxAmount.toLocaleString()}`);
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentApplication?.id) {
        // Update existing application
        await dispatch(updateLoanApplication({
          id: currentApplication.id,
          updates: {
            amount: amountValue,
            purpose: purpose.trim(),
            status: 'pending',
          }
        }));
      } else {
        // Create new application
         await dispatch(createLoanApplication({
           loanType: currentApplication?.loanType || '',
           amount: amountValue,
           purpose: purpose.trim(),
           documents: [],
         }));
      }

      Alert.alert(
        'Success',
        'Your loan application has been submitted successfully!',
        [
          {
            text: 'OK',
            onPress: () => router.replace('/(tabs)'),
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to submit application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async () => {
    if (!amount.trim() && !purpose.trim()) {
      Alert.alert('Error', 'Please fill in at least one field to save as draft');
      return;
    }

    setIsSubmitting(true);

    try {
      if (currentApplication?.id) {
        await dispatch(updateLoanApplication({
          id: currentApplication.id,
          updates: {
            amount: amount ? parseFloat(amount) : 0,
            purpose: purpose.trim(),
            status: 'draft',
          }
        }));
      } else {
         await dispatch(createLoanApplication({
           loanType: currentApplication?.loanType || '',
           amount: amount ? parseFloat(amount) : 0,
           purpose: purpose.trim(),
           documents: [],
         }));
      }

      Alert.alert('Draft Saved', 'Your application has been saved as draft.');
    } catch (error) {
      Alert.alert('Error', 'Failed to save draft. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!selectedLoanType) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text variant="headlineSmall" style={styles.errorText}>
            Loan type not found
          </Text>
          <Button mode="contained" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Loan Application
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Complete your {selectedLoanType.name} application
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Loan Details
            </Text>
            
            <View style={styles.loanTypeInfo}>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>Loan Type:</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {selectedLoanType.name}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>Max Amount:</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  ₹{selectedLoanType.maxAmount.toLocaleString()}
                </Text>
              </View>
              <View style={styles.infoRow}>
                <Text variant="bodyMedium" style={styles.infoLabel}>Interest Rate:</Text>
                <Text variant="bodyMedium" style={styles.infoValue}>
                  {selectedLoanType.interestRate}%
                </Text>
              </View>
            </View>

            <Divider style={styles.divider} />

            <Text variant="titleMedium" style={styles.sectionTitle}>
              Application Information
            </Text>

            <TextInput
              mode="outlined"
              label="Loan Amount *"
              value={amount}
              onChangeText={setAmount}
              placeholder="Enter loan amount"
              keyboardType="numeric"
              style={styles.input}
              right={<TextInput.Affix text="₹" />}
            />

            <TextInput
              mode="outlined"
              label="Purpose of Loan *"
              value={purpose}
              onChangeText={setPurpose}
              placeholder="Describe the purpose of your loan"
              multiline
              numberOfLines={4}
              style={styles.input}
            />

            <Text variant="bodySmall" style={styles.requiredText}>
              * Required fields
            </Text>
          </Card.Content>
        </Card>

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Required Documents
            </Text>
            {selectedLoanType.requiredDocuments.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <Text variant="bodyMedium" style={styles.documentText}>
                  • {doc}
                </Text>
              </View>
            ))}
            <Text variant="bodySmall" style={styles.documentNote}>
              You can upload these documents after submitting your application.
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>

      <View style={styles.bottomContainer}>
        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={handleSaveDraft}
            loading={isSubmitting}
            disabled={isSubmitting}
            style={[styles.button, styles.draftButton]}
          >
            Save Draft
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={isSubmitting}
            disabled={isSubmitting || !amount.trim() || !purpose.trim()}
            style={[styles.button, styles.submitButton]}
          >
            Submit Application
          </Button>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    paddingBottom: 120, // Space for bottom container
  },
  header: {
    marginBottom: spacing.lg,
  },
  title: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#666',
  },
  card: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: spacing.md,
    color: '#333',
    fontWeight: 'bold',
  },
  loanTypeInfo: {
    backgroundColor: '#F8F9FA',
    padding: spacing.md,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  infoLabel: {
    color: '#666',
  },
  infoValue: {
    fontWeight: 'bold',
    color: '#333',
  },
  divider: {
    marginVertical: spacing.md,
  },
  input: {
    marginBottom: spacing.md,
  },
  requiredText: {
    color: '#999',
    fontStyle: 'italic',
  },
  documentItem: {
    marginBottom: spacing.xs,
  },
  documentText: {
    color: '#333',
  },
  documentNote: {
    color: '#666',
    fontStyle: 'italic',
    marginTop: spacing.md,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    padding: spacing.lg,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  button: {
    flex: 1,
  },
  draftButton: {
    borderColor: '#2196F3',
  },
  submitButton: {
    backgroundColor: '#2196F3',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: '#F44336',
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
