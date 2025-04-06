'use client';

import { useEffect, useMemo } from 'react';
import { Table, Text } from '@mantine/core';
import { useVinculoJornadaStore } from '@/features/vinculos/store';
import { LoadingState } from '@/components/ui/loading-state';
import { EmptyState } from '@/components/ui/empty-state';
import { formatDate } from '@/lib/utils/date';

export function VinculoJornadaList() {
  const { vinculos, isLoading, error, fetchVinculos } = useVinculoJornadaStore();

  useEffect(() => {
    fetchVinculos();
  }, [fetchVinculos]);

  const rows = useMemo(() =>
    vinculos.map((vinculo) => (
      <Table.Tr key={vinculo._id}>
        <Table.Td>{vinculo.status}</Table.Td>
        <Table.Td>{formatDate(vinculo.startDate)}</Table.Td>
        <Table.Td>{formatDate(vinculo.updatedAt)}</Table.Td>
      </Table.Tr>
    )), [vinculos])

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <Text color="red">{error}</Text>;
  }

  if (vinculos.length === 0) {
    return (
      <EmptyState
        title="Nenhum vínculo encontrado"
        description=""
      />
    );
  }

  return (
    <>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Status</Table.Th>
            <Table.Th>Data de Início</Table.Th>
            <Table.Th>Última Atualização</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {rows}
        </Table.Tbody>
      </Table>
    </>
  );
} 