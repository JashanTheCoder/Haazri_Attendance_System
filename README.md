# Haaज़ri Attendance System

Node.js, Express, MongoDB, EJS, Socket.IO, and GraphQL attendance tracker with admin CSV upload, email notifications, chart dashboards, and Excel export.

## Features
- Role-based authentication for students and admins.
- Admin attendance upload from manual JSON or CSV files.
- Student attendance dashboard with realtime refreshes.
- Email notifications when attendance is uploaded and when a score drops below 75%.
- Chart.js bar and pie charts in student and admin views, loaded from CDN.
- XLSX export for both admin and student attendance reports.

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- EJS server-rendered views
- Socket.IO realtime events
- `multer`, `csv-parse`, `nodemailer`, `exceljs`
- Chart.js via CDN

## Project Layout
- `index.js` - main server, routes, upload logic, email, and export handlers
- `middleware.js` - auth guards and common middleware
- `models/` - `User`, `Attendance`, `Course`, `Enrollment`
- `views/` - landing, login, attendance, admin, and student pages
- `public/` - static assets and realtime client scripts

## Setup
Install dependencies:

```bash
npm install
```

Start the app:

```bash
npm start
```

Open:

- http://localhost:3000
- http://localhost:3000/login
- http://localhost:3000/admin/dashboard
- http://localhost:3000/admin/upload-attendance

## Environment Variables
Set these in your environment or `.env` file (example file `.env` is used by the app):

- `MONGODB_URI` - MongoDB connection string (Atlas URI)
- `SESSION_SECRET` - session signing secret
- `PORT` - optional server port, defaults to `3000`
- `EMAIL_HOST` - SMTP host (e.g. `smtp.gmail.com` for Gmail)
- `EMAIL_PORT` - SMTP port (e.g. `465` or `587`)
- `EMAIL_SECURE` - `true` for TLS (port 465), `false` for STARTTLS (port 587)
- `EMAIL_USER` - SMTP username (your email address)
- `EMAIL_PASS` - SMTP password or app password
- `EMAIL_FROM` - sender address used by notifications (defaults to `EMAIL_USER`)
- `EMAIL_ADMIN_TO` - optional fallback recipient if a user email is missing
- `DEV_TEST_TOKEN` - optional token to enable a local dev test endpoint: `/dev/test-email?token=...`

If email variables are not configured, the app will fall back to an Ethereal preview for local dev tests (or skip real sends) so uploads still work.

### Gmail (Recommended) — quick setup
1. Enable 2-Step Verification for the Google account you want to send from.
2. Create an App Password (Google Account → Security → App passwords) and copy the 16‑character password.
3. Add these to `.env` (example):

```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=465
EMAIL_SECURE=true
EMAIL_USER=you@gmail.com
EMAIL_PASS=<your_app_password_here>
EMAIL_FROM=you@gmail.com
```

4. Restart the server: `npm start` and test by uploading attendance that reduces a student's percentage below 75% — the system will send the low-attendance email automatically.

Security note: Treat `EMAIL_PASS` like any secret; do not commit `.env` to version control. If the secret is exposed, revoke the App Password in your Google Account and create a new one.

## Attendance Upload
Admin upload routes:

- `GET /admin/upload-attendance` - admin upload UI
- `POST /admin/upload-attendance` - JSON payload for manual rows
- `POST /admin/upload-attendance-csv` - CSV upload using form field `attendanceCSV`

CSV format:

```csv
username,courseName,courseCode,delivered,attended
john_doe,Mathematics,MATH101,30,25
```

Unknown usernames are skipped during import.

## Reports and Export
- `GET /admin/dashboard` - admin overview with charts
- `GET /attendance/my` - student attendance view with charts
- `GET /admin/export-attendance` - download all attendance as `.xlsx`
- `GET /attendance/my/export` - download personal attendance as `.xlsx`

## Realtime Events
- `attendanceUpdated` - emitted when attendance is uploaded or saved
- `lowAttendanceAlert` - emitted when attendance drops below 75%
- `leaderboardUpdate` - emitted for the live leaderboard client

## Email behavior & testing
- Automatic notifications: When attendance is saved (manual upload, CSV upload, or student save), the app will:
  - Send an attendance update email to the student (if `email` exists), and
  - Send a low-attendance alert when the latest percentage falls below the threshold (`ATTENDANCE_THRESHOLD`, default `75%`) and the previous percentage was >= threshold.

- Test endpoints:
  - The admin `Send Test Email` button has been removed to avoid accidental sends.
  - For local debugging there is a token-protected helper (only enabled when `DEV_TEST_TOKEN` is set in `.env`):
    - GET `/dev/test-email?token=YOUR_TOKEN&to=recipient@example.com` — sends a test message; when real SMTP isn't configured, the app falls back to Ethereal and returns a preview URL.

## Test Admin
For local testing, the normalized dataset includes:

- Username: `student_d7b61253`
- Password: `Password123!`

The seeded data currently contains 10 student users, 1 admin user, and 10 attendance rows.

## Notes
- The CSP allows `cdn.jsdelivr.net`, so Chart.js can load from CDN.
- Font Awesome webfonts may still be blocked by CSP unless hosted locally or added to the policy.
- The importer and save flow both trigger email notifications when configured.
|----------|-------------|----------|
| `MONGODB_URI` | MongoDB Atlas connection string | ✅ |
| `PORT` | Server port (default: 3000) | ❌ |
| `NODE_ENV` | Environment mode (development/production) | ❌ |
| `SESSION_SECRET` | Secret key for sessions | ❌ |

## 📦 Dependencies

**Core**
- `express` - Web framework
- `mongoose` - MongoDB ODM
- `socket.io` - Real-time communication
- `express-graphql` - GraphQL middleware

**Security**
- `bcryptjs` - Password hashing
- `helmet` - Security headers
- `express-validator` - Input validation

**Session**
- `express-session` - Session management
- `cors` - Cross-origin requests

**View**
- `ejs` - Template engine

## 🧪 Testing

```bash
# Run with development logging
NODE_ENV=development npm start

# Test GraphQL
curl -X POST http://localhost:3000/graphql \
  -H "Content-Type: application/json" \
  -d '{"query":"{ users { username email } }"}'
```

## 🚢 Deployment

### Heroku
```bash
heroku login
heroku create app-name
git push heroku main
heroku config:set MONGODB_URI="your_connection_string"
```

### Vercel (with Node.js)
```bash
vercel
vercel env add MONGODB_URI
```

### Docker
```bash
docker build -t haazri .
docker run -p 3000:3000 -e MONGODB_URI="..." haazri
```

## 🐛 Troubleshooting

**MongoDB Connection Error:**
- Verify IP whitelist in Atlas cluster settings
- Check `MONGODB_URI` format in `.env`
- Ensure network connectivity

**Port 3000 Already in Use:**
```powershell
Get-NetTCPConnection -LocalPort 3000 | Select-Object OwningProcess
Stop-Process -Id <PID> -Force
```

**Session Not Persisting:**
- Ensure `SESSION_SECRET` is set
- Check browser cookie settings
- Verify session middleware is loaded

## 📈 Performance Tips

1. **Database Indexes**: Add indexes for `username`, `email`
2. **Caching**: Implement Redis for session storage
3. **Pagination**: Add limit/offset to leaderboard queries
4. **Compression**: Enable gzip with `compression` middleware

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📄 License

ISC License - Feel free to use this project

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check existing documentation
- Review error logs in `console`

---

**Made with ❤️ by the Haaज़री Team**
