# ProConnect

ProConnect is a full-stack professional social networking application for discovering people, building connections, and sharing updates. It combines a LinkedIn-inspired profile experience with a lighter social feed, centered on the idea of connecting with friends without exaggeration.

## Live Application

- **Frontend:** [proconnect-delta-two.vercel.app](https://proconnect-delta-two.vercel.app/)
- **Backend API:** [linkedinclone-kw73.onrender.com](https://linkedinclone-kw73.onrender.com/)
- **API health check:** [linkedinclone-kw73.onrender.com/](https://linkedinclone-kw73.onrender.com/)

The API health check returns `{ "message": "RUNNING" }` when the backend is available.

## Features

### Accounts and profiles

- Register and log in with email, password, name, and username.
- Manage profile information, biography, current position, work history, and education.
- Upload a profile picture and banner image.
- View another user's public profile by username.
- Download a profile as a generated PDF resume.

### Social feed

- Create text posts with optional media uploads.
- Browse the post feed and user profiles.
- Like posts and add comments.
- Delete your own posts and comments.

### Connections and discovery

- Discover all available user profiles.
- Send connection requests.
- Accept or manage connection requests.
- View accepted connections in the connections area.

## Tech Stack

- **Frontend:** Next.js, React, Redux Toolkit, React Redux, Axios
- **Backend:** Node.js, Express 5, Mongoose, MongoDB
- **Uploads:** Multer with local `uploads/` storage
- **Documents:** PDFKit for resume generation
- **Deployment:** Vercel for the frontend and Render for the backend

## Project Structure

```text
.
├── backend/
│   ├── controllers/       # Request handlers and application logic
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express route definitions
│   ├── uploads/           # Uploaded media and generated files
│   ├── server.js          # Express and MongoDB entry point
│   └── package.json
├── frontend/
│   ├── public/             # Static assets
│   └── src/
│       ├── Components/     # Shared UI components
│       ├── config/redux/   # Store, actions, reducers, and middleware
│       ├── layout/         # Page layouts
│       └── pages/          # Next.js pages
└── README.md
```

## Local Development

### Prerequisites

- Node.js 18 or newer
- npm
- A MongoDB database, local or hosted

### 1. Start the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/proconnect
```

Start the API:

```bash
npm run dev
```

The backend listens on `http://localhost:9090`.

For a production-style local start, use:

```bash
npm run prod
```

### 2. Start the frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:9090
```

Start Next.js:

```bash
npm run dev
```

Open `http://localhost:3000` in a browser.

## Available Scripts

### Frontend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Run ESLint |

### Backend

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Express with nodemon |
| `npm run prod` | Start Express with Node.js |

## API Overview

The backend currently exposes the following route groups. Authentication uses the token returned by `/login`; authenticated requests pass that token in the request body or query string as required by the endpoint.

| Area | Endpoints |
| --- | --- |
| Health | `GET /` |
| Authentication | `POST /register`, `POST /login` |
| Profile | `GET /get_user_and_profile`, `POST /user_update`, `POST /update_profile_data`, `GET /user/get_all_users`, `GET /user/get_profile_based_on_username` |
| Media and resume | `POST /upload_profile_picture`, `POST /upload_banner`, `GET /user/download_resume` |
| Posts | `GET /posts`, `POST /post`, `DELETE /delete_post` |
| Engagement | `POST /increament_like`, `POST /comment`, `POST /get_comments`, `DELETE /delete_comment` |
| Connections | `POST /user/send_connection_request`, `GET /user/get_connection_requests`, `GET /user/user_connection_request`, `POST /user/accept_connection_request` |

## Deployment

### Frontend on Vercel

Set the following Vercel environment variable:

```env
NEXT_PUBLIC_API_URL=https://linkedinclone-kw73.onrender.com
```

Then deploy the `frontend` directory as the project root.

### Backend on Render

Configure the Render service with:

- **Root directory:** `backend`
- **Build command:** `npm install`
- **Start command:** `npm run prod`
- **Environment variable:** `MONGO_URI=<your MongoDB connection string>`

The backend currently listens on port `9090`. If the hosting provider supplies a dynamic port, update the server to read `process.env.PORT` before deploying to that environment.

## Future Direction

### Foundation and security

- Replace long-lived stored tokens with signed, expiring sessions or JWTs.
- Move uploads to object storage and keep generated files out of the application filesystem.
- Validate request bodies and uploaded file types and sizes on the server.
- Add authorization middleware so protected routes share one consistent authentication flow.
- Add indexes, pagination, rate limiting, structured logging, and error monitoring.

### Product experience

- Add notifications for connection requests, likes, comments, and accepted connections.
- Add search and filtering by name, username, skills, position, and location.
- Improve the feed with pagination, post editing, richer media previews, and saved posts.
- Add profile completeness indicators and editable skills, certifications, and projects.
- Add messaging between accepted connections.
- Add responsive accessibility improvements, loading states, empty states, and clearer error feedback.

### Engineering quality

- Introduce API and component tests, including authentication and authorization cases.
- Add API documentation with request and response examples.
- Add CI checks for linting, builds, and tests on every pull request.
- Add database migrations or a documented schema versioning strategy.

## Current Limitations

- The backend does not currently define automated tests.
- Uploaded files are stored on the local filesystem, which is not durable across many hosted environments.
- The current token flow is an MVP implementation and should be hardened before handling sensitive or production-scale usage.

## License

This project currently uses the ISC license for the backend package. Review the repository's licensing needs before distributing the application or its assets.
