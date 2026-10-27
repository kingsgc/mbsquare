import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { AlertBox } from '../../components/AlertBox';
import { buildAbsoluteUrl, fetchWithTimeout } from '../../lib/api';

export default function Recovery() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  const postForm = async (url: string, data: Record<string, string>) => {
    const body = new URLSearchParams(data).toString();
    const res = await fetchWithTimeout(buildAbsoluteUrl(url), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body,
    });
    return res.text();
  };

  const sendCode = async () => {
    const nextErrors: string[] = [];
    if (!email) {
      nextErrors.push('Email is required.');
    }
    if (nextErrors.length) {
      setErrors(nextErrors);
      setSuccess([]);
      return;
    }
    setLoading(true);
    setErrors([]);
    setSuccess([]);
    try {
      const resp = await postForm('/mobile/home/includes/route.php?get-user-code', { email });
      if (resp.trim() === '0') {
        setStep(2);
        setSuccess(['Verification code sent.']);
      } else if (resp.trim() === '1') {
        setErrors(['Email not found.']);
      } else {
        setErrors(['Request failed.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    const nextErrors: string[] = [];
    if (!code) {
      nextErrors.push('Verification code is required.');
    }
    if (nextErrors.length) {
      setErrors(nextErrors);
      setSuccess([]);
      return;
    }
    setLoading(true);
    setErrors([]);
    setSuccess([]);
    try {
      const resp = await postForm('/mobile/home/includes/route.php?verify-user-code', { email, code });
      if (resp.trim() === '0') {
        setStep(3);
        setSuccess(['Code verified successfully.']);
      } else if (resp.trim() === '1') {
        setErrors(['Incorrect verification code.']);
      } else {
        setErrors(['Request failed.']);
      }
    } finally {
      setLoading(false);
    }
  };

  const updatePassword = async () => {
    const nextErrors: string[] = [];
    if (!password || !confirm) {
      nextErrors.push('Password fields are required.');
    }
    if (password !== confirm) {
      nextErrors.push('Passwords do not match.');
    }
    if (nextErrors.length) {
      setErrors(nextErrors);
      setSuccess([]);
      return;
    }

    setLoading(true);
    setErrors([]);
    setSuccess([]);
    try {
      const resp = await postForm('/mobile/home/includes/route.php?update-user-pass', {
        email,
        code,
        password,
      });
      if (resp.trim() === '0') {
        setSuccess(['Password updated successfully.']);
        router.replace('/auth/login');
      } else {
        setErrors(['Update failed.']);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Reset Password</Text>
      <Text style={styles.subtitle}>Reset your DataWise password.</Text>
      <AlertBox title="Recovery Error" messages={errors} variant="error" />
      <AlertBox title="Recovery Status" messages={success} variant="success" />

      {step === 1 ? (
        <View style={styles.form}>
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" />
          <Button label={loading ? 'Sending...' : 'Send Reset Code'} onPress={sendCode} disabled={loading} />
        </View>
      ) : null}

      {step === 2 ? (
        <View style={styles.form}>
          <Field label="Verification Code" value={code} onChangeText={setCode} placeholder="Code" keyboardType="numeric" />
          <Button label={loading ? 'Verifying...' : 'Verify Code'} onPress={verifyCode} disabled={loading} />
        </View>
      ) : null}

      {step === 3 ? (
        <View style={styles.form}>
          <Field label="New Password" value={password} onChangeText={setPassword} placeholder="New password" secureTextEntry />
          <Field label="Confirm Password" value={confirm} onChangeText={setConfirm} placeholder="Confirm" secureTextEntry />
          <Button label={loading ? 'Updating...' : 'Update Password'} onPress={updatePassword} disabled={loading} />
        </View>
      ) : null}

      <Pressable onPress={() => router.replace('/auth/login')}>
        <Text style={styles.link}>Back to login</Text>
      </Pressable>
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
  form: {
    gap: 12,
  },
  link: {
    textAlign: 'center',
    color: '#0A84FF',
    fontWeight: '700',
    marginTop: 6,
  },
});
