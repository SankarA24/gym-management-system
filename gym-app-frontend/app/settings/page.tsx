import Topbar from '@/components/Topbar';
import SettingsScreen from '@/screens/SettingsScreen';

export default function SettingsPage() {
  return (
    <>
      <Topbar title="Settings" subtitle="Manage your workspace, defaults and preferences" />
      <SettingsScreen />
    </>
  );
}