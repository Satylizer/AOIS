const { minimalize } = require("./minimalize");
const { Tetrads } = require("./tetrads");

function truthTable() {
    let table = "U V Z | R | Z_out\n-------------\n";
    const inputOutput = [
        [0, 0, 0, 0, 0],
        [1, 0, 0, 1, 0],
        [0, 1, 0, 1, 1],
        [1, 1, 0, 0, 0],
        [0, 0, 1, 1, 1],
        [1, 0, 1, 0, 0],
        [0, 1, 1, 0, 1],
        [1, 1, 1, 1, 1]
    ];

    for (let i = 0; i < inputOutput.length; i++) {
        table += inputOutput[i].slice(0, 3).join(" ") + " | " + inputOutput[i][3] + " | " + inputOutput[i][4] + "\n";
    }
    return table;
}


function makeSdnf(tableArr) {
  result = "";
  const abc = ["u", "v", "z"];

  tableArr.forEach((row) => {
    if (row[row.length - 1] === 1) {
      if (result[result.length - 1] === ")") result += "|";
      result += "(";
      for (let i = 0; i < 3; i++) {
        if (row[i] === 1) {
          result += abc[i];
        } else {
          result += "!" + abc[i];
        }
      }
      result += ")";
    }
  });

  return result;
}

function getSdnf(table, id) {
  const rows = table.trim().split("\n").slice(2);
  const tableArray = rows
    .map((row) =>
      row
        .trim()
        .split(/\s+/)
        .map((item) => {
          return parseInt(item);
        })
    )
    .map((row) => row.filter((item) => !isNaN(item)));

  switch (id) {
    case 1:
      tableArray.map((row) => {
        return row.pop();
      });
      console.log("SDNF для R: ");
      return makeSdnf(tableArray);
    case 2:
      console.log("SDNF для Z: ");
      return makeSdnf(tableArray);
    default:
      console.log("неправильное id");
      return "";
  }
}

const table = truthTable();
const tetrads = new Tetrads()
console.log(table);
const sdnfR = getSdnf(table, 1);
console.log(sdnfR);
const sdnfZ = getSdnf(table, 2);
console.log(sdnfZ);
console.log("Минимизировання R:", minimalize(sdnfR));
console.log("Минимизировання Z:", minimalize(sdnfZ));

console.log("\n");
tetrads.print();
tetrads.addNumber(9);
tetrads.print();