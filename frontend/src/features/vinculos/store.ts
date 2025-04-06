'use client';

import { create } from 'zustand';
import { api, VinculoJornada } from '@/lib/api';

interface VinculoJornadaState {
  vinculos: VinculoJornada[];
  isLoading: boolean;
  error: string | null;
  fetchVinculos: () => Promise<void>;
}

export const useVinculoJornadaStore = create<VinculoJornadaState>((set) => ({
  vinculos: [],
  isLoading: false,
  error: null,

  fetchVinculos: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<VinculoJornada[]>('/vincular-jornada');
      set({ vinculos: Array.isArray(response) ? response : [] });
    } catch (error) {
      set({ error: 'Erro ao carregar vínculos de jornada' });
    } finally {
      set({ isLoading: false })
    }
  },
})); 