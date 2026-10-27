import { useCallback, useMemo, useState } from 'react';
import { Linking, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { apiGet } from '../../lib/api';
import { getAuth, AuthState } from '../../lib/storage';
import { BASE_URL } from '../../lib/config';

export default function Home() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [balance, setBalance] = useState('');
  const [status, setStatus] = useState('');

  const loadData = useCallback(async () => {
    const stored = await getAuth();
    setAuth(stored);

    if (!stored) {
      setStatus('Login required.');
      return;
    }

    const res = await apiGet(stored.apiToken, '/api/user/');
    if (res.ok) {
      setBalance(res.data?.balance ?? '');
      setStatus('');
      return;
    }

    setStatus(res.data?.msg ?? 'Unable to fetch account data.');
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const quickActions = useMemo(
    () => [
      { label: 'Buy Airtime', route: '/services/airtime' as const },
      { label: 'Buy Data', route: '/services/data' as const },
      { label: 'Cable TV', route: '/services/cable' as const },
      { label: 'Electricity', route: '/services/electricity' as const },
    ],
    []
  );

  return (
    <Screen>
      <Text style={styles.title}>Dashboard</Text>
      <Text style={styles.subtitle}>DataWise VTU App</Text>

      <Card>
        <Text style={styles.cardTitle}>Account</Text>
        <Text style={styles.label}>Name</Text>
        <Text style={styles.value}>{auth?.name || 'Not loaded'}</Text>
        <Text style={styles.label}>Balance</Text>
        <Text style={styles.value}>{balance || 'Not loaded'}</Text>
        {status ? <Text style={styles.status}>{status}</Text> : null}
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Quick Actions</Text>
        <View style={styles.grid}>
          {quickActions.map((action) => (
            <View key={action.label} style={styles.gridItem}>
              <Button label={action.label} onPress={() => router.push(action.route)} />
            </View>
          ))}
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Website</Text>
        <Text style={styles.value}>{BASE_URL}</Text>
        <Button label="Open Website" onPress={() => Linking.openURL(BASE_URL)} />
      </Card>
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
    fontSize: 15,
    color: '#0F172A',
  },
  status: {
    marginTop: 10,
    color: '#D92D20',
    fontSize: 13,
  },
  grid: {
    gap: 10,
  },
  gridItem: {
    flex: 1,
  },
});
