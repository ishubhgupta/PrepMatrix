const { execSync } = require('child_process');

// Set the DATABASE_URL environment variable
process.env.DATABASE_URL = 'mysql://4GMsiZeAisLHq9S.root:mi4873LxA8umXePb@gateway01.ap-southeast-1.prod.aws.tidbcloud.com:4000/prepmatrix';

// Create prisma.config.js with the correct format
const fs = require('fs');
const config = `module.exports = {
  datasources: {
    db: {
      url: "${process.env.DATABASE_URL}"
    }
  }
};`;

fs.writeFileSync('prisma.config.js', config);

console.log('📦 Created prisma.config.js');
console.log('🚀 Running prisma db push...\n');

try {
  execSync('npx prisma db push', { stdio: 'inherit', env: process.env });
} catch (error) {
  console.error('Error:', error.message);
  process.exit(1);
}
