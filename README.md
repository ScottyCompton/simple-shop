# ✨ Simple Shop

A sleek, modern e-commerce application built with React 19, Redux Toolkit, and Vite, delivering a seamless shopping experience with lightning-fast performance.

![Simple Shop](https://via.placeholder.com/1200x600?text=Simple+Shop)

## 🚀 Features

- **Intuitive UI/UX** - Beautiful, responsive design using Radix UI and TailwindCSS
- **Dynamic Product Catalog** - Browse products by categories with rich imagery
- **Smart Cart Management** - Effortless add-to-cart functionality with real-time updates
- **Secure Checkout Flow** - Multi-step checkout process with form validation
- **User Authentication** - Protected routes and personalized shopping experience
- **Toast Notifications** - Elegant user feedback for all interactions
- **API Integration** - Seamless connection with the companion Simple Shop API

## 🛠️ Tech Stack

- **Frontend**: React 19, Redux Toolkit, React Router 7, TypeScript
- **Styling**: TailwindCSS, Radix UI Components
- **Build Tool**: Vite
- **Form Management**: React Hook Form
- **Testing**: Vitest, React Testing Library
- **API**: Custom Node.js/Express backend (included)

## 🔧 Getting Started

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm (v9.x or higher)

### Frontend Setup (Simple Shop)

1. Clone the repository
2. Navigate to the frontend directory:

```bash
cd simple-shop
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

The app will be available at http://localhost:5173

### Backend Setup (Simple Shop API)

1. Navigate to the API directory:

```bash
cd ../simple-shop-api
```

2. Install dependencies:

```bash
npm install
```

3. Start the API server:

```bash
npm run dev
```

The API will be available at http://localhost:3000

## 📖 Available Scripts

- `npm run dev` / `npm start` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run test` - Run tests
- `npm run lint` - Run linter
- `npm run format` - Format code with Prettier

## 🔐 Environment Variables

Create a `.env` file in the project root with the following variables:

```
VITE_API_URL=http://localhost:3000/api
```

## 🧠 Architecture

The application follows a feature-based architecture with Redux Toolkit for state management and RTK Query for API data fetching. Protected routes ensure secure checkout experiences, while the responsive design ensures compatibility across all devices.

## 👨‍💻 Created By

Scotty Compton ([@ScottyCompton](https://github.com/ScottyCompton))

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
