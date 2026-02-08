const fs = require('fs');
const path = require('path');

const filesToFix = [
  'src/data/modules/auth-security.json',
  'src/data/modules/frontend-deployment.json'
];

function fixJsonFile(filePath) {
  console.log(`\n=== Processing: ${filePath} ===`);
  
  const fullPath = path.join(process.cwd(), filePath);
  let content = fs.readFileSync(fullPath, 'utf8');
  
  // Try parsing first
  try {
    JSON.parse(content);
    console.log('  ✓ JSON is already valid');
    return;
  } catch (e) {
    console.log(`  ✗ Parse error: ${e.message}`);
  }
  
  // Fix 1: Remove invalid escape sequences like \...  
  const invalidEscapePattern = /\\\.{3}/g;
  if (invalidEscapePattern.test(content)) {
    content = content.replace(invalidEscapePattern, '...');
    console.log('  ✓ Fixed: Removed invalid \\... escape sequences');
  }
  
  // Fix 2: Process character by character to:
  // - Replace literal newlines inside JSON strings with \\n
  // - Escape unescaped quotes inside strings
  let result = '';
  let inString = false;
  let escapeNext = false;
  let newlineCount = 0;
  let quoteEscapeCount = 0;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    
    if (escapeNext) {
      result += char;
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      result += char;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      if (inString) {
        // We're already in a string and hit an unescaped quote
        // This could be the closing quote OR an unescaped quote inside the string
        // We need to decide which one it is
        // Strategy: look ahead to see if this looks like a closing quote
        // A closing quote should be followed by: , } ] : or whitespace
        const nextNonWhitespace = content.substring(i + 1).match(/^[\s,\}\]:]*/);
        const hasStructuralChar = content.substring(i + 1).match(/^[\s]*[,\}\]:]/);
        
        if (hasStructuralChar) {
          // This looks like a closing quote
          inString = false;
          result += char;
        } else {
          // This looks like an unescaped quote inside the string - escape it
          result += '\\"';
          quoteEscapeCount++;
        }
      } else {
        // Starting a string
        inString = true;
        result += char;
      }
      continue;
    }
    
    // If we hit a newline while inside a string, replace with \\n
    if (char === '\n' && inString) {
      result += '\\n';
      newlineCount++;
      continue;
    }
    
    result += char;
  }
  
  if (newlineCount > 0) {
    console.log(`  ✓ Fixed: Replaced ${newlineCount} literal newlines with \\n inside strings`);
  }
  if (quoteEscapeCount > 0) {
    console.log(`  ✓ Fixed: Escaped ${quoteEscapeCount} unescaped quotes inside strings`);
  }
  
  content = result;
  
  // Try parsing again
  try {
    JSON.parse(content);
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log('  ✓ JSON is now valid - file saved');
  } catch (e) {
    console.log(`  ✗ Still invalid: ${e.message}`);
    
    // Debug: show position
    const match = e.message.match(/position (\d+)/);
    if (match) {
      const pos = parseInt(match[1]);
      console.log(`  Debug: Context around position ${pos}:`);
      const start = Math.max(0, pos - 50);
      const end = Math.min(content.length, pos + 50);
      console.log('  ', JSON.stringify(content.substring(start, end)));
      console.log(`   ${' '.repeat(pos - start + 2)}^`);
    }
  }
}

filesToFix.forEach(file => {
  try {
    fixJsonFile(file);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
});

console.log('\n=== Done ===');
