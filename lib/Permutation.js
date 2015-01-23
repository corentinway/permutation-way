/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';


var EventEmitter = require( 'events' ).EventEmitter;
var util = require( 'util' );

var DirectionalEntity = require( './DirectionalEntity' );
var swap = require( './swap' );

var defaultComparator =  function ( a, b ) {
	if ( a > b ) {
		return 1;
	} else if ( a < b ) {
		return -1;
	} else {
		return 0;
	}
};

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
function Permutation( data, comparator ) {
	
	var emitter = this;
	/*
	 *   -- SHORTCHUT --
	 * if the data array is empty or has 1 element, 
	 * there is only one permutation: itself
	 */
	if ( data.length <= 1 ) {
		process.nextTick( function () {
			emitter.emit( 'data', data );
			emitter.emit( 'end' );
		} );
		return;
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
			emitter.emit( 'end' );
		} );
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
	
	sortedList = cloneArray( entities ).sort( comparator );
	
    sortedList.reverse( );
    
    var getMaxMobileDirectionalEntity = function () {
		var i;
        for ( i = 0; i < sortedList.length; i++ ) {
            var max = sortedList[i];
//			console.log( 'MAX' );
//			console.log( max );
            // now check for the position of the maxDirNum in original list
            // to see if the maxDirNum is actually a mobile directional number
            var positionInOriginalList = DirectionalEntity.indexOfDirectionalEntity( entities, max );
			
//			console.log( 'position: ' + positionInOriginalList );
			
            if ( max.dir === -1 && 
                    (
                        positionInOriginalList !== 0 
                        && entities[ positionInOriginalList - 1].code < max.code 
                    )
                    ||
                    (
                        max.dir === 1
                        && positionInOriginalList != entities.length - 1
                        && entities[ positionInOriginalList + 1 ].code < max.code
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
	
	/**
	 * extract data from direction entities to return one permutation array
	 */
	function extractDataFromEntities( ) {
		return entities.map( function ( entity  ) {
			return entity.code;
		} );
	}
    
    var get = function () {
         // 1st permutation: original data
        emitter.emit( 'data', data );
		
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
            emitter.emit( 'data', extractDataFromEntities( entities ) );
            
            
            // Now reverse the direction of all the numbers greater than mobileDirectionalNumber
			var i;
            for ( i = 0; i < entities.length; i++ ) {
                if ( mobileDirectionalEntity.code < entities[i].code ) {
                    entities[i].reverseDir( );
                }
            }
            
            
        }
        
        emitter.emit( 'end' );
    };
	
	process.nextTick( get );
}

util.inherits( Permutation, EventEmitter );

module.exports = Permutation;



function sameArray( array1, array2, comparator ) {
	if ( array1.length === array2.length ) {
		for ( var i = 0; i < array1.length; i++ ) {
			if ( comparator( array1[ i ],  array2[ i ] ) !== 0 ) {
				return false;
			}
		}
		return true;
	}
	
	return false;
}