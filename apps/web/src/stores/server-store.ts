import { create } from 'zustand';

interface Server {
  id: string;
  discordId: string;
  name: string;
  icon: string;
}

interface ServerState {
  selectedServer: Server | null;
  servers: Server[];
  
  setSelectedServer: (server: Server | null) => void;
  setServers: (servers: Server[]) => void;
}

export const useServerStore = create<ServerState>((set) => ({
  selectedServer: null,
  servers: [],
  
  setSelectedServer: (server) => set({ selectedServer: server }),
  setServers: (servers) => set({ servers }),
}));
