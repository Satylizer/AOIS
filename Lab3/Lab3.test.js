const {
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
  carnoMethod,
} = require("./Lab3.js");

describe("getStrFromBrackets", () => {
  it("should correctly extract strings from brackets", () => {
    const equation = "(¬abc) ∨ (a¬b¬c) ∨ (a¬bc) ∨ (ab¬c) ∨ (abc)";
    const expected = ["¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"];
    expect(getStrFromBrackets(equation)).toEqual(expected);
  });
});

describe("getElement", () => {
  it("should correctly extract elements from a bracket", () => {
    const bracket = "a¬bc";
    const index = 1;
    const expected = ["¬b", 2];
    expect(getElement(bracket, index)).toEqual(expected);
  });
});

describe("areEqual", () => {
  it("should correctly find common elements between two brackets", () => {
    const bracket1 = "abc";
    const bracket2 = "ab¬c";
    const expected = "ab";
    expect(areEqual(bracket1, bracket2)).toBe(expected);
  });
});

describe("removeNotSymbol", () => {
  it("should correctly remove negation symbols from a string", () => {
    const str = "a¬b¬c";
    const expected = "abc";
    expect(removeNotSymbol(str)).toBe(expected);
  });
});

describe("compareBrackets", () => {
  it("should correctly compare brackets and return unique ones", () => {
    const brackets = ["¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"];
    const expected = ["bc", "a¬b", "a¬c", "ac", "ab"];
    expect(compareBrackets(brackets)).toEqual(expected);
  });
});

describe("checkCompareBrackets", () => {
  it("should correctly check and filter implicants based on comparison", () => {
    const implicants = ["bc", "a", "ac"];
    const expected = {
      checkedImplicants: { bc: "a ∨ a", a: "bc ∨ c", ac: "b" },
      checkedArray: ["bc", "a"],
    };
    expect(checkCompareBrackets(implicants)).toEqual(expected);
  });
});

describe("getTable", () => {
  it("should correctly create a table based on brackets comparison", () => {
    const strFromBrackets = ["¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"];
    const equalElFromBrackets = ["bc", "a"];
    const expected = [
      ["", "Конституэнты"],
      ["", "¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"],
      ["bc", 1, 0, 0, 0, 1],
      ["a", 0, 1, 1, 1, 1],
    ];
    expect(getTable(strFromBrackets, equalElFromBrackets)).toEqual(expected);
  });
});

describe("checkTableImplicants", () => {
  it("should correctly check table and return right implicants", () => {
    const table = [
      ["", "Конституэнты"],
      ["", "¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"],
      ["bc", 1, 0, 0, 0, 1],
      ["a", 0, 1, 1, 1, 1],
    ];
    const expected = ["bc", "a"];
    expect(checkTableImplicants(table)).toEqual(expected);
  });
});

describe("replaceStr", () => {
  it("should correctly replace negation symbols with 0 and others with 1", () => {
    const strFromBrackets = ["¬bc", "¬c"];
    const expected = ["01", "0"];
    expect(replaceStr(strFromBrackets)).toEqual(expected);
  });
});

describe("carnoTable", () => {
  it("should correctly create Carno table based on replaced strings", () => {
    const strFromBrackets = ["¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"];
    const expected = [
      ["a/bc", "00", "01", "11", "10"],
      ["0", 0, 0, 1, 0],
      ["1", 1, 1, 1, 1],
    ];
    expect(carnoTable(strFromBrackets)).toEqual(expected);
  });
});

describe("calcMethod", () => {
  it("should correctly calculate the simplified equation", () => {
    const equation = "(¬abc) ∨ (a¬b¬c) ∨ (a¬bc) ∨ (ab¬c) ∨ (abc)";
    const expected = {
      equation: equation,
      simplifiedEquation: ["¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"],
      guildingStage: ["bc", "a¬b", "a¬c", "ac", "ab"],
      arrayToCheck: ["bc", "a"],
      resultStage: {
        checkedImplicants: { bc: "a", a: "bc" },
        checkedArray: ["bc", "a"],
      },
    };
    expect(calcMethod(equation)).toEqual(expected);
  });
});

describe("tableMethod", () => {
  it("should correctly generate the table and find right implicants", () => {
    const equation = "(¬abc) ∨ (a¬b¬c) ∨ (a¬bc) ∨ (ab¬c) ∨ (abc)";
    const expected = {
      table: [
        ["", "Конституэнты"],
        ["", "¬abc", "a¬b¬c", "a¬bc", "ab¬c", "abc"],
        ["bc", 1, 0, 0, 0, 1],
        ["a", 0, 1, 1, 1, 1],
      ],
      rightImplicants: ["bc", "a"],
    };
    expect(tableMethod(equation)).toEqual(expected);
  });
});

describe("carnoMethod", () => {
  it("should correctly generate the Carno table and result implicants", () => {
    const equation = "(¬abc) ∨ (a¬b¬c) ∨ (a¬bc) ∨ (ab¬c) ∨ (abc)";
    const expected = {
      carnoTable: [
        ["a/bc", "00", "01", "11", "10"],
        ["0", 0, 0, 1, 0],
        ["1", 1, 1, 1, 1],
      ],
      resultImplicants: ["bc", "a"],
    };
    expect(carnoMethod(equation)).toEqual(expected);
  });
});
