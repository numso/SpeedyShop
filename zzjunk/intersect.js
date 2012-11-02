var assert = require('assert');

/////////////////////////////////////////////////////
/// Your Code Starts Here!! /////////////////////////
/////////////////////////////////////////////////////

var intersect = function (a, b) {
    return [];
};

/////////////////////////////////////////////////////
/// Your Code Ends Here!! ///////////////////////////
/////////////////////////////////////////////////////

assert.deepEqual(intersect([1, 2, 3], [2, 3, 4]), [2, 3]);

assert.deepEqual(intersect([2, 3, 4], [4, 5, 6]), [4]);

assert.deepEqual(intersect([1, 2, 3, 4], [5, 6, 7, 8]), []);

assert.deepEqual(intersect([3, 2, 1], [1, 2, 3]), [1, 2, 3]);

console.log("Success!")
