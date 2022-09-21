function main1() {
  function objectToArr(obj) {
    const res = [];
    for (const item in obj) {
      res.push([item, obj[item]]);
    }

    console.log(res);
  }

  objectToArr({
    D: 1,
    B: 2,
    C: 3,
  });
}

function main2() {
  function charRepetitions(str) {
    const res = new Object();
    [...str].forEach((e) => {
      if (res[e] === undefined) {
        res[e] = 1;
      } else {
        res[e]++;
      }
    });

    return res;
  }

  console.log(charRepetitions("sktpwrroqstkrpwwsqtqopwktsd"));
}

function main3() {
  function capToFront(str = "") {
    //Example: soyHENRY -> HENRYsoy
    //store all uppercase & lowecase, append lowecase later
    const lower = [];
    const upper = [];
    [...str].forEach((e) => {
      if (e === e.toUpperCase()) {
        upper.push(e);
      } else {
        lower.push(e);
      }
    });

    return upper.join`` + lower.join``;
  }

  console.log(capToFront("soyHENRYITinkLikeMaybe"));
}

function main4() {
  function likeMirror(str = "") {
    //Ex: Recibe ---> "The Henry Challenge is close!" || Devuelve ---> "ehT yrneH egnellahC si !esolc"
    return str.split(" ").map((e) => [...e].reverse().join``).join` `;
  }

  console.log(likeMirror("he Henry Challenge is close!"));
}

function main5() {
  function sameNumBothSides(num = 0) {
    // return false or true, depending
    return num.toString() === [...num.toString()].reverse().join``;
  }

  console.log(sameNumBothSides(121));
  console.log(sameNumBothSides(1215));
}

function main6() {
  function deleteAbc(str = "") {
    const check = [..."abcABC"];
    return [...str].filter((e) => !check.includes(e)).join``;
  }

  console.log(deleteAbc("OcnceAbace"));
}

function main7() {
  function sortStrArray(arr = [""]) {
    // sort array in srt length
    return arr.sort((a, b) => a.length - b.length).join` `;
  }

  console.log(sortStrArray(["You", "are", "beautiful", "looking"]));
}

function main8() {
  function searchingIntersections(arr1 = [], arr2 = []) {
    // return an arr whit the union between 2 given arrs

    const res = [];
    //1st longerx
    if (arr1.length > arr2.length) {
      res.push(arr2.filter((e) => arr1.includes(e)));
    } else {
      // 2nd longer
      res.push(arr1.filter((e) => arr2.includes(e)));
    }

    return res.flat();
  }

  console.log(searchingIntersections([1, 2, 3], [1, 5, 8, 3]));
  console.log(searchingIntersections([7, 23, 4], [23, 70]));
  console.log(searchingIntersections([1, 20, 3], [22, 5, 7]));
}
