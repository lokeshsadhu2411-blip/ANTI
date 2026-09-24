const git = require('isomorphic-git');
const http = require('isomorphic-git/http/node');
const fs = require('fs');
const path = require('path');

const dir = __dirname;

async function setup() {
  console.log('1. Initializing Git repository...');
  await git.init({ fs, dir });

  console.log('2. Staging files...');
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
  console.log(`Staged ${allFiles.length} files.`);

  console.log('3. Creating initial commit...');
  const sha = await git.commit({
    fs,
    dir,
    message: 'Initial commit: AI Citizen Grievance Redressal Platform (NagarikAI) with Supabase & GIS Heatmaps',
    author: {
      name: 'Lokesh Sadhu',
      email: 'lokeshsadhu@users.noreply.github.com'
    }
  });
  console.log('Committed successfully:', sha);

  console.log('4. Setting remote origin to https://github.com/lokeshsadhu2411-blip/ANTI.git...');
  try {
    await git.deleteRemote({ fs, dir, remote: 'origin' });
  } catch (e) {}

  await git.addRemote({
    fs,
    dir,
    remote: 'origin',
    url: 'https://github.com/lokeshsadhu2411-blip/ANTI.git'
  });

  console.log('Repository initialized and committed locally!');
}

setup().catch(err => {
  console.error('Setup failed:', err);
  process.exit(1);
});
