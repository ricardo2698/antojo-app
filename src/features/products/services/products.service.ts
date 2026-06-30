import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase/config';
import type { Product, CreateProductData, UpdateProductData } from '@/types';

function productsRef(restaurantId: string) {
  return collection(db, 'restaurants', restaurantId, 'products');
}

export const productsService = {
  async getAll(restaurantId: string): Promise<Product[]> {
    const q = query(productsRef(restaurantId), orderBy('sortOrder', 'asc'));
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Product);
  },

  async getByCategory(restaurantId: string, categoryId: string): Promise<Product[]> {
    const q = query(
      productsRef(restaurantId),
      where('categoryId', '==', categoryId),
      orderBy('sortOrder', 'asc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ ...d.data(), id: d.id }) as Product);
  },

  async create(data: CreateProductData): Promise<string> {
    const now = new Date().toISOString();
    const ref = await addDoc(productsRef(data.restaurantId), {
      ...data,
      createdAt: now,
      updatedAt: now,
    });
    await updateDoc(ref, { id: ref.id });
    return ref.id;
  },

  async update(restaurantId: string, id: string, data: UpdateProductData): Promise<void> {
    await updateDoc(doc(productsRef(restaurantId), id), {
      ...data,
      updatedAt: new Date().toISOString(),
    });
  },

  async toggleAvailable(restaurantId: string, id: string, isAvailable: boolean): Promise<void> {
    await updateDoc(doc(productsRef(restaurantId), id), {
      isAvailable,
      updatedAt: new Date().toISOString(),
    });
  },

  async delete(restaurantId: string, id: string): Promise<void> {
    await deleteDoc(doc(productsRef(restaurantId), id));
  },
};
