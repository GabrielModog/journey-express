'use client';

import { useState } from 'react';
import {
  AppShell,
  Burger,
  Group,
  NavLink,
  Text,
  rem,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { usePathname, useRouter } from 'next/navigation';
import {
  IconHome,
  IconRoute,
  IconSettings,
  IconUsers,
} from '@tabler/icons-react';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShellLayout({ children }: AppShellProps) {
  const [opened, { toggle }] = useDisclosure(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: 'Homepage', icon: IconHome, href: '/' },
    { label: 'Jornadas', icon: IconRoute, href: '/jornadas' },
    { label: 'Actions', icon: IconSettings, href: '/actions' },
    { label: 'Colaboradores', icon: IconUsers, href: '/colaboradores' },
  ];

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <Text size="xl" fw={700}>Journey Express</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            label={item.label}
            leftSection={<item.icon style={{ width: rem(20), height: rem(20) }} stroke={1.5} />}
            active={pathname === item.href}
            onClick={() => {
              router.push(item.href);
              if (window.innerWidth < 768) {
                toggle();
              }
            }}
          />
        ))}
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
} 