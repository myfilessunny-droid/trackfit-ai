# 🔐 JWT Authentication Guide - TrackFit AI

## 📋 Overview

This guide explains how JWT (JSON Web Token) authentication works in your TrackFit AI project with Supabase.

## 🎯 What You Already Have

### ✅ JWT Key Configuration
Your `.env.local` file contains:
```env
VITE_SUPABASE_URL=https://yiscgtqmwjcdrgypdjvz.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlpc2NndHFtd2pjZHJneXBkanZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NTU0MTMsImV4cCI6MjA2OTUzMTQxM30.pjWU9SLOLpe1k6uQMeuuZp_ERgyohd4QIoAt9pxzMHQ
```

### ✅ JWT Token Breakdown
Your JWT token contains:
- **Header**: `{"alg":"HS256","typ":"JWT"}`
- **Payload**: 
  - `iss`: "supabase" (issuer)
  - `ref`: "yiscgtqmwjcdrgypdjvz" (project reference)
  - `role`: "anon" (anonymous role)
  - `iat`: 1753955413 (issued at)
  - `exp`: 2069531413 (expires at - 2069)
- **Signature**: HMAC SHA256 signature

## 🔄 JWT Authentication Flow

### **1. Initial Setup (Already Done)**
```typescript
// src/lib/supabase.ts
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **2. User Authentication Process**

#### **Step A: User Signs Up/Logs In**
```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password123'
})

// Sign Up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password123'
})
```

#### **Step B: Supabase Generates JWT**
- Supabase creates a **user session** with JWT token
- JWT contains user ID, email, and permissions
- Token is automatically stored in browser storage
- Token is included in all subsequent API requests

#### **Step C: JWT Token Usage**
```typescript
// JWT is automatically handled by Supabase client
const { data, error } = await supabase
  .from('food_entries')
  .select('*')
  .eq('user_id', user.id) // JWT ensures user can only access their data
```

### **3. JWT Token Management**

#### **Automatic Token Handling**
- ✅ **Storage**: Supabase automatically stores JWT in localStorage
- ✅ **Refresh**: Tokens are automatically refreshed when needed
- ✅ **Expiration**: Expired tokens trigger automatic re-authentication
- ✅ **Security**: Tokens are encrypted and secure

#### **Manual Token Access**
```typescript
// Get current session
const { data: { session } } = await supabase.auth.getSession()
console.log('JWT Token:', session?.access_token)

// Get user from token
const { data: { user } } = await supabase.auth.getUser()
console.log('User ID:', user?.id)
```

## 🛡️ Security Features

### **Row Level Security (RLS)**
Your database tables have RLS policies that use JWT tokens:

```sql
-- Example RLS Policy
CREATE POLICY "Users can view own food entries" ON food_entries
    FOR SELECT USING (auth.uid() = user_id);
```

**How it works:**
1. User makes API request with JWT token
2. Supabase extracts `user_id` from JWT
3. RLS policy checks if `auth.uid()` matches `user_id`
4. Only matching records are returned

### **Token Validation**
- ✅ **Signature Verification**: JWT signature is cryptographically verified
- ✅ **Expiration Check**: Tokens are automatically checked for expiration
- ✅ **Role-based Access**: Different roles have different permissions

## 🔧 Implementation Details

### **1. Authentication Context**
```typescript
// src/context/DataContext.tsx
const { user, session, loading, signOut } = useAuth()
```

### **2. Protected Routes**
```typescript
// src/components/ProtectedRoute.tsx
export const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (!user) {
    navigate('/login')
    return null
  }
  
  return children
}
```

### **3. API Calls with JWT**
```typescript
// JWT is automatically included in all Supabase requests
const { data, error } = await supabase
  .from('food_entries')
  .insert({
    food_name: 'Apple',
    calories: 95,
    user_id: user.id // JWT ensures this is the authenticated user
  })
```

## 📱 Authentication UI Flow

### **Login Process**
1. **User enters credentials** → Login form
2. **Supabase validates** → Email/password check
3. **JWT generated** → User session created
4. **Token stored** → Browser localStorage
5. **Redirect to app** → Dashboard

### **Session Management**
1. **App loads** → Check for existing JWT
2. **Token valid** → User stays logged in
3. **Token expired** → Redirect to login
4. **User signs out** → Clear JWT and redirect

## 🔍 Debugging JWT Issues

### **Check JWT Token**
```typescript
// In browser console
const { data: { session } } = await supabase.auth.getSession()
console.log('Current JWT:', session?.access_token)

// Decode JWT payload (for debugging)
const payload = JSON.parse(atob(session.access_token.split('.')[1]))
console.log('JWT Payload:', payload)
```

### **Common Issues**
1. **Token Expired**: Automatic refresh should handle this
2. **Invalid Token**: Clear localStorage and re-login
3. **RLS Policy Issues**: Check database policies
4. **CORS Issues**: Ensure proper domain configuration

## 🚀 Testing Authentication

### **1. Test Login**
```bash
# Start development server
npm run dev

# Visit http://localhost:8080
# Try creating an account or logging in
```

### **2. Check JWT in Browser**
```javascript
// Open browser console
localStorage.getItem('sb-yiscgtqmwjcdrgypdjvz-auth-token')
```

### **3. Verify Database Access**
```typescript
// Test if user can access their data
const { data, error } = await supabase
  .from('food_entries')
  .select('*')
console.log('User data:', data)
```

## 📋 Next Steps

### **What's Working**
✅ JWT authentication setup
✅ Login/signup forms
✅ Protected routes
✅ Session management
✅ Database security (RLS)

### **What to Implement Next**
1. **User Profile Creation**: Create user_profiles on signup
2. **Data Integration**: Connect pages to Supabase
3. **Error Handling**: Better error messages
4. **Password Reset**: Email password reset
5. **Social Login**: Google, Facebook, etc.

## 🎯 Summary

Your JWT authentication is **fully configured and working**! The JWT key you provided is correctly set up and the authentication system is ready to use. Users can now:

- ✅ Sign up with email/password
- ✅ Log in securely
- ✅ Access protected routes
- ✅ Have their data secured with RLS
- ✅ Stay logged in across sessions

The JWT token handling is **automatic** - you don't need to manually manage tokens. Supabase handles all the complexity for you! 🚀 