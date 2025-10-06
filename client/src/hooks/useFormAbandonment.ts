import { useEffect, useRef } from 'react';
import { initFormSession, getFormSession, isFormSubmitted } from '../lib/formSession';

export function useFormAbandonment(
  formData: Record<string, any>,
  hasStartedFilling: boolean
): void {
  const sessionRef = useRef<{ sessionId: string; startedAt: string } | null>(null);

  useEffect(() => {
    // Initialize session on mount
    const session = initFormSession();
    if (session) {
      sessionRef.current = {
        sessionId: session.sessionId,
        startedAt: session.startedAt,
      };
    } else {
      // sessionStorage not available, feature disabled
      console.warn('Form abandonment tracking unavailable');
    }
  }, []);

  useEffect(() => {
    const sendAbandonmentData = () => {
      // Don't send if:
      // 1. User hasn't started filling the form
      // 2. Form was successfully submitted
      // 3. No session exists
      if (!hasStartedFilling || isFormSubmitted() || !sessionRef.current) {
        return;
      }

      // Prepare payload
      const payload = {
        sessionId: sessionRef.current.sessionId,
        startedAt: sessionRef.current.startedAt,
        partialData: formData,
      };

      // Use sendBeacon for reliable send during page unload
      const blob = new Blob([JSON.stringify(payload)], {
        type: 'application/json',
      });

      navigator.sendBeacon('/api/form-abandonment', blob);
    };

    const handleBeforeUnload = () => {
      sendAbandonmentData();
    };

    // CRITICAL FIX: Add Page Visibility API as fallback for mobile browsers
    // beforeunload is unreliable on mobile (especially Safari iOS)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Page is being hidden/backgrounded - send data
        sendAbandonmentData();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [formData, hasStartedFilling]);
}
