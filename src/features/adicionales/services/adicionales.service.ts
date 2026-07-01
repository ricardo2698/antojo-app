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
import type { Adicional, CreateAdicionalData, UpdateAdicionalData } from '@/types';

function adicionalesRef(restaurantId: string) {
  return collection(db, 'restaurants', restaurantId, 'adicionales');
}

export const adicionalesService = {
  async getAll(restaurantId: string): Promise<Adicional[]> {
    const q = query(adicionalesRef(restaurantId), orderBy('name', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Adicional);
  },

  async create(restaurantId: string, data: CreateAdicionalData): Promise<string> {
    const now = new Date().toISOString();
    const ref = await addDoc(adicionalesRef(restaurantId), {
      ...data,
      restaurantId,
      createdAt: now,
      updatedAt: now,
    });
    await updateDoc(ref, { id: ref.id });
    return ref.id;
  },

  async update(restaurantId: string, id: string, data: UpdateAdicionalData): Promise<void> {
    await updateDoc(doc(adicionalesRef(restaurantId), id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(restaurantId: string, id: string): Promise<void> {
    await deleteDoc(doc(adicionalesRef(restaurantId), id));
  },
};
