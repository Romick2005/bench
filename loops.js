var assert = require("assert");
var Benchmark = require("benchmark");

// Setup
var smallArray = [1, 2, 3, 4, 8, 234, 645, 66, 45, 92, 0, 1, 23, 84, 3, 354];
var maxSmallArrayValue = 645;

var hugeArray = [];
var maxHugeArrayValue = -1;
for(var i = 0 ; i < 10000; i++) {
  const value = Math.floor(Math.random() * 1000);
  if (maxHugeArrayValue < value) {
    maxHugeArrayValue = value;
  }
  hugeArray.push(value);
}

// Candidates

// while loop
function loop1(array) {
  let i = 0;
  let max = -1;

  while (i < array.length) {
    if (max < array[i]) {
      max = array[i];
    }
    i++;
  }

  return max;
}

// for loop
function loop2(array) {
  let max = -1;

  for (let i = 0; i < array.length; i++) {
    if (max < array[i]) {
      max = array[i];
    }
  }

  return max;
}

// forEach() method
function loop3(array) {
  let max = -1;

  array.forEach(
    (element) => {
      if (max < element) {
        max = element;
      }
    }
  );

  return max;
}

// for...of loop
function loop4(array) {
  let max = -1;
  for (const element of array) {
    if (max < element) {
      max = element;
    }
  }

  return max;
}

// Reverse while loop
function loop5(array) {
  let i = array.length;
  let max = -1;

  while (i--) {
    if (max < array[i]) {
      max = array[i];
    }
  }

  return max;
}

// Reverse while loop with micro optimization
function loop6(array) {
  let i = array.length;
  let max = -1;

  while (i--) {
    const element = array[i];

    if (max < element) {
      max = element;
    }
  }

  return max;
}

// while loop with cached length
function loop7(array) {
  var i = 0, len = array.length;
  let max = -1;

  while (i < len) {
    const element = array[i];

    if (max < element) {
      max = element;
    }
    i++;
  }

  return max;
}

// for loop with cached length
function loop8(array) {
  const len = array.length;
  let max = -1;

  for (let i = 0; i < len; i++) {
    if (max < array[i]) {
      max = array[i];
    }
  }

  return max;
}

// while loop with cached length
function loop9(array) {
  const len = array.length;
  let i = 0;
  let max = -1;

  while (i < len) {
    if (max < array[i]) {
      max = array[i];
    }
    i++;
  }

  return max;
}

// while loop with cached length and prefix increament
function loop10(array) {
  const len = array.length;
  let i = 0;
  let max = -1;

  while (i < len) {
    if (max < array[i]) {
      max = array[i];
    }
    ++i;
  }

  return max;
}

function runSuite(array, expectedMaxMalue) {
  const suite = new Benchmark.Suite;

  suite.add(
    "whileLoop",
    function() {
      assert(
        loop1(array) === expectedMaxMalue
      );
    }
  ).add(
    "forLoop",
    function() {
      assert(
        loop2(array) === expectedMaxMalue
      );
    }
  ).add(
    "forEach",
    function() {
      assert(
        loop3(array) === expectedMaxMalue
      );
    }
  ).add(
    "for...of",
    function() {
      assert(
        loop4(array) === expectedMaxMalue
      );
    }
  ).add(
    "reverseWhile",
    function() {
      assert(
        loop5(array) === expectedMaxMalue
      );
    }
  ).add(
    "reverseWhileMicroOptimization",
    function() {
      assert(
        loop6(array) === expectedMaxMalue
      );
    }
  ).add(
    "whileWithCachedLen",
    function() {
      assert(
        loop7(array) === expectedMaxMalue
      );
    }
  ).add(
    "forLoopWithCachedLen",
    function() {
      assert(
        loop8(array) === expectedMaxMalue
      );
    }
  ).add(
    "whileLoopCachedLen",
    function() {
      assert(
        loop9(array) === expectedMaxMalue
      );
    }
  ).add(
    "whileLoopCachedWithLenAndPrefixIncrement",
    function() {
      assert(
        loop10(array) === expectedMaxMalue
      );
    }
  ).on(
    "cycle",
    function(ev) {
      console.log(String(ev.target));
    }
  ).on(
    "complete",
    function() {
      console.log("Fastest is " + this.filter("fastest").map("name"));
    }
  );

  suite.run(
    {
      async: false
    }
  );
}

// https://jsben.ch/wY5fo
// https://web.archive.org/web/20170403221045/https://blogs.oracle.com/greimer/entry/best_way_to_code_a

console.log("Test on small array\n");
runSuite(smallArray, maxSmallArrayValue);

console.log("\n\nTest on huge array\n");
runSuite(hugeArray, maxHugeArrayValue);

