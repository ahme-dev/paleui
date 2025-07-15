# PaleUI

PaleUI is a user interface library designed to provide a clean and modern look for web applications. Inspired by `shadcn/ui`, `PicoCSS`, and `DaisyUI`, it aims to deliver the best of all three worlds: a modern, minimalist design aesthetic, semantic HTML elements, and accessibility features, all without relying on JavaScript.

### Features

- **Zero JavaScript Base**: PaleUI is built with CSS only, allowing you to use it without any JavaScript dependencies. This makes it lightweight and easy to integrate into any project.
- **Sleek Modern Design**: PaleUI offers the modern and minimalist design aesthetic of `shadcn/ui` (with support for all its themes).
- **Just Semantic HTML**: The library uses semantic HTML elements and role attributes to ensure accessibility and cleaner markup, making it easier to read and maintain.
- **Modular, Small, and Fast**: PaleUI is designed to be modular, allowing you to import only the components you need. This keeps your project lightweight and fast.

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