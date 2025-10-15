import { spacing, statusColors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, Text, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApplicationDetailsScreen() {
  const theme = useTheme();
  const { applicationId } = useLocalSearchParams();
  const { applications } = useAppSelector(state => state.loan);
  
  const application = applications.find(app => app.id === applicationId);

  if (!application) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="alert-circle" size={64} color={theme.colors.error} />
          <Text variant="headlineSmall" style={styles.errorText}>
            Application not found
          </Text>
          <Button mode="contained" onPress={() => router.back()}>
            Go Back
          </Button>
        </View>
      </SafeAreaView>
    );
  }

  const getStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#9E9E9E';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return 'check-circle';
      case 'rejected':
        return 'close-circle';
      case 'clarification':
        return 'help-circle';
      case 'pending':
        return 'clock';
      case 'draft':
        return 'file-document-outline';
      default:
        return 'file-document';
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: theme.colors.primary }]}>
          Application Details
        </Text>

        <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
          <Card.Content>
            <View style={styles.header}>
              <Text variant="titleLarge" style={[styles.loanType, { color: theme.colors.onSurface }]}>
                {application.loanType.replace('_', ' ').toUpperCase()} Loan
              </Text>
              <Chip
                mode="outlined"
                textStyle={{ color: getStatusColor(application.status) }}
                style={[styles.statusChip, { borderColor: getStatusColor(application.status) }]}
                icon={getStatusIcon(application.status)}
              >
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Chip>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Application ID:</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>{application.id}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Amount:</Text>
                <Text variant="bodyMedium" style={[styles.detailValue, { color: theme.colors.primary }]}>
                  ₹{application.amount.toLocaleString()}
                </Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Purpose:</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>{application.purpose}</Text>
              </View>
              
              <View style={styles.detailRow}>
                <Text variant="bodyMedium" style={styles.detailLabel}>Submitted:</Text>
                <Text variant="bodyMedium" style={styles.detailValue}>
                  {new Date(application.submittedAt).toLocaleDateString()}
                </Text>
              </View>

              {application.reviewedAt && (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>Reviewed:</Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>
                    {new Date(application.reviewedAt).toLocaleDateString()}
                  </Text>
                </View>
              )}

              {application.reviewedBy && (
                <View style={styles.detailRow}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>Reviewed By:</Text>
                  <Text variant="bodyMedium" style={styles.detailValue}>{application.reviewedBy}</Text>
                </View>
              )}

              {application.notes && (
                <View style={styles.notesSection}>
                  <Text variant="bodyMedium" style={styles.detailLabel}>Notes:</Text>
                  <Text variant="bodyMedium" style={styles.notesText}>{application.notes}</Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>

        {application.documents.length > 0 && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Documents ({application.documents.length})
              </Text>
              {application.documents.map((doc, index) => (
                <View key={index} style={styles.documentItem}>
                  <MaterialCommunityIcons 
                    name={doc.type === 'pdf' ? 'file-pdf-box' : 'file-image'} 
                    size={24} 
                    color={theme.colors.primary} 
                  />
                  <View style={styles.documentInfo}>
                    <Text variant="bodyMedium" style={styles.documentName}>{doc.name}</Text>
                    <Text variant="bodySmall" style={styles.documentSize}>
                      {(doc.size / 1024).toFixed(1)} KB
                    </Text>
                  </View>
                  {doc.isVerified && (
                    <Chip mode="outlined" style={styles.verifiedChip}>
                      Verified
                    </Chip>
                  )}
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {application.location && (
          <Card style={[styles.card, { backgroundColor: theme.colors.surface }]}>
            <Card.Content>
              <Text variant="titleMedium" style={[styles.sectionTitle, { color: theme.colors.onSurface }]}>
                Location
              </Text>
              <View style={styles.locationInfo}>
                <MaterialCommunityIcons name="map-marker" size={24} color={theme.colors.primary} />
                <View style={styles.locationDetails}>
                  <Text variant="bodyMedium" style={styles.locationText}>
                    {application.location.address}
                  </Text>
                  <Text variant="bodySmall" style={styles.coordinatesText}>
                    {application.location.latitude.toFixed(4)}, {application.location.longitude.toFixed(4)}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        <View style={styles.buttonContainer}>
          <Button
            mode="outlined"
            onPress={() => router.back()}
            style={styles.backButton}
            labelStyle={{ color: theme.colors.primary }}
          >
            Back
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  loanType: {
    fontWeight: 'bold',
    flex: 1,
  },
  statusChip: {
    marginLeft: spacing.md,
  },
  detailsSection: {
    gap: spacing.md,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    color: '#666',
    flex: 1,
  },
  detailValue: {
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'right',
  },
  notesSection: {
    marginTop: spacing.md,
  },
  notesText: {
    marginTop: spacing.xs,
    fontStyle: 'italic',
    color: '#666',
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
  },
  documentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  documentInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  documentName: {
    fontWeight: 'bold',
  },
  documentSize: {
    color: '#666',
  },
  verifiedChip: {
    marginLeft: spacing.sm,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  locationDetails: {
    flex: 1,
    marginLeft: spacing.sm,
  },
  locationText: {
    fontWeight: 'bold',
  },
  coordinatesText: {
    color: '#666',
    marginTop: spacing.xs,
  },
  buttonContainer: {
    marginTop: spacing.lg,
  },
  backButton: {
    borderColor: '#2196F3',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorText: {
    color: '#F44336',
    marginTop: spacing.lg,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
});
