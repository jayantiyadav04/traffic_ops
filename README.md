# Traffic-Ops

Traffic-Ops is a modern traffic violation management system built with the MERN stack (MongoDB, Express, React, Node.js). It streamlines the process of issuing, viewing, and resolving traffic fines.

## 🚀 Features

- **Role-Based Access Control**:
  - **Admin/Officer**: Issue violations, generate payment links/QR, **manually mark violations as paid**.
  - **Citizen**: View personal violations and pay fines via QR code (mock UPI).
- **Violation Management**: Log violations with vehicle number, owner details, type, and area.
- **Payment Integration**:
  - **QR Code Payments**: Generates a UPI QR code for instant scan & pay.
  - **Manual Override**: Officers can manually mark fines as paid if cash/other methods are used.
- **Responsive UI**: Built with React, Tailwind CSS, and Framer Motion for a smooth experience across devices.

## 🛠️ Tech Stack

**Frontend:**
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **State Management**: Context API
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **HTTP Client**: Axios

**Backend:**
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose ORM)
- **Authentication**: JWT & BCrypt

## 📂 Project Structure

```text
├── 📁 client
│   ├── 📁 public
│   │   └── 🖼️ vite.svg
│   ├── 📁 src
│   │   ├── 📁 api
│   │   │   └── 📄 axios.js
│   │   ├── 📁 assets
│   │   │   └── 🖼️ react.svg
│   │   ├── 📁 auth
│   │   │   └── 📄 AuthContext.jsx
│   │   ├── 📁 components
│   │   │   ├── 📁 Layout
│   │   │   │   ├── 📄 MainLayout.jsx
│   │   │   │   └── 📄 Sidebar.jsx
│   │   │   └── 📄 Navbar.jsx
│   │   ├── 📁 pages
│   │   │   ├── 📄 Analytics.jsx
│   │   │   ├── 📄 Dashboard.jsx
│   │   │   ├── 📄 Login.jsx
│   │   │   ├── 📄 RegisterViolation.jsx
│   │   │   └── 📄 ViewViolations.jsx
│   │   ├── 📁 routes
│   │   │   └── 📄 ProtectedRoute.jsx
│   │   ├── 🎨 App.css
│   │   ├── 📄 App.jsx
│   │   ├── 🎨 index.css
│   │   └── 📄 main.jsx
│   ├── ⚙️ .gitignore
│   ├── 📄 eslint.config.js
│   ├── 🌐 index.html
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 postcss.config.js
│   ├── 📄 tailwind.config.js
│   └── 📄 vite.config.js
├── 📁 server
│   ├── 📁 api
│   │   └── 📄 index.js
│   ├── 📁 src
│   │   ├── 📁 config
│   │   │   └── 📄 db.js
│   │   ├── 📁 controllers
│   │   │   ├── 📄 analyticsController.js
│   │   │   ├── 📄 authController.js
│   │   │   └── 📄 violationController.js
│   │   ├── 📁 middleware
│   │   │   ├── 📄 authMiddleware.js
│   │   │   └── 📄 roleMiddleware.js
│   │   ├── 📁 models
│   │   │   ├── 📄 Area.js
│   │   │   ├── 📄 User.js
│   │   │   ├── 📄 Violation.js
│   │   │   └── 📄 ViolationType.js
│   │   ├── 📁 routes
│   │   │   ├── 📄 analyticsRoutes.js
│   │   │   ├── 📄 authRoutes.js
│   │   │   └── 📄 violationRoutes.js
│   │   └── 📄 app.js
│   ├── ⚙️ package-lock.json
│   ├── ⚙️ package.json
│   ├── 📄 seed.js
│   └── 📄 server.js
├── ⚙️ .gitignore
├── 📄 check_requirements.js
├── ⚙️ package-lock.json
├── ⚙️ package.json
└── ⚙️ vercel.json
```

## ⚙️ Installation & Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/traffic-ops.git
    cd traffic-ops
    ```

2.  **Install Dependencies:**
    Run this single command to install dependencies for both root, client, and server:
    ```bash
    npm run install-all
    ```
    *(Or manually run `npm install` in root, client, and server folders)*

3.  **Environment Configuration:**
    Create a `.env` file in the `server` directory with the following keys:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    ```
    *Note: You may also need a `.env` in `client` if you have specific frontend variables, but defaults should work.*

4.  **Run the Application:**
    Start both the backend server and frontend client with one command:
    ```bash
    npm run dev
    ```
    - Server: [http://localhost:5000](http://localhost:5000)
    - Client: [http://localhost:5173](http://localhost:5173)

5. **🔐 Login Credentials**

   #### 👨‍💼 Admin
   - **Email:** admin@traffic.com
   - **Password:** AdminPassword!23

   #### 👮 Officer
   - **Email:** officer@traffic.com
   - **Password:** OfficerSecure#45

   #### 🧑‍🤝‍🧑 Citizen
   - **Email:** citizen@traffic.com
   - **Password:** CitizenSafe$78

## 📦 Deployment (Vercel)

This project is optimized for Vercel deployment.

1.  Push to GitHub.
2.  Import project in Vercel.
3.  Set Root Directory to `.` (Current Root).
4.  Add Environment Variables (`MONGO_URI`, `JWT_SECRET`, etc.) in Vercel settings.
5.  Deploy!


