const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = __dirname;
const token = process.argv[2] || process.env.GITHUB_TOKEN;

async function run() {
  console.log('1. Fetching latest remote main branch...');
  const fetchRes = await git.fetch({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token, password: '' })
  });

  const remoteHead = fetchRes.fetchHead;
  console.log('Remote HEAD commit:', remoteHead);

  console.log('2. Staging all workspace files...');
  const filesToIgnore = new Set([
    'node_modules',
    '.git',
    '.env',
    'uploads'
  ]);

  function getFiles(currentDir, relativePrefix = '') {
    const entries = fs.readdirSync(currentDir, { withFileTypes: true });
    let fileList = [];
    for (const entry of entries) {
      if (filesToIgnore.has(entry.name)) continue;
      const fullPath = path.join(currentDir, entry.name);
      const relPath = relativePrefix ? `${relativePrefix}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        fileList = fileList.concat(getFiles(fullPath, relPath));
      } else {
        fileList.push(relPath);
      }
    }
    return fileList;
  }

  const allFiles = getFiles(dir);
  for (const filepath of allFiles) {
    await git.add({ fs, dir, filepath });
  }

  console.log('3. Committing with remote HEAD as parent...');
  const commitSha = await git.commit({
    fs,
    dir,
    message: 'NagarikAI: Full AI Citizen Grievance Redressal Platform with Computer Vision, Multilingual Voice, GIS Heatmap & Supabase Integration',
    parent: [remoteHead],
    author: {
      name: 'Lokesh Sadhu',
      email: 'lokeshsadhu2411@gmail.com'
    }
  });
  console.log('New commit created:', commitSha);

  console.log('4. Setting local branch refs/heads/main to new commit...');
  await git.writeRef({
    fs,
    dir,
    ref: 'refs/heads/main',
    value: commitSha,
    force: true
  });

  // Also set remote tracking ref
  await git.writeRef({
    fs,
    dir,
    ref: 'refs/remotes/origin/main',
    value: remoteHead,
    force: true
  });

  console.log('5. Pushing fast-forward commit to remote origin main...');
  const pushRes = await git.push({
    fs,
    http,
    dir,
    remote: 'origin',
    ref: 'main',
    onAuth: () => ({ username: token, password: '' })
  });

  console.log('Push response:', pushRes);
  if (pushRes.ok) {
    console.log('🎉 PUSH COMPLETED SUCCESSFULLY TO https://github.com/lokeshsadhu2411-blip/ANTI');
  }
}

run().catch(err => {
  console.error('Error during push:', err);
  process.exit(1);
});
