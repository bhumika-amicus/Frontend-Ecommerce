# Trendify

A simple, modern e-commerce storefront built with React and TypeScript.
This project was bootstrapped with Vite and features a responsive design, product grid, and interactive UI components.

## Features

- **Modern UI**: Clean and responsive layout using custom CSS.
- **Product Catalog**: Displays a list of featured products with images, prices, and ratings.
- **Component-Based Architecture**: Organized into scalable, reusable React components (`Header`, `Hero`, `ProductGrid`, `ProductCard`, `Footer`).
- **TypeScript Support**: Strongly typed data structures for better developer experience.

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** (comes with Node.js)

## Installation

1. Clone the repository to your local machine:

	```bash
	git clone <your-github-repo-url>
	```

2. Navigate to the project directory:

	```bash
	cd my-app
	```

3. Install the dependencies:

	```bash
	npm install
	```

## Running the Application

To start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

Open your browser and visit `http://localhost:5173` to view the app.

## Building for Production

To create an optimized production build:

```bash
npm run build
```

This will compile the TypeScript code and generate static files in the `dist` directory. You can preview the production build using:

```bash
npm run preview
```

## Technologies Used

- React 19
- TypeScript
- Vite
- Custom CSS

---

# JLG Industries Parts Store

A React and TypeScript storefront for browsing JLG Industries equipment parts. The project uses Vite, reusable components, responsive CSS, product filtering, quantity controls, and a featured-parts carousel.

## Requirements

- Node.js 18 or newer
- npm

## Setup

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in a browser.

## Routes and Assignments

Routes are configured in `src/App.tsx`:

| Route | Page | Location | Purpose |
| --- | --- | --- | --- |
| `/` | Home | `src/pages/Home.tsx` | JLG parts storefront homepage |
| `/assignment3` | Assignment 3 | `src/pages/Assignment3.tsx` | Reusable Button and Card variants |
| `/assignment5` | Assignment 5 | `src/pages/Assignment5.tsx` | Product listing with category filters |

Assignment 4 was removed because it was no longer needed.

## Important Folders

- `src/components/` - Reusable UI components and their styles
- `src/data/products.ts` - Shared product catalog and category list
- `src/pages/` - Route-level pages and page-specific styles
- `src/styles/` - Global and shared styles
- `src/types/` - Shared TypeScript types
- `public/` - Public images and static assets

## Available Scripts

```bash
npm run dev      # Start the development server
npm run build    # Type-check and create a production build
npm run lint     # Run ESLint
npm run preview  # Preview the production build
```

## Technologies

- React
- TypeScript
- Vite
- React Router
- Swiper
- Lucide React
- Custom CSS
