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




var input = [
    {age: 15},
    {age: 999},
    {age: 11},
    {age: 0},
    {age: 1},
    {age: 2},
];


var expected = factorial( input.length );
console.log( 'Expected amount of permutations: ' + expected );

var count = 0;


const comparator = (obj1, obj2) => {
	if( obj1.age > obj2.age ) {
		return 1;
	} else if( obj1.age < obj2.age ) {
		return -1;
	}
	return 0;
}

new Permutation( input, comparator ).on( 'data', function ( data ) {

	count++;

    //console.log( `#${count} => ${JSON.stringify(data)}` );


} ).on( 'end', function () {
	console.log( 'end of permutation' );
	console.log( 'Expected: ' + expected );
	console.log( 'Actual  : ' + count );
	console.log( 'Valid: ' + ( expected === count ) );

}  );
