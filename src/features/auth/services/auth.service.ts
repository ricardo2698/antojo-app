import {
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase/config';
import type { AppUser, UserRole } from '@/types';

export const authService = {
  async signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  },

  async signOut(): Promise<void> {
    await firebaseSignOut(auth);
  },

  async getUserData(uid: string): Promise<AppUser | null> {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    return docSnap.data() as AppUser;
  },

  async createUser(data: {
    email: string;
    password: string;
    displayName: string;
    role: UserRole;
    restaurantId?: string;
  }): Promise<string> {
    const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const { uid } = userCredential.user;

    await updateProfile(userCredential.user, { displayName: data.displayName });

    const now = new Date().toISOString();
    const userData: AppUser = {
      uid,
      email: data.email,
      displayName: data.displayName,
      role: data.role,
      restaurantId: data.restaurantId,
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };

    await setDoc(doc(db, 'users', uid), userData);
    return uid;
  },
};
