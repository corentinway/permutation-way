import EventEmitter from "events";

/**
 * return the factorial of n: n!
 * The number of permutation of an array of length N to find must be equal to N!
 * @param n {number} the number to compute its factorial
 */
export function factorial(n : number) : number {
	if (n <= 0) {
		return 1;
	} else {
		return n * factorial(n - 1);
	}
}


/**
 * a default comparator for 2 elements
 */
 export function defaultComparator (a : number , b : number) : 0 | 1 | -1 {
	if (a > b) {
		return 1;
	} else if (a < b) {
		return -1;
	} else {
		return 0;
	}
}

export type ExpectedPermutationTester = (actual : number) => boolean;

export function emitSmallPermutation(data : any[], expectedPermutationTester : ExpectedPermutationTester, emitter : EventEmitter) {

	if (!data) {
		process.nextTick(function () {
			emitter.emit('error', new Error('The input array is undefined or null'));
		});
		return true;
	}

	if (!Array.isArray(data)) {
		process.nextTick(function () {
			emitter.emit('error', new Error('The input data is not an Array'));
		});
		return true;
	}


	/*
	 *   -- SHORTCHUT --
	 * if the data array is empty or has 1 element,
	 * there is only one permutation: itself
	 */
	if (data.length <= 1) {
		process.nextTick(function () {
			emitter.emit('data', data);
			checkExpected(1, expectedPermutationTester, emitter);
		});
		return true;
	}
	/*
	 *   -- SHORTCHUT --
	 * if the data array is empty or has 2 element,
	 * there is only one permutation: itself and its reverse
	 */
	if (data.length === 2) {
		process.nextTick(function () {
			emitter.emit('data', data);
			emitter.emit('data', data.reverse());
			checkExpected(2, expectedPermutationTester, emitter);
		});
		return true;
	}
}


/**
 * check the expected amount of permutation and emit 'end' event if the amount is reached,
 * otherwose emit 'error' signal with the Error object.
 * @param actual {Number} number of permutation found
 * @param expected {Number} number of permutation expected
 * @param emitter {EventEmitter}
 */
 export function checkExpected(actual : number, expectedTester : ExpectedPermutationTester, emitter : EventEmitter) {
	if ( expectedTester( actual ) ) {
		emitter.emit('end');
	} else {
		var err = new Error('The expected amount of permutation was not reached. Expected: FIXME ');
		emitter.emit('error', err);
	}
}


