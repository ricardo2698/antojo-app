import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { OrderStatus, CreateOrderStatusData } from '@/types';

function statusesRef(restaurantId: string) {
  return collection(db, 'restaurants', restaurantId, 'orderStatuses');
}

export const orderStatusesService = {
  async getAll(restaurantId: string): Promise<OrderStatus[]> {
    const q = query(statusesRef(restaurantId), orderBy('sortOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as OrderStatus);
  },

  async create(data: CreateOrderStatusData): Promise<string> {
    const now = new Date().toISOString();
    const ref = await addDoc(statusesRef(data.restaurantId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    await updateDoc(ref, { id: ref.id });
    return ref.id;
  },

  async update(
    restaurantId: string,
    id: string,
    data: Partial<Pick<OrderStatus, 'name' | 'color' | 'sortOrder' | 'isActive'>>
  ): Promise<void> {
    await updateDoc(doc(statusesRef(restaurantId), id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async toggleActive(restaurantId: string, id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(statusesRef(restaurantId), id), {
      isActive,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(restaurantId: string, id: string): Promise<void> {
    await deleteDoc(doc(statusesRef(restaurantId), id));
  },
};
