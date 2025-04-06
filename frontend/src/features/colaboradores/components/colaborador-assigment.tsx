'use client';

import { useEffect, useState } from 'react';
import { Modal, Stack, Select, Button, Group } from '@mantine/core';
import { DateTimePicker } from "@mantine/dates"
import { useColaboradoresStore } from '@/features/colaboradores/store';
import { useJornadasStore } from '@/features/jornadas/store';
import { Colaborador } from '@/lib/api';

interface ColaboradorAssigmentFormProps {
  colaborador: Colaborador;
  opened: boolean;
  onClose: () => void;
}

export function ColaboradorAssigmentForm({ colaborador, opened, onClose }: ColaboradorAssigmentFormProps) {
  const { vincularJornada } = useColaboradoresStore();
  const { jornadas, fetchJornadas } = useJornadasStore();
  const [selectedJornada, setSelectedJornada] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchJornadas();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJornada || !startDate) return;

    try {
      setIsLoading(true);
      await vincularJornada(
        colaborador._id,
        selectedJornada,
        startDate.toISOString()
      );
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Vincular a Jornada"
    >
      <form onSubmit={handleSubmit}>
        <Stack>
          <Select
            label="Jornada"
            placeholder="Selecione uma jornada"
            data={jornadas.map(jornada => ({
              value: jornada._id,
              label: jornada.name,
            }))}
            value={selectedJornada}
            onChange={setSelectedJornada}
            required
          />
          <DateTimePicker
            label="Data de Início"
            placeholder="Selecione a data de início"
            value={startDate}
            onChange={setStartDate}
            required
          />
          <Group justify="flex-end" mt="md">
            <Button variant="subtle" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" loading={isLoading}>
              Vincular
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
} 