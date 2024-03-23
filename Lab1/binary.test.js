const Binary = require("./Lab1");

describe("Binary", () => {
  let bin;

  beforeEach(() => {
    bin = new Binary(3, -5);
  });

  it("should convert to straight binary", () => {
    expect(bin.binX).toBe("0 0000011");
    expect(bin.binY).toBe("1 0000101");
  });

  it("should convert to reverse binary", () => {
    expect(bin.binReverseX).toBe("0 0000011");
    expect(bin.binReverseY).toBe("1 1111010");
  });

  it("should convert to additional binary", () => {
    expect(bin.binAddithionalX).toBe("0 0000011");
    expect(bin.binAddithionalY).toBe("1 1111011");
  });

  it("should convert to point binary IEEE", () => {
    expect(bin.toPointBinaryFeee(22.5)).toEqual({
      bin: "0 1000001101101000000000000000000",
      exp: 4,
    });
  });

  it("should sum reverse binary", () => {
    expect(
      bin.sumReverseBinary(
        bin.toPointBinaryFeee(22.5),
        bin.toPointBinaryFeee(4.25)
      )
    ).toBe("0 1000001110101100000000000000000");
  });

  it("should sum reverse binary", () => {
    expect(
      bin.sumReverseBinary(22, -4)
    ).toBe("0 0010010");
  });

  it("should subtract", () => {
    expect(bin.substract(5, -3)).toBe("0 0001000");
  });

  it("should multiply binary", () => {
    expect(bin.multiplyBinary("0 0000011", "1 0000101")).toBe("1 0001111");
  });

  it("should separate binary", () => {
    expect(bin.separateBinary(8, 3)).toBe("0 0000010.10101");
  });

  it("should convert to normal", () => {
    expect(bin.toNormal("1101")).toBe(13);
  });
});
