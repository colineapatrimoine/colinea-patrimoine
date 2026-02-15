# Colinéa Patrimoine — Site vitrine

Site vitrine professionnel pour **Colinéa Patrimoine**, conseil en gestion de patrimoine.

## Contenu du site

- **Accueil** — Hero avec accroche et boutons d’action
- **Services** — Gestion de patrimoine, transmission & succession, optimisation fiscale, protection & prévoyance
- **À propos** — Approche, valeurs (écoute, transparence, discrétion)
- **Contact** — Coordonnées et formulaire

## Lancer le site en local

1. Ouvrez le dossier du projet dans Cursor (ou votre éditeur).
2. Ouvrez `index.html` dans un navigateur (double-clic ou glisser-déposer dans Chrome/Safari/Firefox).

Ou avec un serveur local (recommandé pour éviter les restrictions CORS si vous ajoutez des ressources) :

```bash
# Avec Python 3
python3 -m http.server 8000

# Puis ouvrez http://localhost:8000
```

## Fichiers

| Fichier      | Rôle                                      |
|-------------|-------------------------------------------|
| `index.html`| Structure et contenu des pages            |
| `styles.css`| Mise en forme et responsive               |
| `script.js` | Menu mobile, formulaire, header au scroll |
| `README.md` | Ce fichier                                |

## Personnalisation

- **Coordonnées** : modifiez l’email et le numéro de téléphone dans `index.html` (section Contact).
- **Couleurs** : variables CSS en haut de `styles.css` (`--color-accent`, `--color-bg`, etc.).
- **Formulaire** : pour un envoi réel, branchez un service (Formspree, Netlify Forms, ou votre backend) et adaptez `script.js`.

## Mise en ligne

Vous pouvez héberger le site sur tout hébergeur statique : Netlify, Vercel, GitHub Pages, ou votre hébergeur actuel. Il suffit d’uploader les fichiers du dossier (ou de lier le dépôt Git).

---

© 2025 Colinéa Patrimoine
