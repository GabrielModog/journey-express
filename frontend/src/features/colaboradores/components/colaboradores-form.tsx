import { useEffect, useState } from 'react';
import { Modal, TextInput, Switch, Stack, Button, Group } from '@mantine/core';

import { useColaboradoresStore } from '@/features/colaboradores/store';
import { Colaborador } from '@/lib/api';

interface ColaboradorFormProps {
  colaborador: Colaborador | null;
  opened: boolean;
  onClose: () => void;
}

export function ColaboradorForm({ colaborador, opened, onClose }: ColaboradorFormProps) {
  const { createColaborador, updateColaborador } = useColaboradoresStore();
  const [formData, setFormData] = useState<Partial<Colaborador>>({
    name: '',
    email: '',
    phone: '',
    isActive: true,
  });

  useEffect(() => {
    if (colaborador) {
      setFormData(colaborador);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        isActive: true,
      });
    }
  }, [colaborador]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (colaborador) {
      await updateColaborador(colaborador._id, formData);
    } else {
      await createColaborador(formData as Omit<Colaborador, 'id' | 'createdAt' | 'updatedAt'>);
    }
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={colaborador ? 'Editar Colaborador' : 'Novo Colaborador'}
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <TextInput
            label="Nome"
            placeholder="Digite o nome do colaborador"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextInput
            label="Email"
            placeholder="Digite o email do colaborador"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextInput
            label="Telefone"
            placeholder="Digite o telefone do colaborador"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            required
          />
          <Switch
            label="Ativo"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.currentTarget.checked })}
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              {colaborador ? 'Atualizar' : 'Criar'}
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 