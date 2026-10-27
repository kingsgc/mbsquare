import { ServiceScreen } from '../../components/ServiceScreen';

export default function Electricity() {
  return (
    <ServiceScreen
      title="Electricity Token"
      description="Purchase prepaid/postpaid electricity tokens."
      endpoint="/api/electricity/"
      fields={[
        { name: 'provider', label: 'Provider ID', placeholder: 'Disco provider ID', keyboardType: 'numeric' },
        { name: 'meternumber', label: 'Meter Number', placeholder: 'Meter number', keyboardType: 'numeric' },
        { name: 'metertype', label: 'Meter Type', placeholder: 'prepaid / postpaid' },
        { name: 'amount', label: 'Amount', placeholder: '1000', keyboardType: 'numeric' },
        { name: 'phone', label: 'Phone Number', placeholder: 'Optional', keyboardType: 'phone-pad', optional: true },
        { name: 'ref', label: 'Reference', placeholder: 'Optional', optional: true },
      ]}
    />
  );
}
