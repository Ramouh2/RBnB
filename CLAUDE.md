# RBnB — CLAUDE.md (Constitution officielle)

> Ce fichier est la Constitution Technique, Produit, UX/UI et Motion Design System de **RBnB** pour Claude Code.
> Il doit être lu intégralement avant toute modification. Les résultats vérifiés de l'audit du dépôt
> (résolution de chaque `TODO — VERIFY IN PROJECT`) figurent dans l'**Annexe A** en fin de document.
>
> Règles spécifiques à la version de Next.js installée : @AGENTS.md

---

## Project Constitution

### IDENTITÉ OFFICIELLE DU PRODUIT : RBnB

RBnB est le nom officiel et exclusif du produit. Toute référence à l'application dans ce document et dans le code source désigne RBnB.

### 1. Règle Impérative de Branding & Nommage (RBnB)

Claude Code doit utiliser systématiquement et exclusivement **RBnB** comme nom de marque et de produit dans :

- L'interface utilisateur (headers, footers, barres de navigation, écrans d'authentification, onboarding, dashboards).
- Les métadonnées SEO (title, description, openGraph, manifest, titres d'onglets).
- Les titres de pages et les en-têtes de sections.
- Les composants marketing (Hero, Bento Grid, Pricing, Call-to-Action).
- Les textes de démonstration, placeholders (ex : `nom@rbnb.app`) et commandes de la MorphingCommandBar.
- Les variables, constantes, types ou clés de stockage lorsqu'un préfixe produit est requis (`RBNB_MOTION_CONFIG`, `rbnb-theme`, etc.).
- Les rapports de fin de session (RAMOS — CURRENT PRODUCT STATE).

**Noms Strictement Interdits** — il est formellement interdit d'appeler RBnB par l'un des noms suivants :

- ❌ Readyly
- ❌ ATRIO
- ❌ Airbnb
- ❌ My SaaS
- ❌ Project
- ❌ SaaS (en tant que nom propre du produit)

**Exception unique** : si un identifiant technique interne historique (ex : nom de table en base de données, variable d'environnement tierce ou clé d'API existante) utilise un ancien nom et que son renommage casserait le backend ou la production, Claude Code doit préserver le fonctionnement technique interne tout en affichant exclusivement RBnB côté interface utilisateur.

### 2. Vision & Ambition Produit de RBnB

Ce fichier CLAUDE.md constitue la Constitution Technique, Produit, UX/UI et Motion Design System de RBnB pour Claude Code.

**Philosophie Directrice de RBnB :**

> « Tout est vivant, mais rien n'est gratuit. »

RBnB doit immédiatement procurer l'impression d'un produit ultra-premium, moderne, technologiquement avancé et d'une fluidité absolue. Chaque interaction dans RBnB doit être :

- **Intentionnelle** : chaque mouvement remplit une fonction cognitive et UX précise.
- **Fluide** : rendu constant à 60fps minimum, accéléré matériellement par le GPU.
- **Physique** : gouverné par la mécanique des ressorts (Spring Physics), l'inertie et l'élasticité réelle — jamais par des transitions linéaires artificielles.
- **Continue** : les éléments se transforment et voyagent dans l'espace (transformation → déplacement → transformation) au lieu de disparaître et réapparaître brutalement.
- **Précise & Naturelle** : micro-interactions immédiates, retours tactiles visuels nets, finition au pixel.

**Références d'Excellence (Benchmarks Visuels & Interactifs de RBnB)** : Linear, Vercel, Raycast, Stripe, Arc, Superhuman, Apple, Notion, Framer.

### 3. Hiérarchie Absolue des Priorités

Dans toutes ses décisions d'ingénierie sur RBnB, Claude Code doit respecter cet ordre de priorité :

1. **Fonctionnalité** — Les flux métier et fonctionnalités de RBnB sont 100 % opérationnels.
2. **Stabilité** — Zéro crash, zéro régression, typage TypeScript strict, build de production valide.
3. **UX** — Lisibilité immédiate, hiérarchie claire, guidage de l'utilisateur, accessibilité complète.
4. **Performance** — 60fps constants, zéro Layout Shift (CLS = 0), zéro re-render React superflu.
5. **Motion Design** — Physique de ressort, continuité spatiale (`layoutId`), chorégraphie d'interface.
6. **Polish** — Grain SVG subtil, reflets dynamiques liés au curseur, micro-interactions, détails optiques.

**Principe fondamental** : le motion design ne doit jamais casser une fonctionnalité de RBnB. Mais dès que la fonctionnalité est stable, Claude Code doit pousser le motion design et le polish à leur niveau d'excellence maximal.

### 4. Règle Impérative de Préservation de l'Existant

- **INTERDICTION** de supprimer arbitrairement une fonctionnalité existante de RBnB.
- **INTERDICTION** de reconstruire de zéro une fonctionnalité déjà opérationnelle simplement parce qu'elle pourrait être écrite différemment.
- **INTERDICTION** de casser une route existante, un flux d'authentification, un schéma de données ou un appel API actif.
- Toute élévation UX/UI et Motion Design sur RBnB doit s'intégrer chirurgicalement en enrichissant l'architecture existante.

---

## Architecture

### 1. Audit Initial du Dépôt RBnB (Obligatoire en Phase 1 — Inspect)

Avant d'écrire ou de modifier la moindre ligne de code, Claude Code doit scanner l'intégralité du dépôt RBnB pour lever chaque point marqué `TODO — VERIFY IN PROJECT` (résultats : **Annexe A**) :

| Domaine Architectural de RBnB | État dans le Dépôt | Action d'Inspection Requise par Claude Code |
| --- | --- | --- |
| Framework & Routeur | TODO — VERIFY IN PROJECT | Identifier Next.js (App Router `app/` vs Pages Router `pages/`) et sa configuration. |
| Structure des Dossiers | TODO — VERIFY IN PROJECT | Vérifier si le code source réside dans `src/` ou à la racine `./`. |
| Routes & Pages Actives | TODO — VERIFY IN PROJECT | Cartographier toutes les pages existantes de RBnB pour garantir zéro régression. |
| Navigation & Layouts | TODO — VERIFY IN PROJECT | Identifier le RootLayout, les sidebars, navbars, footers et providers globaux. |
| Design System & Tokens | TODO — VERIFY IN PROJECT | Inspecter `globals.css`, `tailwind.config.*` et les variables CSS existantes. |
| Composants UI Primitifs | TODO — VERIFY IN PROJECT | Scanner `components/ui/` (primitives Radix, shadcn/ui ou custom) pour réutilisation. |
| Composants Métier RBnB | TODO — VERIFY IN PROJECT | Identifier les composants métier propres à RBnB et leurs props/dépendances. |
| Animations Existantes | TODO — VERIFY IN PROJECT | Repérer les usages actuels de Framer Motion, keyframes CSS ou transitions. |
| Gestion d'État (State) | TODO — VERIFY IN PROJECT | Identifier React Context, Zustand, Redux, TanStack Query, SWR ou Server Actions. |
| API, Backend & Base de Données | TODO — VERIFY IN PROJECT | Identifier les routes API, Server Actions, ORM (Prisma/Drizzle/Supabase) et modèles. |
| Authentification | TODO — VERIFY IN PROJECT | Identifier le système d'auth actif et la route de connexion actuelle de RBnB. |
| Dette Technique & Doublons | TODO — VERIFY IN PROJECT | Lister les composants dupliqués, legacy, incohérences UI ou goulots de performance. |

### 2. Arborescence Cible des Composants & Utilitaires de RBnB

En respectant la racine existante du dépôt (`src/` ou `./` — voir Annexe A), structurer les ajouts selon cette architecture :

```text
├── app/ (ou pages/)                 # Conserver le routeur existant
│   └── motion-playground/
│       └── page.tsx                 # Laboratoire interactif temps réel du Motion System RBnB
├── components/
│   ├── ui/                          # Primitives UI existantes de RBnB (à préserver et réutiliser)
│   ├── motion/                      # Bibliothèque centrale de Motion Design RBnB
│   │   ├── LiquidAuthInput.tsx      # Champs Email/Password à séparation liquide visqueuse
│   │   ├── MagneticButton.tsx       # Bouton CTA magnétique (rayon 40px + reflet + squash)
│   │   ├── MorphingCommandBar.tsx   # Barre flottante Cmd+K / Dynamic Island pour RBnB
│   │   ├── StatefulSubmitButton.tsx # Bouton 4 états (IDLE → LOADING → SUCCESS → ERROR)
│   │   ├── SpotlightBentoCard.tsx   # Carte Bento 3D avec spotlight curseur et diffusion voisine
│   │   └── ElasticSlider.tsx        # Slider à effet rubber-band couplé à AnimatedPrice
│   ├── auth/                        # Composants d'authentification RBnB
│   │   └── LiquidLogin.tsx          # Expérience Login Animation V2 (Gooey + 3 gouttes + fusion)
│   └── pricing/                     # Système de tarification interactif RBnB
│       ├── PricingSection.tsx       # Conteneur de la grille tarifaire RBnB
│       ├── PricingToggle.tsx        # Toggle Mensuel/Annuel avec pilule layoutId & inertie
│       ├── DiscountBadge.tsx        # Badge -20% avec rebond et onde lumineuse sans CLS
│       ├── AnimatedPrice.tsx        # Compteur numérique mécanique à rouleaux verticaux
│       └── ProCard.tsx              # Carte RBnB Pro avec Border Beam, parallaxe et icônes réactives
├── hooks/                           # Hooks réutilisables de physique et d'interaction
│   ├── useMagnetic.ts               # Calcul d'attraction magnétique sans re-render
│   ├── useMousePosition.ts          # Suivi curseur en MotionValues pures
│   ├── useSpringValue.ts            # Wrapper useMotionValue + useSpring + reduced-motion
│   └── useReducedMotion.ts          # Détection OS prefers-reduced-motion + override playground
└── lib/
    ├── utils.ts                     # Fonction cn() (clsx + tailwind-merge)
    └── motion/                      # Noyau déclaratif de la physique RBnB
        ├── constants.ts             # Ressorts, constantes NECK/PULL, matrices SVG, rayons
        └── variants.ts              # Variants Framer Motion standardisés et typés
```

### 3. Règles d'Architecture des Composants

- **Modularité Atomique** : interdiction formelle de créer des fichiers monolithiques de 1000 lignes. Extraire les sous-composants, hooks, constantes et variants dès que la complexité augmente.
- **Séparation Stricte UI / Métier** : aucun composant de `components/motion/` ne doit contenir de requêtes réseau ou de logique métier codée en dur. Ils doivent être pilotables par props typées (`value`, `onChange`, `status`, `onSubmit`, `physicsConfig`).

---

## Tech Stack

### 1. Audit de la Stack Réelle de RBnB

Claude Code doit inspecter `package.json`, `tsconfig.json`, `next.config.*` et `postcss.config.*` pour documenter (résultats : **Annexe A**) :

- Gestionnaire de paquets (pnpm / npm / yarn / bun)
- Version de Next.js
- Version de React & React-DOM
- Version de TypeScript
- Version de Tailwind CSS (v3 ou v4)
- Bibliothèques installées existantes

### 2. Dépendances UI & Motion Requises

Vérifier dans `package.json` la présence des 4 packages suivants :

1. `framer-motion` — Moteur unique pour toutes les animations à ressort, projections de layout (`layout`, `layoutId`), `AnimatePresence` et `MotionValue`.
2. `lucide-react` — Icônes vectorielles pour toute l'interface RBnB.
3. `clsx` — Assemblage conditionnel des classes CSS.
4. `tailwind-merge` — Résolution sans conflit des classes utilitaires Tailwind.

**Protocole d'Installation** : si l'un de ces packages est absent, Claude Code doit l'installer proprement via le gestionnaire de paquets détecté dans le dépôt RBnB, en vérifiant la compatibilité avec la version de React installée.

**Standardisation de `cn()` (`lib/utils.ts`)** : vérifier si `cn()` existe déjà. Sinon, le créer dans `lib/utils.ts` :

```ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

### 3. Unicité du Moteur d'Animation

- **Interdiction de systèmes concurrents** : ne jamais installer GSAP, Anime.js, React Spring ou Motion One lorsque Framer Motion est présent.
- Toutes les animations complexes de RBnB doivent passer par l'architecture unifiée `components/motion/` et `lib/motion/`.

---

## Development Rules

### 1. Les 17 Règles d'Ingénierie Obligatoires sur RBnB

Claude Code doit systématiquement :

1. Inspecter l'existant avant de modifier le moindre fichier de RBnB.
2. Comprendre les dépendances entre composants, hooks, pages et API.
3. Réutiliser les composants existants lorsqu'ils sont propres et fonctionnels.
4. Éviter les duplications de composants, de logique ou de constantes d'animation.
5. Créer des composants réutilisables, génériques et composables.
6. Privilégier TypeScript strict (zéro `any` implicite ou explicite, interfaces exportées, types discriminés pour les états).
7. Conserver une architecture claire respectant les conventions de nommage de RBnB (voir Annexe A).
8. Ne jamais supprimer une fonctionnalité fonctionnelle sans raison explicite et documentée.
9. Ne jamais casser une route existante de RBnB.
10. Ne jamais introduire une dépendance sans vérifier qu'elle est strictement nécessaire.
11. Tester les modifications importantes dans tous leurs cas limites.
12. Vérifier TypeScript (`tsc --noEmit` / typecheck).
13. Vérifier ESLint (lint).
14. Vérifier le build de production (build).
15. Vérifier le responsive (mobile, tablet, desktop, grands écrans).
16. Vérifier les animations (fluidité 60fps, continuité `layoutId`, fallback `prefers-reduced-motion`).
17. Vérifier les performances (absence de layout shift, absence de re-renders superflus).

### 2. Séquence d'Exécution Avant Toute Modification Importante

Avant de toucher à un module de RBnB, Claude Code doit suivre ces 7 étapes :

1. Inspecter les fichiers concernés.
2. Identifier toutes les dépendances entrantes et sortantes.
3. Identifier les composants et utilitaires réutilisables existants.
4. Comprendre le comportement actuel exact.
5. Proposer une stratégie d'intervention minimale et non destructive.
6. Implémenter proprement.
7. Vérifier (lint, typecheck, build, rendu visuel et comportemental).

### 3. Anti-Patterns Formellement Interdits

Claude Code ne doit JAMAIS :

- Appeler le produit autrement que RBnB (interdiction absolue d'utiliser Readyly, ATRIO, Airbnb, My SaaS, Project).
- Supprimer une fonctionnalité fonctionnelle de RBnB sans justification.
- Remplacer tout le design existant inutilement si une évolution ciblée suffit.
- Installer 20 bibliothèques tierces pour une animation réalisable avec Framer Motion.
- Utiliser GSAP alors que Framer Motion suffit.
- Utiliser des transitions CSS linéaires basiques (`ease-in-out`, `linear`) pour les interactions principales.
- Créer des animations qui provoquent du Layout Shift (CLS).
- Utiliser des `setInterval` ou `setTimeout` en boucle pour animer des valeurs visuelles.
- Faire tourner des animations permanentes coûteuses hors du viewport.
- Appliquer des filtres `blur()` massifs sur de grandes surfaces DOM.
- Surcharger l'interface de RBnB de particules inutiles.
- Créer du motion uniquement pour impressionner sans fonction UX.
- Casser l'ergonomie mobile ou laisser des effets de survol bloqués sur écran tactile.
- Ignorer `prefers-reduced-motion`.
- Ignorer les erreurs TypeScript, ESLint ou de build.

---

## UI/UX Rules

### 1. Identité Visuelle de RBnB

L'esthétique de RBnB combine la rigueur géométrique de Linear et Vercel, l'immédiateté tactile de Raycast, la richesse visuelle de Stripe, et la physique organique d'Apple — tout en affirmant l'identité propre de RBnB.

- **Sobriété Technologique (Zéro Rendu « Gaming »)** : pas de néons saturés, pas de bordures arc-en-ciel agressives, pas d'effets sci-fi caricaturaux. Utiliser des surfaces profondes, des bordures hairlines (`1px solid rgba(255,255,255,0.08)`), des reflets spéculaires sommitaux (`inset 0 1px 0 0 rgba(255,255,255,0.12)`) et des halos diffus maîtrisés.
- **Hiérarchie Optique** : guider le regard par le contraste lumineux, la netteté typographique et l'élévation subtile des surfaces interactives.

### 2. Intentionnalité UX de Chaque Animation

Dans RBnB, aucune animation n'existe « juste pour faire joli ». Chaque mouvement doit répondre à une fonction UX précise :

1. **Comprendre** : montrer la relation causale et spatiale entre deux éléments (ex : la barre unique de LiquidLogin qui se scinde pour révéler le mot de passe).
2. **Confirmer** : valider physiquement chaque action utilisateur (ex : compression `scale: 0.96` au clic, coche vectorielle animée et micro-particules sur StatefulSubmitButton).
3. **Orienter** : maintenir les repères spatiaux lors des ouvertures de menus, modales, drawers ou de la MorphingCommandBar.
4. **Hiérarchiser** : attirer le regard vers l'offre principale (ex : Border Beam continu et parallaxe sur la carte RBnB Pro).
5. **Attirer l'attention sans agresser** : signaler une économie tarifaire via le rebond et l'onde lumineuse du badge -20 %.
6. **Expliquer les changements d'état** : assurer une transition continue entre IDLE → LOADING → SUCCESS → ERROR sans coupure brutale.

---

## Design System

### 1. Inspection et Unification des Tokens RBnB

Claude Code doit d'abord inspecter les styles existants du projet (`globals.css`, `tailwind.config.*`) pour préserver la palette et les tokens existants de RBnB, puis les compléter avec l'échelle systématique ci-dessous. Interdiction d'utiliser des valeurs arbitraires dispersées.

### 2. Tokens Fondamentaux (CSS Variables)

Définir dans le fichier CSS global de RBnB :

```css
:root {
  /* RBnB Surface Levels (à adapter si un thème clair/sombre existe déjà) */
  --rbnb-surface-0: #050507;
  --rbnb-surface-1: #0b0c10;
  --rbnb-surface-2: #12141c;
  --rbnb-surface-3: #1a1d28;
  --rbnb-surface-elevated: rgba(22, 25, 35, 0.78);

  /* RBnB Borders & Specular Highlights */
  --rbnb-border-subtle: rgba(255, 255, 255, 0.06);
  --rbnb-border-default: rgba(255, 255, 255, 0.11);
  --rbnb-border-strong: rgba(255, 255, 255, 0.22);
  --rbnb-specular-inset: inset 0 1px 0 0 rgba(255, 255, 255, 0.12);

  /* RBnB Typography Colors */
  --rbnb-fg-primary: #f8fafc;
  --rbnb-fg-secondary: #94a3b8;
  --rbnb-fg-muted: #64748b;

  /* RBnB Accents & Semantic States (harmoniser avec la couleur de marque existante) */
  --rbnb-accent: #6366f1;
  --rbnb-accent-glow: rgba(99, 102, 241, 0.35);
  --rbnb-success: #10b981;
  --rbnb-warning: #f59e0b;
  --rbnb-error: #ef4444;

  /* Spacing Scale Reference */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Radius Tokens */
  --radius-xs: 0.25rem;   /* 4px */
  --radius-sm: 0.375rem;  /* 6px */
  --radius-md: 0.625rem;  /* 10px */
  --radius-lg: 0.875rem;  /* 14px */
  --radius-xl: 1.25rem;   /* 20px */
  --radius-2xl: 1.75rem;  /* 28px */
  --radius-full: 9999px;

  /* Shadow Tokens */
  --shadow-sm: 0 2px 8px -2px rgba(0, 0, 0, 0.45), var(--rbnb-specular-inset);
  --shadow-md: 0 12px 28px -6px rgba(0, 0, 0, 0.55), var(--rbnb-specular-inset);
  --shadow-lg: 0 24px 54px -12px rgba(0, 0, 0, 0.7), var(--rbnb-specular-inset);
  --shadow-glow: 0 0 36px -4px var(--rbnb-accent-glow);

  /* Motion Tokens (transitions de couleurs/opacité complémentaires aux ressorts Framer Motion) */
  --motion-fast: 140ms;
  --motion-normal: 240ms;
  --motion-slow: 380ms;

  /* Z-Index Scale */
  --z-base: 1;
  --z-card-hover: 10;
  --z-sticky: 100;
  --z-dropdown: 200;
  --z-drawer: 300;
  --z-modal: 400;
  --z-command-bar: 500;
  --z-toast: 600;
  --z-tooltip: 700;
}
```

### 3. Typographie RBnB

- **Police de caractères** : vérifier la police configurée dans le projet RBnB (voir Annexe A). Ne jamais remplacer arbitrairement une police existante cohérente.
- **Échelle & Règles Typographiques** :
  - **Headings (H1–H4)** : `tracking-tight` (-0.025em à -0.035em), `font-semibold`, interlignage serré (`leading-[1.1]`), couleur `--rbnb-fg-primary`.
  - **Body** : `text-sm` ou `text-base`, `leading-relaxed` (1.6), couleur `--rbnb-fg-secondary`.
  - **Labels & Captions** : `text-xs`, `font-medium`, contraste net, `tracking-wide` uniquement sur les micro-badges en majuscules.
  - **Numbers & Pricing** (AnimatedPrice, ElasticSlider, KPIs RBnB) : obligation stricte d'appliquer `tabular-nums` (`font-variant-numeric: tabular-nums`) et un alignement vertical verrouillé pour que les animations de chiffres ne provoquent aucune vibration horizontale.

---

## Motion Design System

### 1. Omniprésence Cohérente du Motion dans RBnB

L'interface de RBnB ne doit jamais sembler statique ou morte. Le système de motion doit couvrir avec cohérence :

- **Navigation, Menus, Tabs & Command Palette** : pilules actives partagées (`layoutId`), morphing spatial continu.
- **Boutons & Contrôles** : attraction magnétique, reflet lumineux curseur, compression au clic (`scale: 0.96`).
- **Formulaires & Authentification** : séparation liquide Gooey, focus ring organique, validation multi-états.
- **Modales, Drawers, Dropdowns, Accordéons & Tooltips** : déploiement physique respectant le point d'origine (`transformOrigin`), fermeture fluide via `AnimatePresence`.
- **Cards, Dashboards, Tableaux, Recherche, Filtres & Graphiques** : spotlight directionnel, inclinaison 3D douce, réorganisation fluide des listes filtrées (`layout`), transitions d'états de chargement/succès/erreur.

### 2. Continuité Visuelle (`layout`, `layoutId`, `AnimatePresence`)

Les changements d'état dans RBnB ne doivent jamais être perçus comme des remplacements brutaux :

- **Règle d'Or Spatiale** : l'utilisateur doit voir que l'objet A devient l'objet B.
  - ❌ Interdit : disparition → apparition
  - ✅ Obligatoire : transformation → déplacement → transformation
- Utiliser systématiquement `layout`, `layoutId` et `<AnimatePresence initial={false} mode="popLayout">` sur les modales, menus, tabs, accordéons, cards, command bars, dropdowns et panneaux qui changent de dimensions.

### 3. Micro-Interactions Obligatoires

Chaque élément interactif de RBnB doit posséder un feedback immédiat et précis :

- **Boutons (Tap/Active)** : `whileTap={{ scale: 0.96 }}`.
- **Hover** : scale subtil (1.01 à 1.02), translation subtile (`y: -1`), glow périphérique, reflet radial suivant le curseur, élévation d'ombre.
- **Focus (`focus-visible`)** : anneau lumineux animé (ring / glow / expansion douce).
- **Drag** : compression initiale à la saisie, étirement (stretch) en mouvement, élasticité (rubber-banding) aux bornes.

### 4. Architecture des Hooks & Utilitaires (`lib/motion/` & `hooks/`)

Créer et centraliser les briques suivantes pour tout RBnB :

1. `lib/motion/constants.ts` :

```ts
export const RBNB_SPRINGS = {
  default: { type: "spring", stiffness: 380, damping: 28, mass: 1 } as const,
  snappy: { type: "spring", stiffness: 480, damping: 32, mass: 0.8 } as const,
  command: { type: "spring", stiffness: 400, damping: 28, mass: 0.9 } as const,
  liquid: { type: "spring", stiffness: 55, damping: 11, mass: 1 } as const,
  bouncy: { type: "spring", stiffness: 450, damping: 16, mass: 0.8 } as const,
  rubber: { type: "spring", stiffness: 500, damping: 30, mass: 0.7 } as const,
  errorShake: { type: "spring", stiffness: 600, damping: 15, mass: 0.6 } as const,
};

export const RBNB_LIQUID_CONSTANTS = {
  k: 55,
  damping: 11,
  NECK: 0.34,
  PULL: 26,
  blurStdDeviation: 10,
  colorMatrix: "1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9",
} as const;

export const RBNB_MAGNETIC_DEFAULTS = {
  radius: 40,
  strength: 0.35,
  tapScale: 0.96,
} as const;
```

2. `lib/motion/variants.ts` : variants réutilisables pour les transitions de pages, listes cascadées (`staggerChildren`), modales et secousses d'erreur.
3. `hooks/useReducedMotion.ts` : hook réactif combinant la media query système (`prefers-reduced-motion: reduce`) et un état global optionnel pour tester le mode réduit dans `/motion-playground`.
4. `hooks/useMousePosition.ts` : capture les coordonnées (`clientX`, `clientY`) et les coordonnées locales relatives à un élément en exposant uniquement des `MotionValue<number>` (garantissant 0 re-render React).
5. `hooks/useSpringValue.ts` : connecte une valeur cible ou une `MotionValue` à un ressort `useSpring` configuré selon `RBNB_SPRINGS`, avec court-circuit instantané si `useReducedMotion()` est actif.
6. `hooks/useMagnetic.ts` : hook complet gérant l'attraction magnétique dans un rayon donné (40px par défaut), le calcul du reflet radial et la désactivation automatique sur écran tactile.

---

## Motion Physics

### 1. Loi Physique Fondamentale de RBnB

Il est interdit d'utiliser des transitions CSS linéaires ou basiques (`ease-in-out`, `linear`, `ease`) pour les interactions principales de RBnB. Toutes les animations spatiales et interactives doivent utiliser Framer Motion et la physique de ressort (`type: "spring"`).

### 2. Plages de Calibration des Ressorts

- **Interactions UI Principales (par défaut)** : `type: "spring"`, `stiffness: 300 → 500` (défaut : 380), `damping: 20 → 35` (défaut : 28).
- **Interactions Liquides & Organiques (LiquidAuthInput, LiquidLogin)** : `type: "spring"`, `stiffness: 55` (`k: 55`), `damping: 11`.
- **Transformations de Layout Haute Précision (MorphingCommandBar)** : `type: "spring"`, `stiffness: 400`, `damping: 28`.

### 3. Primitives Framer Motion à Privilégier

Utiliser de manière idiomatique et combinée :

- `spring`, `layout`, `layoutId`, `AnimatePresence`
- `whileHover`, `whileTap`, `whileFocus`, `whileDrag`
- `useMotionValue`, `useSpring`, `useTransform`, `useMotionTemplate`, `useVelocity`

---

## Component Architecture

Créer dans `components/motion/` les 6 composants piliers de RBnB. Chaque composant doit être écrit en TypeScript strict, documenté, réutilisable, et accepter une prop optionnelle `configOverride` afin d'être pilotable en temps réel depuis `/motion-playground`.

### 9.1 `components/motion/LiquidAuthInput.tsx`

- **Concept** : deux champs (Email et Password) reliés par un effet de séparation liquide visqueux.
- **Technologie SVG** :
  - Filtre SVG englobant utilisant `<feGaussianBlur stdDeviation="10" />` et `<feColorMatrix values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 22 -9" />`.
  - Séparer le calque de fond morphologique (soumis au filtre Gooey) du calque des `<input>` et labels (rendus par-dessus sans flou pour une lisibilité typographique parfaite).
- **Physique** : ressort `k: 55` (`stiffness: 55`), `damping: 11`.
- **Comportement au Focus / Déploiement du champ Password** :
  - Le pont liquide reliant Email et Password s'étire verticalement.
  - Il devient progressivement plus fin au centre à mesure que l'écart grandit.
  - Il se détache proprement tout en laissant les deux champs visuellement connectés dans leur cinématique.
  - La transition est 100 % organique, subtile et premium.

### 9.2 `components/motion/MagneticButton.tsx`

- **Concept** : bouton CTA principal de RBnB.
- **Comportement Magnétique** :
  - Rayon magnétique par défaut : 40px autour du bouton.
  - Dès que le curseur entre dans ce périmètre de 40px, le bouton est attiré vers le curseur avec une intensité progressive proportionnelle à la proximité.
  - Retour fluide par ressort (`stiffness: 380`, `damping: 25`) lorsque le curseur quitte la zone.
- **Effet Lumineux** : un `radial-gradient` dynamique suit la position exacte (x, y) de la souris sur la surface et la bordure du bouton pour simuler un reflet métallique/verre.
- **Au Clic (Squash & Stretch)** : compression `scale ≈ 0.96` (`scaleX: 1.03`, `scaleY: 0.95`) suivie d'un retour élastique.
- **Support Multi-Plateforme** :
  - Desktop : magnétisme complet + reflet radial + squash & stretch.
  - Touch devices : pas de curseur → désactivation automatique du magnétisme, conservation stricte du tap feedback (`scale: 0.96`).
  - Reduced motion : désactivation du déplacement magnétique spatial, conservation du feedback visuel doux.

### 9.3 `components/motion/MorphingCommandBar.tsx`

- **Concept** : barre flottante compacte pour RBnB, inspirée d'Apple Dynamic Island, Raycast et Cmd+K (⌘K).
- **Cycle de Transformation Continue** :
  - **État compact** : pilule flottante minimaliste affichant l'identité RBnB et le raccourci ⌘K.
  - **État open** : palette de commande déployée avec champ de recherche instantané et navigation clavier dans les actions RBnB.
  - **État actions / notifications** : morphing contextuel affichant l'exécution d'une commande ou une notification interactive en temps réel.
- **Physique & Layout** :
  - Utilisation obligatoire de `layoutId` partagé sur l'enveloppe principale.
  - Ressort calibré : `stiffness: 400`, `damping: 28`.
  - Zéro saut de layout : la transformation géométrique et le fondu croisé du contenu interne sont continus.

### 9.4 `components/motion/StatefulSubmitButton.tsx`

- **Concept** : bouton de validation / paiement RBnB à 4 états continus : `IDLE → LOADING → SUCCESS → ERROR`.
- **Comportement détaillé par état** :
  1. **IDLE** : bouton RBnB normal avec micro-interactions de survol et tap (`scale: 0.96`).
  2. **LOADING** : morphing fluide de la largeur (`layout`), apparition d'un spinner liquide animé, verrouillage des clics (`disabled`).
  3. **SUCCESS** : transformation vers l'état validé avec coche SVG tracée dynamiquement (`pathLength: 0 → 1`), émission de micro-particules de célébration maîtrisées et léger rebond de confirmation.
  4. **ERROR** : passage en teinte d'alerte avec secousse horizontale physique par spring (`x: [0, -10, 10, -7, 7, -3, 3, 0]`) et message de feedback visuel clair.

### 9.5 `components/motion/SpotlightBentoCard.tsx`

- **Concept** : carte Bento premium pour la landing page et les dashboards de RBnB.
- **Comportement au Survol** :
  - **Spotlight & Border Glow** : une lumière radiale douce suit les coordonnées X/Y du curseur à l'intérieur de la carte et illumine sa bordure.
  - **Diffusion aux Cartes Voisines** : en utilisant un contexte de grille (`SpotlightBentoGrid`) ou des coordonnées partagées, la lumière du curseur affecte également légèrement les bordures des cartes voisines proches.
  - **Inclinaison 3D Subtile** : utilisation de `perspective`, `rotateX`, `rotateY` (limité à ±4deg–6deg) et `translateZ` via `useSpring` pour créer une profondeur physique élégante sans jamais nuire à la lisibilité ni surcharger le GPU.

### 9.6 `components/motion/ElasticSlider.tsx`

- **Concept** : slider interactif de tarification / volume pour RBnB.
- **Comportement Physique (Rubber-Band Effect)** :
  - Lorsque l'utilisateur tire le curseur au-delà du minimum ou du maximum, le slider ne bloque pas sèchement : il applique un rubber-band effect (amortissement logarithmique).
  - La piste du slider s'étire, résiste physiquement à la traction et revient élastiquement à sa taille nominale dès que l'utilisateur relâche la pression.
- **Couplage avec AnimatedPrice** :
  - La valeur pilotée par ElasticSlider met à jour `<AnimatedPrice value={price} />` en direct.
  - Chaque chiffre roule verticalement avec un motion blur vertical subtil proportionnel à la vélocité du changement.

---

## Authentication

### 1. Spécification Complète de `components/auth/LiquidLogin.tsx`

Créer `components/auth/LiquidLogin.tsx` en TypeScript strict + Framer Motion, implémentant le concept « Login Animation V2 » pour RBnB.

#### A. Cinématique & États Exactement Requis

1. **État Initial (`EMAIL_STAGE`)** :
   - Une seule barre blanche minimaliste (haute pureté visuelle sur fond sombre).
   - Elle contient uniquement le champ Email (ex : placeholder « Votre email RBnB... ») et un bouton/icône de continuation.
2. **Séparation Verticale (`SPLITTING → PASSWORD_STAGE`)** :
   - Dès que l'email est valide OU que l'utilisateur clique sur Continuer / valide avec Entrée :
   - La barre blanche se divise verticalement en deux barres : la barre Email reste en haut, et la barre Password se déploie vers le bas.
3. **Filtre SVG Gooey & Paramètres Exacts** — appliquer un filtre SVG Gooey avec ces valeurs exactes :
   - `feGaussianBlur` : `stdDeviation="10"`
   - `feColorMatrix` :

     ```text
     values="
     1 0 0 0 0
     0 1 0 0 0
     0 0 1 0 0
     0 0 0 22 -9
     "
     ```

4. **Physique & Constantes Géométriques Exactes** :
   - Ressort : `k: 55` (`stiffness: 55`), `damping: 11`
   - Constantes de rupture : `NECK: 0.34`, `PULL: 26`
5. **Le Pont Liquide & Les 3 Gouttes** :
   - Pendant la division verticale, un pont liquide se forme au centre entre la barre Email et la barre Password.
   - Le pont s'étire, s'affine jusqu'au ratio `NECK: 0.34`, puis finit par rompre lorsque la tension dépasse `PULL: 26`.
   - À l'instant de la rupture, le pont libère 3 gouttes.
   - Ces 3 gouttes rebondissent selon la physique de ressort, puis disparaissent naturellement.
6. **Soumission, Fusion & Redirection Dashboard RBnB** — à la soumission du formulaire (`onSubmit`) :
   - Les deux barres (Email et Password) se rejoignent et fusionnent à nouveau.
   - La barre unique se contracte en une pilule compacte → passe en état loading → affiche l'état succès → déclenche la redirection vers le dashboard RBnB (en préservant la logique d'authentification existante du projet).
7. **Exigences Complémentaires** : validation d'email rigoureuse, gestion visuelle et accessible des erreurs (secousse + message), états loading et disabled, navigation 100 % clavier (Tab, Enter, Escape), accessibilité ARIA et adaptation `prefers-reduced-motion`.

#### B. Intégration à la Page Login UI de RBnB

- Inspecter la route de connexion existante de RBnB (voir Annexe A) et y intégrer LiquidLogin sans casser les appels d'authentification existants.
- **Background Sombre, Premium & Texturé** :
  - Créer un arrière-plan sombre et profond digne d'Apple / Linear / Vercel (aucun rendu « gaming »).
  - Intégrer un bruit SVG subtil généré en code (`<svg>` inline avec `<feTurbulence type="fractalNoise" />` à très faible opacité) — interdiction d'utiliser une image matricielle lourde.
  - Composer avec un glow diffus, des `radial-gradient` subtils, un vignettage doux et une vraie sensation de profondeur faisant ressortir la barre blanche de LiquidLogin.

---

## Pricing

Créer dans `components/pricing/` le système de tarification interactif de RBnB (niveau de finition : Apple / Stripe / Linear).

### 12.1 Toggle Mensuel / Annuel (`PricingToggle.tsx`)

- Sélecteur interactif permettant de basculer entre la facturation Mensuelle et Annuelle de RBnB.
- La pilule de sélection active glisse d'une option à l'autre via `layoutId`, pilotée par un ressort avec inertie et un subtil effet de squash & stretch (`scaleX` s'étirant légèrement pendant le déplacement), donnant la sensation que la pilule est physiquement attachée au curseur.

### 12.2 Badge -20 % (`DiscountBadge.tsx`)

- Lorsque l'option Annuel est sélectionnée :
  - Le badge -20 % apparaît ou réagit avec un rebond élastique naturel.
  - Il émet une onde lumineuse (halo / impulsion radiale).
  - **Zéro Layout Shift** : son apparition ou son animation ne doit jamais décaler le toggle ni les éléments adjacents.

### 12.3 `<AnimatedPrice value={price} />` (`AnimatedPrice.tsx`)

- Composant dédié au rendu animé des tarifs RBnB.
- **Mécanique de Compteur Numérique** :
  - Chaque chiffre est isolé dans sa propre colonne et peut monter, descendre, rouler et être remplacé individuellement selon la variation du prix.
  - Appliquer un blur vertical subtil pendant le mouvement vertical de chaque chiffre.
  - Alignement strict (`tabular-nums`) garantissant zéro saut horizontal ou vertical.

### 12.4 Carte Principale Pro Card (`ProCard.tsx`)

- Carte mettant en avant l'offre principale RBnB Pro.
- **Border Beam Animé** :
  - Un faisceau lumineux parcourt continuellement et fluidement la bordure de la carte RBnB Pro.
  - L'implémentation doit être légère sur le GPU (masque `conic-gradient` en rotation GPU ou `strokeDashoffset` SVG optimisé, mis en pause hors du viewport).
- **Interactions Riches** : glow atmosphérique, profondeur multicouche, élévation au survol, parallaxe interne subtile et icônes de fonctionnalités qui réagissent légèrement au mouvement du curseur.

---

## Motion Playground

### 1. Page Essentielle : `/motion-playground`

Créer la route `/motion-playground` dans RBnB. Cette page sert de laboratoire de calibration en direct et de vitrine interactive du Design & Motion System de RBnB.

### 2. Les 10 Composants Exposés Obligatoirement

La page `/motion-playground` doit afficher et isoler dans des bancs d'essai interactifs :

1. LiquidAuthInput
2. MagneticButton
3. MorphingCommandBar
4. StatefulSubmitButton
5. SpotlightBentoCard
6. ElasticSlider
7. LiquidLogin
8. Pricing Toggle (incluant le Badge -20 %)
9. AnimatedPrice
10. Pro Card

### 3. Contrôles Interactifs Temps Réel

Fournir des sliders et contrôles permettant de modifier en direct les constantes suivantes : `stiffness`, `damping`, `mass`, `duration`, `scale`, `blur`, `intensity`, `magnetic radius`, `rotation`, `glow`, `delay` (ainsi que `NECK` et `PULL` sur les modules liquides).

### 4. Architecture de Chaque Banc d'Essai

Chaque module du `/motion-playground` de RBnB doit afficher :

- Son rendu interactif en direct (avec boutons pour déclencher manuellement les états IDLE, LOADING, SUCCESS, ERROR, ou la division/fusion liquide).
- Ses contrôles dédiés.
- Ses valeurs numériques actuelles (`tabular-nums`).
- Un bouton **RESET DEFAULTS** (restaure instantanément les constantes optimales de RBnB).
- Un bouton **COPY CONFIG** (copie dans le presse-papiers l'objet JSON/TypeScript exact des constantes optimisées avec confirmation visuelle).
- Une mise en page 100 % responsive fonctionnant sur mobile, tablette et desktop.

---

## Accessibility

### 1. Inclusivité & Contrôle Multi-Modal

Toutes les interactions de RBnB doivent être intégralement utilisables au :

- **Clavier** : navigation Tab / Shift+Tab, activation Enter / Space, fermeture Escape, flèches directionnelles sur MorphingCommandBar, PricingToggle et ElasticSlider, anneaux `focus-visible` haute visibilité.
- **Souris / Trackpad** : précision complète des effets spatiaux et lumineux.
- **Touch** : cibles tactiles ≥ 44×44px, états actifs immédiats.
- **Screen Readers** : rôles sémantiques, labels explicites, `aria-live="polite"` sur `<AnimatedPrice />` et StatefulSubmitButton, `aria-invalid` et messages d'erreurs liés sur LiquidLogin.

### 2. Support Strict de `prefers-reduced-motion`

Lorsque `prefers-reduced-motion: reduce` est activé :

- Supprimer les grands déplacements spatiaux et l'attraction magnétique.
- Supprimer les effets d'inclinaison 3D (`rotateX`, `rotateY`).
- Supprimer les jets de micro-particules et le rebond des gouttes liquides.
- Réduire les ressorts à des transitions d'opacité/couleur rapides et sans rebond.
- Conserver tous les changements d'état fonctionnels (ouverture du champ mot de passe, passage en loading/success/error, changement de prix). La compréhension d'une interface RBnB ne doit jamais dépendre uniquement d'une animation.

---

## Responsive Design

### 1. Support Multi-Écrans

Tous les composants et pages de RBnB doivent être parfaitement adaptés aux résolutions :

- Mobile (320px – 639px)
- Tablet (640px – 1023px)
- Desktop (1024px – 1440px)
- Grands Écrans (1441px+)

### 2. Stratégie d'Adaptation Souris vs Tactile

Chaque interaction reposant sur la position du curseur doit posséder une alternative tactile native :

- **MagneticButton** :
  - Desktop : magnétisme actif dans le rayon de 40px + reflet radial suivant la souris.
  - Mobile : pas de curseur → pas de magnétisme, mais conservation stricte du tap feedback (`whileTap={{ scale: 0.96 }}`).
- **SpotlightBentoCard** :
  - Desktop : spotlight X/Y + inclinaison 3D.
  - Mobile : surface stable au scroll (pas d'inclinaison 3D parasite) avec halo subtil fixe et feedback tactile au toucher.
- **LiquidLogin & MorphingCommandBar** : adaptation fluide aux largeurs mobiles (`w-full max-w-md px-4`) et gestion propre de l'apparition du clavier virtuel mobile.

---

## Performance

### 1. Pipeline GPU & Objectif 60fps

- **Propriétés Accélérées** : construire les animations autour de `transform` (`translate3d`, `scale`, `rotate`) et `opacity`.
- **Interdiction d'Animer le Box Model en Direct** : ne jamais animer lourdement `width`, `height`, `top`, `left` ou `margin`. Déléguer les changements de dimensions à la projection `layout` de Framer Motion.
- **Usage Mesuré de `filter` et `will-change`** :
  - Confiner les filtres SVG Gooey (`feGaussianBlur` + `feColorMatrix`) aux conteneurs stricts de LiquidAuthInput et LiquidLogin.
  - Appliquer `will-change` uniquement pendant les phases actives d'animation.

### 2. Optimisation React & Next.js

- **Zéro Re-render sur Mouvement de Souris** : toutes les coordonnées de curseur doivent transiter par `useMotionValue` et `useTransform` sans déclencher de `useState` React à 60Hz.
- **Activation par Visibilité (`useInView`)** : mettre en pause les boucles d'animation continues (telles que le Border Beam de la carte RBnB Pro) lorsque le composant sort du viewport.
- **Code Splitting & Lazy Loading** : isoler les composants lourds et utiliser le chargement dynamique lorsque pertinent.

---

## Testing

### 1. Vérifications Techniques Systématiques

Après chaque changement significatif sur RBnB, Claude Code doit lancer les scripts du `package.json` (commandes exactes : voir Annexe A) :

```bash
npm run lint
npm run typecheck
npm run build
```

Vérifier également l'absence totale de :

- `console.error` et `console.warn`
- Erreurs d'hydratation SSR/Client Next.js
- Layout shifts (CLS)
- Saccades d'animation (animation jank) ou re-renders inutiles

### 2. Plan de Test Fonctionnel Obligatoire sur RBnB

Tester manuellement et par le code :

- **Login RBnB (LiquidLogin)** : validation email, division verticale Gooey (`NECK: 0.34`, `PULL: 26`), détachement et rebond des 3 gouttes, fusion à la soumission, cycle pilule compacte → loading → succès → redirection dashboard.
- **Pricing RBnB** : glissement du toggle Mensuel/Annuel (`layoutId` + squash & stretch), apparition rebondissante et onde lumineuse du badge -20 % sans layout shift, roulement chiffre par chiffre de `<AnimatedPrice />` avec blur vertical, Border Beam et parallaxe de la Pro Card.
- **Motion Playground (`/motion-playground`)** : fonctionnement des 10 composants, modification des constantes en temps réel, boutons RESET DEFAULTS et COPY CONFIG.
- **Navigation, Boutons & Formulaires** : MagneticButton (rayon 40px desktop / tap mobile), MorphingCommandBar (compact → open → actions), StatefulSubmitButton (IDLE → LOADING → SUCCESS → ERROR), ElasticSlider (rubber-band au-delà du min/max).

---

## Security

- **Intégrité de l'Authentification RBnB** : préserver intégralement les mécanismes de sécurité existants (sessions, JWT, CSRF, middlewares, validation serveur — voir Annexe A). LiquidLogin est une couche d'expérience utilisateur qui ne doit jamais contourner les contrôles de sécurité serveur.
- **Confidentialité des Mots de Passe** : les champs mot de passe dans LiquidAuthInput et LiquidLogin doivent impérativement utiliser `type="password"`, ne jamais être journalisés en console et ne jamais fuiter dans l'URL ou le state global non sécurisé.
- **Protection Anti-Double Soumission** : verrouiller immédiatement toute nouvelle soumission lorsque StatefulSubmitButton ou LiquidLogin est dans l'état LOADING.

---

## Git Rules

- **État du Dépôt** : vérifier `git status` et `git diff` avant et après chaque tâche sur RBnB.
- **Opérations Destructives Interdites** : ne jamais exécuter `git reset --hard`, `git clean -fd` ou écraser des modifications locales sans accord explicite.
- **Commits Propres** : utiliser des messages de commit explicites (`feat(rbnb-motion): ...`, `feat(rbnb-auth): ...`, `feat(rbnb-pricing): ...`) uniquement lorsque lint, typecheck et build sont au vert.

---

## Claude Code Workflow

Claude Code doit impérativement exécuter chacune de ses missions sur RBnB en suivant ces 7 PHASES strictes :

1. **PHASE 1 — Inspect** : scanner les fichiers du dépôt RBnB, identifier la stack réelle, les packages installés, les routes, les composants existants et résoudre les marqueurs `TODO — VERIFY IN PROJECT`.
2. **PHASE 2 — Understand** : analyser les dépendances entre composants, l'état global, le flux d'authentification et les conventions existantes pour garantir zéro régression.
3. **PHASE 3 — Plan** : établir un plan d'implémentation minimal, modulaire et non destructif qui réutilise l'existant sain et structure proprement les nouveaux composants RBnB.
4. **PHASE 4 — Implement** : coder les fonctionnalités et animations en TypeScript strict avec Framer Motion, Lucide, clsx et tailwind-merge dans le respect absolu des constantes physiques de ce CLAUDE.md.
5. **PHASE 5 — Test** : exécuter lint, typecheck et build. Vérifier tous les états interactifs (IDLE, LOADING, SUCCESS, ERROR), le responsive (mobile/desktop) et `prefers-reduced-motion`.
6. **PHASE 6 — Review** : vérifier l'absence de tout anti-pattern interdit, confirmer que le branding RBnB est respecté partout (aucune mention de noms interdits) et contrôler que le framerate reste à 60fps sans layout shift.
7. **PHASE 7 — Report** : publier systématiquement en fin de session le rapport standardisé RAMOS — CURRENT PRODUCT STATE ci-dessous.

---

## RAMOS Current Product State

Après chaque session d'intervention sur RBnB, Claude Code doit obligatoirement fournir ce rapport d'état :

```markdown
RAMOS — CURRENT PRODUCT STATE (RBnB)

1. État des Modules RBnB
* [🟢 | 🟡 | 🔴 | ⚪] Branding & Design System RBnB (Tokens CSS, Typographie, Zéro nom interdit)
* [🟢 | 🟡 | 🔴 | ⚪] Motion Core (`lib/motion/constants.ts`, `variants.ts`, Hooks physiques)
* [🟢 | 🟡 | 🔴 | ⚪] `LiquidAuthInput.tsx` (SVG Gooey, k: 55, damping: 11, séparation organique)
* [🟢 | 🟡 | 🔴 | ⚪] `MagneticButton.tsx` (Rayon 40px, radial-gradient, squash & stretch 0.96)
* [🟢 | 🟡 | 🔴 | ⚪] `MorphingCommandBar.tsx` (layoutId, stiffness: 400, damping: 28, compact → open → actions)
* [🟢 | 🟡 | 🔴 | ⚪] `StatefulSubmitButton.tsx` (IDLE → LOADING → SUCCESS → ERROR)
* [🟢 | 🟡 | 🔴 | ⚪] `SpotlightBentoCard.tsx` (Spotlight X/Y, halo cartes voisines, inclinaison 3D)
* [🟢 | 🟡 | 🔴 | ⚪] `ElasticSlider.tsx` (Rubber-band min/max + couplage AnimatedPrice)
* [🟢 | 🟡 | 🔴 | ⚪] `LiquidLogin.tsx` & RBnB Login UI (NECK: 0.34, PULL: 26, 3 gouttes, fusion, fond SVG noise)
* [🟢 | 🟡 | 🔴 | ⚪] RBnB Pricing Motion System (Toggle, Badge -20%, AnimatedPrice, Pro Card Border Beam)
* [🟢 | 🟡 | 🔴 | ⚪] RBnB Motion Playground (`/motion-playground`, 10 composants, live controls, Reset & Copy)

Légende : 🟢 Fonctionnel | 🟡 Partiel | 🔴 Non fonctionnel | ⚪ Non implémenté

2. Modifications Effectuées sur RBnB
* Détail synthétique des créations et améliorations réalisées.

3. Fichiers Modifiés & Créés
* Liste exacte des fichiers créés ou modifiés.

4. Nouvelles Dépendances
* Packages installés (ou "Aucune nouvelle dépendance").

5. Validations Effectuées
* TypeScript (`typecheck`) : [PASS / FAIL]
* ESLint (`lint`) : [PASS / FAIL]
* Production Build (`build`) : [PASS / FAIL]
* Responsive (Mobile / Tablet / Desktop) : [Vérifié / À compléter]
* Accessibilité & `prefers-reduced-motion` : [Vérifié / À compléter]

6. Problèmes Rencontrés & Résolutions
* Obstacles techniques ou dettes identifiés dans le dépôt RBnB et solutions appliquées.

7. Prochaines Étapes
* Actions prioritaires recommandées pour la suite du développement de RBnB.
```

---

## Definition of Done

Un composant, une page ou une fonctionnalité de RBnB est considéré comme Terminé (🟢 Fonctionnel) uniquement lorsque tous les critères suivants sont validés :

- [ ] **Identité RBnB Exclusive** : le produit est nommé exclusivement RBnB partout (aucune occurrence de Readyly, ATRIO, Airbnb, My SaaS ou Project en tant que nom produit).
- [ ] **Préservation Totale de l'Existant** : aucune fonctionnalité, route ou logique métier existante de RBnB n'a été cassée ou supprimée.
- [ ] **Zéro Erreur de Compilation** : lint, typecheck (TypeScript strict) et build passent à 100 % sans erreur.
- [ ] **Physique de Ressort Authentique** : toutes les interactions principales utilisent Framer Motion (`spring`, `layout`, `layoutId`, `AnimatePresence`) avec les constantes exactes prescrites (`stiffness: 300–500` / `damping: 20–35` par défaut, `k: 55` / `damping: 11` pour le liquide, `stiffness: 400` / `damping: 28` pour la command bar).
- [ ] **Continuité Visuelle & Zéro CLS** : les transitions d'état suivent le principe transformation → déplacement → transformation sans aucun saut de layout (CLS = 0).
- [ ] **Performance 60fps** : les animations utilisent `transform` et `opacity`, exploitent `MotionValue` sans provoquer de re-renders React sur `mousemove`, et coupent les boucles continues hors écran.
- [ ] **Accessibilité & Reduced Motion** : support complet du clavier, des lecteurs d'écran, et adaptation automatique lorsque `prefers-reduced-motion` est actif.
- [ ] **Responsive & Tactile** : expérience irréprochable sur mobile, tablette, desktop et grands écrans, avec alternatives tactiles propres (ex : tap feedback sans magnétisme bloqué sur mobile).
- [ ] **Synchronisation Motion Playground** : les 10 composants sont opérationnels, ajustables en temps réel, réinitialisables (RESET DEFAULTS) et exportables (COPY CONFIG) dans `/motion-playground`.
- [ ] **Rapport RAMOS** : le rapport RAMOS — CURRENT PRODUCT STATE (RBnB) complet a été délivré en fin de session.

---

## Annexe A — Résultats vérifiés de l'audit (PHASE 1 — Inspect)

> Audit réalisé le 2026-09-28. Constat initial : le dépôt `Ramouh2/RBnB` était **entièrement vide**
> (aucun commit, aucune branche distante, aucun fichier). Il n'existait donc aucune route, aucun composant,
> aucune authentification ni aucun token à préserver. RBnB a été fondé sur la stack ci-dessous ; ces valeurs
> font désormais foi et doivent être tenues à jour.

### A.1 Architecture

| Domaine | État vérifié |
| --- | --- |
| Framework & Routeur | Next.js 16 — **App Router** (`src/app/`). Turbopack par défaut (dev & build). |
| Structure des Dossiers | Code source dans **`src/`**. Alias d'import `@/*` → `./src/*`. |
| Routes & Pages Actives | `/` (landing), `/login`, `/dashboard` (protégée), `/motion-playground`. |
| Navigation & Layouts | `src/app/layout.tsx` (RootLayout, polices Geist, métadonnées RBnB). Navbar/Footer marketing dans `src/components/site/`. Pas de provider global requis (l'override reduced-motion est un store externe). |
| Design System & Tokens | Tailwind v4 **sans `tailwind.config.*`** : tokens dans `src/app/globals.css` (`:root` + `@theme`). Thème sombre unique. |
| Composants UI Primitifs | `src/components/ui/` (primitives maison : `Logo`, `NoiseBackground`, `Kbd`, …). Pas de shadcn/Radix. |
| Composants Métier RBnB | `src/components/site/` (landing), `src/components/dashboard/`, `src/components/playground/`. |
| Animations Existantes | Framer Motion uniquement, centralisé dans `src/lib/motion/` + `src/hooks/` + `src/components/motion/`. |
| Gestion d'État | État local React + MotionValues ; Server Actions pour l'auth ; store externe (`useSyncExternalStore`) pour l'override reduced-motion. |
| API, Backend & Base de Données | Pas de base de données. Server Actions (`src/app/login/actions.ts`, `src/app/dashboard/actions.ts`). |
| Authentification | Maison, sans dépendance : session **stateless** en cookie `httpOnly` signé HMAC-SHA256 (Web Crypto), vérifiée côté serveur (`src/lib/auth/`). Compte de démonstration configurable par variables d'environnement (voir `.env.example`). Route de connexion : `/login`. |
| Dette Technique & Doublons | Aucune (projet neuf). |

### A.2 Stack

- Gestionnaire de paquets : **npm** (`package-lock.json`)
- Next.js : **16.3.6** — React / React-DOM : **19.2.8** — TypeScript : **5.x** (`strict: true`)
- Tailwind CSS : **v4** (`@tailwindcss/postcss`) — ESLint : **9** (flat config `eslint.config.mjs`, `next lint` n'existe plus en v16)
- Dépendances UI/Motion : `framer-motion` 13.x, `lucide-react` 1.x, `clsx` 2.x, `tailwind-merge` 3.x
- Police : **Geist Sans / Geist Mono** via `next/font/google` (auto-hébergée au build)

### A.3 Scripts de vérification

```bash
npm run lint        # eslint
npm run typecheck   # tsc --noEmit
npm run build       # next build
```

### A.4 Conventions de nommage

- Composants : `PascalCase.tsx` ; hooks : `useCamelCase.ts` ; constantes produit : `RBNB_SCREAMING_CASE`.
- Chaque composant motion expose un type `XxxConfig`, une constante `RBNB_XXX_DEFAULTS` (dans `src/lib/motion/constants.ts`) et une prop `configOverride?: Partial<XxxConfig>`.
- Clés de stockage et identifiants DOM préfixés `rbnb-`.

### A.5 Contraintes Framer Motion v13 à connaître

- Les ressorts (`type: "spring"`) n'acceptent que **2 keyframes** : la secousse d'erreur `x: [0, -10, 10, -7, 7, -3, 3, 0]` utilise donc des keyframes à courbe amortie, tandis que les ressorts `RBNB_SPRINGS` pilotent tous les mouvements à deux états.
- Un ressort entre deux valeurs identiques avec une `velocity` non nulle anime quand même (impulsion physique).
