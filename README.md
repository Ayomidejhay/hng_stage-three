# Habit Tracker PWA

A mobile-first Progressive Web App (PWA) for tracking daily habits with deterministic local persistence, test-driven architecture, and offline support.

---

## 📌 Project Overview

This application enables users to:

* Sign up and log in using email and password
* Create, edit, and delete habits
* Mark habits as complete for the current day
* View automatically calculated streaks
* Persist data across reloads using localStorage
* Install the app as a Progressive Web App (PWA)
* Load the app shell offline without crashing

The system is intentionally **frontend-only**, emphasizing deterministic behavior, testability, and strict adherence to defined contracts.

---

## 🧱 Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **UI:** React + Tailwind CSS
* **Persistence:** localStorage
* **Testing:**

  * Vitest (Unit & Integration)
  * React Testing Library
  * Playwright (E2E)

---

## ⚙️ Setup Instructions

Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd habit-tracker
npm install
```

---

## ▶️ Run Instructions

Start the development server:

```bash
npm run dev
```

App runs on:

```
http://localhost:3000
```

---

## 🧪 Test Instructions

Run all tests:

```bash
npm run test
```

Run specific test suites:

```bash
npm run test:unit         # Unit tests with coverage
npm run test:integration  # Component/integration tests
npm run test:e2e          # End-to-end tests (Playwright)
```

---


```

### Key Principle

* `src/lib` contains **pure, deterministic functions**
* UI components orchestrate state and user interaction
* Tests validate behavior at increasing levels of abstraction

---

##  Local Persistence Structure

All application state is stored in `localStorage` using three keys:

### 1. `habit-tracker-users`

Stores registered users:

```ts
{
  id: string;
  email: string;
  password: string;
  createdAt: string;
}[]
```

---

### 2. `habit-tracker-session`

Stores the active session:

```ts
{
  userId: string;
  email: string;
} | null
```

---

### 3. `habit-tracker-habits`

Stores all habits:

```ts
{
  id: string;
  userId: string;
  name: string;
  description: string;
  frequency: 'daily';
  createdAt: string;
  completions: string[]; // YYYY-MM-DD
}[]
```

---

###  Data Relationships

* `userId` links habits to a specific user
* Only the logged-in user’s habits are rendered
* `completions` stores unique calendar dates
* No duplicate entries are allowed

---

## 🔁 Core Business Logic

Key logic is implemented in `src/lib`:

* **Slug generation** → consistent test IDs
* **Validation** → strict input enforcement
* **Streak calculation** → date-based logic
* **Completion toggling** → immutable updates

All functions are:

* Pure
* Deterministic
* Fully unit tested

---

##  PWA Implementation

The application supports installation and offline usage.

### Files

* `public/manifest.json`
* `public/sw.js`
* `public/icons/icon-192.png`
* `public/icons/icon-512.png`

---

### Features

* Installable on mobile and desktop
* App shell caching via service worker
* Offline-safe rendering after first load
* No hard crashes when offline

---

### Caching Strategy

* Cache core app shell (HTML, CSS, JS)
* Serve cached assets when offline
* No dynamic API caching (frontend-only app)

---

## 🔐 Authentication Model

Authentication is **local and deterministic**:

### Signup

* Requires email and password
* Rejects duplicate emails
* Creates user + session

### Login

* Validates credentials against stored users
* Stores session on success
* Displays error on failure

### Logout

* Clears session
* Redirects to `/login`

---

##  Habit Behavior

### Create

* Requires name
* Defaults to daily frequency
* Linked to current user

### Edit

* Updates name/description
* Preserves:

  * id
  * userId
  * createdAt
  * completions

### Delete

* Requires confirmation
* Removes habit permanently

### Complete

* Toggles today's date
* Prevents duplicates
* Updates streak immediately

---

## ♿ Accessibility

* Semantic HTML used throughout
* All inputs have labels
* Keyboard navigation supported
* Buttons use proper `<button>` elements
* Visible focus states implemented

---

##  Responsiveness

* Mobile-first design
* Fully usable at **320px width**
* Scales cleanly to tablet and desktop

---

##  Trade-offs & Limitations

### 1. No Backend

* Authentication is not secure
* Acceptable for frontend-focused testing

### 2. localStorage Persistence

* No cross-device sync
* Data can be cleared by the user

### 3. Limited PWA Caching

* Only app shell is cached
* No background sync or advanced offline features

### 4. Habit Frequency

* Only `daily` supported in this stage

---

## 🧪 Test Coverage & Strategy

The application uses a **multi-layer testing strategy**:

---

### Unit Tests (`tests/unit`)

#### `slug.test.ts`

Verifies:

* slug formatting
* whitespace handling
* character sanitization

#### `validators.test.ts`

Verifies:

* required input validation
* max length enforcement
* trimmed outputs

#### `streaks.test.ts`

Verifies:

* streak correctness
* duplicate handling
* missing-day logic

#### `habits.test.ts`

Verifies:

* completion toggling
* immutability
* duplicate prevention

---

### Integration Tests (`tests/integration`)

#### `auth-flow.test.tsx`

Verifies:

* signup flow
* duplicate email handling
* login flow
* invalid credential errors

#### `habit-form.test.tsx`

Verifies:

* validation errors
* habit creation
* editing behavior
* deletion confirmation
* streak updates on completion

---

### End-to-End Tests (`tests/e2e`)

#### `app.spec.ts`

Verifies:

* route protection
* authentication redirects
* full user flows
* persistence after reload
* offline app shell loading
* logout behavior



