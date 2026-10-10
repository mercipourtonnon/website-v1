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

## Déploiement (Sovrium Cloud)

Le site entier (pages publiques, espace bénévole, formulaires, données) tourne
sur [Sovrium Cloud](https://cloud.sovrium.com), domaine `mercipourtonnon.fr`.

```bash
sovrium login                    # une fois par machine (code à valider dans le navigateur)
bash scripts/deploy.sh           # valide, empaquette et déploie l'app « mercipourtonnon »
```

`sovrium deploy` envoie la config résolue, `public/` et `seed/` — jamais le
`.env` : les variables de production (`BASE_URL`, clés HelloAsso/Brevo…) se
règlent sur le cloud. Redéployer un contenu inchangé ne fait rien.
`SOVRIUM_APP` et `SOVRIUM_HOST` changent l'app et le cloud visés.

Le workflow `.github/workflows/deploy.yml` (lancement manuel) fait la même
chose depuis GitHub Actions avec le secret `SOVRIUM_API_KEY`.

L'ancien site statique (HTML écrit à la main) est conservé dans `archive/`.
