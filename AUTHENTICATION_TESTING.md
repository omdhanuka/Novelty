# 🧪 Authentication Testing Checklist

## Quick Start Testing

### Prerequisites
1. Backend running on `http://localhost:3000` (or your port)
2. Frontend running on `http://localhost:5173`
3. MongoDB connected
4. `.env` file configured with JWT_SECRET

---

## ✅ Test Cases

### 1. User Registration Flow

**Test 1.1: Successful Registration**
- [ ] Navigate to `/register`
- [ ] Fill all required fields:
  - Name: "Test User"
  - Email: "test@example.com"
  - Password: "test123"
  - Confirm Password: "test123"
  - Phone: "9876543210" (optional)
- [ ] Click "Create Account"
- [ ] ✅ Should redirect to homepage
- [ ] ✅ Should see user name in header
- [ ] ✅ Token saved in localStorage

**Test 1.2: Validation Errors**
- [ ] Try empty name → Should show error
- [ ] Try invalid email → Should show error
- [ ] Try password < 6 chars → Should show error
- [ ] Try mismatched passwords → Should show error

**Test 1.3: Duplicate Email**
- [ ] Try registering with same email
- [ ] ✅ Should show "User already exists" error

---

### 2. User Login Flow

**Test 2.1: Successful Login**
- [ ] Logout if logged in
- [ ] Navigate to `/login`
- [ ] Enter registered credentials
- [ ] Click "Sign in"
- [ ] ✅ Should redirect to homepage
- [ ] ✅ Should see "Login" → "User Menu" in header

**Test 2.2: Invalid Credentials**
- [ ] Try wrong password → Should show error
- [ ] Try non-existent email → Should show error
- [ ] Try empty fields → Should show validation error

**Test 2.3: Remember Session**
- [ ] Login successfully
- [ ] Refresh page
- [ ] ✅ Should remain logged in

---

### 3. Forgot Password Flow

**Test 3.1: Request Reset Token**
- [ ] Logout
- [ ] Navigate to `/forgot-password`
- [ ] Enter registered email
- [ ] Click "Send Reset Link"
- [ ] ✅ Should show success message
- [ ] ✅ Should display reset token (dev mode)

**Test 3.2: Invalid Email**
- [ ] Enter non-existent email
- [ ] ✅ Should show "No account found" error

---

### 4. Reset Password Flow

**Test 4.1: Successful Reset**
- [ ] Get reset token from forgot password step
- [ ] Navigate to `/reset-password/:token`
- [ ] Enter new password
- [ ] Confirm password
- [ ] Click "Reset Password"
- [ ] ✅ Should show success message
- [ ] ✅ Should redirect to login after 3 seconds
- [ ] Try logging in with new password
- [ ] ✅ Should work

**Test 4.2: Validation Errors**
- [ ] Try password < 6 chars → Should show error
- [ ] Try mismatched passwords → Should show error

**Test 4.3: Expired Token**
- [ ] Wait 15+ minutes
- [ ] Try using old token
- [ ] ✅ Should show "Invalid or expired token" error

**Test 4.4: Invalid Token**
- [ ] Use random token in URL
- [ ] ✅ Should show error

---

### 5. Protected Routes

**Test 5.1: Access When Logged Out**
- [ ] Logout
- [ ] Try to navigate to `/profile`
- [ ] ✅ Should redirect to `/login`
- [ ] ✅ Should see "from" state to redirect back after login

**Test 5.2: Access When Logged In**
- [ ] Login
- [ ] Navigate to `/profile`
- [ ] ✅ Should display profile page

---

### 6. User Profile Page

**Test 6.1: View Profile**
- [ ] Login
- [ ] Navigate to `/profile`
- [ ] ✅ Should display user information
- [ ] ✅ Should show name, email, phone, role

**Test 6.2: Change Password**
- [ ] Go to "Change Password" tab
- [ ] Enter current password
- [ ] Enter new password
- [ ] Confirm new password
- [ ] Click "Update Password"
- [ ] ✅ Should show success message
- [ ] Logout and login with new password
- [ ] ✅ Should work

**Test 6.3: Change Password Errors**
- [ ] Enter wrong current password → Should show error
- [ ] Enter mismatched new passwords → Should show error
- [ ] Enter short password → Should show error

---

### 7. Header Component

**Test 7.1: Logged Out State**
- [ ] Logout
- [ ] ✅ Should show "Login" and "Sign Up" buttons

**Test 7.2: Logged In State**
- [ ] Login
- [ ] ✅ Should show user icon instead of auth buttons
- [ ] Click user icon
- [ ] ✅ Should show dropdown with:
  - User name and email
  - "My Profile" link
  - "Logout" button

**Test 7.3: Logout from Header**
- [ ] Click user icon → Logout
- [ ] ✅ Should redirect to homepage
- [ ] ✅ Should show Login/Sign Up buttons again
- [ ] ✅ Token removed from localStorage

---

### 8. API Endpoints Testing (Postman/Thunder Client)

**Test 8.1: Register API**
```http
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "name": "API Test User",
  "email": "apitest@example.com",
  "password": "test123",
  "phone": "9876543210"
}
```
✅ Should return: `{ success: true, token: "...", data: {...} }`

**Test 8.2: Login API**
```http
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "apitest@example.com",
  "password": "test123"
}
```
✅ Should return: `{ success: true, token: "...", data: {...} }`

**Test 8.3: Get Current User**
```http
GET http://localhost:3000/api/auth/me
Authorization: Bearer YOUR_TOKEN_HERE
```
✅ Should return user data

**Test 8.4: Update Profile**
```http
PUT http://localhost:3000/api/auth/profile
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "name": "Updated Name",
  "phone": "1234567890"
}
```
✅ Should update and return updated user

**Test 8.5: Forgot Password**
```http
POST http://localhost:3000/api/auth/forgot-password
Content-Type: application/json

{
  "email": "apitest@example.com"
}
```
✅ Should return success with reset token

**Test 8.6: Reset Password**
```http
POST http://localhost:3000/api/auth/reset-password/RESET_TOKEN_HERE
Content-Type: application/json

{
  "newPassword": "newpass123",
  "confirmPassword": "newpass123"
}
```
✅ Should return success

**Test 8.7: Change Password**
```http
PUT http://localhost:3000/api/auth/change-password
Authorization: Bearer YOUR_TOKEN_HERE
Content-Type: application/json

{
  "currentPassword": "test123",
  "newPassword": "newtest123",
  "confirmPassword": "newtest123"
}
```
✅ Should return success

---

### 9. Security Tests

**Test 9.1: Password Not Exposed**
- [ ] Register/Login
- [ ] Check API response
- [ ] ✅ Password should NOT be in response

**Test 9.2: Password Hashed in DB**
- [ ] Check MongoDB
- [ ] ✅ Password should be hashed (not plain text)

**Test 9.3: Token Validation**
- [ ] Try accessing `/api/auth/me` without token
- [ ] ✅ Should return 401 Unauthorized
- [ ] Try with invalid token
- [ ] ✅ Should return 401 Unauthorized

---

### 10. Edge Cases

**Test 10.1: Long Names**
- [ ] Try registering with 100+ character name
- [ ] ✅ Should handle gracefully

**Test 10.2: Special Characters in Email**
- [ ] Try various email formats
- [ ] ✅ Should validate correctly

**Test 10.3: Multiple Login Sessions**
- [ ] Login from different browsers
- [ ] ✅ Both should work independently

**Test 10.4: Expired JWT**
- [ ] Wait for token expiry (7 days by default)
- [ ] Try accessing protected route
- [ ] ✅ Should redirect to login

---

## 🎯 Quick Test Script

Run this in order for fastest testing:

```bash
# Test 1: Register
1. Open /register
2. Fill form → Submit
3. ✅ Logged in automatically

# Test 2: Logout
1. Click user icon → Logout
2. ✅ Shows login buttons

# Test 3: Login
1. Click Login
2. Enter credentials → Submit
3. ✅ Logged in

# Test 4: Profile
1. Click user icon → My Profile
2. ✅ Shows profile info

# Test 5: Change Password
1. Go to Change Password tab
2. Update password
3. ✅ Success message

# Test 6: Forgot Password
1. Logout
2. Go to /forgot-password
3. Enter email → Get token
4. Go to /reset-password/:token
5. Set new password
6. ✅ Login with new password works

# Test 7: Protected Route
1. Logout
2. Try /profile
3. ✅ Redirects to login
```

---

## 📊 Results Summary

After completing all tests, fill this out:

| Category | Tests Passed | Tests Failed | Notes |
|----------|--------------|--------------|-------|
| Registration | __ / 3 | __ | |
| Login | __ / 3 | __ | |
| Forgot Password | __ / 2 | __ | |
| Reset Password | __ / 4 | __ | |
| Protected Routes | __ / 2 | __ | |
| User Profile | __ / 3 | __ | |
| Header | __ / 3 | __ | |
| API Endpoints | __ / 7 | __ | |
| Security | __ / 3 | __ | |
| Edge Cases | __ / 4 | __ | |

**Total: __ / 34 tests passed** ✅

---

## 🐛 Bug Report Template

If you find issues, document them:

```
Issue #: ___
Test Case: ___
Expected Result: ___
Actual Result: ___
Steps to Reproduce:
1. 
2. 
3. 

Screenshots: ___
Console Errors: ___
```

---

## ✅ Sign-off

- [ ] All registration flows work
- [ ] All login flows work
- [ ] Password reset works end-to-end
- [ ] Protected routes are secure
- [ ] Profile page functions correctly
- [ ] Header shows correct auth state
- [ ] APIs respond correctly
- [ ] Security measures in place
- [ ] Edge cases handled

**Tester Name**: _____________
**Date**: _____________
**Status**: ☐ Pass  ☐ Fail  ☐ With Issues

---

**System is ready for production after all tests pass!** 🚀
