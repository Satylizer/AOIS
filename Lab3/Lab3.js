function getStrFromBrackets(equation) {
  const strFromBrackets = [];

  for (let i = 0; i < equation.length; i++) {
    let el = equation[i];

    if (el === "(") {
      let str = "";
      while ((el = equation[++i]) !== ")") {
        str += el;
      }
      strFromBrackets.push(str);
    }
  }

  return strFromBrackets;
}

function getElement(br, i) {
  let el = br[i];

  if (el === "¬") {
    el = br[i] + br[i + 1];
    i++;
  }

  return [el, i];
}

function areEqual(bracket1, bracket2) {
  let str = "";

  for (let i = 0; i < bracket1.length; i++) {
    const el = getElement(bracket1, i)[0];
    i = getElement(bracket1, i)[1];

    for (let j = 0; j < bracket2.length; j++) {
      const elem = getElement(bracket2, j)[0];
      j = getElement(bracket2, j)[1];

      if (el === elem) {
        str += el;
      }
    }
  }

  return str;
}

function removeNotSymbol(str) {
  return str.replace(/¬/g, "");
}

function compareBrackets(strFromBrackets) {
  const equalElFromBrackets = [];

  const uniqueStr = [];

  strFromBrackets = strFromBrackets.filter((bracket1, index) => {
    const count = strFromBrackets.reduce((acc, bracket2, idx) => {
      return (
        acc +
        (removeNotSymbol(bracket1) === removeNotSymbol(bracket2) &&
        idx !== index
          ? 1
          : 0)
      );
    }, 0);

    if (count === 0) uniqueStr.push(bracket1);

    return count > 0;
  });

  strFromBrackets.forEach((bracket1, ind) => {
    for (let i = ind + 1; i < strFromBrackets.length; i++) {
      const bracket2 = strFromBrackets[i];
      const str = areEqual(bracket1, bracket2);

      if (
        !!str &
        (removeNotSymbol(str).length === removeNotSymbol(bracket1).length - 1)
      ) {
        equalElFromBrackets.push(`${str}`);
      }
    }
  });

  const combinedArray = [...new Set([...uniqueStr, ...equalElFromBrackets])];

  return combinedArray;
}

function checkCompareBrackets(arrayToCheck) {
  const result = {};

  arrayToCheck.forEach((bracket, idx) => {
    const anotherImplicants = arrayToCheck.filter((el, index) => index !== idx);
    const bracketLetters = bracket.split("");

    const filteredImplics = anotherImplicants.map((implic) => {
      return implic
        .split("")
        .map((letter) => (bracketLetters.includes(letter) ? 1 : letter))
        .join("");
    });

    const cleanedImplics = filteredImplics
      .map((arr) => arr.replace(/1/g, ""))
      .filter((str) => str !== "");

    result[bracket] = cleanedImplics.join(" ∨ ");

    if (
      cleanedImplics.length === 1 &&
      cleanedImplics.join("") !== filteredImplics.join("")
    ) {
      arrayToCheck = arrayToCheck.filter((item) => item !== bracket);
    }
  });

  return { checkedImplicants: result, checkedArray: arrayToCheck };
}

function getTable(strFromBrackets, equalElFromBrackets) {
  const table = [
    ["", "Конституэнты"],
    ["", ...strFromBrackets],
  ];

  equalElFromBrackets.forEach((bracket1) => {
    const tableRow = [bracket1];
    for (let i = 0; i < strFromBrackets.length; i++) {
      const bracket2 = strFromBrackets[i];

      if (
        areEqual(bracket1, bracket2).length === removeNotSymbol(bracket1).length
      ) {
        tableRow.push(1);
      } else {
        tableRow.push(0);
      }
    }
    table.push(tableRow);
  });

  return table;
}

function checkTableImplicants(table) {
  const rightImplicants = [];

  for (let i = 1; i < table[2].length; i++) {
    const numberOnes = { ones: 0, ind: 0 };

    for (let j = 2; j < table.length; j++) {
      if (table[j][i] === 1) {
        numberOnes.ones += 1;
        numberOnes.ind = j;
      }
    }
    if (numberOnes.ones === 1) {
      rightImplicants.push(table[numberOnes.ind][0]);
    }
  }

  return [...new Set(rightImplicants)];
}

function replaceStr(strFromBrackets) {
  const changed = [];

  strFromBrackets.forEach((str) => {
    let newStr = "";

    for (let i = 0; i < str.length; i++) {
      if (str[i] === "¬") {
        newStr += 0;
        i++;
      } else newStr += 1;
    }

    changed.push(newStr);
  });

  return changed;
}

function carnoTable(strFromBrackets) {
  const replaced = replaceStr(strFromBrackets);

  const letters = removeNotSymbol(strFromBrackets[0]);
  const table = [
    [`${letters[0]}/${letters[1]}${letters[2]}`, "00", "01", "11", "10"],
    ["0"],
    ["1"],
  ];

  for (let i = 1; i < table.length; i++) {
    for (let j = 1; j < table[0].length; j++) {
      const str = table[i][0] + table[0][j];

      if (replaced.includes(str)) {
        table[i].push(1);
      } else table[i].push(0);
    }
  }

  return table;
}

function calcMethod(equation) {
  const strFromBrackets = getStrFromBrackets(equation);
  const equalElFromBrackets = compareBrackets(strFromBrackets);
  const secondLoop = compareBrackets(equalElFromBrackets);
  // secondLoop.push("ac");
  const checkedArray = checkCompareBrackets(secondLoop);

  return {
    equation: equation,
    simplifiedEquation: strFromBrackets,
    guildingStage: equalElFromBrackets,
    arrayToCheck: secondLoop,
    resultStage: checkedArray,
  };
}

function tableMethod(equation) {
  const strFromBrackets = getStrFromBrackets(equation);
  const equalElFromBrackets = compareBrackets(strFromBrackets);
  const secondLoop = compareBrackets(equalElFromBrackets);
  // secondLoop.push("ac");
  const table = getTable(strFromBrackets, secondLoop);
  const rightImplicants = checkTableImplicants(table);

  return { table: table, rightImplicants: rightImplicants };
}

function carnoMethod(equation) {
  const strFromBrackets = getStrFromBrackets(equation);
  const table = carnoTable(strFromBrackets);
  const equalElFromBrackets = compareBrackets(strFromBrackets);
  const secondLoop = compareBrackets(equalElFromBrackets);
  const checkedArray = checkCompareBrackets(secondLoop);

  return {carnoTable: table, resultImplicants: checkedArray.checkedArray};
}

const equation = "(¬abc) ∨ (a¬b¬c) ∨ (a¬bc) ∨ (ab¬c) ∨ (abc)";
console.log(calcMethod(equation));
console.log(tableMethod(equation));
console.log(carnoMethod(equation));

module.exports = {
  getStrFromBrackets,
  getElement,
  areEqual,
  removeNotSymbol,
  compareBrackets,
  checkCompareBrackets,
  getTable,
  checkTableImplicants,
  replaceStr,
  carnoTable,
  calcMethod,
  tableMethod,
  carnoMethod
};