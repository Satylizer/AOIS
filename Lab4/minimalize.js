function createMatrix(expression) {
  let rows = expression.split("|");
  const matrix = [];

  rows.forEach(function (row) {
    const currentRow = [];
    let elements = row.split("");

    for (let i = 0; i < elements.length; i++) {
      if (elements[i] === "!") {
        currentRow.push("!" + elements[i + 1]);
        i++;
      } else if (elements[i] !== "(" && elements[i] !== ")") {
        currentRow.push(elements[i]);
      }
    }

    matrix.push(currentRow);
  });

  return matrix;
}

function findUniqueRows(matrix, commonElements) {
  const uniqueRows = [];

  for (let i = 0; i < matrix.length; i++) {
    const currentRow = matrix[i];
    let hasCommonElement = false;

    for (let j = 0; j < commonElements.length; j++) {
      const commonRow = commonElements[j];

      if (commonRow.every((el) => currentRow.includes(el))) {
        hasCommonElement = true;
        break;
      }
    }

    if (!hasCommonElement) {
      uniqueRows.push(currentRow);
    }
  }

  return uniqueRows;
}

function findCommonElements(matrix) {
  const commonElements = [];

  for (let i = 0; i < matrix.length; i++) {
    const currentRow = matrix[i];

    for (let j = i + 1; j < matrix.length; j++) {
      const otherRow = matrix[j];
      let commonCount = 0;
      const sameRowEl = [];

      for (let k = 0; k < currentRow.length; k++) {
        if (otherRow.includes(currentRow[k])) {
          sameRowEl.push(currentRow[k]);
          commonCount++;
        }
      }

      if (commonCount === currentRow.length - 1) {
        commonElements.push(sameRowEl);
        pushed = true;
      }
    }
  }

  const uniqueRows = findUniqueRows(matrix, commonElements);

  uniqueRows.forEach(row => {
    commonElements.push(row);
  });

  return commonElements;
}

function minimalize(expression) {
  const matrix = createMatrix(expression);
  const result1 = findCommonElements(matrix);

  const minimizedResult = result1.map(row => row.join('')).join(' | ');

  return minimizedResult;
}

module.exports = { minimalize };
