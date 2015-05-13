/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

var EventEmitter = require( 'events' ).EventEmitter;
var util = require( 'util' );

var DirectionalEntity = require( './DirectionalEntity' );
var swap = require( './swap' );

/**
 * a default comparator for 2 elements
 */
var defaultComparator = function ( a, b ) {
  if ( a > b ) {
    return 1;
  } else if ( a < b ) {
    return -1;
  } else {
    return 0;
  }
};

/**
 * extract data from direction entities to return one permutation array
 */
function extractDataFromEntities( entities ) {
  return entities.map( function ( entity ) {
    return entity.code;
  } );
}

/**
 * check the expected amount of permutation and emit 'end' event if the amount is reached,
 * otherwose emit 'error' signal with the Error object.
 * @param actual {Number} number of permutation found
 * @param expected {Number} number of permutation expected
 * @param emitter {EventEmitter}
 */
function checkExpected( actual, expected, emitter ) {
  if ( actual === expected ) {
    emitter.emit( 'end' );
  } else {
    var err = new Error( 'The expected amount of permutation was not reached. Expected: ' + expected );
    emitter.emit( 'error', err );
  }
}

function emitSmallPermutation( data, expectedPermutations, emitter ) {

  if ( !data ) {
    process.nextTick( function () {
      emitter.emit( 'error', new Error( 'The input array is undefined or null' ) );
    } );
    return true;
  }

  if ( !Array.isArray( data ) ) {
    process.nextTick( function () {
      emitter.emit( 'error', new Error( 'The input data is not an Array' ) );
    } );
    return true;
  }


  /*
   *   -- SHORTCHUT --
   * if the data array is empty or has 1 element,
   * there is only one permutation: itself
   */
  if ( data.length <= 1 ) {
    process.nextTick( function () {
      emitter.emit( 'data', data );
      checkExpected( 1, expectedPermutations, emitter );
    } );
    return true;
  }
  /*
   *   -- SHORTCHUT --
   * if the data array is empty or has 2 element,
   * there is only one permutation: itself and its reverse
   */
  if ( data.length === 2 ) {
    process.nextTick( function () {
      emitter.emit( 'data', data );
      emitter.emit( 'data', data.reverse() );
      checkExpected( 2, expectedPermutations, emitter );
    } );
    return true;
  }
}

/**
 * @param data {Array} an array from which to have all its permutation
 * @param comparator {Function} optional function that compare 2 elements
 * of the array in order to sort them. The function should return
 * - a positive number integer if the first parameter of the function is greater than the
 * second parameter of the function.
 * - a negative number integer if the first parameter of the function is lower than the
 * second parameter of the function.
 - or 0 if both value are equals
 */
function Permutation( data, comparator, opt ) {

  // comparator not defined
  // options is the 2nd argument
  if ( !opt && typeof comparator === 'object' ) {
    opt = comparator;
    comparator = undefined;
  }

  var options = opt || {};

  var emitter = this;
  var expectedPermutations;
  if ( options.max !== undefined && options.max !== null ) {
    expectedPermutations = options.max;
  } else {
    expectedPermutations = factorial( data.length );
  }

  if ( emitSmallPermutation( data, expectedPermutations, emitter ) ) {
    return;
  }

  // data comparator
  comparator = comparator || defaultComparator;
  // sort array ascending
  data.sort( comparator );
  // the function that compare DictionnalEntities
  var entitiesComparator = function ( a, b ) {
    return comparator( a.code, b.code );
  };
  // directional entities array
  var entities = [];
  // sorted array ( reverse )
  var sortedList = [];

  entities = data.map( function ( item ) {
    return new DirectionalEntity( item );
  } );

  var cloneArray = function ( array ) {
    return array.map( function ( i ) {
      return i;
    } );
  };

  // data array is sorted : hence we don't need to sort it again
  //sortedList = cloneArray( entities ).sort( comparator );
  sortedList = cloneArray( entities );

  sortedList.reverse();


  var getMaxMobileDirectionalEntity = function () {
    var i;
    for ( i = 0; i < sortedList.length; i++ ) {
      var max = sortedList[ i ];
      // now check for the position of the maxDirNum in original list
      // to see if the maxDirNum is actually a mobile directional number
      var positionInOriginalList = DirectionalEntity.indexOfDirectionalEntity( entities, max );

      if ( max.dir === -1 &&
        (
          positionInOriginalList !== 0 && entities[ positionInOriginalList - 1 ].code < max.code
        ) ||
        (
          max.dir === 1 && positionInOriginalList != entities.length - 1 && entities[ positionInOriginalList + 1 ].code < max.code
        )

      ) {
        return {
          mobile: max,
          position: positionInOriginalList
        };
      } else {
        //				console.log( 'max mobile not found ' );
      }
    }

    return null;
  };

  var actualPermutationFound = 0;
  var emitPermutation = function ( data ) {
    actualPermutationFound++;
    emitter.emit( 'data', data );
  };

	var interrupted = false;

	/**
	 * interrupt the computation of the permutation
	 * @param err {any} is set, it is emited as an error
	 */
	this.interrupt = function ( err ) {
		interrupted = true;
		emitter.emit( 'error', err );
	};

  var get = function () {
    var err;
    if ( options.max !== undefined && options.max !== null ) {
      if ( typeof options.max !== 'number' ) {
        err = new Error( 'The "options.max" value must be a number' );
        emitter.emit( 'error', err );
        return;
      } else if ( options.max < 0 ) {
        err = new Error( 'The "options.max" value must be a positive number' );
        emitter.emit( 'error', err );
        return;
      } else if ( options.max === 0 ) {
        emitter.emit( 'end' );
        return;
      }
    }


    // 1st permutation: original data
    emitPermutation( data );

    if ( actualPermutationFound >= expectedPermutations ) {
      return;
    }

    while ( true ) {
      //var mobileDirectionalEntity = getMaxMobileDirectionalEntity();
      var mobileEntity = getMaxMobileDirectionalEntity();

      if ( mobileEntity === null ) {
        //            if ( mobileDirectionalEntity === null ) {
        break;
      }

      var mobileDirectionalEntity = mobileEntity.mobile;

      //            var positionInOriginalList = indexOfDirectionalEntity( entities, mobileDirectionalEntity );
      var positionInOriginalList = mobileEntity.position;
      if ( mobileDirectionalEntity.dir === 1 ) {
        // swap to the right
        swap.right( entities, positionInOriginalList );
      } else {
        // swap to the left
        swap.left( entities, positionInOriginalList );
      }

      // NOW we have another unique permutations
      emitPermutation( extractDataFromEntities( entities ) );

      if ( actualPermutationFound >= expectedPermutations || interrupted ) {
        break;
      }



      // Now reverse the direction of all the numbers greater than mobileDirectionalNumber
      var i;
      for ( i = 0; i < entities.length; i++ ) {
        if ( mobileDirectionalEntity.code < entities[ i ].code ) {
          entities[ i ].reverseDir();
        }
      }


    }

		if ( !interrupted ) {
    	checkExpected( actualPermutationFound, expectedPermutations, emitter );
		}
  };

  process.nextTick( get );
}

util.inherits( Permutation, EventEmitter );

module.exports = Permutation;



function sameArray( array1, array2, comparator ) {
  if ( array1.length === array2.length ) {
    for ( var i = 0; i < array1.length; i++ ) {
      if ( comparator( array1[ i ], array2[ i ] ) !== 0 ) {
        return false;
      }
    }
    return true;
  }

  return false;
}


/**
 * return the factorial of n: n!
 * The number of permutation of an array of length N to find must be equal to N!
 * @param n {number} the number to compute its factorial
 */
function factorial( n ) {
  if ( n <= 0 ) {
    return 1;
  } else {
    return n * factorial( n - 1 );
  }
}
