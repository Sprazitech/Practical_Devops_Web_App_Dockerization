#  Docker Setup Guide — 3-Tier Web Application

##  Overview
This project demonstrates a **3-Tier Architecture** using Docker and Docker Compose:

- **Frontend (Web Tier)** → React app served through Nginx  
- **Backend (App Tier)** → Node.js Express API  
- **Database (Data Tier)** → MySQL 8.0  

Each component runs inside its own container and communicates over a private Docker network (`app-network`).

---

##  Project Structure

Step 2: Start all services
docker-compose up

Step 3: Access the app

Frontend → http://localhost:3000

Backend → http://localhost:4000

MySQL → accessible internally at mysql_db:3306

 Environment Variables

Backend .env example:

DB_HOST=mysql_db
DB_USER=your-user
DB_PASSWORD=your-db-password
DB_DATABASE=your-db-name
PORT=4000

 Clean up
Stop and remove all containers:

docker-compose down



---

##  2. `DOCKER_SETUP_SUMMARY.md` — Optional Summary File
This one is usually shorter and meant for reports, documentation, or blog posts — a **one-page summary** of your Docker architecture.

**Example:**
```markdown
# Docker Setup Summary

**Architecture:**
- Frontend (React + Nginx) → port 3000
- Backend (Node.js + Express) → port 4000
- Database (MySQL 8.0) → port 3306 (internal)

**Networks:**
- All containers share `app-network` for internal communication.

**Volumes:**
- MySQL data persisted in named volume `mysql_data`.

**Dockerfiles:**
- Separate Dockerfiles for frontend and backend.
- `.dockerignore` files exclude `node_modules` and unnecessary files.

**Orchestration:**
- All containers are orchestrated with a single `docker-compose.yml`.


