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

function vocal (letra){

var vocales = ["a","e","i","o","u"];
for (vocales = 0; vocales <5 ; vocales ++){
if(vocales > 1 == 'a'){ return 'Es vocal'} ;if(vocales > 0 == 0 ){return false } vocales++;
}} console.log(vocal('a'));