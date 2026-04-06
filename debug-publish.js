const { execSync } = require('child_process');

try {
  console.log('Running changeset publish...');
  const output = execSync('npx changeset publish', { stdio: 'pipe' });
  console.log('SUCCESS:');
  console.log(output.toString());
} catch (error) {
  console.error('ERROR OCCURRED:');
  console.error(error.message);
  console.error('STDOUT:');
  console.error(error.stdout?.toString());
  console.error('STDERR:');
  console.error(error.stderr?.toString());
}
