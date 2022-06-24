/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';
import { DirectionalEntity } from './DirectionalEntity';



/**
 * swap an element in the array to the right
 * @param list {Array}
 * @param index index of the element to swap where index + 1 < list.length
 */
export function right<T>( list : DirectionalEntity<T>[], index : number ) {
    var tmp = list[ index ];
    list[index ] = list[ index + 1 ];
    list[index + 1 ] = tmp;
}
/**
 * swap an element in the array to the left
 * @param list {Array}
 * @param index index of the element to swap where index + 1 > 0
 */
export function left<T>( list : DirectionalEntity<T>[], index : number ) {
    if (index < 0 || index >= list.length) {
        throw new Error("You cannot swap with an index of of the array bound");
    }
    var tmp = list[ index ];
    list[index ] = list[ index - 1 ];
    list[index - 1 ] = tmp;
}