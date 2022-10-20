function suma (a,b)       {return a+b}console.log(suma(5,88));

function resta(a,b)       {return a-b}console.log(resta(88,5));

function multiplica(a,b)  {return a*b}console.log(multiplica(25,3));

function cadena (str)     { console.log('hola '); return str} console.log(cadena("Tepes "+"Franco"));

function ifss(a,b){ if (a == b){ return true}else{return false}} console.log(ifss(7,7));


function elevar(num){return Math.pow(num,2)}console.log (elevar(5));

function ele(num,expo){ return Math.pow(num , expo); } console.log(ele(5,2));

function esPositivo(numero) { if(numero >= 1){ return "Es positivo" }else if (numero <= -1){return "Es negativo"}
else if (numero == 0){ return false} }console.log(esPositivo(0));

function longitud(str1, str2) {return str1.length == str2.length;}console.log(longitud('hola','hula'));
function con(euro){return  euro * 1.2000} console.log(con(5));

function vocales (letras)
{  if(letras.length > 1){return "Dato incorrecto"}
     else if (letras == "a"||letras == "e"||letras == "i"||letras == "o"||letras == "u" ){return " vocal" }
    return "ingresa dato correcto"}
    console.log(vocales("e"));



    function fizzBuzz(numero) {
     // Si "numero" es divisible entre 3, devuelve "fizz"
     // Si "numero" es divisible entre 5, devuelve "buzz"
     // Si "numero" es divisible entre 3 y 5 (ambos), devuelve "fizzbuzz"
     // De lo contrario, devuelve el numero
     if(numero % 15 === 0) return 'fizzbuzz';
     if(numero % 3 === 0) return 'fizz';
     if(numero % 5 === 0) return 'buzz';
     return numero;
   } console.log(fizzBuzz(27));

   function operadoresLogicos(num1, num2, num3) {
     //La función recibe tres números distintos. 
     //Si num1 es mayor a num2 y a num3 y además es positivo, retornar ---> "Número 1 es mayor y positivo"
     //Si alguno de los tres números es negativo, retornar ---> "Hay negativos"
     //Si num3 es más grande que num1 y num2, aumentar su valor en 1 y retornar el nuevo valor.
     //0 no es ni positivo ni negativo. Si alguno de los argumentos es 0, retornar "Error".
     //Si no se cumplen ninguna de las condiciones anteriores, retornar false. 
     if(num1 < 0 || num2 < 0 || num3 < 0) {
       return "Hay negativos";
     }
     else if(num1 === 0 || num2 === 0 || num3 === 0) {
       return "Error";
     }
     else if(num1 > 0 && num1 > num2 && num1 > num3) {
       return "Número 1 es mayor y positivo";
     }
     else if(num3 > num1 && num3 > num2) {
       return num3 + 1;
     }
     else {
       return false;
     }
   } console.log(operadoresLogicos(-5,0,1))

var foo = 12;
var bar = { id : '12' };
 
console.log( foo.length ); // undefined
console.log( bar.length ); // undefined


let total = 0, cuenta = 1;
while (cuenta <= 10) {
total += cuenta;
cuenta += 1;
}
console.log(total);
// → 55

console.log(`la mitad de 100 es ${100 / 2}`)
console.log("Aardvark" > "Zoroaster")

prompt("Introducir contraseña");


function min(numero){

const numero =[];
 Math.max

}

let elNumero = Number(prompt("Elige un numero"));
console.log("Tu número es la raiz cuadrada de " +
elNumero * elNumero);

function dow(num){

  let i = 0;
  do{
   const rest = num + i 
  console.log(false ? i : num);

  i++
  }
  while (i < 5)
  
  } console.log(dow(2));

  var o4 = false || (3 == 4);

  let text = "";
let b = 0;
do {
  text += i + "<br>";
  i++;
}
while (i < 5); 

// program to display numbers
let i = 1;
const n = 5;

// do...while loop from 1 to 5
do {
    console.log(i);
    i++;
} while(i <= n);

function tieneTresDigitos(numero){
  //Leer un número entero y determinar si tiene 3 dígitos.
  //Escribe tu código aquí
  if(numero > 99 && numero < 1000){
    return true
  }
  return false
} console.log(tieneTresDigitos(100));



function doWhile(numero) {
  //Implementar una función tal que vaya aumentando el valor recibido en 5 hasta un límite de 8 veces
  //Retornar el valor final.
  //Usar el bucle do ... while.
  var a = numero;
  var i = 0;
  do {
    i = i + 1;
    a = a + 5;
  }
  while(i < 8);
  return a;
}

function doWhile(numero) {
  //Implementar una función tal que vaya aumentando el valor recibido en 5 hasta un límite de 8 veces
  //Retornar el valor final.
  //Usar el bucle do ... while.
  var a = numero;
  var i = 0;
  do {
    i++
    a += 5
  }
  while(i < 8);
  return a;
}

function prueba(x,y){
var status = (x >= y) ? 'true' : 'false';
return  status
} console.log(prueba(8,9));


for (let i = 1; i<11; i++){
console.log(i)

}

let frutas = [45, 3,2]
frutas.forEach(function(elemento, indice, array) {
//console.log(elemento,indice)
})

let eliminar = frutas.pop()
console.log (frutas)
let agregar = frutas.push(7,8,9,10,11)
console.log(frutas)
let pos =1 , doc=3;  let eliminator =  frutas.splice(pos,doc)
console.log (frutas)


var filtro = [2,3,4,78,96,74]
var re = filtro.filter(acumulador => acumulador >50)
console.log(re)

// create an array
const names = ['John', 'Peter', 'James', 'Pammy'];

// Filter the array for names having 'am'
//https://medium.com/@cristi.nord/javascript-array-filter-method-f3d3e5d3af7d foro metodo filter
const myName = names.filter(name => name.includes('am'));

// Output new array
console.log(myName)

// Create array of continents
const places = ['Africa', 'Asia', 'Europe', 'Australia','malasia','danes'];
// Filter array for continents beyond the array index of 1
const overIndex = places.filter(function(place, index){ return index > 1;})
// Display new Array
console.log(overIndex);

 
let viejo = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes','Sabado']
    var busqueda = 'D'
let nueva = viejo.findIndex(a => a === 'Domingo' )   
    console.log(nueva)//
   if(viejo.startsWith('D')) console.log

  //
   var accountlist = [{
    "value": "000555 - TEST ACCOUNT NAME1",
    "data": "184"
}, {
    "value": "006666 - TEST ACCOUNT NAME2",
    "data": "450"
}, {
    "value": "007777 - TEST ACCOUNT NAME2",
    "data": "451"
}];
var searchString = '000555';
var result = accountlist.findIndex((account) => { return account.value.startsWith(searchString);}, searchString)
console.log(result)  //
const fruits = ["apple", "banana", "cantaloupe", "blueberries", "grapefruit"];

const index = fruits.findIndex(fruit => fruit === "blueberries");

console.log(index); // 3
console.log(fruits[index]); // blueberries
 
let a = []
a.push('1','2','3',4)
//console.log (a)
let be = a [Symbol.iterator]()
for (let inicial of be)console.log("valor del for "+inicial)

console.log(a.at(3))// sirve para recorrer array positivo y negativo

function abcd(ava){

 let arreglo = ['Domingo','Lunes','Martes','Miercoles','Jueves','Viernes']
 //var result = arreglo.filter(arreglo => arreglo > 18);
 var result = arreglo.find(array => array === 'Domingo')

 if(result==='Domingo' || result === 'Sabado') 
 return 'Fin de semana'; else return 'Dia normal'
}
console.log(abcd(2))
function arre(arreglu){
var arreglu = ['1','2','3','4']
return arreglu.at()}
console.log(arre())



console.log(arreglu.at(-1))
arreglu.forEach(arre =>{arre * arreglu })
console.log(arreglu)

console.log(Math.pow(2,10))


for(let i=0;i<10 ;i++){
 if(i===3) break; console.log(i); 

} 

for (let actual = 20; ; actual = actual + 1) {
  if (actual % 7 == 0) {
 
  break;
  }
  }

  
  for(let x = 1; x <= 6; x++){
    console.log(' '.repeat(6 - x) + '$'.repeat(x))
  }

for (let inicial =0 ; inicial < 7 ; inicial ++){
 console.log('#'.repeat(inicial))
}
//https://eloquentjs-es.thedojo.mx/Eloquent_JavaScript.pdf
