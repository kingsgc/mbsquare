import { useMemo, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { Card } from './Card';
import { Field } from './Field';
import { apiPost } from '../lib/api';
import { AlertBox } from './AlertBox';

export type ServiceField = {
  name: string;
  label: string;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'phone-pad' | 'email-address';
  optional?: boolean;
  defaultValue?: string;
};

function extractErrors(data: any): string[] {
  const errors: string[] = [];
  if (!data) return errors;
  if (typeof data === 'string') errors.push(data);
  if (data.msg) errors.push(String(data.msg));
  if (data.error) errors.push(String(data.error));
  if (Array.isArray(data.errors)) {
    data.errors.forEach((e: any) => errors.push(String(e)));
  }
  if (data.status && data.status !== 'success') {
    errors.push(`Status: ${data.status}`);
  }
  return Array.from(new Set(errors));
}

export function ServiceForm({
  title,
  description,
  endpoint,
  fields,
  token,
}: {
  title: string;
  description: string;
  endpoint: string;
  fields: ServiceField[];
  token: string;
}) {
  const initialState = useMemo(() => {
    const state: Record<string, string> = {};
    fields.forEach((field) => {
      state[field.name] = field.defaultValue ?? '';
    });
    return state;
  }, [fields]);

  const [values, setValues] = useState<Record<string, string>>(initialState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>('');
  const [errors, setErrors] = useState<string[]>([]);
  const [success, setSuccess] = useState<string[]>([]);

  const handleSubmit = async () => {
    setLoading(true);
    setResult('');
    setErrors([]);
    setSuccess([]);

    const payload: Record<string, any> = {};
    fields.forEach((field) => {
      const value = values[field.name];
      if (!value && field.optional) return;
      payload[field.name] = value;
    });

    try {
      const response = await apiPost(token, endpoint, payload);
      const text = JSON.stringify(response.data, null, 2);
      setResult(text);

      if (response.ok) {
        setSuccess(['Request successful.']);
      } else {
        setErrors(extractErrors(response.data));
      }
    } catch (error: any) {
      setErrors([error?.message ?? 'Unknown error']);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      <AlertBox title="Error" messages={errors} variant="error" />
      <AlertBox title="Success" messages={success} variant="success" />

      <Card>
        <View style={styles.form}>
          {fields.map((field) => (
            <Field
              key={field.name}
              label={field.label}
              value={values[field.name]}
              onChangeText={(text) =>
                setValues((prev) => ({ ...prev, [field.name]: text }))
              }
              placeholder={field.placeholder}
              keyboardType={field.keyboardType}
            />
          ))}
        </View>
      </Card>

      <Button label={loading ? 'Sending...' : 'Submit'} onPress={handleSubmit} disabled={loading} />

      {result ? (
        <Card>
          <Text style={styles.resultLabel}>Response</Text>
          <Text style={styles.result}>{result}</Text>
        </Card>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#0F172A',
  },
  description: {
    fontSize: 14,
    color: '#64748B',
  },
  form: {
    gap: 12,
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 8,
  },
  result: {
    fontFamily: 'Courier',
    fontSize: 12,
    color: '#0F172A',
  },
});
