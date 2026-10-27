import { useCallback, useState } from 'react';
import { Alert, Linking, StyleSheet, Text, View } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { apiGet } from '../../lib/api';
import { getAuth, AuthState } from '../../lib/storage';
import { BASE_URL } from '../../lib/config';

export default function ApiAccess() {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [apiAccess, setApiAccess] = useState(false);
  const [status, setStatus] = useState('');
  const [usageCount, setUsageCount] = useState<number | null>(null);

  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const stored = await getAuth();
        setAuth(stored);

        if (!stored) {
          setStatus('Login required.');
          return;
        }

        const res = await apiGet(stored.apiToken, '/api/user/');
        if (res.ok) {
          const hasAccess = res.data?.apiAccess === 1 || res.data?.apiAccess === '1';
          setApiAccess(hasAccess);
          setUsageCount(res.data?.apiUsageCount ?? null);
          setStatus('');
        } else {
          setStatus(res.data?.msg ?? 'Unable to load API details.');
        }
      };
      load();
    }, [])
  );

  if (!auth) {
    return (
      <Screen>
        <Text style={styles.title}>API Access</Text>
        <Text style={styles.subtitle}>Login required.</Text>
        <Button label="Go to Login" onPress={() => router.push('/auth/login')} />
      </Screen>
    );
  }

  if (!apiAccess) {
    return (
      <Screen>
        <Text style={styles.title}>API Access</Text>
        <Text style={styles.subtitle}>Integrate DataWise into your apps</Text>

        <Card>
          <View style={styles.lockedContainer}>
            <Text style={styles.lockedIcon}>🔒</Text>
            <Text style={styles.lockedTitle}>API Access Not Enabled</Text>
            <Text style={styles.lockedDesc}>
              Your account does not have API access enabled yet. Contact support or wait for an admin to upgrade your account.
            </Text>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>What is API Access?</Text>
          <Text style={styles.featureText}>✅ Buy airtime, data, and pay bills programmatically</Text>
          <Text style={styles.featureText}>✅ Integrate VTU into your own apps and websites</Text>
          <Text style={styles.featureText}>✅ Access competitive wholesale rates</Text>
          <Text style={styles.featureText}>✅ 24/7 automated service delivery</Text>
          <Text style={styles.featureText}>✅ Real-time transaction status callbacks</Text>
        </Card>

        <Button
          label="Contact Support on WhatsApp"
          onPress={() => Linking.openURL('https://wa.me/2348160620920?text=Hi%20DataWise%2C%20I%20need%20API%20access%20for%20my%20account.')}
          variant="primary"
        />

        <Button label="Back to Account" onPress={() => router.back()} variant="secondary" />
      </Screen>
    );
  }

  return (
    <Screen>
      <Text style={styles.title}>API Access</Text>
      <Text style={styles.subtitle}>Your DataWise API credentials</Text>

      {status ? <Text style={styles.status}>{status}</Text> : null}

      <Card>
        <Text style={styles.cardTitle}>API Key</Text>
        <View style={styles.keyContainer}>
          <Text style={styles.apiKey} selectable>{auth.apiToken}</Text>
        </View>
        <Button
          label="Copy API Key"
          onPress={() => {
            Alert.alert('API Key', auth.apiToken, [
              { text: 'Copy', onPress: () => {} },
              { text: 'OK' },
            ]);
          }}
          variant="secondary"
        />
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Base URL</Text>
        <Text style={styles.apiKey} selectable>{BASE_URL}</Text>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Quick Start</Text>
        <Text style={styles.codeHeader}>Authentication Header</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>Authorization: Token {auth.apiToken}</Text>
        </View>

        <Text style={styles.codeHeader}>Example: Buy Airtime</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{`POST ${BASE_URL}/api/airtime/`}</Text>
          <Text style={styles.codeText}>Content-Type: application/json</Text>
          <Text style={styles.codeText}>Authorization: Token {auth.apiToken?.substring(0, 20)}...</Text>
          <Text style={styles.codeText}>{'{'}</Text>
          <Text style={styles.codeText}>  "network": "1",</Text>
          <Text style={styles.codeText}>  "amount": "100",</Text>
          <Text style={styles.codeText}>  "phone": "08012345678"</Text>
          <Text style={styles.codeText}>{'}'}</Text>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Available Endpoints</Text>

        <View style={styles.endpointRow}>
          <Text style={styles.methodGet}>GET</Text>
          <Text style={styles.endpoint}>/api/user/</Text>
        </View>
        <Text style={styles.endpointDesc}>Get your account balance and details</Text>

        <View style={styles.endpointRow}>
          <Text style={styles.methodPost}>POST</Text>
          <Text style={styles.endpoint}>/api/airtime/</Text>
        </View>
        <Text style={styles.endpointDesc}>Purchase airtime for any network</Text>

        <View style={styles.endpointRow}>
          <Text style={styles.methodPost}>POST</Text>
          <Text style={styles.endpoint}>/api/data/</Text>
        </View>
        <Text style={styles.endpointDesc}>Buy data bundles</Text>

        <View style={styles.endpointRow}>
          <Text style={styles.methodPost}>POST</Text>
          <Text style={styles.endpoint}>/api/cabletv/</Text>
        </View>
        <Text style={styles.endpointDesc}>Subscribe to cable TV</Text>

        <View style={styles.endpointRow}>
          <Text style={styles.methodPost}>POST</Text>
          <Text style={styles.endpoint}>/api/electricity/</Text>
        </View>
        <Text style={styles.endpointDesc}>Purchase electricity tokens</Text>

        <View style={styles.endpointRow}>
          <Text style={styles.methodGet}>GET</Text>
          <Text style={styles.endpoint}>/api/transactions/</Text>
        </View>
        <Text style={styles.endpointDesc}>View your transaction history</Text>
      </Card>

      {usageCount !== null && (
        <Card>
          <Text style={styles.cardTitle}>Usage Stats</Text>
          <Text style={styles.usageCount}>{usageCount.toLocaleString()}</Text>
          <Text style={styles.usageLabel}>Total API Requests</Text>
        </Card>
      )}

      <Button
        label="View Full Documentation"
        onPress={() => Linking.openURL(`${BASE_URL}/api.html`)}
        variant="primary"
      />

      <Button
        label="Contact Support"
        onPress={() => Linking.openURL('https://wa.me/2348160620920?text=Hi%20DataWise%2C%20I%20need%20help%20with%20the%20API.')}
        variant="secondary"
      />

      <Button label="Back to Account" onPress={() => router.back()} variant="secondary" />
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
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 10,
    color: '#0F172A',
  },
  keyContainer: {
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  apiKey: {
    fontFamily: 'Courier',
    fontSize: 13,
    color: '#0F172A',
    lineHeight: 20,
  },
  lockedContainer: {
    alignItems: 'center',
    padding: 20,
  },
  lockedIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  lockedTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  lockedDesc: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 20,
  },
  featureText: {
    fontSize: 14,
    color: '#334155',
    marginBottom: 8,
    lineHeight: 22,
  },
  codeHeader: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 12,
    marginBottom: 6,
  },
  codeBlock: {
    backgroundColor: '#0F172A',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  codeText: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#A5F3FC',
    lineHeight: 18,
  },
  endpointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
  },
  methodGet: {
    backgroundColor: '#22C55E',
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  methodPost: {
    backgroundColor: '#3B82F6',
    color: '#FFF',
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    overflow: 'hidden',
  },
  endpoint: {
    fontFamily: 'Courier',
    fontSize: 13,
    color: '#0F172A',
    flex: 1,
  },
  endpointDesc: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  usageCount: {
    fontSize: 36,
    fontWeight: '800',
    color: '#0A84FF',
  },
  usageLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },
});
