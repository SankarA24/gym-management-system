import Topbar from '@/components/Topbar';
import RemindersScreen from '@/screens/RemindersScreen';

export default function RemindersPage() {
  return (
    <>
      <Topbar title="Reminders" subtitle="Renewals due soon and overdue payments" />
      <RemindersScreen />
    </>
  );
}