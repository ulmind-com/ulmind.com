// ─────────────────────────────────────────────────────────────────
//  techDetails.ts  — Extended content for every technology detail page
//  Contains: fromScratch step-by-step guides + quick techStats for hero
// ─────────────────────────────────────────────────────────────────

export interface FromScratchStep {
  step: number;
  title: string;
  command?: string;
  description: string;
  isCode?: boolean; // true if command is a code snippet, false if terminal
}

export interface TechDetail {
  techStats: { label: string; value: string }[];
  fromScratch: {
    title: string;
    environment: string;
    steps: FromScratchStep[];
    proTip: string;
  };
}

export const techDetails: Record<string, TechDetail> = {

  // ─────────────────────────────────────────────────────────────
  // WEB FRONTEND
  // ─────────────────────────────────────────────────────────────

  "html5": {
    techStats: [
      { label: "W3C Standard Since", value: "2014" },
      { label: "Browser Support", value: "100%" },
      { label: "Elements", value: "110+" },
      { label: "APIs Built-in", value: "50+" },
    ],
    fromScratch: {
      title: "Building an HTML5 Page from Scratch",
      environment: "Any modern browser and a code editor (VS Code recommended)",
      steps: [
        {
          step: 1,
          title: "Create Your Project Folder",
          command: "mkdir my-website && cd my-website",
          description: "Create a project directory. No build tools needed — HTML5 runs natively in every browser.",
        },
        {
          step: 2,
          title: "Create `index.html` with the Boilerplate",
          command: `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My App</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <header>
      <nav><a href="/">Home</a></nav>
    </header>
    <main>
      <h1>Hello, World!</h1>
    </main>
    <footer>© 2025 My App</footer>
    <script src="script.js"></script>
  </body>
</html>`,
          description: "Use semantic elements: header, main, nav, footer, article, section instead of generic divs for SEO and accessibility.",
          isCode: true,
        },
        {
          step: 3,
          title: "Add Semantic Content Structure",
          command: `<article>
  <h2>Blog Post Title</h2>
  <time datetime="2025-01-01">January 1, 2025</time>
  <p>Your content here...</p>
</article>`,
          description: "Semantic elements tell browsers and search engines what your content means. Google rewards semantic HTML with better rankings.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use HTML5 Form Validation",
          command: `<form>
  <input type="email" placeholder="Email" required />
  <input type="tel" pattern="[0-9]{10}" />
  <input type="number" min="1" max="100" />
  <button type="submit">Submit</button>
</form>`,
          description: "HTML5 forms have built-in validation — no JavaScript needed for basic checks like required, email format, and number ranges.",
          isCode: true,
        },
        {
          step: 5,
          title: "Open in Browser & Validate",
          command: "open index.html",
          description: "Open your file directly in a browser. For validation, visit validator.w3.org to ensure your HTML is error-free.",
        },
      ],
      proTip: "At ULMiND, we always write HTML with accessibility (ARIA roles, alt text, tab order) built in from day one — it costs nothing upfront but saves massive refactoring later. Run Lighthouse in Chrome DevTools to audit accessibility before shipping.",
    },
  },

  "css3": {
    techStats: [
      { label: "Specification Level", value: "CSS3" },
      { label: "Browser Support", value: "99.5%" },
      { label: "Features Added", value: "200+" },
      { label: "Properties Total", value: "500+" },
    ],
    fromScratch: {
      title: "Setting Up CSS3 from Scratch",
      environment: "A code editor with a live server extension (VS Code + Live Server)",
      steps: [
        {
          step: 1,
          title: "Create and Link Your CSS File",
          command: `<!-- In your HTML <head> -->
<link rel="stylesheet" href="styles.css" />`,
          description: "Create styles.css in your project root and link it in your HTML. Keep CSS in a separate file — never use inline styles for maintainability.",
          isCode: true,
        },
        {
          step: 2,
          title: "Set Up Your Design System with Variables",
          command: `:root {
  /* Colors */
  --color-primary: #6366f1;
  --color-bg: #0f0f13;
  --color-text: #f8fafc;

  /* Spacing */
  --space-sm: 0.5rem;
  --space-md: 1rem;
  --space-lg: 2rem;

  /* Typography */
  --font-heading: 'Inter', sans-serif;
  --radius-card: 16px;
}`,
          description: "CSS Custom Properties (variables) are your design system. Define them in :root once and reuse everywhere — changing a theme is as simple as updating one value.",
          isCode: true,
        },
        {
          step: 3,
          title: "Build Layouts with Grid and Flexbox",
          command: `/* Flexbox for components */
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-md);
}

/* Grid for page layouts */
.grid-layout {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-lg);
}`,
          description: "Use Flexbox for one-dimensional component layouts (nav, card row) and CSS Grid for two-dimensional page layouts. Never use float or table for layout.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Animations and Micro-interactions",
          command: `@keyframes fadeUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  animation: fadeUp 0.4s ease forwards;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.15);
}`,
          description: "Always animate only transform and opacity for 60fps performance — these properties are GPU-accelerated and never trigger layout repaints.",
          isCode: true,
        },
        {
          step: 5,
          title: "Add Responsive Design with Media Queries",
          command: `/* Mobile first — base styles are for mobile */
.hero-title { font-size: 2rem; }

/* Tablet */
@media (min-width: 768px) {
  .hero-title { font-size: 3rem; }
}

/* Desktop */
@media (min-width: 1024px) {
  .hero-title { font-size: 4.5rem; }
}`,
          description: "Write mobile-first CSS — start with mobile styles and use min-width media queries to scale up. This produces cleaner CSS than desktop-down approaches.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we always animate using transform and opacity only (GPU-accelerated), use CSS Custom Properties for theming, and follow BEM naming conventions (.block__element--modifier) to keep styles maintainable across large projects.",
    },
  },

  "javascript": {
    techStats: [
      { label: "Created", value: "1995" },
      { label: "npm Packages", value: "2M+" },
      { label: "GitHub Repos", value: "10M+" },
      { label: "Runs On", value: "Every Browser" },
    ],
    fromScratch: {
      title: "Writing JavaScript from Scratch",
      environment: "Any modern browser (Chrome DevTools) or Node.js installed",
      steps: [
        {
          step: 1,
          title: "Link JS to your HTML or Use Node",
          command: `<!-- Browser: link at end of <body> -->
<script src="script.js"></script>

<!-- Or run directly with Node -->
node script.js`,
          description: "JavaScript runs natively in every browser — no compile step required. You can also run it server-side with Node.js.",
          isCode: true,
        },
        {
          step: 2,
          title: "Use Modern ES6+ Syntax",
          command: `// Use const/let — never var
const PI = 3.14;
let count = 0;

// Arrow functions
const greet = (name) => \`Hello, \${name}!\`;

// Destructuring
const { title, author } = book;
const [first, ...rest] = array;

// Optional chaining
const city = user?.address?.city ?? 'Unknown';`,
          description: "Modern JavaScript (ES2015+) is clean and powerful. Use const by default, let for mutable values, and always use template literals over string concatenation.",
          isCode: true,
        },
        {
          step: 3,
          title: "Fetch Data from an API",
          command: `async function getPosts() {
  try {
    const response = await fetch('https://api.example.com/posts');
    
    if (!response.ok) throw new Error('Network error');
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch:', error);
  }
}

const posts = await getPosts();`,
          description: "Always use async/await over callbacks for asynchronous code. Wrap in try/catch to handle network errors gracefully.",
          isCode: true,
        },
        {
          step: 4,
          title: "Manipulate the DOM",
          command: `// Select elements
const button = document.querySelector('#submit-btn');
const list = document.getElementById('item-list');

// Handle events
button.addEventListener('click', (e) => {
  e.preventDefault();
  
  const item = document.createElement('li');
  item.textContent = 'New item';
  list.appendChild(item);
});`,
          description: "Use querySelector/querySelectorAll over older getElementById for consistency. Always use addEventListener — never use onclick HTML attributes.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use Modules for Clean Architecture",
          command: `// api.js — Export
export async function fetchUser(id) {
  const res = await fetch(\`/api/users/\${id}\`);
  return res.json();
}

// main.js — Import
import { fetchUser } from './api.js';

const user = await fetchUser(1);
console.log(user.name);`,
          description: "Split code into ES modules from day one. Each file should have one clear responsibility — API calls, UI rendering, state management etc.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use TypeScript over plain JavaScript for all production code — it's the same language but with types that catch bugs before they reach users. For pure JS scripts, we enforce ESLint with the Airbnb config.",
    },
  },

  "typescript": {
    techStats: [
      { label: "Created by", value: "Microsoft" },
      { label: "First Release", value: "2012" },
      { label: "Weekly Downloads", value: "50M+" },
      { label: "GitHub Stars", value: "100K+" },
    ],
    fromScratch: {
      title: "Setting Up TypeScript from Scratch",
      environment: "Node.js 18+ and npm installed",
      steps: [
        {
          step: 1,
          title: "Install TypeScript Globally",
          command: "npm install -g typescript && tsc --version",
          description: "Install the TypeScript compiler globally. Verify with `tsc --version` — you should see a version number like 5.x.",
        },
        {
          step: 2,
          title: "Initialize a TypeScript Project",
          command: "mkdir my-ts-project && cd my-ts-project && npm init -y && tsc --init",
          description: "tsc --init generates a tsconfig.json with all options. This is the master configuration file for the TypeScript compiler.",
        },
        {
          step: 3,
          title: "Configure tsconfig.json for Strict Mode",
          command: `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src"]
}`,
          description: "Always enable strict: true — it enables the strictest type checking and catches the most bugs. We also enable noUncheckedIndexedAccess to prevent undefined array access.",
          isCode: true,
        },
        {
          step: 4,
          title: "Write Type-Safe Code",
          command: `// Define interfaces for your data
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user'; // Union types
}

// Generic functions
async function fetchData<T>(url: string): Promise<T> {
  const res = await fetch(url);
  return res.json() as T;
}

// Usage — fully type-safe
const user = await fetchData<User>('/api/user/1');
console.log(user.name); // Autocomplete works!`,
          description: "Define interfaces for all your data models. Use generics for utility functions. The TypeScript Language Server gives you autocomplete and error detection as you type.",
          isCode: true,
        },
        {
          step: 5,
          title: "Compile and Run",
          command: `# Compile TypeScript to JavaScript
tsc

# Or run directly with ts-node (dev only)
npx ts-node src/index.ts

# For Node.js projects, use tsx for instant compilation
npx tsx src/index.ts`,
          description: "In production compile to JS with tsc. In development, use tsx or ts-node for instant execution without a compilation step.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, all projects start with TypeScript + strict: true from day one. We use Zod for runtime validation of API responses (TypeScript only checks compile-time), ensuring data is safe at runtime too.",
    },
  },

  "react": {
    techStats: [
      { label: "Created by", value: "Meta (Facebook)" },
      { label: "First Release", value: "2013" },
      { label: "Weekly Downloads", value: "20M+" },
      { label: "GitHub Stars", value: "220K+" },
    ],
    fromScratch: {
      title: "Building a React App from Scratch",
      environment: "Node.js 18+ and npm installed",
      steps: [
        {
          step: 1,
          title: "Verify Node.js Installation",
          command: "node -v && npm -v",
          description: "React requires Node.js for its build tooling. Ensure you have Node 18+ installed. Download from nodejs.org if needed.",
        },
        {
          step: 2,
          title: "Scaffold with Vite (We Prefer This Over CRA)",
          command: "npm create vite@latest my-app -- --template react-ts",
          description: "We use Vite over Create React App because Vite starts in under 300ms, has native ESM hot reload, and builds 10x faster. The react-ts template includes TypeScript out of the box.",
        },
        {
          step: 3,
          title: "Install Dependencies and Start Dev Server",
          command: "cd my-app && npm install && npm run dev",
          description: "Your app runs at http://localhost:5173 with Hot Module Replacement — changes appear instantly without refreshing the page.",
        },
        {
          step: 4,
          title: "Create Your First Reusable Component",
          command: `// src/components/Card.tsx
interface CardProps {
  title: string;
  description: string;
  onClick?: () => void;
}

export function Card({ title, description, onClick }: CardProps) {
  return (
    <div className="card" onClick={onClick}>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}`,
          description: "Components are the building blocks of React. Always define TypeScript props interfaces. Use function components — class components are legacy.",
          isCode: true,
        },
        {
          step: 5,
          title: "Add State and Side Effects with Hooks",
          command: `import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      });
  }, []); // [] = run once on mount

  if (loading) return <div>Loading...</div>;
  
  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name}</li>
      ))}
    </ul>
  );
}`,
          description: "useState manages local component state. useEffect handles side effects like API calls, subscriptions, and DOM manipulation. Always provide dependencies array.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our React stack is: Vite + TypeScript + React Query (server state) + Zustand (global state) + Tailwind CSS. We never put server data in useState — React Query handles caching, refetching, and loading states automatically.",
    },
  },

  "nextjs": {
    techStats: [
      { label: "Created by", value: "Vercel" },
      { label: "First Release", value: "2016" },
      { label: "Weekly Downloads", value: "6M+" },
      { label: "GitHub Stars", value: "125K+" },
    ],
    fromScratch: {
      title: "Building a Next.js App from Scratch",
      environment: "Node.js 18+ and npm installed",
      steps: [
        {
          step: 1,
          title: "Create a New Next.js Project",
          command: "npx create-next-app@latest my-app --typescript --tailwind --eslint --app",
          description: "create-next-app scaffolds a complete Next.js project. We always select TypeScript, Tailwind CSS, ESLint, and the App Router (the modern routing system).",
        },
        {
          step: 2,
          title: "Understand the App Router Structure",
          command: `app/
├── layout.tsx        # Root layout (shared UI)
├── page.tsx          # Home page (/)
├── globals.css       # Global styles
├── about/
│   └── page.tsx      # /about route
└── api/
    └── hello/
        └── route.ts  # /api/hello endpoint`,
          description: "The App Router uses file-system routing. Every folder with a page.tsx becomes a route. layout.tsx wraps all pages in that directory.",
          isCode: true,
        },
        {
          step: 3,
          title: "Create a Server Component Page",
          command: `// app/products/page.tsx
// This is a Server Component by default — runs on the server!
async function ProductsPage() {
  // Direct database/API call — no useEffect needed!
  const products = await fetch('https://api.example.com/products', {
    next: { revalidate: 3600 } // Cache for 1 hour
  }).then(r => r.json());

  return (
    <main>
      <h1>Products</h1>
      {products.map(p => (
        <div key={p.id}>{p.name}</div>
      ))}
    </main>
  );
}

export default ProductsPage;`,
          description: "Server Components fetch data directly — no loading states, no useEffect, no API routes needed. Data is rendered on the server for maximum performance and SEO.",
          isCode: true,
        },
        {
          step: 4,
          title: "Create an API Route",
          command: `// app/api/users/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  const users = await db.user.findMany();
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  const body = await request.json();
  const user = await db.user.create({ data: body });
  return NextResponse.json(user, { status: 201 });
}`,
          description: "API routes are defined using route.ts files. Export functions named after HTTP methods (GET, POST, PUT, DELETE). They run on the server — perfect for database operations.",
          isCode: true,
        },
        {
          step: 5,
          title: "Deploy to Production",
          command: `# Install Vercel CLI
npm i -g vercel

# Deploy (auto-detects Next.js)
vercel

# Or connect to GitHub — Vercel auto-deploys on push
# vercel.com → New Project → Import GitHub Repo`,
          description: "Next.js is built by Vercel and deploys perfectly on Vercel's edge network in seconds. Every push to main auto-deploys to production.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use the App Router with React Server Components for all data fetching — zero client-side loading spinners, instant page loads. We use Server Actions for mutations, eliminating the need for separate API routes in most cases.",
    },
  },

  "vuejs": {
    techStats: [
      { label: "Created by", value: "Evan You" },
      { label: "First Release", value: "2014" },
      { label: "GitHub Stars", value: "208K+" },
      { label: "Weekly Downloads", value: "4M+" },
    ],
    fromScratch: {
      title: "Building a Vue.js App from Scratch",
      environment: "Node.js 18+ and npm installed",
      steps: [
        {
          step: 1,
          title: "Create a New Vue Project",
          command: "npm create vue@latest my-vue-app",
          description: "The official Vue scaffolding tool (create-vue) will ask about TypeScript, JSX, Vue Router, Pinia, and testing. We recommend selecting TypeScript + Vue Router + Pinia.",
        },
        {
          step: 2,
          title: "Install and Start",
          command: "cd my-vue-app && npm install && npm run dev",
          description: "Your Vue app runs at http://localhost:5173 (Vite-powered). The dev server supports instant hot module replacement.",
        },
        {
          step: 3,
          title: "Create a Component with Composition API",
          command: `<!-- src/components/UserCard.vue -->
<script setup lang="ts">
// Composition API with <script setup> — the modern way
interface Props {
  name: string
  email: string
}

const props = defineProps<Props>()
const emit = defineEmits<{ click: [id: number] }>()

const displayName = computed(() => props.name.toUpperCase())
</script>

<template>
  <div class="user-card" @click="emit('click', 1)">
    <h2>{{ displayName }}</h2>
    <p>{{ props.email }}</p>
  </div>
</template>

<style scoped>
.user-card { padding: 1rem; border-radius: 8px; }
</style>`,
          description: "Use <script setup> with Composition API — it's more concise than Options API and works perfectly with TypeScript. Styles are scoped by default.",
          isCode: true,
        },
        {
          step: 4,
          title: "Manage Global State with Pinia",
          command: `// stores/user.ts
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useUserStore = defineStore('user', () => {
  const currentUser = ref<User | null>(null)
  
  const isLoggedIn = computed(() => !!currentUser.value)
  
  async function login(email: string, password: string) {
    const user = await authApi.login(email, password)
    currentUser.value = user
  }
  
  return { currentUser, isLoggedIn, login }
})`,
          description: "Pinia is Vue's official state management library — it's simpler than Vuex and has full TypeScript support. Use the Setup Store syntax for Composition API style.",
          isCode: true,
        },
        {
          step: 5,
          title: "Add Vue Router for Navigation",
          command: `// router/index.ts
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', component: () => import('@/views/HomeView.vue') },
    {
      path: '/dashboard',
      component: () => import('@/views/Dashboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Navigation guard
router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return '/login'
  }
})`,
          description: "Vue Router uses dynamic imports for code splitting — each route is loaded only when visited. Navigation guards handle authentication protection.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use Vue 3 with Composition API + <script setup> for maximum readability and TypeScript compatibility. We use Pinia over Vuex for simpler, more intuitive global state management.",
    },
  },

  "angular": {
    techStats: [
      { label: "Created by", value: "Google" },
      { label: "First Release", value: "2016" },
      { label: "Weekly Downloads", value: "3M+" },
      { label: "Used by Google", value: "200+ apps" },
    ],
    fromScratch: {
      title: "Building an Angular App from Scratch",
      environment: "Node.js 18+ and npm installed",
      steps: [
        {
          step: 1,
          title: "Install Angular CLI",
          command: "npm install -g @angular/cli && ng version",
          description: "The Angular CLI is your primary tool for generating, building, and testing Angular apps. Always install it globally.",
        },
        {
          step: 2,
          title: "Create a New Angular Project",
          command: "ng new my-app --standalone --style=scss --routing",
          description: "Creating with --standalone uses modern standalone components (no NgModule needed). --routing adds the router. --style=scss sets SCSS as the stylesheet format.",
        },
        {
          step: 3,
          title: "Create a Standalone Component",
          command: `// src/app/user-card/user-card.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

interface User { id: number; name: string; email: string; }

@Component({
  selector: 'app-user-card',
  standalone: true,
  imports: [CommonModule],
  template: \`
    <div class="card">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <button (click)="onClick()">Select</button>
    </div>
  \`,
  styleUrls: ['./user-card.component.scss']
})
export class UserCardComponent {
  @Input({ required: true }) user!: User;
  
  onClick() { console.log('User selected:', this.user.id); }
}`,
          description: "Standalone components are self-contained — they import their own dependencies. @Input() binds parent data, (click) binds events, and {{ }} interpolates values.",
          isCode: true,
        },
        {
          step: 4,
          title: "Create a Service for Data Fetching",
          command: `// src/app/services/user.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>('/api/users');
  }

  createUser(user: Partial<User>): Observable<User> {
    return this.http.post<User>('/api/users', user);
  }
}`,
          description: "Services are singleton classes that handle business logic and data fetching. providedIn: 'root' makes it available app-wide. Use inject() for dependency injection.",
          isCode: true,
        },
        {
          step: 5,
          title: "Build for Production",
          command: `# Build optimized production bundle
ng build --configuration production

# Serve locally for testing
ng serve

# Run tests
ng test          # Unit tests (Jasmine + Karma)
ng e2e           # E2E tests (Playwright/Cypress)`,
          description: "ng build --configuration production creates an optimized bundle with tree-shaking, minification, and AOT compilation. Angular CLI handles everything automatically.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use standalone components + Angular Signals (new reactive primitives) instead of the older Observables-everywhere pattern for simpler state management. Signals provide the same reactivity with far less complexity.",
    },
  },

  "svelte": {
    techStats: [
      { label: "Created by", value: "Rich Harris" },
      { label: "First Release", value: "2016" },
      { label: "Bundle Size", value: "~1kb runtime" },
      { label: "GitHub Stars", value: "80K+" },
    ],
    fromScratch: {
      title: "Building with Svelte from Scratch",
      environment: "Node.js 18+ and npm installed",
      steps: [
        {
          step: 1,
          title: "Create a SvelteKit Project",
          command: "npm create svelte@latest my-app",
          description: "SvelteKit is the full-stack Svelte framework (similar to Next.js for React). Select TypeScript, Prettier, and ESLint when prompted.",
        },
        {
          step: 2,
          title: "Install and Run",
          command: "cd my-app && npm install && npm run dev",
          description: "SvelteKit starts at http://localhost:5173 with HMR. Unlike React/Vue, Svelte compiles your components at build time — there's no runtime framework overhead.",
        },
        {
          step: 3,
          title: "Write a Reactive Svelte Component",
          command: `<!-- src/lib/Counter.svelte -->
<script lang="ts">
  // Reactive — any change triggers re-render
  let count = $state(0);
  
  // Derived state
  let doubled = $derived(count * 2);
  
  function increment() { count++; }
</script>

<!-- Clean template syntax -->
<div>
  <p>Count: {count}</p>
  <p>Doubled: {doubled}</p>
  <button onclick={increment}>+1</button>
</div>

<style>
  /* Styles are scoped automatically! */
  button { background: #ff3e00; color: white; }
</style>`,
          description: "Svelte's $state() and $derived() are compile-time runes — no virtual DOM, no reactivity overhead. CSS is scoped to the component by default.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use SvelteKit for Data Loading",
          command: `// src/routes/products/+page.server.ts
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ fetch }) => {
  const products = await fetch('/api/products').then(r => r.json());
  return { products };
};

// src/routes/products/+page.svelte
<script lang="ts">
  import type { PageData } from './$types';
  let { data }: { data: PageData } = $props();
</script>

{#each data.products as product}
  <div>{product.name}</div>
{/each}`,
          description: "SvelteKit's +page.server.ts handles server-side data loading. Data is passed to .svelte pages via the data prop — fully typed.",
          isCode: true,
        },
        {
          step: 5,
          title: "Build and Deploy",
          command: `# Build for Node.js server
npm run build && node build

# Or build as static site
# Set adapter-static in svelte.config.js
npm run build
# Outputs to /build — deploy to any CDN`,
          description: "SvelteKit adapters determine the deployment target. adapter-vercel, adapter-netlify, adapter-static, adapter-node give you maximum deployment flexibility.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we choose Svelte for performance-critical landing pages and interactive widgets where bundle size matters. The Svelte 5 runes system ($state, $derived, $effect) gives us React-like composability with zero runtime.",
    },
  },

  "tailwind": {
    techStats: [
      { label: "Created by", value: "Adam Wathan" },
      { label: "First Release", value: "2017" },
      { label: "Weekly Downloads", value: "10M+" },
      { label: "GitHub Stars", value: "82K+" },
    ],
    fromScratch: {
      title: "Setting Up Tailwind CSS from Scratch",
      environment: "Node.js project (Vite, Next.js, or any bundler)",
      steps: [
        {
          step: 1,
          title: "Install Tailwind CSS",
          command: "npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p",
          description: "Install Tailwind as a dev dependency along with PostCSS and Autoprefixer. The init command creates tailwind.config.js and postcss.config.js.",
        },
        {
          step: 2,
          title: "Configure Content Paths in tailwind.config.js",
          command: `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,vue,svelte}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: '#6366f1',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}`,
          description: "The content array tells Tailwind which files to scan for class names. Classes not found in these files are purged from the production build — keeping CSS tiny.",
          isCode: true,
        },
        {
          step: 3,
          title: "Add Tailwind Directives to Your CSS",
          command: `/* src/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Add custom CSS after the directives */
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-brand text-white font-bold rounded-xl
           hover:opacity-90 transition-opacity duration-200;
  }
}`,
          description: "The three @tailwind directives inject Tailwind's base styles, component classes, and utility classes. Use @layer components for reusable custom classes with @apply.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use Utility Classes in Your HTML/JSX",
          command: `<!-- Responsive card with dark mode support -->
<div class="
  p-6 rounded-2xl
  bg-white dark:bg-zinc-900
  border border-zinc-200 dark:border-zinc-800
  shadow-sm hover:shadow-lg
  transition-shadow duration-300
  sm:p-8 lg:p-10
">
  <h2 class="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
    Title
  </h2>
  <p class="text-zinc-600 dark:text-zinc-400 leading-relaxed">
    Description text here
  </p>
</div>`,
          description: "Tailwind classes are composable. The dark: variant applies styles in dark mode. sm: and lg: are responsive breakpoints. No custom CSS file needed for most UI.",
          isCode: true,
        },
        {
          step: 5,
          title: "Extend the Design System",
          command: `// tailwind.config.js — Custom design tokens
theme: {
  extend: {
    animation: {
      'fade-up': 'fadeUp 0.4s ease forwards',
    },
    keyframes: {
      fadeUp: {
        from: { opacity: '0', transform: 'translateY(20px)' },
        to: { opacity: '1', transform: 'translateY(0)' },
      },
    },
    boxShadow: {
      'glow': '0 0 40px rgba(99,102,241,0.4)',
    }
  }
}`,
          description: "Extend Tailwind's theme with custom animations, shadows, colors, and more. These become first-class utility classes accessible anywhere in your project.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, every project starts with a custom tailwind.config.ts that defines the brand color palette, typography scale, and custom animations. We use the shadcn/ui component library built on Tailwind for consistent, accessible UI components.",
    },
  },

  "sass": {
    techStats: [
      { label: "Created", value: "2006" },
      { label: "Compiles To", value: "CSS" },
      { label: "Used by", value: "Bootstrap, etc." },
      { label: "Spec Version", value: "SCSS 3.x" },
    ],
    fromScratch: {
      title: "Setting Up Sass (SCSS) from Scratch",
      environment: "Node.js installed, any project with a bundler",
      steps: [
        {
          step: 1,
          title: "Install Sass",
          command: "npm install -D sass",
          description: "Install sass as a dev dependency. Vite, webpack, and most bundlers compile .scss files automatically once Sass is installed — no extra config needed.",
        },
        {
          step: 2,
          title: "Create Your Sass Architecture",
          command: `src/styles/
├── _variables.scss   # Design tokens
├── _mixins.scss      # Reusable patterns
├── _reset.scss       # Base styles
├── _typography.scss  # Font styles
├── _components.scss  # UI components
└── main.scss         # Entry point — imports all partials`,
          description: "The 7-1 pattern organizes Sass into partials (files starting with _). Partials are not compiled individually — they're imported into main.scss.",
          isCode: true,
        },
        {
          step: 3,
          title: "Define Variables and Design Tokens",
          command: `// _variables.scss
$color-primary: #6366f1;
$color-bg: #0f0f13;
$color-text: #f8fafc;

$spacing: (
  'sm': 0.5rem,
  'md': 1rem,
  'lg': 2rem,
  'xl': 4rem,
);

$breakpoints: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
);`,
          description: "Sass variables with $ prefix hold your design tokens. Maps ($spacing, $breakpoints) organize related values that you can iterate over with @each.",
          isCode: true,
        },
        {
          step: 4,
          title: "Write Reusable Mixins",
          command: `// _mixins.scss
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin respond-to($breakpoint) {
  $value: map-get($breakpoints, $breakpoint);
  @media (min-width: $value) { @content; }
}

// Usage
.hero {
  @include flex-center;
  height: 100vh;
  
  @include respond-to('lg') {
    height: 80vh;
  }
}`,
          description: "Mixins are reusable chunks of CSS with @mixin and @include. Use them for repeated patterns like responsive breakpoints, flex centering, and button variants.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use Nesting for Component Styles",
          command: `// _components.scss
.card {
  padding: map-get($spacing, 'lg');
  border-radius: 16px;
  background: $color-bg;
  
  &__title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: map-get($spacing, 'sm');
  }
  
  &__body {
    color: rgba($color-text, 0.7);
  }
  
  &:hover {
    box-shadow: 0 8px 32px rgba($color-primary, 0.25);
    transform: translateY(-4px);
    transition: all 0.2s ease;
  }
}`,
          description: "Sass nesting keeps component styles together. & refers to the parent selector. BEM naming (.card__title, .card--featured) works perfectly with Sass nesting.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use Sass for projects with complex theming requirements. We use @use over @import (modern module system), define all tokens in _variables.scss, and never mix Sass and Tailwind in the same project.",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // WEB BACKEND
  // ─────────────────────────────────────────────────────────────

  "nodejs": {
    techStats: [
      { label: "Created by", value: "Ryan Dahl" },
      { label: "First Release", value: "2009" },
      { label: "Weekly Downloads", value: "50M+" },
      { label: "npm Packages", value: "2M+" },
    ],
    fromScratch: {
      title: "Building a Node.js API from Scratch",
      environment: "Download and install Node.js 20 LTS from nodejs.org",
      steps: [
        {
          step: 1,
          title: "Initialize Your Node Project",
          command: `mkdir my-api && cd my-api
npm init -y
# Edit package.json to add "type": "module" for ES modules`,
          description: "npm init -y creates package.json with defaults. Adding 'type': 'module' enables ES module syntax (import/export) instead of the legacy CommonJS (require).",
          isCode: true,
        },
        {
          step: 2,
          title: "Install Express and Key Packages",
          command: `npm install express
npm install -D typescript @types/express @types/node tsx nodemon

# Initialize TypeScript
npx tsc --init`,
          description: "Express is the most popular Node.js web framework. We install TypeScript types for full IntelliSense. tsx runs TypeScript directly without compilation during development.",
          isCode: true,
        },
        {
          step: 3,
          title: "Create Your First Server",
          command: `// src/index.ts
import express from 'express';

const app = express();
app.use(express.json());

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'API is running!', timestamp: new Date() });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`,
          description: "Express uses middleware (app.use) to process requests. Routes are defined with app.get, app.post, etc. Always structure routes in separate files as the app grows.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Organized Routing and Middleware",
          command: `// src/routes/users.ts
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';

const router = Router();

router.get('/',    UserController.getAll);
router.get('/:id', UserController.getById);
router.post('/',   UserController.create);
router.put('/:id', UserController.update);
router.delete('/:id', UserController.delete);

export default router;

// src/index.ts
import userRoutes from './routes/users';
app.use('/api/users', userRoutes);`,
          description: "Keep routes modular using Express Router. Each resource (users, products, orders) gets its own router file. Controllers handle the business logic.",
          isCode: true,
        },
        {
          step: 5,
          title: "Run with Hot Reload and Build for Production",
          command: `# Add to package.json scripts:
{
  "scripts": {
    "dev": "nodemon --exec tsx src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  }
}

npm run dev    # Development with hot reload
npm run build  # Compile TypeScript
npm run start  # Run compiled production server`,
          description: "nodemon watches for file changes and restarts the server automatically. In production, compile TypeScript first (tsc) then run the compiled JS.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our Node.js stack is Express + TypeScript + Prisma (ORM) + PostgreSQL. We use Zod for request body validation, helmet.js for security headers, and Morgan for structured request logging. Always use environment variables (dotenv) — never hardcode credentials.",
    },
  },

  "express": {
    techStats: [
      { label: "First Release", value: "2010" },
      { label: "Weekly Downloads", value: "30M+" },
      { label: "GitHub Stars", value: "64K+" },
      { label: "Powers", value: "~30% of Node APIs" },
    ],
    fromScratch: {
      title: "Building a REST API with Express from Scratch",
      environment: "Node.js 18+ installed, basic Node project initialized",
      steps: [
        {
          step: 1,
          title: "Install Express and Essential Middleware",
          command: `npm install express cors helmet morgan dotenv express-validator
npm install -D @types/express @types/cors @types/morgan`,
          description: "Install Express with production-ready security middleware:\n• cors: cross-origin requests\n• helmet: security HTTP headers\n• morgan: request logging\n• express-validator: input validation",
          isCode: true,
        },
        {
          step: 2,
          title: "Configure Express with Security Middleware",
          command: `// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Security headers (always first!)
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
  credentials: true,
}));

// Request logging
app.use(morgan('combined'));

// Parse JSON request bodies
app.use(express.json({ limit: '10mb' }));

export default app;`,
          description: "This is ULMiND's production Express configuration. helmet() sets 14 security headers automatically. Always configure CORS with specific origins in production.",
          isCode: true,
        },
        {
          step: 3,
          title: "Build a Full CRUD REST Router",
          command: `// src/routes/products.ts
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { db } from '../lib/db';

const router = Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const products = await db.products.findMany({
    skip: (Number(page) - 1) * Number(limit),
    take: Number(limit),
  });
  res.json({ data: products, page, limit });
});

router.post('/',
  body('name').notEmpty().isString(),
  body('price').isFloat({ min: 0 }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const product = await db.products.create({ data: req.body });
    res.status(201).json(product);
  }
);

export default router;`,
          description: "Validate all input with express-validator before touching the database. Return consistent error responses. Use async/await with proper error handling.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Global Error Handling Middleware",
          command: `// src/middleware/errorHandler.ts
import { Request, Response, NextFunction } from 'express';

// Must have 4 params to be an error handler
export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err.stack);

  const statusCode = 'statusCode' in err ? (err as any).statusCode : 500;
  
  res.status(statusCode).json({
    error: {
      message: statusCode === 500 ? 'Internal Server Error' : err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    }
  });
}

// Use at the END of app.ts
app.use(errorHandler);`,
          description: "A centralized error handler catches all thrown errors and returns consistent JSON error responses. Show full stack traces only in development.",
          isCode: true,
        },
        {
          step: 5,
          title: "Add Rate Limiting and Deploy",
          command: `npm install express-rate-limit

// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                   // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later.',
});

app.use('/api/', apiLimiter);`,
          description: "Rate limiting prevents API abuse and DDoS attacks. Apply it to all /api/ routes. In production, use Redis for distributed rate limiting across multiple server instances.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, every Express API follows this pattern: Helmet → CORS → Rate Limit → Body Parser → Routes → Error Handler. We always structure projects by feature (users/, products/, orders/) not by type (routes/, controllers/, models/).",
    },
  },

  "python": {
    techStats: [
      { label: "Created by", value: "Guido van Rossum" },
      { label: "First Release", value: "1991" },
      { label: "GitHub Stars", value: "65K+" },
      { label: "#1 Language", value: "IEEE Spectrum" },
    ],
    fromScratch: {
      title: "Python Backend API from Scratch",
      environment: "Python 3.11+ installed and pip available",
      steps: [
        {
          step: 1,
          title: "Create a Virtual Environment",
          command: `# Create isolated Python environment
python3 -m venv venv

# Activate it
source venv/bin/activate        # macOS/Linux
venv\\Scripts\\activate.bat      # Windows

# Verify
which python  # Should show venv path`,
          description: "Always use virtual environments — they isolate project dependencies so packages don't conflict between projects. Never install packages globally.",
          isCode: true,
        },
        {
          step: 2,
          title: "Install FastAPI (Our Preferred Python Framework)",
          command: `pip install fastapi uvicorn[standard] pydantic httpx
pip install sqlalchemy alembic python-dotenv

# Save dependencies
pip freeze > requirements.txt`,
          description: "We prefer FastAPI over Flask for new projects — it's async-native, auto-generates OpenAPI docs, and uses Pydantic for data validation. Uvicorn is the ASGI server.",
          isCode: true,
        },
        {
          step: 3,
          title: "Create Your First FastAPI App",
          command: `# main.py
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="My API", version="1.0.0")

class UserCreate(BaseModel):
    name: str
    email: str
    age: Optional[int] = None

users = []

@app.get("/")
async def root():
    return {"message": "API is running!"}

@app.post("/users", status_code=201)
async def create_user(user: UserCreate):
    users.append(user.dict())
    return user

@app.get("/users/{user_id}")
async def get_user(user_id: int):
    if user_id >= len(users):
        raise HTTPException(status_code=404, detail="User not found")
    return users[user_id]`,
          description: "FastAPI automatically validates request bodies with Pydantic models, generates API docs at /docs, and handles async requests natively. It's the fastest Python framework.",
          isCode: true,
        },
        {
          step: 4,
          title: "Run the Development Server",
          command: `# Start with hot reload
uvicorn main:app --reload --port 8000

# Visit http://localhost:8000
# Visit http://localhost:8000/docs  — Auto-generated Swagger UI!
# Visit http://localhost:8000/redoc — Alternative docs UI`,
          description: "Uvicorn starts your FastAPI app with --reload for auto-restart on file changes. The interactive /docs page lets you test every endpoint right in the browser.",
          isCode: true,
        },
        {
          step: 5,
          title: "Add Database with SQLAlchemy + Alembic",
          command: `# models.py
from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

# Initialize Alembic for migrations
# alembic init alembic
# alembic revision --autogenerate -m "Create users table"
# alembic upgrade head`,
          description: "SQLAlchemy is Python's most powerful ORM. Alembic handles database migrations. Use async SQLAlchemy sessions with FastAPI for non-blocking database access.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our Python API stack is FastAPI + PostgreSQL + SQLAlchemy (async) + Alembic. For AI/ML endpoints, we use FastAPI to serve PyTorch/scikit-learn models with Pydantic validation ensuring type-safe inference requests and responses.",
    },
  },

  "django": {
    techStats: [
      { label: "Created by", value: "Django Software Foundation" },
      { label: "First Release", value: "2005" },
      { label: "GitHub Stars", value: "80K+" },
      { label: "Powers", value: "Instagram, Pinterest" },
    ],
    fromScratch: {
      title: "Building a Django App from Scratch",
      environment: "Python 3.11+ with pip and virtualenv",
      steps: [
        {
          step: 1,
          title: "Set Up Virtual Environment and Install Django",
          command: `python3 -m venv venv && source venv/bin/activate
pip install django djangorestframework django-cors-headers psycopg2-binary
pip install python-decouple pillow gunicorn`,
          description: "Install Django REST Framework for building APIs, CORS headers for frontend connectivity, and psycopg2 for PostgreSQL. python-decouple manages environment variables.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create Django Project and First App",
          command: `# Create the project
django-admin startproject myproject .

# Create an app (a feature module)
python manage.py startapp users

# Project structure:
# myproject/settings.py  — config
# myproject/urls.py      — root routing
# users/models.py        — DB models
# users/views.py         — request handlers
# users/serializers.py   — DRF serializers`,
          description: "A Django project contains multiple apps — each app handles one domain (users, products, orders). This modularity keeps large projects organized.",
          isCode: true,
        },
        {
          step: 3,
          title: "Define a Model and Run Migrations",
          command: `# users/models.py
from django.db import models

class UserProfile(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    bio = models.TextField(blank=True)
    avatar = models.ImageField(upload_to='avatars/', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return self.name

# Create and run migrations
python manage.py makemigrations
python manage.py migrate`,
          description: "Django's ORM auto-generates SQL from your Python models. makemigrations creates migration files, migrate applies them to the database. No SQL needed.",
          isCode: true,
        },
        {
          step: 4,
          title: "Create DRF Serializer and ViewSet",
          command: `# users/serializers.py
from rest_framework import serializers
from .models import UserProfile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['id', 'name', 'email', 'bio', 'created_at']
        read_only_fields = ['id', 'created_at']

# users/views.py
from rest_framework import viewsets, permissions
from .models import UserProfile
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]`,
          description: "DRF ViewSets automatically provide list, create, retrieve, update, and delete endpoints. ModelSerializer auto-generates serialization from your Django model.",
          isCode: true,
        },
        {
          step: 5,
          title: "Register Routes and Run Server",
          command: `# myproject/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from users.views import UserViewSet

router = DefaultRouter()
router.register(r'users', UserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api-auth/', include('rest_framework.urls')),
]

# Run development server
python manage.py runserver

# Visit /api/ for browsable API UI
# Visit /api/users/ for user endpoints`,
          description: "DRF's Router auto-registers all CRUD endpoints for your ViewSet. The browsable API at /api/ is a built-in web interface to test your endpoints.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use Django REST Framework with SimpleJWT for authentication, Celery + Redis for background tasks, and django-storages for file storage on AWS S3. We always use environment variables via python-decouple — never hardcode secrets in settings.py.",
    },
  },

  "flask": {
    techStats: [
      { label: "Created by", value: "Armin Ronacher" },
      { label: "First Release", value: "2010" },
      { label: "GitHub Stars", value: "68K+" },
      { label: "Philosophy", value: "Micro-framework" },
    ],
    fromScratch: {
      title: "Building a Flask Microservice from Scratch",
      environment: "Python 3.11+ with pip and virtualenv",
      steps: [
        {
          step: 1,
          title: "Install Flask and Extensions",
          command: `python3 -m venv venv && source venv/bin/activate
pip install flask flask-sqlalchemy flask-marshmallow flask-jwt-extended
pip install python-dotenv gunicorn`,
          description: "Flask is a microframework — it gives you routing and a development server, and you choose the rest. We add SQLAlchemy for the database, Marshmallow for serialization, and JWT for auth.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create the Application Factory",
          command: `# app/__init__.py
from flask import Flask
from .extensions import db, jwt

def create_app(config='app.config.DevelopmentConfig'):
    app = Flask(__name__)
    app.config.from_object(config)
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    
    # Register blueprints
    from .routes.users import users_bp
    app.register_blueprint(users_bp, url_prefix='/api/users')
    
    return app`,
          description: "The application factory pattern allows multiple app instances (for testing). Blueprints organize routes by feature, and extensions are initialized in one place.",
          isCode: true,
        },
        {
          step: 3,
          title: "Serve an ML Model via Flask",
          command: `# routes/predict.py
from flask import Blueprint, request, jsonify
import numpy as np
import joblib

predict_bp = Blueprint('predict', __name__)

# Load model once at startup
model = joblib.load('models/classifier.pkl')

@predict_bp.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    
    if not data or 'features' not in data:
        return jsonify({'error': 'features required'}), 400
    
    features = np.array(data['features']).reshape(1, -1)
    prediction = model.predict(features)[0]
    probability = model.predict_proba(features)[0].max()
    
    return jsonify({
        'prediction': int(prediction),
        'confidence': round(float(probability), 4)
    })`,
          description: "Flask excels at serving ML models — load the model once at startup, not per request. joblib loads scikit-learn models efficiently. Wrap in try/except for production.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Request Validation and Error Handling",
          command: `from flask import jsonify
from marshmallow import ValidationError

@app.errorhandler(ValidationError)
def handle_validation_error(e):
    return jsonify({'errors': e.messages}), 422

@app.errorhandler(404)
def not_found(e):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({'error': 'Internal server error'}), 500`,
          description: "Register error handlers for validation errors, 404s, and 500s. Consistent JSON error responses make the API easier to consume from any client.",
          isCode: true,
        },
        {
          step: 5,
          title: "Run and Deploy",
          command: `# Development
flask run --debug

# Production with Gunicorn (multi-worker)
gunicorn "app:create_app()" \
  --workers 4 \
  --bind 0.0.0.0:5000 \
  --timeout 120

# With Docker
FROM python:3.11-slim
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "app:create_app()", "--bind", "0.0.0.0:5000"]`,
          description: "Never run Flask's built-in server in production. Use Gunicorn with 2×CPU+1 workers. The Docker approach containerizes everything for consistent deployments.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Flask is our go-to for AI model serving APIs where Django would be overkill. We always serve models with worker processes (gunicorn), store large models in object storage (S3), and use Redis for request caching to avoid reloading models per request.",
    },
  },

  "java": {
    techStats: [
      { label: "Created by", value: "Sun Microsystems" },
      { label: "First Release", value: "1995" },
      { label: "Powers", value: "3 Billion Devices" },
      { label: "Enterprise Usage", value: "#1 Language" },
    ],
    fromScratch: {
      title: "Java Spring Boot API from Scratch",
      environment: "JDK 21 LTS installed, Maven or Gradle",
      steps: [
        {
          step: 1,
          title: "Generate Project with Spring Initializr",
          command: `# Visit start.spring.io OR use CLI:
curl https://start.spring.io/starter.zip \\
  -d type=maven-project \\
  -d language=java \\
  -d bootVersion=3.2.0 \\
  -d artifactId=my-api \\
  -d dependencies=web,data-jpa,postgresql,lombok,validation \\
  -o my-api.zip && unzip my-api.zip`,
          description: "Spring Initializr is the fastest way to scaffold a Spring Boot project. We always include: Spring Web (REST), Data JPA (ORM), PostgreSQL driver, Lombok, and Validation.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create a JPA Entity",
          command: `// src/main/java/com/myapp/entity/User.java
@Entity
@Table(name = "users")
@Data                    // Lombok: generates getters/setters
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    @NotBlank(message = "Name is required")
    private String name;
    
    @Column(unique = true, nullable = false)
    @Email(message = "Invalid email format")
    private String email;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
}`,
          description: "@Entity maps the class to a database table. Lombok (@Data, @Builder) eliminates boilerplate. @NotBlank and @Email provide input validation.",
          isCode: true,
        },
        {
          step: 3,
          title: "Create Repository and Service Layer",
          command: `// UserRepository.java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByNameContainingIgnoreCase(String name);
}

// UserService.java
@Service
@Transactional
@RequiredArgsConstructor  // Lombok constructor injection
public class UserService {
    private final UserRepository userRepository;
    
    public User createUser(CreateUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new DuplicateEmailException("Email already exists");
        }
        return userRepository.save(
            User.builder()
                .name(request.name())
                .email(request.email())
                .build()
        );
    }
}`,
          description: "JpaRepository provides 30+ CRUD methods out of the box. Spring derives SQL from method names (findByEmail). Keep business logic in @Service classes.",
          isCode: true,
        },
        {
          step: 4,
          title: "Create the REST Controller",
          command: `@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Validated
public class UserController {
    private final UserService userService;

    @GetMapping
    public ResponseEntity<Page<User>> getAll(
            @PageableDefault(size = 20) Pageable pageable) {
        return ResponseEntity.ok(userService.findAll(pageable));
    }

    @PostMapping
    public ResponseEntity<User> create(
            @Valid @RequestBody CreateUserRequest request) {
        User created = userService.createUser(request);
        URI location = URI.create("/api/users/" + created.getId());
        return ResponseEntity.created(location).body(created);
    }
}`,
          description: "@RestController combines @Controller and @ResponseBody. @Valid triggers bean validation. ResponseEntity gives full control over status codes and headers.",
          isCode: true,
        },
        {
          step: 5,
          title: "Run and Build",
          command: `# Run in development
./mvnw spring-boot:run

# Build production JAR
./mvnw clean package -DskipTests

# Run the JAR
java -jar target/my-api-0.0.1-SNAPSHOT.jar

# Or build Docker image (Spring Native)
./mvnw spring-boot:build-image`,
          description: "Spring Boot packages everything into an executable JAR — no application server needed. Spring Boot Actuator (add to dependencies) provides /health and /metrics endpoints.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our Java stack is Spring Boot 3 + JDK 21 + JPA + PostgreSQL + MapStruct (for DTO mapping) + Spring Security (OAuth2/JWT). We use Java Records for immutable DTOs and Virtual Threads (JDK 21) for massive concurrency improvements.",
    },
  },

  "spring": {
    techStats: [
      { label: "Created by", value: "Pivotal/VMware" },
      { label: "First Release", value: "2003" },
      { label: "GitHub Stars", value: "55K+" },
      { label: "Powers", value: "Netflix, Amazon" },
    ],
    fromScratch: {
      title: "Spring Boot Microservice from Scratch",
      environment: "JDK 21 LTS and Maven installed",
      steps: [
        {
          step: 1,
          title: "Scaffold with Spring Initializr",
          command: `# Required dependencies for production Spring Boot app:
# Spring Web (REST)
# Spring Data JPA (ORM)
# Spring Security (Auth)
# Spring Boot Actuator (Monitoring)
# PostgreSQL Driver
# Lombok
# Validation (Bean Validation API)

# Visit: start.spring.io → select all above → Generate`,
          description: " Spring provides everything enterprise apps need. Spring Boot's auto-configuration wires all components together with minimal manual setup.",
          isCode: true,
        },
        {
          step: 2,
          title: "Configure application.yml",
          command: `spring:
  application:
    name: user-service
  datasource:
    url: \${DATABASE_URL}
    username: \${DATABASE_USER}
    password: \${DATABASE_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
  
server:
  port: 8080

management:
  endpoints:
    web:
      exposure:
        include: health,info,metrics`,
          description: "Use application.yml over application.properties for better readability. Always use environment variables (${}) for credentials — never hardcode them.",
          isCode: true,
        },
        {
          step: 3,
          title: "Secure the API with Spring Security + JWT",
          command: `@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .anyRequest().authenticated())
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
            .build();
    }
}`,
          description: "Spring Security 6 uses lambdas for configuration. STATELESS session management disables server-side sessions — JWT in the Authorization header authenticates each request.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Caching with Spring Cache",
          command: `@EnableCaching  // In main class
@Service
public class ProductService {

    @Cacheable(value = "products", key = "#id")
    public Product getById(Long id) {
        // Only called if result isn't in cache
        return productRepository.findById(id).orElseThrow();
    }
    
    @CacheEvict(value = "products", key = "#product.id")
    public Product update(Product product) {
        return productRepository.save(product);
    }
    
    @CacheEvict(value = "products", allEntries = true)
    public void deleteAll() {
        productRepository.deleteAll();
    }
}`,
          description: "@Cacheable caches method results. @CacheEvict removes cached entries when data changes. In production, use Redis as the cache store for distributed caching.",
          isCode: true,
        },
        {
          step: 5,
          title: "Monitor with Spring Actuator",
          command: `# Health check (load balancers use this)
GET /actuator/health
→ { "status": "UP", "components": {...} }

# Metrics (Prometheus-compatible)
GET /actuator/metrics/jvm.memory.used
GET /actuator/metrics/http.server.requests

# Integrate Prometheus + Grafana:
npm install micrometer-registry-prometheus  
# Then scrape http://app:8080/actuator/prometheus`,
          description: "Spring Actuator provides production-ready endpoints. /health is used by Kubernetes liveness probes. /metrics integrates with Prometheus + Grafana dashboards.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Spring Boot is our Java enterprise framework. We deploy as Docker containers on Kubernetes, use Spring Cloud Config for centralized configuration, and Spring Cloud Gateway as the API gateway for microservices architectures.",
    },
  },

  "go": {
    techStats: [
      { label: "Created by", value: "Google" },
      { label: "First Release", value: "2009" },
      { label: "Compilation", value: "< 1 second" },
      { label: "GitHub Stars", value: "120K+" },
    ],
    fromScratch: {
      title: "Building a Go REST API from Scratch",
      environment: "Go 1.22+ installed from go.dev",
      steps: [
        {
          step: 1,
          title: "Initialize a Go Module",
          command: `mkdir my-api && cd my-api
go mod init github.com/yourname/my-api
go get github.com/gin-gonic/gin
go get gorm.io/gorm gorm.io/driver/postgres`,
          description: "go mod init creates go.mod — the module file that tracks your project's dependencies. We use Gin (fastest HTTP router) and GORM (ORM).",
          isCode: true,
        },
        {
          step: 2,
          title: "Create the Main Server",
          command: `// main.go
package main

import (
    "github.com/gin-gonic/gin"
    "net/http"
)

func main() {
    r := gin.Default() // Logger + Recovery middleware included
    
    api := r.Group("/api/v1")
    {
        api.GET("/health", func(c *gin.Context) {
            c.JSON(http.StatusOK, gin.H{"status": "ok"})
        })
        api.GET("/users",    GetUsers)
        api.POST("/users",   CreateUser)
        api.GET("/users/:id", GetUser)
    }
    
    r.Run(":8080") // Start server
}`,
          description: "Gin is a high-performance HTTP router. Route groups (/api/v1) keep routes organized. gin.H is a shorthand for map[string]interface{} for JSON responses.",
          isCode: true,
        },
        {
          step: 3,
          title: "Define Structs and Request Handlers",
          command: `// handlers/user.go
package handlers

type User struct {
    ID    uint   \`json:"id" gorm:"primaryKey"\`
    Name  string \`json:"name" binding:"required"\`
    Email string \`json:"email" binding:"required,email"\`
}

func CreateUser(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }
    
    result := db.Create(&user)
    if result.Error != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "DB error"})
        return
    }
    
    c.JSON(http.StatusCreated, user)
}`,
          description: "Go uses struct tags for JSON serialization and GORM mapping. binding:\"required\" validates request bodies. Always return early on error — Go's explicit error handling pattern.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use Goroutines for Concurrency",
          command: `// Process 1000 items concurrently
func processItems(items []Item) []Result {
    results := make([]Result, len(items))
    var wg sync.WaitGroup
    
    for i, item := range items {
        wg.Add(1)
        go func(i int, item Item) {
            defer wg.Done()
            results[i] = processOne(item)
        }(i, item)
    }
    
    wg.Wait()
    return results
}`,
          description: "Goroutines are Go's killer feature — thousands can run concurrently with minimal memory (2KB each). Use sync.WaitGroup to wait for all goroutines to complete.",
          isCode: true,
        },
        {
          step: 5,
          title: "Build a Tiny Binary and Deploy",
          command: `# Build optimized binary
go build -ldflags="-w -s" -o app ./...

# Cross-compile for Linux (from Mac)
GOOS=linux GOARCH=amd64 go build -o app-linux ./...

# Build and run Docker image (tiny image!)
FROM scratch
COPY app /app
ENTRYPOINT ["/app"]
# Final image: < 10MB!`,
          description: "Go compiles to a single static binary with no runtime dependencies. The resulting Docker image from scratch is under 10MB — vs 500MB+ for Java. Perfect for microservices.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Go is our secret weapon for performance-critical services. A single Go binary can handle 100K+ concurrent connections on a small server. We use it for high-throughput data pipelines, API gateways, and real-time event processing where Node.js or Python would hit resource limits.",
    },
  },

  "php": {
    techStats: [
      { label: "Powers", value: "78% of websites" },
      { label: "First Release", value: "1994" },
      { label: "Current Version", value: "PHP 8.3" },
      { label: "Used by", value: "WordPress, Meta" },
    ],
    fromScratch: {
      title: "Modern PHP API from Scratch",
      environment: "PHP 8.2+ and Composer installed",
      steps: [
        {
          step: 1,
          title: "Install Composer (PHP Package Manager)",
          command: `# macOS with Homebrew
brew install php composer

# Verify
php -v && composer --version`,
          description: "Composer is PHP's package manager — similar to npm for Node.js. Modern PHP projects use Composer for all dependency management.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create a Slim 4 API Project",
          command: `composer create-project slim/slim-skeleton my-api
cd my-api

# Or manually:
composer require slim/slim slim/psr7 php-di/slim-bridge
composer require monolog/monolog respect/validation`,
          description: "Slim Framework is a PHP micro-framework like Flask. It's lightweight and gives us routing, middleware, and dependency injection without Django's overhead.",
          isCode: true,
        },
        {
          step: 3,
          title: "Write Modern PHP 8.3 Code",
          command: `<?php
declare(strict_types=1);

// Named arguments, match expression, enums
enum UserRole: string {
    case Admin = 'admin';
    case User = 'user';
}

class UserService {
    public function __construct(
        private readonly UserRepository $repo
    ) {}
    
    public function create(
        string $name,
        string $email,
        UserRole $role = UserRole::User
    ): User {
        return $this->repo->save(new User(
            name: $name,
            email: $email,
            role: $role,
        ));
    }
}`,
          description: "Modern PHP 8.x has: enums, named arguments, match expressions, union types, readonly properties, and fibers. Always declare strict_types=1 at the top of every file.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use PDO for Database Access",
          command: `<?php
$pdo = new PDO(
    dsn: 'pgsql:host=localhost;dbname=mydb',
    username: $_ENV['DB_USER'],
    password: $_ENV['DB_PASS'],
    options: [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION],
);

// Prepared statements ALWAYS (prevent SQL injection)
$stmt = $pdo->prepare(
    'SELECT * FROM users WHERE email = :email'
);
$stmt->execute(['email' => $email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);`,
          description: "Always use PDO prepared statements — never string concatenate SQL queries. This prevents SQL injection attacks. Use ? or :named placeholders for all user input.",
          isCode: true,
        },
        {
          step: 5,
          title: "Run with Built-in Server (Dev) or PHP-FPM (Prod)",
          command: `# Development — PHP built-in server
php -S localhost:8000 -t public/

# Production — PHP-FPM + Nginx
# /etc/nginx/sites-available/myapp
server {
    listen 80;
    root /var/www/my-api/public;
    index index.php;
    
    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }
    location ~ \\.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        include fastcgi_params;
    }
}`,
          description: "Never use the built-in server in production. Use PHP-FPM + Nginx for production deployments. PHP-FPM manages worker processes for high-performance request handling.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use Laravel for PHP projects — it's the most productive PHP framework with an elegant ORM (Eloquent), built-in auth, queues, and the Vite integration for frontend assets. PHP 8.3 with proper typing and modern patterns competes well with other backend languages.",
    },
  },

  "laravel": {
    techStats: [
      { label: "Created by", value: "Taylor Otwell" },
      { label: "First Release", value: "2011" },
      { label: "GitHub Stars", value: "77K+" },
      { label: "Monthly Downloads", value: "5M+" },
    ],
    fromScratch: {
      title: "Building a Laravel App from Scratch",
      environment: "PHP 8.2+ and Composer installed",
      steps: [
        {
          step: 1,
          title: "Create a New Laravel Project",
          command: `composer create-project laravel/laravel my-app
cd my-app

# Or using the Laravel installer
composer global require laravel/installer
laravel new my-app`,
          description: "Laravel's installer creates a full project with authentication scaffolding, Eloquent ORM, Artisan CLI, database migrations, and more — ready to use.",
          isCode: true,
        },
        {
          step: 2,
          title: "Configure Database in .env",
          command: `DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=my_database
DB_USERNAME=postgres
DB_PASSWORD=secret

# Then run initial migrations
php artisan migrate`,
          description: "Laravel uses .env for environment configuration. The artisan migrate command creates the default tables (users, password resets, etc.) from the included migrations.",
          isCode: true,
        },
        {
          step: 3,
          title: "Generate Model, Migration, and Controller",
          command: `# Generate everything at once!
php artisan make:model Product -a
# -a creates: Model, Migration, Factory,
#            Seeder, Policy, Controller, Request

# The migration (database/migrations/)
Schema::create('products', function (Blueprint $table) {
    $table->id();
    $table->string('name');
    $table->decimal('price', 10, 2);
    $table->text('description')->nullable();
    $table->foreignId('user_id')->constrained()->cascadeOnDelete();
    $table->timestamps();
});

php artisan migrate`,
          description: "Artisan's make:model -a scaffolds the entire CRUD stack in one command. The migration uses Blueprint methods — no raw SQL needed.",
          isCode: true,
        },
        {
          step: 4,
          title: "Write Eloquent ORM Queries",
          command: `// Eloquent is powerfully expressive
// Get all active products with their creator, paginated
$products = Product::with('user')
    ->where('is_active', true)
    ->where('price', '>', 100)
    ->orderBy('created_at', 'desc')
    ->paginate(20);

// Create with mass assignment
$product = Product::create($request->validated());

// Eloquent relationships
class Product extends Model {
    public function user(): BelongsTo {
        return $this->belongsTo(User::class);
    }
    
    public function tags(): BelongsToMany {
        return $this->belongsToMany(Tag::class);
    }
}`,
          description: "Eloquent's fluent query builder reads like English. with() eager-loads relationships to prevent N+1 queries. $request->validated() returns only safe, validated input.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use Queues for Background Tasks",
          command: `# Create a job
php artisan make:job SendWelcomeEmail

// app/Jobs/SendWelcomeEmail.php
class SendWelcomeEmail implements ShouldQueue {
    public function __construct(
        private readonly User $user
    ) {}
    
    public function handle(): void {
        Mail::to($this->user)->send(new WelcomeMail($this->user));
    }
}

// Dispatch it (processes in background)
SendWelcomeEmail::dispatch($user);

# Run the queue worker
php artisan queue:work redis`,
          description: "Laravel Queues push time-consuming tasks (emails, PDF generation, API calls) to background workers. Users get instant responses while work happens asynchronously.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our Laravel stack includes Laravel Sanctum (API auth), Laravel Horizon (queue monitoring), Laravel Scout (full-text search), and Spatie Permission for role-based access control. Laravel Forge makes server provisioning and deployment a one-click operation.",
    },
  },

  "ruby": {
    techStats: [
      { label: "Created by", value: "Yukihiro Matsumoto" },
      { label: "First Release", value: "1995" },
      { label: "Rails Release", value: "2004" },
      { label: "Powers", value: "Shopify, GitHub" },
    ],
    fromScratch: {
      title: "Building a Ruby on Rails API from Scratch",
      environment: "Ruby 3.3+ and rbenv or RVM for version management",
      steps: [
        {
          step: 1,
          title: "Install Ruby and Rails",
          command: `# Using rbenv (recommended)
brew install rbenv ruby-build
rbenv install 3.3.0 && rbenv global 3.3.0

# Install Rails
gem install rails

# Verify
ruby -v && rails -v`,
          description: "Use rbenv or RVM to manage Ruby versions — never use the system Ruby. Install the latest stable Ruby version and the current Rails gem.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create a Rails API Project",
          command: `# --api flag creates a lean API-only app
rails new my-api --api --database=postgresql

cd my-api

# Create the database
rails db:create`,
          description: "The --api flag removes view layers, sessions, and browser-specific middleware — perfect for JSON APIs. PostgreSQL is our preferred database for Rails apps.",
          isCode: true,
        },
        {
          step: 3,
          title: "Generate a Resource with Scaffold",
          command: `# Generate complete CRUD in one command
rails generate scaffold Product \\
  name:string price:decimal description:text user:references

# Run the migration
rails db:migrate

# What it creates:
# db/migrate/    — Database migration
# app/models/    — ActiveRecord model
# app/controllers/products_controller.rb
# spec/          — RSpec tests`,
          description: "Rails scaffolding is legendary — one command creates the database migration, model, controller with full CRUD, and tests. Convention over configuration at its finest.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Authentication with Devise + JWT",
          command: `# Gemfile
gem 'devise'
gem 'devise-jwt'

bundle install
rails generate devise:install
rails generate devise User

# Add JWT strategy in config/initializers/devise.rb
config.jwt do |jwt|
  jwt.secret = Rails.application.credentials.jwt_secret
  jwt.dispatch_requests = [['POST', %r{^/users/sign_in$}]]
  jwt.revocation_requests = [['DELETE', %r{^/users/sign_out$}]]
  jwt.expiration_time = 1.day.to_i
end`,
          description: "Devise provides production-ready authentication with 10+ modules. devise-jwt adds JWT token support for stateless API authentication.",
          isCode: true,
        },
        {
          step: 5,
          title: "Run Tests and Deploy",
          command: `# Run all tests (RSpec)
bundle exec rspec

# Run specific test file
bundle exec rspec spec/models/user_spec.rb

# Start development server
rails server

# Deploy with Kamal (modern Rails deployment)
gem install kamal
kamal deploy`,
          description: "Rails has excellent test tooling. RSpec with FactoryBot for test data is the standard. Kamal (by Basecamp) is the new standard for Docker-based Rails deployment.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Ruby on Rails gets us from idea to working MVP faster than any other stack. Convention over configuration means we spend time building features, not wiring frameworks. Shopify runs on Rails at massive scale — it scales perfectly when optimized correctly.",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // MOBILE
  // ─────────────────────────────────────────────────────────────

  "react-native": {
    techStats: [
      { label: "Created by", value: "Meta (Facebook)" },
      { label: "First Release", value: "2015" },
      { label: "GitHub Stars", value: "118K+" },
      { label: "Platforms", value: "iOS + Android" },
    ],
    fromScratch: {
      title: "Building a React Native App from Scratch",
      environment: "Node.js 18+, Xcode (for iOS), Android Studio (for Android)",
      steps: [
        {
          step: 1,
          title: "Create App with Expo (Recommended Starting Point)",
          command: `npx create-expo-app@latest my-app --template
# Select: Navigation (TypeScript)

cd my-app && npx expo start`,
          description: "We recommend Expo for React Native — it removes the complex native build setup. Expo Go app lets you test on real devices instantly by scanning a QR code.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create Your First Screen",
          command: `// app/(tabs)/index.tsx
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { useEffect, useState } from 'react';

export default function HomeScreen() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('https://api.example.com/items')
      .then(r => r.json())
      .then(setData);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Products</Text>
      <FlatList
        data={data}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <Text>{item.name}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { fontSize: 24, fontWeight: 'bold', padding: 16 },
});`,
          description: "React Native uses View/Text/FlatList instead of div/p/ul. StyleSheet.create() defines styles inline — no CSS files. FlatList is the performant list component for long data.",
          isCode: true,
        },
        {
          step: 3,
          title: "Navigate between Screens",
          command: `// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" color={color} size={24} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: 'Profile' }}
      />
    </Tabs>
  );
}`,
          description: "Expo Router uses file-based routing — the same concept as Next.js but for mobile. The (tabs) folder creates a tab bar navigator automatically.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add State Management with Zustand",
          command: `npm install zustand

// store/auth.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthStore {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);`,
          description: "Zustand with AsyncStorage persistence keeps state across app restarts. This is perfect for auth tokens, user preferences, and offline data.",
          isCode: true,
        },
        {
          step: 5,
          title: "Build for App Store / Play Store",
          command: `# Install EAS CLI (Expo Application Services)
npm install -g eas-cli && eas login

# Configure builds
eas build:configure

# Build for both platforms
eas build --platform all

# Submit to stores
eas submit --platform ios
eas submit --platform android`,
          description: "EAS Build handles all the complex native build processes in the cloud. No need for Xcode or Android Studio setup for builds. EAS Submit uploads directly to the App Store and Play Store.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our React Native stack is Expo + NativeWind (Tailwind for RN) + Zustand + React Query + Expo Router. We use Expo EAS for builds and OTA (over-the-air) updates that bypass the app store review process for minor fixes.",
    },
  },

  "flutter": {
    techStats: [
      { label: "Created by", value: "Google" },
      { label: "First Release", value: "2018" },
      { label: "GitHub Stars", value: "164K+" },
      { label: "fps Performance", value: "120fps" },
    ],
    fromScratch: {
      title: "Building a Flutter App from Scratch",
      environment: "Flutter SDK and Android Studio/Xcode installed",
      steps: [
        {
          step: 1,
          title: "Install Flutter SDK",
          command: `# macOS with Homebrew
brew install --cask flutter

# Verify installation & check for issues
flutter doctor

# All items should show ✓
# Configure Xcode for iOS: xcode-select --install
# Configure Android: flutter config --android-studio-dir ...`,
          description: "flutter doctor diagnoses your environment and tells you exactly what needs to be set up. Fix every ✗ before starting development.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create Your First Flutter App",
          command: `flutter create my_app --org com.yourcompany

cd my_app

# Run on connected device or simulator
flutter run

# Run on specific device
flutter run -d chrome          # Web
flutter run -d "iPhone 15"    # iOS simulator
flutter run -d emulator-5554  # Android emulator`,
          description: "flutter create scaffolds a complete app with the counter example. The org flag sets the app's bundle ID. flutter run auto-detects connected devices.",
          isCode: true,
        },
        {
          step: 3,
          title: "Build Your First Widget",
          command: `// lib/widgets/product_card.dart
import 'package:flutter/material.dart';

class ProductCard extends StatelessWidget {
  const ProductCard({
    super.key,
    required this.name,
    required this.price,
    this.onTap,
  });

  final String name;
  final double price;
  final VoidCallback? onTap;

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Card(
        elevation: 4,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(16),
        ),
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: Theme.of(context).textTheme.titleLarge),
              Text('\$\${price.toStringAsFixed(2)}'),
            ],
          ),
        ),
      ),
    );
  }
}`,
          description: "Everything in Flutter is a Widget. StatelessWidget for static UI, StatefulWidget for dynamic UI. Composition (nesting widgets) creates complex UIs.",
          isCode: true,
        },
        {
          step: 4,
          title: "Manage State with Riverpod",
          command: `# pubspec.yaml
dependencies:
  flutter_riverpod: ^2.5.0
  riverpod_annotation: ^2.3.0

// providers/products_provider.dart
import 'package:riverpod_annotation/riverpod_annotation.dart';

@riverpod
Future<List<Product>> products(ProductsRef ref) async {
  final api = ref.watch(apiServiceProvider);
  return api.getProducts();
}

// In your widget — use ConsumerWidget
class ProductsScreen extends ConsumerWidget {
  Widget build(BuildContext context, WidgetRef ref) {
    final productsAsync = ref.watch(productsProvider);
    
    return productsAsync.when(
      data: (products) => ListView.builder(...),
      loading: () => const CircularProgressIndicator(),
      error: (e, s) => Text('Error: \$e'),
    );
  }
}`,
          description: "Riverpod is Flutter's most powerful state management solution. Providers are automatically cached, reactive, and testable. AsyncValue handles loading/error/data states elegantly.",
          isCode: true,
        },
        {
          step: 5,
          title: "Build and Release",
          command: `# Build release APK (Android)
flutter build apk --release

# Build App Bundle (required for Play Store)
flutter build appbundle --release

# Build for iOS (requires macOS + Xcode)
flutter build ios --release

# Build for Web
flutter build web --release`,
          description: "Flutter builds native binaries for each platform. App Bundle is required for Play Store (smaller download sizes). Use Codemagic or GitHub Actions for automated CI/CD across all platforms.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Flutter is our primary mobile framework for premium apps. Our standard stack is Flutter + Riverpod + Dio (HTTP) + Hive (local storage) + go_router (navigation). Flutter's pixel-perfect rendering means design specs translate 1:1 to the final app.",
    },
  },

  "dart": {
    techStats: [
      { label: "Created by", value: "Google" },
      { label: "First Release", value: "2011" },
      { label: "GitHub Stars", value: "10K+" },
      { label: "Compiles To", value: "ARM + JS + Native" },
    ],
    fromScratch: {
      title: "Learning Dart for Flutter Development",
      environment: "Flutter SDK installed (includes Dart), or dart.dev for standalone",
      steps: [
        {
          step: 1,
          title: "Install Dart SDK or Use DartPad",
          command: `# Already installed with Flutter:
dart --version

# Or install standalone
brew install dart

# Try Dart in browser at:
# https://dartpad.dev/`,
          description: "If you have Flutter, you already have Dart. DartPad at dartpad.dev lets you experiment with Dart without installing anything — great for learning.",
          isCode: true,
        },
        {
          step: 2,
          title: "Learn Dart's Core Syntax",
          command: `// Variables with null safety
String name = 'ULMiND';    // non-nullable
String? optName = null;    // nullable (?)
var count = 0;             // type inferred

// Null safety operators
String city = user.address?.city ?? 'Unknown';

// Collections
List<String> tags = ['flutter', 'dart'];
Map<String, int> scores = {'alice': 95, 'bob': 87};
Set<int> unique = {1, 2, 3};

// Spread and collection-if
List<Widget> items = [
  Header(),
  if (isLoggedIn) UserAvatar(),
  ...products.map((p) => ProductCard(p)),
];`,
          description: "Dart has sound null safety — every variable is non-nullable by default. Add ? to make it nullable. The compiler catches null errors at compile time, not runtime.",
          isCode: true,
        },
        {
          step: 3,
          title: "Master Dart Classes and Mixins",
          command: `// Class with constructor shorthand
class User {
  final String name;
  final String email;
  
  // Shorthand constructor (no body needed)
  const User({required this.name, required this.email});
  
  // Factory constructor
  factory User.fromJson(Map<String, dynamic> json) {
    return User(name: json['name'], email: json['email']);
  }
  
  Map<String, dynamic> toJson() => {'name': name, 'email': email};
}

// Mixin — reusable behavior
mixin Loggable {
  void log(String message) => print('[\${runtimeType}] \$message');
}

class UserService with Loggable {
  void createUser(User user) {
    log('Creating user: \${user.name}');
  }
}`,
          description: "Dart's const constructors create compile-time constants (great for performance). Factory constructors handle object creation logic. Mixins add reusable behavior without inheritance.",
          isCode: true,
        },
        {
          step: 4,
          title: "Async Programming with Futures and Streams",
          command: `// Future — single async value
Future<User> fetchUser(int id) async {
  final response = await http.get(Uri.parse('/api/users/\$id'));
  return User.fromJson(jsonDecode(response.body));
}

// Stream — multiple async values over time
Stream<int> countdown(int from) async* {
  for (int i = from; i >= 0; i--) {
    await Future.delayed(const Duration(seconds: 1));
    yield i;  // emit value
  }
}

// Use streams in Flutter with StreamBuilder
StreamBuilder<int>(
  stream: countdown(10),
  builder: (context, snapshot) {
    return Text('T-minus: \${snapshot.data}');
  },
)`,
          description: "Future is for one-time async operations. Stream is for continuous data (WebSocket, real-time updates, sensors). async* with yield creates async generators.",
          isCode: true,
        },
        {
          step: 5,
          title: "Run Dart CLI or Flutter App",
          command: `# Run a Dart CLI script
dart run bin/my_script.dart

# Compile standalone executable
dart compile exe bin/server.dart -o server
./server  # No runtime needed!

# Run Flutter app
flutter run`,
          description: "Dart can compile to native executables — useful for CLI tools and servers. dart compile exe creates a self-contained binary that runs without Dart installed.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, understanding Dart deeply makes you a better Flutter developer. Key things we master: sound null safety, extension methods (extending existing types), isolates (Dart's multi-threading), and the collection-if/spread operators for declarative UI code.",
    },
  },

  "kotlin": {
    techStats: [
      { label: "Created by", value: "JetBrains" },
      { label: "First Release", value: "2011" },
      { label: "GitHub Stars", value: "48K+" },
      { label: "Android's Main Lang", value: "Since 2017" },
    ],
    fromScratch: {
      title: "Native Android App with Kotlin from Scratch",
      environment: "Android Studio installed (latest Stable version)",
      steps: [
        {
          step: 1,
          title: "Create an Android Project in Android Studio",
          command: `# Open Android Studio →
# New Project → Empty Activity
# Select: Kotlin, min SDK 26 (Android 8.0)
# Package: com.yourcompany.myapp

# Or create from CLI:
npx react-native-community/cli init  # (if using Kotlin via CLI tools)`,
          description: "Always choose the minimum SDK that covers your target audience (~95% of devices). SDK 26 (Android 8.0) is a solid baseline for new projects.",
          isCode: true,
        },
        {
          step: 2,
          title: "Build UI with Jetpack Compose",
          command: `// MainActivity.kt
@Composable
fun ProductCard(
    product: Product,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { onClick() },
        shape = RoundedCornerShape(16.dp),
        elevation = CardDefaults.cardElevation(4.dp)
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(
                text = product.name,
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = "₹\${product.price}",
                style = MaterialTheme.typography.bodyLarge,
                color = MaterialTheme.colorScheme.primary
            )
        }
    }
}`,
          description: "Jetpack Compose is Android's modern declarative UI toolkit. @Composable functions describe your UI. Modifier chains apply padding, click handlers, sizing, and more.",
          isCode: true,
        },
        {
          step: 3,
          title: "Use ViewModel + StateFlow for State Management",
          command: `// ProductViewModel.kt
@HiltViewModel
class ProductViewModel @Inject constructor(
    private val repository: ProductRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow<UiState>(UiState.Loading)
    val uiState: StateFlow<UiState> = _uiState.asStateFlow()

    fun loadProducts() {
        viewModelScope.launch {
            try {
                val products = repository.getProducts()
                _uiState.value = UiState.Success(products)
            } catch (e: Exception) {
                _uiState.value = UiState.Error(e.message ?: "Unknown error")
            }
        }
    }
}

// In your Composable
val uiState by viewModel.uiState.collectAsStateWithLifecycle()`,
          description: "ViewModel survives configuration changes (screen rotation). StateFlow is Kotlin's reactive stream. collectAsStateWithLifecycle() automatically manages lifecycle-aware state collection.",
          isCode: true,
        },
        {
          step: 4,
          title: "Fetch Data with Retrofit + Coroutines",
          command: `// ApiService.kt
interface ApiService {
    @GET("products")
    suspend fun getProducts(): List<Product>
    
    @POST("products")
    suspend fun createProduct(@Body product: Product): Product
}

// Create Retrofit instance
val api = Retrofit.Builder()
    .baseUrl("https://api.example.com/")
    .addConverterFactory(GsonConverterFactory.create())
    .build()
    .create(ApiService::class.java)

// Use in Repository (with coroutines)
suspend fun getProducts(): List<Product> {
    return withContext(Dispatchers.IO) {
        api.getProducts()
    }
}`,
          description: "Retrofit with Coroutines makes network calls clean and concise. suspend functions run asynchronously without blocking the main thread. Dispatchers.IO prevents the UI from freezing.",
          isCode: true,
        },
        {
          step: 5,
          title: "Build APK and Sign for Play Store",
          command: `# Generate signed APK in Android Studio:
# Build → Generate Signed Bundle/APK
# → Android App Bundle → Create keystore

# Or via command line
./gradlew bundleRelease

# APK for direct distribution
./gradlew assembleRelease

# The signed .aab file goes to:
# app/build/outputs/bundle/release/app-release.aab`,
          description: "Google Play requires an App Bundle (.aab) — it's smaller for users than APKs. Store your keystore file safely — if you lose it, you CANNOT update your app on Play Store.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our Android stack is Kotlin + Jetpack Compose + Hilt (dependency injection) + Retrofit + Room (local DB) + Navigation Component. We follow MVVM architecture to keep ViewModels testable, with Repository pattern separating network and local data sources.",
    },
  },

  "swift": {
    techStats: [
      { label: "Created by", value: "Apple" },
      { label: "First Release", value: "2014" },
      { label: "GitHub Stars", value: "67K+" },
      { label: "Compilation", value: "AOT to ARM64" },
    ],
    fromScratch: {
      title: "Building an iOS App with Swift from Scratch",
      environment: "macOS with Xcode 15+ installed from Mac App Store",
      steps: [
        {
          step: 1,
          title: "Create a New iOS Project in Xcode",
          command: `# Open Xcode → Create New Project
# → iOS → App
# Product Name: MyApp
# Interface: SwiftUI
# Language: Swift
# Include Tests: ✓

# Or use Swift Package Manager for CLI:
swift package init --name MyApp --type executable`,
          description: "Always select SwiftUI for the interface (not UIKit Storyboard). SwiftUI is Apple's modern declarative UI framework that works across iOS, macOS, watchOS, and tvOS.",
          isCode: true,
        },
        {
          step: 2,
          title: "Build UI with SwiftUI",
          command: `// ContentView.swift
import SwiftUI

struct ProductCard: View {
    let product: Product
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(product.name)
                .font(.headline)
                .fontWeight(.bold)
            
            Text("₹\\(product.price, format: .number)")
                .font(.subheadline)
                .foregroundStyle(.secondary)
        }
        .padding()
        .background(.ultraThinMaterial)
        .clipShape(RoundedRectangle(cornerRadius: 16))
        .shadow(radius: 4)
    }
}

#Preview {
    ProductCard(product: .sample)
}`,
          description: "SwiftUI's declarative syntax reads naturally. .background(.ultraThinMaterial) creates the frosted glass effect. #Preview shows live previews in Xcode instantly.",
          isCode: true,
        },
        {
          step: 3,
          title: "Manage State with @State and @Observable",
          command: `// Modern approach with @Observable (Swift 5.9+)
import Observation

@Observable
class ProductViewModel {
    var products: [Product] = []
    var isLoading = false
    var errorMessage: String?
    
    func fetchProducts() async {
        isLoading = true
        defer { isLoading = false }
        
        do {
            products = try await APIClient.shared.getProducts()
        } catch {
            errorMessage = error.localizedDescription
        }
    }
}

// In View
struct ProductListView: View {
    @State private var viewModel = ProductViewModel()
    
    var body: some View {
        List(viewModel.products) { product in
            ProductCard(product: product)
        }
        .task { await viewModel.fetchProducts() }
    }
}`,
          description: "@Observable (Swift 5.9 Observation framework) replaces ObservableObject. It's more efficient — only the UI that reads a specific property updates when it changes.",
          isCode: true,
        },
        {
          step: 4,
          title: "Fetch Data with Swift Concurrency",
          command: `// APIClient.swift
struct APIClient {
    static let shared = APIClient()
    
    func getProducts() async throws -> [Product] {
        let url = URL(string: "https://api.example.com/products")!
        
        let (data, response) = try await URLSession.shared.data(from: url)
        
        guard let httpResponse = response as? HTTPURLResponse,
              httpResponse.statusCode == 200 else {
            throw APIError.badResponse
        }
        
        return try JSONDecoder().decode([Product].self, from: data)
    }
}

// Use in ViewModel
let products = try await APIClient.shared.getProducts()`,
          description: "Swift's async/await makes asynchronous code read like synchronous code. URLSession.shared.data runs on a background thread automatically — no manual DispatchQueue needed.",
          isCode: true,
        },
        {
          step: 5,
          title: "Archive and Submit to App Store",
          command: `# In Xcode:
# 1. Product → Archive (selects Release scheme automatically)
# 2. Distribute App → App Store Connect
# 3. Upload → Automatic signing
# 4. Wait for processing in App Store Connect

# Command line with xcodebuild:
xcodebuild -workspace MyApp.xcworkspace \\
  -scheme MyApp \\
  -configuration Release \\
  -archivePath MyApp.xcarchive \\
  archive`,
          description: "iOS apps must be submitted through Xcode. Archive builds the release version. App Store Connect is Apple's portal for submitting, reviewing, and managing app releases.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our iOS stack is Swift 5.9 + SwiftUI + @Observable + Swift Concurrency (async/await) + SwiftData (Core Data replacement) for local storage. We avoid third-party dependencies when Apple's frameworks suffice — it keeps apps small and reduces security risks.",
    },
  },

  "android": {
    techStats: [
      { label: "Market Share", value: "72% globally" },
      { label: "Monthly Users", value: "3 Billion+" },
      { label: "Play Store Apps", value: "3.5M+" },
      { label: "First Release", value: "2008" },
    ],
    fromScratch: {
      title: "Native Android Development from Scratch",
      environment: "Android Studio Electric Eel or newer installed",
      steps: [
        {
          step: 1,
          title: "Set Up Android Studio and SDK",
          command: `# Download Android Studio from developer.android.com
# During setup, install:
# - Android SDK Platform 34 (Android 14) 
# - Android SDK Build-Tools
# - Android Emulator

# Verify SDK from command line:
sdkmanager --list`,
          description: "Android Studio bundles everything you need: the IDE, emulator, debugger, and profilers. Always use the latest Stable channel version for best Kotlin and Compose support.",
          isCode: true,
        },
        {
          step: 2,
          title: "Configure Gradle Dependencies",
          command: `// build.gradle.kts (app module)
dependencies {
    // Jetpack Compose BOM (manages all compose versions)
    implementation(platform("androidx.compose:compose-bom:2024.02.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.material3:material3")
    
    // Architecture components
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.7.0")
    implementation("androidx.navigation:navigation-compose:2.7.7")
    
    // Network
    implementation("com.squareup.retrofit2:retrofit:2.9.0")
    implementation("com.squareup.okhttp3:logging-interceptor:4.12.0")
    
    // DI
    implementation("com.google.dagger:hilt-android:2.50")
    kapt("com.google.dagger:hilt-compiler:2.50")
}`,
          description: "The Compose BOM (Bill of Materials) ensures all Compose libraries use compatible versions. Hilt provides compile-time dependency injection — no runtime reflection.",
          isCode: true,
        },
        {
          step: 3,
          title: "Implement MVVM Architecture",
          command: `// Data → Repository → ViewModel → UI
// This separates concerns and enables testing

// 1. Data Layer: Room Database
@Entity
data class Product(
    @PrimaryKey val id: Int,
    val name: String,
    val price: Double
)

@Dao
interface ProductDao {
    @Query("SELECT * FROM product")
    fun getAll(): Flow<List<Product>>
    
    @Insert(onConflict = REPLACE)
    suspend fun upsert(products: List<Product>)
}

// 2. Repository (combines local + remote)
class ProductRepository @Inject constructor(
    private val dao: ProductDao,
    private val api: ApiService
) {
    fun getProducts() = dao.getAll() // Emits on every DB change
    
    suspend fun sync() {
        val remote = api.getProducts()
        dao.upsert(remote)
    }
}`,
          description: "Room's Flow emits a new list every time the database changes — your UI updates automatically. This offline-first pattern syncs from network and displays local data instantly.",
          isCode: true,
        },
        {
          step: 4,
          title: "Handle Background Work with WorkManager",
          command: `// PeriodicSyncWorker.kt
class SyncWorker(context: Context, params: WorkerParameters) 
    : CoroutineWorker(context, params) {
    
    override suspend fun doWork(): Result {
        return try {
            repository.sync()
            Result.success()
        } catch (e: Exception) {
            if (runAttemptCount < 3) Result.retry()
            else Result.failure()
        }
    }
}

// Schedule periodic sync
WorkManager.getInstance(context).enqueueUniquePeriodicWork(
    "data-sync",
    ExistingPeriodicWorkPolicy.KEEP,
    PeriodicWorkRequestBuilder<SyncWorker>(1, TimeUnit.HOURS).build()
)`,
          description: "WorkManager is the recommended API for background work that needs to persist across reboots. It handles retries, constraints (network, battery), and works regardless of process lifecycle.",
          isCode: true,
        },
        {
          step: 5,
          title: "Deploy to Google Play Store",
          command: `# Build release AAB
./gradlew bundleRelease

# The output is at:
# app/build/outputs/bundle/release/app-release.aab

# Sign the bundle:
jarsigner -verbose -keystore my-release-key.jks \\
  app-release.aab alias_name

# Upload to Google Play Console:
# play.google.com/console → Create app → Release → Production`,
          description: "Android App Bundle (.aab) is required for Play Store — Google generates optimized APKs for each device configuration. Never commit your keystore to source control.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Android development follows Clean Architecture: Data Layer (Room + Retrofit) → Domain Layer (UseCases) → UI Layer (ViewModel + Compose). We use Hilt for DI, WorkManager for background sync, and Firebase Crashlytics for production crash monitoring.",
    },
  },

  "ionic": {
    techStats: [
      { label: "First Release", value: "2013" },
      { label: "GitHub Stars", value: "50K+" },
      { label: "Components", value: "100+" },
      { label: "Frameworks", value: "Angular, React, Vue" },
    ],
    fromScratch: {
      title: "Building a Hybrid App with Ionic + React",
      environment: "Node.js 18+ installed",
      steps: [
        {
          step: 1,
          title: "Install Ionic CLI and Create App",
          command: `npm install -g @ionic/cli

# Create with React + TypeScript
ionic start my-app tabs --type=react --capacitor

cd my-app && npm install`,
          description: "The Ionic CLI creates a complete hybrid app with navigation tabs. --capacitor sets up Capacitor for native device access. The tabs template is a good starting point.",
          isCode: true,
        },
        {
          step: 2,
          title: "Run in Browser with Ionic Dev Server",
          command: `ionic serve

# Opens at http://localhost:8100
# Simulates mobile UI in browser
# Hot reload enabled`,
          description: "ionic serve gives you a browser-based mobile preview. Use Chrome DevTools → Device Toolbar to simulate different phone sizes and test touch interactions.",
          isCode: true,
        },
        {
          step: 3,
          title: "Use Ionic UI Components",
          command: `// src/pages/ProductList.tsx
import { IonContent, IonHeader, IonPage,
         IonList, IonItem, IonLabel, 
         IonCard, IonCardContent, IonButton} from '@ionic/react';

const ProductList: React.FC = () => (
  <IonPage>
    <IonHeader>
      <IonToolbar>
        <IonTitle>Products</IonTitle>
      </IonToolbar>
    </IonHeader>
    <IonContent>
      <IonList>
        {products.map(product => (
          <IonItem key={product.id}>
            <IonLabel>
              <h2>{product.name}</h2>
              <p>₹{product.price}</p>
            </IonLabel>
          </IonItem>
        ))}
      </IonList>
    </IonContent>
  </IonPage>
);`,
          description: "Ionic components automatically adapt their styling to iOS (iOS style) or Android (Material Design) — write once, native feel on both platforms.",
          isCode: true,
        },
        {
          step: 4,
          title: "Access Native Device APIs via Capacitor",
          command: `npm install @capacitor/camera @capacitor/geolocation

// Access device camera
import { Camera, CameraResultType } from '@capacitor/camera';

const takeSelfie = async () => {
  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: true,
    resultType: CameraResultType.Uri
  });
  setPhotoUri(image.webPath);
};

// Get user location
import { Geolocation } from '@capacitor/geolocation';

const getLocation = async () => {
  const position = await Geolocation.getCurrentPosition();
  const { latitude, longitude } = position.coords;
};`,
          description: "Capacitor plugins give access to native APIs with a consistent JavaScript interface. The same code works on iOS, Android, and web (with web fallbacks).",
          isCode: true,
        },
        {
          step: 5,
          title: "Build Native App with Capacitor",
          command: `# Build web assets first
ionic build --prod

# Copy to native projects
npx cap sync

# Open and build in native IDEs
npx cap open ios      # Opens Xcode
npx cap open android  # Opens Android Studio

# Live reload on device (dev)
ionic cap run ios -l --external
ionic cap run android -l --external`,
          description: "Capacitor embedded a WebView in a native shell. After syncing, open the native project to build the final app. Live reload lets you iterate without rebuilding the native app each time.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Ionic is our choice when a client has an existing web team and budget constraints — one codebase for iOS, Android, and web. For premium native feel, we use Flutter or React Native. Ionic excels for internal enterprise tools where native performance isn't critical.",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // DATABASES
  // ─────────────────────────────────────────────────────────────

  "mongodb": {
    techStats: [
      { label: "Founded", value: "2007" },
      { label: "GitHub Stars", value: "26K+" },
      { label: "Downloads/month", value: "150M+" },
      { label: "Type", value: "Document DB" },
    ],
    fromScratch: {
      title: "Setting Up MongoDB from Scratch",
      environment: "Node.js 18+ and either Docker or MongoDB installed",
      steps: [
        {
          step: 1,
          title: "Run MongoDB with Docker (Easiest)",
          command: `# Start MongoDB in a container
docker run -d \\
  --name mongodb \\
  -p 27017:27017 \\
  -e MONGO_INITDB_ROOT_USERNAME=admin \\
  -e MONGO_INITDB_ROOT_PASSWORD=password \\
  mongo:7

# Connect with MongoDB Compass GUI:
# mongodb://admin:password@localhost:27017`,
          description: "Docker is the fastest way to get MongoDB running locally — no installation needed. MongoDB Compass is a free GUI tool for browsing and querying your data.",
          isCode: true,
        },
        {
          step: 2,
          title: "Connect with Mongoose in Node.js",
          command: `npm install mongoose

// src/lib/db.ts
import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI!;

let cached = global.mongoose;

export async function connectDB() {
  if (cached?.conn) return cached.conn;
  
  const conn = await mongoose.connect(MONGODB_URI, {
    dbName: 'myapp',
    maxPoolSize: 10,
  });
  
  cached = { conn, promise: null };
  return conn;
}`,
          description: "Mongoose adds schema validation and ODM features to MongoDB's driver. The connection is cached to avoid creating multiple connections in serverless environments.",
          isCode: true,
        },
        {
          step: 3,
          title: "Define a Mongoose Schema and Model",
          command: `// models/Product.ts
import { Schema, model, Document } from 'mongoose';

interface IProduct extends Document {
  name: string;
  price: number;
  category: string;
  tags: string[];
  inStock: boolean;
  createdAt: Date;
}

const productSchema = new Schema<IProduct>({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['electronics', 'clothing', 'food'] },
  tags: [String],
  inStock: { type: Boolean, default: true },
}, { timestamps: true });

// Add index for performance
productSchema.index({ name: 'text', category: 1 });

export const Product = model<IProduct>('Product', productSchema);`,
          description: "Mongoose schemas enforce structure on MongoDB's flexible documents. timestamps: true auto-adds createdAt and updatedAt. Indexes speed up queries — always index frequently queried fields.",
          isCode: true,
        },
        {
          step: 4,
          title: "CRUD Operations and Aggregation",
          command: `// CREATE
const product = await Product.create({
  name: 'iPhone 15',
  price: 79999,
  category: 'electronics',
  tags: ['apple', 'smartphone'],
});

// READ with filtering, sorting, pagination
const products = await Product.find({ 
  inStock: true,
  price: { $gte: 1000, $lte: 50000 }
})
.sort({ createdAt: -1 })
.skip((page - 1) * 20)
.limit(20)
.lean();  // Returns plain JS objects (faster)

// Aggregation Pipeline — complex analytics
const salesByCategory = await Product.aggregate([
  { $match: { inStock: true } },
  { $group: { _id: '$category', total: { $sum: '$price' }, count: { $sum: 1 } } },
  { $sort: { total: -1 } }
]);`,
          description: ".lean() returns plain objects instead of Mongoose documents — 2x faster for read-only operations. Aggregation pipelines handle complex data transformations that would require multiple queries in SQL.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use MongoDB Atlas in Production",
          command: `# 1. Create free cluster at mongodb.com/atlas
# 2. Get connection string:
# mongodb+srv://user:pass@cluster.mongodb.net/myapp

# 3. Set environment variable
MONGODB_URI=mongodb+srv://...

# 4. Test connection
atlas auth login
atlas clusters list

# Monitor with Atlas built-in dashboards:
# Performance Advisor — suggests missing indexes
# Query Profiler — finds slow queries`,
          description: "MongoDB Atlas is the cloud-hosted version with automated backups, scaling, and monitoring. The free M0 tier is perfect for development. Always use connection string from Atlas — never expose credentials in code.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use MongoDB Atlas with Mongoose for rapid-development projects and Node.js stacks. We always use MongoDB Compass to inspect data, create indexes with Atlas Performance Advisor, and run aggregation pipelines for analytics dashboards instead of separate analytics databases.",
    },
  },

  "postgresql": {
    techStats: [
      { label: "First Release", value: "1996" },
      { label: "ACID Compliant", value: "100%" },
      { label: "Extensions", value: "1000+" },
      { label: "GitHub Stars", value: "15K+" },
    ],
    fromScratch: {
      title: "PostgreSQL Database from Scratch",
      environment: "Docker for local dev, or install from postgresql.org",
      steps: [
        {
          step: 1,
          title: "Run PostgreSQL with Docker",
          command: `docker run -d \\
  --name postgres \\
  -p 5432:5432 \\
  -e POSTGRES_USER=myuser \\
  -e POSTGRES_PASSWORD=mypassword \\
  -e POSTGRES_DB=mydb \\
  -v pgdata:/var/lib/postgresql/data \\
  postgres:16

# Connect with psql
psql postgresql://myuser:mypassword@localhost:5432/mydb`,
          description: "The -v flag mounts a named volume for data persistence — data survives container restarts. Use pgAdmin or DBeaver as GUI clients for browsing your database.",
          isCode: true,
        },
        {
          step: 2,
          title: "Use Prisma ORM for Type-Safe Queries",
          command: `npm install prisma @prisma/client
npx prisma init --datasource-provider postgresql

# Set DATABASE_URL in .env:
# postgresql://myuser:mypassword@localhost:5432/mydb`,
          description: "Prisma is the modern TypeScript ORM for PostgreSQL. It generates type-safe database clients directly from your schema — autocomplete for every query.",
          isCode: true,
        },
        {
          step: 3,
          title: "Define Your Schema in schema.prisma",
          command: `// prisma/schema.prisma
model User {
  id        Int       @id @default(autoincrement())
  email     String    @unique
  name      String
  role      Role      @default(USER)
  posts     Post[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email])  // Add index
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String?
  published Boolean  @default(false)
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
}

enum Role { USER ADMIN }

# Generate migration and apply
npx prisma migrate dev --name init`,
          description: "The Prisma schema defines your database tables. @id, @unique, @default, @relation all map to PostgreSQL constraints. migrate dev creates the SQL migration files.",
          isCode: true,
        },
        {
          step: 4,
          title: "Write Type-Safe Queries",
          command: `// All queries are fully type-safe!
const prisma = new PrismaClient();

// CREATE
const user = await prisma.user.create({
  data: { email: 'user@example.com', name: 'John' },
});

// READ with relations and filtering
const posts = await prisma.post.findMany({
  where: { published: true, author: { role: 'ADMIN' } },
  include: { author: { select: { name: true, email: true } } },
  orderBy: { createdAt: 'desc' },
  take: 20,
  skip: (page - 1) * 20,
});

// UPDATE
await prisma.user.update({
  where: { id: userId },
  data: { role: 'ADMIN' },
});

// Transactions
await prisma.$transaction([
  prisma.user.update({ where: { id: 1 }, data: { name: 'Updated' } }),
  prisma.post.deleteMany({ where: { authorId: 1 } }),
]);`,
          description: "Prisma's query builder is fully type-safe — your IDE autocompletes every field name and rejects invalid queries at compile time. No SQL strings to debug.",
          isCode: true,
        },
        {
          step: 5,
          title: "Optimize with Indexes and Connection Pooling",
          command: `-- Add indexes for frequently queried columns
CREATE INDEX CONCURRENTLY idx_posts_author_id ON posts(author_id);
CREATE INDEX CONCURRENTLY idx_posts_published ON posts(published);

-- Full-text search index
CREATE INDEX idx_posts_search ON posts 
  USING gin(to_tsvector('english', title || ' ' || coalesce(content,'')));

-- Production: Use PgBouncer or Prisma Accelerate
# Connection pool (essential for serverless)
DATABASE_URL="postgres://...?pgbouncer=true&connection_limit=1"`,
          description: "CONCURRENTLY creates indexes without locking the table — safe for production. Connection pooling (PgBouncer) is essential for serverless functions that create many short-lived connections.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, PostgreSQL is our default choice for all relational data. We use Prisma in TypeScript projects (type-safe queries) and SQLAlchemy in Python. Key optimizations: always use EXPLAIN ANALYZE to debug slow queries, add partial indexes for filtered queries, and run regular VACUUM ANALYZE on busy tables.",
    },
  },

  "mysql": {
    techStats: [
      { label: "First Release", value: "1995" },
      { label: "Market Share", value: "#2 Database" },
      { label: "Used by", value: "Facebook, Twitter" },
      { label: "GitHub Stars", value: "10K+" },
    ],
    fromScratch: {
      title: "MySQL Database Setup from Scratch",
      environment: "Docker installed, or MySQL from mysql.com",
      steps: [
        {
          step: 1,
          title: "Start MySQL with Docker",
          command: `docker run -d \\
  --name mysql \\
  -p 3306:3306 \\
  -e MYSQL_ROOT_PASSWORD=rootpassword \\
  -e MYSQL_DATABASE=mydb \\
  -e MYSQL_USER=myuser \\
  -e MYSQL_PASSWORD=mypassword \\
  mysql:8.2

# Connect
mysql -h 127.0.0.1 -u myuser -pmypassword mydb`,
          description: "MySQL 8.2 added significant performance improvements. Always create a dedicated user (not root) for your application — this limits blast radius if credentials leak.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create Tables with Proper Data Types",
          command: `CREATE TABLE products (
  id          BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name        VARCHAR(255)    NOT NULL,
  price       DECIMAL(10, 2)  NOT NULL,
  description TEXT,
  category    ENUM('electronics', 'clothing', 'food'),
  is_active   BOOLEAN         NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP
                              ON UPDATE CURRENT_TIMESTAMP,
  
  PRIMARY KEY (id),
  INDEX idx_category (category),
  INDEX idx_active_price (is_active, price)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;`,
          description: "Always use InnoDB engine for ACID compliance and foreign key support. utf8mb4 supports all Unicode including emojis. DECIMAL is exact — never use FLOAT for monetary values.",
          isCode: true,
        },
        {
          step: 3,
          title: "Connect from Node.js with mysql2",
          command: `npm install mysql2 drizzle-orm drizzle-kit

// db.ts
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  connectionLimit: 10,
  waitForConnections: true,
});

export const db = drizzle(pool);`,
          description: "Use a connection pool — never create a new connection per request. connectionLimit: 10 limits simultaneous connections to avoid overwhelming MySQL.",
          isCode: true,
        },
        {
          step: 4,
          title: "Query with Drizzle ORM",
          command: `// schema.ts
export const products = mysqlTable('products', {
  id:        serial('id').primaryKey(),
  name:      varchar('name', { length: 255 }).notNull(),
  price:     decimal('price', { precision: 10, scale: 2 }).notNull(),
  isActive:  boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

// queries.ts
const allActive = await db
  .select()
  .from(products)
  .where(eq(products.isActive, true))
  .orderBy(desc(products.createdAt))
  .limit(20);`,
          description: "Drizzle ORM is a modern, type-safe alternative to Sequelize and Knex. It generates fully typed queries and supports migrations without a heavy ORM runtime.",
          isCode: true,
        },
        {
          step: 5,
          title: "Backup, Replication, and Production",
          command: `# Automated backup
mysqldump -u root -p mydb | gzip > backup_$(date +%F).sql.gz

# Restore from backup
gunzip < backup_2025-01-01.sql.gz | mysql -u root -p mydb

# Check slow queries (production diagnosis)
SET GLOBAL slow_query_log = 'ON';
SET GLOBAL long_query_time = 1; # log queries > 1 second

# View slow query log
mysqldumpslow -t 10 /var/log/mysql/mysql-slow.log`,
          description: "Regular backups are non-negotiable. Use automated mysqldump with rotation — keep daily backups for 30 days, weekly for 6 months. Enable slow query logging to find and optimize problem queries.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, MySQL is our choice for PHP/Laravel projects where MySQL has the best ecosystem support. We always enable bin logs for point-in-time recovery, use read replicas for scaling heavy read workloads, and run ProxySQL for transparent connection routing.",
    },
  },

  "redis": {
    techStats: [
      { label: "Founded", value: "2009" },
      { label: "Operations/sec", value: "1M+" },
      { label: "GitHub Stars", value: "65K+" },
      { label: "Type", value: "In-Memory DB" },
    ],
    fromScratch: {
      title: "Redis Caching and Data Structures from Scratch",
      environment: "Docker installed, or Redis from redis.io",
      steps: [
        {
          step: 1,
          title: "Start Redis with Docker",
          command: `docker run -d \\
  --name redis \\
  -p 6379:6379 \\
  redis:7-alpine

# Connect via Redis CLI
docker exec -it redis redis-cli

# Test connection
127.0.0.1:6379> PING
PONG`,
          description: "Redis Alpine image is tiny (~10MB). The redis-cli let's you run commands directly to experiment — great for learning Redis data structures.",
          isCode: true,
        },
        {
          step: 2,
          title: "Connect from Node.js with ioredis",
          command: `npm install ioredis

// lib/redis.ts
import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST ?? 'localhost',
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD,
  retryStrategy: (times) => Math.min(times * 50, 2000),
  lazyConnect: true,
});

redis.on('error', console.error);

export default redis;`,
          description: "ioredis is the most complete Redis client for Node.js. retryStrategy automatically reconnects with exponential backoff — essential for production reliability.",
          isCode: true,
        },
        {
          step: 3,
          title: "Cache API Responses",
          command: `// middleware/cache.ts
const CACHE_TTL = 60 * 5; // 5 minutes

export async function cacheMiddleware(req, res, next) {
  const key = \`cache:\${req.method}:\${req.url}\`;
  
  const cached = await redis.get(key);
  if (cached) {
    res.setHeader('X-Cache', 'HIT');
    return res.json(JSON.parse(cached));
  }

  // Override res.json to cache the response
  const originalJson = res.json.bind(res);
  res.json = (data) => {
    redis.setex(key, CACHE_TTL, JSON.stringify(data));
    res.setHeader('X-Cache', 'MISS');
    originalJson(data);
  };
  
  next();
}

// Use it on expensive routes
app.get('/api/products', cacheMiddleware, getProductsHandler);`,
          description: "Caching transforms expensive database queries (100ms+) into instant Redis lookups (< 1ms). X-Cache headers help debug cache hits in development.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use Redis for Session Storage and Rate Limiting",
          command: `// Rate limiting with Redis sliding window
async function rateLimit(key: string, limit: number, windowSec: number) {
  const now = Date.now();
  const windowStart = now - windowSec * 1000;
  
  const pipeline = redis.pipeline();
  pipeline.zadd(key, now, now.toString());         // Add current request
  pipeline.zremrangebyscore(key, 0, windowStart);  // Remove old requests
  pipeline.zcard(key);                              // Count in window
  pipeline.expire(key, windowSec);
  
  const results = await pipeline.exec();
  const requestCount = results[2][1] as number;
  
  return {
    allowed: requestCount <= limit,
    count: requestCount,
    remaining: Math.max(0, limit - requestCount),
  };
}`,
          description: "A Sorted Set (ZADD) with timestamps implements a sliding window rate limiter. Pipeline batches all commands into one round-trip — maximizing Redis throughput.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use Pub/Sub for Real-Time Events",
          command: `// Publisher (sends events)
async function publishEvent(channel: string, data: object) {
  await redis.publish(channel, JSON.stringify(data));
}

// Subscriber (receives events)
const subscriber = redis.duplicate(); // Use separate connection!

subscriber.subscribe('orders', 'notifications');

subscriber.on('message', (channel, message) => {
  const data = JSON.parse(message);
  console.log(\`Event on \${channel}:\`, data);
  
  if (channel === 'orders') {
    io.emit('new-order', data); // Forward to WebSocket clients
  }
});

// Publish from your API
await publishEvent('orders', { id: 101, status: 'confirmed' });`,
          description: "Redis Pub/Sub enables inter-service communication. Publishers don't know about subscribers — decoupled architecture. Use separate connections for subscribing and publishing.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Redis is in every production stack — for API response caching, session storage, rate limiting, job queues (with BullMQ), and real-time features via Pub/Sub. Redis Cluster provides horizontal scaling when a single instance isn't enough.",
    },
  },

  "firebase": {
    techStats: [
      { label: "Owned by", value: "Google" },
      { label: "Products", value: "18+" },
      { label: "Apps Using It", value: "3M+" },
      { label: "Free Tier", value: "Generous Spark" },
    ],
    fromScratch: {
      title: "Firebase Backend Setup from Scratch",
      environment: "Node.js 18+ and Google account",
      steps: [
        {
          step: 1,
          title: "Create Firebase Project and Install SDK",
          command: `# Install Firebase CLI
npm install -g firebase-tools

# Login with Google
firebase login

# Initialize project
firebase init
# Select: Firestore, Authentication, Functions, Hosting

# Install client SDK
npm install firebase`,
          description: "The Firebase CLI sets up your project locally with emulators for offline development. firebase init creates firebase.json and connects to your Firebase project.",
          isCode: true,
        },
        {
          step: 2,
          title: "Initialize Firebase in Your App",
          command: `// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
};

export const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);`,
          description: "Store all Firebase config in environment variables — never commit them to git. Firebase's API keys are safe to expose client-side (they're restricted by domain in the Console).",
          isCode: true,
        },
        {
          step: 3,
          title: "Firestore CRUD Operations",
          command: `import { db } from './lib/firebase';
import { collection, addDoc, getDocs,
         doc, updateDoc, deleteDoc,
         query, where, orderBy, onSnapshot } from 'firebase/firestore';

// CREATE
const docRef = await addDoc(collection(db, 'products'), {
  name: 'Product A', price: 999, inStock: true,
  createdAt: serverTimestamp(),
});

// READ (one time)
const snapshot = await getDocs(
  query(collection(db, 'products'), 
        where('inStock', '==', true),
        orderBy('createdAt', 'desc'))
);
const products = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));

// REAL-TIME LISTENER (live updates!)
const unsubscribe = onSnapshot(collection(db, 'products'), (snap) => {
  const live = snap.docs.map(d => ({ id: d.id, ...d.data() }));
  setProducts(live);
});`,
          description: "onSnapshot creates a real-time listener — your UI updates instantly when data changes in Firestore, without polling. Always call the unsubscribe function in useEffect cleanup.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Google Authentication",
          command: `import { auth } from './lib/firebase';
import { GoogleAuthProvider, signInWithPopup, signOut,
         onAuthStateChanged } from 'firebase/auth';

const provider = new GoogleAuthProvider();

// Sign in with Google
async function loginWithGoogle() {
  const result = await signInWithPopup(auth, provider);
  const user = result.user; // { uid, email, displayName, photoURL }
  return user;
}

// Listen for auth state (use in root layout)
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    setCurrentUser(user); // null if logged out
  });
  return unsubscribe;
}, []);

// Sign out
await signOut(auth);`,
          description: "Firebase Authentication handles the entire OAuth flow with Google, Apple, GitHub, and more. onAuthStateChanged persists login state across page refreshes automatically.",
          isCode: true,
        },
        {
          step: 5,
          title: "Deploy to Firebase Hosting",
          command: `# Build your app first
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting

# Deploy everything (Hosting + Functions + Rules)
firebase deploy

# Your app is live at:
# https://your-project.web.app
# https://your-project.firebaseapp.com

# Set up custom domain in Firebase Console → Hosting`,
          description: "Firebase Hosting is a global CDN with automatic SSL. Deploy with one command. Custom domains are connected via DNS records — Firebase handles certificate provisioning automatically.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Firebase is our go-to for rapid prototypes, startups, and apps that need real-time features without backend infrastructure. The Firestore + Authentication + Cloud Functions + Hosting stack can launch a production-ready app in days. We always configure Firestore Security Rules before launch.",
    },
  },

  "sqlite": {
    techStats: [
      { label: "First Release", value: "2000" },
      { label: "Deployments", value: "1 Trillion+" },
      { label: "File Based", value: "Yes" },
      { label: "Zero Config", value: "True" },
    ],
    fromScratch: {
      title: "SQLite Database Setup from Scratch",
      environment: "Any project — SQLite needs no server installation",
      steps: [
        {
          step: 1,
          title: "Install SQLite Client for Your Language",
          command: `# Node.js — use better-sqlite3 (synchronous, faster)
npm install better-sqlite3 drizzle-orm drizzle-kit
npm install -D @types/better-sqlite3

# Python — sqlite3 is built into Python!
# import sqlite3  — no installation needed`,
          description: "SQLite is embedded in your application process — no separate server to run. better-sqlite3 is the fastest Node.js SQLite driver, using synchronous APIs for simplicity.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create and Connect to a Database",
          command: `// Node.js with better-sqlite3
import Database from 'better-sqlite3';

const db = new Database('database.sqlite', {
  verbose: console.log // Log all queries in development
});

// Important performance settings
db.pragma('journal_mode = WAL');      // Better concurrent reads
db.pragma('synchronous = NORMAL');    // Safe but faster

// Python equivalent:
// import sqlite3
// conn = sqlite3.connect('database.db')
// conn.row_factory = sqlite3.Row  # Dict-style access`,
          description: "WAL (Write-Ahead Logging) mode allows concurrent reads while a write is happening. It's essentially always the right choice for applications with multiple readers.",
          isCode: true,
        },
        {
          step: 3,
          title: "Create Tables and Seed Data",
          command: `// Using Drizzle ORM for type-safe SQLite
// schema.ts
import { sqliteTable, integer, text, real } from 'drizzle-orm/sqlite-core';

export const products = sqliteTable('products', {
  id:        integer('id').primaryKey({ autoIncrement: true }),
  name:      text('name').notNull(),
  price:     real('price').notNull(),
  category:  text('category'),
  inStock:   integer('in_stock', { mode: 'boolean' }).default(true),
  createdAt: text('created_at').default(sql\`(datetime('now'))\`),
});

// Generate and run migration
npx drizzle-kit generate
npx drizzle-kit migrate`,
          description: "Drizzle with SQLite gives you type-safe queries with zero overhead. SQLite doesn't have a BOOLEAN type — use integer(mode:'boolean') which stores 0/1.",
          isCode: true,
        },
        {
          step: 4,
          title: "Perform CRUD with Prepared Statements",
          command: `// Always use prepared statements for security
const insertProduct = db.prepare(\`
  INSERT INTO products (name, price, category)
  VALUES (@name, @price, @category)
\`);

const getByCategory = db.prepare(\`
  SELECT * FROM products 
  WHERE category = ? AND in_stock = 1
  ORDER BY created_at DESC
  LIMIT ?
\`);

// Use in a transaction for bulk operations
const insertMany = db.transaction((products) => {
  for (const p of products) insertProduct.run(p);
});

insertMany([
  { name: 'Product A', price: 100, category: 'electronics' },
  { name: 'Product B', price: 200, category: 'clothing' },
]);`,
          description: "Prepared statements prevent SQL injection. Transactions batch multiple inserts into one operation — inserting 1000 rows in a transaction is 100x faster than individual inserts.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use SQLite in Production with Turso / Litestream",
          command: `# Turso — SQLite at the edge (globally distributed)
npm install @libsql/client

import { createClient } from '@libsql/client';

const db = createClient({
  url: 'libsql://your-db.turso.io',
  authToken: process.env.TURSO_TOKEN,
});

# Litestream — continuous SQLite replication to S3
# litestream replicate /app/database.sqlite s3://my-bucket/db`,
          description: "Turso extends SQLite to a distributed edge database. Litestream provides continuous backup to S3 — instant point-in-time recovery. SQLite + Turso is production-ready for millions of users.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, SQLite is our choice for mobile app local storage (via Expo SQLite) and for CLI tools. Turso makes SQLite viable for production web apps with global edge replicas. The entire libSQL + Turso stack can handle serious production workloads at a fraction of PostgreSQL's operational complexity.",
    },
  },

  "graphql": {
    techStats: [
      { label: "Created by", value: "Meta (Facebook)" },
      { label: "Open Sourced", value: "2015" },
      { label: "GitHub Stars", value: "20K+" },
      { label: "Adopted by", value: "GitHub, Shopify" },
    ],
    fromScratch: {
      title: "GraphQL API from Scratch",
      environment: "Node.js 18+ installed",
      steps: [
        {
          step: 1,
          title: "Install Apollo Server",
          command: `npm install @apollo/server graphql graphql-tag zod
npm install -D @graphql-codegen/cli @graphql-codegen/typescript`,
          description: "Apollo Server is the most popular GraphQL server for Node.js. graphql-tag parses schema strings. Zod validates inputs. graphql-codegen generates TypeScript types from your schema.",
          isCode: true,
        },
        {
          step: 2,
          title: "Define Your Schema (SDL)",
          command: `// src/schema.ts
export const typeDefs = gql\`
  type Product {
    id: ID!
    name: String!
    price: Float!
    category: String
    inStock: Boolean!
    reviews: [Review!]!
  }

  type Review {
    id: ID!
    rating: Int!
    comment: String
  }

  type Query {
    products(category: String, inStock: Boolean): [Product!]!
    product(id: ID!): Product
    searchProducts(query: String!): [Product!]!
  }

  type Mutation {
    createProduct(input: CreateProductInput!): Product!
    updateProduct(id: ID!, input: UpdateProductInput!): Product!
    deleteProduct(id: ID!): Boolean!
  }

  input CreateProductInput {
    name: String!
    price: Float!
    category: String
  }
\`;`,
          description: "The Schema Definition Language (SDL) defines your API contract. ! means non-nullable. Types, Queries (reads), and Mutations (writes) are the three root types.",
          isCode: true,
        },
        {
          step: 3,
          title: "Write Resolvers",
          command: `// src/resolvers.ts
export const resolvers = {
  Query: {
    products: async (_, { category, inStock }, { dataSources }) => {
      return dataSources.productDB.findAll({ category, inStock });
    },
    product: async (_, { id }, { dataSources }) => {
      return dataSources.productDB.findById(id);
    },
  },

  Mutation: {
    createProduct: async (_, { input }, { dataSources, user }) => {
      if (!user) throw new GraphQLError('Not authenticated',
        { extensions: { code: 'UNAUTHENTICATED' } }
      );
      return dataSources.productDB.create(input);
    },
  },

  // Field-level resolver — prevents N+1 queries with DataLoader
  Product: {
    reviews: async ({ id }, _, { loaders }) => {
      return loaders.reviews.load(id); // Batches DB calls
    },
  },
};`,
          description: "Resolvers are functions that fetch data for each field. The context object carries auth user and data sources. DataLoader batches multiple review fetches into one DB query.",
          isCode: true,
        },
        {
          step: 4,
          title: "Start the Apollo Server",
          command: `// src/index.ts
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: process.env.NODE_ENV !== 'production',
  formatError: (err) => {
    console.error(err);
    return { message: err.message, code: err.extensions?.code };
  },
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async ({ req }) => ({
    user: await getUser(req.headers.authorization),
    dataSources: { productDB: new ProductDataSource() },
  }),
});

console.log(\`🚀 GraphQL API ready at \${url}\`);`,
          description: "Disable introspection in production to prevent schema leakage. The context function runs on every request — perfect for auth and data source setup.",
          isCode: true,
        },
        {
          step: 5,
          title: "Query the API with GraphQL Client",
          command: `# Test in GraphQL Playground at http://localhost:4000

# Example query — request exactly what you need
query GetProducts {
  products(category: "electronics", inStock: true) {
    id
    name
    price
    reviews {
      rating
      comment
    }
  }
}

# Frontend: Install Apollo Client
npm install @apollo/client graphql

const GET_PRODUCTS = gql\`
  query GetProducts($category: String) {
    products(category: $category) { id name price }
  }
\`;

const { data, loading, error } = useQuery(GET_PRODUCTS, {
  variables: { category: 'electronics' }
});`,
          description: "GraphQL's killer feature: clients request exactly the fields they need — no over-fetching. The React useQuery hook provides loading, error, and data states automatically.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use GraphQL for complex product UIs where different views need different data shapes — admin dashboards, mobile apps with limited bandwidth, and systems with many interconnected entities. We always use DataLoader to solve the N+1 problem and persisted queries for production performance.",
    },
  },

  // ─────────────────────────────────────────────────────────────
  // CLOUD & DEVOPS
  // ─────────────────────────────────────────────────────────────

  "docker": {
    techStats: [
      { label: "Founded", value: "2013" },
      { label: "GitHub Stars", value: "28K+" },
      { label: "Docker Hub Images", value: "15M+" },
      { label: "Downloads", value: "13B+ pulls" },
    ],
    fromScratch: {
      title: "Containerizing an App with Docker from Scratch",
      environment: "Download Docker Desktop from docker.com",
      steps: [
        {
          step: 1,
          title: "Verify Docker Installation",
          command: `docker --version && docker run hello-world

# Output should show Docker version and
# 'Hello from Docker!' message when hello-world runs`,
          description: "docker run hello-world confirms your Docker installation works correctly. It pulls a tiny image from Docker Hub and runs it — your first container.",
          isCode: true,
        },
        {
          step: 2,
          title: "Write a Dockerfile for Your App",
          command: `# Dockerfile (in project root)
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

# Stage 2: Production image (smaller!)
FROM node:20-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY . .

# Security: don't run as root
RUN addgroup --system app && adduser --system --group app
USER app

EXPOSE 3000
CMD ["node", "dist/index.js"]`,
          description: "Multi-stage builds separate build tools from the final image — reducing image size by 60-80%. Running as a non-root user is essential for container security.",
          isCode: true,
        },
        {
          step: 3,
          title: "Build and Run Your Container",
          command: `# Build image (tag with name:version)
docker build -t my-app:1.0.0 .

# Run container
docker run -d \\
  --name my-app \\
  -p 3000:3000 \\
  -e NODE_ENV=production \\
  -e DATABASE_URL="postgresql://..." \\
  my-app:1.0.0

# Check logs
docker logs -f my-app

# Check running containers
docker ps`,
          description: "-d runs in detached (background) mode. -p 3000:3000 maps container port to host port. -e passes environment variables. docker logs -f streams live logs.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use Docker Compose for Local Development",
          command: `# docker-compose.yml
services:
  app:
    build: .
    ports: ["3000:3000"]
    environment:
      - DATABASE_URL=postgresql://postgres:password@db:5432/mydb
      - REDIS_URL=redis://cache:6379
    depends_on:
      db: { condition: service_healthy }
    volumes:
      - .:/app        # Mount code for hot reload (dev)

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s

  cache:
    image: redis:7-alpine

# Start everything
docker compose up -d`,
          description: "Docker Compose runs your entire stack locally with one command. healthcheck ensures the DB is ready before the app starts. depends_on prevents connection errors.",
          isCode: true,
        },
        {
          step: 5,
          title: "Push to Registry and Deploy",
          command: `# Push to Docker Hub
docker login
docker tag my-app:1.0.0 yourusername/my-app:1.0.0
docker push yourusername/my-app:1.0.0

# Or push to AWS ECR
aws ecr create-repository --repository-name my-app
aws ecr get-login-password | docker login --username AWS \\
  --password-stdin 123456.dkr.ecr.us-east-1.amazonaws.com
docker push 123456.dkr.ecr.us-east-1.amazonaws.com/my-app:1.0.0`,
          description: "Docker registries store and distribute images. Docker Hub is public-friendly. AWS ECR, Google Artifact Registry, and GitLab Container Registry are private options for production.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, every service we build ships as a Docker container. We use multi-stage builds to keep images under 100MB, always scan images with trivy for vulnerabilities before deployment, and use Docker Compose for local development to ensure dev/prod parity.",
    },
  },

  "kubernetes": {
    techStats: [
      { label: "Created by", value: "Google" },
      { label: "Open Sourced", value: "2014" },
      { label: "GitHub Stars", value: "108K+" },
      { label: "Used by", value: "91% of Fortune 500" },
    ],
    fromScratch: {
      title: "Deploying on Kubernetes from Scratch",
      environment: "Docker installed, kubectl and minikube or kind for local cluster",
      steps: [
        {
          step: 1,
          title: "Set Up a Local Kubernetes Cluster",
          command: `# Install kubectl (Kubernetes CLI)
brew install kubectl

# Install minikube (local cluster)
brew install minikube

# Start local cluster
minikube start --driver=docker

# Verify cluster
kubectl cluster-info
kubectl get nodes`,
          description: "minikube runs a single-node Kubernetes cluster inside Docker — perfect for local development. kubectl is the command-line tool for interacting with any Kubernetes cluster.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create a Deployment",
          command: `# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: my-app
  labels:
    app: my-app
spec:
  replicas: 3          # Run 3 identical pods
  selector:
    matchLabels:
      app: my-app
  template:
    metadata:
      labels:
        app: my-app
    spec:
      containers:
        - name: my-app
          image: yourdocker/my-app:1.0.0
          ports: [{ containerPort: 3000 }]
          resources:
            requests: { cpu: "100m", memory: "128Mi" }
            limits:   { cpu: "500m", memory: "256Mi" }
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: database-url`,
          description: "A Deployment manages a set of identical pods. replicas: 3 means 3 instances run simultaneously. Resources limits prevent one app from starving others. Secrets inject credentials safely.",
          isCode: true,
        },
        {
          step: 3,
          title: "Expose with a Service",
          command: `# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: my-app-service
spec:
  selector:
    app: my-app
  ports:
    - port: 80
      targetPort: 3000
  type: ClusterIP  # Internal-only

---
# ingress.yaml — Expose to the internet
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: my-app-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
    - host: myapp.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: my-app-service
                port: { number: 80 }`,
          description: "Services provide stable IP/DNS for pods (which can be replaced anytime). Ingress routes external HTTP traffic to services based on hostname and path.",
          isCode: true,
        },
        {
          step: 4,
          title: "Apply Manifests and Scale",
          command: `# Apply all yamls in a directory
kubectl apply -f k8s/

# Check deployment status
kubectl get pods
kubectl describe pod my-app-abc123

# Scale manually
kubectl scale deployment my-app --replicas=10

# Set up auto-scaling (HPA)
kubectl autoscale deployment my-app \\
  --cpu-percent=70 \\
  --min=3 --max=20

# Rolling update (zero-downtime deploy)
kubectl set image deployment/my-app \\
  my-app=yourdocker/my-app:2.0.0`,
          description: "kubectl scale changes replicas instantly. HPA (Horizontal Pod Autoscaler) adds/removes pods based on CPU/memory. Rolling updates replace pods one-by-one — zero downtime.",
          isCode: true,
        },
        {
          step: 5,
          title: "Monitor with kubectl and Lens",
          command: `# View logs from all pods with label
kubectl logs -l app=my-app -f

# Get resource usage
kubectl top pods
kubectl top nodes

# Debug a pod (ssh into container)
kubectl exec -it my-app-pod-abc123 -- /bin/sh

# Port-forward for local debugging
kubectl port-forward pod/my-app-abc123 3000:3000

# Install Lens IDE for visual management
# https://k8slens.dev/`,
          description: "kubectl top shows real-time CPU/memory usage. kubectl exec gets you a shell inside a running container for live debugging. Lens is a GUI that visualizes your entire cluster.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, we use managed Kubernetes (GKE, EKS, or AKS) for client deployments — no cluster management overhead. We package apps with Helm charts for reproducible deployments, use ArgoCD for GitOps continuous deployment, and Prometheus + Grafana for cluster observability.",
    },
  },

  "aws": {
    techStats: [
      { label: "Market Share", value: "33% Cloud" },
      { label: "Services", value: "200+" },
      { label: "Availability Zones", value: "105+" },
      { label: "Founded", value: "2006" },
    ],
    fromScratch: {
      title: "Deploying to AWS from Scratch",
      environment: "AWS account, AWS CLI installed and configured",
      steps: [
        {
          step: 1,
          title: "Install and Configure AWS CLI",
          command: `# Install AWS CLI v2
brew install awscli

# Configure with your credentials
aws configure
# AWS Access Key ID: [from IAM console]
# AWS Secret Access Key: [from IAM console]
# Default region: ap-south-1  (or your region)
# Default output format: json

# Verify
aws sts get-caller-identity`,
          description: "Always create an IAM user with minimum required permissions — never use your root account for day-to-day operations. Enable MFA on your root account immediately after creating it.",
          isCode: true,
        },
        {
          step: 2,
          title: "Deploy a Node.js App to Elastic Beanstalk",
          command: `# Install EB CLI
pip install awsebcli

# Initialize EB application
eb init my-app --region ap-south-1 --platform node.js-20

# Create environment and deploy
eb create production \\
  --instance-type t3.micro \\
  --min-instances 1 \\
  --max-instances 5

# Deploy code updates
eb deploy`,
          description: "Elastic Beanstalk is the easiest way to deploy web apps on AWS — it manages EC2, load balancers, auto-scaling, and health monitoring automatically.",
          isCode: true,
        },
        {
          step: 3,
          title: "Set Up S3 for File Storage",
          command: `# Create S3 bucket
aws s3 mb s3://my-app-uploads --region ap-south-1

# Enable versioning
aws s3api put-bucket-versioning \\
  --bucket my-app-uploads \\
  --versioning-configuration Status=Enabled

# Node.js upload code
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const s3 = new S3Client({ region: 'ap-south-1' });

const uploadFile = async (file: Buffer, key: string) => {
  await s3.send(new PutObjectCommand({
    Bucket: 'my-app-uploads',
    Key: key,
    Body: file,
    ContentType: 'image/jpeg',
  }));
  return \`https://my-app-uploads.s3.ap-south-1.amazonaws.com/\${key}\`;
};`,
          description: "S3 stores files with 99.999999999% durability. Generate pre-signed URLs for direct client-to-S3 uploads — avoid routing files through your server.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use RDS for Managed PostgreSQL",
          command: `# Create PostgreSQL RDS instance (via CLI)
aws rds create-db-instance \\
  --db-instance-identifier my-postgres \\
  --db-instance-class db.t3.micro \\
  --engine postgres \\
  --master-username admin \\
  --master-user-password mypassword \\
  --allocated-storage 20 \\
  --vpc-security-group-ids sg-xxxxxxxx \\
  --backup-retention-period 7

# Connection string (from RDS console):
# postgresql://admin:password@my-postgres.xxxxxx.ap-south-1.rds.amazonaws.com:5432/mydb`,
          description: "RDS manages PostgreSQL with automated backups, multi-AZ failover, and read replicas. --backup-retention-period 7 keeps 7 days of automated backups with PITR.",
          isCode: true,
        },
        {
          step: 5,
          title: "Deploy Serverless with Lambda + API Gateway",
          command: `npm install -D serverless serverless-plugin-typescript

# serverless.yml
service: my-api
provider:
  name: aws
  runtime: nodejs20.x
  region: ap-south-1

functions:
  api:
    handler: src/handler.main
    events:
      - http: { path: /, method: ANY, cors: true }
      - http: { path: /{proxy+}, method: ANY, cors: true }

# Deploy
npx serverless deploy

# Your API is automatically at:
# https://xxxxxx.execute-api.ap-south-1.amazonaws.com/`,
          description: "Lambda + API Gateway is fully serverless — you pay only when requests come in. The Serverless Framework handles packaging, deployment, and IAM roles automatically.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, our AWS architecture follows the Well-Architected Framework: VPC with private subnets for databases, ECS Fargate or Lambda for compute, RDS in Multi-AZ for database, CloudFront for CDN, and CloudWatch for centralized logging and alerting.",
    },
  },

  "google-cloud": {
    techStats: [
      { label: "Market Share", value: "11% Cloud" },
      { label: "Services", value: "150+" },
      { label: "Regions", value: "35+" },
      { label: "Founded", value: "2008" },
    ],
    fromScratch: {
      title: "Deploying to Google Cloud Platform",
      environment: "Google account, gcloud CLI installed",
      steps: [
        {
          step: 1,
          title: "Install and Configure gcloud CLI",
          command: `# Install Google Cloud SDK
brew install --cask google-cloud-sdk

# Initialize and login
gcloud init

# Create a new project
gcloud projects create my-project-id

# Set as default
gcloud config set project my-project-id`,
          description: "gcloud init guides you through authentication and project setup. Always use separate GCP projects for dev, staging, and production — for billing isolation and security.",
          isCode: true,
        },
        {
          step: 2,
          title: "Deploy to Cloud Run (Serverless Containers)",
          command: `# Build and deploy in one command!
gcloud run deploy my-app \\
  --source . \\
  --region asia-south1 \\
  --platform managed \\
  --allow-unauthenticated \\
  --set-env-vars="NODE_ENV=production" \\
  --memory=512Mi \\
  --min-instances=0 \\
  --max-instances=100

# Your app is auto-deployed at:
# https://my-app-xyz.a.run.app`,
          description: "Cloud Run deploys containers with automatic scaling to zero (you pay nothing when there's no traffic). It builds from source using Cloud Build — no Dockerfile needed for basic apps.",
          isCode: true,
        },
        {
          step: 3,
          title: "Use Cloud Storage for Files",
          command: `npm install @google-cloud/storage

const { Storage } = require('@google-cloud/storage');
const storage = new Storage();

async function uploadFile(filePath: string, destName: string) {
  const bucket = storage.bucket('my-app-uploads');
  
  await bucket.upload(filePath, {
    destination: destName,
    metadata: {
      cacheControl: 'public, max-age=31536000',
    },
  });
  
  return \`https://storage.googleapis.com/my-app-uploads/\${destName}\`;
}`,
          description: "Cloud Storage is equivalent to AWS S3 — object storage with 99.999999999% durability. Use uniform bucket-level access (not ACLs) for simpler, safer permission management.",
          isCode: true,
        },
        {
          step: 4,
          title: "Use Cloud SQL for Managed PostgreSQL",
          command: `# Create PostgreSQL instance
gcloud sql instances create my-postgres \\
  --database-version=POSTGRES_16 \\
  --tier=db-f1-micro \\
  --region=asia-south1 \\
  --root-password=mypassword

# Create database
gcloud sql databases create mydb --instance=my-postgres

# Connect via Cloud SQL Auth Proxy (secure!)
./cloud-sql-proxy my-project:asia-south1:my-postgres &
psql postgresql://postgres:mypassword@127.0.0.1:5432/mydb`,
          description: "Cloud SQL Auth Proxy encrypts database connections using IAM instead of exposing ports to the internet. It's the recommended way to connect to Cloud SQL from Cloud Run.",
          isCode: true,
        },
        {
          step: 5,
          title: "Set Up CI/CD with Cloud Build",
          command: `# cloudbuild.yaml
steps:
  - name: 'gcr.io/cloud-builders/docker'
    args: ['build', '-t', 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA', '.']
  
  - name: 'gcr.io/cloud-builders/docker'
    args: ['push', 'gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA']
  
  - name: 'gcr.io/cloud-builders/gcloud'
    args:
      - run
      - deploy
      - my-app
      - --image=gcr.io/$PROJECT_ID/my-app:$COMMIT_SHA
      - --region=asia-south1

# Trigger on push to main branch
gcloud builds triggers create github \\
  --repo-name=my-repo \\
  --branch-pattern='^main$' \\
  --build-config=cloudbuild.yaml`,
          description: "Cloud Build runs CI/CD pipelines automatically on git pushes. Each step runs in a separate Docker container. Integration with Container Registry and Cloud Run enables full GitOps.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, GCP is our go-to when clients need advanced ML/AI services (Vertex AI, Vision AI, Natural Language API) alongside their web infrastructure. Cloud Run's scale-to-zero and per-request billing makes it incredibly cost-effective for variable workloads.",
    },
  },

  "vercel": {
    techStats: [
      { label: "Founded", value: "2015" },
      { label: "Deployment Time", value: "< 30 seconds" },
      { label: "Edge Functions", value: "70+ regions" },
      { label: "Created", value: "Next.js + Vercel" },
    ],
    fromScratch: {
      title: "Deploying to Vercel from Scratch",
      environment: "GitHub account and Node.js project",
      steps: [
        {
          step: 1,
          title: "Install Vercel CLI and Login",
          command: `npm install -g vercel

# Login with GitHub/GitLab/email
vercel login

# Link current directory to a Vercel project
vercel link`,
          description: "The Vercel CLI provides instant deployments from the command line. After linking, every vercel command operates on your linked project.",
          isCode: true,
        },
        {
          step: 2,
          title: "Deploy Your First Project",
          command: `# Deploy to preview URL
vercel

# Deploy to production
vercel --prod

# Or connect GitHub for automatic deployments:
# vercel.com/new → Import Git Repository → select repo
# Every push to main auto-deploys to production
# Every PR gets a unique preview URL`,
          description: "Vercel auto-detects Next.js, React, Vue, Svelte, and 40+ other frameworks. Preview deployments for PRs let you test before merging — teams can comment directly on them.",
          isCode: true,
        },
        {
          step: 3,
          title: "Configure vercel.json",
          command: `// vercel.json
{
  "framework": "nextjs",
  "regions": ["bom1", "sin1"],
  "headers": [
    {
      "source": "/api/:path*",
      "headers": [
        { "key": "Cache-Control", "value": "no-store" },
        { "key": "X-Content-Type-Options", "value": "nosniff" }
      ]
    }
  ],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "permanent": true
    }
  ]
}`,
          description: "vercel.json configures headers, redirects, rewrites, and edge regions. regions: ['bom1'] deploys to Mumbai edge nodes — reducing latency for Indian users.",
          isCode: true,
        },
        {
          step: 4,
          title: "Set Up Environment Variables",
          command: `# Add project-level env vars via CLI
vercel env add DATABASE_URL production
vercel env add DATABASE_URL preview
vercel env add DATABASE_URL development

# Or pull env vars to local .env file
vercel env pull .env.local

# View current env vars
vercel env ls`,
          description: "Vercel manages environment variables per environment (production, preview, development). vercel env pull syncs them locally so you don't need to manually manage .env files.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use Vercel Edge Functions for Low-Latency APIs",
          command: `// app/api/hello/route.ts (Next.js App Router)
export const runtime = 'edge'; // <- This makes it an Edge Function!

export async function GET(request: Request) {
  const country = request.headers.get('x-vercel-ip-country') ?? 'Unknown';
  const city = request.headers.get('x-vercel-ip-city') ?? 'Unknown';
  
  return Response.json({
    message: \`Hello from \${city}, \${country}!\`,
    region: process.env.VERCEL_REGION,
  });
}`,
          description: "Edge Functions run JavaScript at the edge — closest to the user. They start in < 1ms (vs ~100ms for Lambda cold starts). Perfect for A/B testing, auth, geolocation, and personalization.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Vercel is our deployment platform for all Next.js and React projects. Preview deployments with comments transform our code review process — clients can review features on live previews before they merge. Vercel Analytics gives us Core Web Vitals data per route.",
    },
  },

  "netlify": {
    techStats: [
      { label: "Founded", value: "2014" },
      { label: "Sites Deployed", value: "5M+" },
      { label: "Edge Regions", value: "100+" },
      { label: "Deploy Time", value: "< 1 minute" },
    ],
    fromScratch: {
      title: "Deploying a Site to Netlify from Scratch",
      environment: "GitHub account and a static site or Jamstack project",
      steps: [
        {
          step: 1,
          title: "Install Netlify CLI",
          command: `npm install -g netlify-cli

# Login with your Netlify account
netlify login

# Initialize project
netlify init`,
          description: "The Netlify CLI handles deployments, environment variables, local development, and serverless function testing — all from your terminal.",
          isCode: true,
        },
        {
          step: 2,
          title: "Deploy from CLI or GitHub",
          command: `# Build your site first
npm run build

# Deploy (creates unique preview URL)
netlify deploy --dir=dist

# Deploy to production
netlify deploy --dir=dist --prod

# Or connect to GitHub for auto-deployments:
# netlify.com/start → Connect to GitHub → Select repo
# Auto-builds on every push, preview on PRs`,
          description: "Every branch push creates a unique deploy preview. You can share the preview URL with clients for review before the main branch deploys to production.",
          isCode: true,
        },
        {
          step: 3,
          title: "Configure netlify.toml",
          command: `# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200  # For SPA routing

[[redirects]]
  from = "/api/*"
  to = "https://api.mybackend.com/:splat"
  status = 200
  force = true

[[headers]]
  for = "/*.js"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"`,
          description: "The SPA redirect rule (200 rewrite) is essential for React Router, Vue Router etc. — it ensures client-side routing works when refreshing or deep-linking.",
          isCode: true,
        },
        {
          step: 4,
          title: "Add Netlify Functions (Serverless)",
          command: `// netlify/functions/hello.ts
import type { Handler } from '@netlify/functions';

export const handler: Handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      message: 'Hello!',
      timestamp: new Date().toISOString() 
    }),
  };
};

# Available at: /.netlify/functions/hello
# or /api/hello with redirect in netlify.toml`,
          description: "Netlify Functions are serverless Lambda functions. Put them in netlify/functions/ and they deploy automatically with your site. Perfect for form processing, webhooks, and simple APIs.",
          isCode: true,
        },
        {
          step: 5,
          title: "Set Up Custom Domain and HTTPS",
          command: `# Add custom domain via CLI
netlify domains:add myapp.com

# Or via dashboard:
# Site settings → Domain management → Add custom domain
# Netlify provisions SSL certificate automatically via Let's Encrypt

# DNS settings (add at your domain registrar):
# A    @    75.2.60.5        (Netlify load balancer)
# CNAME www  mysite.netlify.app`,
          description: "Netlify provisions SSL certificates automatically and renews them. The CDN serves your site from 100+ edge locations globally — your Indian users get content from the nearest Mumbai or Singapore edge node.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Netlify is our choice for static sites, Jamstack projects, and documentation sites. The Form handling (no backend needed), Identity (auth), and Split Testing (A/B testing) features let us ship production features without any server infrastructure.",
    },
  },

  "github-actions": {
    techStats: [
      { label: "Launched", value: "2019" },
      { label: "Free Minutes", value: "2000/month" },
      { label: "Marketplace Actions", value: "15K+" },
      { label: "Integrated with", value: "GitHub" },
    ],
    fromScratch: {
      title: "Building a CI/CD Pipeline with GitHub Actions",
      environment: "GitHub repository with your code",
      steps: [
        {
          step: 1,
          title: "Create Your First Workflow File",
          command: `# Create the workflows directory
mkdir -p .github/workflows

# Create CI workflow
touch .github/workflows/ci.yml

# Workflows are triggered by GitHub events (push, PR, schedule)
# They run on GitHub's infrastructure — no server needed`,
          description: "GitHub Actions uses YAML files in .github/workflows/. Each file is a workflow. Workflows are triggered by events like code pushes, pull requests, or schedules.",
          isCode: true,
        },
        {
          step: 2,
          title: "Write a CI Workflow for Node.js",
          command: `# .github/workflows/ci.yml
name: CI Pipeline

on:
  push: { branches: [main, develop] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: testdb
        options: >-
          --health-cmd pg_isready
          --health-interval 10s

    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      
      - run: npm run type-check
      - run: npm run lint
      - run: npm run test
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/testdb`,
          description: "This workflow runs on every push and PR. It spins up a PostgreSQL service container for integration tests. actions/cache speeds up npm ci by caching node_modules.",
          isCode: true,
        },
        {
          step: 3,
          title: "Add a Build and Docker Push Step",
          command: `# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Log in to Docker Hub
        uses: docker/login-action@v3
        with:
          username: \${{ secrets.DOCKERHUB_USERNAME }}
          password: \${{ secrets.DOCKERHUB_TOKEN }}
      
      - name: Build and Push Docker Image
        uses: docker/build-push-action@v5
        with:
          push: true
          tags: |
            myuser/my-app:latest
            myuser/my-app:\${{ github.sha }}
          cache-from: type=gha     # Use GitHub Actions cache
          cache-to: type=gha,mode=max`,
          description: "secrets.DOCKERHUB_TOKEN is stored in GitHub Settings → Secrets. The GitHub Actions cache for Docker layers speeds up builds by 50-70% after the first run.",
          isCode: true,
        },
        {
          step: 4,
          title: "Deploy to Vercel or Cloud Run After Build",
          command: `      # After Docker push (same deploy.yml)
      - name: Deploy to Cloud Run
        uses: google-github-actions/deploy-cloudrun@v2
        with:
          service: my-app
          region: asia-south1
          image: myuser/my-app:\${{ github.sha }}
          
      # Or deploy to Vercel
      - name: Deploy to Vercel
        run: vercel deploy --prod --token=\${{ secrets.VERCEL_TOKEN }}

      # Notify Slack on deployment
      - name: Notify Slack  
        uses: 8398a7/action-slack@v3
        with:
          status: \${{ job.status }}
          text: "Deployed version \${{ github.sha }} to production"
        env:
          SLACK_WEBHOOK_URL: \${{ secrets.SLACK_WEBHOOK }}`,
          description: "Chain deployment jobs after the build succeeds. Notifications keep the team informed of every deployment without manual checks.",
          isCode: true,
        },
        {
          step: 5,
          title: "Add Reusable Workflows and Matrix Testing",
          command: `# Matrix strategy — test across multiple versions
jobs:
  test:
    strategy:
      matrix:
        os: [ubuntu-latest, macos-latest]
        node: ['18', '20', '22']
    
    runs-on: \${{ matrix.os }}
    
    steps:
      - uses: actions/setup-node@v4
        with:
          node-version: \${{ matrix.node }}
      
      - run: npm test

# 6 parallel jobs total (2 OS × 3 Node versions)
# All must pass for the workflow to succeed`,
          description: "Matrix strategy runs your workflow across combinations of parameters in parallel. Useful for testing compatibility across Node.js versions, operating systems, or database versions.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, every project has a standard GitHub Actions setup: lint + type-check + test on PRs, Docker build + push + deploy to staging on develop pushes, and Docker build + push + deploy to production on main pushes. We use environments with required reviewers for production deployments.",
    },
  },

  "gitlab": {
    techStats: [
      { label: "Founded", value: "2011" },
      { label: "Users", value: "30M+" },
      { label: "Free CI Minutes", value: "400/month" },
      { label: "Type", value: "Complete DevOps" },
    ],
    fromScratch: {
      title: "GitLab CI/CD Pipeline from Scratch",
      environment: "GitLab account (SaaS or self-hosted)",
      steps: [
        {
          step: 1,
          title: "Create .gitlab-ci.yml",
          command: `# .gitlab-ci.yml — automatically detected by GitLab
stages:
  - build
  - test
  - deploy

variables:
  DOCKER_DRIVER: overlay2
  NODE_ENV: test`,
          description: ".gitlab-ci.yml in your repo root triggers CI/CD automatically. Stages run sequentially (test completes before deploy). Jobs within the same stage run in parallel.",
          isCode: true,
        },
        {
          step: 2,
          title: "Define Build and Test Jobs",
          command: `build:
  stage: build
  image: node:20-alpine
  cache:
    key: \$CI_COMMIT_REF_SLUG
    paths: [node_modules/]
  script:
    - npm ci
    - npm run build
  artifacts:
    paths: [dist/]
    expire_in: 1 week

test:
  stage: test
  image: node:20-alpine
  needs: [build]  # Run after build, parallelizes within pipeline
  services:
    - postgres:16
  variables:
    POSTGRES_DB: testdb
    POSTGRES_PASSWORD: password
  script:
    - npm run test:coverage
  coverage: '/Lines\s*:\s*(\d+\.?\d*)%/'
  artifacts:
    reports:
      coverage_report:
        coverage_format: cobertura
        path: coverage/cobertura-coverage.xml`,
          description: "needs: [build] creates a DAG (directed acyclic graph) pipeline — jobs run as soon as their dependencies complete, not when the whole stage finishes. Coverage reports show in merge requests.",
          isCode: true,
        },
        {
          step: 3,
          title: "Build and Push Docker Image",
          command: `docker-build:
  stage: build
  image: docker:24
  services:
    - docker:24-dind
  before_script:
    - docker login -u "\$CI_REGISTRY_USER" -p "\$CI_REGISTRY_PASSWORD" \$CI_REGISTRY
  script:
    - docker build -t "\$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA" .
    - docker push "\$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA"
    - |
      if [ "\$CI_COMMIT_BRANCH" = "\$CI_DEFAULT_BRANCH" ]; then
        docker tag "\$CI_REGISTRY_IMAGE:\$CI_COMMIT_SHA" "\$CI_REGISTRY_IMAGE:latest"
        docker push "\$CI_REGISTRY_IMAGE:latest"
      fi`,
          description: "GitLab has a built-in Container Registry — no external Docker Hub needed. $CI_REGISTRY, $CI_REGISTRY_USER, etc. are pre-defined variables. Tag latest only on main branch.",
          isCode: true,
        },
        {
          step: 4,
          title: "Deploy with Environments",
          command: `deploy-staging:
  stage: deploy
  image: alpine:latest
  environment:
    name: staging
    url: https://staging.myapp.com
  only:
    - develop
  script:
    - apk add --no-cache curl
    - curl -X POST \$DEPLOY_WEBHOOK_STAGING

deploy-production:
  stage: deploy
  environment:
    name: production
    url: https://myapp.com
  only:
    - main
  when: manual  # Requires human approval
  script:
    - curl -X POST \$DEPLOY_WEBHOOK_PRODUCTION`,
          description: "GitLab Environments track deployment history per environment. when: manual requires a human to click a button before production deployment — safety for production.",
          isCode: true,
        },
        {
          step: 5,
          title: "Use GitLab's Security Scanning",
          command: `# Add to .gitlab-ci.yml — GitLab auto-scans your code!
include:
  - template: Security/SAST.gitlab-ci.yml
  - template: Security/Secret-Detection.gitlab-ci.yml
  - template: Security/Dependency-Scanning.gitlab-ci.yml
  - template: Security/Container-Scanning.gitlab-ci.yml

# These templates add jobs that:
# - Scan for security vulnerabilities in code
# - Detect secrets accidentally committed
# - Check dependencies for known CVEs
# - Scan Docker images for vulnerabilities
# Results appear in Merge Request Security widget`,
          description: "GitLab's built-in security scanning is a massive advantage over GitHub Actions. Just include the templates — no configuration needed. Results show directly in merge requests.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, GitLab is our platform of choice for clients who need a self-hosted DevSecOps solution. GitLab's auto DevOps, built-in container registry, security scanning, and review apps (ephemeral environments per MR) in a single platform eliminates the integration overhead of combining GitHub + CircleCI + Snyk + Harbor.",
    },
  },

  "terraform": {
    techStats: [
      { label: "Created by", value: "HashiCorp" },
      { label: "First Release", value: "2014" },
      { label: "GitHub Stars", value: "41K+" },
      { label: "Providers", value: "3000+" },
    ],
    fromScratch: {
      title: "Infrastructure as Code with Terraform",
      environment: "Terraform CLI installed, Cloud provider account",
      steps: [
        {
          step: 1,
          title: "Install Terraform",
          command: `# macOS with Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Verify
terraform --version

# Install tfenv for version management (recommended)
brew install tfenv
tfenv install latest
tfenv use latest`,
          description: "tfenv is to Terraform what nvm is to Node.js — it manages multiple Terraform versions per project. Essential for teams with projects on different Terraform versions.",
          isCode: true,
        },
        {
          step: 2,
          title: "Create Your First Terraform Configuration",
          command: `# main.tf
terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  # Store state in S3 (not locally — for team use)
  backend "s3" {
    bucket = "my-terraform-state"
    key    = "prod/terraform.tfstate"
    region = "us-east-1"
  }
}

provider "aws" {
  region = var.aws_region
}`,
          description: "Always store Terraform state in a remote backend (S3, GCS, Terraform Cloud) — never commit tfstate files to git. Remote state enables team collaboration and state locking.",
          isCode: true,
        },
        {
          step: 3,
          title: "Define Infrastructure Resources",
          command: `# variables.tf
variable "aws_region" {
  description = "AWS region for all resources"
  type        = string
  default     = "ap-south-1"
}

variable "environment" {
  type    = string
  validation {
    condition = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be dev, staging, or prod."
  }
}

# ec2.tf
resource "aws_instance" "web" {
  ami           = data.aws_ami.ubuntu.id
  instance_type = var.environment == "prod" ? "t3.medium" : "t3.micro"
  
  tags = {
    Name        = "\${var.environment}-web-server"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}`,
          description: "Variables make configurations reusable across environments. Conditions in instance_type create different sizes for prod vs dev automatically. Always tag resources with environment and ManagedBy.",
          isCode: true,
        },
        {
          step: 4,
          title: "Init, Plan, and Apply",
          command: `# 1. Initialize providers and backends
terraform init

# 2. Format code (always before committing)
terraform fmt -recursive

# 3. Validate configuration
terraform validate

# 4. Preview changes (shows EXACTLY what will change)
terraform plan -var="environment=prod" -out=tfplan

# 5. Apply the plan
terraform apply tfplan

# Destroy all resources (careful!)
terraform destroy`,
          description: "ALWAYS run terraform plan before apply. The plan shows exactly which resources will be created, modified, or destroyed — review it carefully before approving. Use -out to save the plan and apply that exact plan.",
          isCode: true,
        },
        {
          step: 5,
          title: "Structure with Modules for Reuse",
          command: `# modules/vpc/main.tf — Reusable VPC module
resource "aws_vpc" "main" {
  cidr_block = var.cidr_block
  tags = { Name = var.name }
}

# Root main.tf — Use the module
module "production_vpc" {
  source     = "./modules/vpc"
  name       = "prod-vpc"
  cidr_block = "10.0.0.0/16"
}

module "staging_vpc" {
  source     = "./modules/vpc"
  name       = "staging-vpc"
  cidr_block = "10.1.0.0/16"
}

# Use public Terraform Registry modules
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"
  cluster_name = "my-cluster"
}`,
          description: "Modules are Terraform's reusability mechanism — define once, use everywhere. The Terraform Registry hosts community modules for EKS, GKE, RDS, and every major cloud service.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, all client infrastructure is managed with Terraform. We use separate state files per environment, tflint for static analysis, Checkov for security scanning, and Atlantis for pull-request based collaboration — team members submit Terraform changes via PR which automatically runs plan and requires approval before apply.",
    },
  },

  "nginx": {
    techStats: [
      { label: "First Release", value: "2004" },
      { label: "Market Share", value: "34% of Servers" },
      { label: "Req/second", value: "100K+" },
      { label: "Powers", value: "Netflix, Cloudflare" },
    ],
    fromScratch: {
      title: "Setting Up Nginx as Web Server and Reverse Proxy",
      environment: "Ubuntu/Debian Linux server or Docker",
      steps: [
        {
          step: 1,
          title: "Install and Start Nginx",
          command: `# On Ubuntu/Debian
sudo apt update && sudo apt install -y nginx

# Start and enable on boot
sudo systemctl start nginx
sudo systemctl enable nginx

# Verify — should see Nginx version
nginx -v

# Test configuration syntax
sudo nginx -t`,
          description: "nginx -t tests your configuration without restarting the server — always run this before reloading Nginx in production. Syntax errors won't crash your running server.",
          isCode: true,
        },
        {
          step: 2,
          title: "Configure a Static File Server",
          command: `# /etc/nginx/sites-available/mysite.conf
server {
    listen 80;
    server_name mysite.com www.mysite.com;
    
    root /var/www/mysite/dist;
    index index.html;
    
    # SPA routing — serve index.html for all paths
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets aggressively
    location ~* \\.(js|css|png|jpg|ico|svg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Gzip compression
    gzip on;
    gzip_types text/plain application/json application/javascript text/css;
}

# Enable the site
sudo ln -s /etc/nginx/sites-available/mysite.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx`,
          description: "try_files with /index.html enables client-side routing for SPAs. Aggressive caching of hashed assets (JS/CSS) is safe because filenames change when content changes.",
          isCode: true,
        },
        {
          step: 3,
          title: "Configure as a Reverse Proxy to Node.js",
          command: `# /etc/nginx/sites-available/api.conf
upstream nodejs_app {
    least_conn;  # Route to least connections
    server 127.0.0.1:3000;
    server 127.0.0.1:3001;  # Multiple app instances
}

server {
    listen 80;
    server_name api.mysite.com;
    
    location / {
        proxy_pass         http://nodejs_app;
        proxy_http_version 1.1;
        proxy_set_header   Upgrade $http_upgrade;
        proxy_set_header   Connection 'upgrade';  # WebSocket support
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout    60s;
        proxy_read_timeout    60s;
    }
}`,
          description: "least_conn balances load across multiple Node.js instances. The WebSocket headers (Upgrade, Connection) enable Socket.io and ws connections through Nginx.",
          isCode: true,
        },
        {
          step: 4,
          title: "Enable HTTPS with Let's Encrypt",
          command: `# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (modifies nginx config automatically)
sudo certbot --nginx -d mysite.com -d www.mysite.com

# Certificate auto-renews — verify renewal works
sudo certbot renew --dry-run

# Test HTTPS
curl -I https://mysite.com`,
          description: "Certbot provisions free Let's Encrypt SSL certificates and configures Nginx automatically. Certificates auto-renew every 60 days. All traffic is encrypted at no cost.",
          isCode: true,
        },
        {
          step: 5,
          title: "Harden Security Headers",
          command: `# /etc/nginx/nginx.conf — global security
http {
    # Hide Nginx version from attackers
    server_tokens off;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; ...";
    add_header Permissions-Policy "camera=(), microphone=()";
    
    # HSTS (force HTTPS for 1 year)
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains";
    
    # Rate limiting
    limit_req_zone $binary_remote_addr zone=api:10m rate=30r/m;
    
    server {
        location /api/ {
            limit_req zone=api burst=10 nodelay;
        }
    }
}`,
          description: "Security headers prevent XSS, clickjacking, MIME sniffing attacks. HSTS forces HTTPS even if users type http://. Rate limiting prevents API abuse at the Nginx level — before requests reach your Node.js process.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, Nginx sits in front of all our backend services, handling SSL termination, load balancing, static file serving, compression, and rate limiting. This means our Node.js/Python servers focus purely on business logic, while Nginx handles all the web server concerns efficiently.",
    },
  },

  "linux": {
    techStats: [
      { label: "Created by", value: "Linus Torvalds" },
      { label: "First Release", value: "1991" },
      { label: "Server Market", value: "97%+ share" },
      { label: "Distros", value: "600+" },
    ],
    fromScratch: {
      title: "Linux Server Setup from Scratch",
      environment: "A VPS from any cloud provider (AWS EC2, GCP, DigitalOcean)",
      steps: [
        {
          step: 1,
          title: "Connect and Initial Security",
          command: `# Connect via SSH
ssh ubuntu@your-server-ip

# Update all packages first
sudo apt update && sudo apt upgrade -y

# Create non-root user
sudo adduser deploy
sudo usermod -aG sudo deploy

# Copy your SSH key to new user
sudo cp -r ~/.ssh /home/deploy/
sudo chown -R deploy:deploy /home/deploy/.ssh

# Disable root login and password auth
sudo nano /etc/ssh/sshd_config
# Set: PermitRootLogin no
# Set: PasswordAuthentication no
sudo systemctl restart sshd`,
          description: "Never run applications as root. Create a dedicated deploy user with sudo for administrative tasks. Disabling password auth (SSH key only) eliminates 99% of brute-force attacks.",
          isCode: true,
        },
        {
          step: 2,
          title: "Configure the Firewall (ufw)",
          command: `# Enable UFW firewall
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow necessary ports
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose

# Allow specific IP for database (internal only!)
sudo ufw allow from 10.0.0.5 to any port 5432`,
          description: "Default deny all incoming traffic, then explicitly allow only what's needed. Never expose database ports (5432, 27017, 3306) to the public — only allow from trusted internal IPs.",
          isCode: true,
        },
        {
          step: 3,
          title: "Install Node.js with nvm",
          command: `# Install nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Reload shell
source ~/.bashrc

# Install Node.js LTS
nvm install --lts
nvm use --lts
nvm alias default lts/*

# Verify
node -v && npm -v

# Install PM2 for process management
npm install -g pm2`,
          description: "nvm manages Node.js versions on your server — easy upgrades without reinstalling. PM2 keeps your Node.js apps running, restarts them on crash, and provides log management.",
          isCode: true,
        },
        {
          step: 4,
          title: "Manage Apps with PM2",
          command: `# Start your app with PM2
pm2 start dist/index.js \\
  --name "my-api" \\
  --instances max \\   # Use all CPU cores
  -i max \\            # Cluster mode for load balancing
  --watch false

# Auto-start on server reboot
pm2 startup systemd
sudo env PATH=$PATH:/home/deploy/.nvm/... pm2 startup systemd
pm2 save

# Monitor your apps
pm2 monit              # Live monitoring dashboard
pm2 logs my-api        # View logs with streaming
pm2 status             # Quick status overview

# Zero-downtime reload
pm2 reload my-api`,
          description: "PM2 cluster mode runs multiple Node.js processes — one per CPU core — with automatic load balancing. pm2 reload performs zero-downtime restarts by gracefully cycling processes.",
          isCode: true,
        },
        {
          step: 5,
          title: "Essential Linux Commands for Debugging",
          command: `# System resources
htop                   # Interactive process viewer
df -h                  # Disk usage
free -m                # Memory usage
iostat -xz 1          # Disk I/O stats

# Networking
ss -tlnp               # Listening ports and processes
curl -I https://mysite  # Check HTTP response headers
netstat -an | grep ESTABLISHED

# Logs
tail -f /var/log/nginx/error.log
journalctl -u nginx -f  # Systemd service logs
journalctl --since "1 hour ago"

# Find running processes and kill
ps aux | grep node
kill -SIGTERM <PID>     # Graceful shutdown
kill -SIGKILL <PID>     # Force kill (last resort)`,
          description: "htop is an improved top — shows CPU/memory per process with a visual interface. journalctl is the modern way to view systemd service logs with filtering by time and service.",
          isCode: true,
        },
      ],
      proTip: "At ULMiND, all our production servers run Ubuntu LTS with automated security updates (unattended-upgrades), fail2ban for intrusion prevention, and Logwatch for daily security reports. We use Ansible for configuration management — any manual server setup is codified and reproducible.",
    },
  },
};
