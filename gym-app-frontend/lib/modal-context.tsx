'use client';
import { createContext, useContext, useState } from 'react';
import type { Member } from './types';

type ModalState = { kind: 'add' } | { kind: 'edit'; member: Member } | null;

interface ModalContextValue {
  modal: ModalState;
  openAdd: () => void;
  openEdit: (m: Member) => void;
  closeModal: () => void;
}

const ModalCtx = createContext<ModalContextValue>({
  modal: null,
  openAdd: () => {},
  openEdit: () => {},
  closeModal: () => {},
});

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [modal, setModal] = useState<ModalState>(null);
  return (
    <ModalCtx.Provider value={{
      modal,
      openAdd: () => setModal({ kind: 'add' }),
      openEdit: (m) => setModal({ kind: 'edit', member: m }),
      closeModal: () => setModal(null),
    }}>
      {children}
    </ModalCtx.Provider>
  );
}

export function useModal() {
  return useContext(ModalCtx);
}