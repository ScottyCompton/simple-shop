# OAuth2 Social Login Implementation Plan for Simple Shop

## Overview

This document outlines the implementation plan for adding OAuth2 social logins (Google and GitHub) to the Simple Shop application. The implementation will allow users to log in using their Google or GitHub accounts and will store their information in the users table, associating it with the applicable social login ID and/or email address.

## Steps to Complete Implementation

### Backend (simple-shop-api)

1. **Install required packages**

```bash
cd c:/projects/node/simple-shop-api
npm install passport passport-google-oauth20 passport-github2 express-session jsonwebtoken dotenv
npm install @types/passport @types/passport-google-oauth20 @types/passport-github2 @types/express-session @types/jsonwebtoken --save-dev
```

2. **Run database migration**

```bash
npx prisma migrate dev --name add_social_auth_fields
```

3. **Generate Prisma client**

```bash
npx prisma generate
```

4. **Create OAuth provider applications**
   - Google: https://console.cloud.google.com/
   - GitHub: https://github.com/settings/developers

5. **Set up environment variables**
   Create a `.env` file with the following:

```
API_URL=http://localhost:3000
CLIENT_URL=http://localhost:5173
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
```

### Frontend (simple-shop)

1. **Install required packages**

```bash
cd c:/projects/react-projects/simple-shop
npm install jwt-decode
```

2. **Update routing configuration**
   - Ensure the `/auth/callback` route is correctly set up in the router

3. **Update authentication handling**
   - Test token storage and retrieval
   - Verify protection of routes

## Testing

1. Start both the frontend and backend applications

```bash
# Terminal 1
cd c:/projects/node/simple-shop-api
npm run dev

# Terminal 2
cd c:/projects/react-projects/simple-shop
npm run dev
```

2. Navigate to the login page and test both Google and GitHub login buttons

3. Verify that user information is correctly stored in the database

4. Verify that protected routes remain accessible after authentication

## Important Notes

- The implementation uses JWT for maintaining authentication state
- Social login users will have empty billing/shipping addresses initially
- First name and last name will be extracted from the social profile
- Avatar URLs will be stored when available from the social provider

## Files Modified

### Backend (simple-shop-api)

- `prisma/schema.prisma` - Added social auth fields
- `src/config/passport.ts` - Passport.js configuration
- `src/services/jwtService.ts` - JWT token handling
- `src/routes/auth.ts` - OAuth endpoints
- `src/index.ts` - Server setup
- `src/models/types.ts` - Updated user model types
- `src/routes/users.ts` - Updated user authentication

### Frontend (simple-shop)

- `src/utils/authUtils.ts` - Authentication utilities
- `src/page/AuthCallback.tsx` - OAuth callback handling
- `src/features/shop/userApiSlice.ts` - API authentication
- `src/page/Login.tsx` - Social login buttons
- `src/routes/ProtectedRoute.tsx` - Route protection
- `src/types/index.tsx` - Updated user types
- `src/routes/AppRouter.tsx` - Added auth callback route
