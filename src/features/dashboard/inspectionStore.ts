import { create } from 'zustand';

import { nativeBridge } from '../../services/nativeBridge';

export type Inspection = {
  id: string;
  photoPath: string;
  lat: number | null;
  lng: number | null;
  capturedAt: number;
};

type State = {
  inspections: Inspection[];
  capture: () => Promise<void>;
  load: () => Promise<void>;
};

const STORAGE_FILE = 'inspections.json';

export const useInspectionStore = create<State>((set, get) => ({
  inspections: [],

  capture: async () => {
    const photo = await nativeBridge.takePhoto();
    if (!photo) return;
    const location = await nativeBridge.getCurrentLocation();
    await nativeBridge.tap();

    const inspection: Inspection = {
      id: `insp_${Date.now()}`,
      photoPath: photo.webPath,
      lat: location?.lat ?? null,
      lng: location?.lng ?? null,
      capturedAt: Date.now(),
    };

    const next = [...get().inspections, inspection];
    set({ inspections: next });
    await nativeBridge.writeJsonFile(STORAGE_FILE, next);
  },

  load: async () => {
    const stored = await nativeBridge.readJsonFile<Inspection[]>(STORAGE_FILE);
    set({ inspections: stored ?? [] });
  },
}));
