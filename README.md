# FixConnect - Frontend

<div align="center">

**Community-Driven Platform Frontend - Connecting Citizens with Professional Service Providers**

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0+-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.0+-cyan.svg)](https://tailwindcss.com/)


</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Screenshots](#screenshots)
- [API Integration](#api-integration)
- [Contributing](#contributing)
- [Future Enhancements](#futureenhancements)

---

## 🎯 About

This is the **frontend application** for FixConnect, built with **React 19**, **TypeScript**, and **Vite**. The application provides an intuitive and responsive interface for users to report local infrastructure issues and for professionals to find and resolve them.

**Backend Repository:** [[FixConnect Backend](https://github.com/Aswan-A/fixconnect-backend)](https://github.com/Aswan-A/FixConnect_Server)

---

## ✨ Features

### User Experience
- 📱 **Fully Responsive** - Mobile-first design using Tailwind CSS
- 🗺️ **Interactive Maps** - Geolocation-based issue discovery
- 📸 **Image Upload** - Multiple image support with preview
- 🎠 **Image Carousel** - Elegant issue photo viewing
- ⚡ **Fast Loading** - Optimized with Vite and code splitting

### Authentication
- 🔐 **Secure Login/Signup** - JWT-based authentication
- 🔄 **Token Refresh** - Automatic token renewal
- 👤 **Profile Management** - Upload and edit profile pictures
- 🚪 **Protected Routes** - Secure access control

### Issue Management
- ➕ **Create Issues** - Report problems with images and location
- 📍 **Nearby Issues** - View issues within configurable radius
- 🔍 **Issue Details** - Comprehensive issue information view
- 📊 **Status Tracking** - Real-time status updates (open, in progress, resolved)
- 🏷️ **Categorization** - Filter by Electronics, Electrical, Plumbing, Other

### Professional Features
- 👷 **Professional Dashboard** - Manage service requests
- 📜 **Certificate Upload** - Verify professional credentials
- 💼 **Request Management** - Submit and track service proposals
- ⭐ **Profile Showcase** - Display skills and experience

---

## 🛠️ Tech Stack

### Core Technologies
- **React 19** - Latest React with concurrent features
- **TypeScript** - Type-safe development
- **Vite** - Next-generation frontend tooling
- **React Router v7** - File-based routing

### UI & Styling
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality React components
- **Lucide React** - Beautiful icon library
- **CSS Variables** - Dynamic theming support

### State & Data Management
- **React Hooks** - useState, useEffect, useContext
- **Context API** - Global state management
- **Fetch API** - HTTP requests to backend

### Development Tools
- **ESLint** - Code linting
- **TypeScript Compiler** - Type checking
- **Vite Dev Server** - Hot module replacement

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **pnpm** (v8 or higher) or npm/yarn
- **Git**
- **Backend API** running (see backend repository)

---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/Aswan-A/FixConnect.git
cd fixconnect-frontend
```

### 2. Install Dependencies

```bash
pnpm install
```

Or using npm:
```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000
VITE_DEFAULT_RADIUS=10
```

### 4. Start Development Server

```bash
pnpm dev
```

The application will be available at `http://localhost:5173`

---

## 📸 Screenshots

### Login Page with Theme Support
![Login](https://github.com/user-attachments/assets/596977f2-cc25-43d3-8290-1f0c5f025521)

### Signup with Profile Picture Upload
![Signup](https://github.com/user-attachments/assets/6d28a719-8e49-49f5-9e4c-a95eccbd5cad)

### Home Dashboard - Nearby Issues
![Dashboard](https://github.com/user-attachments/assets/fe7243d0-9634-463d-9671-9e80d04461af)

### Create Issue Form
![Create Issue](https://github.com/user-attachments/assets/5cbaf104-ab55-47a0-b417-35a43c0af6c0)

### Issue Details with Image Carousel
![Issue Details](https://github.com/user-attachments/assets/0363d90e-fef7-4b8b-b996-9d5496d39d2e)

### User Profile Management
![Profile](https://github.com/user-attachments/assets/15fcda65-45e6-478e-8afd-54a51f5a4985)

### Professional Requests View
![Requests](https://github.com/user-attachments/assets/beebb6d4-b103-4e52-b69c-0fd8190cd49a)


---

## 🔌 API Integration

### Authentication APIs

```typescript
// Login
POST /api/auth/login
Body: { email, password }
Response: { user, tokens: { accessToken, refreshToken } }

// Register
POST /api/auth/register
Body: FormData { name, email, password, phoneNumber, isPro, profilePic }
Response: { user, tokens }

// Refresh Token
POST /api/auth/refresh-token
Body: { refreshToken }
Response: { accessToken }
```

### Issue APIs

```typescript
// Get nearby issues
GET /api/issues?latitude={lat}&longitude={lng}&radius={km}
Headers: { Authorization: 'Bearer {token}' }
Response: Issue[]

// Create issue
POST /api/issues
Headers: { Authorization: 'Bearer {token}' }
Body: FormData { title, description, category, latitude, longitude, budget, images }
Response: Issue

// Get issue details
GET /api/issues/:issueId
Headers: { Authorization: 'Bearer {token}' }
Response: Issue
```

### Request APIs

```typescript
// Submit service request
POST /api/requests
Headers: { Authorization: 'Bearer {token}' }
Body: { issueId, message }
Response: Request

// Get requests for issue
GET /api/requests/issue/:issueId
Headers: { Authorization: 'Bearer {token}' }
Response: Request[]
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for all components
- Follow the existing component structure
- Use Tailwind CSS for styling
- Add proper type definitions
- Write meaningful commit messages
- Test responsive design on multiple devices

---


## 🌱 Future Enhancements

- [ ] Progressive Web App (PWA) support
- [ ] Offline mode with service workers
- [ ] Real-time notifications using WebSocket
- [ ] Advanced filtering and search
- [ ] Interactive map with issue markers
- [ ] In-app messaging system
- [ ] Performance optimization with React.lazy
- [ ] Internationalization (i18n) support
- [ ] Accessibility improvements (WCAG 2.1)
- [ ] End-to-end testing with Cypress

---

<div align="center">

**Built with ⚛️ React and ❤️ by Team FixConnect**

⭐ Star this repo if you find it useful!

</div>
