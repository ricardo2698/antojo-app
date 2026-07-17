import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  query,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { DeliveryZone, CreateDeliveryZoneData, UpdateDeliveryZoneData } from '@/types';

function zonesRef(restaurantId: string) {
  return collection(db, 'restaurants', restaurantId, 'deliveryZones');
}

export const deliveryZonesService = {
  async getAll(restaurantId: string): Promise<DeliveryZone[]> {
    const q = query(zonesRef(restaurantId), orderBy('sortOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as DeliveryZone);
  },

  async create(restaurantId: string, data: CreateDeliveryZoneData): Promise<DeliveryZone> {
    const now = new Date().toISOString();
    const ref = await addDoc(zonesRef(restaurantId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    await updateDoc(ref, { id: ref.id });
    return {
      ...data,
      id: ref.id,
      createdAt: now,
      updatedAt: now,
    };
  },

  async update(restaurantId: string, zoneId: string, data: UpdateDeliveryZoneData): Promise<void> {
    await updateDoc(doc(zonesRef(restaurantId), zoneId), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(restaurantId: string, zoneId: string): Promise<void> {
    await deleteDoc(doc(zonesRef(restaurantId), zoneId));
  },
};
