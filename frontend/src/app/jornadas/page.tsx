"use client";

import { Container, Title } from '@mantine/core';
import { JornadasList } from '@/features/jornadas/components/jornadas-list';

export default function JornadasPage() {
  return (
    <Container size="xl">
      <Title order={1} mb="xl">Jornadas</Title>
      <JornadasList />
    </Container>
  );
} 