# PaleUI

PaleUI is a user interface library designed to provide a clean and modern look for web applications. Inspired by `shadcn/ui`, `PicoCSS`, and `DaisyUI`, it aims to deliver the best of all three worlds: a modern, minimalist design aesthetic, semantic HTML elements, and accessibility features, all without relying on JavaScript.

### Features

- **Zero JavaScript Base**: PaleUI is built with CSS only, allowing you to use it without any JavaScript dependencies. This makes it lightweight and easy to integrate into any project.
- **Sleek Modern Design**: PaleUI offers the modern and minimalist design aesthetic of `shadcn/ui` (with support for all its themes).
- **Just Semantic HTML**: The library uses semantic HTML elements and role attributes to ensure accessibility and cleaner markup, making it easier to read and maintain.
- **Modular, Small, and Fast**: PaleUI is designed to be modular, allowing you to import only the components you need. This keeps your project lightweight and fast.

### Usage

PaleUI can be installed via a package manager, or included directly in your HTML.

#### Install via npm

```bash
npm install paleui
```

Then import the styles you need. You can import everything at once or only specific components:

```css
@import "paleui/lib/all.css";       /* Everything */

@import "paleui/lib/button.css";    /* Buttons */
@import "paleui/lib/card.css";      /* Cards */
```

#### Include via CDN

For quick prototyping or static sites, include PaleUI directly from a CDN:

```html
<link rel="stylesheet" href="https://unpkg.com/paleui/lib/all.css">

<link rel="stylesheet" href="https://unpkg.com/paleui/lib/main.css">
<link rel="stylesheet" href="https://unpkg.com/paleui/lib/button.css">
```

#### Theming

PaleUI uses the same CSS variables as `shadcn/ui`, so any shadcn theme works out of the box. To use a custom theme, override the CSS variables in your stylesheet after importing PaleUI:

```css
@import "paleui/lib/all.css";

:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --input: oklch(0.922 0 0);
  --ring: oklch(0.808 0 0);
  --radius: 0.625rem;
  /* ... other variables */
}
```

For dark mode, add the `dark` class to any parent element (typically `<html>` or `<body>`) and define dark variants:

```css
.dark {
  --background: oklch(0.115 0 0);
  --foreground: oklch(0.985 0 0);
  /* ... other dark mode variables */
}
```

### Goals 

Note: this is an early draft, and will likely be updated somewhat until a stable release is made.

PaleUI has several aims, and they come in order of priority, where an aim is ignored if it conflicts with any above it:  

#### 1. Use CSS only.

JavaScript is necessary for many things, but a modern, semantic, and accessible UI foundation is not one of them. It should be possible to have a nearly complete set of components that can be used without any additional JavaScript, and that can be used with any JavaScript framework or library, across browsers and devices.

Obviously JavaScript or any abstraction over it is required for complex interactivity and dynamic behavior when using these components: client-side validation with custom error messages, real-time data updates, drag-and-drop interactions, complex animations, dynamic content loading, and state management across components. But this doesn't mean that just by adding the UI library, you have to include 100KBs of JavaScript.

PaleUI will not include any JavaScript, and will do its best to minimize the amount that the user will need to write when it's needed.

#### 2. Enforce semantic HTML elements and accessibility features.

Using semantic HTML elements, role attributes, and ARIA attributes make writing UI much more accessible and cleaner to look at than class-heavy markup. This approach also ensures that the components are accessible to all users, including those using assistive technologies like screen readers.

PaleUI will use semantic HTML elements whenever possible, and role attributes if semantic elements are not available. Even in examples, ARIA attributes will be included to encourage their use and demonstrate proper accessibility practices.

#### 3. Support older browsers.

Not all users have the latest browsers, or even devices that support those. At the very least UI libraries should support the "widely available" baseline (as defined by [Baseline](https://web.dev/baseline/) - features supported across all major browsers for at least 30 months), and even older whenever possible. Features can be polyfilled and alternatives are often possible.

PaleUI will support older browsers, at the minimum the "widely available" baseline, and will provide alternative builds and polyfills when possible for older browsers.

#### 4. Maintain compatibility with `shadcn/ui` themes and include the components it provides.

PaleUI will stay compatible with `shadcn/ui` themes, and provide all the components it provides to cover the same use cases.

#### 5. Keep distribution small and modular.

PaleUI will be distributed both as a single file and as multiple files to use in a modular way. The user shouldn't be forced to include parts they don't need. 

#### 6. Support usage in modern Javascript frameworks.

PaleUI will not be just a library for plain HTML, backends, and non-JavaScript frameworks. It will also support usage in modern JavaScript frameworks like React, Vue, and Svelte, providing a light alternative with the same familiar design that those developers expect.

### Contributing

Contributions to PaleUI are welcome. The project uses a monorepo structure and is built with the following:

- *Bun* - Runtime and package manager
- *Sass* - CSS preprocessor for writing modular styles
- *PostCSS* with Autoprefixer - Ensures browser compatibility
- *Biome* - Linter and formatter
- *Playwright* - End-to-end testing

#### Structure

The monorepo contains two packages:

- `packages/paleui` - Core CSS library (Sass source in `src/`, compiled output in `lib/`)
- `packages/site` - Documentation site (build scripts in `scripts/`, built output in `dist/`)

#### Setup

The setup can be achieved in two main ways:

*1. Dev Container:* Open in VS Code and use "Dev Containers: Reopen in Dev Container". Includes Bun, Biome, and Playwright pre-configured.

*2. Local:* Install Bun (v1.0 or later), clone the repo, and install the packages. Playwright must also be set up on the device along with required browsers, unless Docker is available to spin up the preconfigured image.

#### Tasks

*Development:*
- `bun run dev` - Start development mode (library + site)
- `bun run lib:dev` - Watch and build library only
- `bun run site:dev` - Watch and build site only

*Building:*
- `bun run dist` - Build both library and site for production
- `bun run lib:dist` - Build library for production
- `bun run site:dist` - Build site for production

*Testing and Formatting:*
- `bun run test:run` - Run Playwright tests (local + devcontainer)
- `bun run test:run:docker-up` - Run Playwright tests in container (local, but using docker for tests)
- `bun run test:run:ui` - Run Playwright tests with UI (local)
- `bun run test:update` - Update Playwright snapshots (local + devcontainer)
- `bun run test:report` - Check test report (local, in devcontainer it's auto setup on :9323 so not needed)
- `bun run fix` - Run Biome to lint and format code

#### Committing

The project follows conventional commit conventions:
- `feat` - New feature or enhancement for the lib
- `fix` - Bug fix for the lib
- `docs` - Changes to the site or other forms of documentation
- `test` - Test modifications
- `chore` - Maintenance tasks, configuration, or tooling changes