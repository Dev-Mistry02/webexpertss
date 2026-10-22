# webexpertss

## Contact form delivery

The contact form sends project enquiries through Resend from the Node server in `server/`. The Resend API key stays on the server and is never included in the browser bundle.

1. Create a Resend API key and verify the domain you want to send from. `RESEND_FROM_EMAIL` must use an address on that verified domain (for example, `WebExpertss <contact@yourdomain.com>`).
2. Configure the backend environment with `CLIENT_URL` set to a comma-separated list of allowed frontend origins, plus `RESEND_API_KEY` and `RESEND_FROM_EMAIL`. Include the deployed frontend origin and local development origins if needed. Set `CONTACT_TO_EMAIL` to override the default recipient, `mistrydev812@gmail.com`.
3. The frontend defaults to the hosted API at `https://webexpertss-backen.onrender.com`. `VITE_API_URL` can override it at build time. For local backend development, set `VITE_API_URL=http://localhost:3001`; alternatively, leave it empty to use the Vite `/api` proxy.

For local development, copy `.env.example` to `.env` and `server/.env.example` to `server/.env`. To use the hosted backend locally, keep the default `VITE_API_URL`; make sure the hosted backend's `CLIENT_URL` includes your local frontend origin such as `http://localhost:5173`. To use a local backend, set `VITE_API_URL=http://localhost:3001` or leave it empty to use the Vite proxy. The local server defaults to port `3001`; override it with `PORT` if that port is also occupied. Add your Resend values to `server/.env`, then run `npm run dev:api` and `npm run dev` from the repository root in separate terminals. To serve the built site and API together, build with `npm run build` from the repository root, then run `npm start` from `server/`.