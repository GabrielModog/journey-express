'use client';

import { useEffect, useState } from 'react';
import { Modal, TextInput, Switch, Stack, Button, Group, MultiSelect } from '@mantine/core';

import { useJornadasStore } from '@/features/jornadas/store';
import { useActionsStore } from '@/features/actions/store';
import { Jornada } from '@/lib/api';

interface JornadaFormProps {
  jornada: Jornada | null;
  opened: boolean;
  onClose: () => void;
}

export function JornadaForm({ jornada, opened, onClose }: JornadaFormProps) {
  const { createJornada, updateJornada } = useJornadasStore();
  const { actions, fetchActions } = useActionsStore();
  const [formData, setFormData] = useState<Partial<Jornada>>({
    name: '',
    isActive: true,
    actions: [],
  });

  useEffect(() => {
    if (jornada) {
      setFormData(jornada);
    } else {
      setFormData({
        name: '',
        isActive: true,
        actions: [],
      });
    }
  }, [jornada]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (jornada) {
      await updateJornada(jornada._id, formData);
    } else {
      await createJornada(formData as Omit<Jornada, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={jornada ? 'Editar Jornada' : 'Nova Jornada'}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Nome"
            placeholder="Digite o nome da jornada"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <MultiSelect
            label="Actions"
            placeholder="Selecione as actions"
            data={actions.map(action => ({
              value: action._id,
              label: `${action.type} (Ordem: ${action.order}, Atraso: ${action.delay}min)`,
            }))}
            value={formData.actions?.map(action => action._id) || []}
            onChange={(value) => setFormData({
              ...formData,
              actions: actions.filter(action => value.includes(action._id)),
            })}
          />
          <Switch
            label="Ativa"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.currentTarget.checked })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {jornada ? 'Atualizar' : 'Criar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 