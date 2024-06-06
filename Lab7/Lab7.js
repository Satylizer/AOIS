function binarySum(bin1, bin2) {
    let result = "";
    let carry = 0;

    let i = bin1.length - 1;
    let j = bin2.length - 1;
    while (i >= 0 || j >= 0 || carry > 0) {

        let digit1 = i >= 0 ? parseInt(bin1[i]) : 0;
        let digit2 = j >= 0 ? parseInt(bin2[j]) : 0;
        
        let sum = digit1 + digit2 + carry;
        
        let currentBit = sum % 2;
        carry = Math.floor(sum / 2);
        
        result = currentBit + result;
        
        i--;
        j--;
    }
    
    return result;
}

class DiagonalTable {
    constructor() {
        this.table = [
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0],
            [0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
            [0, 0, 0, 0, 0, 1, 1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1],
            [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
    }

    printTable() {
        let output = "";
        for (let i = 0; i < this.table.length; i++) {
            for (let j = 0; j < this.table[i].length; j++) {
                output += this.table[i][j] + " ";
            }
            output += "\n";
        }
        return output;
    }
    

    getWord(wordNum) {
        let result = [];
        let i = wordNum;

        while(result.length !== 16) {
            result.push(this.table[i][wordNum]);
            if(i === 15) {
                i = 0;
            } else i++;
        }
        
        return 0 <= wordNum <= 15 ? result : "";
    }

    setWord(newWord, wordNum) {
        let i = wordNum;
        let j = 0;

        while(j !== 16) {
            this.table[i][wordNum] = newWord[j];
            if(i === 15) {
                i = 0;
            } else {
                i++;
                j++;
            }
        }

        return this.table;
    }

    getAddressColumn(columnNum) {
        let result = [];
        let i = columnNum;
        let j = 0;

        while(result.length !== 16) {
            result.push(this.table[i][j]);

            if(i === 15) {
                i = 0;
                j++;
            } else {
                i++;
                j++;
            }
        }

        return 0 <= columnNum <= 15 ? result : "";
    }

    f1Const0(wordNum) {
        return this.setWord(new Array(16).fill(0), wordNum);
    }

    f15Const1(wordNum) {
        return this.setWord(new Array(16).fill(1), wordNum);
    }

    f5RepeatSecArg(wordNum) {
        const findedWord = this.getWord(wordNum);
    
        let newWord = [];
    
        for (let i = 0; i < 16; i += 4) {
            newWord.push(findedWord[i]);
            newWord.push(findedWord[i + 1]);
            newWord.push(findedWord[i + 2]);
            newWord.push(findedWord[i + 1]);
        }
    
        return this.setWord(newWord, wordNum);
    }    

    f10NegationSecArg(wordNum) {
        const findedWord = this.getWord(wordNum);

        let newWord = [];
    
        for (let i = 0; i < 16; i++) {
            
            if(findedWord[i] === 1) {
                newWord.push(0)
            } else newWord.push(1)
        }
    
        return this.setWord(newWord, wordNum);

    }

    addFields(key) {
        let rightWords = {words: [], ind: []};

        for (let i = 0; i < 16; i++) {
            let findedWord = this.getWord(i);
            let wordKey = findedWord.slice(0,3);

            if(key == wordKey.join("")) {
                rightWords.words.push(findedWord);
                rightWords.ind.push(i);
            }
        }

        rightWords.words = rightWords.words.map(word => {
            let result = "";
            const A = word.slice(3,7).join("");
            const B = word.slice(7,11).join("");
            result += binarySum(A,B);
            while(result.length < 5) {
            result = "0" + result;
            }
            
            const newWord = [...word.slice(0,11)]

            result.split("").forEach(el => {
                newWord.push(parseInt(el))
            })

            return newWord;
        })

        rightWords.words.forEach((word,index) => {
            this.setWord(word, rightWords.ind[index])
        })

        return rightWords;
    }

    searchMatchingRecords(searchArgument) {
        let maxMatchCount = 0;
        let matchingRecords = [];
    
        for (let i = 0; i < 16; i++) {
            const record = table.getWord(i);
            let matchCount = 0;
    
            for (let j = 0; j < 16; j++) {
                if (record[j] === searchArgument[j]) {
                    matchCount++;
                }
            }
    
            if (matchCount > maxMatchCount) {
                maxMatchCount = matchCount;
                matchingRecords = [record];
            } else if (matchCount === maxMatchCount) {
                matchingRecords.push(record);
            }
        }
    
        return matchingRecords;
    }
}


const table = new DiagonalTable();
// console.log(table.getWord(2));
// console.log(table.getAddressColumn(3));
// console.log(table.printTable());
// table.f1Const0(4)
// console.log(table.printTable());
// console.log(table.addFields(111));
// console.log(table.printTable());
const searchArgument = [1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0];
console.log(table.searchMatchingRecords(searchArgument));

module.exports = {
    DiagonalTable,
    binarySum,
};
