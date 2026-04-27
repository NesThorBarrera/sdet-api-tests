# SDET API Test Challenge

This repository contains an automated API test suite built using Playwright-TypeScript to validate the endpoints defined in `sdet_challenge_api.yml`.

---

- Playwright (API Testing)
- TypeScript
- Node.js
- GitHub Actions (CI/CD)

---

# Project Structure:
- tests/: Contains all API test cases
- playwright.config.ts: Configuration for test execution
- bugs.md: Documented issues found during testing
- .github/workflows: CI pipeline configuration

---

# Setup & Execution
## Install dependencies:
- gitbash - npm ci

## Run Tests locally:
- npx playwright test tests/users.spec.ts

## Run tests with HTML report:
- npx playwright test tests/users.spec.ts --reporter=html
- npx playwright show-report

---

# Environments
The test suite supports two environments:
- DEV
- PROD

## Environment is controlled via:
- API_ENV=dev
- API_ENV=prod
### Example:
- API_ENV=dev npx playwright test
- API_ENV=prod npx playwright test

---

# Test Coverage

The suite covers:

## GET
- Retrieve all users
- Retrieve user by email
- Validate non-existing user

## POST
- Create user
- Missing fields validation
- Invalid age scenarios
- Invalid email format
- Duplicate email validation

## DELETE
- Delete user with valid auth
- Missing auth validation
- Non-existing user validation

## PUT
- Update user scenarios (if applicable)

---

# Bugs Identified

All discovered discrepancies between expected and actual API behavior are documented in:
bugs.md

Summary of issues:
- Invalid email is accepted → returns 201 instead of 400
- Non-existing user → returns 500 instead of 404
- Duplicate email → returns 500 instead of 409
- DEV environment → returns 404 instead of 401 when auth is missing

---

# Playwright generates HTML reports.

To view locally:
- gitbash - npx playwright show-report

In CI, reports are uploaded as artifacts:
- playwright-report-dev
- playwright-report-prod

---

# CI/CD Pipeline

GitHub Actions pipeline includes:
- DEV Stage:
Runs tests against DEV environment

- PROD Stage:
Runs tests against PROD environment

- Behavior:
Both stages run in parallel
Failures do not block execution
Reports are always uploaded

Notes:
Some tests are expected to fail due to known API defects
These failures are intentional and documented in bugs.md
The goal is to expose incorrect API behavior