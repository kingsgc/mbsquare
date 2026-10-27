import { StyleSheet, Text, View } from 'react-native';

export function AlertBox({
  title,
  messages,
  variant = 'error',
}: {
  title: string;
  messages: string[];
  variant?: 'error' | 'success' | 'info';
}) {
  if (!messages.length) return null;

  return (
    <View style={[styles.base, styles[variant]]}>
      <Text style={styles.title}>{title}</Text>
      {messages.map((msg, idx) => (
        <Text key={`${msg}-${idx}`} style={styles.msg}>
          • {msg}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  error: {
    backgroundColor: '#FFF1F2',
    borderColor: '#FECACA',
  },
  success: {
    backgroundColor: '#ECFDF3',
    borderColor: '#ABEFC6',
  },
  info: {
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
  },
  title: {
    fontWeight: '700',
    marginBottom: 6,
    color: '#0F172A',
  },
  msg: {
    color: '#334155',
    fontSize: 12,
    marginBottom: 2,
  },
});
