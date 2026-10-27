import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  TOKEN: 'dw.apiToken',
  NAME: 'dw.name',
  PHONE: 'dw.phone',
  EMAIL: 'dw.email',
  REMEMBER: 'dw.remember',
  SAVED_PHONE: 'dw.savedPhone',
  SAVED_PASS: 'dw.savedPass',
  SAVED_STATE: 'dw.savedState',
  BIOMETRIC: 'dw.biometric',
} as const;

export type AuthState = {
  apiToken: string;
  name: string;
  phone: string;
  email: string;
};

export async function getAuth(): Promise<AuthState | null> {
  const [apiToken, name, phone, email] = await AsyncStorage.multiGet([
    KEYS.TOKEN,
    KEYS.NAME,
    KEYS.PHONE,
    KEYS.EMAIL,
  ]).then((pairs) => pairs.map(([, v]) => v ?? ''));

  if (!apiToken) return null;
  return { apiToken, name, phone, email };
}

export async function setAuth(state: AuthState): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.TOKEN, state.apiToken],
    [KEYS.NAME, state.name ?? ''],
    [KEYS.PHONE, state.phone ?? ''],
    [KEYS.EMAIL, state.email ?? ''],
  ]);
}

export async function clearAuth(): Promise<void> {
  await AsyncStorage.multiRemove([
    KEYS.TOKEN,
    KEYS.NAME,
    KEYS.PHONE,
    KEYS.EMAIL,
  ]);
}

export async function getRemembered(): Promise<{ phone: string; password: string; remember: boolean }> {
  const [[, phone], [, password], [, remember]] = await AsyncStorage.multiGet([
    KEYS.SAVED_PHONE,
    KEYS.SAVED_PASS,
    KEYS.REMEMBER,
  ]);
  return {
    phone: phone ?? '',
    password: password ?? '',
    remember: remember === 'true',
  };
}

export async function setRemembered(phone: string, password: string, remember: boolean): Promise<void> {
  await AsyncStorage.multiSet([
    [KEYS.SAVED_PHONE, phone],
    [KEYS.SAVED_PASS, password],
    [KEYS.REMEMBER, remember ? 'true' : 'false'],
  ]);
}

export async function getSavedState(): Promise<string> {
  return (await AsyncStorage.getItem(KEYS.SAVED_STATE)) ?? '';
}

export async function setSavedState(value: string): Promise<void> {
  await AsyncStorage.setItem(KEYS.SAVED_STATE, value);
}

export async function getBiometricEnabled(): Promise<boolean> {
  return (await AsyncStorage.getItem(KEYS.BIOMETRIC)) === 'true';
}

export async function setBiometricEnabled(value: boolean): Promise<void> {
  await AsyncStorage.setItem(KEYS.BIOMETRIC, value ? 'true' : 'false');
}
