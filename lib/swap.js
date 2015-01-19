/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';


/**
 * swap an element in the array to the right
 * @param list {Array}
 * @param index index of the element to swap where index + 1 < list.length
 */
exports.right = function ( list, index ) {
    var tmp = list[ index ];
    list[index ] = list[ index + 1 ];
    list[index + 1 ] = tmp;
};
/**
 * swap an element in the array to the left
 * @param list {Array}
 * @param index index of the element to swap where index + 1 > 0
 */
exports.left = function ( list, index ) {
    var tmp = list[ index ];
    list[index ] = list[ index - 1 ];
    list[index - 1 ] = tmp;
};