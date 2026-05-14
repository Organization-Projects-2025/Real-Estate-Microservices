# Selenium Tests

These tests satisfy the PDF Selenium requirement:

- Login page is mandatory.
- Extra functional pages are included: Buy properties and Agent search.
- Tests include assertions and screenshots on failure.

## Prerequisites

Start the project first:

```bash
cd ../microservices
npm run start:all
```

In another terminal:

```bash
cd ../client
npm run dev -- --host 127.0.0.1
```

Default URLs used by the tests:

- Client: `http://127.0.0.1:5173`
- API: `http://127.0.0.1:3000/api`

## Install

```bash
cd selenium-tests
npm install
```

## Run

Headless Chrome:

```bash
npm test
```

Visible Chrome window:

```bash
npm run test:headed
```

## Optional Environment Variables

```bash
CLIENT_URL=http://127.0.0.1:5173
API_URL=http://127.0.0.1:3000/api
SELENIUM_EMAIL=admin@realestate.com
SELENIUM_PASSWORD=Password123!
HEADLESS=false
```

Screenshots from failed tests are saved in:

```text
selenium-tests/screenshots
```
