# mercipourtonnon

Site de l'association [Merci pour ton non](https://mercipourtonnon.fr) —
ateliers de consentement à prix libre à Strasbourg.

Le site est une application [Sovrium](https://sovrium.com) : tout (pages, design,
SEO) est déclaré dans `app.yaml` + `config/`, sans code serveur ni UI à
maintenir. Les ressources statiques (polices, images, scripts d'intégration
Brevo/Billetweb) vivent dans `public/`.

## Développement

```bash
sovrium start app.yaml --watch   # serveur de dev avec hot-reload
sovrium validate app.yaml        # valider la configuration
sovrium docs search <sujet>      # manuel intégré au binaire (hors ligne)
sovrium design-system app.yaml   # charte graphique (tokens, principes, voix) → DESIGN.md
```

## Build statique (GitHub Pages)

```bash
NODE_ENV=production \
SOVRIUM_DEPLOYMENT=github-pages \
SOVRIUM_BASE_URL=https://mercipourtonnon.fr \
SOVRIUM_GENERATE_SITEMAP=true \
SOVRIUM_GENERATE_ROBOTS=true \
sovrium build app.yaml           # → dist/
```

Le build rend les pages liées à une table (dates d'ateliers, références de
`/ressources`) depuis la base locale : charger les données de référence avant
de construire (le script `scripts/deploy-pages.sh` le fait) :

```bash
sovrium seed app.yaml --mode upsert --table facilitators --table venues --table workshops --table ressources
```

Le déploiement est automatisé par `.github/workflows/deploy.yml` à chaque push
sur `main` (GitHub Pages, domaine `mercipourtonnon.fr`).

L'ancien site statique (HTML écrit à la main) est conservé dans `archive/`.
