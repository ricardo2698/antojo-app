import { NextRequest, NextResponse } from 'next/server';

interface FirebaseAuthError {
  error?: {
    message?: string;
    code?: number;
  };
}

interface FirebaseSignUpResponse {
  localId: string;
}

async function createFirebaseUser(email: string, password: string): Promise<string> {
  const res = await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, returnSecureToken: false }),
    }
  );

  if (!res.ok) {
    const err = (await res.json()) as FirebaseAuthError;
    const msg = err.error?.message ?? 'Error al crear el usuario';
    if (msg === 'EMAIL_EXISTS') throw new Error('Ya existe un usuario con ese correo');
    throw new Error(msg);
  }

  const data = (await res.json()) as FirebaseSignUpResponse;
  return data.localId;
}

async function deleteFirebaseUser(uid: string): Promise<void> {
  await fetch(
    `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${process.env.NEXT_PUBLIC_FIREBASE_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ localId: uid }),
    }
  );
}

// POST: crea el usuario en Firebase Auth y devuelve el uid
// El batch de Firestore lo hace el cliente (que sí tiene auth context)
export async function POST(request: NextRequest) {
  try {
    const { adminEmail, adminPassword } = (await request.json()) as {
      adminEmail: string;
      adminPassword: string;
    };

    const adminUid = await createFirebaseUser(adminEmail, adminPassword);
    return NextResponse.json({ adminUid });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    const isClientError = message === 'Ya existe un usuario con ese correo';
    return NextResponse.json(
      { error: message },
      { status: isClientError ? 409 : 500 }
    );
  }
}

// DELETE: rollback — borra el usuario de Auth si el batch de Firestore falló
export async function DELETE(request: NextRequest) {
  try {
    const { uid } = (await request.json()) as { uid: string };
    await deleteFirebaseUser(uid);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Error al eliminar usuario' }, { status: 500 });
  }
}
