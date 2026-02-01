# Course Structure

This document explains how courses are organized for AI assistants.

## Concepts

- **Course/Path**: A complete learning track (e.g., "React", "Git", "Python")
- **Module**: A chapter within a course (e.g., "JSX Basics", "Git Branches")
- **Lesson**: A single topic with explanations and code examples
- **Exercise**: A coding challenge to practice the lesson

## File Structure

```
src/data/modules/
├── index.ts                    # Data loader - imports all JSON and exports API
│
├── # React Course
├── jsx-basics.json
├── components-props.json
├── state-hooks.json
├── ...
│
├── # Git Course (example)
├── git-basics.json
├── git-branches.json
├── git-remotes.json
├── git-history.json
├── git-advanced.json
├── ...
```

Each module JSON has a `courseId` field to group modules by course.

## JSON Schema

Each module file follows this structure:

```json
{
  "module": {
    "id": "module-id",
    "courseId": "react",
    "title": "Module Title",
    "description": "Short description of the module",
    "icon": "IconName",
    "requiredXp": 0,
    "color": "from-blue-400 to-blue-600"
  },
  "lessons": [
    {
      "id": "lesson-id",
      "moduleId": "module-id",
      "title": "Lesson Title",
      "order": 1,
      "xpReward": 15,
      "difficulty": "beginner|intermediate|advanced",
      "content": "Markdown content...",
      "codeExample": "Optional code example"
    }
  ],
  "exercises": [
    {
      "id": "exercise-id",
      "lessonId": "lesson-id",
      "moduleId": "module-id",
      "title": "Exercise Title",
      "difficulty": "easy|medium|hard|advanced",
      "xpReward": 20,
      "description": "What the exercise is about",
      "instructions": "Step by step instructions",
      "starterCode": "// Code template",
      "solution": "// Solution code",
      "hints": ["Hint 1", "Hint 2"],
      "validationPrompt": "Prompt for AI to validate the solution"
    }
  ]
}
```

## Available Courses

| courseId | Title | Description |
|----------|-------|-------------|
| react | React | Learn React from basics to advanced |
| web-stack | Web Stack Essentials | Understanding web technologies and making the right choices |
| git | Git | Version control with Git - from basics to collaboration |

## Adding a New Module to Existing Course

1. Create `src/data/modules/{module-id}.json` following the schema above
2. Set `courseId` to match the course (e.g., "react", "git")
3. Edit `src/data/modules/index.ts`:
   - Add import: `import newModuleData from './{module-id}.json';`
   - Add to array: `newModuleData as ModuleData,`

## Creating a New Course

1. Choose a `courseId` (lowercase, no spaces): e.g., "git", "python", "docker"
2. Create module JSON files with that `courseId`
3. Add modules to `index.ts` as described above
4. Update this table with the new course

## Available Icons

Icons come from Lucide React. Common ones used:
- Code, Boxes, Database, MousePointer, Zap, Shield
- List, FileInput, Layers, Settings, Gauge, Navigation

## XP Progression

- Modules unlock based on `requiredXp` (0, 100, 250, 400, 600, 850...)
- Lessons give 15-30 XP based on difficulty
- Exercises give 20-50 XP based on difficulty

## Content Guidelines

- Lesson content uses Markdown with code blocks
- Start lessons with "# Essential to know" summary
- Use `---` separator before main content
- Keep exercises focused on one concept
- Provide 2-3 hints per exercise

## API Functions (src/data/modules/index.ts)

```typescript
// All data
modules: Module[]
lessons: Lesson[]
exercises: Exercise[]

// Get by ID
getModule(id: string): Module | undefined
getLesson(id: string): Lesson | undefined
getExercise(id: string): Exercise | undefined

// Get related items
getLessonsForModule(moduleId: string): Lesson[]
getExercisesForLesson(lessonId: string): Exercise[]
getExercisesForModule(moduleId: string): Exercise[]

// Course helpers
getModulesForCourse(courseId: string): Module[]
getCourseIds(): string[]
```
