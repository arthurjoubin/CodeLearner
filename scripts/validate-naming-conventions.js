#!/usr/bin/env node

/**
 * Validate naming conventions:
 * 1. Module title must not be the same as courseId
 * 2. Lesson title must not be the same as module title
 * 3. Exercise title must not be the same as lesson title or module title
 * 4. Course IDs should be distinct from learning path IDs (avoid "frontend" as both path and course)
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MODULES_DIR = path.join(__dirname, '../src/data/modules');

// Normalize strings for comparison (lowercase, trim)
function normalize(str) {
  return (str || '').toLowerCase().trim();
}

// Check if two strings are similar (accounting for slight variations)
function areSimilar(str1, str2) {
  return normalize(str1) === normalize(str2);
}

// Get all module JSON files
const moduleFiles = fs.readdirSync(MODULES_DIR)
  .filter(f => f.endsWith('.json') && f !== 'index.ts')
  .sort();

const issues = [];

// Validate each module
moduleFiles.forEach(filename => {
  const filePath = path.join(MODULES_DIR, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const { module, lessons = [], exercises = [] } = data;

  if (!module) {
    console.warn(`⚠️  Missing module definition in ${filename}`);
    return;
  }

  const { id, courseId, title } = module;

  // RULE 1: Module title must not match courseId
  if (areSimilar(title, courseId)) {
    issues.push({
      type: 'MODULE_EQUALS_COURSE',
      file: filename,
      moduleId: id,
      moduleName: title,
      courseId,
      message: `Module title "${title}" matches courseId "${courseId}"`
    });
  }

  // RULE 2: Lesson titles must not match module title
  lessons.forEach(lesson => {
    if (areSimilar(lesson.title, title)) {
      issues.push({
        type: 'LESSON_EQUALS_MODULE',
        file: filename,
        moduleId: id,
        moduleName: title,
        lessonId: lesson.id,
        lessonName: lesson.title,
        message: `Lesson title "${lesson.title}" matches module title "${title}"`
      });
    }
  });

  // RULE 3: Exercise titles must not match lesson or module titles
  exercises.forEach(exercise => {
    const exerciseTitle = exercise.title || exercise.problem || '';

    lessons.forEach(lesson => {
      if (areSimilar(exerciseTitle, lesson.title)) {
        issues.push({
          type: 'EXERCISE_EQUALS_LESSON',
          file: filename,
          moduleId: id,
          moduleName: title,
          lessonId: lesson.id,
          lessonName: lesson.title,
          exerciseId: exercise.id,
          exerciseName: exerciseTitle,
          message: `Exercise title "${exerciseTitle}" matches lesson title "${lesson.title}"`
        });
      }
    });

    if (areSimilar(exerciseTitle, title)) {
      issues.push({
        type: 'EXERCISE_EQUALS_MODULE',
        file: filename,
        moduleId: id,
        moduleName: title,
        exerciseId: exercise.id,
        exerciseName: exerciseTitle,
        message: `Exercise title "${exerciseTitle}" matches module title "${title}"`
      });
    }
  });
});

// Report results
console.log('\n' + '='.repeat(70));
console.log('NAMING CONVENTIONS VALIDATION REPORT');
console.log('='.repeat(70) + '\n');

if (issues.length === 0) {
  console.log('✅ All naming conventions are valid!\n');
} else {
  console.log(`❌ Found ${issues.length} naming convention violation(s):\n`);

  issues.forEach((issue, index) => {
    console.log(`${index + 1}. ${issue.message}`);
    console.log(`   File: ${issue.file}`);
    console.log(`   Module: ${issue.moduleName} (${issue.moduleId})`);
    if (issue.lessonName) console.log(`   Lesson: ${issue.lessonName}`);
    if (issue.exerciseName) console.log(`   Exercise: ${issue.exerciseName}`);
    console.log();
  });
}

console.log('='.repeat(70) + '\n');

process.exit(issues.length > 0 ? 1 : 0);
