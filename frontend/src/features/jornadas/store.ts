'use client';

import { create } from 'zustand';
import { api, Jornada } from '@/lib/api';

interface JornadasState {
  jornadas: Jornada[];
  isLoading: boolean;
  error: string | null;
  fetchJornadas: () => Promise<void>;
  createJornada: (data: Omit<Jornada, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateJornada: (id: string, data: Partial<Jornada>) => Promise<void>;
  deleteJornada: (id: string) => Promise<void>;
  getJornada: (id: string) => Jornada | undefined;
}

export const useJornadasStore = create<JornadasState>((set) => ({
  jornadas: [],
  isLoading: false,
  error: null,

  fetchJornadas: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Jornada[]>('/jornadas') as Jornada[];
      set({ jornadas: response ?? [], isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar jornadas', isLoading: false });
    }
  },

  createJornada: async (data: Omit<Jornada, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newJornada = await api.post<Jornada>('/jornadas', {
        ...data,
        actions: data.actions.map(a => a._id)
      });
      set((state: JornadasState) => ({
        jornadas: [...state.jornadas, newJornada],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao criar jornada', isLoading: false });
    }
  },

  updateJornada: async (id: string, data: Partial<Jornada>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedJornada = await api.put<Jornada>(`/jornadas/${id}`, data);
      set((state: JornadasState) => ({
        jornadas: state.jornadas.map((j) => (j._id === id ? updatedJornada : j)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar jornada', isLoading: false });
    }
  },

  deleteJornada: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/jornadas/${id}`);
      set((state: JornadasState) => ({
        jornadas: state.jornadas.filter((j) => j._id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir jornada', isLoading: false });
    }
  },

  getJornada: (id: string) => {
    const state = useJornadasStore.getState();
    return state.jornadas.find((j) => j.id === id);
  },
})); 