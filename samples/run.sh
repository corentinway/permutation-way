#!/bin/bash

node objectPermutation.js  
node PermutationHugeTest.js  

tsc permutation_index.ts
node permutation_index.js  
rm permutation_index.js  