/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

// see http://programminggeeks.com/java-code-for-permutation-using-steinhaus%E2%80%93johnson%E2%80%93trotter-algorithm/


/**
 * constructor for the direction entity
 * @param code {any} data to permute
 * @param dir direction of the entity (default -1)
 */
export class DirectionalEntity {
    code : number;
    dir: number;

    constructor(code : number, dir?: number) {
        this.code = code;
        this.dir = dir || -1;
    }

    /**
     * reverse the direction of the entity
     */
    reverseDir() {
        this.dir = this.dir * (-1);
    }
    toString() {
        return this.code.toString() + ' [' + this.dir + ']';
    }

    static indexOfDirectionalEntity( list : [DirectionalEntity], entity : DirectionalEntity ) {
		var i;
        for ( i = 0; i < list.length; i++ ) {
            if ( entity.code === list[i].code ) {
                return i;
            }
        }
        return -1;
    }
}
