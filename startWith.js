var assert = require("assert");
var Benchmark = require("benchmark");

// Setup
var shortString = "startsWith";

var longString = ["startsWith"];
for(var i = 0 ; i < 10000; i++) {
  longString.push(" and some dummy strings");
}
longString = longString.join();

// Candidates
function startsWith1(str, find) { return str.indexOf(find) === 0; }
function startsWith2(str, find) { return str.lastIndexOf(find) === 0; }
function startsWith3(str, find) { return str.substring(0, find.length) === find; }
function startsWith4(str, find) { return str.slice(0, find.length) === find; }
function startsWith5(str, find) { return new RegExp("^" + find).test(str); }
function startsWith8(str, find) { return str.startsWith(find);}//  if(typeof String.prototype.startsWith === "function") {
function startsWith9(str, find) { return str.substr(0, find.length) === find; }

function runSuite(testString) {
  var suite = new Benchmark.Suite;

  suite
    .add("indexOf", function() {
      assert(startsWith1(testString, "start"));
      assert(!startsWith1(testString, "not"));
    })
    .add("lastIndexOf", function() {
      assert(startsWith2(testString, "start"));
      assert(!startsWith2(testString, "not"));
    })
    .add("substring", function() {
      assert(startsWith3(testString, "start"));
      assert(!startsWith3(testString, "not"));
    })
    .add("slice", function() {
      assert(startsWith4(testString, "start"));
      assert(!startsWith4(testString, "not"));
    })
    .add("substr", function() {
      assert(startsWith9(testString, "start"));
      assert(!startsWith9(testString, "not"));
    })
    .add("regex", function() {
      assert(startsWith5(testString, "start"));
      assert(!startsWith5(testString, "not"));
    })
  .add("startsWith", function() {
      assert(startsWith8(testString, "start"));
      assert(!startsWith8(testString, "not"));
    })
  .add("manual", function() {
      assert(startsWith6(testString, "start"));
      assert(!startsWith6(testString, "not"));
    })
    .on("cycle", function(ev) {
      console.log(String(ev.target));
    })
    .on("complete", function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    });

  suite.run({ async: false });
}

console.log("test on short string\n");
runSuite(shortString);

console.log("\n\ntest on long string\n");
runSuite(longString);