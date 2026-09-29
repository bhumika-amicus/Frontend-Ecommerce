# JLG Industries Parts Store

A React and TypeScript storefront for browsing JLG Industries equipment parts. The application includes a responsive home page, featured-parts carousel, category filtering, reusable product cards, quantity controls, live pricing, and assignment demonstration pages.

## Contents

- [Project Features](#project-features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
- [Viewing the Application](#viewing-the-application)
- [Viewing the Assignments](#viewing-the-assignments)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Architecture Notes](#architecture-notes)
- [Validation](#validation)

## Project Features

- JLG Industries themed parts catalog and storefront content
- Responsive layout for desktop, tablet, and mobile screens
- Featured-parts carousel powered by Swiper
- Product cards with images, ratings, prices, and Add to Cart actions
- Quantity controls with increment, decrement, and direct number entry
- Live total-price calculation based on product price and quantity
- Quantity validation that prevents values below `1`
- Product category filtering on the Assignment 5 page
- Reusable Button and Card components with multiple variants
- Shared TypeScript product and component types
- Component-level and page-level CSS ownership

## Requirements

- Node.js 18 or newer
- npm, included with Node.js

## Getting Started

### 1. Install dependencies

From the project directory, run:

```bash
npm install
```

### 2. Start the development server

```bash
npm run dev
```

Vite will print the local development URL in the terminal. The default URL is:

```text
http://localhost:5173
```

The development server supports Hot Module Replacement, so changes appear in the browser as files are saved.

## Viewing the Application

After starting the development server, open the following URL:

```text
http://localhost:5173/
```

The home page contains the JLG storefront experience, including the header, hero area, product categories, featured-parts carousel, service highlights, and footer.

## Viewing the Assignments

Assignments are registered as routes in `src/App.tsx`. Start the development server first, then open each route directly in the browser.

### Assignment 3: Button and Card variants

Open:

```text
http://localhost:5173/assignment3
```

Source files:

- `src/pages/Assignment3.tsx`
- `src/pages/Assignment3.css`

This page demonstrates the reusable `Button` and `Card` components, including:

- Primary, secondary, outline, and danger button variants
- Elevated, bordered, and flat card variants

### Assignment 5: Product listing and filters

Open:

```text
http://localhost:5173/assignment5
```

Source files:

- `src/pages/Assignment5.tsx`
- `src/pages/Assignment5.css`
- `src/utils/apiUtils.ts`

This page demonstrates:

- **API Data Fetching**: Retrieves product data from a real REST API (`DummyJSON`) on component mount using `useEffect`.
- **Robust State Management**: Gracefully handles three distinct states:
  - **Loading**: Displays animated Skeleton cards while data fetches.
  - **Error / Empty States**: Catches network errors and empty search results, displaying responsive fallback UIs with a `Refresh / Try Again` button and helpful tips.
  - **Success**: Renders the complete Product Grid.
- **Advanced UI/UX Alignment**: Utilizes CSS `-webkit-line-clamp` to strictly enforce 2-line product titles, ensuring mathematically perfect horizontal alignment for all grid components across all cards.
- **Dynamic Pricing Logic**: Automatically reverse-engineers original product prices from the API's discount percentage, rendering a highly optimized, baseline-aligned pricing block (Original Strikethrough + Final Price + Discount % badge) that dynamically scales with quantity.
- **Mobile-First Responsive Design**: Transforms the desktop sidebar into a collapsible, state-driven accordion menu on mobile devices (`max-width: 768px`), and seamlessly repositions the search bar for optimal thumb reach.
- **Data Transformation**: Uses a utility layer to map external API data to internal `ProductCard` props.
- **Memory Safety**: Implements `AbortController` cleanup to cancel pending requests on unmount, preventing race conditions and memory leaks.
- **Advanced Filtering & Search**: Filters live API data by multiple categories and supports real-time text searching with dynamic quantity updates.

Assignment 4 was removed because it was no longer required. It is not available as an application route.

### Assignment route summary

| Route | Page | Source file | Purpose |
| --- | --- | --- | --- |
| `/` | Home | `src/pages/Home.tsx` | JLG parts storefront |
| `/assignment3` | Assignment 3 | `src/pages/Assignment3.tsx` | Button and Card variants |
| `/assignment5` | Assignment 5 | `src/pages/Assignment5.tsx` | Product listing and category filters |

## User Flow (Assignment 5)

When a user interacts with the application, they experience the following optimized flow:
1. **Navigation:** The user launches the application on Desktop or Mobile and navigates to the `/assignment5` route.
2. **Data Initialization:** While the live product catalog is fetched from the DummyJSON API, the user is presented with a smooth Skeleton loading state, preventing layout shift.
3. **Product Discovery:** Once loaded, the user can browse the highly-optimized product grid. Product titles are strictly truncated to ensure perfect horizontal alignment of ratings, quantity selectors, and dynamic prices.
4. **Filtering & Searching:** 
   - **Desktop:** The user can instantly filter products via the always-visible left sidebar (by Category or Sorting mechanism) and search using the Header search bar.
   - **Mobile:** The search bar seamlessly drops into the header row, and the sidebar transforms into a touch-friendly accordion dropdown to conserve screen real estate.
5. **Add to Cart:** The user can increase/decrease quantities using the custom `QuantitySelector`. The UI dynamically calculates the total price in real-time, including calculating original strikethrough prices if a product is on sale.

## Assignment 9 — Checkout Shipping Form

This assignment implements a fully responsive checkout shipping form, built in two separate stages to demonstrate the evolution of form handling in React.

### Part 1: Controlled Components (Vanilla React)
**Route:** `/Checkout1` (File: `src/pages/checkout1.tsx`)

In the first implementation, the entire form is built from scratch using pure React state. 
- **State Management:** A single `useState` hook manages the entire form data object, while separate states track user interactions (which fields have been "touched") and validation errors.
- **Validation:** A centralized validation function runs dynamically. Errors only display for fields the user has already touched, ensuring a clean initial user experience. The "Place Order" button remains disabled until all required fields pass validation.
- **Dynamic Dropdowns:** The Country, State, and City dropdowns are powered by live data from an external API (`countriesnow.space`). The state is completely reactive—if a user changes their selected Country, the dependent State and City fields automatically clear themselves and fetch the new correct values.

### Part 2: React Hook Form
**Route:** `/checkout2` (File: `src/pages/checkout2.tsx`)

The second implementation rebuilds the form using industry-standard tools: **React Hook Form**.
- **Refactored Architecture:** Manual state objects, change handlers, and blur handlers are replaced by the `useForm` and `register` hooks.
- **Performance:** Form interactions are much faster as uncontrolled inputs prevent the entire page from re-rendering on every keystroke. 
- **Validation Configuration:** The form uses `mode: 'onTouched'`, which automatically waits for the first blur event before showing errors, and then instantly re-validates on every keystroke after that. This provides the exact same high-quality UX as Part 1 but with significantly less manual code.

## Project Structure

```text
my-app/
├── public/
│   ├── hero.png
│   ├── jlg-logo.png
│   └── icons.svg
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── FeaturedProductCarousel.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── QuantitySelector.tsx
│   │   └── component CSS files
│   ├── data/
│   │   └── products.ts
│   ├── pages/
│   │   ├── Assignment3.tsx
│   │   ├── Assignment5.tsx
│   │   └── Home.tsx
│   ├── styles/
│   │   ├── global.css
│   │   └── shared.css
│   ├── types/
│   │   └── Products.ts
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
└── README.md
```

## Available Scripts

```bash
npm run dev      # Start the Vite development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build locally
```

## Project Structure and Ownership

- `src/App.tsx` owns route configuration.
- `src/main.tsx` mounts the React application and imports global styles.
- `src/components/` contains reusable UI components and their local styles.
- `src/pages/` contains route-level layouts and page-specific styles.
- `src/utils/` contains helper functions for API data transformation and type mapping.
- `src/styles/global.css` contains global reset and root styles.
- `src/styles/shared.css` contains shared Button, Card, and section styles.
- `src/types/` contains shared TypeScript interfaces.
- `public/` contains static images and public assets.

## Architecture Notes

### Product data

Product records are fetched live from the DummyJSON API (`https://dummyjson.com/products`) using native `fetch` and mapped to a shared internal interface using `apiUtils.ts`. Categories are dynamically derived from this fetched data so the filter list always stays synchronized with the live catalog.

### Quantity and live pricing

Each `ProductCard` owns the selected quantity for its displayed product. `QuantitySelector` is a controlled component: it receives the current quantity and reports changes through `onQuantityChange`. The product card calculates the displayed total using:

```text
product price x selected quantity
```

The quantity defaults to `1` and invalid values are corrected to `1`.

### Search, Filter, and Sort Pipeline

The product grid utilizes a highly optimized, strictly unidirectional, client-side data pipeline to provide instant user feedback without unnecessary network requests:

1. **State Management (The URL Bridge)**: The search functionality uses a decoupled Publisher/Subscriber pattern via the URL. The `Header` acts as the Publisher, capturing keystrokes and updating the URL (`?search=...`). `Assignment5` acts as the Subscriber, reading that URL to perform the actual product filtering. This prevents unnecessary global state re-renders while allowing users to bookmark and share specific search results.
2. **The Filter Stage (`filteredProducts`)**: On every render, the app checks the master in-memory product list against both the URL search term and the selected category checkboxes simultaneously. Only products that match *both* criteria pass through.
3. **The Sort Stage (`sortedProducts`)**: The filtered array is copied and sorted based on the selected Radio button (Name, Price, or Rating). It features smart defaults, such as automatically defaulting to `High -> Low` when a user selects Ratings.
4. **Error Boundary Resolution (Empty States)**: If the final `sortedProducts` array is empty, the UI conditionally renders highly specific Empty States explaining exactly *why* no products were found. It handles 3 distinct edge cases: (A) Search + Category mismatch, (B) Category-only mismatch, and (C) Search-only typo. All empty states provide customized advice and a unified "Try Again" button that resets the URL and clears all filters.

### Styling

Styles are separated into global, shared, component, and page layers. Component CSS is imported by the component it styles, while page CSS is imported by the related page.

## Validation

Before committing changes, run:

```bash
npm run build
npm run lint
```

The build runs TypeScript checking and creates the Vite production bundle. ESLint checks the source code for quality and consistency issues.
