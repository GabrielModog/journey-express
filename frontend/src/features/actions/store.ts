import { create } from "zustand";
import { Action } from '@/lib/api/api-client.type';
import { api } from '@/lib/api/api-client';

interface ActionsState {
  actions: Action[];
  isLoading: boolean;
  error: string | null;
  fetchActions: () => Promise<void>;
  createAction: (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateAction: (id: string, data: Partial<Action>) => Promise<void>;
  deleteAction: (id: string) => Promise<void>;
  getAction: (id: string) => Action | undefined;
}

export const useActionsStore = create<ActionsState>((set) => ({
  actions: [],
  isLoading: false,
  error: null,

  fetchActions: async () => {
    try {
      set({ isLoading: true, error: null });
      const response = await api.get<Action[]>('/actions');
      set({ actions: response ?? [], isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar ações', isLoading: false });
    }
  },

  createAction: async (data: Omit<Action, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      set({ isLoading: true, error: null });
      const newAction = await api.post<Action>('/actions', data);
      set((state: ActionsState) => ({
        actions: [...state.actions, newAction],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao criar ação', isLoading: false });
    }
  },

  updateAction: async (id: string, data: Partial<Action>) => {
    try {
      set({ isLoading: true, error: null });
      const updatedAction = await api.put<Action>(`/actions/${id}`, data);
      set((state: ActionsState) => ({
        actions: state.actions.map((a) => (a.id === id ? updatedAction : a)),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao atualizar ação', isLoading: false });
    }
  },

  deleteAction: async (id: string) => {
    try {
      set({ isLoading: true, error: null });
      await api.delete(`/actions/${id}`);
      set((state: ActionsState) => ({
        actions: state.actions.filter((a) => a.id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: 'Erro ao excluir ação', isLoading: false });
    }
  },

  getAction: (id: string) => {
    const state = useActionsStore.getState();
    return state.actions.find((a) => a.id === id);
  },
})); 