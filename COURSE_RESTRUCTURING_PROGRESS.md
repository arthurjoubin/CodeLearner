# CodeLearner - Course Restructuring Progress

## ✅ Completed Tasks

### P2: Réordonner modules Internet & Tools (Task #9) - DONE

**Actions effectuées :**

1. **Nouvel ordre des modules** (optimisé pour vibe coders)
   - 1. IDE Setup (inchangé)
   - 2. Terminal & CLI (monté de 8 à 2 - essentiel tôt)
   - 3. How the Web Works (core understanding)
   - 4. Data Formats & Logs (JSON, YAML, .env)
   - 5. DevTools & Debugging (compétence critique)
   - 6. Package Managers (npm, yarn, pnpm)
   - 7. Build Tools (Vite - descend de 1 à 7, maintenant a le contexte)
   - 8. Environment Configuration (reste 8 - avancé)
   - 9. Vibe Coding Mastery (NOUVEAU - capstone)

2. **Data Formats & Logs déplacé**
   - Retiré de `advanced-topics`
   - Ajouté à `internet-tools` (fait plus de sens avec les fondamentaux)

**Résultat :** Progression plus logique pour un vibe coder qui a besoin du terminal et du debugging tôt.

---

### P2: Créer module "Vibe Coding Mastery" (Task #8) - DONE

**Module créé :** `vibe-coding-mastery.json`

**5 Lessons :**
1. Reading & Understanding AI-Generated Code (4-pass method, pattern recognition)
2. Reading Error Messages & Stack Traces (anatomy of errors, debugging process)
3. When AI is Wrong: Red Flags to Spot (security, performance, edge cases)
4. Refactoring AI Code for Maintainability (extract functions, DRY, simplify)
5. Writing Better Prompts for Better Code (prompt patterns, constraints, iteration)

**Cible :** Developers utilisant Cursor/v0/Bolt qui doivent comprendre, débugger, et refactorer du code AI.

**USP :** Différenciation majeure de CodeLearner - seule plateforme qui enseigne explicitement comment travailler avec l'AI.

**Résultat :** Module complet de 5 lessons sans exercices pour l'instant (à ajouter en P0).

---

### P1: Éliminer les redondances (Task #4) - DONE

**Actions effectuées :**

1. **Browser Storage**
   - ❌ Retiré de `javascript-core`
   - ✅ Gardé uniquement dans `frontend-production`
   - Fichier `browser-storage.json` : `courseId` changé de `"javascript-core"` → `"frontend-production"`

2. **PWA (Progressive Web Apps)**
   - ❌ Retiré de `html-css-tailwind`
   - ✅ Gardé uniquement dans `frontend-production`
   - Fichier `pwa-basics.json` : `courseId` changé de `"html-css-tailwind"` → `"frontend-production"`

3. **Docker & Express Production**
   - ❌ Retirés de `node-express` (cours Backend)
   - ✅ Déplacés dans `deployment` (cours Fullstack)
   - Les fichiers `backend-docker.json` et `express-production.json` avaient déjà `courseId: "deployment"`, donc juste mis à jour les imports dans `index.ts`

**Résultat :** Pas de duplication entre les cours. Chaque module appartient à un seul cours.

---

### P2: Retirer JavaScript Core du path Frontend (Task #10) - DONE

**Actions effectuées :**

1. **Fichier `src/data/learning-paths/frontend.json`**
   - ❌ Retiré le cours `javascript-core` de la liste des cours Frontend
   - ✅ Le path Frontend contient maintenant uniquement : `html-css-tailwind` → `react`
   - Description mise à jour pour clarifier que JavaScript Core est dans le prérequis Web Fundamentals

2. **Fichier `src/data/modules/index.ts`**
   - Ajouté commentaire pour clarifier que JavaScript Core n'est plus dupliqué

**Résultat :** Le learning path Frontend ne contient plus JavaScript Core (évite la confusion). Les users qui font Frontend ont déjà fait Web Fundamentals (qui contient JavaScript Core).

---

## 📋 Remaining Tasks

### Priority 0 (Critical - Ajouter des exercices)

- [ ] **Task #1**: Ajouter exercices backend SQL/Databases (0 exercices actuellement)
- [ ] **Task #2**: Ajouter exercices backend Express/Auth (très peu d'exercices)
- [ ] **Task #3**: Ajouter exercices JS fondamentaux (Functions, Arrays/Objects, DOM, Async ont 0 exercices)

### Priority 1 (Restructuration majeure)

- [ ] **Task #5**: Fusionner et nettoyer Auth/Security modules
  - Fusionner le module "Authentication & Security" (9 lessons fourre-tout) avec les 3 modules structurés
  - Garder structure en 3 modules : Auth Concepts, JWT/Sessions, OAuth

- [ ] **Task #6**: Supprimer cours "Frontend Production" et redistribuer
  - Browser Storage → déjà géré (moved to frontend-production)
  - PWA → déjà géré (moved to frontend-production)
  - Testing Basics → intégrer dans cours React
  - Web Performance → intégrer dans cours React
  - Security Basics → fusionner avec Auth & Security dans Backend

- [ ] **Task #7**: Fusionner Architecture + Deployment en "Shipping to Production"
  - Créer nouveau cours "Shipping to Production" dans Fullstack
  - Modules : Architecture Patterns, DevOps & CI/CD, Docker & Containers, Deployment Strategies, Monitoring, Next.js Deployment
  - Déplacer WebSockets vers Node.js/Express dans Backend

### Priority 2 (Amélioration contenu)

- [x] **Task #8**: Créer module "Vibe Coding Mastery" dans Web Fundamentals ✅
- [x] **Task #9**: Réordonner modules Internet & Tools (Build Tools en premier → Terminal & CLI en premier) ✅

### Priority 3 (Nouveaux modules)

- [ ] **Task #11**: Ajouter module "Debugging & Error Messages" dans Web Fundamentals
- [ ] **Task #12**: Ajouter module "Data Validation (Zod)" dans Backend
- [ ] **Task #13**: Ajouter module "Database Migrations" dans Databases
- [ ] **Task #14**: Ajouter module "E2E Testing (Playwright)" dans Fullstack
- [ ] **Task #15**: Fusionner "Making Right Choice" dans Architecture Patterns

---

## 🎯 Next Steps

**Recommandation :** Valider les changements effectués avant de continuer.

**Ensuite, approche suggérée :**

1. **Phase 1 (P1)** : Finir les restructurations majeures (Tasks #5, #6, #7)
2. **Phase 2 (P0)** : Ajouter les exercices critiques manquants (Tasks #1, #2, #3)
3. **Phase 3 (P2 + P3)** : Ajouter les nouveaux modules et améliorer l'existant

---

## 📝 Notes importantes

### Changements impactés
- Le frontend ne liste plus JavaScript Core → Les users doivent avoir fait Web Fundamentals d'abord
- Browser Storage et PWA ne sont plus dans les cours de base (JS Core / HTML-CSS) → Ils sont dans Frontend Production
- Docker et Express Production ne sont plus dans Backend → Ils sont dans le cours Deployment

### Tests à faire après restructuration complète
- [ ] Vérifier que tous les modules chargent correctement
- [ ] Vérifier que les learning paths affichent les bons cours
- [ ] Vérifier que la progression utilisateur n'est pas cassée
- [ ] Vérifier que les XP requis sont cohérents

---

**Status:** 4 tâches terminées / 15 tâches totales (27% complete)
**Date:** 2026-02-14
**Last Update:** Added Vibe Coding Mastery module and reordered Internet & Tools
