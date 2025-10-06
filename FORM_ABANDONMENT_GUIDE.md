# Form Abandonment Tracking - Implementation Guide

## 📋 Overview

This feature detects when users start filling out the form but leave without submitting it. When abandonment is detected, an email notification is sent to the admin with the partial form data.

## 🎯 Key Features

- ✅ **Session-based tracking** - One unique session per user visit
- ✅ **Smart detection** - Only triggers if user has filled at least one field
- ✅ **No duplicates** - Rate limiting prevents multiple emails per session
- ✅ **Non-intrusive** - Uses native browser API (beforeunload)
- ✅ **Feature flag** - Easy enable/disable via environment variable
- ✅ **SOLID principles** - Clean, testable, maintainable code

## 🏗️ Architecture

### Components

1. **`formSession.ts`** - Session management utility
   - Creates unique session ID for each form visit
   - Tracks submission status
   - Uses sessionStorage (persists across page refreshes)

2. **`useFormAbandonment.ts`** - React hook for abandonment detection
   - Monitors form state
   - Listens to `beforeunload` event
   - Sends data via `navigator.sendBeacon()` for reliability

3. **`FormAbandonmentEmail.tsx`** - Email template
   - Beautiful, professional design
   - Shows completed vs missing fields
   - Includes timestamps

4. **`/api/form-abandonment`** - Backend endpoint
   - Validates incoming data
   - Checks feature flag
   - Prevents duplicate emails (rate limiting)
   - Sends email notification

### Data Flow

```
User Opens Form
     ↓
Session Created (UUID + timestamp)
     ↓
User Fills Some Fields
     ↓
User Closes Tab/Navigates Away
     ↓
beforeunload Event Fires
     ↓
Check: Has data? Not submitted? Not duplicate?
     ↓ YES
navigator.sendBeacon() → POST /api/form-abandonment
     ↓
Email Rendered & Sent
     ↓
Admin Receives Notification
```

## 🚀 Quick Start

### 1. Environment Variables

Add to your `.env` file:

```bash
# Enable/disable form abandonment tracking
ENABLE_ABANDONMENT_TRACKING=true

# Email recipient for abandonment notifications
ABANDONMENT_EMAIL_RECIPIENT=your-email@example.com
```

### 2. Test the Feature

**Manual Testing:**

1. Start the application:
   ```bash
   npm run dev
   ```

2. Open the form in your browser

3. Fill in some fields (e.g., name, email)

4. Close the tab or navigate away **without submitting**

5. Check your email inbox for the abandonment notification

**Expected Result:**
- Email arrives within seconds
- Contains the fields you filled
- Shows which fields are missing
- Includes timestamps

### 3. Verify Session Tracking

Open browser DevTools → Application → Session Storage:
- Should see `formSession` key
- Contains `sessionId`, `startedAt`, `submitted` fields

## 🔧 Configuration

### Feature Flag

**Enable tracking:**
```bash
ENABLE_ABANDONMENT_TRACKING=true
```

**Disable tracking:**
```bash
ENABLE_ABANDONMENT_TRACKING=false
```

When disabled, the API endpoint returns success immediately without sending emails.

### Custom Email Recipient

```bash
ABANDONMENT_EMAIL_RECIPIENT=custom-recipient@example.com
```

If not set, defaults to `alessiopersichettidev@gmail.com`.

### Multiple Recipients

To send to multiple recipients, modify `routes.ts`:

```typescript
const recipients = [
  "admin1@example.com",
  "admin2@example.com"
];

await mailingService.sendMail({
  to: recipients,
  subject: `Form abbandonato - ${sessionId.substring(0, 8)}`,
  html: emailHtml,
});
```

## 📊 How It Works

### Session Creation

When a user opens the form:
1. `initFormSession()` is called
2. Generates UUID (e.g., `550e8400-e29b-41d4-a716-446655440000`)
3. Stores in sessionStorage with timestamp
4. Returns session object

### Abandonment Detection

The `useFormAbandonment` hook:
1. Tracks form state changes
2. Determines if user has started filling (`hasStartedFilling`)
3. On `beforeunload` event, checks:
   - Has user filled any fields? → YES
   - Is form already submitted? → NO
   - Does session exist? → YES
4. If all conditions met, sends beacon with partial data

### Rate Limiting

Backend maintains an in-memory `Map<sessionId, timestamp>`:
- First request for a sessionId → Process & send email
- Subsequent requests for same sessionId → Return early (already processed)
- Old sessions (>24h) → Cleaned up automatically every hour

### Email Rendering

The email shows:
- ✅ **Completed Fields** - Fields the user filled out
- ❌ **Missing Fields** - Required fields left empty
- 🕐 **Timestamps** - When form was started and abandoned
- 📧 **Contact Info** - If user provided email/phone

## 🎨 Email Template Customization

Edit `server/emails/FormAbandonmentEmail.tsx` to customize:

**Change colors:**
```typescript
const h1 = {
  color: "#e63946", // Change this to your brand color
  fontSize: "24px",
  // ...
};
```

**Add company logo:**
```tsx
<Img src="https://your-domain.com/logo.png" alt="Logo" style={logo} />
```

**Modify field labels:**
```typescript
const fieldLabels: Record<string, string> = {
  spaceType: "Your Custom Label",
  name: "Full Name",
  // ...
};
```

## 🧪 Testing

### Unit Tests (TDD Approach)

Run tests with:
```bash
npm test
```

**Test files:**
- `formSession.test.ts` - Session management
- `useFormAbandonment.test.ts` - Hook behavior
- `EmailTemplateRenderer.test.ts` - Email rendering
- `routes.abandonment.test.ts` - API endpoint

### Manual Testing Checklist

- [ ] Session created on form mount
- [ ] No email if form has no data
- [ ] Email sent when form has data and user leaves
- [ ] No email after successful submission
- [ ] No duplicate emails for same session
- [ ] Feature flag disable works
- [ ] Email contains correct data
- [ ] Email shows completed/missing fields
- [ ] Timestamps are correct

## 🐛 Troubleshooting

### Email not sending

**Check environment variables:**
```bash
echo $ENABLE_ABANDONMENT_TRACKING
echo $ABANDONMENT_EMAIL_RECIPIENT
echo $RESEND_API_KEY
```

**Check server logs:**
```
Form abandonment email sent - SessionId: abc12345, Fields filled: 3
```

### Duplicate emails

**Known Limitation - Server Restart:**
⚠️ **IMPORTANT**: The deduplication system uses an in-memory Map that is lost when the server restarts. This means:
- After deployment or server restart, the same sessionId could trigger duplicate emails
- This is acceptable for low-traffic scenarios
- For high-traffic production environments, consider using Redis or a database for persistence

Example scenarios where duplicates may occur:
1. User abandons form → Email sent
2. Server restarts (deployment, crash, etc.)
3. User's browser sends beacon again (e.g., on visibility change)
4. Duplicate email sent (Map was cleared)

**Recommended Solutions for High Traffic:**
- Implement Redis-based session tracking
- Use database table with unique constraint on sessionId
- Add TTL (time-to-live) to prevent stale sessions

Check if session is being recreated. Session should persist across:
- Page refreshes (YES)
- New tabs (NO - this is intended behavior)
- Server restarts (NO - in-memory data lost)

### beforeunload not firing

Some browsers block `beforeunload` in certain scenarios:
- If user never interacted with page
- In mobile browsers (less reliable)
- During automated testing

Use `sendBeacon()` for reliability (already implemented).

## 📈 Monitoring & Analytics

### Log Analysis

Server logs include:
```
Form abandonment email sent - SessionId: abc12345, Fields filled: 3
Duplicate abandonment session detected: abc12345
Abandonment tracking disabled - SessionId: abc12345
```

### Metrics to Track

- **Abandonment rate**: % of users who start but don't submit
- **Average fields filled**: How far users get before abandoning
- **Common abandonment points**: Which fields cause friction
- **Conversion after follow-up**: Success rate of contacting abandoners

## 🔐 Privacy & Security

### Data Handling

- **Session ID**: Random UUID, not personally identifiable
- **Partial data**: Only sent if user voluntarily entered it
- **Storage**: sessionStorage (cleared when browser closes)
- **Transmission**: HTTPS only (enforce in production)

### GDPR Compliance

Consider adding to your privacy policy:
> "We track form interactions to improve user experience. If you start filling our form but don't submit, we may receive the information you entered to help us contact you."

### Rate Limiting

- Max 1 email per session (prevents spam)
- Old sessions cleaned up after 24h
- No cross-session tracking

## 🚀 Production Checklist

Before deploying:

- [ ] Set `ENABLE_ABANDONMENT_TRACKING=true`
- [ ] Configure `ABANDONMENT_EMAIL_RECIPIENT`
- [ ] Verify `RESEND_API_KEY` is valid
- [ ] Test in staging environment
- [ ] Update privacy policy (if needed)
- [ ] Set up email monitoring/alerts
- [ ] Document response process for abandonment leads

## 📚 Code References

### Key Functions

**Initialize session:**
```typescript
import { initFormSession } from '@/lib/formSession';
const session = initFormSession();
```

**Mark as submitted:**
```typescript
import { markFormSubmitted } from '@/lib/formSession';
markFormSubmitted(); // Call before form submission
```

**Track abandonment:**
```typescript
import { useFormAbandonment } from '@/hooks/useFormAbandonment';
useFormAbandonment(formData, hasStartedFilling);
```

### API Endpoint

**POST /api/form-abandonment**

Request body:
```json
{
  "sessionId": "uuid-string",
  "startedAt": "2025-10-03T10:30:00.000Z",
  "partialData": {
    "name": "Mario Rossi",
    "email": "mario@example.com"
  }
}
```

Response:
```json
{
  "success": true
}
```

## 🎓 Learning Resources

- [navigator.sendBeacon MDN](https://developer.mozilla.org/en-US/docs/Web/API/Navigator/sendBeacon)
- [beforeunload event](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
- [React Email Components](https://react.email/docs/components/html)
- [SOLID Principles](https://en.wikipedia.org/wiki/SOLID)

## 🤝 Contributing

When modifying this feature:

1. **Write tests first** (TDD approach)
2. **Follow SOLID principles**
3. **Keep it simple** (KISS)
4. **Don't repeat yourself** (DRY)
5. **Update this documentation**

## 📝 License

Same as parent project.

---

**Built with ❤️ following TDD, SOLID, KISS, and DRY principles**
