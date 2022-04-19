/*jslint node: true, white: true, vars:true, plusplus: true */
/*global describe, it */
'use strict';
/**
* script to test in debug mode the interrupt function
*/
var Permutation = require( '../dist/Permutation' );

var p = new Permutation( [1, 2, 3, 4] ).on( 'data', function ( data ) {
	console.log( 'Permutation: ', data );
	console.log ( 'interrupt' );
	p.interrupt();
} ).on( 'end', function () {
	console.log( 'end');
} ).on( 'error', function ( err ) {
	console.error( 'ERROR', err );
} );