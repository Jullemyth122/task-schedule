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
        query = query.toLowerCase();
        const results = [];

        function traverse(node) {
            if (!node) return;
            // Check the current node
            if (node.key.includes(query)) {
            results.push(node.board);
            }
            // Recursively traverse the left and right subtrees
            traverse(node.left);
            traverse(node.right);
        }
        
        traverse(this.root);
        return results;
    }

}

export default BST;
