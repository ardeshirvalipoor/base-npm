# Baseline

**Baseline** is a minimal, imperative UI framework for building fast web apps. No virtual DOM, no magic, no dependencies.

## Project Structure

This repository contains both the library and a demo application:

- **`app/baseline`**: The core library package (published as `@codesuma/baseline`).
- **`app`**: The demo/test application usage.
- **`www`**: The public folder served during development.
- **`api`**: Simple backend services (if applicable).

## Getting Started

1.  **Install dependencies**:
    ```bash
    npm install
    ```

2.  **Run development server**:
    ```bash
    npm run dev
    ```

## Development

The project is set up as a monorepo-style environment. Changes in `app/baseline` are immediately reflected in the `app` demo thanks to local path mapping in `tsconfig.json`.

## License

MIT
