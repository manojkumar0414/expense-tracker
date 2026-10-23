// Storage adapter selection
// In Phase 4, this will detect if we're on native (Capacitor) and use the native adapter
// For now, always use web adapter

import { dexieStorage } from './web/dexieStorage.js';

export const storageAdapter = dexieStorage;

// Notification adapter (Phase 3)
// export const notifyAdapter = webNotify; // or capacitorNotify in Phase 4
