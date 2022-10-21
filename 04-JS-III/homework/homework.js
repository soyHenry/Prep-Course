// No cambies los nombres de las funciones.
//https://www.freecodecamp.org/espanol/news/el-manual-de-arreglos-en-javascript/ 
//https://www.freecodecamp.org/espanol/news/foreach-en-javascript-como-recorrer-un-arreglo-en-js/
//https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

const { arrayReplaceAt } = require("markdown-it/lib/common/utils");



function devolverPrimerElemento(array) {
  // Devuelve el primer elemento de un  array (pasado por parametro)
  // Tu código:
 //let n = [10,10,16,12]; return (n[0])
 //console.log(n[0]); 
return array.at()
} //console.log(devolverPrimerElemento())
//console.log(`Element at index ${i} is ${salad[i]}`);

function devolverUltimoElemento(array) {
  // Devuelve el último elemento de un array
  // Tu código:

 // const arre = ['🙂', '😍', '🙄', '😟']
//  return (arre[arre.length -1]) 
return array.at(-1)
} //console.log(devolverUltimoElemento());


function obtenerLargoDelArray(array) {
  // Devuelve el largo de un array
  // Tu código:
 // const arre =["Hola"]
   //  console.log (arre.length)
  // arre.forEach(a => console.log(a.length))
  return array.length

} //console.log(obtenerLargoDelArray())


function incrementarPorUno(array) {
  // "array" debe ser una matriz de enteros (int/integers)
  // Aumenta cada entero por 1
  // y devuelve el array
  // Tu código:
 
 let arrayi = array.map( x=> x+1 )
 return arrayi
 }


function agregarItemAlFinalDelArray(array, elemento) {
  // Añade el "elemento" al final del array
  // y devuelve el array
  // Tu código:
 
  array.push(elemento)  
  //console.log( array = array[array.length - 1]) 
 // array[array.length] = elemento;
  return array
}


function agregarItemAlComienzoDelArray(array, elemento) {
  // Añade el "elemento" al comienzo del array
  // y devuelve el array
  // Pista: usa el método `.unshift`
  // Tu código:
 // array[0]= array.unshift(elemento)
  array.unshift(elemento)
  return array 
}


function dePalabrasAFrase(palabras) {
  // "palabras" es un array de strings/cadenas
  // Devuelve un string donde todas las palabras estén concatenadas
  // con espacios entre cada palabra
  // Ejemplo: ['Hello', 'world!'] -> 'Hello world!'
  // Tu código:
  let namestwo = palabras.reduce((a,b)=>  a+' '+b)
  return namestwo
}


function arrayContiene(array, elemento) {
  // Comprueba si el elemento existe dentro de "array"
  // Devuelve "true" si está, o "false" si no está
  // Tu código:
  if ( array.includes( elemento ) ) return true ;else return false 
}


function agregarNumeros(numeros) {
  // "numeros" debe ser un arreglo de enteros (int/integers)
  // Suma todos los enteros y devuelve el valor
  // Tu código:
  //let numeros = [1, 2, 3, 4, 5];
  //numeros.forEach(function(a){totall = totall + a;});
  //console.log(totall);*/
   //var suma = 0;
  //for(var i = 0; i < numeros.length; i++) {
    //suma = suma + numeros[i];
  //}
  let suma = numeros.reduce((a,b) => a+b)
  return suma  
}


function promedioResultadosTest(resultadosTest) {
  // "resultadosTest" debe ser una matriz de enteros (int/integers)
  // Itera (en un bucle) los elementos del array, calcula y devuelve el promedio de puntajes
// Tu código:

let sum = resultadosTest.reduce((valorb, valora) => valora + valorb);
let promedio = sum / resultadosTest.length;
  return promedio
}


function numeroMasGrande(numeros) {
  // "numeros" debe ser una matriz de enteros (int/integers)
  // Devuelve el número más grande
  // Tu código:
  return Math.max(...numeros)
  //return Math.max.apply(null, numeros);
}


function multiplicarArgumentos() {
  // Usa la palabra clave `arguments` para multiplicar todos los argumentos y devolver el producto
  // Si no se pasan argumentos devuelve 0. Si se pasa un argumento, simplemente devuélvelo
  // Escribe tu código aquí:
  if(arguments.length < 1) return 0;
  var total = 1;
  for(var i = 0; i < arguments.length; i++) {
    total = total * arguments[i];
  }
  return total;
}




function cuentoElementos(arreglo){
  //Realiza una función que retorne la cantidad de los elementos del arreglo cuyo valor es mayor a 18.
  //Escribe tu código aquí
  //let arreglo = [1,20,21,20,2,15]
  var result = arreglo.filter(arreglo => arreglo > 18);
  result = result.length
  return result

}


function diaDeLaSemana(numeroDeDia) {
  //Suponga que los días de la semana se codifican como 1 = Domingo, 2 = Lunes y así sucesivamente. 
  //Realiza una función que dado el número del día de la semana, retorne: Es fin de semana
  //si el día corresponde a Sábado o Domingo y “Es dia Laboral” en caso contrario. 
  //Escribe tu código aquí   
  if(numeroDeDia === 1 || numeroDeDia === 7 ){
    return "Es fin de semana"
  }
   return "Es dia Laboral"

  
} 


function empiezaConNueve(n) {
  //Desarrolle una función que recibe como parámetro un número entero n. Debe retornar true si el entero 
  //inicia con 9 y false en otro caso.
  //Escribe tu código aquí
//  const word = 'hello'
let num = n.toString()
if(num.charAt(0) === "9"){
return true
}
return false
}


function todosIguales(arreglo) {
  //Escriba la función todosIguales, que indique si todos los elementos de un arreglo son iguales:
  //retornar true, caso contrario retornar false.
  //Escribe tu código aquí  
  let igual = true;
  for (let i = 0; i < arreglo.length-1 ; i++) {
    if (arreglo[i] !== arreglo[i + 1]) {
      igual=false;
      break;
     
    }
  }
  return igual;
} 


function mesesDelAño(array) {
  //Dado un array que contiene algunos meses del año desordenados, recorrer el array buscando los meses de 
  // "Enero", "Marzo" y "Noviembre", guardarlo en nuevo array y retornarlo.
  //Si alguno de los meses no está, devolver: "No se encontraron los meses pedidos"
  // Tu código:
  //  let array= ['Enero','Febrero','Marzo','Noviembre']
  
    let mes = array.filter(a=>a === 'Enero')
    let mesa = array.filter(a=>a === 'Marzo')
    let mesb = array.filter(a=>a === 'Noviembre')
    let meses = mesa.concat(mesb,mes)
    if ( meses.includes( 'Enero' ) && meses.includes( 'Marzo' ) && meses.includes( 'Noviembre' ) )
     return meses ; else return "No se encontraron los meses pedidos"
   
}


function mayorACien(array) {
  //La función recibe un array con enteros entre 0 y 200. Recorrer el array y guardar en un nuevo array sólo los
  //valores mayores a 100 (no incluye el 100). Finalmente devolver el nuevo array.
  // Tu código:
let arre = array.filter(a=>a >100)
//arre = arre.length
return arre
}


function breakStatement(numero) {
  //Iterar en un bucle aumentando en 2 el numero recibido hasta un límite de 10 veces.
  //Guardar cada nuevo valor en un array. 
  //Devolver el array
  //Si en algún momento el valor de la suma 
  //y la cantidad de iteraciones coinciden, debe interrumpirse la ejecución y 
  //devolver:
  //Pista: usá el statement 'break'
  // Tu código: 
  var array = [];
  //var suma = numero;
  for (var i = 0; i < 10; i++) {
    numero = numero + 2;
    if (numero === i) break;
    else  array.push(numero);
   }

  if (i < 10) return "Se interrumpió la ejecución";
   else return array;
  }
  
function continueStatement(numero) {
  //Iterar en un bucle aumentando en 2 el numero recibido hasta un límite de 10 veces.
  //Guardar cada nuevo valor en un array.    
  //Devolver el array
  //Cuando el número de iteraciones alcance el valor 5, no se suma en ese caso y se continua con la siguiente iteración
  //Pista: usá el statement 'continue'
  // Tu código:
  // https://uniwebsidad.com/libros/javascript/capitulo-4/sentencias-break-y-continue

  var array = [];
   for(var i= 0; i<10; i++) {
    if(i === 5) continue;
    else {
      numero = numero + 2;
      array.push(numero);
    }
  }
  return array;
 }


// No modificar nada debajo de esta línea
// --------------------------------

module.exports = {
  devolverPrimerElemento,
  devolverUltimoElemento,
  obtenerLargoDelArray,
  incrementarPorUno,
  agregarItemAlFinalDelArray,
  agregarItemAlComienzoDelArray,
  dePalabrasAFrase,
  arrayContiene,
  agregarNumeros,
  promedioResultadosTest,
  numeroMasGrande,
  multiplicarArgumentos,
  cuentoElementos,
  diaDeLaSemana,
  empiezaConNueve,
  todosIguales,
  mesesDelAño,
  mayorACien,
  breakStatement,
  continueStatement
};
