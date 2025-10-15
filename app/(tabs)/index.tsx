import { spacing, statusColors } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addMockNotifications } from '@/store/slices/notificationSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, Chip, FAB, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function DashboardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { applications } = useAppSelector(state => state.loan);
  const { notifications, unreadCount } = useAppSelector(state => state.notification);

  const isOfficer = user?.role === 'field_officer' || user?.role === 'manager';

  useEffect(() => {
    // Add mock notifications for demo
    dispatch(addMockNotifications());
  }, [dispatch]);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Simulate refresh
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

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
      default:
        return 'file-document';
    }
  };

  const getRecentApplications = () => {
    if (isOfficer) {
      // For officers, show all applications
      return applications.slice(0, 5);
    } else {
      // For beneficiaries, show their applications
      return applications.filter(app => app.status !== 'draft').slice(0, 5);
    }
  };

  const getStats = () => {
    if (isOfficer) {
      const total = applications.length;
      const pending = applications.filter(app => app.status === 'pending').length;
      const approved = applications.filter(app => app.status === 'approved').length;
      const rejected = applications.filter(app => app.status === 'rejected').length;
      
      return { total, pending, approved, rejected };
    } else {
      const userApplications = applications.filter(app => app.status !== 'draft');
      const pending = userApplications.filter(app => app.status === 'pending').length;
      const approved = userApplications.filter(app => app.status === 'approved').length;
      const rejected = userApplications.filter(app => app.status === 'rejected').length;
      
      return { 
        total: userApplications.length, 
        pending, 
        approved, 
        rejected 
      };
    }
  };

  const stats = getStats();
  const recentApplications = getRecentApplications();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text variant="headlineSmall" style={styles.greeting}>
              Welcome back, {user?.name}!
            </Text>
            <Text variant="bodyMedium" style={styles.role}>
              {isOfficer ? 'Field Officer' : 'Beneficiary'}
            </Text>
          </View>
          <View style={styles.notificationContainer}>
            <MaterialCommunityIcons 
              name="bell" 
              size={24} 
              color="#2196F3" 
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={styles.statNumber}>
                {stats.total}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Total {isOfficer ? 'Applications' : 'Loans'}
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={[styles.statNumber, { color: statusColors.pending }]}>
                {stats.pending}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Pending
              </Text>
            </Card.Content>
          </Card>
          
          <Card style={styles.statCard}>
            <Card.Content style={styles.statContent}>
              <Text variant="headlineMedium" style={[styles.statNumber, { color: statusColors.approved }]}>
                {stats.approved}
              </Text>
              <Text variant="bodySmall" style={styles.statLabel}>
                Approved
              </Text>
            </Card.Content>
          </Card>
        </View>

        {/* Quick Actions */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Quick Actions
            </Text>
            <View style={styles.actionsContainer}>
              {!isOfficer && (
                <Button
                  mode="contained"
                  onPress={() => router.push('/loan-type' as any)}
                  style={styles.actionButton}
                  icon="plus"
                >
                  New Application
                </Button>
              )}
              <Button
                mode="outlined"
                onPress={() => router.push('/(tabs)/upload')}
                style={styles.actionButton}
                icon="cloud-upload"
              >
                Upload Documents
              </Button>
            </View>
          </Card.Content>
        </Card>

        {/* Recent Applications */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <Text variant="titleMedium" style={styles.sectionTitle}>
                Recent {isOfficer ? 'Applications' : 'Loans'}
              </Text>
              <Button
                mode="text"
                onPress={() => router.push('/(tabs)/applications')}
                compact
              >
                View All
              </Button>
            </View>
            
            {recentApplications.length === 0 ? (
              <View style={styles.emptyContainer}>
                <MaterialCommunityIcons 
                  name="file-document-outline" 
                  size={48} 
                  color="#999" 
                />
                <Text variant="bodyMedium" style={styles.emptyText}>
                  No {isOfficer ? 'applications' : 'loans'} yet
                </Text>
                {!isOfficer && (
                  <Button
                    mode="contained"
                    onPress={() => router.push('/loan-type' as any)}
                    style={styles.emptyButton}
                  >
                    Create First Application
                  </Button>
                )}
              </View>
            ) : (
              recentApplications.map((application) => (
                <View key={application.id} style={styles.applicationItem}>
                  <View style={styles.applicationInfo}>
                    <Text variant="bodyLarge" style={styles.applicationTitle}>
                      {application.loanType.replace('_', ' ').toUpperCase()} Loan
                    </Text>
                    <Text variant="bodyMedium" style={styles.applicationAmount}>
                      ₹{application.amount.toLocaleString()}
                    </Text>
                  </View>
                  <Chip
                    mode="outlined"
                    textStyle={{ color: getStatusColor(application.status) }}
                    style={[styles.statusChip, { borderColor: getStatusColor(application.status) }]}
                    icon={getStatusIcon(application.status)}
                  >
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Chip>
                </View>
              ))
            )}
          </Card.Content>
        </Card>

        {/* Notifications Preview */}
        {notifications.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <View style={styles.sectionHeader}>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Recent Notifications
                </Text>
                <Button
                  mode="text"
                  onPress={() => router.push('/(tabs)/profile')}
                  compact
                >
                  View All
                </Button>
              </View>
              
              {notifications.slice(0, 3).map((notification) => (
                <View key={notification.id} style={styles.notificationItem}>
                  <MaterialCommunityIcons
                    name={notification.type === 'success' ? 'check-circle' : 
                          notification.type === 'error' ? 'alert-circle' :
                          notification.type === 'warning' ? 'alert' : 'information'}
                    size={20}
                    color={notification.type === 'success' ? statusColors.approved :
                           notification.type === 'error' ? statusColors.rejected :
                           notification.type === 'warning' ? statusColors.clarification : '#2196F3'}
                  />
                  <View style={styles.notificationContent}>
                    <Text variant="bodyMedium" style={styles.notificationTitle}>
                      {notification.title}
                    </Text>
                    <Text variant="bodySmall" style={styles.notificationBody}>
                      {notification.body}
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}
      </ScrollView>

      {/* Floating Action Button */}
      {!isOfficer && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => router.push('/loan-type' as any)}
        />
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  greeting: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  role: {
    color: '#666',
  },
  notificationContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    flex: 1,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
  },
  card: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: '#333',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  actionsContainer: {
    gap: spacing.md,
  },
  actionButton: {
    marginBottom: spacing.sm,
  },
  applicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  applicationInfo: {
    flex: 1,
  },
  applicationTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  applicationAmount: {
    color: '#666',
  },
  statusChip: {
    marginLeft: spacing.md,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
  },
  emptyText: {
    color: '#999',
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  notificationContent: {
    flex: 1,
    marginLeft: spacing.md,
  },
  notificationTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  notificationBody: {
    color: '#666',
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});