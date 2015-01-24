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
	it( 'should find all permutations', function ( done ) {
		var input = [ 1, 2, 3 ];
		
		var actualPermutationCount = 0;
		
		var permutationSet = {};
		// call and assertions
		new Permutation( input ).on( 'data', function ( data ) {
			actualPermutationCount++;
			permutationSet[ data.toString() ] = true;
		} ).on( 'end', function () {
			// asserting that we found all the permutation
			assert.equal( factorial( input.length ), Object.keys( permutationSet ).length  );
			done();
		} ).on( 'error', done );
		
	} );
	
	it( 'should find all permutation for any input permutation', function ( done ) {
		var input = [ 3, 2, 1 ];
		
		var actualPermutationCount = 0;
		var expectedPermutationCount = factorial( input.length );
		
		var permutationSet = {};
		// call and assertions
		
		new Permutation( input ).on( 'data', function ( data ) {
			actualPermutationCount++;
			permutationSet[ data.toString() ] = true;
			
			(function () {
				var actualPermutationCount2 = 0;
				var permutationSet2 = {};
				// all permutation found MUST have the same amount of permutation
				new Permutation( input ).on( 'data', function ( data ) {
					actualPermutationCount2++;
					permutationSet2[ data.toString() ] = true;
				} ).on( 'end', function () {
					// asserting that we found all the permutation
					assert.equal( Object.keys( permutationSet2 ).length, expectedPermutationCount );
					//done();
				} ).on( 'error', done );
			} )();
			
			
		} ).on( 'end', function () {
			// asserting that we found all the permutation
			assert.equal( Object.keys( permutationSet ).length, expectedPermutationCount );
			done();
		} ).on( 'error', done );
		
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
