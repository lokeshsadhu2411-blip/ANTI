const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');

const dir = __dirname;
const token = process.argv[2] || process.env.GITHUB_TOKEN;

if (!token) {
  console.error('Error: Please provide your GitHub Personal Access Token (classic or fine-grained) as an argument:');
  console.error('Usage: node git-push.js <YOUR_GITHUB_TOKEN>');
  process.exit(1);
}

async function push() {
  console.log('Pushing to https://github.com/lokeshsadhu2411-blip/ANTI.git...');
  
  // Set current branch to main
  try {
    await git.branch({ fs, dir, ref: 'main', checkout: true });
  } catch (e) {}

  const pushResult = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    force: true,
    onAuth: () => ({
      username: token,
      password: ''
    })
  });

  if (pushResult.ok) {
    console.log('🎉 Successfully pushed to https://github.com/lokeshsadhu2411-blip/ANTI (main branch)!');
  } else {
    console.error('Push error result:', pushResult);
  }
}

push().catch(err => {
  console.error('Failed to push:', err.message || err);
  process.exit(1);
});
