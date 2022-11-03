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
  return Object.entries(objeto)
}


function numberOfCharacters(string) {
  //La función recibe un string. Recorre el srting y devuelve el caracter con el número de veces que aparece 
  //en formato par clave-valor.
  //Ej: Recibe ---> "adsjfdsfsfjsdjfhacabcsbajda" || Devuelve ---> { a: 5, b: 2, c: 2, d: 4, f: 4, h:1, j: 4, s: 5 } 
  //Escribe tu código aquí
  let a=string.split('')
  let arre ={}
  a.filter (x=> {   arre[x] = (arre[x]|| 0)+1})
 return arre
}


function capToFront(s) {
  //Realiza una función que reciba como parámetro un string y mueva todas las letras mayúsculas
  //al principio de la palabra.
  //Ejemplo: soyHENRY -> HENRYsoy
  //Escribe tu código aquí
  let variabl = s.split('')
  let vare = []
  //let vari = variable.split() 
  //console.log(variabl)
  for(let i in variabl){
  if(variabl[i] == variabl[i].toUpperCase())
  {vare.push(variabl[i])} 
  }
  for(let i in variabl){
    if(variabl[i] !== variabl[i].toUpperCase())
    {vare.push(variabl[i])} 
  }
    return vare.join('')
}


function asAmirror(str) {
  //La función recibe una frase. 
  //Escribe una función que tome la frase recibida y la devuelva de modo tal que se pueda leer de izquierda a derecha 
  //pero con cada una de sus palabras invertidas, como si fuera un espejo.
  //Ej: Recibe ---> "The Henry Challenge is close!" || Devuelve ---> "ehT yrneH egnellahC si !esolc"
  //Escribe tu código aquí
let arre =str.split(' ')
//console.log(arre)
//arre.reverse()

let    arr =arre[0].split('').reverse().join('')
let arre2 = arre[1].split('').reverse().join('')
let arre3 = arre[2].split('').reverse().join('')
let arre4 = arre[3].split('').reverse().join('')
let arre5 = arre[4].split('').reverse().join('')
return arr+' '+arre2+' '+arre3+' '+arre4+' '+arre5
} 


function capicua(numero){
  //Escribe una función, la cual recibe un número y determina si es o no capicúa.
  //La misma debe retornar: "Es capicua" si el número se número que se lee igual de 
  //izquierda a derecha que de derecha a izquierda. Caso contrario retorna "No es capicua"
  //Escribe tu código aquí
  
 
let aa = String(numero).split('').map((x=>{ return Number(x) })).reverse().join('')
//console.log(numero+' '+aa)
if(numero == aa) return "Es capicua"; else return 'No es capicua'
}


function deleteAbc(cadena){
  //Define una función que elimine las letras "a", "b" y "c" de la cadena dada 
  //y devuelva la versión modificada o la misma cadena, en caso de contener dichas letras.
  //Escribe tu código aquí

 let neww = cadena.split('').filter(x=> x!='a' &&  x !='b'&& x !='c' ).join('')
 return neww
}


function sortArray(arr) {
  //La función recibe una matriz de strings. Ordena la matriz en orden creciente de longitudes de cadena
  //Ej: Recibe ---> ["You", "are", "beautiful", "looking"] || Devuelve ---> [“You", "are", "looking", "beautiful"]
  //Escribe tu código aquí
  //https://uniwebsidad.com/libros/javascript/capitulo-4/sentencias-break-y-continue
return arr.sort((a,b)=>{return a.length - b.length })

}


function buscoInterseccion(arreglo1, arreglo2){
  //Existen dos arrays, cada uno con 5 números. A partir de ello, escribir una función que permita 
  //retornar un nuevo array con la intersección de ambos elementos. (Ej: [4,2,3] unión [1,3,4] = [3,4].
  //Si no tienen elementos en común, retornar un arreglo vacío.
  //Aclaración: los arreglos no necesariamente tienen la misma longitud
  const numeros  = [...arreglo1,...arreglo2];
  let duplicados = [];
   
  const tempArray = [...numeros].sort();
   
  for (let i = 0; i < tempArray.length; i++) {
    if (tempArray[i + 1] === tempArray[i]) {
      duplicados.push(tempArray[i]);
    }
  }
   
  return duplicados


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

