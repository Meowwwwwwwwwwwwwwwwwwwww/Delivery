# 🌙 Midnight Munch  

A late-night food delivery platform built with **React (Frontend)** and **Django (Backend)**.  
It features an interactive menu, cart system, flash sales, mystery snacks, confession wall, and WhatsApp-based checkout.  

---

## 🚀 Features  

### Frontend (React + TailwindCSS)  
- **Dynamic Menu System** with Context API.  
- **Admin Dashboard** (`/dashboard/add-item`) to add menu items.  
- **Interactive Cart** with auto subtotal/total.  
- **Mystery Snack Add-on**.  
- **Checkout via WhatsApp** with auto-generated text.  
- **Confession Wall (Anonymous, local storage)**.  
- **Night Owl Pass Membership system (UI only)**.  
- **Dark/Light Mode Toggle**.  

### Backend (Django + Django REST Framework)  
- **Menu API** → CRUD for categories & items.  
- **Cart API** → Store cart server-side (optional).  
- **Confessions API** → Save & fetch confessions.  
- **Orders API** → Store customer orders (instead of WhatsApp only).  
- **Admin Panel** → Full control over menu, orders, and confessions.  

---

## 🛠️ Tech Stack  

- **Frontend:** React, React Router, TailwindCSS, Context API  
- **Backend:** Django, Django REST Framework (DRF)  
- **Database:** SQLite (dev) / PostgreSQL (prod)  
- **Icons:** Lucide React  
- **API Communication:** Axios / Fetch API  

---

## 📂 Project Structure  

```
midnight-munch/
│── backend/                  # Django project
│   ├── manage.py
│   ├── midnight_munch/       # Main Django project settings
│   ├── menu/                 # Django app (menu items, categories)
│   ├── orders/               # Django app (cart & orders)
│   ├── confessions/          # Django app (confession wall)
│
│── frontend/                 # React project
│   ├── src/
│   │   ├── App.jsx
│   │   ├── AddMenuItem.jsx
│   │   ├── MenuContext.jsx
│   │   ├── MidnightMunch.jsx
│   │   ├── main.jsx
│   │   ├── index.css
│   ├── package.json
│
│── README.md
```

---

## ⚡ Setup Instructions  

### 1️⃣ Backend (Django)  

1. **Go to backend folder & create virtual env:**  
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate   # (Mac/Linux)
   venv\Scripts\activate      # (Windows)
   ```

2. **Install dependencies:**  
   ```bash
   pip install django djangorestframework psycopg2-binary
   ```

3. **Start Django project & apps (already structured as above):**  
   ```bash
   django-admin startproject midnight_munch .
   python manage.py startapp menu
   python manage.py startapp orders
   python manage.py startapp confessions
   ```

4. **Apply migrations & run server:**  
   ```bash
   python manage.py migrate
   python manage.py runserver
   ```

5. **APIs will be available at:**  
   - `/api/menu/` → Menu items/categories  
   - `/api/orders/` → Orders & cart  
   - `/api/confessions/` → Confession wall  

---

### 2️⃣ Frontend (React)  

1. **Go to frontend folder:**  
   ```bash
   cd frontend
   ```

2. **Install dependencies:**  
   ```bash
   npm install
   ```

3. **Run dev server:**  
   ```bash
   npm run dev
   ```

4. **Frontend available at:**  
   ```
   http://localhost:5173
   ```

---

### 3️⃣ Connect Frontend & Backend  

- Update API calls in React (`axios` or `fetch`) to point to Django backend (`http://localhost:8000/api/...`).  
- Example for fetching menu:  

```js
import axios from "axios";
useEffect(() => {
  axios.get("http://localhost:8000/api/menu/")
    .then(res => setMenu(res.data))
    .catch(err => console.error(err));
}, []);
```

---

## 🔮 Future Enhancements  

- Replace **WhatsApp checkout** with **real order placement API**.  
- Add **JWT authentication** for users/admin.  
- Add **Payments Integration** (Razorpay/Stripe).  
- Deploy on **Heroku (backend)** + **Vercel/Netlify (frontend)**.  

---

## 👨‍💻 Author  

Developed by **Pawan Garia** 🚀  
