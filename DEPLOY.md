# Admin Deploy

The admin panel is no longer deployed as a separate site.

Current production layout:
- main API: `https://axiomtradepro.org`
- admin SPA: `https://axiomtradepro.org/admin/`
- form: `https://monetoplusapp.com`

Build command:

```bash
npm run admin:build
```

The built admin is served by the main Fastify app from `admin/dist`.

See the full VPS guide in [deploy/SETUP.md](/C:/Users/user/Desktop/bot-credit/deploy/SETUP.md).
