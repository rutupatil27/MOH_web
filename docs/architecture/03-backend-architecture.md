# Backend Architecture

Recommended:
```text
server/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── services/
├── validators/
├── utils/
└── server.js
```

Routes map endpoints. Controllers orchestrate. Services contain business logic. Models contain schemas. Validators validate input. Middleware handles auth/errors/uploads/rate limits.

Single admin: hashed password, protected routes, rate-limited login, secure token/session strategy. Never expose credentials.

Gallery uploads need type/size validation and optimized storage/output.
