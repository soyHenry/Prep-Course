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
  let bin = "";
  let resultado = "";
  let residuo;
  let sResiduo = "";
  
  while(num > 0){
    residuo = num % 2;
    if(num % 2 === 1) num -= 1;
    sResiduo = residuo.toString();
    bin += sResiduo;
    num /= 2;
  }

  for(let i = bin.length -1; i > -1; i--){
    resultado += bin.charAt(i);
  }

  return resultado;
}

module.exports = {
  BinarioADecimal,
  DecimalABinario,
};