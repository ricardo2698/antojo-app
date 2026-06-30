import {
  collection,
  doc,
  getDocs,
  getDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  limit,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { Restaurant, UpdateRestaurantData } from '@/types';

export const restaurantsService = {
  async getAll(): Promise<Restaurant[]> {
    const snap = await getDocs(collection(db, 'restaurants'));
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Restaurant);
  },

  async getById(id: string): Promise<Restaurant | null> {
    const snap = await getDoc(doc(db, 'restaurants', id));
    if (!snap.exists()) return null;
    return { ...snap.data(), id: snap.id } as Restaurant;
  },

  async getBySlug(slug: string): Promise<Restaurant | null> {
    const q = query(collection(db, 'restaurants'), where('slug', '==', slug), limit(1));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    const d = snap.docs[0];
    return { ...d.data(), id: d.id } as Restaurant;
  },

  async update(id: string, data: UpdateRestaurantData): Promise<void> {
    await updateDoc(doc(db, 'restaurants', id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async toggleActive(id: string, isActive: boolean): Promise<void> {
    await updateDoc(doc(db, 'restaurants', id), {
      isActive,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, 'restaurants', id));
  },
};
