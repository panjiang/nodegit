var NodeGit = require('..');
var path = require('path')
var fse = require('fs-extra')

const dir = '/mnt/d/workspace/nodegit/test';

async function newMergeFileInput(filePath) {
  const stat = await fse.stat(filePath);
  const content = await fse.readFile(filePath, 'utf-8');

  // Wrong: It will case Crash.
  // const input = {
  //   ptr: content,
  //   size: content.length,
  //   mode: stat.mode,
  //   path: filePath,
  // }

  // Correct: Must create object from NodeGit class.
  const input = new NodeGit.MergeFileInput();
  input.ptr = content
  input.size = content.length
  input.mode = stat.mode
  input.path = filePath

  return input;
}

function getFilePath(fileName) {
  return path.join(dir, fileName)
}

async function test() {

  // 3 files.
  const base = await newMergeFileInput(getFilePath('base.md'));
  const ours = await newMergeFileInput(getFilePath('ours.md'));
  const theirs = await newMergeFileInput(getFilePath('theirs.md'));

  console.log({ base, ours, theirs })

  // Call merge file function.
  const res = await NodeGit.Merge.file(base, ours, theirs, {
    version: 0,
    ancestorLabel: 'BASE',
    ourLabel: 'OUR',
    theirLabel: 'THEIR',
    favor: 0,
    flags: 0,
    markerSize: 10
  });

  // Must call function to get field.
  console.log("res:", {
    automergeable: res.automergeable(),
    path: res.path(),
    mode: res.mode(),
    ptr: res.ptr(),
    len: res.len()
  })
}


test()

