import Topbar from '@/components/Topbar';
import PaymentsScreen from '@/screens/PaymentsScreen';

export default function PaymentsPage() {
  return (
    <>
      <Topbar title="Payments" subtitle="Full history of fees collected across all members" />
      <PaymentsScreen />
    </>
  );
}