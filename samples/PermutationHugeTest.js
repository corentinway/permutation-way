var {Permutation} = require( '../dist/Permutation' );


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




var input = [];
for( var i = 0; i < 10; i++ ) {
	input.push( i );
}

var expected = factorial( input.length );
console.log( 'Expected amount of permutations: ' + expected );

var count = 0;


new Permutation( input ).on( 'data', function ( data ) {

	count++;
//	if ( count % 1000000 === 0 ) {
//		console.log( count );
//	}

} ).on( 'end', function () {
	console.log( 'end of permutation' );
	console.log( 'Expected: ' + expected );
	console.log( 'Actual  : ' + count );
	console.log( 'Valid: ' + ( expected === count ) );

}  );
