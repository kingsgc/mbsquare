import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { getAuth } from '../lib/storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const init = async () => {
      const auth = await getAuth();
      if (!auth) {
        router.replace('/auth/login');
        return;
      }
      router.replace('/(tabs)');
    };
    init();
  }, [router]);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#256C84" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F6F7FB',
  },
});
