'use client';
import { Suspense } from 'react';
import { useAppState } from '@/lib/store';
import Topbar from '@/components/Topbar';
import MembersScreen from '@/screens/MembersScreen';

function MembersTopbar() {
  const { members } = useAppState();
  const subtitle = `${members.length} total · ${members.filter(m => !m.paused).length} active`;
  return <Topbar title="Members" subtitle={subtitle} />;
}

export default function MembersPage() {
  return (
    <>
      <MembersTopbar />
      <Suspense>
        <MembersScreen />
      </Suspense>
    </>
  );
}