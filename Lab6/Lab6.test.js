const { balancedTree, HashTable } = require('./Lab6');

describe("HashTable", () => {
  let dict;
  let tree;

  beforeEach(() => {
    dict = new HashTable();
    tree = new balancedTree();
    tree.insert(10, "Node 10");
    tree.insert(15, "Node 15");
    tree.insert(20, "Node 20");
  });

  it("should correctly add elements to the hash table", () => {
    dict.add_el("Ден");
    dict.add_el("Кан");
    dict.add_el("Мес");
    expect(dict.store.filter(Boolean).length).toBe(3);
  });

 it("should correctly search for an element in the hash table", () => {
    dict.add_el("Ден");
    dict.add_el("Кан");
    const result = dict.search("Ден");
    expect(result).toEqual({ hash: 2329, data: ["Ден", "V: 137", "id 1"] });
});

  it("should correctly remove an element from the hash table", () => {
    dict.add_el("Ден");
    dict.add_el("Кан");
    dict.remove("Ден");
    expect(dict.store.filter(Boolean).length).toBe(1);
  });

  it("should correctly update an element in the hash table", () => {
    dict.add_el("Ден");
    dict.add_el("Мес");
    dict.update("Кан", "Денис");
    expect(dict.search("Кан")).toBe(null);
    expect(dict.search("Денис")).not.toBe(null);
  });

  it("should correctly view the contents of the hash table", () => {
    const consoleSpy = jest.spyOn(console, 'log');

    dict.add_el("Ден");
    dict.add_el("Кан");
    dict.add_el("Мес");

    dict.view();

    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
});

it("should correctly update an existing element", () => {
    dict.add_el("Ден");
    dict.add_el("Мес");
    dict.update("Ден", "Денис");
    const updatedElement = dict.search("Денис");
    expect(updatedElement).not.toBeNull();
    expect(updatedElement.data).toContain("Денис");
  });

  it("should correctly update the indexes after removal", () => {
    dict.add_el("Ден");
    dict.add_el("Кан");
    dict.add_el("Мес");
    
    dict.remove("Кан");

    const store = dict.store;
    let id = 1;
    let isUpdated = true;

    for (let i = 0; i < store.length; i++) {
        if (store[i] && store[i].data[2] !== `id ${id}`) {
            isUpdated = false;
            break;
        }
        if (store[i]) id++;
    }

    expect(isUpdated).toBe(true);
});
it("should correctly balance the tree", () => {
    tree.balance(tree.root);

    expect(tree.root.hash).toBe(15);
    expect(tree.root.left.hash).toBe(10);
    expect(tree.root.right.hash).toBe(20);
});
});
