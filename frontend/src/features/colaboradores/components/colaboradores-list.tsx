'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Table,
  Button,
  Group,
  Text,
  Modal,
  TextInput,
  Stack,
  ActionIcon,
  Badge,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconEdit, IconPlugConnected, IconTrash } from '@tabler/icons-react';

import { useColaboradoresStore } from '../store';
import { Colaborador } from '@/lib/api';
import { EmptyState } from '@/components/ui/empty-state';
import { LoadingState } from '@/components/ui/loading-state';
import { formatDate } from '@/lib/utils/date';
import { ColaboradorForm } from '@/features/colaboradores/components/colaboradores-form';
import { ColaboradorAssigmentForm } from './colaborador-assigment';

export function ColaboradoresList() {
  const { colaboradores, isLoading, error, fetchColaboradores, deleteColaborador } = useColaboradoresStore();
  const [selectedColaborador, setSelectedColaborador] = useState<Colaborador | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAssigmentOpen, setIsAssigmentOpen] = useState(false)

  useEffect(() => {
    fetchColaboradores();
  }, [fetchColaboradores]);

  const handleEdit = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setIsFormOpen(true);
  };

  const handleAssigment = (colaborador: Colaborador) => {
    setSelectedColaborador(colaborador);
    setIsAssigmentOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este colaborador?')) {
      await deleteColaborador(id);
    }
  };

  const handleCreate = () => {
    setSelectedColaborador(null);
    setIsFormOpen(true);
  };


  const rows = useMemo(() => colaboradores.map((colaborador: Colaborador) => (
    <Table.Tr key={colaborador._id}>
      <Table.Td>{colaborador.name}</Table.Td>
      <Table.Td>{colaborador.email}</Table.Td>
      <Table.Td>
        <Group gap="xs" justify="flex-start">
          <Button 
          size="compact-xs"
          variant="light"
          onClick={() => handleEdit(colaborador)}>
            Editar
          </Button>
          <Button 
          size="compact-xs"
          variant="light"
          color="red" onClick={() => handleDelete(colaborador._id)}>
            Deletar
          </Button>
          <Button 
          size="compact-xs"
          variant="light"
          c="teal"
          onClick={() => handleAssigment(colaborador)}>
            Vincular
          </Button>
        </Group>
      </Table.Td>
      <Table.Td>{formatDate(colaborador.createdAt)}</Table.Td>
    </Table.Tr>
  )), [colaboradores])

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <Text c="red">{error}</Text>;
  }

  if (colaboradores.length === 0) {
    return (
      <EmptyState
        title="Nenhum colaborador encontrado"
        description="Clique no botão abaixo para criar um novo colaborador"
        action={
          <Button onClick={handleCreate} variant="filled">
            Criar Colaborador
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Group mb="md">
        <Button onClick={handleCreate} variant="filled">
          Criar Colaborador
        </Button>
      </Group>

      <Table striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Email</Table.Th>
            <Table.Th>Ações</Table.Th>
            <Table.Th>Data de Criação</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows}
        </Table.Tbody>
      </Table>

      <ColaboradorForm
        colaborador={selectedColaborador}
        opened={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
      {selectedColaborador && (
        <ColaboradorAssigmentForm
          colaborador={selectedColaborador}
          opened={isAssigmentOpen}
          onClose={() => {
            setIsAssigmentOpen(false);
            setSelectedColaborador(null);
          }}
        />
      )}
    </>
  );
} 