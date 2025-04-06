"use client";

import { Container, Title } from '@mantine/core';
import { VinculoJornadaList } from '@/features/vinculos/components/vinculos-list';

export default function VinculoJornadaPage() {
  return (
    <Container size="xl">
      <Title order={1} mb="xl">Vínculos de Jornadas</Title>
      <VinculoJornadaList />
    </Container>
  );
} 