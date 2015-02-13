var assert = require("assert");
var path = require("path");
var local = path.join.bind(path, __dirname);

describe("Checkout", function() {
  var Repository = require(local("../../lib/repository"));
  var Checkout = require(local("../../lib/checkout"));

  var packageJsonOid = "0fa56e90e096a4c24c785206b826ab914ea3de1e";
  var reposPath = local("../repos/workdir/.git");

  before(function() {
    var test = this;

    return Repository.open(reposPath)
      .then(function(repo) {
        test.repo = repo;
      });
  });

  it("can checkout the head", function() {
    var test = this;

    return Checkout.head(test.repo)
    .then(function() {
      return test.repo.getBlob(packageJsonOid);
    })
    .then(function(blob) {
      var packageJson = blob.toString();

      assert.ok(~packageJson.indexOf("\"ejs\": \"~1.0.0\","));
    });
  });

  it("can checkout by tree", function() {
    var test = this;

    return test.repo.getTagByName("annotated-tag").then(function(tag) {
      return Checkout.tree(test.repo, test.tag);
    }).then(function() {
      return test.repo.getHeadCommit();
    }).then(function(commit) {
      assert.equal(commit, "32789a79e71fbc9e04d3eff7425e1771eb595150");
    });
  });
});
