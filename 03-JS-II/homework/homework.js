// No cambies los nombres de las funciones.

function obtenerMayor(x, y) {
  // "x" e "y" son números enteros (int).
  // Devuelve el número más grande
  // Si son iguales, devuelve cualquiera de los dos
  // Tu código:

  var x;
  var y;
  if(x > y){
    return x;
  }
  if(y > x){
    return y
  }
  else{
    return y;
  }
}

function mayoriaDeEdad(edad) {
  //Determinar si la persona según su edad puede ingresar a un evento.
  //Si tiene 18 años ó más, devolver --> "Allowed"
  //Si es menor, devolver --> "Not allowed"

  var grande;

  if(edad >= 18){
    grande = "Allowed";
    return grande;
  } 
  else{
    grande = "Not allowed"
    return grande;
  }
}
  
function conection(status) {
  //Recibimos un estado de conexión de un usuario representado por un valor numérico. 
  //Cuando el estado es igual a 1, el usuario está "Online"
  //Cuando el estado es igual a 2, el usuario está "Away"
  //De lo contrario, presumimos que el usuario está "Offline"
  //Devolver el estado de conexión de usuario en cada uno de los casos.

  var usuario;

  if(status == 1){
    usuario = "Online";
    return usuario;
  }
  if(status == 2){
    usuario = "Away";
    return usuario;
}
  else{
    usuario = "Offline";
    return usuario;
}
}
function saludo(idioma) {
  // Devuelve un saludo en tres diferentes lenguajes:
  // Si "idioma" es "aleman", devuelve "Guten Tag!"
  // Si "idioma" es "mandarin", devuelve "Ni Hao!"
  // Si "idioma" es "ingles", devuelve "Hello!"
  // Si "idioma" no es ninguno de los anteiores o es `undefined` devuelve "Hola!"
  // Tu código:
  var saludo;
  if(idioma == "aleman"){
    saludo = "Guten Tag!";
    return saludo;
  }
  else if(idioma == "mandarin"){
    saludo = "Ni Hao!";
    return saludo;
  }
  else if(idioma == "ingles"){
    saludo = "Hello!";
    return saludo;
  }
  else{
    saludo = "Hola!";
    return saludo;
  }
}

function colors(color) {
  //La función recibe un color. Devolver el string correspondiente:
  //En caso que el color recibido sea "blue", devuleve --> "This is blue"
  //En caso que el color recibido sea "red", devuleve --> "This is red"
  //En caso que el color recibido sea "green", devuleve --> "This is green"
  //En caso que el color recibido sea "orange", devuleve --> "This is orange"
  //Caso default: devuelve --> "Color not found"
  //Usar el statement Switch.
  
  switch(color){
    case "blue": return "This is blue";
        break;
    case "red": return "This is red";
        break;
    case "green": return "This is green"; 
        break;
    case "orange": return "This is orange";          
        break;
    default: return "Color not found";
        break;
  }   
}
function esDiezOCinco(numero) {
  // Devuelve "true" si "numero" es 10 o 5
  // De lo contrario, devuelve "false"
  // Tu código:

  if(numero == 5 || numero == 10){
    return true;
  }
  else{
    return false;
  }
}

function estaEnRango(numero) {
  // Devuelve "true" si "numero" es menor que 50 y mayor que 20
  // De lo contrario, devuelve "false"
  // Tu código:

  if(numero < 50 && numero > 20){
    return true;
  }
  else{
    return false;
  }

}

function esEntero(numero) {
  // Devuelve "true" si "numero" es un entero (int/integer)
  // Ejemplo: 0.8 -> false
  // Ejemplo: 1 -> true
  // Ejemplo: -10 -> true
  // De lo contrario, devuelve "false"
  // Pista: Puedes resolver esto usando `Math.floor`
  // Tu código:
  
  if(numero - Math.floor(numero) == 0){
    return true;
  }
  else{
    return false;
  } 
}
function fizzBuzz(numero) {
  // Si "numero" es divisible entre 3, devuelve "fizz"
  // Si "numero" es divisible entre 5, devuelve "buzz"
  // Si "numero" es divisible entre 3 y 5 (ambos), devuelve "fizzbuzz"
  // De lo contrario, devuelve el numero

  if (numero % 3 === 0 && numero % 5 === 0) {
    return 'fizzbuzz';
 }
  else if (numero % 3 === 0) {
    return 'fizz';
 } else if (numero % 5 === 0) {
    return 'buzz';
 }  else {
    return numero;
 } 
}
function operadoresLogicos(num1, num2, num3) {
  //La función recibe tres números distintos. 
  //Si num1 es mayor a num2 y a num3 y además es positivo, retornar ---> "Número 1 es mayor y positivo"
  //Si alguno de los tres números es negativo, retornar ---> "Hay negativos"
  //Si num3 es más grande que num1 y num2, aumentar su valor en 1 y retornar el nuevo valor.
  //0 no es ni positivo ni negativo. Si alguno de los argumentos es 0, retornar "Error".
  //Si no se cumplen ninguna de las condiciones anteriores, retornar false.
  
  var retor;
  if(num1 == 0 || num2 == 0 || num3 == 0){
    retor = "Error";
    return retor;
  }
  else if(num1 < 0 || num2 < 0 || num3 < 0){
    retor = "Hay negativos";
    return retor;
  }
  else if(num1 > num2 && num1 > num3 && num1 > 0){
    retor = "Número 1 es mayor y positivo";
    return retor;
  }
  else if(num3 > num1 && num3 > num2){
    var suma = num3 + 1;
    return suma;
  }
  
  else{
    return false;
  }
}

function esPrimo(numero){

  
    let divisores = 1; //El número siempre es divisor de si mismo entonces comienza en uno
    for (var i = 1; i <= numero /2; i++){ //Menor o igual en vez de menor estricto
      if (numero % i === 0) { //i es divisor de numero
        divisores++;
      }
    }
    return divisores == 2 //para ser primo debe ser divisible por si mismo y por 1
  
 
}

function esVerdadero(valor){
 //Escribe una función que reciba un valor booleano y retorne “Soy verdadero” 
  //si su valor es true y “Soy falso” si su valor es false.
  //Escribe tu código aquí
  var booleano;
  if(valor == true){
    booleano = "Soy verdadero";
    return booleano;
  }
  if(valor == false){
    booleano = "Soy falso";
    return booleano;
  } 
 }

function tablaDelSeis(){
//Escribe una función que muestre la tabla de multiplicar del 6 (del 0 al 60).
  //La función devuelve un array con los resultados de la tabla de multiplicar del 6 en orden creciente.
  //Escribe tu código aquí 

  let arrayTablaDelSeis = [];
  for(var i = 0; i < 11; i++){
    arrayTablaDelSeis.push(i * 6);
    
  }
  return arrayTablaDelSeis;
}

function tieneTresDigitos(numero){
//Leer un número entero y retornar true si tiene 3 dígitos. Caso contrario, retorna false.
  //Escribe tu código aquí

  
  for(var i = 0; i < numero; i++){
    if(numero < 1000 && numero > 99){
      return true;
    }
    else{
      return false;
    }
 }
}

function doWhile(numero) {
 //Implementar una función tal que vaya aumentando el valor recibido en 5 hasta un límite de 8 veces
  //Retornar el valor final.
  //Usar el bucle do ... while.

  var i = numero;
  let arrayDoWhile = [];
  do{
    i+= 5
    arrayDoWhile.push(i);
  }
  while(i < numero + 40);
  const last = arrayDoWhile[arrayDoWhile.length-1];
  return last;
  
}


// No modificar nada debajo de esta línea
// --------------------------------

module.exports = {
  obtenerMayor,
  mayoriaDeEdad,
  conection,
  saludo,
  colors,
  esDiezOCinco,
  estaEnRango,
  esEntero,
  fizzBuzz,
  operadoresLogicos,
  esPrimo,
  esVerdadero,
  tablaDelSeis,
  tieneTresDigitos,
  doWhile,
};
