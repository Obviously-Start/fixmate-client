# FixMate Server

Express + MongoDB REST API for FixMate, the smart device and home appliance repair booking platform.

- Live API:https://fixmateah.netlify.app

- Client repository:https://github.com/Obviously-Start/fixmate-client.git
- Live site: https://fixmate20.netlify.app



## Key Features

- JWT verification with role middlewares: `verifyToken`, `verifyCustomer`, `verifyTechnician`, `verifyAdmin` (401 for missing or invalid token, 403 for wrong role)
- Users can only reach their own data; owner checks on every booking and service
- Server-enforced job status pipeline with atomic updates and a `statusHistory` timeline
- Payment gate: only a completed, unpaid booking owned by the customer can be paid
- Stripe Checkout session, success-page verification and webhook, with unique indexes so a payment is never saved twice
- Server-side search, filter, sort and pagination on services
- Admin APIs for users, service approval, bookings, payments and dashboard stats

## API Overview

| Area | Endpoints |
|---|---|
| Services (public) | `GET /api/services`, `GET /api/services/featured`, `GET /api/services/:id` |
| Services (technician) | `GET /api/services/my`, `POST /api/services`, `PATCH /api/services/:id`, `PATCH /api/services/:id/availability`, `DELETE /api/services/:id` |
| Bookings (customer) | `POST /api/bookings`, `GET /api/bookings/my`, `PATCH /api/bookings/:id/cancel` |
| Bookings (technician) | `GET /api/bookings/technician`, `PATCH /api/bookings/:id/status` |
| Payments | `POST /api/payments/create-checkout-session`, `GET /api/payments/verify`, `GET /api/payments/my`, `POST /api/payments/webhook` |
| Admin | `GET /api/admin/stats`, `/users`, `PATCH /users/:id/role`, `/services`, `PATCH /services/:id/approval`, `/bookings`, `/payments` |
| Profile | `PATCH /api/users/profile` |

## npm Packages

`express`, `cors`, `dotenv`, `mongodb`, `jsonwebtoken`, `stripe`, `serverless-http`

## Run Locally

```bash
npm install

npm run dev
```

## Environment Variables (`.env`)

| Name | Purpose |
|---|---|
| `PORT` | Local port (default 5000) |
| `MONGODB_URI`, `DB_NAME` | MongoDB connection (same database as the client) |
| `JWT_SECRET` | Must match the client `JWT_SECRET` |
| `STRIPE_SECRET_KEY` | Stripe test secret key |
| `STRIPE_WEBHOOK_SECRET` | Signing secret of the deployed webhook endpoint |
| `CLIENT_URL` | Allowed CORS origin(s), comma separated |
| `SITE_URL` | Client URL used for Stripe success and cancel redirects |

## Deployment (Netlify)

The Express app runs as a Netlify Function (`netlify/functions/api.js`) and all routes are redirected to it from `netlify.toml`. Add the production client domain to `CLIENT_URL`, and add the webhook endpoint `https://fixmateah.netlify.app
/api/payments/webhook` (event `checkout.session.completed`) in the Stripe Dashboard in test mode.