import { useEffect, useMemo, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Screen } from '../../components/Screen';
import { Field } from '../../components/Field';
import { Button } from '../../components/Button';
import { AlertBox } from '../../components/AlertBox';
import { getSavedState, setAuth, setSavedState } from '../../lib/storage';
import { buildAbsoluteUrl, fetchWithTimeout } from '../../lib/api';

const states = [
  'Abuja FCT', 'Abia', 'Adamawa', 'Akwa Ibom', 'Anambra', 'Bauchi', 'Bayelsa',
  'Benue', 'Borno', 'Cross River', 'Delta', 'Ebonyi', 'Edo', 'Ekiti', 'Enugu',
  'Gombe', 'Imo', 'Jigawa', 'Kaduna', 'Kano', 'Katsina', 'Kebbi', 'Kogi',
  'Kwara', 'Lagos', 'Nassarawa', 'Niger', 'Ogun', 'Ondo', 'Osun', 'Oyo',
  'Plateau', 'Rivers', 'Sokoto', 'Taraba', 'Yobe', 'Zamfara',
];

export default function Register() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [fname, setFname] = useState('');
  const [lname, setLname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');

  const [state, setState] = useState('');
  const [stateOpen, setStateOpen] = useState(false);
  const [stateQuery, setStateQuery] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [transpin, setTranspin] = useState('');
  const [referal, setReferal] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  useEffect(() => {
    const loadState = async () => {
      const saved = await getSavedState();
      if (saved) setState(saved);
    };
    loadState();
  }, []);

  const filteredStates = useMemo(() => {
    if (!stateQuery.trim()) return states;
    const query = stateQuery.toLowerCase();
    return states.filter((item) => item.toLowerCase().includes(query));
  }, [stateQuery]);

  const splitMessages = (message?: string) => {
    if (!message) return [];
    return message
      .split(/<br\s*\/?>|\r?\n/gi)
      .map((msg) => msg.trim())
      .filter(Boolean);
  };

  const nextStep = () => {
    const nextErrors: string[] = [];
    if (!fname || !lname || !phone || !email) {
      nextErrors.push('Please fill all required fields.');
    }
    if (phone.length !== 11) {
      nextErrors.push('Phone number must be 11 digits.');
    }
    if (nextErrors.length) {
      setErrors(nextErrors);
      setSuccess([]);
      return;
    }
    setErrors([]);
    setSuccess([]);
    setStep(2);
  };

  const handleRegister = async () => {
    const nextErrors: string[] = [];
    if (!state || !password || !confirm || !transpin) {
      nextErrors.push('Please complete all required fields.');
    }
    if (password !== confirm) {
      nextErrors.push('Passwords do not match.');
    }
    if (transpin.length !== 5) {
      nextErrors.push('Transaction pin must be 5 digits.');
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
      const body = new URLSearchParams({
        fname,
        lname,
        phone,
        email,
        state,
        account: '1',
        referal,
        password,
        transpin,
      }).toString();

      const res = await fetchWithTimeout(buildAbsoluteUrl('/mobile/home/includes/route.php?register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
      });

      const data = await res.json();
      if (data?.status === 'success') {
        if (!data.apiKey) {
          setErrors(['API key not returned. Please try again.']);
          return;
        }
        await setAuth({
          apiToken: data.apiKey,
          name: data.name ?? `${fname} ${lname}`,
          phone: data.phone ?? phone,
          email: data.email ?? email,
        });
        router.replace('/(tabs)');
        return;
      }

      setErrors(splitMessages(data?.msg ?? 'Unable to register.'));
    } catch (error: any) {
      setErrors([error?.message ?? 'Connection failed']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Create your DataWise account.</Text>
      <AlertBox title="Registration Error" messages={errors} variant="error" />
      <AlertBox title="Registration Status" messages={success} variant="success" />

      {step === 1 ? (
        <View style={styles.form}>
          <Field label="First Name" value={fname} onChangeText={setFname} placeholder="First name" />
          <Field label="Last Name" value={lname} onChangeText={setLname} placeholder="Last name" />
          <Field label="Phone" value={phone} onChangeText={setPhone} placeholder="08012345678" keyboardType="phone-pad" />
          <Field label="Email" value={email} onChangeText={setEmail} placeholder="email@example.com" keyboardType="email-address" />
          <Button label="Continue" onPress={nextStep} />
        </View>
      ) : (
        <View style={styles.form}>
          <View style={styles.dropdown}>
            <Text style={styles.label}>State</Text>
            <Pressable style={styles.select} onPress={() => setStateOpen(true)}>
              <Text style={state ? styles.selectText : styles.selectPlaceholder}>
                {state || 'Select your state'}
              </Text>
            </Pressable>
          </View>

          <Field label="Password" value={password} onChangeText={setPassword} placeholder="Password" secureTextEntry />
          <Field label="Confirm Password" value={confirm} onChangeText={setConfirm} placeholder="Confirm" secureTextEntry />
          <Field label="Transaction Pin" value={transpin} onChangeText={setTranspin} placeholder="5 digits" keyboardType="numeric" />
          <Field label="Referral Code (optional)" value={referal} onChangeText={setReferal} placeholder="Referral" />
          <Button label={loading ? 'Creating...' : 'Create Account'} onPress={handleRegister} disabled={loading} />
          <Pressable onPress={() => setStep(1)}>
            <Text style={styles.link}>Back</Text>
          </Pressable>
        </View>
      )}

      <Pressable onPress={() => router.push('/auth/login')}>
        <Text style={styles.link}>Already have an account? Sign in</Text>
      </Pressable>

      <Modal visible={stateOpen} transparent animationType="fade" onRequestClose={() => setStateOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setStateOpen(false)}>
          <View style={styles.sheet} onStartShouldSetResponder={() => true}>
            <Text style={styles.sheetTitle}>Select State</Text>
            <TextInput
              style={styles.search}
              value={stateQuery}
              onChangeText={setStateQuery}
              placeholder="Search state"
              placeholderTextColor="#94A3B8"
            />
            <ScrollView style={styles.menuScroll} keyboardShouldPersistTaps="handled">
              {filteredStates.length ? (
                filteredStates.map((item) => (
                  <Pressable
                    key={item}
                    style={styles.menuItem}
                    onPress={() => {
                      setState(item);
                      setSavedState(item);
                      setStateOpen(false);
                      setStateQuery('');
                    }}
                  >
                    <Text style={styles.menuText}>{item}</Text>
                  </Pressable>
                ))
              ) : (
                <Text style={styles.empty}>No states found.</Text>
              )}
            </ScrollView>
          </View>
        </Pressable>
      </Modal>
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
  dropdown: {
    gap: 6,
  },
  label: {
    fontWeight: '600',
    color: '#1F2937',
  },
  select: {
    borderWidth: 1,
    borderColor: '#DDE2EA',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  selectText: {
    color: '#0F172A',
    fontWeight: '600',
  },
  selectPlaceholder: {
    color: '#94A3B8',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.35)',
    justifyContent: 'flex-end',
    padding: 16,
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 16,
    maxHeight: '80%',
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 10,
  },
  search: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#0F172A',
    marginBottom: 10,
  },
  menuScroll: {
    paddingVertical: 4,
  },
  menuItem: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
  },
  menuText: {
    color: '#0F172A',
  },
  empty: {
    color: '#64748B',
    padding: 12,
  },
});


