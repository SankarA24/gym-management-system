'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { StoreProvider, useAppState, useActions } from '@/lib/store';
import { ThemeProvider } from '@/lib/theme-context';
import { ModalProvider, useModal } from '@/lib/modal-context';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import MemberFormModal from './MemberFormModal';

const AUTH_PATHS = ['/login', '/register'];

function AppContent({ children }: { children: React.ReactNode }) {
  const state = useAppState();
  const actions = useActions();
  const { modal, closeModal } = useModal();
  const router = useRouter();

  // Load members from backend when the authenticated shell mounts
  useEffect(() => {
    actions.reload();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex min-h-screen bg-(--bg)">
      <Sidebar />
      <main className="flex-1 min-w-0 flex flex-col">{children}</main>
      <BottomNav />
      {modal?.kind === 'add' && (
        <MemberFormModal
          settings={state.settings}
          onClose={closeModal}
          onSave={async payload => {
            const id = await actions.addMember(payload);
            closeModal();
            router.push(`/members/${id}`);
          }}
        />
      )}
      {modal?.kind === 'edit' && (
        <MemberFormModal
          initial={modal.member}
          onClose={closeModal}
          onSave={async payload => {
            await actions.updateMember(modal.member.id, payload);
            closeModal();
          }}
        />
      )}
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { token } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const isAuthPage = AUTH_PATHS.includes(pathname);

  useEffect(() => {
    if (!isAuthPage && !token) {
      router.replace('/login');
    }
  }, [token, isAuthPage, pathname, router]);

  if (isAuthPage) return <>{children}</>;
  if (!token) return null;
  return <AppContent>{children}</AppContent>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <StoreProvider>
        <ThemeProvider>
          <ModalProvider>
            <AuthGuard>{children}</AuthGuard>
          </ModalProvider>
        </ThemeProvider>
      </StoreProvider>
    </AuthProvider>
  );
}
