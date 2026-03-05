**API Documentation (Frontend)**

- **Base URL**: http://localhost:3000
- **CORS**: Backend whitelist includes http://localhost:4200 (see .env)

**Authentication**:
- The app uses JWT access and refresh tokens.
- Access token: short-lived (process.env.JWT_ACCESS_EXPIRES_IN, default 5m).
- Refresh token: longer-lived (process.env.JWT_REFRESH_EXPIRES_IN, default 7d).

**Common Headers**:
- Content-Type: application/json
- Authorization: Bearer <accessToken> (when protected endpoints are used)

**Endpoints**

- **Sign Up**: POST /users/signup
  - **Description**: Create a new local user and send confirmation OTP email.
  - **Request body (JSON)**:
    - firstname: string, alphanumeric, 3-20 chars (required)
    - lastname: string, alphanumeric, 3-20 chars (required)
    - email: string, valid email (required)
    - password: string (follows general password rules in backend) (required)
    - confirmPassword: string, must match `password` (required)
    - age: integer, between 18 and 50 (required)
    - gender: optional, one of the GenderEnum values
    - phoneNumber: string (required) — encrypted in DB
  - **Success response**: 201 Created
    ```json
    {
      "message": "User created successfully",
      "user": { /* user object (password hashed, phone encrypted) */ }
    }
    ```
  - **Error responses**:
    - 409 Conflict: User already exists
    - 400 Bad Request: validation errors
  - **cURL example**:
    ```bash
    curl -X POST http://localhost:3000/users/signup \
      -H "Content-Type: application/json" \
      -d '{"firstname":"John","lastname":"Doe","email":"john@example.com","password":"P@ssw0rd","confirmPassword":"P@ssw0rd","age":25,"phoneNumber":"1234567890"}'
    ```
  - **Frontend fetch example**:
    ```js
    fetch('http://localhost:3000/users/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(r => r.json())
      .then(data => console.log(data))
    ```

- **Sign In**: POST /users/signin
  - **Description**: Authenticate user and return access + refresh tokens.
  - **Request body (JSON)**:
    - email: string (required)
    - password: string (required)
  - **Success response**: 200 OK
    ```json
    {
      "message": "User signed in successfully",
      "accesstoken": "<JWT access token>",
      "refreshtoken": "<JWT refresh token>"
    }
    ```
  - **Error responses**:
    - 404 Not Found: Invalid email or password
  - **cURL example**:
    ```bash
    curl -X POST http://localhost:3000/users/signin \
      -H "Content-Type: application/json" \
      -d '{"email":"john@example.com","password":"P@ssw0rd"}'
    ```
  - **Frontend fetch example**:
    ```js
    const res = await fetch('http://localhost:3000/users/signin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    // store tokens securely (e.g., secure storage or httpOnly cookie via backend)
    ```

**Token usage (frontend guidance)**
- Store access token in memory or secure storage; prefer httpOnly cookies for security if backend supports it.
- Send `Authorization: Bearer <accessToken>` header for protected endpoints.
- Use the refresh token to obtain new access tokens when the access token expires (no refresh route implemented yet; watch for /refresh or similar in backend).

**Environment variables (backend .env relevant to frontend devs)**
- PORT (default 3000) — base URL port
- WHITE_LISTED_ORIGINS — frontend origins allowed by CORS

**Notes / To Do (backend)**
- Refresh token route and logout route exist as skeletons in backend services but are not yet wired to controller routes. Frontend should wait for these before implementing silent refresh/logout flows.
- The backend sends a confirmation OTP email on signup. Frontend must expose a UI for OTP confirmation if the backend adds a confirmation endpoint.

**Contact / Support**
- For API changes, consult Backend/src/Modules/Users and Validators for input rules, and Utils/tokens.utils.js for token behavior.

