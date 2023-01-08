## Objetos

Se inicia como una variable, pero entre llaves podemos componer al objeto de varias Propiedades, conformadas por un nombre y un valor (numerico, string o booleano). Por ejemplo:

`var Objeto = { dato1Nombre: dato1Valor, dato2Nombre: dato2Valor, dato3Nombre: dato3Valor}`

Cabe destacar que un dato puede tener mas subdatos dentro de si mismo de esta manera:

`dato1Nombre : {subdato1Nombre: subdato1Valor, subdato2Nombre: subdato2Valor},`

y podemos llamar cada valor especifico poniendo puntos a partir del Objeto principal, por ejemplo: `Objeto.dato1Nombre.subdato1Nombre`

## Propiedades

Es un dato dentro de un objeto conformado con un nombre y un valor, la Propiedad puede tener como valor una funcion, en este caso llamamos a la propiedad, un método.

## Métodos

El método, como antes mencionado, es una función la cual es propiedad de un Objeto. Hay dos tipos de métodos, métodos de Instancia los cuales son tareas integradas realizadas por la instacia de un objeto, y los métodos Estáticos que son tareas que pueden ser llamadas directamente en el constructor de un objeto.

## Bucle `for…in`

El bucle iterará sobre todas las propiedades enumerables del objeto y se escribe de la siguiente manera:

`for (`Propiedad `in` Objeto`) {statement}`

## Notación de puntos vs notación de corchetes

### Notación por punto
`Propiedad` debe ser un identificador válido de JavaScript, letras, numeros, guión bajo ("_") y el signo dolar ("$"), que no puede comenzar por un número. Por ejemplo, `objeto.$1` es válido y `objeto.1` no lo es.

### Notación por corchetes
`Nombre_propiedad` es una cadena. La cadena no tiene que ser un identificador válido, puede tener cualquier valor, por ejemplo `"1foo"`, `"!bar!"`, o incluso `" "` (un espacio).