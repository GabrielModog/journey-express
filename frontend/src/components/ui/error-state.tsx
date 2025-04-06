'use client';

import { Center, Text, Stack, Button } from '@mantine/core';
import { IconRefresh } from '@tabler/icons-react';

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Ocorreu um erro',
  description = 'Não foi possível carregar os dados. Por favor, tente novamente.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Center h={200}>
      <Stack ta="center" gap="md">
        <Text size="xl" fw={500} c="red">
          {title}
        </Text>
        <Text c="dimmed" ta="center">
          {description}
        </Text>
        {onRetry && (
          <Button
            variant="light"
            leftSection={<IconRefresh size={16} />}
            onClick={onRetry}
          >
            Tentar novamente
          </Button>
        )}
      </Stack>
    </Center>
  );
} 