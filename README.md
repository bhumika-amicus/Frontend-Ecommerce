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
- `src/data/products.ts`

This page demonstrates:

- Product grid rendering
- Category filtering
- Multiple selected categories
- An `All` categories option
- Shared product data from `src/data/products.ts`

Assignment 4 was removed because it was no longer required. It is not available as an application route.

### Assignment route summary

| Route | Page | Source file | Purpose |
| --- | --- | --- | --- |
| `/` | Home | `src/pages/Home.tsx` | JLG parts storefront |
| `/assignment3` | Assignment 3 | `src/pages/Assignment3.tsx` | Button and Card variants |
| `/assignment5` | Assignment 5 | `src/pages/Assignment5.tsx` | Product listing and category filters |

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
- `src/data/products.ts` is the shared source of truth for product data and categories.
- `src/styles/global.css` contains global reset and root styles.
- `src/styles/shared.css` contains shared Button, Card, and section styles.
- `src/types/` contains shared TypeScript interfaces.
- `public/` contains static images and public assets.

## Architecture Notes

### Product data

Product records are stored in `src/data/products.ts` and reused by the home page and Assignment 5. Categories are derived from the same data so the filter list stays synchronized with the catalog.

### Quantity and live pricing

Each `ProductCard` owns the selected quantity for its displayed product. `QuantitySelector` is a controlled component: it receives the current quantity and reports changes through `onQuantityChange`. The product card calculates the displayed total using:

```text
product price x selected quantity
```

The quantity defaults to `1` and invalid values are corrected to `1`.

### Styling

Styles are separated into global, shared, component, and page layers. Component CSS is imported by the component it styles, while page CSS is imported by the related page.

## Validation

Before committing changes, run:

```bash
npm run build
npm run lint
```

The build runs TypeScript checking and creates the Vite production bundle. ESLint checks the source code for quality and consistency issues.
