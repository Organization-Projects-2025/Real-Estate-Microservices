# Error Message Propagation - Quick Reference

## How It Works Now

### Microservice Error Handling

```
1. Microservice (e.g., auth-service)
   throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED)
   ↓
2. Service Controller (with try-catch)
   } catch (error) {
     console.error('[Auth Login Error]', error);
     throw error;  // Rethrow to let NestJS RPC serialize
   }
   ↓
3. RPC Layer Serialization
   Converts to: { status: 401, message: 'Invalid email or password', ... }
```

### Gateway Error Extraction

```
4. Gateway Controller (uses extractErrorMessage utility)
   } catch (error) {
     const { message, statusCode } = extractErrorMessage(error);
     console.error('[Auth Login Error]', error);
     return res.status(statusCode).json({
       status: 'error',
       message  // 'Invalid email or password'
     });
   }
```

### Frontend Response

```
5. Frontend receives:
   {
     status: 'error',
     message: 'Invalid email or password'  // Real, meaningful error!
   }
   HTTP Status: 401

6. User sees in UI:
   ❌ "Invalid email or password"
```

## Error Extraction Logic

The `extractErrorMessage()` utility handles multiple error formats:

```typescript
function extractErrorMessage(error: any): ExtractedError {
  // Try different message locations
  const message =
    error?.message || // Standard Error.message
    error?.response?.message || // RPC serialized error
    error?.data?.message || // Alternative format
    'An error occurred'; // Fallback

  // Try different status code locations
  const statusCode =
    error?.status || // Direct status
    error?.response?.status || // RPC status
    error?.statusCode || // Alternative
    HttpStatus.INTERNAL_SERVER_ERROR; // Default 500

  return { message: String(message), statusCode };
}
```

## Common Error Scenarios

### Scenario 1: Login with Wrong Password

**Microservice throws:**

```typescript
throw new HttpException('Invalid email or password', HttpStatus.UNAUTHORIZED);
```

**Frontend receives:**

```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

**HTTP Status:** 401

---

### Scenario 2: User Not Found

**Microservice throws:**

```typescript
throw new HttpException('User not found', HttpStatus.NOT_FOUND);
```

**Frontend receives:**

```json
{
  "status": "error",
  "message": "User not found"
}
```

**HTTP Status:** 404

---

### Scenario 3: Database Connection Error

**Microservice throws:**

```typescript
throw new HttpException(
  'Database connection failed',
  HttpStatus.SERVICE_UNAVAILABLE
);
```

**Frontend receives:**

```json
{
  "status": "error",
  "message": "Database connection failed"
}
```

**HTTP Status:** 503

---

### Scenario 4: Validation Error

**Microservice throws:**

```typescript
throw new HttpException('Email is required', HttpStatus.BAD_REQUEST);
```

**Frontend receives:**

```json
{
  "status": "error",
  "message": "Email is required"
}
```

**HTTP Status:** 400

---

## Debugging with Logs

All errors are logged on both the microservice and gateway:

**Microservice log:**

```
[Auth Microservice Login Error] HttpException: Invalid email or password
```

**Gateway log:**

```
[Auth Login Error] { status: 401, message: 'Invalid email or password', ... }
```

This allows you to trace errors at both levels if needed.

---

## Frontend Implementation Pattern

Instead of generic error handling:

```javascript
// ❌ OLD - Generic error
catch (error) {
  showError('Internal server error');
}
```

Now you can do:

```javascript
// ✅ NEW - Real error messages
catch (error) {
  const message = error.response?.data?.message || 'Operation failed';
  showError(message);  // Shows actual error like "Invalid email or password"
}
```

---

## Controllers with Error Handling

All these controllers now have proper error handling:

### Gateway Controllers

- ✅ Auth (`auth.controller.ts`)
- ✅ Review (`review.controller.ts`)
- ✅ Property (`property.controller.ts`)
- ✅ Agent (`agent.controller.ts`)
- ✅ Developer Properties (`developerproperties.controller.ts`)
- ✅ Admin (`admin.controller.ts`)

### Microservice Controllers

- ✅ Auth Service (`auth.controller.ts`)
- ✅ Review Service (`review.controller.ts`)
- ✅ Property Service (`property.controller.ts`)
- ✅ Agent Service (`agent.controller.ts`)
- ✅ Admin Service / Filter (`filter.controller.ts`)
- ✅ Developer Properties Service (`developerproperties.controller.ts`)

---

## Testing Commands

### Test Login Error

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"wrong@email.com","password":"wrongpass"}'

# Response: { "status": "error", "message": "Invalid email or password" }
```

### Test Register Validation

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com"}'

# Response: { "status": "error", "message": "<validation message>" }
```

### Test Forgot Password

```bash
curl -X POST http://localhost:3000/api/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"nonexistent@email.com"}'

# Response: { "status": "error", "message": "<meaningful error>" }
```

---

## Summary

✅ **Error messages now flow correctly** from microservices → gateway → frontend  
✅ **Real, meaningful messages** instead of generic "Internal server error"  
✅ **Correct HTTP status codes** returned with errors  
✅ **Full logging** for debugging at both microservice and gateway levels  
✅ **Consistent error handling** across all controllers using utility function
