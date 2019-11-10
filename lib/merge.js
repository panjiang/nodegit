var NodeGit = require("../");
var normalizeOptions = NodeGit.Utils.normalizeOptions;

var Merge = NodeGit.Merge;
var _commits = Merge.commits;
var _merge = Merge.merge;
var _file = Merge.file;


/**
 * Merge two files as they exist in the in-memory data structures, using 
 * the given common ancestor as the baseline. (git_merge_file)
 *
 * @param {MergeFileInput} ancestor The contents of the ancestor file
 * @param {MergeFileInput} ours The contents of the file in "our" side
 * @param {MergeFileInput} theirs The contents of the file in "theirs" side
 * @param {MergeFileOptions} [options] The merge file options or `NULL` for defaults
 */
Merge.file = function (ancestor, ours, theirs, options) {
  ancestor = normalizeOptions(ancestor, NodeGit.MergeFileInput);
  ours = normalizeOptions(ours, NodeGit.MergeFileInput);
  theirs = normalizeOptions(theirs, NodeGit.MergeFileInput);
  options = normalizeOptions(options || {}, NodeGit.MergeFileOptions);
  return _file.call(this, ancestor, ours, theirs, options);
}

/**
 * Merge 2 commits together and create an new index that can
 * be used to create a merge commit.
 *
 * @param {Repository} repo Repository that contains the given commits
 * @param {Commit} ourCommit The commit that reflects the destination tree
 * @param {Commit} theirCommit The commit to merge into ourCommit
 * @param {MergeOptions} [options] The merge tree options (null for default)
 */
Merge.commits = function (repo, ourCommit, theirCommit, options) {
  options = normalizeOptions(options, NodeGit.MergeOptions);

  return Promise.all([
    repo.getCommit(ourCommit),
    repo.getCommit(theirCommit)
  ]).then(function (commits) {
    return _commits.call(this, repo, commits[0], commits[1], options);
  });
};

/**
 * Merge a commit into HEAD and writes the results to the working directory.
 *
 * @param {Repository} repo Repository that contains the given commits
 * @param {AnnotatedCommit} theirHead The annotated commit to merge into HEAD
 * @param {MergeOptions} [mergeOpts] The merge tree options (null for default)
 * @param {CheckoutOptions} [checkoutOpts] The checkout options
 *                                         (null for default)
 */
Merge.merge = function (repo, theirHead, mergeOpts, checkoutOpts) {
  mergeOpts = normalizeOptions(mergeOpts || {}, NodeGit.MergeOptions);
  checkoutOpts = normalizeOptions(checkoutOpts || {}, NodeGit.CheckoutOptions);

  // Even though git_merge takes an array of annotated_commits, it expects
  // exactly one to have been passed in or it will throw an error...  ¯\_(ツ)_/¯
  var theirHeads = [theirHead];

  return _merge.call(this, repo, theirHeads, theirHeads.length,
    mergeOpts, checkoutOpts);
};
