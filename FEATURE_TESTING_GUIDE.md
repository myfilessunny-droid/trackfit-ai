# 🧪 TrackFit AI - Complete Feature Testing Guide

## 📋 Testing Overview

This guide provides step-by-step tests for every feature in your TrackFit AI application. Use this to systematically verify that everything works correctly.

## 🚀 Pre-Testing Setup

### **1. Start Development Server**
```bash
# Navigate to project directory
cd trackfit-ai

# Start development server
npm run dev

# Verify server is running
# Should show: http://localhost:8080/
```

### **2. Open Browser Developer Tools**
- Press `F12` or `Ctrl+Shift+I`
- Go to **Console** tab
- Go to **Application** tab → **Local Storage**

## 🧪 Test Suite 1: Authentication System

### **Test 1.1: Initial App Load**
**Expected Result**: Should redirect to login page
```bash
# Action: Visit http://localhost:8080
# Expected: Login form appears
# Status: [ ] Pass / [ ] Fail
```

### **Test 1.2: Sign Up Process**
**Expected Result**: User can create account successfully
```bash
# Action: Fill signup form
Email: test@example.com
Password: password123
Confirm Password: password123

# Action: Click "Create Account"
# Expected: Success message + redirect to dashboard
# Status: [ ] Pass / [ ] Fail
```

### **Test 1.3: JWT Token Storage**
**Expected Result**: JWT token stored in localStorage
```javascript
// In browser console, run:
localStorage.getItem('sb-yiscgtqmwjcdrgypdjvz-auth-token')
// Expected: Returns JWT token string
// Status: [ ] Pass / [ ] Fail
```

### **Test 1.4: Login Process**
**Expected Result**: User can log in with existing account
```bash
# Action: Sign out (if logged in)
# Action: Fill login form
Email: test@example.com
Password: password123

# Action: Click "Sign In"
# Expected: Success message + redirect to dashboard
# Status: [ ] Pass / [ ] Fail
```

### **Test 1.5: Session Persistence**
**Expected Result**: User stays logged in after page refresh
```bash
# Action: Refresh browser page (F5)
# Expected: User remains logged in, no redirect to login
# Status: [ ] Pass / [ ] Fail
```

### **Test 1.6: Sign Out**
**Expected Result**: User can sign out successfully
```bash
# Action: Click "Sign Out" in sidebar
# Expected: Redirect to login page, JWT token cleared
# Status: [ ] Pass / [ ] Fail
```

## 🧪 Test Suite 2: Navigation & Routing

### **Test 2.1: Dashboard Access**
**Expected Result**: Dashboard loads after login
```bash
# Action: Login and visit http://localhost:8080/
# Expected: Dashboard page loads with sidebar navigation
# Status: [ ] Pass / [ ] Fail
```

### **Test 2.2: Sidebar Navigation**
**Expected Result**: All navigation links work
```bash
# Test each link:
# Action: Click "Food Detection" → Should navigate to /food-detection
# Action: Click "Calorie Burn" → Should navigate to /calorie-burn
# Action: Click "Journal" → Should navigate to /journal
# Action: Click "Ask Agent" → Should navigate to /ask-agent
# Action: Click "Profile" → Should navigate to /profile
# Status: [ ] Pass / [ ] Fail
```

### **Test 2.3: Protected Route Access**
**Expected Result**: Unauthenticated users redirected to login
```bash
# Action: Sign out
# Action: Try to visit http://localhost:8080/dashboard
# Expected: Redirect to login page
# Status: [ ] Pass / [ ] Fail
```

## 🧪 Test Suite 3: Database Integration

### **Test 3.1: User Profile Creation**
**Expected Result**: User profile created in database
```javascript
// In browser console, run:
const { data: { user } } = await supabase.auth.getUser()
console.log('User ID:', user?.id)

// Check if user_profiles table has entry
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('user_id', user?.id)
console.log('User Profile:', data)
// Expected: Should show user profile data
// Status: [ ] Pass / [ ] Fail
```

### **Test 3.2: Food Entries Table Access**
**Expected Result**: Can read/write to food_entries table
```javascript
// In browser console, run:
// Test INSERT
const { data: insertData, error: insertError } = await supabase
  .from('food_entries')
  .insert({
    food_name: 'Test Apple',
    calories: 95,
    protein: 0.5,
    carbs: 25,
    fat: 0.3,
    meal_type: 'snack',
    user_id: user?.id
  })
  .select()

console.log('Insert Result:', insertData, insertError)
// Expected: Should insert successfully, no errors
// Status: [ ] Pass / [ ] Fail

// Test SELECT
const { data: selectData, error: selectError } = await supabase
  .from('food_entries')
  .select('*')
  .eq('user_id', user?.id)

console.log('Select Result:', selectData, selectError)
// Expected: Should return user's food entries
// Status: [ ] Pass / [ ] Fail
```

### **Test 3.3: Exercise Entries Table Access**
**Expected Result**: Can read/write to exercise_entries table
```javascript
// In browser console, run:
// Test INSERT
const { data: insertData, error: insertError } = await supabase
  .from('exercise_entries')
  .insert({
    exercise_name: 'Test Running',
    calories_burned: 300,
    duration_minutes: 30,
    exercise_type: 'cardio',
    user_id: user?.id
  })
  .select()

console.log('Insert Result:', insertData, insertError)
// Expected: Should insert successfully, no errors
// Status: [ ] Pass / [ ] Fail

// Test SELECT
const { data: selectData, error: selectError } = await supabase
  .from('exercise_entries')
  .select('*')
  .eq('user_id', user?.id)

console.log('Select Result:', selectData, selectError)
// Expected: Should return user's exercise entries
// Status: [ ] Pass / [ ] Fail
```

### **Test 3.4: Daily Summaries Table Access**
**Expected Result**: Can read/write to daily_summaries table
```javascript
// In browser console, run:
// Test INSERT
const { data: insertData, error: insertError } = await supabase
  .from('daily_summaries')
  .insert({
    date: new Date().toISOString().split('T')[0],
    total_calories_consumed: 1500,
    total_calories_burned: 500,
    net_calories: 1000,
    user_id: user?.id
  })
  .select()

console.log('Insert Result:', insertData, insertError)
// Expected: Should insert successfully, no errors
// Status: [ ] Pass / [ ] Fail

// Test SELECT
const { data: selectData, error: selectError } = await supabase
  .from('daily_summaries')
  .select('*')
  .eq('user_id', user?.id)

console.log('Select Result:', selectData, selectError)
// Expected: Should return user's daily summaries
// Status: [ ] Pass / [ ] Fail
```

## 🧪 Test Suite 4: Row Level Security (RLS)

### **Test 4.1: Data Isolation**
**Expected Result**: Users can only access their own data
```javascript
// In browser console, run:
// This should only return current user's data
const { data: foodData } = await supabase
  .from('food_entries')
  .select('*')

console.log('Food entries count:', foodData?.length)
// Expected: Should only show current user's entries
// Status: [ ] Pass / [ ] Fail
```

### **Test 4.2: Cross-User Data Access**
**Expected Result**: Cannot access other users' data
```javascript
// In browser console, run:
// Try to access data with different user_id
const { data, error } = await supabase
  .from('food_entries')
  .select('*')
  .eq('user_id', '00000000-0000-0000-0000-000000000000')

console.log('Cross-user access result:', data, error)
// Expected: Should return empty array or error
// Status: [ ] Pass / [ ] Fail
```

## 🧪 Test Suite 5: UI Components

### **Test 5.1: Dashboard Page**
**Expected Result**: Dashboard loads with all components
```bash
# Action: Visit dashboard page
# Expected: 
# - Sidebar navigation visible
# - Main content area loads
# - No console errors
# Status: [ ] Pass / [ ] Fail
```

### **Test 5.2: Food Detection Page**
**Expected Result**: Food detection page loads
```bash
# Action: Navigate to Food Detection
# Expected: Page loads with upload interface
# Status: [ ] Pass / [ ] Fail
```

### **Test 5.3: Calorie Burn Page**
**Expected Result**: Calorie burn page loads
```bash
# Action: Navigate to Calorie Burn
# Expected: Page loads with exercise tracking interface
# Status: [ ] Pass / [ ] Fail
```

### **Test 5.4: Journal Page**
**Expected Result**: Journal page loads
```bash
# Action: Navigate to Journal
# Expected: Page loads with journal interface
# Status: [ ] Pass / [ ] Fail
```

### **Test 5.5: Ask Agent Page**
**Expected Result**: Ask Agent page loads
```bash
# Action: Navigate to Ask Agent
# Expected: Page loads with AI chat interface
# Status: [ ] Pass / [ ] Fail
```

### **Test 5.6: Profile Page**
**Expected Result**: Profile page loads
```bash
# Action: Navigate to Profile
# Expected: Page loads with user profile interface
# Status: [ ] Pass / [ ] Fail
```

## 🧪 Test Suite 6: Error Handling

### **Test 6.1: Invalid Login**
**Expected Result**: Proper error message for invalid credentials
```bash
# Action: Try to login with wrong password
Email: test@example.com
Password: wrongpassword

# Expected: Error message appears
# Status: [ ] Pass / [ ] Fail
```

### **Test 6.2: Network Error Handling**
**Expected Result**: App handles network issues gracefully
```bash
# Action: Disconnect internet
# Action: Try to perform database operation
# Expected: Error message or loading state
# Status: [ ] Pass / [ ] Fail
```

## 🧪 Test Suite 7: Performance

### **Test 7.1: Page Load Speed**
**Expected Result**: Pages load quickly
```bash
# Action: Navigate between pages
# Expected: Pages load within 2-3 seconds
# Status: [ ] Pass / [ ] Fail
```

### **Test 7.2: Database Query Performance**
**Expected Result**: Database queries are fast
```javascript
// In browser console, run:
console.time('food-query')
const { data } = await supabase
  .from('food_entries')
  .select('*')
console.timeEnd('food-query')
// Expected: Query completes within 1 second
// Status: [ ] Pass / [ ] Fail
```

## 📊 Test Results Summary

### **Authentication Tests**
- [ ] Test 1.1: Initial App Load
- [ ] Test 1.2: Sign Up Process
- [ ] Test 1.3: JWT Token Storage
- [ ] Test 1.4: Login Process
- [ ] Test 1.5: Session Persistence
- [ ] Test 1.6: Sign Out

### **Navigation Tests**
- [ ] Test 2.1: Dashboard Access
- [ ] Test 2.2: Sidebar Navigation
- [ ] Test 2.3: Protected Route Access

### **Database Tests**
- [ ] Test 3.1: User Profile Creation
- [ ] Test 3.2: Food Entries Table Access
- [ ] Test 3.3: Exercise Entries Table Access
- [ ] Test 3.4: Daily Summaries Table Access

### **Security Tests**
- [ ] Test 4.1: Data Isolation
- [ ] Test 4.2: Cross-User Data Access

### **UI Tests**
- [ ] Test 5.1: Dashboard Page
- [ ] Test 5.2: Food Detection Page
- [ ] Test 5.3: Calorie Burn Page
- [ ] Test 5.4: Journal Page
- [ ] Test 5.5: Ask Agent Page
- [ ] Test 5.6: Profile Page

### **Error Handling Tests**
- [ ] Test 6.1: Invalid Login
- [ ] Test 6.2: Network Error Handling

### **Performance Tests**
- [ ] Test 7.1: Page Load Speed
- [ ] Test 7.2: Database Query Performance

## 🎯 Overall Test Status

**Total Tests**: 20
**Passed**: ___ / 20
**Failed**: ___ / 20
**Success Rate**: ___%

## 📝 Notes & Issues

**Date**: _______________
**Tester**: _______________

**Issues Found**:
1. _________________________________
2. _________________________________
3. _________________________________

**Next Steps**:
1. _________________________________
2. _________________________________
3. _________________________________

---

*Use this guide to systematically test all features of your TrackFit AI application. Update the checkboxes and notes as you complete each test.* 