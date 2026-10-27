import { useMemo } from 'react';
import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Screen } from '../../components/Screen';

const SERVICES = [
  { title: 'Airtime', route: '/services/airtime' as const, desc: 'VTU & Share-and-Sell' },
  { title: 'Data', route: '/services/data' as const, desc: 'SME, Gifting, Corporate' },
  { title: 'Cable TV', route: '/services/cable' as const, desc: 'DSTV, GOTV, Startimes' },
  { title: 'Electricity', route: '/services/electricity' as const, desc: 'Prepaid/Postpaid' },
] as const;

export default function Services() {
  const router = useRouter();
  const items = useMemo(() => SERVICES, []);

  return (
    <Screen>
      <Text style={styles.title}>Services</Text>
      <Text style={styles.subtitle}>Pick a service to continue.</Text>

      <View style={styles.grid}>
        {items.map((service) => (
          <Pressable
            key={service.title}
            onPress={() => router.push(service.route)}
            style={({ pressed }) => [styles.card, pressed ? styles.pressed : null]}
          >
            <Text style={styles.cardTitle}>{service.title}</Text>
            <Text style={styles.cardDesc}>{service.desc}</Text>
          </Pressable>
        ))}
      </View>
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
  grid: {
    gap: 12,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0F172A',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 2,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  cardDesc: {
    marginTop: 4,
    color: '#64748B',
    fontSize: 13,
  },
});
