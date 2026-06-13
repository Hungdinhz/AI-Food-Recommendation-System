# Authentication Implementation Plan

The goal is to implement a robust authentication system including user registration, login (with local credentials and Google OAuth), and password recovery, using Spring Boot for the backend and Next.js for the frontend.

## User Review Required

> [!WARNING]
> Implementing Google Login and Password Reset emails requires external configurations (Google API Console, SMTP Server). Please see the "Open Questions" section below.

## Open Questions

> [!IMPORTANT]
> 1. **Email Delivery**: For the "Forgot Password" feature, do you have an SMTP server ready (e.g., Gmail App Passwords, Mailtrap, SendGrid), or should I just print the reset link to the backend console for now during development?
> 2. **Google Client ID**: You will need to create a Google Cloud Project to get a `GOOGLE_CLIENT_ID` to enable Google Login. Do you have this ready, or would you like me to guide you through the process?
> 3. **UI Preference**: Do you prefer separate pages for `/login` and `/register`, or would you like them as pop-up Modals that can be accessed from any page?

## Proposed Changes

### Backend (Spring Boot)

#### [MODIFY] `backend/pom.xml`
- Add dependencies for JWT (`jjwt-api`, `jjwt-impl`, `jjwt-jackson`)
- Add `spring-boot-starter-mail` for email sending
- Add `google-api-client` for verifying Google ID Tokens

#### [MODIFY] `backend/src/main/resources/application.yml`
- Add JWT secret and expiration configurations.
- Add Mail/SMTP configurations.

#### [NEW] `backend/src/main/java/com/example/backend/users/User.java`
- JPA Entity for users (id, email, password, name, provider (LOCAL, GOOGLE), resetPasswordToken, resetPasswordTokenExpiry).

#### [NEW] `backend/src/main/java/com/example/backend/users/UserRepository.java`
- Spring Data JPA repository for the User entity.

#### [NEW] `backend/src/main/java/com/example/backend/security/...`
- **JwtUtils**: Utility to generate and validate JWTs.
- **JwtAuthenticationFilter**: Filter to intercept requests and check JWT.
- **SecurityConfig**: Configure CORS, stateless session, and permit access to `/api/auth/**`.
- **UserDetailsServiceImpl**: Load user by username for Spring Security.

#### [NEW] `backend/src/main/java/com/example/backend/auth/AuthController.java`
- Expose endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `POST /api/auth/google` (Accepts Google ID token, returns our custom JWT)
  - `POST /api/auth/forgot-password` (Sends reset email)
  - `POST /api/auth/reset-password` (Updates password using token)

#### [NEW] `backend/src/main/java/com/example/backend/auth/EmailService.java`
- Service to send emails using `JavaMailSender`.

---

### Frontend (Next.js)

#### [MODIFY] `frontend/package.json`
- Install packages: `axios` (for API requests), `js-cookie` (for token storage), `@react-oauth/google` (for Google Login UI and token retrieval), `jwt-decode`.

#### [NEW] `frontend/src/lib/axios.ts`
- Axios instance configured to automatically attach the JWT token to requests.

#### [NEW] `frontend/src/app/providers/AuthProvider.tsx`
- React Context to manage the user's authentication state across the app.

#### [NEW] `frontend/src/app/(auth)/login/page.tsx` & `register/page.tsx`
- Beautiful UI for login and registration forms with validation.
- Integration with `@react-oauth/google` for the "Sign in with Google" button.

#### [NEW] `frontend/src/app/(auth)/forgot-password/page.tsx`
- Form to enter email and request a reset link.

#### [NEW] `frontend/src/app/(auth)/reset-password/page.tsx`
- Form to enter a new password (reads token from URL query params).

#### [MODIFY] `frontend/src/components/Navigation.tsx` (or Header)
- Update the navigation bar to show "Login/Register" or the user's profile icon based on auth state.

## Verification Plan

### Automated/Manual Verification
1. Register a new user with email and password -> Expect success and DB entry.
2. Login with correct credentials -> Expect JWT token returned and frontend state updated.
3. Login with incorrect credentials -> Expect error message on frontend.
4. Access a protected endpoint without JWT -> Expect 401 Unauthorized.
5. Access a protected endpoint with JWT -> Expect success.
6. Click "Sign in with Google", select account -> Expect JWT token returned from backend.
7. Click "Forgot Password", enter email -> Expect email sent (or logged to console).
8. Use link in email to reset password -> Expect password updated successfully.
