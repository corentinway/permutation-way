/*jslint node: true, white: true, vars:true, plusplus: true */

'use strict';

import {factorial, defaultComparator} from './utils';
import {EventEmitter} from 'events';
import util from 'util';
import { DirectionalEntity } from './DirectionalEntity';

import {left, right} from './swap';
 

/**
 * extract data from direction entities to return one permutation array
 */
function extractDataFromEntities(entities : DirectionalEntity[]) {
	return entities.map(function (entity) {
		return entity.code;
	});
}

/**
 * check the expected amount of permutation and emit 'end' event if the amount is reached,
 * otherwose emit 'error' signal with the Error object.
 * @param actual {Number} number of permutation found
 * @param expected {Number} number of permutation expected
 * @param emitter {EventEmitter}
 */
function checkExpected(actual : number, expectedTester : ExpectedPermutationTester, emitter : EventEmitter) {
	if ( expectedTester( actual ) ) {
		emitter.emit('end');
	} else {
		// FIXME var err = new Error('The expected amount of permutation was not reached. Expected: ' + expected);
		var err = new Error('The expected amount of permutation was not reached. Expected: FIXME ');
		emitter.emit('error', err);
	}
}

function emitSmallPermutation(data : any[], expectedPermutationTester : ExpectedPermutationTester, emitter : EventEmitter) {

	if (!data) {
		process.nextTick(function () {
			emitter.emit('error', new Error('The input array is undefined or null'));
		});
		return true;
	}

	if (!Array.isArray(data)) {
		process.nextTick(function () {
			emitter.emit('error', new Error('The input data is not an Array'));
		});
		return true;
	}


	/*
	 *   -- SHORTCHUT --
	 * if the data array is empty or has 1 element,
	 * there is only one permutation: itself
	 */
	if (data.length <= 1) {
		process.nextTick(function () {
			emitter.emit('data', data);
			checkExpected(1, expectedPermutationTester, emitter);
		});
		return true;
	}
	/*
	 *   -- SHORTCHUT --
	 * if the data array is empty or has 2 element,
	 * there is only one permutation: itself and its reverse
	 */
	if (data.length === 2) {
		process.nextTick(function () {
			emitter.emit('data', data);
			emitter.emit('data', data.reverse());
			checkExpected(2, expectedPermutationTester, emitter);
		});
		return true;
	}
}


type Option = {
	max?: number
};

type MobileDirectionalEntity = {
	mobile: DirectionalEntity,
	position: number
};

type ExpectedPermutationTester = (actual : number) => boolean;
type MaxPermutationReachedTester = (actual : number) => boolean;

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
export class Permutation extends EventEmitter {

	initialData : [];
	actualPermutationFound : number = 0;
	interrupted : boolean = false;
	options : Option = {};
	expectedPermutationTester : ExpectedPermutationTester;
	isMaxPermutationReached : MaxPermutationReachedTester;
	getMaxMobileDirectionalEntity : () => MobileDirectionalEntity | null;
	entities : DirectionalEntity[];

	constructor(data : [], comparator? : ((a: any, b: any) => number) | undefined , opt? : Option) {
		super();
		this.initialData = data;
		var comparator = comparator;
		// comparator not defined
		// options is the 2nd argument
		if (!opt && typeof comparator === 'object') {
			opt = comparator;
			comparator = undefined;
		}

		this.options = opt || {};
		var options = this.options;

		var emitter = this;
		
		if (options !== undefined && options.max !== undefined && options.max !== null) {
			const MAX : number = options.max;
			this.expectedPermutationTester = function ( actual : number ) {
				return actual <= MAX;
			};
			this.isMaxPermutationReached =  function ( actual :number ) {
				return actual >= MAX;
			};
		} else {
			var expected = factorial(data.length);
			this.expectedPermutationTester = function ( actual :number ) {
				return expected === actual;
			};
			this.isMaxPermutationReached =  function ( actual : number) {
				return actual >= expected;
			};
		}

		if (emitSmallPermutation(data, this.expectedPermutationTester, emitter)) {
			return;
		}

		// data comparator
		var finalComparator : (a:any, b:any) => number;
		if (comparator === undefined ) {
			finalComparator = defaultComparator;
		} else {
			finalComparator = comparator;
		}
		//comparator = comparator || defaultComparator;
		// sort array ascending
		data.sort(comparator);
		// the function that compare DictionnalEntities
		var entitiesComparator = function (a : DirectionalEntity, b : DirectionalEntity) {
			return finalComparator(a.code, b.code);
		};
		// directional entities array
		
		// sorted array ( reverse )
		var sortedList : DirectionalEntity[];

		this.entities = data.map(function (item) {
			return new DirectionalEntity(item);
		});

		var cloneArray = function (array : DirectionalEntity[]) {
			return array.map(function (i) {
				return i;
			});
		};

		// data array is sorted : hence we don't need to sort it again
		//sortedList = cloneArray( entities ).sort( comparator );
		sortedList = cloneArray(this.entities);

		sortedList.reverse();


		this.getMaxMobileDirectionalEntity = function () {
			var i;
			for (i = 0; i < sortedList.length; i++) {
				var max = sortedList[i];
				// now check for the position of the maxDirNum in original list
				// to see if the maxDirNum is actually a mobile directional number
				var positionInOriginalList = DirectionalEntity.indexOfDirectionalEntity(this.entities, max);

				if ( max.dir === -1 &&
					(
						positionInOriginalList !== 0 && this.entities[positionInOriginalList - 1].code < max.code
					) ||
					(
						max.dir === 1 && positionInOriginalList !== this.entities.length - 1 && this.entities[positionInOriginalList + 1].code < max.code
					)

				) {
					return {
						mobile: max,
						position: positionInOriginalList
					};
				}
			}

			return null;
		};

		this.actualPermutationFound = 0;
		

		this.interrupted = false;

		process.nextTick(this.getNextPermutation.bind(this));
	}

	emitPermutation (data : any) {
		this.actualPermutationFound++;
		this.emit('data', data);
	}


	/**
	 * interrupt the computation of the permutation
	 * @param err {any} is set, it is emited as an error
	 */
	 interrupt (err : any) {
		this.interrupted = true;
		if (err) {
			this.emit('error', err);
		} else {
			this.emit('end');
		}
	}
	

	getNextPermutation () {
		var err;
		if (this.options.max !== undefined && this.options.max !== null) {
			if (typeof this.options.max !== 'number') {
				err = new Error('The "options.max" value must be a number');
				this.emit('error', err);
				return;
			} else if (this.options.max < 0) {
				err = new Error('The "options.max" value must be a positive number');
				this.emit('error', err);
				return;
			} else if (this.options.max === 0) {
				this.emit('end');
				return;
			}
		}


		// 1st permutation: original data
		this.emitPermutation(this.initialData);

		if ( this.isMaxPermutationReached( this.actualPermutationFound ) ) {
			return;
		}

		while (true) {
			var mobileEntity = this.getMaxMobileDirectionalEntity();

			if (mobileEntity === null) {
				break;
			}

			var mobileDirectionalEntity = mobileEntity.mobile;

			var positionInOriginalList = mobileEntity.position;
			if (mobileDirectionalEntity.dir === 1) {
				// swap to the right
				right(this.entities, positionInOriginalList);
			} else {
				// swap to the left
				left(this.entities, positionInOriginalList);
			}

			if (this.interrupted) {
				break;
			}

			// NOW we have another unique permutations
			this.emitPermutation(extractDataFromEntities(this.entities));

			if ( this.isMaxPermutationReached( this.actualPermutationFound ) || this.interrupted) {
				break;
			}



			// Now reverse the direction of all the numbers greater than mobileDirectionalNumber
			var i;
			for (i = 0; i < this.entities.length; i++) {
				if (mobileDirectionalEntity.code < this.entities[i].code) {
					this.entities[i].reverseDir();
				}
			}


		}

		if (!this.interrupted) {
			checkExpected(this.actualPermutationFound, this.expectedPermutationTester, this);
		}
	}

	
}

 