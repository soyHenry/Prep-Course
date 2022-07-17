// No cambies los nombres de las funciones.

function deObjetoAmatriz(objeto){
  // Escribe una función que convierta un objeto en una matriz, donde cada elemento representa 
  // un par clave-valor en forma de matriz.
  //Ejemplo: 
  /*objeto({
      D: 1,
      B: 2,
      C: 3
    }) ➞ [["D", 1], ["B", 2], ["C", 3]]*/
  //Escribe tu código aquí
objeto ({
  D :1,
  B :2,
  C :3 
})
let arreglo1 = objeto.entradas(objeto);
console.log("clave y valores",arreglo1);
}
function numberOfCharacters(string) {
  //La función recibe un string. Recorre el srting y devuelve el caracter con el número de veces que aparece 
  //en formato par clave-valor.
  //Ej: Recibe ---> "adsjfdsfsfjsdjfhacabcsbajda" || Devuelve ---> { a: 5, b: 2, c: 2, d: 4, f: 4, h:1, j: 4, s: 5 } 
  //Escribe tu código aquí 
}


function capToFront(s) {
  //Realiza una función que reciba como parámetro un string y mueva todas las letras mayúsculas
  //al principio de la palabra.
  //Ejemplo: soyHENRY -> HENRYsoy
  //Escribe tu código aquí

  var mayuscula = '';    var minuscula = '';
  for (i = 0; i<s.length; i++){
  if(s === s.toUpperCase()){
    mayuscula = mayuscula + s.toUpperCase;
    return (mayuscula.push());
  }
  else if(s === s.toLowerCase())
    minuscula = minuscula + s.toLowerCase;
    return (minuscula.push());   }   return (mayuscula + minuscula) 
}


function asAmirror(str) {
  //La función recibe una frase. 
  //Escribe una función que tome la frase recibida y la devuelva de modo tal que se pueda leer de izquierda a derecha 
  //pero con cada una de sus palabras invertidas, como si fuera un espejo.
  //Ej: Recibe ---> "The Henry Challenge is close!" || Devuelve ---> "ehT yrneH egnellahC si !esolc"
  //Escribe tu código aquí
  let reverse = "";
  for (i = 0; i < str.length; i++) {
    reverse = str[i] + reverse;
  }
  return reverse;
} 


function capicua(numero){
  //Escribe una función, la cual recibe un número y determina si es o no capicúa.

  //La misma debe retornar: "Es capicua" si el número se número que se lee igual de 
  //izquierda a derecha que de derecha a izquierda. Caso contrario retorna "No es capicua"
  //Escribe tu código aquí
let capicua = "";
for (i = 0; i < numero.length; i++) {
  capicua = numero[i] + capicua;
}
if (capicua === numero) {
  return "Es capicua";
}
else {
  return "No es capicua";
}
}
function deleteAbc(cadena){
  //Define una función que elimine las letras "a", "b" y "c" de la cadena dada 
  //y devuelva la versión modificada o la misma cadena, en caso de contener dichas letras.
  //Escribe tu código aquí
 return cadena.replace('a,b,c' );
 console.log(deleteAbc("abc"));

}


function sortArray(arr) {
  //La función recibe una matriz de strings. Ordena la matriz en orden creciente de longitudes de cadena
  //Ej: Recibe ---> ["You", "are", "beautiful", "looking"] || Devuelve ---> [“You", "are", "looking", "beautiful"]
  //Escribe tu código aquí

let arreglo1 = arr.ordenar((pi => pi.length - p2.length));
return arreglo1;
}
console.log(sortArray(["You", "are", "beautiful", "looking"]));

function buscoInterseccion(arreglo1, arreglo2){
  //Existen dos arrays, cada uno con 5 números. A partir de ello, escribir una función que permita
  //retornar un nuevo array con la intersección de ambos elementos. (Ej: [4,2,3] unión [1,3,4] = [3,4].
  //Si no tienen elementos en común, retornar un arreglo vacío.
  //Aclaración: los arreglos no necesariamente tienen la misma longitud
  //Escribe tu código aquí 
if (Array.isArray(arreglo1))
  if (Array.isArray(arreglo2))
    if (arreglo1.length > 0)
      if (arreglo2.length > 0)
        if (arreglo1.length === arreglo2.length)
          return arreglo1.filter(function(x) { return arreglo2.indexOf(x) !== -1; });
        else
          return [4,2,3];
      else
        return arreglo1;
    else
      return arreglo2;
  else
    return [1, 3, 4];
else
  return [3,4];

}



// No modificar nada debajo de esta línea
// --------------------------------

module.exports = {
   deObjetoAmatriz,
   numberOfCharacters,
   capToFront,
   asAmirror,
   capicua,
   deleteAbc,
   sortArray,
   buscoInterseccion,
};

