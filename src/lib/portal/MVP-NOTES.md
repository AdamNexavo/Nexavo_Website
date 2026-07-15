# Nexavo Portal — MVP / Demo Notes (intern)

Dit portaal draait volledig op **browser localStorage**. Het is bedoeld als demo/MVP, niet als productieomgeving.

## Niet production-ready

| Onderdeel | Huidige implementatie | Productie |
|-----------|----------------------|-----------|
| Auth | SHA-256 hash + localStorage sessie | Supabase Auth |
| Data | `nexavo_portal_*` localStorage keys | PostgreSQL |
| Uploads | Base64 in localStorage | Supabase Storage |
| Tickets | Client-side only | Database + e-mail notificaties |
| Betalingen | Placeholder UI | Mollie + facturatie |
| Uitnodigingen | Handmatige link kopiëren | E-mail via edge function |

## localStorage keys

- `nexavo_portal_clients` — klantaccounts, onboarding, tickets, betalingen
- `nexavo_portal_invites` — uitnodigingstokens
- `nexavo_portal_session` — ingelogde sessie (client of admin)

## Admin credentials

Admin-login gebruikt `VITE_PORTAL_ADMIN_EMAIL` en `VITE_PORTAL_ADMIN_PASSWORD_HASH` uit `.env`. Plaintext wachtwoorden nooit committen.

## Vercel deploy

`vercel.json` bevat SPA rewrites zodat `/portal/*` en `/admin/*` client-side routes werken.

## Lokale development

- Start: `npm run dev` → **http://localhost:5173/**
- Stop: `npm run dev:stop`
- Herstart: `npm run dev:restart`
- Vaste poort 5173 (geen stille switch naar 8081). `.env`-wijzigingen herstarten de server niet meer automatisch — gebruik `npm run dev:restart` na env-aanpassingen.

## Zichtbaarheid

Deze notities zijn **niet** zichtbaar voor eindklanten in het portaal.
