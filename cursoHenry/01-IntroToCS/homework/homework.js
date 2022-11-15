"use strict";

function BinarioADecimal(num) {
  // tu codigo aca
  let decimal = 0;
  let indexInv = num.length - 1;
  for(let i = 0; i < num.length; i++){
    decimal += Math.pow(2,i) * parseInt(num.charAt(indexInv))
    indexInv--;
  }
  return decimal;
}


function DecimalABinario(num) {
  // tu codigo aca
}

module.exports = {
  BinarioADecimal,
  DecimalABinario,
};