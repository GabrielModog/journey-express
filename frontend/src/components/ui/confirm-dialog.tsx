'use client';

import { Button, Group, Modal, Stack, Text } from '@mantine/core';

interface ConfirmDialogProps {
  opened: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export function ConfirmDialog({
  opened,
  onClose,
  onConfirm,
  title = 'Confirmar ação',
  description = 'Tem certeza que deseja realizar esta ação?',
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={title} centered>
      <Stack gap="md">
        <Text>{description}</Text>
        <Group justify="flex-end" gap="sm">
          <Button variant="light" onClick={onClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
} 