# System Architecture

## Stack
Frontend: React, React Router, centralized styling/design tokens, reusable components, API service layer.
Backend: Node.js, Express, MongoDB, Mongoose.

## Flow
Browser → React UI → API service → Express routes → controllers → services → Mongoose → MongoDB

## Principles
- Separate presentation from business logic.
- Centralize API access.
- Validate server-side.
- Centralize errors.
- Protect admin routes.
- Keep secrets in environment variables.
