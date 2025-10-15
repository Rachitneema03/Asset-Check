import { spacing, statusColors } from '@/constants/theme';
import { useAppSelector } from '@/store/hooks';
import type { LoanApplication } from '@/store/slices/loanSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Button, Card, Chip, FAB, Menu, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApplicationsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [menuVisible, setMenuVisible] = useState(false);
  
  const { user } = useAppSelector(state => state.auth);
  const { applications } = useAppSelector(state => state.loan);

  const isOfficer = user?.role === 'field_officer' || user?.role === 'manager';

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

  const filteredApplications = applications.filter(app => {
    const matchesSearch = app.loanType.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.purpose.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    
    // For beneficiaries, don't show draft applications in the main list
    if (!isOfficer && app.status === 'draft') {
      return false;
    }
    
    return matchesSearch && matchesFilter;
  });

  const getFilterOptions = () => {
    if (isOfficer) {
      return [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Clarification', value: 'clarification' },
      ];
    } else {
      return [
        { label: 'All', value: 'all' },
        { label: 'Pending', value: 'pending' },
        { label: 'Approved', value: 'approved' },
        { label: 'Rejected', value: 'rejected' },
        { label: 'Clarification', value: 'clarification' },
      ];
    }
  };

  const renderApplicationCard = ({ item }: { item: LoanApplication }) => (
    <TouchableOpacity
      onPress={() => {
        // Navigate to application details
         router.push({
           pathname: '/application/details' as any,
           params: { applicationId: item.id }
         });
      }}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.cardHeader}>
            <View style={styles.applicationInfo}>
              <Text variant="titleMedium" style={styles.loanType}>
                {item.loanType.replace('_', ' ').toUpperCase()} Loan
              </Text>
              <Text variant="bodyLarge" style={styles.amount}>
                ₹{item.amount.toLocaleString()}
              </Text>
            </View>
            <Chip
              mode="outlined"
              textStyle={{ color: getStatusColor(item.status) }}
              style={[styles.statusChip, { borderColor: getStatusColor(item.status) }]}
              icon={getStatusIcon(item.status)}
            >
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Chip>
          </View>
          
          <Text variant="bodyMedium" style={styles.purpose} numberOfLines={2}>
            {item.purpose}
          </Text>
          
          <View style={styles.cardFooter}>
            <View style={styles.dateContainer}>
              <MaterialCommunityIcons name="calendar" size={16} color="#666" />
              <Text variant="bodySmall" style={styles.date}>
                {new Date(item.submittedAt).toLocaleDateString()}
              </Text>
            </View>
            
            {item.documents.length > 0 && (
              <View style={styles.documentsContainer}>
                <MaterialCommunityIcons name="file-document" size={16} color="#666" />
                <Text variant="bodySmall" style={styles.documentCount}>
                  {item.documents.length} documents
                </Text>
              </View>
            )}
          </View>
          
          {isOfficer && item.status === 'pending' && (
            <View style={styles.actionButtons}>
              <Button
                mode="outlined"
                compact
                onPress={() => {
                  // Handle approve action
                }}
                style={[styles.actionButton, { borderColor: statusColors.approved }]}
                textColor={statusColors.approved}
              >
                Approve
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => {
                  // Handle reject action
                }}
                style={[styles.actionButton, { borderColor: statusColors.rejected }]}
                textColor={statusColors.rejected}
              >
                Reject
              </Button>
              <Button
                mode="outlined"
                compact
                onPress={() => {
                  // Handle clarification action
                }}
                style={[styles.actionButton, { borderColor: statusColors.clarification }]}
                textColor={statusColors.clarification}
              >
                Clarify
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <MaterialCommunityIcons 
        name="file-document-outline" 
        size={64} 
        color="#999" 
      />
      <Text variant="headlineSmall" style={styles.emptyTitle}>
        No {isOfficer ? 'Applications' : 'Loans'} Found
      </Text>
      <Text variant="bodyMedium" style={styles.emptyText}>
        {isOfficer 
          ? 'No loan applications to review at the moment.'
          : 'You haven\'t applied for any loans yet.'
        }
      </Text>
      {!isOfficer && (
        <Button
          mode="contained"
           onPress={() => router.push('/loan-type' as any)}
          style={styles.emptyButton}
        >
          Apply for Loan
        </Button>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          {isOfficer ? 'Loan Applications' : 'My Loans'}
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          {isOfficer ? 'Review and manage applications' : 'Track your loan applications'}
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder={`Search ${isOfficer ? 'applications' : 'loans'}...`}
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <View style={styles.filterContainer}>
        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <Button
              mode="outlined"
              onPress={() => setMenuVisible(true)}
              icon="filter"
              style={styles.filterButton}
            >
              Filter: {getFilterOptions().find(opt => opt.value === filterStatus)?.label}
            </Button>
          }
        >
          {getFilterOptions().map((option) => (
            <Menu.Item
              key={option.value}
              onPress={() => {
                setFilterStatus(option.value);
                setMenuVisible(false);
              }}
              title={option.label}
            />
          ))}
        </Menu>
      </View>

      <FlatList
        data={filteredApplications}
        renderItem={renderApplicationCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />

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
  searchContainer: {
    padding: spacing.lg,
    backgroundColor: '#FFFFFF',
  },
  searchbar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: '#FFFFFF',
  },
  filterButton: {
    alignSelf: 'flex-start',
  },
  listContainer: {
    padding: spacing.lg,
    paddingBottom: 100,
  },
  card: {
    marginBottom: spacing.md,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  applicationInfo: {
    flex: 1,
  },
  loanType: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  amount: {
    color: '#2196F3',
    fontWeight: 'bold',
  },
  statusChip: {
    marginLeft: spacing.md,
  },
  purpose: {
    color: '#666',
    marginBottom: spacing.md,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  date: {
    color: '#666',
    marginLeft: spacing.xs,
  },
  documentsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  documentCount: {
    color: '#666',
    marginLeft: spacing.xs,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyTitle: {
    color: '#999',
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  emptyText: {
    color: '#999',
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  emptyButton: {
    marginTop: spacing.md,
  },
  fab: {
    position: 'absolute',
    margin: spacing.lg,
    right: 0,
    bottom: 0,
    backgroundColor: '#2196F3',
  },
});
