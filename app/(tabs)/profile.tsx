import { spacing } from '@/constants/theme';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { logout } from '@/store/slices/authSlice';
import { clearAllNotifications, setNotificationEnabled } from '@/store/slices/notificationSlice';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { Avatar, Button, Card, List, Switch, Text } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  const dispatch = useAppDispatch();
  const { user } = useAppSelector(state => state.auth);
  const { notifications, unreadCount } = useAppSelector(state => state.notification);
  const { isOnline } = useAppSelector(state => state.offline);

  const isOfficer = user?.role === 'field_officer' || user?.role === 'manager';

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout());
             router.replace('/auth' as any);
          },
        },
      ]
    );
  };

   const handleBiometricToggle = (value: boolean) => {
     setBiometricEnabled(value);
     dispatch(setBiometricEnabled(value) as any);
   };

  const handleNotificationToggle = (value: boolean) => {
    setNotificationsEnabled(value);
    dispatch(setNotificationEnabled(value));
  };

  const handleClearNotifications = () => {
    Alert.alert(
      'Clear Notifications',
      'Are you sure you want to clear all notifications?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => dispatch(clearAllNotifications()),
        },
      ]
    );
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'beneficiary':
        return 'Beneficiary';
      case 'field_officer':
        return 'Field Officer';
      case 'manager':
        return 'Manager';
      default:
        return role;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'beneficiary':
        return 'account';
      case 'field_officer':
        return 'account-tie';
      case 'manager':
        return 'account-star';
      default:
        return 'account';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Profile Header */}
        <Card style={styles.profileCard}>
          <Card.Content style={styles.profileContent}>
            <Avatar.Icon
              size={80}
              icon={getRoleIcon(user?.role || 'account')}
              style={styles.avatar}
            />
            <View style={styles.profileInfo}>
              <Text variant="headlineSmall" style={styles.userName}>
                {user?.name}
              </Text>
              <Text variant="bodyMedium" style={styles.userRole}>
                {getRoleDisplayName(user?.role || '')}
              </Text>
              <Text variant="bodySmall" style={styles.userContact}>
                {user?.email || user?.phone}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Connection Status */}
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.statusRow}>
              <MaterialCommunityIcons
                name={isOnline ? 'wifi' : 'wifi-off'}
                size={24}
                color={isOnline ? '#4CAF50' : '#F44336'}
              />
              <Text variant="bodyMedium" style={styles.statusText}>
                {isOnline ? 'Connected' : 'Offline'}
              </Text>
            </View>
          </Card.Content>
        </Card>

        {/* Notifications */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Notifications
            </Text>
            
            <List.Item
              title="Push Notifications"
              description="Receive notifications about loan updates"
              left={(props) => <List.Icon {...props} icon="bell" />}
              right={() => (
                <Switch
                  value={notificationsEnabled}
                  onValueChange={handleNotificationToggle}
                />
              )}
            />
            
            <List.Item
              title="Unread Notifications"
              description={`${unreadCount} unread notifications`}
              left={(props) => <List.Icon {...props} icon="bell-outline" />}
              right={() => (
                <Button
                  mode="outlined"
                  compact
                  onPress={handleClearNotifications}
                  disabled={unreadCount === 0}
                >
                  Clear All
                </Button>
              )}
            />
          </Card.Content>
        </Card>

        {/* Security */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Security
            </Text>
            
            <List.Item
              title="Biometric Login"
              description="Use fingerprint or face recognition to login"
              left={(props) => <List.Icon {...props} icon="fingerprint" />}
              right={() => (
                <Switch
                  value={biometricEnabled}
                  onValueChange={handleBiometricToggle}
                />
              )}
            />
            
            <List.Item
              title="Change Password"
              description="Update your account password"
              left={(props) => <List.Icon {...props} icon="lock" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // Handle change password
              }}
            />
          </Card.Content>
        </Card>

        {/* App Settings */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              App Settings
            </Text>
            
            <List.Item
              title="Sync Data"
              description="Manually sync offline data"
              left={(props) => <List.Icon {...props} icon="sync" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // Handle manual sync
              }}
            />
            
            <List.Item
              title="Storage Usage"
              description="View app storage and cache"
              left={(props) => <List.Icon {...props} icon="harddisk" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // Handle storage info
              }}
            />
            
            <List.Item
              title="App Version"
              description="Version 1.0.0"
              left={(props) => <List.Icon {...props} icon="information" />}
            />
          </Card.Content>
        </Card>

        {/* Support */}
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.sectionTitle}>
              Support
            </Text>
            
            <List.Item
              title="Help & FAQ"
              description="Get help and find answers"
              left={(props) => <List.Icon {...props} icon="help-circle" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // Handle help
              }}
            />
            
            <List.Item
              title="Contact Support"
              description="Get in touch with our support team"
              left={(props) => <List.Icon {...props} icon="headset" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // Handle contact support
              }}
            />
            
            <List.Item
              title="Terms & Privacy"
              description="View terms of service and privacy policy"
              left={(props) => <List.Icon {...props} icon="file-document" />}
              right={(props) => <List.Icon {...props} icon="chevron-right" />}
              onPress={() => {
                // Handle terms and privacy
              }}
            />
          </Card.Content>
        </Card>

        {/* Logout */}
        <Card style={styles.card}>
          <Card.Content>
            <Button
              mode="outlined"
              onPress={handleLogout}
              style={styles.logoutButton}
              textColor="#F44336"
              icon="logout"
            >
              Logout
            </Button>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
  },
  profileCard: {
    marginBottom: spacing.lg,
    elevation: 2,
  },
  profileContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    backgroundColor: '#2196F3',
    marginRight: spacing.lg,
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 'bold',
    color: '#333',
    marginBottom: spacing.xs,
  },
  userRole: {
    color: '#2196F3',
    fontWeight: 'bold',
    marginBottom: spacing.xs,
  },
  userContact: {
    color: '#666',
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
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    marginLeft: spacing.sm,
    color: '#333',
  },
  logoutButton: {
    borderColor: '#F44336',
  },
});
