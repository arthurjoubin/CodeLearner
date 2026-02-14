# CodeLearner - Course Restructuring Progress

## ✅ Completed Tasks

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

- [ ] **Task #8**: Créer module "Vibe Coding Mastery" dans Web Fundamentals
- [ ] **Task #9**: Réordonner modules Internet & Tools (Build Tools en premier → Terminal & CLI en premier)

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

**Status:** 2 tâches terminées / 15 tâches totales
**Date:** 2026-02-14
