# Contributing to Velorate

Thank you for your interest in contributing to Velorate.

Whether you're fixing a bug, improving documentation, adding a new feature, or proposing an enhancement, your contributions are welcome.

Please take a moment to read this guide before opening an issue or submitting a pull request.

---

# Table of Contents

- Development Setup
- Repository Structure
- Development Workflow
- Coding Guidelines
- Testing
- Documentation
- Commit Messages
- Pull Requests
- Reporting Issues

---

# Development Setup

## Prerequisites

- Node.js 18 or later
- pnpm
- Git

---

## Clone the Repository

```bash
git clone https://github.com/<your-username>/velorate.git

cd velorate
```

---

## Install Dependencies

```bash
pnpm install
```

---

## Build All Packages

```bash
pnpm build
```

---

## Run the Test Suite

```bash
pnpm test
```

Before opening a pull request, ensure all tests pass successfully.

---

# Repository Structure

```text
velorate/

packages/

├── core/
├── express/
├── fastify/
├── koa/
├── hono/
└── nestjs/

examples/

docs/

.github/
```

Each package has a single responsibility.

The core package contains all framework-independent logic.

Framework adapters should remain lightweight and delegate rate limiting behavior to the core package.

---

# Development Workflow

1. Fork the repository.
2. Create a new branch from `main`.
3. Make your changes.
4. Add or update tests if necessary.
5. Update documentation when applicable.
6. Verify the project builds successfully.
7. Submit a pull request.

---

# Coding Guidelines

Please follow the existing coding style throughout the project.

General guidelines:

- Use TypeScript.
- Prefer descriptive names.
- Keep functions focused.
- Avoid unnecessary dependencies.
- Avoid breaking public APIs without discussion.
- Keep framework adapters thin.
- Keep business logic inside the core package.

---

# Testing

Every new feature or bug fix should include appropriate tests whenever possible.

Run the full test suite before submitting a pull request.

```bash
pnpm test
```

Verify the project builds successfully.

```bash
pnpm build
```

Do not submit changes that introduce failing tests.

---

# Documentation

Documentation is part of the project.

Please update documentation whenever your contribution changes:

- Public APIs
- Configuration
- Examples
- Behavior
- User-facing features

Documentation can be found in:

```text
docs/
```

---

# Commit Messages

Use clear and descriptive commit messages.

Examples:

```text
feat(core): add sliding window improvements

fix(redis): handle ttl expiration

docs: update installation guide

test(express): improve middleware coverage

refactor(core): simplify storage interface
```

Avoid vague commit messages such as:

```text
update

changes

fix

done
```

---

# Pull Requests

Before opening a pull request, verify that:

- The project builds successfully.
- All tests pass.
- Documentation has been updated when necessary.
- No unrelated files are included.
- The change is focused on a single feature or fix.

When possible, explain:

- What changed
- Why it changed
- Any breaking changes
- Any migration steps

---

# Reporting Bugs

When reporting a bug, please include:

- Velorate version
- Node.js version
- Framework
- Operating system
- Steps to reproduce
- Expected behavior
- Actual behavior

Providing a minimal reproduction helps resolve issues more quickly.

---

# Feature Requests

Feature requests are welcome.

Please describe:

- The problem you are trying to solve
- Your proposed solution
- Alternative approaches considered
- Any additional context

---

# Questions

If you have questions about using Velorate, consider:

- Reading the documentation
- Checking the FAQ
- Opening a GitHub Discussion

---

# License

By contributing to Velorate, you agree that your contributions will be licensed under the project's MIT License.

---

Thank you for helping improve Velorate.