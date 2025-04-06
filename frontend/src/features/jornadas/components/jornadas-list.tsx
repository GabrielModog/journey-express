"use client";

import { useEffect, useMemo, useState } from "react";
import { Button, Table, Badge, ActionIcon, Group, Text } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";

import { useJornadasStore } from "@/features/jornadas/store";
import { Jornada } from "@/lib/api";
import { JornadaForm } from "@/features/jornadas/components/jornada-form";
import { LoadingState } from "@/components/ui/loading-state";
import { EmptyState } from "@/components/ui/empty-state";
import { formatDate } from "@/lib/utils/date";

export function JornadasList() {
  const { jornadas, isLoading, error, fetchJornadas, deleteJornada } =
    useJornadasStore();
  const [selectedJornada, setSelectedJornada] = useState<Jornada | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    fetchJornadas();
  }, [fetchJornadas]);

  const handleEdit = (jornada: Jornada) => {
    setSelectedJornada(jornada);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Tem certeza que deseja excluir esta jornada?")) {
      await deleteJornada(id);
    }
  };

  const handleCreate = () => {
    setSelectedJornada(null);
    setIsFormOpen(true);
  };

  const rows = useMemo(
    () =>
      jornadas.map((jornada) => (
        <tr key={jornada._id}>
          <td>{jornada.name}</td>
          <td>
            <Badge color={jornada.isActive ? "green" : "red"}>
              {jornada.isActive ? "Ativa" : "Inativa"}
            </Badge>
          </td>
          <td>
            <Group gap="xs" p="left">
              <Button
                size="compact-xs"
                variant="light"
                onClick={() => handleEdit(jornada)}
              >
                Editar
              </Button>
              <Button
                size="compact-xs"
                variant="light"
                color="red"
                onClick={() => handleDelete(jornada._id)}
              >
                Deletar
              </Button>
            </Group>
          </td>
          <td>{formatDate(jornada.createdAt)}</td>
        </tr>
      )),
    [jornadas]
  );

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (jornadas.length === 0) {
    return (
      <EmptyState
        title="Nenhuma jornada encontrada"
        description="Clique no botão abaixo para criar uma nova jornada"
        action={
          <Button onClick={handleCreate} variant="filled">
            Criar Jornada
          </Button>
        }
      />
    );
  }

  return (
    <>
      <Group mb="md">
        <Button onClick={handleCreate} variant="filled">
          Criar Jornada
        </Button>
      </Group>

      <Table striped withRowBorders> 
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Nome</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Ações</Table.Th>
            <Table.Th>Data de Criação</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>

      <JornadaForm
        jornada={selectedJornada}
        opened={isFormOpen}
        onClose={() => setIsFormOpen(false)}
      />
    </>
  );
}
