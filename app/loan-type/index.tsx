import { spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import type { LoanType } from '@/store/slices/loanSlice';
import { fetchLoanTypes, setCurrentApplication } from '@/store/slices/loanSlice';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';
import { ActivityIndicator, Button, Card, Searchbar, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoanTypeScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<LoanType | null>(null);
  
  const dispatch = useAppDispatch();
  const { loanTypes, isLoading, error } = useAppSelector(state => state.loan);
  const { user } = useAppSelector(state => state.auth);

  useEffect(() => {
    dispatch(fetchLoanTypes());
  }, [dispatch]);

  const filteredLoanTypes = loanTypes.filter(type =>
    type.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    type.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLoanType = (loanType: LoanType) => {
    setSelectedType(loanType);
  };

  const handleContinue = () => {
    if (selectedType) {
      // Create a new application with the selected loan type
      const newApplication = {
        loanType: selectedType.id,
        amount: 0,
        purpose: '',
        documents: [],
        status: 'draft' as const,
      };
      
      dispatch(setCurrentApplication(newApplication as any));
      router.push('/application/form');
    }
  };

  const renderLoanTypeCard = ({ item }: { item: LoanType }) => (
    <TouchableOpacity
      onPress={() => handleSelectLoanType(item)}
      style={[
        styles.cardContainer,
        selectedType?.id === item.id && styles.selectedCard
      ]}
    >
      <Card style={[
        styles.card,
        selectedType?.id === item.id && styles.selectedCardStyle
      ]}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <View style={[
              styles.iconContainer,
              selectedType?.id === item.id && styles.selectedIconContainer
            ]}>
              <Text style={[
                styles.icon,
                selectedType?.id === item.id && styles.selectedIcon
              ]}>
                {getIconForLoanType(item.icon)}
              </Text>
            </View>
            <View style={styles.cardInfo}>
              <Text variant="titleMedium" style={[
                styles.cardTitle,
                selectedType?.id === item.id && styles.selectedText
              ]}>
                {item.name}
              </Text>
              <Text variant="bodyMedium" style={[
                styles.cardDescription,
                selectedType?.id === item.id && styles.selectedText
              ]}>
                {item.description}
              </Text>
            </View>
          </View>
          
          <View style={styles.cardDetails}>
            <View style={styles.detailItem}>
              <Text variant="bodySmall" style={styles.detailLabel}>Max Amount</Text>
              <Text variant="bodySmall" style={[
                styles.detailValue,
                selectedType?.id === item.id && styles.selectedText
              ]}>
                ₹{item.maxAmount.toLocaleString()}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text variant="bodySmall" style={styles.detailLabel}>Interest Rate</Text>
              <Text variant="bodySmall" style={[
                styles.detailValue,
                selectedType?.id === item.id && styles.selectedText
              ]}>
                {item.interestRate}%
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text variant="bodyLarge" style={styles.loadingText}>
            Loading loan types...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>
          Select Loan Type
        </Text>
        <Text variant="bodyMedium" style={styles.subtitle}>
          Choose the type of loan you want to apply for
        </Text>
      </View>

      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search loan types..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchbar}
        />
      </View>

      <FlatList
        data={filteredLoanTypes}
        renderItem={renderLoanTypeCard}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text variant="bodyLarge" style={styles.emptyText}>
              No loan types found
            </Text>
          </View>
        }
      />

      {selectedType && (
        <View style={styles.bottomContainer}>
           <Card style={styles.selectedCardInfo}>
            <Card.Content style={styles.selectedCardContent}>
              <Text variant="titleMedium" style={styles.selectedTitle}>
                Selected: {selectedType.name}
              </Text>
              <Text variant="bodySmall" style={styles.selectedDescription}>
                {selectedType.description}
              </Text>
            </Card.Content>
          </Card>
          
          <Button
            mode="contained"
            onPress={handleContinue}
            style={styles.continueButton}
            contentStyle={styles.buttonContent}
          >
            Continue
          </Button>
        </View>
      )}
    </SafeAreaView>
  );
}

const getIconForLoanType = (iconName: string): string => {
  const iconMap: { [key: string]: string } = {
    home: '🏠',
    school: '🎓',
    'directions-car': '🚗',
    person: '👤',
    business: '🏢',
    diamond: '💎',
    'home-work': '🏘️',
    agriculture: '🌾',
  };
  return iconMap[iconName] || '💰';
};

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
  listContainer: {
    padding: spacing.lg,
    paddingBottom: 120, // Space for bottom container
  },
  cardContainer: {
    marginBottom: spacing.md,
  },
  card: {
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  selectedCard: {
    borderWidth: 2,
    borderColor: '#2196F3',
  },
  selectedCardStyle: {
    backgroundColor: '#E3F2FD',
  },
  cardContent: {
    padding: spacing.lg,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  selectedIconContainer: {
    backgroundColor: '#2196F3',
  },
  icon: {
    fontSize: 24,
  },
  selectedIcon: {
    color: '#FFFFFF',
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  cardDescription: {
    color: '#666',
  },
  selectedText: {
    color: '#2196F3',
  },
  cardDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    color: '#999',
    marginBottom: spacing.xs,
  },
  detailValue: {
    fontWeight: 'bold',
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
  selectedCardInfo: {
    marginBottom: spacing.md,
    backgroundColor: '#E3F2FD',
  },
  selectedCardContent: {
    padding: spacing.md,
  },
  selectedTitle: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  selectedDescription: {
    color: '#1976D2',
  },
  continueButton: {
    borderRadius: 8,
  },
  buttonContent: {
    paddingVertical: spacing.sm,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: spacing.md,
    color: '#666',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  emptyText: {
    color: '#999',
  },
});
