const fs = require('fs');
const path = require('path');

const inputFile = path.resolve(__dirname, '../src/data/modules.ts');
const outputDir = path.resolve(__dirname, '../src/data');

function extractArraySection(content, arrayName) {
  const regex = new RegExp(`export const ${arrayName}:[^[]*\\[([\\s\\S]*?)\\];`, 'g');
  let match;
  const allMatches = [];
  while ((match = regex.exec(content)) !== null) {
    allMatches.push(match[1]);
  }

  if (allMatches.length === 0) {
    console.log(`No match found for ${arrayName}`);
    return [];
  }

  const sectionContent = allMatches[0];
  console.log(`\n[${arrayName}] Extracted ${sectionContent.length} chars`);

  const items = [];
  let depth = 0;
  let inString = false;
  let stringChar = '';
  let current = '';
  let i = 0;

  while (i < sectionContent.length) {
    const char = sectionContent[i];

    if (inString) {
      current += char;
      if (char === stringChar && sectionContent[i-1] !== '\\') {
        inString = false;
      }
    } else {
      if (char === '"' || char === "'") {
        inString = true;
        stringChar = char;
        current += char;
      } else if (char === '`') {
        inString = true;
        stringChar = '`';
        current += char;
      } else if (char === '{') {
        depth++;
        current += char;
      } else if (char === '}') {
        depth--;
        current += char;
        if (depth === 0 && current.trim()) {
          const item = parseObject(current.trim());
          if (item) items.push(item);
          current = '';
        }
      } else if (char === ',' && depth === 0) {
        if (current.trim()) {
          const item = parseObject(current.trim());
          if (item) items.push(item);
          current = '';
        }
      } else if (char === '\n' || char === '\r') {
        if (current.trim() && depth > 0) {
          current += char;
        }
      } else if (depth > 0) {
        current += char;
      }
    }
    i++;
  }

  if (current.trim()) {
    const item = parseObject(current.trim());
    if (item) items.push(item);
  }

  console.log(`[${arrayName}] Parsed ${items.length} items`);
  return items;
}

function parseObject(str) {
  try {
    let cleaned = str.trim();

    cleaned = cleaned.replace(/^\s*\/\/.*$/gm, '');

    cleaned = cleaned.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

    cleaned = cleaned.replace(/'/g, '"');

    console.log(`  Trying to parse: ${cleaned.substring(0, 60)}...`);

    let result = cleaned;
    let i = 0;
    while (i < result.length) {
      if (result[i] === '`') {
        result = result.substring(0, i) + '\\`' + result.substring(i + 1);
      } else if (result[i] === '$' && result[i+1] === '{') {
        result = result.substring(0, i) + '\\${' + result.substring(i + 2);
        i += 1;
      }
      i++;
    }

    result = result.replace(/,\s*([}\]])/g, '$1');

    result = result.trim();

    console.log(`  Trying to parse: ${result.substring(0, 60)}...`);
    return JSON.parse(result);
  } catch (e) {
    console.log(`  Parse failed: ${e.message}`);
    return null;
  }
}

function parseModulesTs(filePath) {
  console.log('Reading file...');
  const content = fs.readFileSync(filePath, 'utf-8');
  console.log(`File size: ${content.length} chars`);

  const modules = extractArraySection(content, 'modules');
  const lessons = extractArraySection(content, 'lessons');
  const exercises = extractArraySection(content, 'exercises');

  return { modules, lessons, exercises };
}

function createOutputStructure(data) {
  const modulesDir = path.join(outputDir, 'modules');
  const lessonsDir = path.join(outputDir, 'lessons');
  const exercisesDir = path.join(outputDir, 'exercises');

  [modulesDir, lessonsDir, exercisesDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });

  data.modules.forEach(module => {
    if (module && module.id) {
      const modulePath = path.join(modulesDir, `${module.id}.json`);
      fs.writeFileSync(modulePath, JSON.stringify(module, null, 2));
    }
  });

  data.lessons.forEach(lesson => {
    if (lesson && lesson.id) {
      const lessonPath = path.join(lessonsDir, `${lesson.id}.json`);
      fs.writeFileSync(lessonPath, JSON.stringify(lesson, null, 2));
    }
  });

  data.exercises.forEach(exercise => {
    if (exercise && exercise.id) {
      const exercisePath = path.join(exercisesDir, `${exercise.id}.json`);
      fs.writeFileSync(exercisePath, JSON.stringify(exercise, null, 2));
    }
  });

  const learningPath = {
    id: 'react-learning-path',
    title: 'React & TypeScript Learning Path',
    description: 'Master React and TypeScript through interactive lessons',
    version: '1.0.0',
    modules: data.modules.filter(m => m && m.id).map(m => ({
      id: m.id,
      title: m.title,
      description: m.description,
      icon: m.icon,
      requiredXp: m.requiredXp,
      color: m.color,
      lessonCount: data.lessons.filter(l => l.moduleId === m.id).length,
      lessons: data.lessons
        .filter(l => l.moduleId === m.id && l.order)
        .sort((a, b) => a.order - b.order)
        .map(l => ({
          id: l.id,
          title: l.title,
          order: l.order,
          xpReward: l.xpReward,
          difficulty: l.difficulty,
          exerciseCount: data.exercises.filter(e => e.lessonId === l.id).length
        }))
    })),
    totalLessons: data.lessons.filter(l => l && l.id).length,
    totalExercises: data.exercises.filter(e => e && e.id).length,
    totalXp: (data.modules.filter(m => m && m.requiredXp).reduce((sum, m) => sum + m.requiredXp, 0)) +
             (data.lessons.filter(l => l && l.xpReward).reduce((sum, l) => sum + l.xpReward, 0)) +
             (data.exercises.filter(e => e && e.xpReward).reduce((sum, e) => sum + e.xpReward, 0))
  };

  const learningPathPath = path.join(outputDir, 'learning-path.json');
  fs.writeFileSync(learningPathPath, JSON.stringify(learningPath, null, 2));

  console.log('\n========== SUMMARY ==========');
  console.log('Created files:');
  console.log(`- learning-path.json`);
  data.modules.filter(m => m && m.id).forEach(m => console.log(`- modules/${m.id}.json`));
  data.lessons.filter(l => l && l.id).forEach(l => console.log(`- lessons/${l.id}.json`));
  data.exercises.filter(e => e && e.id).forEach(e => console.log(`- exercises/${e.id}.json`));
  console.log(`\nTotal: ${data.modules.filter(m => m && m.id).length} modules, ${data.lessons.filter(l => l && l.id).length} lessons, ${data.exercises.filter(e => e && e.id).length} exercises`);
}

const data = parseModulesTs(inputFile);
createOutputStructure(data);
