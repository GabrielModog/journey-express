'use client';

import { useState } from 'react';
import { Modal, Stack, Select, NumberInput, Button, Group } from '@mantine/core';
import { Action, ActionType } from '@/lib/api/api-client.type';
import { useActionsStore } from '@/features/actions/store';

interface ActionFormProps {
  action: Action | null;
  opened: boolean;
  onClose: () => void;
}

export function ActionForm({ action, opened, onClose }: ActionFormProps) {
  const { createAction, updateAction } = useActionsStore();
  const [formData, setFormData] = useState<Partial<Action>>({
    type: ActionType.VINCULACAO,
    order: 1,
    delay: 0,
    config: {},
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (action) {
      await updateAction(action.id, formData as Omit<Action, 'id' | 'createdAt' | 'updatedAt'>);
    } else {
      await createAction(formData as Omit<Action, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={action ? 'Editar Action' : 'Nova Action'}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Select
            label="Tipo"
            placeholder="Selecione o tipo de action"
            data={[
              { value: ActionType.VINCULACAO, label: 'Vinculação' },
              { value: ActionType.DESVINCULACAO, label: 'Desvinculação' },
            ]}
            value={formData.type}
            onChange={(value) => setFormData({ ...formData, type: value as ActionType })}
            required
          />
          <NumberInput
            label="Ordem"
            placeholder="Digite a ordem"
            value={formData.order}
            onChange={(value: string | number) => setFormData({ ...formData, order: Number(value) || 1 })}
            min={1}
            required
          />
          <NumberInput
            label="Atraso (minutos)"
            placeholder="Digite o atraso em minutos"
            value={formData.delay}
            onChange={(value: string | number) => setFormData({ ...formData, delay: Number(value) || 0 })}
            min={0}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {action ? 'Atualizar' : 'Criar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 