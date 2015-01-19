/*jslint node: true, white: true, vars:true, plusplus: true */
/*global describe, it */

'use strict';

// TODO coverage

var Permutation = require( '../lib/Permutation' );
var assert = require( 'chai' ).assert;

function assertArray( array, expectedLength ) {
	assert.isArray( array );
	assert.lengthOf( array, expectedLength );	
}


/**
 * return the factorial of n: n!
 * @param n {number} the number to compute its factorial
 */
function factorial ( n ) {
	if ( n <= 0 ) {
		return 1;
	} else {
		return n * factorial( n - 1 );
	}
}





describe( 'Permutation', function () {
	it( 'should permut something', function ( done ) {
		var input = [ 1, 2, 3 ];
		
		var actualPermutationCount = 0;
		
		var permutationSet = {};
		
		new Permutation( input ).on( 'data', function ( data ) {
			actualPermutationCount++;
			
//			console.log( 'permuation: ' + data );
			permutationSet[ data.toString() ] = true;
			
		} ).on( 'end', function () {
//			console.log( 'end of permutation' );
			
			// asserting that we found all the permutation
			assert.equal( factorial( input.length ), Object.keys( permutationSet ).length  );
			
			done();
		}  );
		
	} );
	
	
	
} );


/*
function describe( text, callback ) {
	console.log( text );
	callback();
}
function done() {
	console.log( 'done' );
}
function it( text, callback ) {
	console.log( '  ' + text );
	callback( done );
}
*/
