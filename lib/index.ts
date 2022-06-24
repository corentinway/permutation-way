/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

import { Permutation, Option } from "./Permutation";


export function permutationOf<T> (
	input: T[], 
	comparator?: (a: T, b:T) => 0 | 1 | -1,
	options?: Option ) {
	return new Permutation( input, comparator, options );
};
