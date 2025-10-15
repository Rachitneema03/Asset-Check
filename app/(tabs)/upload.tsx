import { spacing, statusColors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { Document } from '@/store/slices/loanSlice';
import { addDocument } from '@/store/slices/loanSlice';
import { addOfflineDocument } from '@/store/slices/offlineSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, ProgressBar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function UploadScreen() {
  const [selectedApplication, setSelectedApplication] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const dispatch = useAppDispatch();
  const { applications } = useAppSelector(state => state.loan);
  const { isOnline } = useAppSelector(state => state.offline);
  const { user } = useAppSelector(state => state.auth);

  const isOfficer = user?.role === 'field_officer' || user?.role === 'manager';

  // Get applications that can have documents uploaded
  const availableApplications = applications.filter(app => 
    app.status !== 'rejected' && app.status !== 'draft'
  );

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload images.');
      return false;
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0], 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick image');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to take photos.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0], 'image');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'image/jpeg', 'image/png'],
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        await handleFileUpload(result.assets[0], 'pdf');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick document');
    }
  };

  const handleFileUpload = async (file: any, type: 'image' | 'pdf') => {
    if (!selectedApplication) {
      Alert.alert('Error', 'Please select an application first');
      return;
    }

    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Create document object
      const document: Document = {
        id: Date.now().toString(),
        type: type === 'pdf' ? 'pdf' : 'image',
        uri: file.uri,
        name: file.fileName || file.uri.split('/').pop() || 'document',
        size: file.fileSize || 0,
        uploadedAt: new Date().toISOString(),
        isVerified: false,
      };

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (isOnline) {
        // Add to application documents
        dispatch(addDocument({ applicationId: selectedApplication, document }));
      } else {
        // Add to offline queue
        dispatch(addOfflineDocument({
          id: document.id,
          type: document.type,
          uri: document.uri,
          name: document.name,
          size: document.size,
          applicationId: selectedApplication,
          uploadedAt: document.uploadedAt,
          isUploaded: false,
        }));
      }

      Alert.alert(
        'Success',
        isOnline 
          ? 'Document uploaded successfully!' 
          : 'Document saved offline and will be uploaded when online.'
      );

    } catch (error) {
      Alert.alert('Error', 'Failed to upload document');
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const showUploadOptions = () => {
    Alert.alert(
      'Upload Document',
      'Choose how you want to upload your document',
      [
        { text: 'Take Photo', onPress: takePhoto },
        { text: 'Choose from Gallery', onPress: pickImage },
        { text: 'Choose Document', onPress: pickDocument },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const getApplicationStatusColor = (status: string) => {
    return statusColors[status as keyof typeof statusColors] || '#9E9E9E';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineSmall" style={styles.title}>
            Upload Documents
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Upload documents for your loan applications
          </Text>
        </View>

        {/* Connection Status */}
        <Card style={styles.statusCard}>
          <Card.Content style={styles.statusContent}>
            <MaterialCommunityIcons
              name={isOnline ? 'wifi' : 'wifi-off'}
              size={20}
              color={isOnline ? statusColors.approved : statusColors.rejected}
            />
            <Text variant="bodyMedium" style={styles.statusText}>
              {isOnline ? 'Online - Documents will be uploaded immediately' : 'Offline - Documents will be queued for upload'}
            </Text>
          </Card.Content>
        </Card>

        {/* Application Selection */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Select Application
            </Text>
            
            {availableApplications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons name="file-document-outline" size={48} color="#999" />
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No applications available for document upload
                </Text>
                <Button
                  mode="contained"
                  onPress={() => router.push('/loan-type' as any)}
                  style={styles.emptyButton}
                >
                  Create Application
                </Button>
              </View>
            ) : (
              availableApplications.map((application) => (
                <View
                  key={application.id}
                  style={[
                    styles.applicationItem,
                    selectedApplication === application.id && styles.selectedApplication
                  ]}
                >
                  <TouchableOpacity
                    onPress={() => setSelectedApplication(application.id)}
                    style={styles.applicationTouchable}
                  >
                    <View style={styles.applicationInfo}>
                      <Text variant="bodyLarge" style={styles.applicationTitle}>
                        {application.loanType.replace('_', ' ').toUpperCase()} Loan
                      </Text>
                      <Text variant="bodyMedium" style={styles.applicationAmount}>
                        ₹{application.amount.toLocaleString()}
                      </Text>
                    </View>
                    <View style={styles.applicationStatus}>
                      <Chip
                        mode="outlined"
                        textStyle={{ color: getApplicationStatusColor(application.status) }}
                        style={[styles.statusChip, { borderColor: getApplicationStatusColor(application.status) }]}
                      >
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </Chip>
                      <Text variant="bodySmall" style={styles.documentCount}>
                        {application.documents.length} documents
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Upload Progress */}
        {uploading && (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Uploading Document
              </Text>
              <ProgressBar progress={uploadProgress / 100} color="#2196F3" />
              <Text variant="bodySmall" style={styles.progressText}>
                {uploadProgress}% complete
              </Text>
            </Card.Content>
          </Card>
        )}

        {/* Upload Instructions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Upload Instructions
            </Text>
            <View style={styles.instructionItem}>
              <MaterialCommunityIcons name="camera" size={20} color="#2196F3" />
              <Text variant="bodyMedium" style={styles.instructionText}>
                Take photos of physical documents
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <MaterialCommunityIcons name="file-document" size={20} color="#2196F3" />
              <Text variant="bodyMedium" style={styles.instructionText}>
                Upload PDF files from your device
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#2196F3" />
              <Text variant="bodyMedium" style={styles.instructionText}>
                Ensure documents are clear and readable
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>

      {/* Upload Button */}
      <View style={styles.bottomContainer}>
        <Button
          mode="contained"
          onPress={showUploadOptions}
          disabled={!selectedApplication || uploading}
          loading={uploading}
          style={styles.uploadButton}
          contentStyle={styles.buttonContent}
          icon="cloud-upload"
        >
          {uploading ? 'Uploading...' : 'Upload Document'}
        </Button>
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
    paddingBottom: 100,
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
  statusCard: {
    marginBottom: spacing.lg,
    backgroundColor: '#F8F9FA',
  },
  statusContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: spacing.sm,
    color: '#333',
  },
  card: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.md,
  },
  applicationItem: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    marginBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  selectedApplication: {
    borderColor: '#2196F3',
    backgroundColor: '#E3F2FD',
  },
  applicationTouchable: {
    padding: spacing.md,
  },
  applicationInfo: {
    marginBottom: spacing.sm,
  },
  applicationTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  applicationAmount: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  applicationStatus: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusChip: {
    marginRight: spacing.sm,
  },
  documentCount: {
    color: '#666',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: '#999',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  progressText: {
    marginTop: spacing.sm,
    textAlign: 'center',
    color: '#666',
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  instructionText: {
    marginLeft: spacing.md,
    color: '#333',
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
  uploadButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
});
