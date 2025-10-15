import { spacing, statusColors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Card, DataTable, SegmentedButtons, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width } = Dimensions.get('window');

export default function ReportsScreen() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');
  
  const { applications } = useAppSelector(state => state.loan);
  const { user } = useAppSelector(state => state.auth);

  const isOfficer = user?.role === 'field_officer' || user?.role === 'manager';

  if (!isOfficer) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <MaterialCommunityIcons name="lock" size={64} color="#999" />
          <Text variant="headlineSmall" style={styles.errorTitle}>
            Access Restricted
          </Text>
          <Text variant="bodyMedium" style={styles.errorText}>
            This section is only available for officers and managers.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const getStats = () => {
    const total = applications.length;
    const pending = applications.filter(app => app.status === 'pending').length;
    const approved = applications.filter(app => app.status === 'approved').length;
    const rejected = applications.filter(app => app.status === 'rejected').length;
    const clarification = applications.filter(app => app.status === 'clarification').length;
    
    return { total, pending, approved, rejected, clarification };
  };

  const getLoanTypeStats = () => {
    const loanTypes = ['home', 'education', 'vehicle', 'personal', 'business', 'gold', 'lap', 'agriculture'];
    return loanTypes.map(type => {
      const typeApplications = applications.filter(app => app.loanType === type);
      const approved = typeApplications.filter(app => app.status === 'approved').length;
      const pending = typeApplications.filter(app => app.status === 'pending').length;
      const rejected = typeApplications.filter(app => app.status === 'rejected').length;
      
      return {
        type: type.charAt(0).toUpperCase() + type.slice(1),
        total: typeApplications.length,
        approved,
        pending,
        rejected,
        approvalRate: typeApplications.length > 0 ? (approved / typeApplications.length * 100).toFixed(1) : '0',
      };
    }).filter(stat => stat.total > 0);
  };

  const getRecentApplications = () => {
    return applications
      .sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime())
      .slice(0, 10);
  };

  const stats = getStats();
  const loanTypeStats = getLoanTypeStats();
  const recentApplications = getRecentApplications();

  const renderOverviewCards = () => (
    <View style={styles.statsContainer}>
      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <MaterialCommunityIcons name="file-document-multiple" size={32} color="#2196F3" />
          <Text variant="headlineMedium" style={styles.statNumber}>
            {stats.total}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Total Applications
          </Text>
        </Card.Content>
      </Card>
      
      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <MaterialCommunityIcons name="clock" size={32} color={statusColors.pending} />
          <Text variant="headlineMedium" style={[styles.statNumber, { color: statusColors.pending }]}>
            {stats.pending}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Pending Review
          </Text>
        </Card.Content>
      </Card>
      
      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <MaterialCommunityIcons name="check-circle" size={32} color={statusColors.approved} />
          <Text variant="headlineMedium" style={[styles.statNumber, { color: statusColors.approved }]}>
            {stats.approved}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Approved
          </Text>
        </Card.Content>
      </Card>
      
      <Card style={styles.statCard}>
        <Card.Content style={styles.statContent}>
          <MaterialCommunityIcons name="close-circle" size={32} color={statusColors.rejected} />
          <Text variant="headlineMedium" style={[styles.statNumber, { color: statusColors.rejected }]}>
            {stats.rejected}
          </Text>
          <Text variant="bodySmall" style={styles.statLabel}>
            Rejected
          </Text>
        </Card.Content>
      </Card>
    </View>
  );

  const renderLoanTypeBreakdown = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Loan Type Breakdown
        </Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Loan Type</DataTable.Title>
            <DataTable.Title numeric>Total</DataTable.Title>
            <DataTable.Title numeric>Approved</DataTable.Title>
            <DataTable.Title numeric>Rate</DataTable.Title>
          </DataTable.Header>
          
          {loanTypeStats.map((stat, index) => (
            <DataTable.Row key={index}>
              <DataTable.Cell>{stat.type}</DataTable.Cell>
              <DataTable.Cell numeric>{stat.total}</DataTable.Cell>
              <DataTable.Cell numeric>{stat.approved}</DataTable.Cell>
              <DataTable.Cell numeric>{stat.approvalRate}%</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );

  const renderRecentApplications = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text variant="titleMedium" style={styles.sectionTitle}>
          Recent Applications
        </Text>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>Loan Type</DataTable.Title>
            <DataTable.Title numeric>Amount</DataTable.Title>
            <DataTable.Title>Status</DataTable.Title>
            <DataTable.Title>Date</DataTable.Title>
          </DataTable.Header>
          
          {recentApplications.map((application) => (
            <DataTable.Row key={application.id}>
              <DataTable.Cell>{application.loanType.replace('_', ' ').toUpperCase()}</DataTable.Cell>
              <DataTable.Cell numeric>₹{application.amount.toLocaleString()}</DataTable.Cell>
              <DataTable.Cell>
                <View style={[
                  styles.statusBadge,
                  { backgroundColor: statusColors[application.status as keyof typeof statusColors] + '20' }
                ]}>
                  <Text style={[
                    styles.statusText,
                    { color: statusColors[application.status as keyof typeof statusColors] }
                  ]}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Text>
                </View>
              </DataTable.Cell>
              <DataTable.Cell>{new Date(application.submittedAt).toLocaleDateString()}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </Card.Content>
    </Card>
  );

  const renderAnalytics = () => (
    <View>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleMedium" style={styles.sectionTitle}>
            Performance Metrics
          </Text>
          
          <View style={styles.metricItem}>
            <Text variant="bodyMedium" style={styles.metricLabel}>
              Overall Approval Rate
            </Text>
            <Text variant="headlineSmall" style={styles.metricValue}>
              {stats.total > 0 ? ((stats.approved / stats.total) * 100).toFixed(1) : 0}%
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text variant="bodyMedium" style={styles.metricLabel}>
              Average Processing Time
            </Text>
            <Text variant="headlineSmall" style={styles.metricValue}>
              2.3 days
            </Text>
          </View>
          
          <View style={styles.metricItem}>
            <Text variant="bodyMedium" style={styles.metricLabel}>
              Total Loan Amount Processed
            </Text>
            <Text variant="headlineSmall" style={styles.metricValue}>
              ₹{applications.reduce((sum, app) => sum + app.amount, 0).toLocaleString()}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Reports & Analytics
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Track performance and loan statistics
        </Text>
      </View>

      <View style={styles.controlsContainer}>
        <SegmentedButtons
          value={selectedPeriod}
          onValueChange={setSelectedPeriod}
          buttons={[
            { value: 'week', label: 'Week' },
            { value: 'month', label: 'Month' },
            { value: 'quarter', label: 'Quarter' },
            { value: 'year', label: 'Year' },
          ]}
          style={styles.segmentedButtons}
        />
        
        <SegmentedButtons
          value={selectedView}
          onValueChange={setSelectedView}
          buttons={[
            { value: 'overview', label: 'Overview' },
            { value: 'analytics', label: 'Analytics' },
          ]}
          style={styles.segmentedButtons}
        />
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {selectedView === 'overview' ? (
          <>
            {renderOverviewCards()}
            {renderLoanTypeBreakdown()}
            {renderRecentApplications()}
          </>
        ) : (
          renderAnalytics()
        )}

        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Export Options
            </Text>
            <View style={styles.exportButtons}>
              <Button
                mode="outlined"
                icon="file-pdf-box"
                style={styles.exportButton}
                onPress={() => {
                  // Handle PDF export
                }}
              >
                Export PDF
              </Button>
              <Button
                mode="outlined"
                icon="file-excel"
                style={styles.exportButton}
                onPress={() => {
                  // Handle CSV export
                }}
              >
                Export CSV
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  title: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  subtitle: {
    color: '#666',
  },
  controlsContainer: {
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
    gap: spacing.md,
  },
  segmentedButtons: {
    marginBottom: spacing.sm,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  statCard: {
    width: (width - spacing.lg * 3) / 2,
    elevation: 2,
  },
  statContent: {
    alignItems: 'center',
    padding: spacing.md,
  },
  statNumber: {
    fontWeight: 'bold',
    color: '#2196F3',
    marginTop: spacing.sm,
  },
  statLabel: {
    color: '#666',
    textAlign: 'center',
    marginTop: spacing.xs,
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
  statusBadge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  metricItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  metricLabel: {
    color: '#666',
  },
  metricValue: {
    fontWeight: 'bold',
    color: '#2196F3',
  },
  exportButtons: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  exportButton: {
    flex: 1,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  errorTitle: {
    color: '#999',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  errorText: {
    color: '#999',
    textAlign: 'center',
  },
});
