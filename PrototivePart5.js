function agregarStringInvertida() {
  // Agrega un método al prototype de String que devuelva la misma cadena de caracteres, pero invertida.
  // El método debe llamarse "reverse"
  // Ej: 'menem'.reverse() => menem
  // 'toni'.reverse() => 'inot'
  // Pista: Necesitarás usar "this" dentro de "reverse"
}
// 1 ----------------------------------------------------------
function main1() {
  function User(user, name) {
    this.usuario = user;
    this.nombre = name;
    this.poop = () => "I'm shitting myself!";
  }

  User.prototype.saludar = function () {
    return "Hola, mi nombre es " + this.nombre;
  };

  const u = new User("jhonny", "Deep");
  // console.log(u.saludar());
  console.log(u.poop());
}

// 2 ----------------------------------------------------------
function main2() {
  function Test() {
    this.test = true;
  }

  Test.prototype.saludar = function () {
    return "Glutten Morgen!";
  };

  const test = new Test();
  console.log(test.saludar());
}

// 3 ----------------------------------------------------------
function main3() {
  String.prototype.reverseThese = function () {
    const str = this.slice(0);
    return [...str].reverse().join``;
  };

  console.log("MottherTrucker".reverseThese());
}

// 4 & 5 ----------------------------------------------------------
class Parson {
  constructor(_name, _age) {
    this.name = _name;
    this.age = _age;
  }

  get info() {
    return { name: this.name, age: this.age };
  }

  changeName(_newName) {
    this.name = _newName;
  }
}

function main45() {
  const pogPerson = new Parson("Jotaro", "777");
  console.log(pogPerson);
}

// 6 ----------------------------------------------------------
// Add method to class above
Parson.prototype.betterInfo = function () {
  return `Atashi no namae wa ${this.name}, soshite ${this.age}-sai desu`;
};

const jpParson = new Parson("Hikari", 21);
console.log(jpParson.betterInfo());
