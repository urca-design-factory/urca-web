# Cloudflare deployment

This project uses Next.js with the OpenNext Cloudflare adapter. The Worker is
named `urca-web`. No domain is attached by the repository configuration.

## Local verification

```sh
npm ci
npm run build:cloudflare
npm run preview:cloudflare -- --port 3102
```

In another PowerShell terminal:

```powershell
$env:SITE_URL = "http://127.0.0.1:3102"
npm run test:site
```

The browser checks use Edge on Windows and Playwright Chromium elsewhere.
OpenNext recommends WSL on Windows; the current setup also builds and previews
on native Windows. Preview uses local bindings and does not verify account
entitlements or production DNS.

## GitHub deployment

In Cloudflare's account dashboard, open **Workers & Pages**, create an application
and connect `urca-design-factory/urca-web`. Grant the Cloudflare GitHub app access
to this private repository.

| Setting | Value |
| --- | --- |
| Worker name | `urca-web` |
| Production branch | `main` |
| Root directory | Repository root |
| Build command | `npm run build:cloudflare` |
| Deploy command | `npm run deploy:cloudflare` |
| Node.js version | Set build variable `NODE_VERSION` to `24` |

The deploy command consumes an existing OpenNext build. Always run the build
command first when deploying manually. No application secrets are required.

The `IMAGES` binding preserves Next/Image responsive optimization. Confirm
Cloudflare Images is available for the account before deployment; its usage has
separate limits and billing. Do not disable optimization merely to bypass an
account setup issue. This site does not currently need R2 or runtime ISR caching.

After a successful deployment, check `/`, `/capabilities`, optimized images under
`/_next/image`, mobile navigation and the footer on the supplied `workers.dev`
URL. Repeat performance measurements against the live deployment.

Then open the Worker's **Settings → Domains & Routes → Add → Custom Domain**
and attach `urcadesign.com`. Review conflicting DNS records before replacing
them, and configure `www` to redirect to the canonical domain. Leave mail DNS
records intact. Future pushes to the production branch trigger deployment.

## References

- [OpenNext setup](https://opennext.js.org/cloudflare/get-started)
- [Image optimization](https://opennext.js.org/cloudflare/howtos/image)
- [Workers Builds configuration](https://developers.cloudflare.com/workers/ci-cd/builds/configuration/)
- [Custom domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)
