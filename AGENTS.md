# AI Agent Directives & Code Conventions

This document provides context, conventions, and guidelines for AI coding agents working on the **Owner Statements** repository.

---

## 1. Project Context

- **Domain:** Property Management & Owner Financial Statements
- **Stack:** Next.js (App Router), TypeScript, Tailwind CSS
- **Design Philosophy:** High-density, modern SaaS aesthetic inspired by Stripe/Vercel (compact padding, refined micro-typography, clean borders).

---

## 2. Directory Structure & Responsibilities

- `app/`: Next.js App Router routes, page layouts, and global styles (`globals.css`).
- `components/`: Pure presentation or client components. Keep them focused and modular.
- `data/`: Mock data definitions (`dummyData.ts`) used during development.
- `types/`: Core TypeScript interfaces and type declarations (`dashboard.ts`).
- `utils/`: Shared utility functions, constants (`constants.ts`), and helpers.

---

## 3. Core Coding Rules

1. **TypeScript First:** Always provide strict types for props, states, and function returns. Avoid using `any`.
2. **Tailwind Styling:**
   - Maintain the high-density layout paradigm (`max-w-5xl`, compact padding like `p-3`, `p-4`, and small typography like `text-xs`, `text-sm`).
   - Use soft subtle borders (`border-gray-200/80`) and low-blur shadows (`shadow-2xs`).
3. **Icons & Controls:**
   - Use inline SVG icons or standard icon libraries rather than bulky text-only buttons in table rows/actions.
   - Keep interactive controls responsive with hover and active states (`active:scale-95 transition-all`).
4. **Client Components:** Mark interactive UI files with `'use client';` at the top. Keep server components clean when backend integration is introduced.

---

## 4. Workflows & State Management

- Use standard Next.js state mechanisms (`useState`, `useMemo`) for local filter, search, and client-side calculations.
- Future backend updates should preserve existing component prop signatures whenever possible to avoid interface breaking changes.