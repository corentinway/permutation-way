/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

var Permutation = require( './Permutation' );

exports.permutationOf = function ( input, comparator ) {
	return new Permutation( input, comparator );
};
