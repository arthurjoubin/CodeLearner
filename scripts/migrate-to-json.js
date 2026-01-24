#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { transform } from 'sucrase';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Migration script to convert modules.ts to individual JSON files
 * Run this once to generate the JSON files, then you can delete this script
 */

async function migrate() {
  try {
    // Import the data from modules.ts
    const modulesPath = path.join(__dirname, '../src/data/modules.ts');

    // Read the modules.ts file and extract the data
    const content = fs.readFileSync(modulesPath, 'utf-8');

    console.log('📦 Starting migration to JSON format...\n');

    // Create output directory
    const outputDir = path.join(__dirname, '../src/data/modules');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // Transpile TypeScript to JavaScript
    const jsCode = transform(content, {
      transforms: ['typescript']
    }).code;

    // Create a temporary file and execute it
    const tempFile = path.join(__dirname, '../.migrate-temp.mjs');
    fs.writeFileSync(tempFile, jsCode);

    // Load the module using dynamic import
    const moduleData = await import(path.resolve(tempFile) + '?t=' + Date.now());

    // Clean up temp file
    fs.unlinkSync(tempFile);

    const modules = moduleData.modules;
    const lessons = moduleData.lessons;
    const exercises = moduleData.exercises;

    console.log(`✓ Loaded ${modules.length} modules`);
    console.log(`✓ Loaded ${lessons.length} lessons`);
    console.log(`✓ Loaded ${exercises.length} exercises\n`);

    // Group lessons and exercises by module
    const moduleMap = new Map();
    modules.forEach(module => {
      moduleMap.set(module.id, {
        module: {
          id: module.id,
          title: module.title,
          description: module.description,
          icon: module.icon,
          requiredXp: module.requiredXp,
          color: module.color
        },
        lessons: [],
        exercises: []
      });
    });

    // Add lessons to their modules
    lessons.forEach(lesson => {
      const moduleData = moduleMap.get(lesson.moduleId);
      if (moduleData) {
        moduleData.lessons.push(lesson);
      }
    });

    // Add exercises to their modules
    exercises.forEach(exercise => {
      const moduleData = moduleMap.get(exercise.moduleId);
      if (moduleData) {
        moduleData.exercises.push(exercise);
      }
    });

    // Write JSON files
    let count = 0;
    moduleMap.forEach((data, moduleId) => {
      const fileName = `${moduleId}.json`;
      const filePath = path.join(outputDir, fileName);

      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      count++;
      console.log(`✓ Created ${fileName}`);
    });

    console.log(`\n✅ Migration complete!`);
    console.log(`📁 Generated ${count} JSON files in src/data/modules/\n`);
    console.log('Next steps:');
    console.log('1. Verify the JSON files look correct');
    console.log('2. Update imports in the app to use the new data loader');
    console.log('3. Test the app thoroughly');
    console.log('4. Delete the old modules.ts file when you\'re confident');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

migrate();
