# 🚀 Capt AI -- API Documentation

AI-powered caption generator untuk membuat caption media sosial
berdasarkan gambar, tone, dan platform.

------------------------------------------------------------------------

## 🌐 Base URL

### Local

http://localhost:3000

### Production

https://your-domain.com

------------------------------------------------------------------------

# 🔐 Authentication

Semua endpoint (kecuali `register` & `login`) membutuhkan token JWT.

Gunakan header berikut:

Authorization: Bearer `<access_token>`{=html}

------------------------------------------------------------------------

# 👤 Auth Endpoints

## 1️⃣ Register

**POST** `/register`

### Request Body

``` json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

### Response (201)

``` json
{
  "id": 1,
  "email": "user@mail.com"
}
```

------------------------------------------------------------------------

## 2️⃣ Login

**POST** `/login`

### Request Body

``` json
{
  "email": "user@mail.com",
  "password": "123456"
}
```

### Response (200)

``` json
{
  "access_token": "your_jwt_token_here"
}
```

------------------------------------------------------------------------

# 📝 Caption Endpoints

## 1️⃣ Generate Caption

**POST** `/captions`

### Headers

Authorization: Bearer `<access_token>`{=html}\
Content-Type: multipart/form-data

### Form Data

  Field      Type   Required
  ---------- ------ ----------
  prompt     text   ✅
  tone       text   ✅
  platform   text   ✅
  image      file   ✅

### Response (201)

``` json
{
  "id": 1,
  "prompt": "Pantai indah di sore hari",
  "tone": "friendly",
  "platform": "instagram",
  "imageUrl": "https://ucarecdn.com/xxxx.jpg",
  "caption": "Menutup hari dengan langit jingga dan deburan ombak 🌊✨",
  "userId": 1,
  "createdAt": "2026-02-19T10:00:00.000Z"
}
```

------------------------------------------------------------------------

## 2️⃣ Get All Captions

**GET** `/captions`

### Response (200)

``` json
[
  {
    "id": 1,
    "caption": "Menutup hari dengan langit jingga...",
    "imageUrl": "https://ucarecdn.com/xxxx.jpg"
  }
]
```

------------------------------------------------------------------------

------------------------------------------------------------------------

## 4️⃣ Regenerate Caption

**PUT** `/captions/:id`

### Request Body

``` json
{
  "tone": "formal"
}
```

### Response (200)

``` json
{
  "message": "Caption updated",
  "caption": "Pemandangan senja yang menenangkan dengan gradasi warna yang indah."
}
```

------------------------------------------------------------------------

## 5️⃣ Delete Caption

**DELETE** `/captions/:id`

### Response (200)

``` json
{
  "message": "Caption deleted successfully"
}
```

------------------------------------------------------------------------

# ⚠️ Error Format

``` json
{
  "message": "Error message here"
}
```

------------------------------------------------------------------------

# 🛠 Tech Stack

-   Node.js\
-   Express\
-   Sequelize\
-   PostgreSQL\
-   JWT Authentication\
-   Uploadcare\
-   Google Gemini API
