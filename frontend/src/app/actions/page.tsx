"use client";
import { Container, Title } from '@mantine/core';
import { ActionsList } from '@/features/actions/components/actions-list';

export default function ActionsPage() {
  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Actions</Title>
      <ActionsList />
    </Container>
  );
} 