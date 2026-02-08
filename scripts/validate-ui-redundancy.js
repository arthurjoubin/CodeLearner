#!/usr/bin/env node

/**
 * Check for UI/UX redundancies:
 * - Learning path names should not match course names in the same path
 * - Avoid displaying the same name twice in breadcrumbs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LEARNING_PATHS_DIR = path.join(__dirname, '../src/data/learning-paths');

function normalize(str) {
  return (str || '').toLowerCase().trim();
}

console.log('\n' + '='.repeat(70));
console.log('UI REDUNDANCY CHECK REPORT');
console.log('='.repeat(70) + '\n');

const redundancies = [];

const pathFiles = fs.readdirSync(LEARNING_PATHS_DIR)
  .filter(f => f.endsWith('.json'))
  .sort();

pathFiles.forEach(filename => {
  const filePath = path.join(LEARNING_PATHS_DIR, filename);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

  const pathName = data.title || '';
  const pathId = data.id || '';

  console.log(`📚 Learning Path: ${pathName}`);

  data.courses.forEach(course => {
    const courseName = course.title || '';
    const courseId = course.id || '';

    // Check if course name matches learning path name
    if (normalize(courseName) === normalize(pathName)) {
      redundancies.push({
        type: 'PATH_COURSE_NAME_MATCH',
        pathId,
        pathName,
        courseId,
        courseName,
        message: `Course name "${courseName}" matches learning path name "${pathName}"`
      });
      console.log(`   ⚠️  Course "${courseName}" has same name as learning path`);
    }

    // Check if learning path name appears as course ID
    if (normalize(pathId) === normalize(courseId)) {
      redundancies.push({
        type: 'PATH_COURSE_ID_MATCH',
        pathId,
        pathName,
        courseId,
        courseName,
        message: `Course ID "${courseId}" matches learning path ID "${pathId}"`
      });
      console.log(`   ⚠️  Course "${courseName}" has same ID as learning path`);
    }

    console.log(`   ✓ ${courseId}: "${courseName}"`);
  });
  console.log();
});

console.log('='.repeat(70));

if (redundancies.length === 0) {
  console.log('✅ No UI redundancies detected!\n');
} else {
  console.log(`❌ Found ${redundancies.length} potential redundancy/ies:\n`);
  redundancies.forEach((r, i) => {
    console.log(`${i + 1}. ${r.message}`);
    console.log(`   Learning Path: ${r.pathName} (${r.pathId})`);
    console.log(`   Course: ${r.courseName} (${r.courseId})\n`);
  });
}

console.log('='.repeat(70) + '\n');

process.exit(redundancies.length > 0 ? 1 : 0);
