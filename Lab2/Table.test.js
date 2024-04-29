const {
  order,
  tableStr,
  action,
  tableTruelness,
  sknf_sdnf,
  numberForm,
  toNormal,
  indexForm,
} = require("./Lab2");

describe("Logical Expressions Functions", () => {
  describe("order", () => {
    it("should correctly order logical expressions", () => {
      expect(order("a->(b&(!c))")).toBe("abc!&->");
    });
  });

  describe("tableStr", () => {
    it("should correctly convert logical expression to string", () => {
      expect(tableStr("abc!&->")).toBe("a b c !c b&!c a->b&!c");
    });
  });

  describe("action", () => {
    it("should perform logical action correctly", () => {
      expect(action("000!&->")).toBe("0 0 0  1    0      1");
    });
  });

  describe("tableTruelness", () => {
    it("should correctly generate truth table", () => {
      const expr = "a->(b&(!c))";
      const result = tableTruelness(order(expr));
      expect(result).toHaveLength(8);
      expect(result).toContainEqual(
        "0 0 0  1    0      1",
        "0 0 1  0    0      1",
        "0 1 0  1    1      1",
        "0 1 1  0    0      1",
        "1 0 0  1    0      0",
        "1 0 1  0    0      0",
        "1 1 0  1    1      1",
        "1 1 1  0    0      0"
      );
    });
  });

  describe("sknf_sdnf", () => {
    it("should correctly generate SKNF and SDNF", () => {
      const expr = "a->(b&(!c))";
      const orderedExpr = order(expr);
      const truenessTable = tableTruelness(orderedExpr);
      const result = sknf_sdnf(orderedExpr, truenessTable);
      expect(result).toStrictEqual([
        "!a!b!c || !a!bc || !ab!c || !abc || ab!c",
        "(a|!b|!c) (a|!b|c) (a|b|c) ",
      ]);
    });
  });

  describe("numberForm", () => {
    it("should correctly generate number form", () => {
      const expr = "a->(b&(!c))";
      const orderedExpr = order(expr);
      const truenessTable = tableTruelness(orderedExpr);
      const result = numberForm(truenessTable);
      expect(result).toStrictEqual([
        [0, 1, 2, 3, 6],
        [4, 5, 7],
      ]);
    });
  });

  describe("toNormal", () => {
    it("should correctly convert binary to normal", () => {
      const binary = "1101";
      const result = toNormal(binary);
      expect(result).toBe(13);
    });
  });

  describe("indexForm", () => {
    it("should correctly generate index form", () => {
      const expr = "a->(b&(!c))";
      const orderedExpr = order(expr);
      const truenessTable = tableTruelness(orderedExpr);
      const result = indexForm(truenessTable);
      expect(result).toBe(242);
    });
  });
});
