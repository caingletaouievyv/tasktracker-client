# TaskTracker – Frontend

This is the frontend for TaskTracker, a full-stack task management system built with React and ASP.NET Core.  
It demonstrates a complete frontend architecture including authentication, routing, theming, and integration with a secure backend API.

## Live API
https://tasktracker-api-aud9ehbmf6d8agej.canadacentral-01.azurewebsites.net

## Tech Stack
- React 18
- Bootstrap 5
- React Router v6
- Axios
- LocalStorage + HttpOnly cookies for token handling
- Jest + React Testing Library
- Dark/Light theming (ThemeContext)

## Folder Structure
- src/components/: UI components (admin, auth, task, etc.)
- src/contexts/: Theme and auth state
- src/services/: API service logic
- src/views/: Route-based views
- src/config/: API config
- src/routes/: Route definition
- src/tests/: Unit tests

## Auth Flow
1. User logs in via `/login`.
2. JWT access token is stored in `localStorage`.
3. Refresh token is stored in an HttpOnly cookie.
4. Axios interceptors handle auto-refresh.
5. Token expiry modal shows before logout.

## Environment Setup
Create a `.env` file:
REACT_APP_API_URL=https://localhost:5001/api

## Testing
- Uses Jest + React Testing Library
- Covered: Task Forms, Auth Context, Modals, Private Routes

## Deployment
- Hosted on Netlify
- CI/CD via GitHub Actions
