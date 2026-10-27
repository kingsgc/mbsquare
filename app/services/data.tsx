import { ServiceScreen } from '../../components/ServiceScreen';

export default function Data() {
  return (
    <ServiceScreen
      title="Data Purchase"
      description="Buy data bundle using the API (requires data plan ID)."
      endpoint="/api/data/"
      fields={[
        { name: 'network', label: 'Network ID', placeholder: '1=MTN, 2=GLO, 3=9MOBILE, 4=AIRTEL', keyboardType: 'numeric' },
        { name: 'data_plan', label: 'Data Plan ID', placeholder: 'Plan ID', keyboardType: 'numeric' },
        { name: 'phone', label: 'Phone Number', placeholder: '08012345678', keyboardType: 'phone-pad' },
        { name: 'ported_number', label: 'Ported Number', placeholder: 'false', defaultValue: 'false' },
        { name: 'ref', label: 'Reference', placeholder: 'Optional', optional: true },
      ]}
    />
  );
}
