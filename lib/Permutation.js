/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';


var EventEmitter = require( 'events' ).EventEmitter;
var util = require( 'util' );

var DirectionalEntity = require( './DirectionalEntity' );
var swap = require( './swap' );

function Permutation( data, comparator ) {
	
	comparator = comparator || function compare ( a, b ) {
		if ( a.code > b.code ) {
			return 1;
		} else if ( a.code < b.code ) {
			return -1;
		} else {
			return 0;
		}
	};
	
	var that = this;
    
    var entities = [];
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
	
    
    var indexOfDirectionalEntity = function ( list, entity ) {
		var i;
        for ( i = 0; i < list.length; i++ ) {
            if ( entity.code === list[i].code ) {
                return i;
            }
        }
        return -1;
    };
    var getMaxMobileDirectionalEntity = function () {
		var i;
        for ( i = 0; i < sortedList.length; i++ ) {
            var max = sortedList[i];
            // now check for the position of the maxDirNum in original list
            // to see if the maxDirNum is actually a mobile directional number
            var positionInOriginalList = indexOfDirectionalEntity( entities, max );
			
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
                return max;
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
        that.emit( 'data', data );
		
        while ( true ) {
            var mobileDirectionalEntity = getMaxMobileDirectionalEntity();
            
            if ( mobileDirectionalEntity === null ) {
                break;
            }
			
            var positionInOriginalList = indexOfDirectionalEntity( entities, mobileDirectionalEntity );
            if ( mobileDirectionalEntity.dir === 1 ) {
                // swap to the right
                swap.right( entities, positionInOriginalList );
            } else {
                // swap to the left
                swap.left( entities, positionInOriginalList );
            }
            
            // NOW we have another unique permutations
            that.emit( 'data', extractDataFromEntities( entities ) );
            
            
            // Now reverse the direction of all the numbers greater than mobileDirectionalNumber
			var i;
            for ( i = 0; i < entities.length; i++ ) {
                if ( mobileDirectionalEntity.code < entities[i].code ) {
                    entities[i].reverseDir( );
                }
            }
            
            
        }
        
        that.emit( 'end' );
    };
	
	process.nextTick( get );
}

util.inherits( Permutation, EventEmitter );

module.exports = Permutation;



