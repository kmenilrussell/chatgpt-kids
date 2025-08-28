

# 🚀 Welcome to ChatGPT Kids

ChatGPT Kids is a safe, fun, and educational chat application designed to empower children and families. Built on a modern web stack, it leverages the robustness of the Z.ai Code Scaffold while adding family‑friendly features like parental controls, age‑appropriate personas, and content filtering.

## ✨ Technology Stack

This project provides a solid foundation built with:

### 🎯 Core Framework

* ⚡ **Next.js 15** – Production‑ready React framework with App Router
* 📘 **TypeScript 5** – Type‑safe JavaScript for a better developer experience
* 🎨 **Tailwind CSS 4** – Utility‑first CSS framework for rapid UI development

### 🧩 UI Components & Styling

* 🧩 **shadcn/ui** – High‑quality, accessible components built on Radix UI
* 🎯 **Lucide React** – Beautiful, consistent icon library
* 🌈 **Framer Motion** – Production‑ready motion library for React
* 🎨 **Next Themes** – Perfect dark mode in two lines of code

### 📋 Forms & Validation

* 🎣 **React Hook Form** – High‑performance forms with easy validation
* ✅ **Zod** – Type‑first schema validation for data integrity

### 🔄 State Management & Data Fetching

* 🐻 **Zustand** – Simple, scalable state management
* 🔄 **TanStack Query** – Powerful data synchronization for React
* 🌐 **Axios** – Promise‑based HTTP client

### 🗄️ Database & Backend

* 🗄️ **Prisma** – Next‑generation Node.js and TypeScript ORM
* 🔐 **NextAuth.js** – Complete open‑source authentication solution

### 🎨 Advanced UI Features

* 📊 **TanStack Table** – Headless UI for building tables and datagrids
* 🖱️ **DND Kit** – Modern drag‑and‑drop toolkit for React
* 📊 **Recharts** – Redefined chart library built with React and D3
* 🖼️ **Sharp** – High‑performance image processing

### 🌍 Internationalization & Utilities

* 🌍 **Next Intl** – Internationalization library for Next.js
* 📅 **Date‑fns** – Modern JavaScript date utility library
* 🪝 **ReactUse** – Collection of essential React hooks for modern development

## 🎯 Why ChatGPT Kids?

ChatGPT Kids isn’t just a scaffold—it’s a child‑friendly AI experience with:

* **🏎️ Fast Development** – Pre‑configured tooling and best practices to get started quickly
* **🎨 Beautiful & Accessible UI** – Complete shadcn/ui component library with intuitive interactions
* **🔒 Safe & Age‑Appropriate Content** – Built‑in content filtering, maturity levels, and crisis detection ensure conversations remain appropriate
* **📱 Responsive** – Mobile‑first design with smooth animations
* **👨‍👩‍👧‍👦 Parental Controls** – Parents can set session limits, block topics, define maturity levels, and view activity logs
* **📊 Data Visualization** – Charts, tables, and drag‑and‑drop functionality out of the box
* **🌍 Multilingual Support** – Multi‑language support via Next Intl
* **🚀 Production Ready** – Optimized build and deployment settings
* **🤖 Safe AI Assistant** – Uses safe AI models to provide educational and creative responses

## 🎨 Kids‑Friendly Features

* **Personas & Modes** – Children can select Study, Creative, or General modes, each with its own friendly persona
* **Quick Ideas** – Pre‑defined prompts like “Help with homework,” “Tell a story,” and “Play a game” to spark conversation
* **Safety Info** – Visible badges remind kids that chats are private, inappropriate topics are blocked, time limits encourage balance, and parents can monitor activity
* **Crisis Detection** – Automatic detection of self‑harm or distress keywords with age‑appropriate guidance
* **Maturity Levels & Blocked Topics** – Parents adjust maturity thresholds and block specific topics through parental controls

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma migrate dev --name init

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Then open `http://localhost:3000` in your browser to see ChatGPT Kids running.

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router pages
├── components/          # Reusable React components
│   └── ui/             # shadcn/ui components
├── hooks/              # Custom React hooks
└── lib/                # Utility functions and configurations
```

## 🎨 Available Features & Components

ChatGPT Kids inherits a comprehensive set of modern web tools:

* **Layout** – Cards, separators, aspect ratios, resizable panels
* **Forms** – Inputs, textareas, selects, checkboxes, radio groups, switches
* **Feedback** – Alerts, toasts (Sonner), progress bars, skeleton loaders
* **Navigation** – Breadcrumbs, menus, pagination
* **Overlays** – Dialogs, sheets, popovers, tooltips, hover cards
* **Data Display** – Badges, avatars, calendars
* **Data Features** – Data tables with sorting/filtering/pagination, charts via Recharts, forms with React Hook Form & Zod
* **Interactive** – Smooth animations with Framer Motion, drag‑and‑drop support via DND Kit, built‑in dark/light mode
* **Backend** – Authentication via NextAuth.js, database via Prisma, API calls with Axios & TanStack Query, state management via Zustand
* **Production** – Multi‑language support with Next Intl, image optimization with Sharp, robust type safety

## 💡 Get Started

1. **Clone the repository** to kick‑start your project.
2. **Install dependencies and set up the database** using the commands above.
3. **Configure environment variables** in a `.env` file (e.g., database connection and API keys).
4. **Run in development** with `npm run dev`, or build and start for production.
5. **Explore** the codebase, customize the UI, and add your own features.

ChatGPT Kids empowers developers to create a safe, educational, and fun environment for children, combining robust engineering with thoughtful design. Built with ❤️ for families and educators—ready to create the future of safe AI interaction? Let’s get started! 🚀
