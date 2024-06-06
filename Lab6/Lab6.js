class TreeNode {
  constructor(hash, data) {
    this.hash = hash;
    this.dataList = [{ data: data, next: null }];
    this.left = null;
    this.right = null;
    this.height = 1;
  }
}

class balancedTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  updateHeight(node) {
    node.height =
      Math.max(this.getHeight(node.left), this.getHeight(node.right)) + 1;
  }

    rotateLeft(node) {
      let newRoot = node.right;
      node.right = newRoot.left;
      newRoot.left = node;
      this.updateHeight(node);
      this.updateHeight(newRoot);
      return newRoot;
    }

    rotateRight(node) {
      let newRoot = node.left;
      node.left = newRoot.right;
      newRoot.right = node;
      this.updateHeight(node);
      this.updateHeight(newRoot);
      return newRoot;
    }

  balance(node) {
    if (!node) return node;

    this.updateHeight(node);

    if (this.getHeight(node.left) - this.getHeight(node.right) > 1) {

      if (this.getHeight(node.left.left) >= this.getHeight(node.left.right)) {
        node = this.rotateRight(node);
      } else {
        node.left = this.rotateLeft(node.left);
        node = this.rotateRight(node);
      }

    } else if (this.getHeight(node.right) - this.getHeight(node.left) > 1) {
      
      if (this.getHeight(node.right.right) >= this.getHeight(node.right.left)) {
        node = this.rotateLeft(node);
      } else {
        node.right = this.rotateRight(node.right);
        node = this.rotateLeft(node);
      }
    }

    return node;
  }

  insert(hash, data) {
    this.root = this._insert(this.root, hash, data);
  }

  _insert(node, hash, data) {
    if (!node) {
      return new TreeNode(hash, data);
    }

    if (hash < node.hash) {
      node.left = this._insert(node.left, hash, data);
    } else if (hash > node.hash) {
      node.right = this._insert(node.right, hash, data);
    } else {
      node.dataList.push({ data: data, next: null });
    }

    return this.balance(node);
  }

  printInOrder(node = this.root) {
    if (!node) return;
    this.printInOrder(node.left);
    console.log(
      `Hash: ${node.hash}, Data: ${JSON.stringify(
        node.dataList.map((item) => item.data)
      )}`
    );
    this.printInOrder(node.right);
  }

  search(name) {
    return this._search(this.root, name);
  }

  _search(node, name) {
    if (!node) {
      return null;
    }

    for (let i = 0; i < node.dataList.length; i++) {
      if (name === node.dataList[i].data[0]) {
        return { hash: node.hash, data: node.dataList[i].data };
      }
    }

    let leftResult = this._search(node.left, name);
    if (leftResult) {
      return leftResult;
    }

    let rightResult = this._search(node.right, name);
    if (rightResult) {
      return rightResult;
    }

    return null;
  }

  findMin(node) {
    while (node.left) {
      node = node.left;
    }
    return node;
  }

  remove(name) {
    this.root = this._remove(this.root, name);
  }

  _remove(node, name) {
    if (!node) {
      return null;
    }
  
    for (let i = 0; i < node.dataList.length; i++) {
      if (name === node.dataList[i].data[0]) {

        node.dataList.splice(i, 1);

        if (node.dataList.length === 0) {
          if (!node.left && !node.right) {
            return null;
          } else if (!node.left) {
            return node.right;
          } else if (!node.right) {
            return node.left;
          } else {
            let minRight = this.findMin(node.right);
            node.hash = minRight.hash;
            node.data = minRight.data;
            node.right = this._remove(node.right, minRight.data[0]);
          }
        }
      }
    }
  
    node.left = this._remove(node.left, name);
    node.right = this._remove(node.right, name);

    return this.balance(node);
  }
}

class HashTable {
  constructor() {
    this.tree = new balancedTree();
    this.store = new Array(20);
    this.alphabet_mapping = {
      'а': 0, 'б': 1, 'в': 2, 'г': 3, 'д': 4, 'е': 5, 'ё': 6, 'ж': 7, 'з': 8, 'и': 9, 'й': 10,
      'к': 11, 'л': 12, 'м': 13, 'н': 14, 'о': 15, 'п': 16, 'р': 17, 'с': 18, 'т': 19, 'у': 20,
      'ф': 21, 'х': 22, 'ц': 23, 'ч': 24, 'ш': 25, 'щ': 26, 'ъ': 27, 'ы': 28, 'ь': 29, 'э': 30, 'ю': 31, 'я': 32
    };
  }

  add_el(surname) {
    const getId = () => {
      let id = 0;
      for (let i = 0; i < this.store.length; i++) {
        if (this.store[i] !== undefined) {
          id++;
        }
      }
      return id;
    };
  
    let V =
      this.alphabet_mapping[surname.charAt(0).toLowerCase()] * Math.pow(33, 1) +
      this.alphabet_mapping[surname.charAt(1).toLowerCase()] * Math.pow(33, 0);
    let H = this.store.length;
    let B = getId();
    let h = V * (V % H);
    this.store[B] = {"hash": h, "data": [surname, `V: ${V}`, `id ${B + 1}`]};
    this.tree.insert(this.store[B].hash, this.store[B].data);
  }  

  viewStore() {
    return this.store;
  }

  view() {
    console.log(this.tree);
    return this.tree.printInOrder();
  }

  search(name) {
    const result = this.tree.search(name);
    if (result) {
      return { hash: result.hash, data: result.data };
    } else {
      console.log(`Не найдено такого имени`);
      return null;
    }
  }

  remove(name) {
    for (let i = 0; i < this.store.length; i++) {
         if (this.store[i] && this.store[i].data[0] === name) {
            delete this.store[i];
            this.updateIndexes();
            break;
         }
    }
    return this.tree.remove(name);
  }

  update(name1, name2) {
    this.remove(name1)
    this.add_el(name2);
    this.updateIndexes();
  }

  updateIndexes() {
    let id = 1;
    const newStore = new Array(this.store.length);
    let newIndex = 0;
    for (let i = 0; i < this.store.length; i++) {
      if (this.store[i]) {
        this.store[i].data[2] = `id ${id}`;
        newStore[newIndex] = this.store[i];
        id++;
        newIndex++;
      }
    }
    this.store = newStore;
  }
}

const dict = new HashTable();

dict.add_el("Ден");
dict.add_el("Ван");
dict.add_el("Дес");
dict.add_el("Дан");
dict.search("Ден");
console.log(dict.viewStore());
dict.view();


module.exports = { balancedTree, HashTable };