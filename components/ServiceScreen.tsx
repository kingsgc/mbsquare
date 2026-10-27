import { useEffect, useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { getAuth, AuthState } from '../lib/storage';
import { ServiceForm, ServiceField } from './ServiceForm';
import { Screen } from './Screen';
import { Button } from './Button';
import { useRouter } from 'expo-router';

export function ServiceScreen({
  title,
  description,
  endpoint,
  fields,
}: {
  title: string;
  description: string;
  endpoint: string;
  fields: ServiceField[];
}) {
  const router = useRouter();
  const [auth, setAuth] = useState<AuthState | null>(null);

  useEffect(() => {
    const load = async () => {
      const stored = await getAuth();
      setAuth(stored);
    };
    load();
  }, []);

  if (!auth) {
    return (
      <Screen>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>Login required to use this service.</Text>
        <Button label="Go to Login" onPress={() => router.push('/auth/login')} />
      </Screen>
    );
  }

  return (
    <Screen>
      <ServiceForm
        title={title}
        description={description}
        endpoint={endpoint}
        fields={fields}
        token={auth.apiToken}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  description: {
    color: '#64748B',
  },
});
