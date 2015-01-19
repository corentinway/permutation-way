/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

// see http://programminggeeks.com/java-code-for-permutation-using-steinhaus%E2%80%93johnson%E2%80%93trotter-algorithm/


/**
 * constructor for the direction entity
 * @param code {any} data to permute
 * @param dir direction of the entity (default -1)
 */
function DirectionalEntity( code, dir ) {
    this.code = code;
    this.dir = dir || -1;
}

/**
 * reverse the direction of the entity
 */
DirectionalEntity.prototype.reverseDir = function () {
    this.dir = this.dir * (-1);
};

DirectionalEntity.prototype.toString = function () {
	return this.code.toString() + ' [' + this.dir + ']';
};

module.exports = DirectionalEntity;