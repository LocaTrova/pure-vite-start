import { v4 as uuidv4 } from 'uuid';

export interface FormSession {
  sessionId: string;
  startedAt: string;
  submitted: boolean;
}

const SESSION_KEY = 'formSession';

export function initFormSession(): FormSession | null {
  try {
    const existing = getFormSession();
    if (existing) {
      return existing;
    }

    const session: FormSession = {
      sessionId: uuidv4(),
      startedAt: new Date().toISOString(),
      submitted: false,
    };

    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    // sessionStorage may be disabled (private browsing) or quota exceeded
    console.warn('sessionStorage not available, form abandonment tracking disabled:', error);
    return null;
  }
}

export function getFormSession(): FormSession | null {
  try {
    const stored = sessionStorage.getItem(SESSION_KEY);
    if (!stored) {
      return null;
    }

    try {
      return JSON.parse(stored) as FormSession;
    } catch {
      // Corrupted JSON data
      return null;
    }
  } catch (error) {
    // sessionStorage access failed
    console.warn('sessionStorage not accessible:', error);
    return null;
  }
}

export function markFormSubmitted(): void {
  try {
    const session = getFormSession();
    if (!session) {
      return;
    }

    session.submitted = true;
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch (error) {
    // sessionStorage not available, fail silently
    console.warn('Could not mark form as submitted:', error);
  }
}

export function isFormSubmitted(): boolean {
  const session = getFormSession();
  return session?.submitted ?? false;
}

export function clearFormSession(): void {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch (error) {
    // sessionStorage not available, fail silently
    console.warn('Could not clear form session:', error);
  }
}
