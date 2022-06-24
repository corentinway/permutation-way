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
};



