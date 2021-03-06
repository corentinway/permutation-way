[![Build Status](https://travis-ci.org/corentinway/permutation-way.png?branch=master)](https://travis-ci.org/corentinway/permutation-way)

# About

This is a module to deliver asynchronously one unique permutation of the input array.

You can get permutations of any objects into an array. If you want to get permutation of complex object you should provide
a comparator function.

# Examples

## Declaration

The module <code>permutation-way</code> has one function: <code>permutationOf( inputArray[, comparator][, options] )</code>.

Where parameters are
* <code>inputArray</code> an array of any type element
* <code>comparator</code> a function used to compare each element of the <code>inputArray</code>. This is <em>optional</em>
* <code>options</code> an object to give extra options to the permutation engine.
  * <code>options.max</code> is a number that give the maximum number of permutation to receive. This is usefull if you want only
  4 permutations for an <code>inputArray</code> of 10 elements.


The <code>inputArray</code> is always returned first. So if you want to receive 4 <em>fresh new</em>
permutation at maximum for a big array, you must set the <code>options.max</code> to <code>5</code>.


## Simple Example

We see how to get permutation of simple javascript types.

```javascript
var p = require( 'permutation-way' );

var input = [ 1, 2, 3 ];

p.permutationOf( input ).on( 'data', function ( data ) {
  // display one permutation
  console.log( data );
} ).on( 'end', function () {
  // end of permutation
  console.log( 'end' );
} ).on( 'error', function ( err ) {
  // Error object.
  // Error types: invalid input or all permutation not found (which should never happen)
} );
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

## Events

* 'data' event is emmitted for each permutation array found
* 'end' event is emmitted once all permutation were found without error
* 'error' event is emmitted if an error is met like invalid input or not all permutation found


## Permutation of objects

You need to pass a <em>comparator</em> function to to the second argument of the fuunction
<code>permutationOf</code>


```javascript

var p = require( 'permutation-way' );

var input = [ {code:1}, {code:2}, {code:3} ];
/**
 * compare two objects and tells about the order of one object relative to the second object.
 */
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

p.permutationOf( input, comparator ).on( 'data', function ( data ) {
  // display one permutation
  console.log( data );
} ).on( 'end', function () {
  // end of permutation
  console.log( 'end' );
} ).on( 'error', function ( err ) {
  // Error object.
  // Error types: invalid input or all permutation not found (which should never happen)
} );
```


## Much more permutations.

If you want to play with a high volume of permutation, you can start with an array of 10 elements.


## Limit the number of permutation to receive

You have to set the <code>options.max</code> to a positive number. If the value of <code>options.max</code>
is not a number of is a negative number, then an 'error' event is emitted. If this value is set to 0, then, no
'data' event is emitted.

if you set <code>options.max</code> the permutation found will be compared with the <code>options.max</code> value set.
An error will be emitted if both value are not the same.

```javascript

var p = require( 'permutation-way' );

var input = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var options = {
  max: 6
};

p.permutationOf( input, options ).on( 'data', function ( data ) {
  // display one permutation
  console.log( data );
} ).on( 'end', function () {
  // end of permutation
  console.log( 'end' );
} ).on( 'error', function ( err ) {
  // Error object.
  // Error types: invalid input or all permutation not found (which should never happen)
} );
```

## Interrupt the permutation count

Let's say you have a big array and you do not want to handle all its permutation.
You can either set the <code>options.max</code> value or you can interrupt the
permutation search based on an external condition


```javascript

var p = require( 'permutation-way' );

var input = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
var actualCount = 0;

function checkError ( data ) {
  var hasError = false;
  // do something and set hasError...
  return hasError;
}

var pengine = p.permutationOf( input ).on( 'data', function ( data ) {
  // display one permutation
  actualCount++;
  console.log( data );
  if ( actualCount >= 4 ) {
    pengine.interrupt();
  }  else if ( checkError( data ) ) {
    pengine.interrupt( new Error( 'Error found' ) );
  }

} ).on( 'end', function () {
  // end of permutation
  console.log( 'end' );
} ).on( 'error', function ( err ) {
  // Error object.
  // Error types: invalid input or all permutation not found (which should never happen)
} );
```
