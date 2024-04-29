function order(expr) {
  const prior = {
    "&": 2,
    "|": 2,
    "~": 2,
    "->": 2,
    "!": 1,
    "(": 0,
  };

  const queue = [];
  const stack = [];

  const cor = expr.match(/[A-Za-z]|[\&\|\!\(\)\~]|->/g);

  cor.forEach((el) => {
    if (el.match(/[A-Za-z]/)) {
      queue.push(el);
    } else if (el === "(") {
      stack.push(el);
    } else if (el === ")") {
      while (stack.length > 0 && stack[stack.length - 1] !== "(") {
        queue.push(stack.pop());
      }
      stack.pop();
    } else {
      while (stack.length > 0 && prior[stack[stack.length - 1]] >= prior[el]) {
        queue.push(stack.pop());
      }
      if (stack[stack.length - 1] === "!") {
        queue.push(stack.pop());
      }
      stack.push(el);
    }
  });

  while (stack.length > 0) {
    queue.push(stack.pop());
  }

  return queue.join("");
}

function tableStr(expr) {
  let str = "";
  let arr = [];
  const letters = expr.match(/[A-Za-z]/g);
  const signs = expr.match(/[\&\|\!\(\)\~\-\>]|/g);
  for (let i = 0; i < expr.length; i++) {
    let fl = false;
    if (!signs.includes(expr[i])) {
      arr.push(expr[i]);
    } else if (expr[i] !== "!" && !letters.includes(expr[i])) {
      let char = expr[i];
      if (char == "-") {
        char = char + ">";
        i++;
      }
      if (arr.length === 2) {
        fl = true;
        arr = [arr[arr.length - 2] + char + arr[arr.length - 1]];
      } else {
        fl = true;
        arr = [arr[0], arr[arr.length - 2] + char + arr[arr.length - 1]];
      }
    } else if (!letters.includes(expr[i])) {
      fl = true;
      arr[arr.length - 1] = "!" + arr[arr.length - 1];
    }
    if (fl === true) {
      str += ` ${arr[arr.length - 1]}`;
    }
  }

  str = letters.join(" ") + str;

  return str;
}

function action(exprVal) {
  let numStr = exprVal.match(/[0-1]/g).join(" ");
  let resStr = "";
  const resArr = [];
  let result = 0,
    operand1 = 0,
    operand2 = 0;
  signsCounter = 0;

  for (let i = 0; i < exprVal.length; i++) {
    const char = exprVal[i];

    if (char === "0" || char === "1") {
      resArr.push(char);
      continue;
    }

    if (
      char === "&" ||
      char === "|" ||
      char === "-" ||
      char === "~" ||
      char === "!"
    ) {
      if (resArr.length >= 2) operand1 = resArr[resArr.length - 2];
      operand2 = resArr[resArr.length - 1];

      if (char === "&") {
        result = operand1 === "1" && operand2 === "1" ? "1" : "0";
      } else if (char === "|") {
        result = operand1 === "1" || operand2 === "1" ? "1" : "0";
      } else if (char === "-") {
        result = operand1 === "1" && operand2 === "0" ? "0" : "1";
        i++;
        resArr.pop();
        resArr.pop();
        resArr.push(result);
        signsCounter += 2;
        resStr += " ".repeat(signsCounter) + `${result}`;
        continue;
      } else if (char === "~") {
        if (
          (operand1 === "1") & (operand2 === "1") ||
          (operand1 === "0") & (operand2 === "0")
        ) {
          result = "1";
        } else result = "0";
      } else if (char === "!") {
        resArr[resArr.length - 1] =
          resArr[resArr.length - 1] === "1" ? "0" : "1";
        signsCounter += 2;
        resStr += " ".repeat(signsCounter) + `${resArr[resArr.length - 1]}`;
        continue;
      }
    }
    resArr.pop();
    resArr.pop();
    resArr.push(result);
    signsCounter += 2;
    resStr += " ".repeat(signsCounter) + `${result}`;
  }

  if (result === "1") {
  }

  resStr = numStr + resStr;

  return resStr;
}

function tableTruelness(expr) {
  console.log("\n---------- TableTrulnes ----------\n");
  console.log(tableStr(expr));
  let resArr = [];
  const num = expr.match(/[A-Za-z]/g).length;

  function matrix(num) {
    const matrix = [];

    for (let i = 0; i < Math.pow(2, num); i++) {
      const row = [];
      for (let j = 0; j < num; j++) {
        row.push((i >> j) & 1);
      }
      matrix.push(row);
    }

    return matrix.map((row) => (row = row.reverse()));
  }

  const mat = matrix(num);

  mat.forEach((row) => {
    let exprVal = expr;
    for (let i = 0; i < num; i++) {
      const val = row[i];
      exprVal = exprVal.replace(/[A-Za-z]/, val);
    }
    console.log(action(exprVal));
    resArr.push(action(exprVal));
  });

  return resArr;
}

function sknf_sdnf(exprCor, resStr) {
  const resArr = [];
  let letters = exprCor.match(/[A-Za-z]/g).join("");
  const sdnf = [];
  const sknf = [];
  let sdnfRes = "",
    sknfRes = "";
  resStr.forEach((row) => {
    let rowStr = row.split(" ").join("").substring(0, letters.length);
    let result = row[row.length - 1];
    if (result === "1") sdnf.push(rowStr);
    else sknf.push(rowStr);
  });
  console.log("\n---------- SDNF ----------\n");
  sdnf.forEach((row) => {
    let rowRes = "";
    row.split("").forEach((el, i) => {
      if (el === "0") {
        rowRes += "!" + letters[i];
      } else {
        rowRes += letters[i];
      }
    });
    if (sdnfRes.length === 0) {
      sdnfRes += rowRes;
    } else {
      sdnfRes += " || " + rowRes;
    }
  });
  resArr.push(sdnfRes);
  console.log(sdnfRes);
  console.log("\n---------- SKNF ----------\n");
  sknf.forEach((row) => {
    let rowRes = "";
    row.split("").forEach((el, i) => {
      if (parseInt(i) === 0) {
        if (el === "0") {
          rowRes += "!" + letters[i];
        } else {
          rowRes += letters[i];
        }
      } else {
        if (el === "0") {
          rowRes += "|" + "!" + letters[i];
        } else {
          rowRes += "|" + letters[i];
        }
      }
    });
    if (sknfRes.length === 0) {
      sknfRes += "(" + rowRes + ") ";
    } else {
      sknfRes += "(" + rowRes + ") ";
    }
  });
  resArr.push(sknfRes);
  console.log(sknfRes);
  return resArr;
}

function numberForm(resStr) {
  const sdnfNumForm = [],
    sknfNumForm = [],
    allForm = [];
  resStr.forEach((row, i) => {
    let result = row[row.length - 1];
    if (result === "1") sdnfNumForm.push(i);
    else sknfNumForm.push(i);
  });
  console.log("\n---------- SdnfNumForm ----------\n", sdnfNumForm);
  console.log("\n---------- SknfNumForm ----------\n", sknfNumForm);
  allForm.push(sdnfNumForm);
  allForm.push(sknfNumForm);
  return allForm;
}

function toNormal(bin) {
  bin = bin.toString().split("").reverse().join("");
  let res = 0;
  for (let i = 0; i < bin.length; i++) {
    if (parseInt(bin[i]) === 1) res += Math.pow(2, i);
  }
  return res;
}

function indexForm(resStr) {
  const indexForm = [];
  resStr.forEach((row) => {
    let result = row[row.length - 1];
    indexForm.push(result);
  });
  const res = toNormal(indexForm.join(""));
  console.log(
    "\n---------- IndexForm ----------\n\n",
    res,
    " - ",
    indexForm.join("")
  );
  return res;
}

const expr = "a->(b&(!c))";
console.log(expr);
console.log(order(expr), "\n");
const resTable = tableTruelness(order(expr));
sknf_sdnf(order(expr), resTable);
numberForm(resTable);
indexForm(resTable);

module.exports = {
  order,
  tableStr,
  action,
  tableTruelness,
  sknf_sdnf,
  numberForm,
  toNormal,
  indexForm,
};
