# Email Service

Lightweight email microservice used to send verification emails.

Run locally (Node + NestJS):

```bash
cd microservices/email-service
npm install
# set MAILTRAP_USERNAME and MAILTRAP_PASSWORD in .env
npm run start:dev
```

Configure `auth-service` to use this service by setting `EMAIL_SERVICE_URL`, e.g. `http://localhost:3002`.
