# Course Restructuring Mapping

## Learning Path 1: WEB FUNDAMENTALS

### Course: internet-tools (The Internet & Tools)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| terminal-cli | web-fundamentals | internet-tools |
| how-web-works | web-stack | internet-tools |
| package-managers | web-fundamentals | internet-tools |
| build-tools | web-fundamentals | internet-tools |
| **devtools-debugging** | NEW | internet-tools |

### Course: git-mastery (Git Mastery)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| git-basics | git | git-mastery |
| git-branches | git | git-mastery |
| git-history | git | git-mastery |
| git-remotes | git | git-mastery |
| git-flow | git | git-mastery |
| git-rebase | git | git-mastery |
| git-advanced | git | git-mastery |

### Course: javascript-core (JavaScript Core)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| js-variables-types | javascript | javascript-core |
| js-functions | javascript | javascript-core |
| js-arrays-objects | javascript | javascript-core |
| js-async | javascript | javascript-core |
| js-modern | javascript | javascript-core |
| js-dom | javascript | javascript-core |
| typescript-basics | web-fundamentals | javascript-core |

---

## Learning Path 2: FRONTEND

### Course: html-css-tailwind (HTML, CSS & Tailwind)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| html-fundamentals | html-css | html-css-tailwind |
| html-forms-media | html-css | html-css-tailwind |
| css-fundamentals | html-css | html-css-tailwind |
| css-layout | html-css | html-css-tailwind |
| tailwind-basics | html-css | html-css-tailwind |
| tailwind-components | html-css | html-css-tailwind |
| accessibility-basics | web-stack | html-css-tailwind |

### Course: react (React)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| jsx-basics | react | react |
| components-props | react | react |
| state-hooks | react | react |
| events | react | react |
| effects | react | react |
| lists-keys | react | react |
| forms-validation | react | react |
| context-api | react | react |
| custom-hooks | react | react |
| react-router | react | react |
| performance | react | react |
| react-advanced-patterns | react | react |
| typescript-react | react | react |

### Course: frontend-production (Frontend Production)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| testing-basics | web-stack | frontend-production |
| web-performance | web-stack | frontend-production |
| security-basics | web-stack | frontend-production |
| browser-storage | web-stack | frontend-production |
| pwa-basics | web-stack | frontend-production |
| i18n-basics | web-stack | frontend-production |

---

## Learning Path 3: BACKEND

### Course: node-express (Node.js & Express)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| nodejs-intro | backend | node-express |
| nodejs-modules | backend | node-express |
| nodejs-async | backend | node-express |
| nodejs-npm | backend | node-express |
| express-intro | backend | node-express |
| express-middleware | backend | node-express |
| express-apis | backend | node-express |
| express-production | backend | node-express |
| backend-testing | backend | node-express |
| backend-docker | backend | node-express |
| **rest-api-design** | NEW | node-express |

### Course: databases (Databases)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| db-concepts | backend | databases |
| db-sql-fundamentals | backend | databases |
| db-sqlite | backend | databases |
| db-postgresql | backend | databases |
| db-orms | backend | databases |

### Course: auth-security (Authentication & Security)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| auth-fundamentals | backend | auth-security |
| auth-jwt-session | backend | auth-security |
| auth-oauth | backend | auth-security |
| auth-security | backend | auth-security |
| auth-security-advanced | backend | auth-security |

---

## Learning Path 4: FULLSTACK

### Course: nextjs (Next.js)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| nextjs-fundamentals | nextjs | nextjs |
| nextjs-data-fetching | nextjs | nextjs |
| nextjs-auth | nextjs | nextjs |
| nextjs-deployment | nextjs | nextjs |
| **nextjs-server-components** | NEW | nextjs |
| **nextjs-api-routes** | NEW | nextjs |
| **nextjs-middleware** | NEW | nextjs |

### Course: architecture-patterns (Architecture & Patterns)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| architecture-patterns | web-stack | architecture-patterns |
| making-right-choice | web-stack | architecture-patterns |
| devops-basics | web-stack | architecture-patterns |
| websockets-basics | web-stack | architecture-patterns |

### Course: advanced-topics (Advanced Topics)
| Module | Current courseId | New courseId |
|--------|-----------------|--------------|
| frontend-frameworks | web-stack | advanced-topics |
| backend-frameworks | web-stack | advanced-topics |
| fullstack-frameworks | web-stack | advanced-topics |
| data-formats-logs | web-stack | advanced-topics |
| **state-management** | NEW | advanced-topics |

---

## Modules to DELETE (duplicates/legacy)

1. **databases.json** - Legacy, replaced by db-* modules
2. **databases-sql.json** - Legacy, replaced by db-sql-fundamentals
3. **javascript-typescript.json** - Scattered content, consolidated into typescript-basics
4. **web-essentials.json** - Overlaps with how-web-works
5. **frontend-tech.json** - Content covered in other modules

---

## Summary

**Before:** 81 modules across 7 courses
**After:** 77 modules across 12 courses (4 new modules, 5 deleted)

**New Modules to Create:**
1. devtools-debugging.json
2. rest-api-design.json
3. nextjs-server-components.json
4. nextjs-api-routes.json
5. nextjs-middleware.json
6. state-management.json

**Courses:**
1. internet-tools (5 modules)
2. git-mastery (7 modules)
3. javascript-core (7 modules)
4. html-css-tailwind (7 modules)
5. react (13 modules)
6. frontend-production (6 modules)
7. node-express (11 modules)
8. databases (5 modules)
9. auth-security (5 modules)
10. nextjs (7 modules)
11. architecture-patterns (4 modules)
12. advanced-topics (5 modules)

Total: 77 modules
