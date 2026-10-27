import { ServiceScreen } from '../../components/ServiceScreen';

export default function Airtime() {
  return (
    <ServiceScreen
      title="Airtime Purchase"
      description="Buy VTU or Share-and-Sell airtime using the API."
      endpoint="/api/airtime/"
      fields={[
        { name: 'network', label: 'Network ID', placeholder: '1=MTN, 2=GLO, 3=9MOBILE, 4=AIRTEL', keyboardType: 'numeric' },
        { name: 'amount', label: 'Amount', placeholder: '100', keyboardType: 'numeric' },
        { name: 'phone', label: 'Phone Number', placeholder: '08012345678', keyboardType: 'phone-pad' },
        { name: 'airtime_type', label: 'Airtime Type', placeholder: 'VTU / Share And Sell / Momo / Awoof', defaultValue: 'VTU' },
        { name: 'ported_number', label: 'Ported Number', placeholder: 'false', defaultValue: 'false' },
        { name: 'ref', label: 'Reference', placeholder: 'Optional', optional: true },
      ]}
    />
  );
}
