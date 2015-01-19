[![Build Status](https://travis-ci.org/corentinway/fixp.png?branch=master)](https://travis-ci.org/corentinway/fixp)

* About

This is a module to deliver asynchronously one unique permutation of the input array.

You can get permutations of any objects into an array. If you want to get permutation of complex object you should provide
a comparator function.

* Example


** Simple Example

```javascript

var Permutation = require( 'permutation-way' );

var input = [ 1, 2, 3 ];
		
new Permutation( input ).on( 'data', function ( data ) { 
  // display one permutation
  console.log( data );
} ).on( 'end', function () {
  // end of permutation
  console.log( 'end' );
}  );
```

This will output into the console:

```
[ 1, 2, 3 ]
[ 1, 3, 2 ]
[ 3, 1, 2 ]
[ 3, 2, 1 ]
[ 2, 3, 1 ]
[ 2, 1, 3 ]
```

Even the input array match one permutation and hence is emmitted too.


** Permutation of objects

// TODO 

```javascript

var Permutation = require( 'permutation-way' );

var input = [ {}, {}, {} ];

function comparator ( a, b ) {
  if ( a.code > b.code ) {
    // after
    return 1;
  } else if ( a.code < b.code ) {
    // before
    return -1;
  } else {
    // equals
    return 0;
  }
		
new Permutation( input, comparator ).on( 'data', function ( data ) { 
  // display one permutation
  console.log( data );
} ).on( 'end', function () {
  // end of permutation
  console.log( 'end' );
}  );
```


* Much more permutation.

If you want to play with a high volume of permutation, just create an array of 10 elements.