'use client';

import { Paper, Stack, Text, Center } from '@mantine/core';
import { IconInbox } from '@tabler/icons-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <Paper p="xl" radius="md" withBorder>
      <Center>
        <Stack align="center" gap="xs">
          <IconInbox size={48} color="gray" />
          <Text size="lg" fw={500}>{title}</Text>
          <Text c="dimmed" ta="center">{description}</Text>
          {action}
        </Stack>
      </Center>
    </Paper>
  );
} 