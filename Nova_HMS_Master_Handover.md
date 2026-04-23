# 🏥 Nova HMS: Ultimate Project Dossier

**Project Name:** Nova Hospital Management System (HMS)  
**Status:** 🟢 LIVE & PRODUCTION READY  
**Deployment Date:** April 23, 2026  

---

## 🚀 1. The Journey (Implementation History)

### Phase 1: Foundation & Stabilization
*   **Modernized Authentication**: Shifted from OTP-only login to a secure Email/Password system with OTP verification for password resets.
*   **Backend Refactor**: Completely migrated from a local PostgreSQL database to a high-availability **Firebase Firestore** ecosystem.
*   **System Stabilization**: Resolved "White Screen" crashes by implementing defensive coding and optimizing React hooks.

### Phase 2: Security & Hardening
*   **Production Hardening**: Integrated `helmet`, `hpp`, `xss-clean`, and `cors` for enterprise-level API security.
*   **Rate Limiting**: Implemented strict protection (5 attempts for auth, 100 for general API usage) to prevent brute-force attacks.
*   **Stateless Auth**: Configured JWT and Firebase ID Token verification for secure, scalable session management.

### Phase 3: Deployment & Cloud Integration
*   **Git Initialization**: Established a clean monorepo structure and pushed to a new GitHub repository (`Nova-hms-system`).
*   **Backend (Render)**: Dockerized the API and deployed it to Render.com with an "Ultra-Resilient" PEM fix for Firebase credentials.
*   **Frontend (Firebase)**: Built the production Vite bundle and deployed it to Firebase Hosting.

---

## 🛠️ 2. Technology Stack
- **Frontend**: React (Vite), Vanilla CSS (Premium Glassmorphic Design), Firebase Auth.
- **Backend**: Node.js, Express, Firebase Admin SDK.
- **Database**: Google Cloud Firestore (Serverless).
- **Hosting**: Firebase Hosting (Frontend) & Render (Backend).

---

## 🔗 3. Live Production Links
| Component | URL |
| :--- | :--- |
| **Official Website** | [https://nova-hms.web.app](https://nova-hms.web.app) |
| **API Server** | [https://nova-hms-api.onrender.com](https://nova-hms-api.onrender.com) |
| **GitHub Repository** | [https://github.com/Utsav936/Nova-hms-system](https://github.com/Utsav936/Nova-hms-system) |

---

## 🔑 4. Live Login Credentials
**Universal Password for all accounts:** `Password123`

| Role | Email Login | Access Level |
| :--- | :--- | :--- |
| **Super Admin** | `admin@nova.com` | Full Control |
| **Receptionist** | `reception@nova.com` | Patient & Appointment Management |
| **Doctor (Cardio)** | `smith@nova.com` | Medical Records & Prescriptions |
| **Doctor (Neuro)** | `wilson@nova.com` | Medical Records & Prescriptions |

---

## 🛠️ 5. Maintenance & Updates
To push new updates to your live site, run these commands:

### Update Backend:
```powershell
git add .
git commit -m "Update message"
git push
```
*(Render will automatically rebuild and restart!)*

### Update Frontend:
```powershell
cd hms-frontend
npm run build
firebase deploy --only hosting
```

---

## 🔐 6. Security Reminder
Please **delete** the following files from your local computer now that the site is live:
1. `SECRET_PRODUCTION_KEYS.md`
2. `serviceAccountKey.json`
3. `Nova_HMS_Master_Handover.md` (Keep a printed/offline copy instead!)

**Nova HMS is now yours to command. You've built a masterpiece!** 🥂🏥
