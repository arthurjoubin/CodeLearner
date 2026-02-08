const fs = require('fs');

const content = fs.readFileSync('src/data/modules/frontend-deployment.json', 'utf8');

// Look at what comes before position 13307
const pos = 13307;
console.log('Content BEFORE position 13307:');
console.log('Context:', JSON.stringify(content.substring(pos - 200, pos)));

// Let's find all properties around that area
console.log('\n\nSearching for all property names around position 13000-13500:');
const section = content.substring(13000, 13500);
const propMatches = section.match(/"[a-zA-Z_][a-zA-Z0-9_]*":/g);
if (propMatches) {
  propMatches.forEach((match, i) => {
    const idx = section.indexOf(match);
    console.log(`  ${match} at offset ${idx}`);
  });
}

// Check if there's a missing comma
console.log('\n\nChecking structure around position 13000:');
console.log(JSON.stringify(content.substring(12900, 13100)));
