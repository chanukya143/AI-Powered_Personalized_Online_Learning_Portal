import React from 'react';
import { NeoModal } from './NeoModal';
import { NeoButton } from './NeoButton';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
}) => {
  return (
    <NeoModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="460px"
      footer={
        <>
          <NeoButton variant="neutral" size="sm" onClick={onClose} disabled={isLoading}>
            {cancelText}
          </NeoButton>
          <NeoButton
            variant={isDestructive ? 'danger' : 'primary'}
            size="sm"
            onClick={onConfirm}
            isLoading={isLoading}
          >
            {confirmText}
          </NeoButton>
        </>
      }
    >
      <p style={{ margin: 0, fontSize: '0.95rem', color: 'var(--neo-text)', lineHeight: 1.5 }}>
        {message}
      </p>
    </NeoModal>
  );
};
