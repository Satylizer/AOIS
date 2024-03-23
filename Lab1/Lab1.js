class Binary {
  constructor(val1, val2) {
    this.x = val1;
    this.y = val2;
    this.binX = this.toStraightBinary(val1);
    this.binY = this.toStraightBinary(val2);
    this.binReverseX = this.toReverseBinary(val1);
    this.binReverseY = this.toReverseBinary(val2);
    this.binAddithionalX = this.toAddithionalBinary(val1);
    this.binAddithionalY = this.toAddithionalBinary(val2);
  }

  toStraightBinary(val) {
    let i = 0,
      counter = 0,
      bin = 0;

    const valAbs = Math.abs(val);

    while (counter !== valAbs) {
      const current = Math.pow(2, i);

      if (counter + current > valAbs) {
        bin += Math.pow(10, i - 1);
        counter += Math.pow(2, i - 1);
        i = -1;
      } else if (counter + current === valAbs) {
        bin += Math.pow(10, i);
        break;
      }

      i++;
    }

    while (bin.length !== 7) {
      if (bin.length > 7) break;
      bin = "0" + bin;
    }
    return (bin = (val < 0 ? "1 " : "0 ") + bin);
  }

  toReverseBinary(val) {
    if (val > 0) return this.toStraightBinary(val);
    return (
      "1 " +
      this.toStraightBinary(Math.abs(val))
        .toString()
        .split(" ")[1]
        .split("")
        .map((el) => (el == "0" ? "1" : "0"))
        .join("")
    );
  }

  toAddithionalBinary(val) {
    if (val === 0) return -1;
    let reversed = this.toReverseBinary(val);
    if (reversed.split(" ")[1].split("")[reversed.length - 3] == 1 && val < 0) {
      reversed = this.toReverseBinary(val + 1);
    } else {
      reversed = reversed.slice(0, -1) + "1";
    }
    return (val < 0 ? "1" : "0") + reversed.toString().slice(1);
  }

  toPointBinary(val) {
    if (val % 1 === 0) return 0;

    const intPart = this.toStraightBinary(Math.trunc(val));
    let flPart = Math.abs(val % 1);
    let mantissa = [];

    let iterations = 0;
    const maxIterations = 22;

    while (iterations < maxIterations) {
      flPart *= 2;
      mantissa.push(Math.floor(flPart));
      flPart -= Math.floor(flPart);
      iterations++;
    }

    const binRepr = intPart + "." + mantissa.join("");

    return binRepr;
  }

  toPointBinaryFeee(val) {
    const binRepr = this.toPointBinary(val);

    const exponent = binRepr.indexOf(".") - binRepr.indexOf(1) - 1;

    const mantissa = binRepr
      .replace(".", "")
      .slice(binRepr.indexOf(1) + 1, binRepr.length - exponent);

    const biasExp = exponent + 127;

    const binExp = this.toStraightBinary(biasExp);

    return {
      bin: (val < 0 ? "1 " : "0 ") + binExp.slice(3) + mantissa,
      exp: exponent,
    };
  }

  sumReverseBinary(a, b) {
    if (-a === b || a === -b) {
      return "0 0000000";
    }

    let binA = 0,
      binB = 0,
      fl = false;

    const expDif = Math.abs(a.exp - b.exp);

    if (typeof a === "number" && typeof b === "number") {
      (binA = this.toReverseBinary(a).split(" ")[1]),
        (binB = this.toReverseBinary(b).split(" ")[1]);
    } else {
      binA = a.bin.split(" ")[1];
      binB = b.bin.split(" ")[1];

      if (a.exp < b.exp) {
        binA =
          "0".repeat(expDif + 7) +
          "1" +
          binA.substring(8, binA.length - expDif);
      } else if (b.exp < a.exp) {
        binB =
          "0".repeat(expDif + 7) +
          "1" +
          binB.substring(8, binB.length - expDif);
      }

      fl = true;
    }

    const arr = binA
      .split("")
      .reverse()
      .map(
        (el, i) => (el = parseInt(el) + parseInt(binB[binB.length - i - 1]))
      );

    for (let i = 0; i < arr.length; i++) {
      if (arr[i] > 1) {
        arr[i] -= 2;
        if (i + 1 === arr.length && fl === false) {
          i = -1;
          arr[0] += 1;
          continue;
        } else if (i === arr.length - 1 && fl === true) {
          arr[i] = 1;
          break;
        }
        arr[i + 1] += 1;
      }
    }

    return a + b < 0
      ? "1 " +
          arr
            .reverse()
            .map((el) => (el == "0" ? "1" : "0"))
            .join("")
      : "0 " + arr.reverse().join("");
  }

  substract(a, b) {
    b = -b;
    return this.sumReverseBinary(a, b);
  }

  addArr(arr) {
    if (!arr || arr.length === 0) return -1;
    const maxLength = Math.max(...arr.map((num) => num.length));
    let result = "",
      counter = 0;
    for (let i = 1; i <= maxLength; i++) {
      let sum = counter;
      for (const binNum of arr) {
        const digit = binNum[binNum.length - i]
          ? parseInt(binNum[binNum.length - i])
          : 0;
        sum += digit;
      }
      result = (sum % 2) + result;
      counter = Math.floor(sum / 2);
    }
    if (counter === 1) {
      result = "1" + result;
    }
    result = result.split("").splice(result.indexOf(1), result.length - 1);
    while (result.length !== 7) {
      result.unshift("0");
    }
    return result.join("");
  }

  multiplyBinary(a, b) {
    let counter = 0,
      result = [];
    for (let i = b.length - 1; i >= 2; i--) {
      let sum = [];
      for (let j = a.length - 1; j >= 2; j--) {
        sum.unshift(a[j] * b[i]);
      }
      for (let j = 0; j < counter; j++) {
        sum.push("0");
      }
      result.push(sum.join(""));
      counter++;
    }
    return (
      (parseInt(a[0]) + parseInt(b[0]) == 1 ? "1 " : "0 ") + this.addArr(result)
    );
  }

  separateBinary(a, b) {
    const fullA = this.toStraightBinary(a),
      fullB = this.toStraightBinary(b);

    const sign =
      parseInt(fullA.charAt(0)) + parseInt(fullB.charAt(0)) === 1 ? "1 " : "0 ";

    let binPartA = String(parseInt(fullA.substring(2))),
      binPartB = String(parseInt(fullB.substring(2)));

    while (binPartA.length < binPartB.length) {
      binPartA = "0" + binPartA;
    }

    const iterations = binPartA.length + 5;

    let count = binPartA.substring(0, binPartB.length - 1),
      res = "";

    for (let i = binPartB.length - 1; i < iterations; i++) {
      if (i < binPartA.length) {
        count += binPartA[i];
      } else {
        count = count + "0";
      }

      if (i < iterations) {
        if (this.toNormal(count) >= this.toNormal(binPartB)) {
          res += "1";
          count = parseInt(
            this.substract(this.toNormal(count), b).substring(2)
          ).toString();
        } else {
          res += "0";
        }
      }

      if (i >= iterations - 6 && parseInt(count) === 0) {
        break;
      } else if (i === iterations - 6 && parseInt(count) !== 0) {
        res += ".";
      }
    }

    if (res.includes(".")) {
      while (res.split(".")[0].length < 7) {
        res = "0" + res;
      }
    } else {
      while (res.length < 7) {
        res = "0" + res;
      }
    }

    return sign + res;
  }

  toNormal(bin) {
    bin = bin.toString().split("").reverse().join("");
    let res = 0;
    for (let i = 0; i < bin.length; i++) {
      if (parseInt(bin[i]) === 1) res += Math.pow(2, i);
    }
    return res;
  }
}

const bin = new Binary(3, -5);
console.log(
  bin,
  "\n",
  bin.toPointBinaryFeee(22.5),
  "\n",
  bin.toPointBinaryFeee(4.25),
  "\n",
  bin.sumReverseBinary(bin.toPointBinaryFeee(22.5), bin.toPointBinaryFeee(4.25))
);

module.exports = Binary;
