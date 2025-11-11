#  TVideo — Full Stack Video Platform

TVideo is a **modern video-sharing platform** built using a high-performance, scalable architecture.  
It combines a **Next.js + TypeScript** frontend with a **Node.js + Express** backend, powered by **MongoDB**, **Redis**, and **Cloudinary**.

---

##  Tech Stack Overview

###  Frontend
-  **Next.js** – Fast, SEO-friendly React framework  
-  **TypeScript** – Type-safe, maintainable codebase  
-  **Chakra UI** – Beautiful, accessible component library  
-  **Tanstack Query** – Data fetching and caching  
-  **Zustand** – Lightweight global state management  

###  Backend
-  **Express.js** – Scalable web framework for Node.js  
-  **MongoDB** – NoSQL database for flexible data modeling  
-  **Redis** – Caching and session management  
-  **Cloudinary** – Media storage and optimization  
-  **JWT** – Secure authentication mechanism  
-  **Resend** – Transactional email delivery  

---

##  Deployment

| Service | Platform |
|----------|-----------|
| **Frontend** | [Vercel](https://vercel.com) |
| **Backend** | [Render](https://render.com) |
| **Containerization** | [Docker](https://www.docker.com) |

---

##  Project Setup

### 1️ Clone the Repository

```bash
git clone https://github.com/kunal89204/pro-backend.git
cd pro-backend
cd frontend
npm install

cd backend
npm install
```

### 2 Configure Environment Varibales

Rename the env.local to .env with real creds


### 3 Run the Project

#### Frontend
```bash
cd frontend
npm run dev
```

#### Backend
```bash
cd backend
node index.js
```

### Running backend with docker
Pull the latest backend image
```bash
docker pull kunal89204/tvideo-backend:latest
```
Run it with your environment variables:
```bash
docker run --env-file .env -p 5000:5000 kunal89204/tvideo-backend:latest
```
Make sure the .env file has all required credentials before starting.
