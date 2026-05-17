# Agents Vivre près de Paris

Équipe de 7 agents Claude Code spécialisés pour piloter le projet. Chaque agent a un contexte projet préchargé (stack, conventions, données).

## Liste

| Agent | Rôle | Modèle |
|---|---|---|
| `product-designer` | UX/UI, composants, funnels de conversion, identité visuelle | opus |
| `content-engineer` | Briefs articles, génération Opus 4.7 anti-AI, calendrier édito | opus |
| `seo-strategist` | Stratégie mots-clés, clusters, SERP, maillage interne | opus |
| `seo-technical` | Schemas JSON-LD, sitemap, Core Web Vitals, indexation GSC | sonnet |
| `growth-analyst` | Funnels (Supabase/Brevo/GA4), segmentation, A/B, pricing leads | sonnet |
| `b2b-outreach` | Prospection agences immo / promoteurs, packaging offres | opus |
| `dev-implementer` | Code Next.js 16, API routes, intégrations, fixes | sonnet |

## Comment les invoquer dans Claude Code

```
/agent product-designer
```

Ou en langage naturel dans un prompt :

> "Demande au content-engineer de me préparer 10 briefs sur 'investir Grand Paris Express'"

> "Le growth-analyst doit me sortir le top 10 villes par inscrits confirmés cette semaine"

> "Lance le dev-implementer pour ajouter le gate sur la page /vivre-a"

## Quand utiliser quel agent (matrice)

| Tu veux… | Agent à appeler |
|---|---|
| Améliorer un design / refondre un composant | `product-designer` |
| Écrire de nouveaux articles de blog | `content-engineer` |
| Identifier des mots-clés à attaquer | `seo-strategist` |
| Ajouter un schema JSON-LD ou debugger l'indexation | `seo-technical` |
| Analyser tes inscrits / funnels / conversions | `growth-analyst` |
| Rédiger un mail de prospection à une agence immo | `b2b-outreach` |
| Coder une feature, fixer un bug, intégrer un service | `dev-implementer` |

## Paralléliser

Plusieurs agents peuvent travailler en parallèle sur des tâches indépendantes :

> "Le product-designer doit revoir le formulaire opt-in, en parallèle le content-engineer génère 5 articles cluster Province, et le growth-analyst me sort un rapport hebdomadaire."

## Maintenance

Chaque agent est un fichier `.md` avec frontmatter YAML + system prompt en markdown. Pour modifier un agent : édite directement son fichier, commit, push.

Pour ajouter un nouvel agent : crée un nouveau fichier `.md` dans ce répertoire avec le format standard (cf. les agents existants comme modèle).
