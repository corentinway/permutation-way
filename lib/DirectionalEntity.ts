/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

// see http://programminggeeks.com/java-code-for-permutation-using-steinhaus%E2%80%93johnson%E2%80%93trotter-algorithm/


interface ToString {
    toString: () => string;
}

/**
 * constructor for the direction entity
 * @param code {any} data to permute
 * @param dir direction of the entity (default -1)
 */
export class DirectionalEntity<T extends ToString> {
    code : T;
    dir: number;

    constructor(code : T, dir?: number) {
        this.code = code;
        this.dir = dir || -1;
    }

    /**
     * reverse the direction of the entity
     */
    reverseDir() {
        this.dir = this.dir * (-1);
    }
    toString() : string {
        return this.code.toString() + ' [' + this.dir + ']';
    }

    static indexOfDirectionalEntity<T>( list : DirectionalEntity<T>[], entity : DirectionalEntity<T>, comparator : (a: T, b: T) => 0 | 1 | -1 ) : number {
        for (var i = 0; i < list.length; i++ ) {
            if ( comparator(entity.code, list[i].code) === 0 ) {
                return i;
            }
        }
        return -1;
    }
}
