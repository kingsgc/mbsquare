import { ServiceScreen } from '../../components/ServiceScreen';

export default function Cable() {
  return (
    <ServiceScreen
      title="Cable TV Subscription"
      description="Subscribe to cable TV using provider ID and plan ID."
      endpoint="/api/cabletv/"
      fields={[
        { name: 'provider', label: 'Provider ID', placeholder: 'Cable provider ID', keyboardType: 'numeric' },
        { name: 'plan', label: 'Plan ID', placeholder: 'Cable plan ID', keyboardType: 'numeric' },
        { name: 'iucnumber', label: 'IUC / Smart Card Number', placeholder: 'Decoder number' },
        { name: 'phone', label: 'Phone Number', placeholder: 'Optional', keyboardType: 'phone-pad', optional: true },
        { name: 'subtype', label: 'Sub Type', placeholder: 'Optional', optional: true },
        { name: 'ref', label: 'Reference', placeholder: 'Optional', optional: true },
      ]}
    />
  );
}
