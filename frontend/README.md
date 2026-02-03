# Learning Path Advisor - Frontend

React + TypeScript + Vite frontend for the Learning Path Advisor application. Browse learning resources, get AI-powered recommendations, and view resource details.

---

## Architecture Design

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        Learning Path Advisor Frontend                    │
├─────────────────────────────────────────────────────────────────────────┤
│  App.tsx                                                                 │
│  ├── AIRecommendation (page)                                             │
│  │   ├── Form: goal, maxItems → POST /api/ai/recommend-path              │
│  │   ├── ResourceCard (clickable) → ResourceDetail modal                 │
│  │   └── fetchResourceById for modal                                     │
│  └── ResourceTable (page)                                                 │
│      ├── Filters: search, type, difficulty, tag → GET /api/resources     │
│      ├── Table + pagination → GET /api/resources?page=&limit=            │
│      ├── View Details → GET /api/resources/:id → ResourceDetail modal    │
│      └── Sync currentPage from API response                               │
└─────────────────────────────────────────────────────────────────────────┘
```

### Component Hierarchy

```
App
├── AIRecommendation (page)
│   ├── ErrorAlert (on error)
│   ├── ResourceCard (inline, per recommendation)
│   └── ResourceDetail (modal, when resource clicked)
└── ResourceTable (page)
    ├── Filters (search, resourceType, difficulty, tag)
    ├── Table (resources list)
    ├── Pagination (Previous, page number, Next)
    └── ResourceDetail (modal, when View Details clicked)
```

### Data Flow

```
                    ┌─────────────────┐
                    │   api.ts        │  Axios HTTP client
                    │   fetchResources│  getAIRecommendations
                    │   fetchResourceById
                    └────────┬────────┘
                             │
         ┌───────────────────┼───────────────────┐
         │                   │                   │
         ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ AIRecommendation │ │ ResourceTable   │ │ ResourceDetail   │
│ - goal, maxItems │ │ - search, filters│ │ (modal)          │
│ - recommendations│ │ - resources     │ │ - full resource  │
│ - selectedResource│ │ - currentPage   │ │   from API       │
└─────────────────┘ │ - totalPages    │ └─────────────────┘
                    └─────────────────┘
```

### User Interaction Flows

#### 1. AI Recommendations Flow

```
User enters goal + maxItems → (debounced/throttled) → Click "Get Recommendations"
    → getAIRecommendations(goal, maxItems)
    → POST /api/ai/recommend-path
    → Display: summary, explanation, ResourceCards
User clicks a ResourceCard
    → fetchResourceById(id)
    → GET /api/resources/:id
    → Open ResourceDetail modal
```

#### 2. Resource Catalogue Flow

```
User types in search/filters
    → useDebounce(300ms) on search, tag
    → useEffect triggers fetchResources(q, type, difficulty, tag, page, limit)
    → GET /api/resources
    → Update: resources, totalPages, totalItems, currentPage (from API)
User clicks Previous/Next
    → handlePageChange(page)
    → useEffect fetches new page
    → Backend may clamp page → frontend syncs currentPage from response
User clicks "View Details"
    → useThrottle(500ms) on handleViewResource
    → fetchResourceById(id)
    → GET /api/resources/:id
    → Open ResourceDetail modal
```

### Frontend Structure

| Layer | Location | Purpose |
|-------|----------|---------|
| **Pages** | `src/pages/` | Top-level screens (AIRecommendation, ResourceTable) |
| **Components** | `src/components/` | Reusable UI (ResourceDetail, ErrorAlert) |
| **Services** | `src/services/api.ts` | API calls (fetchResources, getAIRecommendations, fetchResourceById) |
| **Hooks** | `src/hooks/` | useDebounce, useThrottle for input/click optimization |
| **Types** | `src/types/learningResource.ts` | TypeScript interfaces for API responses |

### Optimization Hooks

- **useDebounce** (300ms): Applied to search and tag inputs to reduce API calls while typing.
- **useThrottle** (500ms): Applied to "Get Recommendations", "View Details", and pagination buttons to prevent rapid repeated clicks.

---

## How to Run the Frontend

### Prerequisites

- Node.js (v18 or higher recommended)
- npm
- **Backend must be running** at `http://localhost:5000` (see `../backend/README.md`)

### Installation

```bash
cd frontend
npm install
```

### Start Development Server

```bash
npm run dev
```

The app runs at **http://localhost:5173** (or the next available port).

### Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

---

## Assumptions and Limitations

### Assumptions

1. **Backend availability**: The frontend expects the backend API at `http://localhost:5000/api`. The URL is hardcoded in `src/services/api.ts`. For different environments, this should be moved to environment variables (e.g. `VITE_API_URL`).

2. **API contract**: The frontend assumes the backend returns data in the expected shape:
   - `GET /api/resources` → `{ items, totalItems, totalPages, currentPage }`
   - `POST /api/ai/recommend-path` → `{ summary, resources, totalEstimatedMinutes, explanation }`
   - `GET /api/resources/:id` → Single `LearningResource` object

3. **Single-page layout**: The app is a single page with two main sections (AI Recommendation and Resource Catalogue). No client-side routing is used.

4. **No authentication**: The app does not implement user authentication or authorization.

5. **In-memory data**: The backend uses in-memory storage. Data is lost when the server restarts.

### Limitations

1. **No persistence**: Resource data (including created/updated resources) is stored in memory only. Restarting the backend clears all changes.

2. **No offline support**: The app requires an active connection to the backend. No service worker or offline caching.

3. **AI recommendations**: Recommendations are keyword-based matching, not true AI/ML. The backend matches goal keywords against resource title, description, and tags.

4. **No real-time updates**: Changes made by other users are not reflected until the page is refreshed.

5. **Limited validation**: Form validation is minimal. The backend may reject invalid requests with error responses.

6. **CORS**: If the backend does not enable CORS for the frontend origin, requests may fail in the browser.

7. **Browser support**: Targets modern browsers that support ES modules and the features used by React 19 and Vite.
