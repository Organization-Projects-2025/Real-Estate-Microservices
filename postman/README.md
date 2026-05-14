# Postman API Tests

These files satisfy the PDF API testing requirement:

- Organized Postman collection.
- Environment variables.
- Positive and negative scenarios.
- End-to-end workflow.
- Assertions for status codes and response bodies.

## Files

- `Real-Estate-Microservices.postman_collection.json`
- `Real-Estate-Local.postman_environment.json`

## Prerequisites

Start the backend:

```bash
cd ../microservices
npm run start:all
```

Recommended: load/reset demo data before a formal run:

```bash
npm run seed:all
```

## How To Run In Postman

1. Open Postman.
2. Import both JSON files from this folder.
3. Select the `Real Estate Local` environment.
4. Run the collection `Real Estate Microservices - E2E API Tests`.

## How To Run With Newman

```bash
npm install -g newman
newman run postman/Real-Estate-Microservices.postman_collection.json -e postman/Real-Estate-Local.postman_environment.json
```

The collection creates a temporary API user and property during the run, then validates list/get/update/delete workflows.
