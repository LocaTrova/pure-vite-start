# 🧪 Comprehensive Testing Strategy - Form Abandonment Feature

## 📊 Analysis Results from mcp-reasoner (MCTS Strategy)

**Analysis Depth:** 10 reasoning steps  
**Strategy Used:** Monte Carlo Tree Search  
**Nodes Explored:** 25  
**Average Score:** 0.445  
**Max Depth:** 9

---

## 🚨 CRITICAL FLAWS IDENTIFIED

### Priority 0 (CRITICAL) - Must Fix Immediately

#### 1. **sessionStorage Access in Private/Incognito Mode**
**Severity:** CRITICAL ❌  
**Impact:** Feature completely breaks in private browsing  
**Current State:** No error handling for sessionStorage operations  

**Test Scenario:**
```typescript
// Mock sessionStorage to throw DOMException
beforeEach(() => {
  Storage.prototype.setItem = jest.fn(() => {
    throw new DOMException('QuotaExceededError');
  });
});

it('should gracefully handle sessionStorage being disabled', () => {
  expect(() => initFormSession()).not.toThrow();
  expect(getFormSession()).toBeNull();
});
```

**Required Fix:**
```typescript
// Wrap all sessionStorage operations in try-catch
export function initFormSession(): FormSession | null {
  try {
    const existing = getFormSession();
    if (existing) return existing;
    
    const session: FormSession = {
      sessionId: uuidv4(),
      startedAt: new Date().toISOString(),
      submitted: false,
    };
    
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  } catch (error) {
    console.warn('sessionStorage not available:', error);
    return null; // Graceful degradation
  }
}
```

---

#### 2. **XSS Vulnerability in Email via Unsanitized partialData**
**Severity:** CRITICAL 🔐  
**Impact:** Attackers can inject malicious scripts into admin emails  
**Current State:** No HTML escaping of user input  

**Test Scenario:**
```typescript
it('should escape malicious HTML in email', async () => {
  const maliciousData = {
    name: '<script>alert("XSS")</script>',
    email: '<img src=x onerror=alert(1)>',
    notes: 'javascript:alert(document.cookie)',
  };
  
  const html = await EmailTemplateRenderer.renderFormAbandonmentEmail({
    startedAt: '2025-10-04T10:00:00Z',
    abandonedAt: '2025-10-04T10:05:00Z',
    partialData: maliciousData,
    completedFields: ['name', 'email', 'notes'],
    missingFields: [],
  });
  
  expect(html).not.toContain('<script>');
  expect(html).not.toContain('onerror=');
  expect(html).toContain('&lt;script&gt;'); // Escaped
});
```

**Required Fix:**
```typescript
// In FormAbandonmentEmail.tsx
const escapeHtml = (unsafe: string): string => {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
};

const formatValue = (field: string, value: any): string => {
  if (field === 'spaceType') {
    return spaceTypeLabels[value] || escapeHtml(String(value));
  }
  if (Array.isArray(value)) {
    return value.map(v => escapeHtml(String(v))).join(", ");
  }
  return escapeHtml(String(value || "-"));
};
```

---

#### 3. **In-Memory Map Lost on Server Restart**
**Severity:** CRITICAL 💥  
**Impact:** Users get duplicate abandonment emails after deployment  
**Current State:** `processedSessions` Map is in-memory only  

**Test Scenario:**
```typescript
it('should handle server restart gracefully', async () => {
  // First request
  const response1 = await request(app)
    .post('/api/form-abandonment')
    .send({ sessionId: 'test-123', startedAt: '2025-10-04', partialData: { name: 'Test' } });
  
  expect(response1.status).toBe(200);
  
  // Simulate server restart - clear in-memory map
  // In real scenario, this happens automatically
  
  // Second request with same sessionId
  const response2 = await request(app)
    .post('/api/form-abandonment')
    .send({ sessionId: 'test-123', startedAt: '2025-10-04', partialData: { name: 'Test' } });
  
  // Currently: sends duplicate email ❌
  // Expected: should either use persistent storage OR document limitation
  expect(response2.body.message).toBe('Already processed');
});
```

**Required Fix Options:**
1. **Option A: Add Redis for persistence**
2. **Option B: Use database table**
3. **Option C: Accept limitation and document clearly**

Recommended: **Option C** for simplicity, with clear documentation

---

#### 4. **DoS Attack via Huge partialData Payload**
**Severity:** CRITICAL 🛡️  
**Impact:** Server can be crashed with large payloads  
**Current State:** No size validation on request body  

**Test Scenario:**
```typescript
it('should reject huge payloads', async () => {
  const hugeData = {
    sessionId: 'test-123',
    startedAt: '2025-10-04',
    partialData: {
      notes: 'A'.repeat(10 * 1024 * 1024), // 10MB string
    },
  };
  
  const response = await request(app)
    .post('/api/form-abandonment')
    .send(hugeData);
  
  expect(response.status).toBe(413); // Payload Too Large
});
```

**Required Fix:**
```typescript
// In server/index.ts or routes.ts
app.use(express.json({ limit: '100kb' })); // Limit request body size

// Additionally, validate partialData size
if (JSON.stringify(partialData).length > 50000) {
  return res.status(400).json({ error: "Payload too large" });
}
```

---

#### 5. **markFormSubmitted() Called Before API Response**
**Severity:** CRITICAL ⚠️  
**Impact:** If submission fails, user is marked as submitted, no abandonment email  
**Current State:** Marks submitted too early  

**Test Scenario:**
```typescript
it('should not mark submitted if API call fails', async () => {
  // Mock API to fail
  fetchMock.mockRejectOnce(new Error('Network error'));
  
  const { result } = renderHook(() => useFormSubmission());
  
  await act(async () => {
    await result.current.submitForm(formData);
  });
  
  // Should NOT be marked as submitted
  expect(isFormSubmitted()).toBe(false);
  
  // User closes tab - should still send abandonment email
  window.dispatchEvent(new Event('beforeunload'));
  expect(navigator.sendBeacon).toHaveBeenCalled();
});
```

**Required Fix:**
```typescript
// In MultiStepForm.tsx - move markFormSubmitted AFTER success
const submitMutation = useMutation({
  mutationFn: async (data: FormSubmission) => {
    const response = await fetch("/api/submit-form", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || "Errore nell'invio della richiesta");
    }
    
    // Mark as submitted ONLY after successful response
    markFormSubmitted();
    
    return result;
  },
  // ... rest
});
```

---

#### 6. **beforeunload Event Unreliability**
**Severity:** CRITICAL 📱  
**Impact:** Feature may not work on mobile browsers (Safari especially)  
**Current State:** Relies 100% on beforeunload  

**Test Scenario:**
```typescript
it('should document mobile browser limitations', () => {
  // This test documents the limitation, not tests functionality
  const isMobileSafari = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  
  if (isMobileSafari) {
    console.warn('beforeunload may not fire reliably on this browser');
  }
  
  // Alternative: use Page Visibility API as backup
  expect(document.hidden).toBeDefined();
});
```

**Required Fix:**
Add fallback using Page Visibility API:
```typescript
// In useFormAbandonment.ts
useEffect(() => {
  const handleVisibilityChange = () => {
    if (document.hidden && hasStartedFilling && !isFormSubmitted()) {
      // Page is being hidden, send data
      const payload = {/* ... */};
      navigator.sendBeacon('/api/form-abandonment', new Blob([JSON.stringify(payload)]));
    }
  };
  
  document.addEventListener('visibilitychange', handleVisibilityChange);
  
  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
}, [formData, hasStartedFilling]);
```

---

## ⚠️ HIGH PRIORITY FLAWS

### Priority 1 - Should Fix Soon

#### 7. **Race Condition: Submission + beforeunload**
**Impact:** Both could execute simultaneously, uncertain behavior  
**Test:** Mock both events firing at exact same time  
**Fix:** Add mutex/flag to prevent duplicate sends  

#### 8. **No Error Handling in Email Rendering**
**Impact:** Silent failures when email template crashes  
**Test:** Pass invalid data to email renderer  
**Fix:** Wrap render() in try-catch, log errors  

#### 9. **formatDate Throws on Invalid ISO String**
**Impact:** Email fails to send if timestamp is malformed  
**Test:** Pass non-ISO string to formatDate  
**Fix:** Add validation, fallback to "Invalid date"  

#### 10. **Type Assertions in hasStartedFilling**
**Impact:** Runtime errors if form data structure changes  
**Test:** Change form data structure, verify no crashes  
**Fix:** Use type guards instead of assertions  

---

## 🎯 Testing Strategy

### Test Pyramid Distribution

```
     /\
    /  \  E2E (10%)
   /____\
  /      \  Integration (30%)
 /________\
/__________\  Unit Tests (60%)
```

### Coverage Goals

| Metric | Target | Why |
|--------|--------|-----|
| Logic Coverage | 100% | All functions, all branches |
| Line Coverage | 95%+ | Allow some defensive code |
| Mutation Coverage | 80%+ | Ensure tests catch bugs |
| Flakiness Rate | <1% | Tests should be reliable |

---

## 🏗️ Test Framework Setup

### Recommended Stack

```bash
npm install -D vitest @vitest/ui vitest-mock-extended
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event
npm install -D jsdom
npm install -D msw # For API mocking
npm install -D @types/node
```

### Configuration Files

**vitest.config.ts:**
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './client/src'),
      '@shared': path.resolve(__dirname, './shared'),
    },
  },
});
```

**tests/setup.ts:**
```typescript
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, vi } from 'vitest';

// Cleanup after each test
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
  sessionStorage.clear();
});

// Mock navigator.sendBeacon
Object.defineProperty(navigator, 'sendBeacon', {
  writable: true,
  value: vi.fn(() => true),
});

// Mock sessionStorage for tests that need it to fail
export const mockSessionStorageFailure = () => {
  Storage.prototype.setItem = vi.fn(() => {
    throw new DOMException('QuotaExceededError');
  });
};
```

---

## 📝 Unit Tests Structure

### formSession.test.ts (12 tests)

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  initFormSession,
  getFormSession,
  markFormSubmitted,
  isFormSubmitted,
  clearFormSession,
} from '../lib/formSession';

describe('formSession', () => {
  beforeEach(() => {
    sessionStorage.clear();
    vi.clearAllMocks();
  });

  describe('initFormSession', () => {
    it('should create new session with valid UUID');
    it('should return existing session if already created');
    it('should handle sessionStorage disabled gracefully'); // CRITICAL
    it('should handle sessionStorage quota exceeded'); // CRITICAL
  });

  describe('getFormSession', () => {
    it('should return null when no session exists');
    it('should return valid session data');
    it('should handle corrupted JSON gracefully'); // HIGH
    it('should handle sessionStorage disabled'); // CRITICAL
  });

  describe('markFormSubmitted', () => {
    it('should mark session as submitted');
    it('should do nothing if no session exists');
    it('should handle sessionStorage errors'); // CRITICAL
  });

  describe('isFormSubmitted', () => {
    it('should return false by default');
    it('should return true after marking');
    it('should handle corrupted data'); // HIGH
  });
});
```

### useFormAbandonment.test.tsx (15 tests)

```typescript
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useFormAbandonment } from '../hooks/useFormAbandonment';

describe('useFormAbandonment', () => {
  it('should initialize session on mount');
  it('should not send beacon if form has no data');
  it('should not send beacon if form is submitted');
  it('should send beacon on beforeunload with data');
  it('should include correct payload structure');
  it('should cleanup event listener on unmount');
  it('should handle rapid mount/unmount'); // HIGH - race condition
  it('should handle sendBeacon not supported'); // HIGH
  it('should handle sendBeacon failure gracefully');
  it('should use correct API endpoint');
  it('should handle null sessionRef'); // HIGH
  it('should not send if hasStartedFilling is false');
  it('should handle multiple beforeunload events'); // HIGH
  it('should handle stale formData closure'); // HIGH
  it('should work with Page Visibility API fallback'); // CRITICAL
});
```

### routes.abandonment.test.ts (20 tests)

```typescript
import { describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest';
import { app } from '../server';

describe('POST /api/form-abandonment', () => {
  // Validation tests
  it('should return 400 if sessionId missing'); // CRITICAL
  it('should return 400 if partialData missing'); // CRITICAL
  it('should return 400 if partialData empty'); // CRITICAL
  it('should reject malformed sessionId');
  it('should reject huge payload'); // CRITICAL
  it('should sanitize malicious input'); // CRITICAL

  // Feature flag tests
  it('should return early if feature disabled');
  it('should respect ENABLE_ABANDONMENT_TRACKING env var');

  // Deduplication tests
  it('should process first request');
  it('should block duplicate sessionId'); // CRITICAL
  it('should allow different sessionIds');
  it('should cleanup old sessions after 24h');

  // Field calculation tests
  it('should correctly identify completed fields');
  it('should correctly identify missing fields');
  it('should handle all fields empty');
  it('should handle all fields filled');
  it('should handle array fields with empty strings');
  it('should handle squareMeters=0 correctly'); // HIGH

  // Email sending tests
  it('should send email on success');
  it('should handle email sending failure'); // HIGH
  it('should log errors appropriately'); // HIGH
});
```

### EmailTemplateRenderer.test.ts (10 tests)

```typescript
describe('EmailTemplateRenderer', () => {
  it('should render abandonment email with valid data');
  it('should escape HTML in user input'); // CRITICAL
  it('should handle missing optional fields');
  it('should handle invalid date strings'); // HIGH
  it('should handle unknown space types');
  it('should handle null/undefined values'); // HIGH
  it('should handle array values correctly');
  it('should throw on completely invalid data');
  it('should handle extremely long strings');
  it('should render correctly with no completed fields');
});
```

---

## 🔗 Integration Tests Structure

### MultiStepForm Integration (8 tests)

```typescript
it('should initialize session when form mounts');
it('should update hasStartedFilling when user types');
it('should call markFormSubmitted after successful submission'); // CRITICAL
it('should not mark submitted if API fails'); // CRITICAL
it('should send abandonment email on page close');
it('should not send email after successful submission');
it('should handle API error gracefully');
it('should reinitialize session after submission');
```

### End-to-End Flow (5 tests)

```typescript
it('should complete full abandonment flow');
it('should handle server restart scenario'); // CRITICAL
it('should work with feature flag disabled');
it('should deduplicate across multiple requests');
it('should send email with correct recipient');
```

---

## 🎲 Property-Based Tests

```typescript
import { fc, test } from '@fast-check/vitest';

describe('Property-based tests', () => {
  test.prop([fc.object()])('should handle any form data without crashing', (data) => {
    expect(() => useFormAbandonment(data, true)).not.toThrow();
  });

  test.prop([fc.string()])('should handle any sessionId format', (sessionId) => {
    // Should validate or reject gracefully
  });

  test.prop([fc.date()])('should handle any date value', (date) => {
    const isoString = date.toISOString();
    expect(() => formatDate(isoString)).not.toThrow();
  });
});
```

---

## 📊 Test Execution Plan

### Phase 1: Fix Critical Issues (Week 1)
1. Add sessionStorage error handling
2. Add HTML escaping in email
3. Add request size limits
4. Fix markFormSubmitted timing
5. Document mobile browser limitations
6. Add Page Visibility API fallback

### Phase 2: Write Unit Tests (Week 2)
1. formSession.ts tests (12 tests)
2. useFormAbandonment.ts tests (15 tests)
3. routes.ts tests (20 tests)
4. EmailTemplateRenderer.ts tests (10 tests)

### Phase 3: Integration Tests (Week 3)
1. MultiStepForm integration (8 tests)
2. End-to-end flows (5 tests)
3. Property-based tests (5 tests)

### Phase 4: CI/CD Setup (Week 4)
1. GitHub Actions workflow
2. Pre-commit hooks
3. Coverage reporting
4. Mutation testing

---

## 🚀 Quick Start Commands

```bash
# Install dependencies
npm install -D vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom

# Run tests
npm test

# Run tests with UI
npm run test:ui

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run only failing tests
npm run test:failed
```

**package.json scripts:**
```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:watch": "vitest --watch",
    "test:failed": "vitest --run --bail 1"
  }
}
```

---

## 📈 Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Unit Test Coverage | 0% | 100% | Week 2 |
| Integration Coverage | 0% | 90% | Week 3 |
| Critical Bugs Fixed | 0/6 | 6/6 | Week 1 |
| Test Execution Time | N/A | <10s | Week 2 |
| Flaky Tests | N/A | 0% | Week 3 |
| CI/CD Setup | No | Yes | Week 4 |

---

## 🎯 Definition of Done

- [ ] All 6 critical flaws fixed
- [ ] 100% logic coverage on formSession.ts
- [ ] 100% logic coverage on useFormAbandonment.ts
- [ ] 100% logic coverage on routes abandonment endpoint
- [ ] 90%+ coverage on EmailTemplateRenderer
- [ ] All integration tests passing
- [ ] Property-based tests implemented
- [ ] CI/CD pipeline configured
- [ ] Documentation updated
- [ ] Code review completed

---

**Analysis completed using mcp-reasoner MCTS strategy**  
**Document generated:** October 4, 2025  
**Status:** Ready for implementation 🚀
