'use client';

import { create } from 'zustand';
import { notifications } from '@mantine/notifications';
import { api, Colaborador} from '@/lib/api';

interface ColaboradoresState {
  colaboradores: Colaborador[];
  isLoading: boolean;
  error: string | null;
  fetchColaboradores: () => Promise<void>;
  createColaborador: (data: Omit<Colaborador, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateColaborador: (id: string, data: Partial<Colaborador>) => Promise<void>;
  deleteColaborador: (id: string) => Promise<void>;
  vincularJornada: (colaboradorId: string, jornadaId: string, startDate: string) => Promise<void>;
}

export const useColaboradoresStore = create<ColaboradoresState>((set) => ({
  colaboradores: [],
  isLoading: false,
  error: null,

  fetchColaboradores: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Colaborador[]>('/colaboradores');
      set({ colaboradores: response ?? [], isLoading: false });
    } catch (error) {
      notifications.show({
        title: 'ERROR',
        message: 'Erro ao carregar colaboradores',
      })
      set({ error: 'Erro ao carregar colaboradores', isLoading: false });
    }
  },

  createColaborador: async (data: Omit<Colaborador, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newColaborador = await api.post<Colaborador>('/colaboradores', data);
      set((state: ColaboradoresState) => ({
        colaboradores: [...state.colaboradores, newColaborador],
        isLoading: false,
      }));
      notifications.show({
        title: 'SUCESSO',
        message: 'Colaborador criado com sucesso!',
      })
    } catch (error) {
      set({ error: 'Erro ao criar colaborador', isLoading: false });
      notifications.show({
        title: 'ERROR',
        message: 'Falha ao criar colaborador.',
      })
    }
  },

  updateColaborador: async (id: string, data: Partial<Colaborador>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedColaborador = await api.put<Colaborador>(`/colaboradores/${id}`, data);
      set((state: ColaboradoresState) => ({
        colaboradores: state.colaboradores.map((c: Colaborador) => (c._id === id ? updatedColaborador : c)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar colaborador', isLoading: false });
    }
  },

  deleteColaborador: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/colaboradores/${id}`);
      set((state: ColaboradoresState) => ({
        colaboradores: state.colaboradores.filter((c: Colaborador) => c._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir colaborador', isLoading: false });
    }
  },

  vincularJornada: async (colaboradorId: string, jornadaId: string, startDate: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.post('/vincular-jornada/vincular', {
        colaboradorId,
        jornadaId,
        startDate,
      });
      set({ isLoading: false });
      notifications.show({
        title: 'SUCESSO',
        message: 'Jornada vinculado ao colaborador com sucesso!',
      })
    } catch (error) {
      set({ error: 'Erro ao vincular jornada', isLoading: false });
      notifications.show({
        title: 'ERROR',
        message: 'Falha ao vincular jornada ao colaborador',
      })
    }
  },
})); 