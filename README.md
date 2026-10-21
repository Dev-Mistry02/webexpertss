# webexpertss

## Contact form delivery

The contact form sends project enquiries through Resend from the Node server in `server/`. The Resend API key stays on the server and is never included in the browser bundle.

1. Create a Resend API key and verify the domain you want to send from. `RESEND_FROM_EMAIL` must use an address on that verified domain (for example, `WebExpertss <contact@yourdomain.com>`).
2. Configure the backend environment with `CLIENT_URL` set to the frontend's origin, plus `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. Set `CONTACT_TO_EMAIL` to override the default recipient, `mistrydev812@gmail.com`.
3. Configure the frontend build environment with `VITE_API_URL` set to the backend's origin. Leave it empty when the frontend and API share an origin.

For local development, copy `.env.example` to `.env` and `server/.env.example` to `server/.env`. The frontend API URL can remain empty because Vite proxies `/api` to localhost. Add your Resend values to `server/.env`, then run `npm run dev:api` and `npm run dev` from the repository root in separate terminals. To serve the built site and API together, build with `npm run build` from the repository root, then run `npm start` from `server/`.