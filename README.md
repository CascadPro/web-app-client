<div align="center">

# Cascade Pro — Web App Client

**The frontend application for Cascade Pro.**

Built with Next.js, React, TypeScript, and Tailwind CSS.

[Repository](https://github.com/CascadPro/web-app-client) · [Backend API](https://github.com/CascadPro/api-golang-server)

</div>

---

## Overview

`web-app-client` is the web client for **Cascade Pro**, built with the Next.js App Router and designed to work with the Cascade Pro Go API.

The application includes authentication flows, protected sections, user profile and settings interfaces, requests and sessions, and a responsive UI. It also uses client-side caching and persistence for supported query data.

## Tech stack

| Technology | Purpose |
| --- | --- |
| [Next.js](https://nextjs.org/) | React framework and App Router |
| [React](https://react.dev/) | UI |
| [TypeScript](https://www.typescriptlang.org/) | Static typing |
| [Tailwind CSS v4](https://tailwindcss.com/) | Styling |
| [TanStack Query](https://tanstack.com/query/latest) | Server-state management and caching |
| [Zustand](https://zustand.docs.pmnd.rs/) | Client-side state |
| [Axios](https://axios-http.com/) | HTTP requests |
| [Orval](https://orval.dev/) | API client/type generation |
| [Motion](https://motion.dev/) | UI animations |
| [next-themes](https://github.com/pacocoursey/next-themes) | Theme management |
| [Zod](https://zod.dev/) | Schema validation |
| [React Hook Form](https://react-hook-form.com/) | Form state management |
| [Bun](https://bun.sh/) | Package manager and scripts |

## Features

- **Authentication** — frontend authentication flows integrated with the backend API.
- **Protected pages** — authenticated sections for the main application.
- **Requests and sessions** — dedicated application areas for working with requests and sessions.
- **Profile and settings** — user-facing profile and preferences.
- **API integration** — Axios-based requests and generated API types/client code.
- **Server-state management** — TanStack Query for fetching, caching, and updating server data.
- **Persistent query cache** — persistence for supported query data.
- **Responsive interface** — layouts and interactive components designed for desktop and mobile.
- **Themes and motion** — theme support, transitions, and reduced-motion considerations.
- **Progressive Web App groundwork** — web app manifest and service-worker support.

## Requirements

- [Bun](https://bun.sh/) **1.4.0**
- A running instance of the [Cascade Pro API](https://github.com/CascadPro/api-golang-server)

Check your Bun version:

```bash
bun --version