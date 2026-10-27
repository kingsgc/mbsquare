import { useCallback, useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { apiGet } from '../../lib/api';
import { getAuth, AuthState } from '../../lib/storage';

export default function Transactions() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [items, setItems] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  const load = useCallback(async () => {
    const stored = await getAuth();
    setAuth(stored);
    if (!stored) {
      setStatus('Login required.');
      return;
    }

    const res = await apiGet(stored.apiToken, '/api/transactions/?limit=50');
    if (res.ok) {
      setItems(res.data?.data ?? []);
      setStatus('');
      return;
    }
    setStatus(res.data?.msg ?? 'Unable to load transactions.');
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const sortedItems = useMemo(() => items, [items]);

  if (!auth) {
    return (
      <Screen>
        <Text style={styles.title}>Transactions</Text>
        <Text style={styles.subtitle}>Login required.</Text>
        <Button label="Go to Login" onPress={() => router.push('/auth/login')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>Transactions</Text>
      <Text style={styles.subtitle}>Latest 50 transactions</Text>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      {sortedItems.map((item) => (
        <Card key={item.tId}>
          <Text style={styles.itemTitle}>{item.servicename}</Text>
          <Text style={styles.itemDesc}>{item.servicedesc}</Text>
          <View style={styles.metaRow}>
            <Text style={styles.meta}>Amount: {item.amount}</Text>
            <Text style={styles.meta}>Status: {item.status === 0 ? 'Success' : item.status === 1 ? 'Failed' : item.status}</Text>
          </View>
          <Text style={styles.meta}>Ref: {item.transref}</Text>
          <Text style={styles.meta}>Date: {item.date}</Text>
        </Card>
      ))}
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
  status: {
    color: '#D92D20',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  itemDesc: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  meta: {
    fontSize: 11,
    color: '#64748B',
  },
});
