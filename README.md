# Denim House R&D Workspace

A multi-user web application for managing the creative and technical workflow
of a fashion/denim R&D department. The platform centralizes task management,
skills, planning, and human resources with an intelligent assignment recommendation system.

---

## Tech Stack

### Frontend
- React + Tailwind CSS
- Zustand (state management)
- React Query (data fetching)
- Socket.io client (real-time)
- FullCalendar (planning)
- DnD Kit (drag & drop)

### Backend
- Node.js + Express
- Socket.io (WebSocket)
- Prisma ORM
- JWT + bcrypt (authentication)
- Bull (queue jobs for alerts)

### Database
- PostgreSQL (main database)
- Redis (cache + sessions)

### DevOps
- Docker + Docker Compose
- Nginx (reverse proxy)
- Railway.app / Vercel (free deployment)

---

## Project Structure

```
denim-house/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma            # All models, enums, relations
│   ├── src/
│   │   ├── lib/
│   │   │   └── prisma.js            # Prisma client instance
│   │   ├── services/
│   │   │   ├── auth.service.js      # Register, login, JWT
│   │   │   ├── user.service.js      # CRUD members + skills
│   │   │   ├── task.service.js      # CRUD tasks + dependencies
│   │   │   ├── scoring.service.js   # Smart assignment engine
│   │   │   ├── planning.service.js  # Planning blocks + conflicts
│   │   │   ├── absence.service.js   # Absences + holidays
│   │   │   ├── alert.service.js     # Alert detection + triggers
│   │   │   ├── notification.service.js  # Real-time notifications
│   │   │   ├── forum.service.js     # Posts + comments
│   │   │   ├── moodboard.service.js # Boards + images + colors
│   │   │   └── prototype.service.js # Phase tracking
│   │   ├── controllers/             # Request handlers
│   │   ├── routes/                  # API routes
│   │   ├── middleware/              # Auth, roles, error handling
│   │   └── index.js                 # Express server entry point
│   ├── .env
│   ├── Dockerfile
│   └── package.json
├── frontend/                        # React app (coming later)
├── nginx/
│   └── nginx.conf
└── docker-compose.yml
```

---

## Modules

| # | Module | Description |
|---|--------|-------------|
| 1 | Dashboard | Real-time team metrics, workload, active alerts |
| 2 | Members & Profiles | Skills (1-5), expertise domains, task history |
| 3 | Task Management | 18 task types across 4 families, priorities, dependencies |
| 4 | Smart Assignment | Scoring engine recommending top 3 members per task |
| 5 | Planning | 30-minute slot grid, 8h/day cap, drag & drop |
| 6 | Priorities & Dependencies | Dependency chain with cascade delay detection |
| 7 | Absences & Holidays | Leave management, national holidays, auto-exclusion |
| 8 | Smart Alerts | Overload, missing skill, bottleneck, cascade delay |
| 9 | Kanban Board | Drag & drop columns with real-time sync |
| 10 | Mood Board | Visual boards, color palettes, image references |
| 11 | Architectural Plans | Versioned plans with status tracking |
| 12 | Prototyping | Phase tracking: Esquisse → Patronage → Coupe → QC |
| 13 | Collection Finishing | Piece-by-piece progress tracking |
| 14 | Internal Forum | Posts, comments, likes, real-time notifications |

---

## Task Families & Types

### 3D & Digital
- Création modèle 3D CLO3D depuis fichier DXF
- Création modèle 3D CLO3D from scratch
- Scan tissu 3D
- Création animation 3D Unreal Engine
- Création animation 3D IA

### Visual & Creative
- Shooting StyleShoot
- Photographie Studio
- Création concept graphique
- Création image IA
- Création Mood Board
- Recherche tendance

### Product & Fabrication
- Création fiche technique produit IA
- Lancement proto physique
- Développement broderie
- Développement sérigraphie
- Développement print allover
- Digital print monolayer

### Immersive
- Expérience VR
- Expérience AR

---

## Smart Assignment Engine

Each member is scored on 4 criteria when a task is created:

```
Score = Software skill match  (35%)
      + Domain expertise       (25%)
      + Availability / load    (25%)
      + Similar task history   (15%)
```

The engine accounts for:
- Member absences and national holidays
- Current workload and active tasks
- Task dependencies and priorities

Result: top 3 recommended members with a visual score breakdown.

---

## User Roles

| Role | Permissions |
|------|-------------|
| Manager | Full access — create, assign, validate, configure |
| Member | View own tasks, update status, manage own planning |

---

## Scoring Weights

| Criterion | Weight |
|-----------|--------|
| Software skill level | 35% |
| Domain expertise | 25% |
| Availability & workload | 25% |
| Task history & success rate | 15% |

---

## Planning Rules

- Working hours: 08:00 → 18:00
- Slot size: 30 minutes
- Max capacity: 8h / day / member
- Public holidays: automatically blocked
- Member absences: automatically blocked
- Overload alert: triggered if > 8h scheduled

---

## Dependency Chain Example

```
Recherche tendance        (must finish FIRST)
        ↓
Création Mood Board       (depends on research)
        ↓
Concept graphique         (depends on mood board)
        ↓
Modèle 3D CLO3D          (depends on concept)
        ↓
Lancement proto physique  (depends on 3D model)
        ↓
Finissage collection      (depends on proto)
```

If any task is delayed, the entire chain is recalculated and the manager is alerted.

---

## Alert Types

| Alert | Trigger |
|-------|---------|
| OVERLOAD | Member scheduled > 8h/day |
| MISSING_SKILL | No qualified member for a pending task |
| CRITICAL_DEADLINE | High priority task due within 48h |
| BOTTLENECK | 3+ unassigned tasks of same type |
| LEAVE_CONFLICT | Member on leave has task due during absence |
| CASCADE_DELAY | Overdue task is blocking downstream tasks |

---

## Prototype Phases

```
ESQUISSE → PATRONAGE → COUPE → ASSEMBLAGE → LAVAGE → QC
```

---

## Environment Variables

```env
DATABASE_URL="postgresql://denim_user:denim_pass@postgres:5432/denim_house"
REDIS_URL="redis://redis:6379"
JWT_SECRET="your_super_secret_key_change_this"
PORT=4000
NODE_ENV=development
```

---

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/your-org/denim-house.git
cd denim-house

# 2. Start Docker services
docker-compose up -d

# 3. Install backend dependencies
cd backend
npm install

# 4. Run Prisma migrations
npx prisma migrate dev --name init

# 5. Generate Prisma client
npx prisma generate

# 6. Start the backend
npm run dev
```

---

## API Overview

| Domain | Base Route |
|--------|------------|
| Auth | `/api/auth` |
| Users | `/api/users` |
| Tasks | `/api/tasks` |
| Scoring | `/api/scoring` |
| Planning | `/api/planning` |
| Absences | `/api/absences` |
| Holidays | `/api/holidays` |
| Alerts | `/api/alerts` |
| Notifications | `/api/notifications` |
| Forum | `/api/forum` |
| Mood Boards | `/api/moodboards` |
| Prototypes | `/api/prototypes` |

---

## Real-time Events (Socket.io)

| Event | Trigger |
|-------|---------|
| `task:assigned` | Task assigned to a member |
| `task:status` | Task status updated |
| `alert:new` | New alert detected |
| `notification:new` | New notification created |
| `planning:updated` | Planning block added or moved |
| `forum:post` | New forum post created |
| `forum:comment` | New comment added |

---

## License

Private — Denim House Internal Use Only