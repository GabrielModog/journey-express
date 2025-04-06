"use client";

import { Container, Title } from '@mantine/core';
import { ColaboradoresList } from '@/features/colaboradores/components/colaboradores-list';

export default function ColaboradoresPage() {
  return (
    <Container size="xl">
      <Title order={1} mb="xl">Colaboradores</Title>
      <ColaboradoresList />
    </Container>
  );
} 