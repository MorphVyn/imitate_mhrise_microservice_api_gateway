## Monster Hunter Rise: Sunbreak

**Praktikum 7 — Membangun API Gateway Lintas-Bahasa (Node.js + PHP Laravel)**

## Identitas

Nama  : Ricky Satria Atmaja
NIM : 2410511070
Kelas : B

## Deskripsi Layanan

Proyek ini membangun sebuah API Gateway bertema game *Monster Hunter Rise: Sunbreak* yang menghubungkan dua microservice berbeda bahasa:

Port  : 3060
Komponen  : API Gateway
Teknologi : Node.js + Express + http-proxy-middleware
Tema  : Kamura Hub

Port  : 3061
Komponen  : Service 1 — Guild Service
Teknologi : Node.js + Express + MongoDB
Tema  : Data Hunter & Guild

Port  : 3063
Komponen  : Service 2 — Quest Board
Teknologi : PHP + Laravel 12 + MongoDB
Tema  : Papan Quest

Alur request: Semua request dari client wajib melalui Gateway (port 3060). Gateway memverifikasi token JWT sebelum meneruskan request ke service yang tepat.

---

## Arsitektur

```
CLIENT
  │
  ▼  
┌─────────────────────────────┐
│   API GATEWAY  :3060        │
│   JWT Verification          │
└───┬─────────────┬───────────┘
    │             │
    ▼             ▼
┌──────────┐  ┌──────────────┐
│ SERVICE1 │  │  SERVICE2    │
│  :3061   │  │   :3062      │
│ Node.js  │  │   Laravel    │
│ MongoDB  │  │   MongoDB    │
│          │  │              │
│ • Auth   │  │ • Quests     │
│ • Hunter │  │   CRUD       │
│ • Guild  │  │              │
└──────────┘  └──────────────┘
```

---

## Autentikasi (JWT)

### Login — Dapatkan Token

```
POST http://localhost:3060/api/auth/login
Content-Type: application/json

{
  "username": "fugen",
  "password": "password123"
}
```

**Response berhasil:**
```json
{
  "status": "success",
  "message": "Welcome back, Fugen! Your hunter license is active.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "hunter": {
    "id": "...",
    "name": "Fugen",
    "rank": 100,
    "weapon": "Long Sword"
  }
}
```

**Gunakan token di header setiap request:**
```
Authorization: Bearer <token_dari_login>
```

### Logout

```
POST http://localhost:3060/api/auth/logout
Authorization: Bearer <token>
```

### Info Hunter yang Login

```
GET http://localhost:3060/api/auth/me
Authorization: Bearer <token>
```

---

## Daftar Endpoint Lengkap

> Semua endpoint diakses melalui **Gateway port 3060**. TRUE = butuh token JWT.

### Service 1 — Guild Service

#### Auth
| Method | URL (via Gateway) | Auth | Deskripsi |
|--------|-------------------|------|-----------|
| `POST` | `/api/auth/login` | FALSE | Login, dapat JWT token |
| `POST` | `/api/auth/logout` | TRUE | Logout |
| `GET` | `/api/auth/me` | TRUE | Info hunter yang sedang login |

#### Hunters
| Method | URL (via Gateway) | Auth | Deskripsi |
|--------|-------------------|------|-----------|
| `GET` | `/api/guild/hunters` | TRUE | Daftar semua hunter |
| `GET` | `/api/guild/hunters/:id` | TRUE | Detail hunter by ID |
| `POST` | `/api/guild/hunters` | TRUE | Daftarkan hunter baru |
| `PUT` | `/api/guild/hunters/:id` | TRUE | Update data hunter |
| `DELETE` | `/api/guild/hunters/:id` | TRUE | Hapus hunter dari guild |

**Body POST/PUT hunters:**
```json
{
  "name": "Nargacuga",
  "weapon": "Long Sword",
  "rank": 3,
  "element": "None",
  "status": "Active",
  "guild_id": null
}
```

#### Guilds
| Method | URL (via Gateway) | Auth | Deskripsi |
|--------|-------------------|------|-----------|
| `GET` | `/api/guild/guilds` | TRUE | Daftar semua guild |
| `GET` | `/api/guild/guilds/:id` | TRUE | Detail guild + list anggota |
| `POST` | `/api/guild/guilds` | TRUE | Buat guild baru |
| `PUT` | `/api/guild/guilds/:id` | TRUE | Update data guild |
| `DELETE` | `/api/guild/guilds/:id` | TRUE | Bubarkan guild |

**Body POST/PUT guilds:**
```json
{
  "name": "Lagombi Squad",
  "rank": "B",
  "leader": "Fugen",
  "specialty": "Snow Hunting",
  "description": "Hunters specializing in snowy areas."
}
```

### Service 2 — Quest Board

#### Quests
| Method | URL (via Gateway) | Auth | Deskripsi |
|--------|-------------------|------|-----------|
| `GET` | `/api/quest/quests` | TRUE | Daftar semua quest |
| `GET` | `/api/quest/quests/:id` | TRUE | Detail quest by ID |
| `POST` | `/api/quest/quests` | TRUE | Posting quest baru |
| `PUT` | `/api/quest/quests/:id` | TRUE | Update quest |
| `DELETE` | `/api/quest/quests/:id` | TRUE | Hapus quest dari board |

**Body POST/PUT quests:**
```json
{
  "quest_name": "Hunt a Nargacuga",
  "target_monster": "Nargacuga",
  "location": "Jungle",
  "reward_zenny": 9500,
  "status": "open"
}
```

**Status values:** `open` | `in_progress` | `completed`

---

## Cara Menjalankan

### Prasyarat
- Node.js >= 18
- PHP >= 8.2
- Composer
- MongoDB (running di localhost:27017)

### Step 1 — Service 1: Guild Service (port 3061)

```bash
cd service1

# Install dependencies
npm install

# Jalankan (data MongoDB otomatis di-seed saat pertama kali)
node server.js
```

### Step 2 — Service 2: Quest Board / Laravel (port 3062)

```bash
cd service2

# Install PHP dependencies
composer install

# Setup environment
php artisan key:generate   # (jika APP_KEY belum ada)

# Seed data quest ke MongoDB
php artisan db:seed --class=QuestSeeder

# Jalankan Laravel
php artisan serve --port=3062
```

### Step 3 — Gateway (port 3060)

```bash
# Di folder ROOT (P7/)
npm install
node server.js
```

### Urutan Terminal (buka 3 terminal)
```bash
# Terminal 1 — Service 1
cd service1 && node server.js

# Terminal 2 — Service 2
cd service2 && php artisan serve --port=3062

# Terminal 3 — Gateway (tunggu service1 & service2 ready dulu)
node server.js
```

---

## Data Dummy (Auto-seed)

### Akun Login (Service 1 — MongoDB)

| Username | Password | Nama | Rank | Weapon |
|----------|----------|------|------|--------|
| `fugen` | `password123` | Fugen | 100 | Long Sword |
| `hinoa` | `password123` | Hinoa | 5 | Dual Blades |
| `minoto` | `password123` | Minoto | 5 | Long Sword |
| `kagero` | `password123` | Kagero | 10 | Hunting Horn |
| `utsushi` | `password123` | Utsushi | 15 | Switch Axe |
| `rondine` | `password123` | Rondine | 20 | Gunlance |
| `bahari` | `password123` | Bahari | 3 | Heavy Bowgun |
| `iori` | `password123` | Iori | 7 | Insect Glaive |
| `yomogi` | `password123` | Yomogi | 8 | Long Sword |
| `senri` | `password123` | Senri | 12 | Light Bowgun |

### Data Hunter (10 record) — MongoDB collection: `hunters`
Fugen, Hinoa, Minoto, Kagero, Utsushi, Rondine, Bahari, Iori, Yomogi, Senri

### Data Guild (10 record) — MongoDB collection: `guilds`
Kamura Hunters Guild (S), Elgado Outpost Guild (A), Sunbreak Vanguard (S), Azure Dragon Order (A), Red Lotus Blade (S), Iron Claw Coalition (B), Silver Wing Alliance (A), Crimson Howl Pack (A), Fated Four Hunters (S), Narwa Apex Squad (B)

### Data Quest (10 record) — MongoDB collection: `quests`
Slay Magnamalo, Fungal Frustrations, Apex Zinogre, Goss Harag, Hunt Malzeno, Lunagaron, Aurora Somnacanth, Magma Almudron, Scorned Magnamalo, Gaismagorm

---

## Contoh Pengujian di Postman

### 1. Login (tanpa token)
```
POST http://localhost:3060/api/auth/login
Body → raw → JSON:
{ "username": "fugen", "password": "password123" }
```
Salin nilai `token` dari response.

### 2. Set Token di Postman
- Tab **Authorization** → Type: **Bearer Token**
- Paste token ke field Token

### 3. Get All Hunters
```
GET http://localhost:3060/api/guild/hunters
Authorization: Bearer <token>
```

### 4. Get All Guilds
```
GET http://localhost:3060/api/guild/guilds
Authorization: Bearer <token>
```

### 5. Get All Quests
```
GET http://localhost:3060/api/quest/quests
Authorization: Bearer <token>
```

### 6. Create Hunter
```
POST http://localhost:3060/api/guild/hunters
Authorization: Bearer <token>
Body → raw → JSON:
{
  "name": "Test Hunter",
  "weapon": "Bow",
  "rank": 1,
  "element": "Water",
  "status": "Training"
}
```

### 7. Create Quest
```
POST http://localhost:3060/api/quest/quests
Authorization: Bearer <token>
Body → raw → JSON:
{
  "quest_name": "Hunt a Nargacuga",
  "target_monster": "Nargacuga",
  "location": "Jungle",
  "reward_zenny": 9500
}
```

### 8. Akses tanpa token (harus 401)
```
GET http://localhost:3060/api/guild/hunters
(tanpa Authorization header)
```

### 9. Logout
```
POST http://localhost:3060/api/auth/logout
Authorization: Bearer <token>
```

---

## Struktur Folder

```
P7/
├── server.js              ← API Gateway (port 3060)
├── package.json
├── .env
├── README.md
│
├── service1/              ← Guild Service - Node.js (port 3061)
│   ├── server.js
│   ├── .env
│   ├── config/
│   │   └── db.js          ← Koneksi MongoDB
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js        ← Schema akun login
│   │   ├── Hunter.js      ← Schema hunter
│   │   └── Guild.js       ← Schema guild
│   ├── routes/
│   │   ├── auth.js        ← Login / Logout / Me
│   │   ├── hunters.js     ← CRUD hunters
│   │   └── guilds.js      ← CRUD guilds
│   └── seed/
│       └── seed.js        ← Auto-seed 10 data masing-masing
│
└── service2/              ← Quest Board - Laravel 12 (port 3062)
    ├── app/
    │   ├── Http/
    │   │   ├── Controllers/
    │   │   │   └── QuestController.php   ← CRUD quests
    │   │   └── Middleware/
    │   │       └── JwtMiddleware.php     ← JWT Auth (baru)
    │   └── Models/
    │       └── Quest.php
    ├── routes/
    │   └── api.php        ← Routes dengan JWT middleware
    ├── database/
    │   └── seeders/
    │       └── QuestSeeder.php  ← Seed 10 quest data
    └── .env
```

---

## Preview
![AUTH](Screenshoot/Service1/Auth/get_me.png)
![AUTH](Screenshoot/Service1/Auth/health.png)
![AUTH](Screenshoot/Service1/Auth/post_login.png)
![AUTH](Screenshoot/Service1/Auth/post_logout.png)

![GUILD](Screenshoot/Service1/Guild/post_guilds.png)
![GUILD](Screenshoot/Service1/Guild/get_guilds.png)
![GUILD](Screenshoot/Service1/Guild/get_guilds_id.png)
![GUILD](Screenshoot/Service1/Guild/put_guilds.png)
![GUILD](Screenshoot/Service1/Guild/del_guilds.png)

![HUNTER](Screenshoot/Service1/Hunters/post_hunters.png)
![HUNTER](Screenshoot/Service1/Hunters/get_hunters.png)
![HUNTER](Screenshoot/Service1/Hunters/get_hunters_id.png)
![HUNTER](Screenshoot/Service1/Hunters/put_hunters.png)
![HUNTER](Screenshoot/Service1/Hunters/del_hunters.png)

![QUEST](Screenshoot/Service2/del_quest.png)
![QUEST](Screenshoot/Service2/post_quest.png)
![QUEST](Screenshoot/Service2/get_quest.png)
![QUEST](Screenshoot/Service2/get_quest_id.png)
![QUEST](Screenshoot/Service2/put_quest.png)

![DB](Screenshoot/mdb_quest.png)
![DB](Screenshoot/mdb_hunters.png)
![DB](Screenshoot/mdb_guilds.png)
![DB](Screenshoot/mdb_users.png)