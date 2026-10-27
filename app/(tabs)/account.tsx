import { useCallback, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { clearAuth, getAuth, AuthState } from '../../lib/storage';
import { BASE_URL } from '../../lib/config';

export default function Account() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stored = await getAuth();
        setAuth(stored);
      };
      load();
    }, [])
  );

  const handleLogout = async () => {
    await clearAuth();
    router.replace('/auth/login');
  };

  return (
    <Screen>
      <Text style={styles.title}>Account</Text>
      <Text style={styles.subtitle}>Logged-in user details</Text>

      <Card>
        <Text style={styles.cardTitle}>Profile</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{auth?.name || 'N/A'}</Text>
        <Text style={styles.label}>Phone</Text>
        <Text style={styles.value}>{auth?.phone || 'N/A'}</Text>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.value}>{auth?.email || 'N/A'}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>API Access</Text>
        <Text style={styles.label}>API Key</Text>
        <Text style={styles.valueSmall} numberOfLines={1}>{auth?.apiToken || 'N/A'}</Text>
        <Text style={styles.helper}>Use this key to authenticate API requests.</Text>
        <Button
          label="View API Access & Documentation"
          onPress={() => router.push({ pathname: '/api/access' } as any)}
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Settings</Text>
        <Text style={styles.label}>Base URL</Text>
        <Text style={styles.value}>{BASE_URL}</Text>
        <Text style={styles.helper}>Backend server for all API calls.</Text>
      </Card>

      <Button label="Logout" onPress={handleLogout} variant="danger" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    color: '#64748B',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0F172A',
  },
  label: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
  },
  value: {
    fontSize: 14,
    color: '#0F172A',
  },
  valueSmall: {
    fontSize: 12,
    color: '#0F172A',
    fontFamily: 'Courier',
  },
  helper: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 6,
    marginBottom: 12,
  },
});
