import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase/admin';

// GET: lista los view users de un restaurante
export async function GET(request: NextRequest) {
  try {
    const restaurantId = request.nextUrl.searchParams.get('restaurantId');
    if (!restaurantId) {
      return NextResponse.json({ error: 'restaurantId requerido' }, { status: 400 });
    }
    const snap = await adminDb
      .collection('users')
      .where('restaurantId', '==', restaurantId)
      .where('role', '==', 'restaurant_view')
      .get();
    const users = snap.docs.map((d) => d.data());
    return NextResponse.json({ users });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al obtener usuarios';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// POST: crea el usuario en Firebase Auth y devuelve el uid
export async function POST(request: NextRequest) {
  try {
    const { email, password, displayName } = (await request.json()) as {
      email: string;
      password: string;
      displayName: string;
    };

    const userRecord = await adminAuth.createUser({ email, password, displayName });
    return NextResponse.json({ uid: userRecord.uid });
  } catch (error) {
    const code = (error as { code?: string }).code ?? '';
    const message = error instanceof Error ? error.message : 'Error al crear el usuario';
    const isConflict = code === 'auth/email-already-exists';
    return NextResponse.json(
      { error: isConflict ? 'Ya existe un usuario con ese correo' : message },
      { status: isConflict ? 409 : 500 }
    );
  }
}

// PATCH: actualiza email y/o contraseña en Firebase Auth
export async function PATCH(request: NextRequest) {
  try {
    const { uid, email, password, displayName } = (await request.json()) as {
      uid: string;
      email?: string;
      password?: string;
      displayName?: string;
    };

    const updates: { email?: string; password?: string; displayName?: string } = {};
    if (email) updates.email = email;
    if (password) updates.password = password;
    if (displayName) updates.displayName = displayName;

    await adminAuth.updateUser(uid, updates);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al actualizar el usuario';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE: elimina el usuario de Firebase Auth
export async function DELETE(request: NextRequest) {
  try {
    const { uid } = (await request.json()) as { uid: string };
    await adminAuth.deleteUser(uid);
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error al eliminar el usuario';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
