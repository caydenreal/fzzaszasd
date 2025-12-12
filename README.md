# FortZumwalt.com — Static Website + Client-side Admin Panel

**What this is**
A complete static website project (HTML/CSS/JS) with a built-in client-side admin panel.  
It includes a dark-mode-enabled responsive design, sample pages, an admin interface that edits site content stored in `localStorage`, and instructions.

**Not production-ready**
This admin is client-side only (uses browser `localStorage`) for ease of setup. Do **not** use for real authentication or sensitive data. If you want a secure backend, I can add a Node/Express or Flask backend with database.

**How to use**
1. Unzip the project.
2. Open `index.html` in a browser to view the site.
3. Open `admin/index.html` to access admin panel.
   - Default admin password: `adminpass`
   - You can change the password in `admin/config.js`.

**Files**
- `index.html`, `about.html`, `contact.html` — public pages.
- `admin/` — admin panel (login + editor + content manager).
- `assets/` — CSS, JS, images.
- `README.md` — this file.

If you'd like: I can add a backend, database, email forms, deployment files, or integrate with a CMS and host-ready Docker setup. Ask and I'll add it.
