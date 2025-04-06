'use client';

import { Center, Loader, Text, Stack } from '@mantine/core';

export function LoadingState() {
  return (
    <Center>
      <Stack align="center" gap="xs">
        <Loader />
        <Text>Carregando...</Text>
      </Stack>
    </Center>
  );
} 