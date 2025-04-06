"use client"

import { Card, Container, Group, SimpleGrid, Text, Title } from "@mantine/core";
import { IconPlugConnected, IconRoute, IconSettings, IconUsers } from "@tabler/icons-react";
import { useRouter } from 'next/navigation';

const features = [
	{
		title: 'Jornadas',
		description: 'Gerencie suas jornadas de forma eficiente',
		icon: IconRoute,
		href: '/jornadas',
	},
	{
		title: 'Actions',
		description: 'Configure as actions para suas jornadas',
		icon: IconSettings,
		href: '/actions',
	},
	{
		title: 'Colaboradores',
		description: 'Gerencie seus colaboradores',
		icon: IconUsers,
		href: '/colaboradores',
	},
	{
		title: 'Vinculos',
		description: 'Gerencie seus vinculos de jornadas',
		icon: IconPlugConnected,
		href: '/vinculos',
	},
];

export default function Page() {
	const router = useRouter();
	return (
		<Container>
			<Title order={1} mb="md">Bem-vindo ao Jornadas</Title>
			<Text size="lg" mb="xl">
				Gerencie suas jornadas, ações e colaboradores em um só lugar.
			</Text>

			<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
				{features.map((feature) => (
					<Card
						key={feature.href}
						shadow="sm"
						padding="lg"
						radius="md"
						withBorder
						style={{ cursor: 'pointer' }}
						onClick={() => router.push(feature.href)}
					>
						<Card.Section>
							<Group justify="center" p="md">
								<feature.icon size={32} />
							</Group>
						</Card.Section>

						<Group justify="space-between" mt="md" mb="xs">
							<Text fw={500}>{feature.title}</Text>
						</Group>

						<Text size="sm" c="dimmed">
							{feature.description}
						</Text>
					</Card>
				))}
			</SimpleGrid>
		</Container>
	);
}
