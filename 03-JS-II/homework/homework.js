// No cambies los nombres de las funciones.

function obtenerMayor(x, y) {
  // "x" e "y" son números enteros (int).
  // Devuelve el número más grande
  // Si son iguales, devuelve cualquiera de los dos
  // Tu código:
  if(x===y)
    return x;
    else if(x>y)
      return x;
      else return y;
}

function mayoriaDeEdad(edad) {
  //Determinar si la persona según su edad puede ingresar a un evento.
  //Si tiene 18 años ó más, devolver --> "Allowed"
  //Si es menor, devolver --> "Not allowed"
  if (edad>=18) 
    Console.log("Allowed");
  else
    Console.log("Not Allowed");
}
  
function conection(status) {
  //Recibimos un estado de conexión de un usuario representado por un valor numérico. 
  //Cuando el estado es igual a 1, el usuario está "Online"
  //Cuando el estado es igual a 2, el usuario está "Away"
  //De lo contrario, presumimos que el usuario está "Offline"
  //Devolver el estado de conexión de usuario en cada uno de los casos.
  String estado;
  if (status===1)
    estado="Online";
  else if(status===2)
      estado="Away";
      else
        estado="Offline";
  return estado;
}

function saludo(idioma) {
  // Devuelve un saludo en tres diferentes lenguajes:
  // Si "idioma" es "aleman", devuelve "Guten Tag!"
  // Si "idioma" es "mandarin", devuelve "Ni Hao!"
  // Si "idioma" es "ingles", devuelve "Hello!"
  // Si "idioma" no es ninguno de los anteiores o es `undefined` devuelve "Hola!"
  // Tu código:
  switch(idioma)
  {
    case 'aleman': Console.log("Guten Tag!");
    case 'mandarin': Console.log("Ni Hao!");
    case 'Ingles': Console.log("Hello!");
    default: Console.log("Hola!");
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
  switch(color)
  {
    case 'blue': Console.log("This is blue");
    case 'red': Console.log("This is red");
    case 'green': Console.log("This is green");
    case 'orange': Console.log("This is orange");
    default: Console.log("Color not found");
  }
}

function esDiezOCinco(numero) {
  // Devuelve "true" si "numero" es 10 o 5
  // De lo contrario, devuelve "false"
  // Tu código:
  if (numero===10||numero===5)
    return true;
  else
    return false;
}

function estaEnRango(numero) {
  // Devuelve "true" si "numero" es menor que 50 y mayor que 20
  // De lo contrario, devuelve "false"
  // Tu código:
if (numero<50&&numero>20)
  return true;
  else
    return false;

}


function esEntero(numero) {
  // Devuelve "true" si "numero" es un entero (int/integer)
  // Ejemplo: 0.8 -> false
  // Ejemplo: 1 -> true
  // Ejemplo: -10 -> true
  // De lo contrario, devuelve "false"
  // Pista: Puedes resolver esto usando `Math.floor`
  // Tu código:
  var x=Math.trunc(numero);
  var d=numero-x;
  if (d===0)
    return true;
  else
    return false;
  
}

function fizzBuzz(numero) {
  // Si "numero" es divisible entre 3, devuelve "fizz"
  // Si "numero" es divisible entre 5, devuelve "buzz"
  // Si "numero" es divisible entre 3 y 5 (ambos), devuelve "fizzbuzz"
  // De lo contrario, devuelve el numero
  if (numero%3===0&&numero%5)
    Console.log("fizzbuzz");
    else
      if (numero%3===0)
        Console.log("Fizz");
      else if(numero%5===0)
            Console.log("Buzz");
          else Console.log(numero);
}


function operadoresLogicos(num1, num2, num3) {
  //La función recibe tres números distintos. 
  //Si num1 es mayor a num2 y a num3 y además es positivo, retornar ---> "Número 1 es mayor y positivo"
  //Si alguno de los tres números es negativo, retornar ---> "Hay negativos"
  //Si num3 es más grande que num1 y num2, aumentar su valor en 1 y retornar el nuevo valor.
  //0 no es ni positivo ni negativo. Si alguno de los argumentos es 0, retornar "Error".
  //Si no se cumplen ninguna de las condiciones anteriores, retornar false.
  
  boolean b1,b2,b3,b4;
  if(num1<0||num2<0||num3<0)
  {
    Console.log("Hay Negativos");
    b1=true;
  }else b1=false;
  
  if(num3>num1&&num3>num2)
  {
    num3++;
    b2=true;
    return num3;
  } else b2=false;
  
  if (num1>num2&&num1>0)
  {
    Console.log("Numero 1 es mayor y positivo");
    b3=true;
  }else b3=false;
  
  if (num1===0||num2===0||num3===0)
  {
    Console.log("Error");
    b4=true;
  } else b4=false;
  if(b1===false&&b2===false&&b3===false&&b4===false)
    return false;
  
}

function esPrimo(numero) {
  // Devuelve "true" si "numero" es primo
  // De lo contrario devuelve "falso"
  // Pista: un número primo solo es divisible por sí mismo y por 1
  // Pista 2: Puedes resolverlo usando un bucle `for`
  // Nota: Los números 0 y 1 NO son considerados números primos
  
  
  
}

function esVerdadero(valor){
  //Escribe una función que reciba un valor booleano y retorne “Soy verdadero” 
  //si su valor es true y “Soy falso” si su valor es false.
  //Escribe tu código aquí

  if(valor===true)
    Console.log("Soy verdadero");
  else
    Console.log("Soy falso");
}

function tablaDelSeis(){
  //Escribe una función que muestre la tabla de multiplicar del 6 (del 0 al 60).
  //La función devuelve un array con los resultados de la tabla de multiplicar del 6 en orden creciente.
  //Escribe tu código aquí   
  Numbers array=[];
  array[0]=0;
  for(let i=0; i<=10;i++)
  {
    array[i]=i*6;
  }  
  return array;
}

function tieneTresDigitos(numero){
  //Leer un número entero y retornar true si tiene 3 dígitos. Caso contrario, retorna false.
  //Escribe tu código aquí
  if (numero>=100&&numero<=999)
    return true;
  else return false;
  
}

function doWhile(numero) {
  //Implementar una función tal que vaya aumentando el valor recibido en 5 hasta un límite de 8 veces
  //Retornar el valor final.
  //Usar el bucle do ... while.
  Number indice, valor;
  indice=0;
  valor=numero;
  do
  {
    valor+=5;
    indice++;
  } while (indice<=8);
  return valor;
  
  
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
  doWhile
};
