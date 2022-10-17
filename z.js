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



const arr = [ 5, 3, 2, 7, 8 ];
const last = arr[arr.length-1];
console.log(last);
 
/*
    Resultado: 8
*/


function incrementarPorUno(array) {
     // "array" debe ser una matriz de enteros (int/integers)
     // Aumenta cada entero por 1
     // y devuelve el array
     // Tu código:
     array =[1,2,3,4,5]
   let   nuevoArray = [];
     for(var i = 0; i < array.length; i++) {
       nuevoArray[i] = array[i] + 1;
       //console.log(`Element at index ${i} is ${nuevoArray[i]}`);
       console.log(`${i} ${nuevoArray[i]}`)
     }
      
     console.log(nuevoArray)
    /*total =*/ 
   }
    

   const base = [25,56,36,89]
  const uno =[], dos=[],tres =[];
  
  for(let i =0 ; i <base.length; i++)
  {uno [i] = base[i] + 1}console.log(uno)
uno.push(5);console.log(uno)
 for (let f = 0; f<uno.length;    f++)
 {dos[f] = uno[f]*2}
 console.log(dos)


 const bas = [1,2,3];


 bas.forEach(element = base + 1 => console.log(element));

var palabras = ["hello","wolrds!"]
  console.log(  palabras.join(' '));

  function arrayContiene(array, elemento) {
     // Comprueba si el elemento existe dentro de "array"
     // Devuelve "true" si está, o "false" si no está
     // Tu código:
   }

   let frutas = ['🍈', '🍍', '🍌', '🍉', ['🍅', '🍄', '🥕']];
   const veg = frutas[4]; // returns the array ['🍅', '🍄', '🥕']
    console.log(veg)
    const zanahoria = veg[2]; // returns '🥕'
     console.log(zanahoria)
     console.log(frutas[4][2])

/*            */
     let numeros = [1, 2, 3, 4, 5];
     let total = numeros.reduce((a, b) => a + b, 0); 

              console.log(total);   /// suna de un arreglo foreach

let consolas = [1,2,3,4,5]

console.info( consolas.includes( 'donna' ) ); 
console.info( consolas.includes( 3 ) ); 
console.info( consolas.indexOf( 'donna' ) ); // 1
console.info( consolas.indexOf( 3 ) ); // -1

if ( consolas.includes( 0 ) ) console.log("existe"); else console.log("no existe")
     /* OK, value exists! */
 

     let totall=0,numeross = [1, 2, 3, 4, 5];
     numeross.forEach(function(a){totall = totall + a;});
     console.log(totall);

     
     let v=0; let alfa =[4,8,8,8,8]
     alfa.forEach(function(b,index,arr){arr[alfa]=b*10})
     console.log(b)   //sumar un arreglo foreach

    // https://developer.mozilla.org/es/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#:~:text=prototype.-,reduce(),como%20resultado%20un%20%C3%BAnico%20valor.
