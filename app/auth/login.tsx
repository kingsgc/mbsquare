import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as LocalAuthentication from 'expo-local-authentication';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { AlertBox } from '../../components/AlertBox';
import {
  getAuth,
  getBiometricEnabled,
  getRemembered,
  setAuth,
  setBiometricEnabled,
  setRemembered,
} from '../../lib/storage';
import { buildAbsoluteUrl, fetchWithTimeout } from '../../lib/api';

export default function Login() {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [biometric, setBiometric] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      const existing = await getAuth();
      if (existing?.apiToken) {
        router.replace('/(tabs)');
        return;
      }

      const saved = await getRemembered();
      if (saved.remember) {
        setPhone(saved.phone);
        setPassword(saved.password);
        setRemember(true);
      }

      const biom = await getBiometricEnabled();
      setBiometric(biom);
    };
    init();
  }, [router]);

  const handleLogin = async () => {
    const nextErrors: string[] = [];
    if (!phone) nextErrors.push('Phone is required.');
    if (!password) nextErrors.push('Password is required.');
    if (nextErrors.length) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors([]);
    try {
      const body = new URLSearchParams({ phone, password }).toString();
      const res = await fetchWithTimeout(buildAbsoluteUrl('/mobile/home/includes/route.php?login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      const data = await res.json();
      if (data?.status === 'success') {
        if (!data.apiKey) {
          setErrors(['API key not returned. Update backend to return apiKey.']);
          return;
        }

        await setAuth({
          apiToken: data.apiKey,
          name: data.name ?? '',
          phone: data.phone ?? phone,
          email: data.email ?? '',
        });

        await setRemembered(phone, password, remember || biometric);
        await setBiometricEnabled(biometric);
        router.replace('/(tabs)');
        return;
      }

      setErrors([data?.msg ?? 'Invalid credentials']);
    } catch (error: any) {
      setErrors([error?.message ?? 'Connection failed']);
    } finally {
      setLoading(false);
    }
  };

  const handleBiometricLogin = async () => {
    setErrors([]);
    const saved = await getRemembered();
    if (!saved.remember || !saved.phone || !saved.password) {
      setErrors(['Enable Remember me to use fingerprint login.']);
      return;
    }

    const hasHardware = await LocalAuthentication.hasHardwareAsync();
    if (!hasHardware) {
      setErrors(['Biometric hardware not available on this device.']);
      return;
    }

    const enrolled = await LocalAuthentication.isEnrolledAsync();
    if (!enrolled) {
      setErrors(['No biometric credentials enrolled.']);
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Login with Fingerprint',
      cancelLabel: 'Cancel',
      fallbackLabel: 'Use Password',
    });

    if (!result.success) {
      setErrors(['Fingerprint authentication failed.']);
      return;
    }

    setPhone(saved.phone);
    setPassword(saved.password);
    setBiometric(true);
    await handleLogin();
  };

  return (
    <Screen>
      <View style={styles.hero}>
        <Image source={require('../../assets/images/icon.png')} style={styles.logo} />
        <View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your DataWise account</Text>
        </View>
      </View>

      <AlertBox title="Login Error" messages={errors} variant="error" />

      <Field
        label="Phone Number"
        value={phone}
        onChangeText={setPhone}
        placeholder="08012345678"
        keyboardType="phone-pad"
      />
      <Field
        label="Password"
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
      />

      <Pressable onPress={() => setRemember((prev) => !prev)} style={styles.rememberRow}>
        <View style={[styles.checkbox, remember ? styles.checked : null]} />
        <Text style={styles.rememberText}>Remember me</Text>
      </Pressable>

      <Pressable onPress={() => setBiometric((prev) => !prev)} style={styles.rememberRow}>
        <View style={[styles.checkbox, biometric ? styles.checked : null]} />
        <Text style={styles.rememberText}>Enable Fingerprint Login</Text>
      </Pressable>

      <Button label={loading ? 'Signing In...' : 'Sign In'} onPress={handleLogin} disabled={loading} />

      {biometric ? (
        <Button label="Use Fingerprint" onPress={handleBiometricLogin} variant="secondary" />
      ) : null}

      <Pressable onPress={() => router.push('/auth/recovery')}>
        <Text style={styles.link}>Forgot Password?</Text>
      </Pressable>

      <Pressable onPress={() => router.push('/auth/register')}>
        <Text style={styles.link}>Create Account</Text>
      </Pressable>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 4,
  },
  link: {
    textAlign: 'center',
    color: '#0A84FF',
    fontWeight: '700',
    marginTop: 6,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rememberText: {
    color: '#64748B',
    fontWeight: '600',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#CBD5F5',
  },
  checked: {
    backgroundColor: '#0A84FF',
    borderColor: '#0A84FF',
  },
});
