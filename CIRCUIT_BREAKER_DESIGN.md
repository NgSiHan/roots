# Circuit Breaker Design - AI Activity Generation

## Problem Statement

Without protection, the auto-refill system could create an endless loop if AI generation repeatedly fails:

1. User has < 5 activities
2. System triggers auto-generation
3. Generation fails (network error, API error, etc.)
4. `isGenerating` becomes `false`
5. useEffect runs again, sees < 5 activities
6. **Loop back to step 2** → Endless retry

This wastes:
- API quota/credits
- Network bandwidth
- System resources
- User experience (constant loading states)

---

## Solution: Circuit Breaker Pattern

Implements a "circuit breaker" that:
- Tracks failed attempts
- Pauses auto-generation after threshold
- Provides cooldown period
- Allows manual overrides
- Auto-resets after cooldown

---

## Implementation

### State Variables

```typescript
const [failedAttempts, setFailedAttempts] = useState(0);
const [lastFailedTime, setLastFailedTime] = useState<number | null>(null);
```

### Configuration

```typescript
const MAX_FAILED_ATTEMPTS = 3;        // Fail 3 times → pause
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes
```

### Auto-Refill Logic

```typescript
// Check if in cooldown
const isInCooldown = lastFailedTime &&
  (Date.now() - lastFailedTime < COOLDOWN_PERIOD);

// Only trigger if:
// 1. < 5 activities
// 2. Not generating
// 3. (failures < 3) OR (cooldown passed)
if (
  availableActivities.length < 5 &&
  !isGenerating &&
  (failedAttempts < MAX_FAILED_ATTEMPTS || !isInCooldown)
) {
  // Reset if cooldown passed
  if (isInCooldown === false && failedAttempts >= MAX_FAILED_ATTEMPTS) {
    setFailedAttempts(0);
    setLastFailedTime(null);
  }
  generateNewActivities();
}
```

### Success Handler

```typescript
if (data.success && data.activities && data.activities.length > 0) {
  // Add activities...

  // Reset failure counter ✅
  setFailedAttempts(0);
  setLastFailedTime(null);
}
```

### Failure Handler

```typescript
else {
  // Increment failure counter
  const newFailedAttempts = failedAttempts + 1;
  setFailedAttempts(newFailedAttempts);
  setLastFailedTime(Date.now());

  // Show different message after 3 failures
  if (newFailedAttempts >= 3) {
    setGenerationError(
      `${errorMsg}. Auto-generation paused for 5 minutes. ` +
      `You can still click "AI Generate" to retry manually.`
    );
  } else {
    setGenerationError(errorMsg);
  }
}
```

---

## State Transitions

### Normal Operation
```
attempts: 0 → generate → success → attempts: 0
                        ↓
                    reset counter
```

### Failure Path
```
attempts: 0 → generate → fail → attempts: 1
             → generate → fail → attempts: 2
             → generate → fail → attempts: 3 (PAUSE)
             → [5 minutes wait]
             → generate → success → attempts: 0
```

### Manual Override
```
attempts: 3 (PAUSED)
  ↓
User clicks "AI Generate" → generate anyway
  ↓
success → attempts: 0 (RESUME AUTO)
```

---

## Benefits

✅ **Prevents Endless Loops** - Stops after 3 failures
✅ **Resource Efficient** - Saves API calls and bandwidth
✅ **User Control** - Manual generation always available
✅ **Auto-Recovery** - Resumes after cooldown period
✅ **Clear Feedback** - User knows why auto-gen is paused
✅ **Graceful Degradation** - System still works manually

---

## Edge Cases Handled

### 1. **Immediate Cooldown Expiry**
```typescript
// If cooldown just expired, reset before generating
if (isInCooldown === false && failedAttempts >= MAX_FAILED_ATTEMPTS) {
  setFailedAttempts(0);
  setLastFailedTime(null);
}
```

### 2. **Empty Response**
```typescript
// Check for both success flag AND non-empty array
if (data.success && data.activities && data.activities.length > 0) {
  // Only count as success if activities were returned
}
```

### 3. **Network Errors vs API Errors**
Both handled the same way:
```typescript
try {
  // ... API call
} catch (error) {
  // Same failure handling as API errors
  incrementFailedAttempts();
}
```

### 4. **User Adds Activities Manually**
When user proposes custom activities:
- Activities are added to the pool
- Available count increases
- May prevent auto-generation trigger
- Failure counter persists (by design - only reset on AI success)

---

## Configuration Recommendations

### Conservative (Recommended)
```typescript
const MAX_FAILED_ATTEMPTS = 3;
const COOLDOWN_PERIOD = 5 * 60 * 1000; // 5 minutes
```

### Aggressive (More Retries)
```typescript
const MAX_FAILED_ATTEMPTS = 5;
const COOLDOWN_PERIOD = 2 * 60 * 1000; // 2 minutes
```

### Development (Quick Testing)
```typescript
const MAX_FAILED_ATTEMPTS = 2;
const COOLDOWN_PERIOD = 30 * 1000; // 30 seconds
```

---

## Testing Scenarios

### Test 1: Normal Operation
1. Have < 5 activities
2. Auto-generation succeeds
3. ✅ Activities added, counter stays at 0

### Test 2: Single Failure
1. Have < 5 activities
2. Break API (invalid key)
3. Generation fails once
4. ✅ Shows error, auto-retries on next change

### Test 3: Circuit Breaker Activation
1. Have < 5 activities
2. Break API
3. Wait for 3 auto-retry attempts
4. ✅ Circuit breaker activates, shows "paused for 5 minutes"

### Test 4: Manual Override During Pause
1. Circuit breaker active
2. Click "AI Generate" manually
3. ✅ Generation still happens

### Test 5: Auto-Recovery
1. Circuit breaker active
2. Wait 5 minutes
3. ✅ Auto-generation resumes

### Test 6: Success During Pause
1. Circuit breaker active
2. Fix API
3. Click "AI Generate" manually
4. Generation succeeds
5. ✅ Counter resets, auto-generation resumes

---

## Future Enhancements

### Exponential Backoff
```typescript
const getBackoffTime = (attempts: number) => {
  return Math.min(30000 * Math.pow(2, attempts), 5 * 60 * 1000);
};
```

### Persistent State
```typescript
// Save to localStorage
localStorage.setItem('ai-generation-failures', JSON.stringify({
  attempts: failedAttempts,
  lastFailed: lastFailedTime
}));
```

### Different Thresholds per Error Type
```typescript
const errorThresholds = {
  'API_KEY_INVALID': 1,    // Stop immediately
  'RATE_LIMIT': 5,         // More tolerant
  'NETWORK_ERROR': 3,      // Default
};
```

### User Notification
```typescript
// Show toast notification when circuit breaks
toast.warning('AI generation paused. Retrying in 5 minutes.');
```

---

## Monitoring Recommendations

Track these metrics:
- `failedAttempts` current value
- `lastFailedTime` timestamp
- Total API calls saved by circuit breaker
- Average success rate
- Most common error types

---

**Implementation:** [app/activities/page.tsx](app/activities/page.tsx#L53-L97)
