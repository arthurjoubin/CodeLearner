const fs = require('fs');
const path = require('path');

// Learning paths configuration
const LEARNING_PATHS = {
  'web-fundamentals': {
    name: 'Web Fundamentals',
    courses: ['internet-tools', 'git-mastery', 'javascript-core']
  },
  'frontend': {
    name: 'Frontend',
    courses: ['html-css-tailwind', 'react', 'frontend-production']
  },
  'backend': {
    name: 'Backend',
    courses: ['node-express', 'databases', 'auth-security']
  },
  'fullstack': {
    name: 'Fullstack',
    courses: ['nextjs', 'architecture-patterns', 'advanced-topics', 'deployment']
  }
};

// Course names mapping
const COURSE_NAMES = {
  'internet-tools': 'Internet & Tools',
  'git-mastery': 'Git Mastery',
  'javascript-core': 'JavaScript Core',
  'html-css-tailwind': 'HTML, CSS & Tailwind',
  'react': 'React',
  'frontend-production': 'Frontend Production',
  'node-express': 'Node.js & Express',
  'databases': 'Databases',
  'auth-security': 'Authentication & Security',
  'nextjs': 'Next.js',
  'architecture-patterns': 'Architecture & Patterns',
  'advanced-topics': 'Advanced Topics',
  'deployment': 'Deployment'
};

// Module files mapping (based on index.ts imports)
const MODULE_FILES = [
  // Learning Path 1: Web Fundamentals
  // Course: internet-tools
  'ide-setup.json',
  'terminal-cli.json',
  'how-web-works.json',
  'devtools-debugging.json',
  'package-managers.json',
  'env-config.json',
  'build-tools.json',
  // Course: git-mastery
  'git-basics.json',
  'git-branches.json',
  'git-history.json',
  'git-remotes.json',
  'git-flow.json',
  'git-rebase.json',
  'git-advanced.json',
  // Course: javascript-core
  'js-variables-types.json',
  'js-functions.json',
  'js-arrays-objects.json',
  'js-async.json',
  'js-dom.json',
  'js-modern.json',
  'typescript-basics.json',
  'js-api-consumption.json',
  // Learning Path 2: Frontend
  // Course: html-css-tailwind
  'html-fundamentals.json',
  'html-forms-media.json',
  'css-fundamentals.json',
  'css-layout.json',
  'tailwind-basics.json',
  'tailwind-components.json',
  'accessibility-basics.json',
  // Course: react
  'jsx-basics.json',
  'components-props.json',
  'state-hooks.json',
  'events.json',
  'effects.json',
  'lists-keys.json',
  'forms-validation.json',
  'context-api.json',
  'state-management.json',
  'custom-hooks.json',
  'react-router.json',
  'performance.json',
  'react-advanced-patterns.json',
  'typescript-react.json',
  // Course: frontend-production
  'testing-basics.json',
  'web-performance.json',
  'security-basics.json',
  'browser-storage.json',
  'pwa-basics.json',
  'i18n-basics.json',
  // Learning Path 3: Backend
  // Course: node-express
  'nodejs-intro.json',
  'nodejs-modules.json',
  'nodejs-async.json',
  'nodejs-npm.json',
  'express-intro.json',
  'express-middleware.json',
  'rest-api-design.json',
  'express-apis.json',
  'express-production.json',
  'backend-testing.json',
  'backend-docker.json',
  // Course: databases
  'db-concepts.json',
  'db-sql-fundamentals.json',
  'db-sqlite.json',
  'db-postgresql.json',
  'db-orms.json',
  // Course: auth-security
  'auth-fundamentals.json',
  'auth-jwt-session.json',
  'auth-oauth.json',
  'auth-security.json',
  // Learning Path 4: Fullstack
  // Course: nextjs
  'nextjs-fundamentals.json',
  'nextjs-server-components.json',
  'nextjs-data-fetching.json',
  'nextjs-api-routes.json',
  'nextjs-auth.json',
  'nextjs-middleware.json',
  'nextjs-deployment.json',
  // Course: architecture-patterns
  'architecture-patterns.json',
  'making-right-choice.json',
  'devops-basics.json',
  'websockets-basics.json',
  // Course: advanced-topics
  'frontend-frameworks.json',
  'backend-frameworks.json',
  'fullstack-frameworks.json',
  'data-formats-logs.json',
  // Course: deployment
  'deployment-fundamentals.json'
];

const modulesDir = path.join(__dirname, '..', 'src', 'data', 'modules');

// Collect all lessons organized by learning path -> course -> module
const organizedData = {};
let totalLessons = 0;

MODULE_FILES.forEach(filename => {
  const filepath = path.join(modulesDir, filename);
  if (!fs.existsSync(filepath)) {
    console.warn(`Warning: ${filename} not found`);
    return;
  }

  const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'));
  const moduleInfo = data.module;
  const courseId = moduleInfo.courseId;
  
  // Find which learning path this course belongs to
  let learningPathId = null;
  for (const [lpId, lpConfig] of Object.entries(LEARNING_PATHS)) {
    if (lpConfig.courses.includes(courseId)) {
      learningPathId = lpId;
      break;
    }
  }

  if (!learningPathId) {
    console.warn(`Warning: Could not find learning path for course ${courseId}`);
    return;
  }

  // Initialize structure if needed
  if (!organizedData[learningPathId]) {
    organizedData[learningPathId] = {
      name: LEARNING_PATHS[learningPathId].name,
      courses: {}
    };
  }

  if (!organizedData[learningPathId].courses[courseId]) {
    organizedData[learningPathId].courses[courseId] = {
      name: COURSE_NAMES[courseId] || courseId,
      modules: []
    };
  }

  // Add module with its lessons
  const lessons = (data.lessons || []).map(lesson => ({
    id: lesson.id,
    title: lesson.title,
    order: lesson.order
  }));

  totalLessons += lessons.length;

  organizedData[learningPathId].courses[courseId].modules.push({
    id: moduleInfo.id,
    title: moduleInfo.title,
    filename: filename,
    lessons: lessons.sort((a, b) => a.order - b.order)
  });
});

// Sort modules by order within each course
for (const lpId in organizedData) {
  for (const courseId in organizedData[lpId].courses) {
    organizedData[lpId].courses[courseId].modules.sort((a, b) => {
      const orderA = MODULE_FILES.indexOf(a.filename);
      const orderB = MODULE_FILES.indexOf(b.filename);
      return orderA - orderB;
    });
  }
}

console.log(`Total lessons found: ${totalLessons}`);
console.log('\nGenerating LESSON-REVIEW.md...');

// Generate markdown content
let markdown = `# Lesson Quality Review

## Progress: 0/${totalLessons} reviewed

_Last updated: ${new Date().toISOString().split('T')[0]}_

---

## Review Instructions

When reviewing lessons, check for the following issues:

### 1. Rendering Issues
- **Inline code with HTML tags** (e.g., \`<html>\`, \`<div>\`) in "Essential to know" sections will render as invisible HTML elements due to a known bug in the custom markdown parser
- Broken markdown syntax (unclosed backticks, malformed links)
- Unclosed code blocks

### 2. "Essential to know" Block Issues
- Any backtick inline code containing HTML-like text (e.g., \`<tag>\`) will be eaten by the browser
- The parser only handles **bold** text in this block, NOT inline code
- This is a known bug to flag for fixing

### 3. Content Quality
- Factual errors or outdated information
- Incomplete explanations
- Missing sections after the \`---\` separator
- Lessons that seem too short or incomplete

### 4. Code Examples
- Syntax errors in \`codeExample\` field
- Mismatches between lesson content and code example
- Missing or unclear code examples

### 5. Structural Issues
- Missing "# Essential to know" section
- Missing \`---\` separator
- Inconsistent formatting

### Status Legend
- \`[ ]\` - Not reviewed
- \`[OK]\` - All good, no issues found
- \`[!]\` - Has issues (see notes)

---

`;

// Generate the hierarchy
let pathNum = 1;
for (const [lpId, lpData] of Object.entries(organizedData)) {
  markdown += `## Learning Path ${pathNum}: ${lpData.name}\n\n`;
  
  for (const [courseId, courseData] of Object.entries(lpData.courses)) {
    markdown += `### Course: ${courseData.name}\n\n`;
    
    for (const module of courseData.modules) {
      markdown += `#### Module: ${module.title} (${module.filename})\n\n`;
      
      for (const lesson of module.lessons) {
        markdown += `- [ ] \`${lesson.id}\` — ${lesson.title}\n`;
      }
      
      markdown += '\n';
    }
  }
  
  pathNum++;
}

// Add review notes section
markdown += `---

## Review Notes

Use this section to document issues found during review:

### Format: Lesson ID - Issue Description

#### Example:
- \`jsx-basics-1\` - Inline code \`<div>\` not rendering in "Essential to know" section (known parser bug)
- \`git-basics-3\` - Missing code example for \`git log\` command
- \`css-layout-2\` - Broken link to flexbox documentation

### Issues Log:

`;

// Write the file to project root
const outputPath = path.join(__dirname, '..', 'LESSON-REVIEW.md');
fs.writeFileSync(outputPath, markdown);

console.log(`✓ Created LESSON-REVIEW.md with ${totalLessons} lessons`);
console.log(`  Location: ${outputPath}`);

// Output summary
console.log('\n--- Summary ---');
for (const [lpId, lpData] of Object.entries(organizedData)) {
  let lpLessons = 0;
  for (const course of Object.values(lpData.courses)) {
    for (const module of course.modules) {
      lpLessons += module.lessons.length;
    }
  }
  console.log(`${lpData.name}: ${lpLessons} lessons`);
}
console.log(`\nTotal: ${totalLessons} lessons across ${MODULE_FILES.length} modules`);
