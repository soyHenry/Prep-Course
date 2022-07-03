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
  MasterArray = []
  for (const key in objeto) {
    MasterArray.push([key,objeto[key]])
  }
  return MasterArray
}


function numberOfCharacters(string) {
  //La función recibe un string. Recorre el srting y devuelve el caracter con el número de veces que aparece 
  //en formato par clave-valor.
  //Ej: Recibe ---> "adsjfdsfsfjsdjfhacabcsbajda" || Devuelve ---> { a: 5, b: 2, c: 2, d: 4, f: 4, h:1, j: 4, s: 5 } 
  //Escribe tu código aquí:
  CharactersObj= {}
  for(let i = 0; i<string.length; i++){
    if(CharactersObj[string[i]]==undefined){//verifica que el caracter indefinido en el objeto
      for(let e = 0; e<string.length; e++){//recorre todo el string para conmparar si las letra son iguales
        if (string[i]===string[e]&&CharactersObj[string[i]]!==undefined){//si el caracter esta denifido lo aumenta en uno
          CharactersObj[string[i]]++
        }else if(string[i]===string[e]){//si no esta definido crea la clave-valor en el objeto
          CharactersObj[string[i]]= 1;
        };
      };
    }
  };
  return(CharactersObj) //retorna el objeto
};


function capToFront(s) {
  //Realiza una función que reciba como parámetro un string y mueva todas las letras mayúsculas
  //al principio de la palabra.
  //Ejemplo: soyHENRY -> HENRYsoy
  //Escribe tu código aquí
  newstring= "";
  for (let i = 0; i<s.length; i++){//añade todas las mayusculas al nuevo string
    if (s[i] ===s[i].toUpperCase()){
      newstring = newstring + s[i]
    };
  };
  for (let i = 0; i<s.length; i++){//añade todas las minusculas al nuevo string
    if (s[i] ===s[i].toLowerCase()){
      newstring = newstring + s[i]
    };
  };
  return newstring
};


function asAmirror(str) {
  //La función recibe una frase. 
  //Escribe una función que tome la frase recibida y la devuelva de modo tal que se pueda leer de izquierda a derecha 
  //pero con cada una de sus palabras invertidas, como si fuera un espejo.
  //Ej: Recibe ---> "The Henry Challenge is close!" || Devuelve ---> "ehT yrneH egnellahC si !esolc"
  //Escribe tu código aquí
  str_words = str.split(" ");
  reverse_word= ""
  for (let i = 0; i < str_words.length; i++) {    //Pone reversa individualmente cada palabra
    reverse_word = ""                             //en un arreglo
    for (let e =  str_words[i].length; e >= 0; e--) {
      reverse_word += str_words[i].charAt(e)
    }
    str_words[i]= reverse_word
  }
  str= ''
  for (let i = 0; i < str_words.length; i++) {    //Convierte el arreglo en un string
    if (i===0){                                   //separado por espacios
      str+= str_words[i]
    }else{
      str+=' '+ str_words[i]
    }
  }
  return str
} 


function capicua(numero){
  //Escribe una función, la cual recibe un número y determina si es o no capicúa.
  //La misma debe retornar: "Es capicua" si el número se número que se lee igual de 
  //izquierda a derecha que de derecha a izquierda. Caso contrario retorna "No es capicua"
  //Escribe tu código aquí
  numero= numero + "";
  reverse_numero= "";
  for (let i = numero.length-1; i>=0; i--){
    reverse_numero+= numero[i];
  };
  if (numero===reverse_numero){
    return "Es capicua";
  }else{
    return "No es capicua";
  };
};


function deleteAbc(cadena){
  //Define una función que elimine las letras "a", "b" y "c" de la cadena dada 
  //y devuelva la versión modificada o la misma cadena, en caso de contener dichas letras.
  //Escribe tu código aquí
  array_cadena = []
  for (let i = 0; i < cadena.length; i++) {
    if (cadena[i]!=="a"&&cadena[i]!=="b"&&cadena[i]!=="c"){ //añade los caracteres que no 
      array_cadena.push(cadena[i])                          //sean a, b ó c a un arreglo
    }
  }
  cadena= ""
  for (let i = 0; i < array_cadena.length; i++) {//convierte el arreglo a String
    cadena+= array_cadena[i]                     //y lo pasa a la cadena
  }
  return cadena
}


function sortArray(arr) {
  //La función recibe una matriz de strings. Ordena la matriz en orden creciente de longitudes de cadena
  //Ej: Recibe ---> ["You", "are", "beautiful", "looking"] || Devuelve ---> [“You", "are", "looking", "beautiful"]
  //Escribe tu código aquí
    for(let i= 0; i<arr.length-1;i++){
      if(arr[i].length>arr[i+1].length){  //compara si la longitud de la cadena en
        let cambio = arr[i]               //la posicion i es mayor a la siguiente cadena
        arr[i]= arr[i+1]  
        arr[i+1]= cambio  //cambia el orden de las cadenas
        i=0 //resetea el bucle
      }
    } //si nunguna cadena es mayor a la siguiente termina y retorna el arreglo ordenado
  return arr
}


function buscoInterseccion(arreglo1, arreglo2){
  //Existen dos arrays, cada uno con 5 números. A partir de ello, escribir una función que permita 
  //retornar un nuevo array con la intersección de ambos elementos. (Ej: [4,2,3] unión [1,3,4] = [3,4].
  //Si no tienen elementos en común, retornar un arreglo vacío.
  //Aclaración: los arreglos no necesariamente tienen la misma longitud
  //Escribe tu código aquí  
  interseccion= []
  for(let i = 0; i<arreglo1.length; i++){
    for (let e = 0; e < arreglo2.length; e++) {
      if(arreglo1[i]===arreglo2[e]){
        interseccion.push(arreglo1[i])
      }
    }
  }
  return interseccion
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

