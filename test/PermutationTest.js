/*jslint node: true, white: true, vars:true, plusplus: true */
/*global describe, it */

'use strict';

// TODO coverage

var { Permutation } = require('../dist/Permutation');
var assert = require('chai').assert;

function assertArray(array, expectedLength) {
	assert.isArray(array);
	assert.lengthOf(array, expectedLength);
}


/**
 * return the factorial of n: n!
 * @param n {number} the number to compute its factorial
 */
function factorial(n) {
	if (n <= 0) {
		return 1;
	} else {
		return n * factorial(n - 1);
	}
}

const comparator = (obj1, obj2) => {
	if (obj1.age > obj2.age) {
		return 1;
	} else if (obj1.age < obj2.age) {
		return -1;
	}
	return 0;
}


describe('Permutation', function () {
	describe('For Numeric data', () => {

		it('should find all permutations', function (done) {
			var input = [1, 2, 3];

			var actualPermutationCount = 0;

			var permutationSet = {};
			// call and assertions
			new Permutation(input).on('data', function (data) {
				actualPermutationCount++;
				permutationSet[data.toString()] = true;
			}).on('end', function () {
				// asserting that we found all the permutation
				assert.equal(factorial(input.length), Object.keys(permutationSet).length);
				done();
			}).on('error', done);

		});

		it('should find all permutation for any input permutation', function (done) {
			var input = [3, 2, 1];

			var actualPermutationCount = 0;
			var expectedPermutationCount = factorial(input.length);

			var permutationSet = {};
			// call and assertions

			new Permutation(input).on('data', function (data) {
				actualPermutationCount++;
				permutationSet[data.toString()] = true;

				(function () {
					var actualPermutationCount2 = 0;
					var permutationSet2 = {};
					// all permutation found MUST have the same amount of permutation
					new Permutation(input).on('data', function (data) {
						actualPermutationCount2++;
						permutationSet2[data.toString()] = true;
					}).on('end', function () {
						// asserting that we found all the permutation
						assert.equal(Object.keys(permutationSet2).length, expectedPermutationCount);
						//done();
					}).on('error', done);
				})();


			}).on('end', function () {
				// asserting that we found all the permutation
				assert.equal(Object.keys(permutationSet).length, expectedPermutationCount);
				done();
			}).on('error', done);

		});


		it('should returns only the maximumn permutation ', function (done) {
			var input = [3, 2, 1];

			var options = {
				max: 4
			};

			var actualPermutationCount = 0;
			var expectedPermutationCount = options.max;

			var permutationSet = {};
			// call and assertions
			new Permutation(input, options).on('data', function (data) {
				actualPermutationCount++;
				permutationSet[data.toString()] = true;

				(function () {
					var actualPermutationCount2 = 0;
					var permutationSet2 = {};
					// all permutation found MUST have the same amount of permutation
					new Permutation(input, options).on('data', function (data) {
						actualPermutationCount2++;
						permutationSet2[data.toString()] = true;
					}).on('end', function () {
						// asserting that we found all the permutation
						assert.equal(Object.keys(permutationSet2).length, expectedPermutationCount);
						//done();
					}).on('error', done);
				})();


			}).on('end', function () {
				// asserting that we found all the permutation
				assert.equal(Object.keys(permutationSet).length, expectedPermutationCount);
				done();
			}).on('error', done);

		});

		it('should returns no more than the maximumn expected amount of permutations', function (done) {
			var input = [3, 2];

			var options = {
				max: 4
			};

			var actualPermutationCount = 0;
			var expectedPermutationCount = 2;

			var permutationSet = {};
			// call and assertions
			new Permutation(input, options).on('data', function (data) {
				actualPermutationCount++;
				permutationSet[data.toString()] = true;

				(function () {
					var actualPermutationCount2 = 0;
					var permutationSet2 = {};
					// all permutation found MUST have the same amount of permutation
					new Permutation(input, options).on('data', function (data) {
						actualPermutationCount2++;
						permutationSet2[data.toString()] = true;
					}).on('end', function () {
						// asserting that we found all the permutation
						assert.equal(Object.keys(permutationSet2).length, expectedPermutationCount);
						//done();
					}).on('error', done);
				})();


			}).on('end', function () {
				// asserting that we found all the permutation
				assert.equal(Object.keys(permutationSet).length, expectedPermutationCount);
				done();
			}).on('error', done);

		});


		it('should returns only the 0 permutation if options.max is set to 0', function (done) {
			var input = [3, 2, 1];

			var options = {
				max: 0
			};

			// call and assertions
			new Permutation(input, options).on('data', function (data) {
				done(new Error('it must not return any permutation when options.max === 0'));
			}).on('end', function () {
				done();
			}).on('error', done);

		});

		it('should emit en error when options.max is not a number', function (done) {
			var input = [3, 2, 1];

			var options = {
				max: "hello"
			};

			// call and assertions
			new Permutation(input, options).on('data', function (data) {
				done(new Error('it must not return any permutation when options.max is not a number'));
			}).on('end', function () {
				done(new Error('it must not end when options.max is not a number'));
			}).on('error', function (err) {
				done();
			});

		});

		it('should emit en error when options.max is a negative number', function (done) {
			var input = [3, 2, 1];

			var options = {
				max: -2
			};

			// call and assertions
			new Permutation(input, options).on('data', function (data) {
				done(new Error('it must not return any permutation when options.max is not a positive number'));
			}).on('end', function () {
				done(new Error('it must not end when options.max is not a positive number'));
			}).on('error', function (err) {
				done();
			});

		});

		it('should stop when #interrupt method is invoked', function (done) {
			var input = [1, 2, 3];

			var actualPermutationCount = 0;

			// call and assertions
			var p = new Permutation(input).on('data', function (data) {
				actualPermutationCount++;
				if (actualPermutationCount === 2) {
					p.interrupt();
				}
			}).on('end', function () {
				// asserting that we found all the permutation
				assert.equal(2, actualPermutationCount);
				done();
			}).on('error', done);

		});

		it('should stop when #interrupt(error) method is invoked', function (done) {
			var input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

			var actualPermutationCount = 0;

			// call and assertions
			var p = new Permutation(input).on('data', function (data) {
				actualPermutationCount++;
				if (actualPermutationCount === 2) {
					p.interrupt('error interrupted');
				}
			}).on('end', function () {
				done('an error is expected');
			}).on('error', function (err) {
				assert.equal('error interrupted', err);
				done();
			});

		});

	});

	describe("For objects", () => {
		it('should permut 2 objects in an array', function (done) {
			var input = [
				{ age: 15 },
				{ age: 999 },
				{ age: 7 },
				{ age: 10 },
			];
			var actualPermutationCount = 0;
			var expected = factorial(input.length);
			new Permutation(input, comparator).on('data', () => {
				actualPermutationCount++;
			}).on('end', function () {
				// asserting that we found all the permutation
				assert.equal(expected, actualPermutationCount);
				done();
			}).on('error', function (err) {
				done(`Error not expected : ${err}`);
			});

		});
	});

	 

});