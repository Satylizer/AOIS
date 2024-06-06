function generateTetrads() {
  const data = [];
  for (let i = 0; i <= 9; i++) {
    const binaryString = i.toString(2).padStart(8, "0");
    data.push(binaryString);
  }
  return data;
}

class Tetrads {
  constructor() {
    this.data = generateTetrads();
  }

  addNumber(n) {
    if (n < 1 || n > 9) {
      throw new Error("Число должно быть от 1 до 9");
    }

    this.data.forEach((tetrad, index) => {
      const sum = parseInt(tetrad, 2) + n;
      let secondPart = tetrad.substring(4);

      if (sum > 9) {
        let firstPart = ("0".repeat(3) + "1").padStart(4, "0");
        secondPart = (sum - 10).toString(2).padStart(4, "0");
        this.data[index] = firstPart + secondPart;
      } else {
        this.data[index] = sum.toString(2).padStart(8, "0");
      }
    });
  }

  print() {
    const newData = this.data.map((value) => {
      const firstPart = value.substring(0, 4);
      const secondPart = value.substring(4);
      return `${firstPart} | ${secondPart}`;
    });
    console.table(newData);
  }
}

module.exports = { Tetrads };
