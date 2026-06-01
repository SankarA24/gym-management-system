'use client';
import { useParams, useRouter } from 'next/navigation';
import { useAppState } from '@/lib/store';
import Topbar from '@/components/Topbar';
import MemberDetailScreen from '@/screens/MemberDetailScreen';

export default function MemberDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { members } = useAppState();
  const member = members.find(m => m.id === id);

  return (
    <>
      <Topbar
        title={member?.name || 'Member'}
        backLabel="BACK TO MEMBERS"
        onBack={() => router.push('/members')}
      />
      <MemberDetailScreen memberId={id} />
    </>
  );
}