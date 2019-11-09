var NodeGit = require('..');
var path = require('path')
var fse = require('fs-extra')

if(process.env.NODEGIT_TEST_THREADSAFETY) {
  console.log('Enabling thread safety in NodeGit');
  NodeGit.enableThreadSafety();
} else if (process.env.NODEGIT_TEST_THREADSAFETY_ASYNC) {
  console.log('Enabling thread safety for async actions only in NodeGit');
  NodeGit.setThreadSafetyStatus(NodeGit.THREAD_SAFETY.ENABLED_FOR_ASYNC_ONLY);
}

async function newMergeFileInput(filePath) {
  const stat = await fse.stat(filePath);
  const content = await fse.readFile(filePath);

  return {
    version: 0,
    ptr: content,
    size: content.length,
    path: filePath,
    mode: stat.mode,
  };
}

function getFilePath(fileName) {
  return path.join('/Users/mac/Library/Application Support/Electron/notedown/e5dcc97d-d105-41dc-bc49-70d0f3d5fa19/test', fileName)
}

async function test(){
  const base = await newMergeFileInput(getFilePath('base.md'));
  const ours = await newMergeFileInput(getFilePath('ours.md'));
  const theirs = await newMergeFileInput(getFilePath('theirs.md'));
  console.log(NodeGit.Merge.file(base, ours, theirs, {}))
}


test()

