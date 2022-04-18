/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

// TODO coverage

var swap = require( '../lib/swap' );
var assert = require( 'chai' ).assert;

function assertArray( array, expectedLength ) {
	assert.isArray( array );
	assert.lengthOf( array, expectedLength );	
}

describe( 'swap left', function () {
	
	it( 'should raise an exception if the index is out of the array', function () {
		var testFailing = false;
		try {
			// input
			var input = [ 1, 2 ];

			// call
			swap.left( input, 3 );
			testFailing = true;
		} catch ( e ) {
			assert.isDefined( e );
			assert.equal(e.message, 'You cannot swap with an index of of the array bound');
		}
		if(testFailing) {
			assert.fail();
		}
	} );
	
	it( 'should swap to the left', function () { 
		// input
		var input = [ 1, 2 ];
		
		// call
		swap.left( input, 1 );
		
		// assertions
		assertArray( input, 2 );
		assert.deepEqual( input, [ 2, 1 ] );
		
	} );
	
	it( 'should swap to the left for a array of length > 3', function () { 
		// input
		var input = [ 1, 2, 3 ];
		
		// call
		swap.left( input, 1 );
		
		// assertions
		assertArray( input, 3 );
		assert.deepEqual( input, [ 2, 1, 3 ] );
		
	} );
	
} );



describe( 'swap right', function () {
	
	it( 'should raise an exception if the index is out of the array', function () {
		try {
			// input
			var input = [ 1, 2 ];

			// call
			swap.right( input, 3 );
			assert.fail( 'Exception expected to be raised' );
		} catch ( e ) {
			assert.isDefined( e );
		}
	} );
		
	it( 'should swap to the left', function () { 
		// input
		var input = [ 1, 2 ];
		
		// call
		swap.right( input, 0 );
		
		// assertions
		assertArray( input, 2 );
		assert.deepEqual( input, [ 2, 1 ] );
		
	} );
	
	it( 'should swap to the left for a array of length > 3', function () { 
		// input
		var input = [ 1, 2, 3 ];
		
		// call
		swap.right( input, 1 );
		
		// assertions
		assertArray( input, 3 );
		assert.deepEqual( input, [ 1, 3, 2 ] );
		
	} );
	
} );