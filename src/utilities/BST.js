class TreeNode {
    constructor(key, board) {
        this.key = key;
        this.board = board;
        this.left = null;
        this.right = null;
    }
}

class BST {
    constructor() {
        this.root = null;
    }

    insert(key, board) {
        const newNode = new TreeNode(key, board);
        if (!this.root) {
            this.root = newNode;
            return;
        }
        let current = this.root;
        while (true) {
            if (key < current.key) {
                if (!current.left) {
                    current.left = newNode;
                    return;
                }
                current = current.left;
            } else {
                if (!current.right) {
                    current.right = newNode;
                    return;
                }
                current = current.right;
            }
        }
    }

    search(query) {
        let current = this.root;
        let results = [];
        query = query.toLowerCase();

        while (current) {
            if (current.key.includes(query)) {
                results.push(current.board);
            }
            if (query < current.key) {
                current = current.left;
            } else {
                current = current.right;
            }
        }
        return results;
    }
}

export default BST;
