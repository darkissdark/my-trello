# My Trello

A Trello-like application built with React.

## Live Demo

**GitHub Pages:** [https://darkissdark.github.io/my-trello/](https://darkissdark.github.io/my-trello/)

## Features

- Create and manage boards
- Add and organize tasks
- Responsive design
- User authentication (login/register)
- Custom board backgrounds
- Drag & drop for cards and lists

## Project Structure

```
my-trello/
├── public/           # Static files and index.html
├── src/              # Source code
│   ├── api/          # API client (axios instance, interceptors)
│   ├── common/       # Shared interfaces and constants
│   ├── components/   # Reusable UI components (modals, loader, background settings, etc.)
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Application pages (Home, Board, Auth)
│   ├── store/        # Redux store and slices
│   ├── styles/       # SCSS variables and mixins
│   └── index.tsx     # App entry point
├── package.json      # Project metadata and scripts
├── tsconfig.json     # TypeScript config
├── README.md         # Project documentation
└── ...
```

### Main Folders:

- **public/** — static files, favicon, index.html
- **src/api/** — axios setup, interceptors, API logic
- **src/common/** — types (interfaces) for boards, cards, lists, users, constants
- **src/components/** — modals, loader, background settings, etc.
- **src/hooks/** — custom hooks (e.g., for title validation)
- **src/pages/** — pages: Home (boards list), Board (board with cards), Auth (login/register)
- **src/store/** — Redux store, slices for auth, loading, modal
- **src/styles/** — SCSS variables, mixins

## Getting Started

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/darkissdark/my-trello.git
   cd my-trello
   ```
2. Install dependencies:
   ```bash
   yarn install
   # or
   npm install
   ```

### Usage

- **Start development server:**

  ```bash
  yarn start
  # or
  npm start
  ```

  App will be available at [http://localhost:3000](http://localhost:3000)

- **Run tests:**

  ```bash
  yarn test
  # or
  npm test
  ```

- **Build for production:**

  ```bash
  yarn build
  # or
  npm run build
  ```

- **Deploy to GitHub Pages:**
  ```bash
  yarn deploy
  # or
  npm run deploy
  ```

## Authentication

- JWT token is used for login/registration and is stored in localStorage.
- After registration you can create boards, lists, cards, change board background, drag cards between lists.

## API

- The base API URL is set via the `REACT_APP_API_URL` environment variable.
- All requests are made via axios with automatic authorization token injection.

## License

This project is licensed under the MIT License.
