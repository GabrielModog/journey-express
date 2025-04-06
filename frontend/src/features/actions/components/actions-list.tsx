'use client';

import { useEffect, useState } from 'react';
import { Button, Group, Table } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';

import { Action, ActionType } from '@/lib/api';
import { useActionsStore } from '@/features/actions/store';
import { ActionForm } from '@/features/actions/components/action-form';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { LoadingState } from '@/components/ui/loading-state';
import { ErrorState } from '@/components/ui/error-state';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils/date';

export function ActionsList() {
  const { actions, isLoading, error, fetchActions, deleteAction } = useActionsStore();
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [formOpened, setFormOpened] = useState(false);
  const [deleteOpened, setDeleteOpened] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState onRetry={fetchActions} />;
  }

  if (!actions.length) {
    return (
      <EmptyState
        title="Nenhuma ação encontrada"
        description="Clique no botão abaixo para criar uma nova ação"
        action={
          <Button onClick={() => setFormOpened(true)}>
            Criar ação
          </Button>
        }
      />
    );
  }

  const handleDelete = async () => {
    if (!selectedAction) return;

    try {
      setDeleteLoading(true);
      await deleteAction(selectedAction);
      setDeleteOpened(false);
    } finally {
      setDeleteLoading(false);
      setSelectedAction(null);
    }
  };

  return (
    <>
      <Group mb="md">
        <Button onClick={() => setFormOpened(true)}>
          Criar ação
        </Button>
      </Group>
      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Tipo</Table.Th>
            <Table.Th>Ordem</Table.Th>
            <Table.Th>Delay</Table.Th>
            <Table.Th>Criado em</Table.Th>
            <Table.Th>Atualizado em</Table.Th>
            <Table.Th>Ações</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {actions.map((action: Action) => (
            <Table.Tr key={action._id}>
              <Table.Td>{ActionType[action.type as keyof typeof ActionType]}</Table.Td>
              <Table.Td>{action.order}</Table.Td>
              <Table.Td>{action.delay}</Table.Td>
              <Table.Td>{formatDate(action.createdAt)}</Table.Td>
              <Table.Td>{formatDate(action.updatedAt)}</Table.Td>
              <Table.Td>
                <Group gap="xs">
                  <Button
                    size="compact-xs"
                    variant="light"
                    leftSection={<IconEdit size={16} />}
                    onClick={() => {
                      setSelectedAction(action._id);
                      setFormOpened(true);
                    }}
                  >
                    Editar
                  </Button>
                  <Button
                    size="compact-xs"
                    variant="light"
                    color="red"
                    leftSection={<IconTrash size={16} />}
                    onClick={() => {
                      setSelectedAction(action._id);
                      setDeleteOpened(true);
                    }}
                  >
                    Excluir
                  </Button>
                </Group>
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <ActionForm
        opened={formOpened}
        onClose={() => {
          setFormOpened(false);
          setSelectedAction(null);
        }}
        action={actions.find((a: Action) => a._id === selectedAction) || null}
      />

      <ConfirmDialog
        opened={deleteOpened}
        onClose={() => {
          setDeleteOpened(false);
          setSelectedAction(null);
        }}
        onConfirm={handleDelete}
        title="Excluir ação"
        description="Tem certeza que deseja excluir esta ação?"
        loading={deleteLoading}
      />
    </>
  );
} 