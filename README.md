# webexpertss

## Contact form delivery

The contact form sends project enquiries through Resend from the Node server in `server/`. The Resend API key stays on the server and is never included in the browser bundle.

1. Create a Resend API key and verify the domain you want to send from.
2. Deploy this repository to Render using the included `render.yaml`.
3. In Render, set `RESEND_API_KEY` and `RESEND_FROM_EMAIL` for the web service. `RESEND_FROM_EMAIL` must use an address on the verified Resend domain (for example, `WebExpertss <contact@yourdomain.com>`).
4. Contact enquiries are delivered to `mistrydev812@gmail.com` by default. The recipient can be changed with `CONTACT_TO_EMAIL`.

For local development, copy `server/.env.example` to `server/.env` and enter your Resend values. Build the frontend with `npm run build` from the repository root, then run `npm start` from `server/` to serve the site and contact API. For frontend hot reload, run `npm run dev:api` and `npm run dev` from the repository root in separate terminals; the Vite server proxies `/api` requests to the local Node server.