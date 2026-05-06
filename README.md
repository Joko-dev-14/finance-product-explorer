# Finance Product Explorer

A Next.js web application that displays all financial products, organised by category. Built as part of the Finance Web Team technical task.

## Overview

The app presents a single page where users can browse the Finance product range through an interactive category carousel. Each category expands to show its products in an accessible accordion layout, with an icon and description for each product.

Content is managed via Contentful, meaning business users can add, update, or remove categories and products without any developer input. The Contentful REST API also makes the data accessible to other platforms such as a mobile app.

## Acceptance Criteria

| Criteria | Status |
|---|---|
| Business user can update the page without developer input | ✅ Contentful CMS allows non-technical users to manage content |
| Data accessible by another platform (e.g. mobile app) | ✅ Contentful REST API exposes data platform-agnostically |
| Display all product categories | ✅ Categories fetched from Contentful and rendered in carousel |
| Display all products within a category | ✅ Products rendered in accordion within each category card |
| Show an image and description for each product | ✅ Product icon and description shown on accordion expand |
| Meet UI requirements of the wireframe | ✅ Category carousel with prev/next navigation and product accordion |
| Visually appealing | ✅ Clean, modern UI with consistent styling |
| Accessible (keyboard navigable, colour contrast, semantic HTML) | ✅ ARIA roles, keyboard navigation, semantic HTML implemented |
| A working solution that can be run locally | ✅ |
| Pushed the project to a GitHub repository | ✅ |
| A README with a short description of your project, how to run it, and any access to third-party software required to update the site | ✅ |


## Key Requirements Met

### Business User Updateable
Content is fully managed in Contentful, a headless CMS with a non-technical editing interface. A business user can add, edit, or remove categories and products at any time without touching the codebase.

### Multi-Platform Data Access
Contentful exposes all product and category data via a REST API, meaning the same content can be consumed by any platform — web, mobile, or otherwise — without duplication.

### Component Architecture
Built with atomic design principles (`atoms`, `molecules`, `organisms`), for maintainability and extensibility and making it straightforward to add new product types, categories, or UI variations without restructuring the codebase.

### Accessibility First
The interface is fully keyboard navigable, uses semantic HTML throughout, and implements ARIA roles and attributes on all interactive elements including the category carousel and product accordion.

### Tested
Unit and integration tests cover the core user interactions — expanding and collapsing products, navigating between categories, and rendering data correctly from mock Contentful responses.

## Tech Stack

- **Next.js** (App Router)
- **React**
- **Contentful** (headless CMS) 
- **CSS Modules**
- **Jest** + **React Testing Library**

## Getting Started

### Prerequisites

- Node.js 18+
- npm
- A Contentful account (free tier is sufficient)

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd <your-repo-name>
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up Contentful

You will need a Contentful space with the following content types:

#### Product
| Field | Type |
|---|---|
| `name` | Short text |
| `description` | Long text |
| `image` | Media (single file) |

#### Category
| Field | Type |
|---|---|
| `name` | Short text |
| `products` | References, many → Product |

Once your content types and entries are created and published, retrieve your API credentials from **Settings → API Keys** in Contentful.

### 4. Configure environment variables

Create a `.env.local` file in the project root:
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_content_delivery_api_token

Use the **Content Delivery API** access token, not the Content Management Token.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Running Tests

```bash
npm test
```

## Project Structure

app/                        # Next.js App Router
layout.jsx                # Root layout with header
page.jsx                  # Main page, fetches categories server-side
globals.css               # Global styles
src/
api/
contentfulClient.js     # Contentful SDK client
getCategories.js        # Data fetching function
types/
contentful.ts           # Contentful data type definitions
ui/
components/
atoms/
ProductRow.jsx      # Expandable product accordion row
molecules/
CategoryCard.jsx    # Category card, active and inactive states
organisms/
CategoryCarousel.jsx # Category carousel with navigation
Header.jsx          # Site header
tests/
ProductRow.test.jsx
CategoryCard.test.jsx
CategoryCarousel.test.jsx

## Architectural Decisions

- **Contentful** was chosen as the CMS to allow non-technical users to manage content without developer involvement, and to expose product data via a REST API for use by other platforms such as a mobile app. Also quicker to implement compared the GraphQL due to the time constraints
- **Next.js App Router** with async server components is used to fetch Contentful data server-side, keeping API credentials off the client and improving initial page load.
- **Atomic design** (`atoms`, `molecules`, `organisms`) structures the component hierarchy for maintainability and extensibility as the product range grows.
- **CSS Modules** provide scoped, conflict-free styles per component.

## Accessibility

- Skip to main content link for keyboard users
- Semantic HTML (`<header>`, `<section>`, `<article>`)
- ARIA roles and attributes on carousel (`tablist`, `tab`, `tabpanel`) and accordion (`aria-expanded`, `aria-controls`)
- Keyboard navigable — inactive categories activatable with `Enter` or `Space`
- Colour contrast reviewed against WCAG AA guidelines

## Time Constraints

This project was completed within a 3 hour time limit. The following were prioritised in order of importance:

1. Contentful setup and data fetching
2. Core UI components matching the wireframe
3. Mobile responsive view
4. Accessibility
5. Tests
6. Optimised images/assets
7. Tested adding new products to contentful as a business user
8. README

Given more time I would have converted the project to TypeScript and added loading and error states for the Contentful fetch.

## Use of AI

AI tooling was used to assist with parts of this project to help save time due to the projects time constraints and my Dyslexia.
e.g. the text heavy sections:
- README.file
- Setting up the CMS schema for Contentful
- Writing the unit tests
All generated content has been reviewed, understood, and adapted where necessary. 
I am able to explain, maintain, debug, and extend every aspect of the solution.

## Future Improvements if had more time

- Convert to TypeScript for stronger type safety
- Add loading and error states for the Contentful fetch
- Contentful staging environment for safe content updates
- Convert CSS to Tailwind CSS
- Improve UI to make it even more visually appealing
- Accordion open/close animation
- Expand test coverage to include end-to-end tests
- Convert from Contentful to GraphQL Restful API
- Optimisation improvements - testing in lighthouse /dev tools
