每个节点最多只能有两个孩子的树

## 二叉树复习：

| 术语 | 中文 | 含义 |
| --- | --- | --- |
| Root | 根节点 | 最上面的节点 |
| Leaf | 叶子节点 | 没有孩子的节点 |
| Parent | 父节点 | 上一级节点 |
| Child | 子节点 | 下一级节点 |
| Sibling | 兄弟节点 | 拥有同一个父节点 |
| Edge | 边 | 节点之间的连接线 |

### 例子：

```text
        1
       /
      2
     /
    5
```

Depth of a node = 从 root 到这个 node 经过几条边
此处：
1 的 depth = 0
2 的 depth = 1
5 的 depth = 2
Height of a node = 从这个 node 到最深叶子节点经过几条边
此处：
5 的 height = 0
2 的 height = 1
1 的 height = 2

### 树的 height 的重要性

Tree operations are typically expressed in terms of h.
树的查找、插入、删除，时间复杂度通常和树高 h 有关
最坏情况下，一棵树可能退化成链表

## 二叉搜索树 BST

比二叉树多了一个排序规则：
Left subtree < Parent < Right subtree
整个左子树的所有值 < 当前节点 < 整个右子树的所有值
左子树的值都比父节点小，右子树的值都比父节点大，并且不允许重复 key。

### 搜索规则

查找值 x：
如果 x == 当前节点：找到了
如果 x < 当前节点：去左子树
如果 x > 当前节点：去右子树
如果走到 NULL：没找到
伪代码如下：
```cpp
Node* Search(Node* root, int x) {
    Node* curr = root;

    while (curr != NULL) {
        if (x == curr->data) {
            return curr;
        }
        else if (x < curr->data) {
            curr = curr->left;
        }
        else {
            curr = curr->right;
        }
    }

    return NULL;
}
```

## BST Traversal：二叉搜索树的遍历

NLR：Preorder  前序遍历
LNR：Inorder   中序遍历
LRN：Postorder 后序遍历
其中
N = 当前节点 Node
L = 左子树 Left subtree
R = 右子树 Right subtree

### Preorder：前序遍历 NLR

先访问自己，再访问左子树，最后访问右子树

### Inorder：中序遍历 LNR

先左子树，再自己，最后右子树

### Postorder：后序遍历 LRN

先左子树，再右子树，最后自己

## BST Insert：二叉搜索树插入节点。

```cpp
Node* Insert(Node* root, int x) //Node* root注意表述 
{
    if (root == NULL) {
        Node* newNode = new Node;
        newNode->data = x;
        newNode->left = NULL;
        newNode->right = NULL;
        return newNode;
    }

    if (x < root->data) {
        root->left = Insert(root->left, x);
    }//如果 x 更小，就把 x 插入到左子树里
    else if (x > root->data) {
        root->right = Insert(root->right, x);
    }//如果 x 更大，就把 x 插入到右子树里

    return root;
}
```

## BST Delete：二叉搜索树删除节点。

0 个孩子：直接删
1 个孩子：让孩子顶上来
2 个孩子：
方案 1：找右子树最小值
叫 inorder successor，后继节点
方案 2：找左子树最大值
叫 inorder predecessor，前驱节点
这里我们介绍：
找右子树最小值替换，再删除那个最小值

```cpp
Node* FindMin(Node* root) {
    while (root->left != NULL) {
        root = root->left;
    }

    return root;
}

Node* Delete(Node* root, int x) {
    if (root == NULL) {
        return NULL;
    }

    if (x < root->data) {
        root->left = Delete(root->left, x);
    }
    else if (x > root->data) {
        root->right = Delete(root->right, x);
    }
    else {
        // 找到要删除的节点

        // 情况 1：没有孩子
        if (root->left == NULL && root->right == NULL) {
            delete root;
            return NULL;
        }

        // 情况 2：只有右孩子
        else if (root->left == NULL) {
            Node* temp = root->right;
            delete root;
            return temp;
        }

        // 情况 2：只有左孩子
        else if (root->right == NULL) {
            Node* temp = root->left;
            delete root;
            return temp;
        }

        // 情况 3：有两个孩子
        else {
            Node* successor = FindMin(root->right);
            root->data = successor->data;
            root->right = Delete(root->right, successor->data);
        }
    }

    return root;
}
```

### 两个孩子情况例子：

假设我们要删除 50：
```text
        50
       /  \
     30    70
          /  \
         60   80
```

Node* successor = FindMin(root->right);
successor 指向 60

root->data = successor->data;
把 60 的值复制到 50 的位置

root->right = Delete(root->right, successor->data);
去右子树里面，把原来的 60 删除掉

## Balanced Search Trees / AVL Tree 平衡搜索树

插入顺序很差，它会退化成链表。

### 例：

依次插入：
2, 4, 6, 8, 10, 12
普通 BST 会变成
```text
2
 \
  4
   \
    6
     \
      8
       \
        10
          \
           12
```

查找由(log N)退化为O(N)

AVL Tree是Binary Search Tree的基础上额外要求每个节点的左子树高度和右子树高度最多相差 1，即| left height - right height | <= 1

## rotation 旋转

注意，旋转对象永远是N

### 1.	右旋 Right Rotation

```cpp
Node* rotateRight(Node* nodeN) {
    Node* nodeC = nodeN->left;

    nodeN->left = nodeC->right;
    nodeC->right = nodeN;

    return nodeC;
}
```

#### 举例：

```text
        30  ← nodeN
       /
     20    ← nodeC
    /  \
  10    25
```

左左型 LL，左边太重。
右旋后：
```text
      20
     /  \
   10    30
        /
       25
```

把25拆掉，进行旋转，然后放在30的左边。
即把nodeC的右子叶拆掉，对三者变换后放在变换后的树的右节点的左子叶

### 2. 左旋 Left Rotation

```cpp
Node* rotateLeft(Node* nodeN) {
    Node* nodeC = nodeN->right;

    nodeN->right = nodeC->left;
    nodeC->left = nodeN;

    return nodeC;
}
```

右右型 RR，右边太重。
```text
      10  ← nodeN
        \
        20  ← nodeC
       /  \
     15    30
```

左旋后：
```text
      20
     /  \
   10    30
     \
     15
```

把15拆掉，然后进行旋转，15放在N的右边。
即把nodeC的左子叶拆掉，对三者变换后放在变换后的树的左节点的右子叶

### 口诀：

左旋是右右，右旋是左左。
左旋后放在左边的右边。
右旋后放在右边的左边。

## 双旋 Double Rotation

LR 型：先左旋，再右旋
RL 型：先右旋，再左旋

### 1.	LR 型：Left-Right Rotation

```cpp
Node* rotateLeftRight(Node* nodeN)
{
    nodeN->left = rotateLeft(nodeN->left);//对左孩子左旋
    return rotateRight(nodeN);//对 nodeN 右旋
}
```

#### 例：

#### 插入顺序：

30, 10, 20
普通 BST 会变成：
```text
      30
     /
   10
     \
     20
```

这个形状叫：
Left-Right
左边的右边太重
也就是：
nodeN = 30
nodeC = 10
new node = 20

正确做法是两步：
先对 10 左旋
再对 30 右旋

原来：
```text
      30
     /
   10
     \
     20
```

先对 10 做左旋：
```text
      30
     /
   20
  /
10
```

对 30 右旋：
```text
     20
    /  \
  10    30
```

为什么不能直接右旋？
```text
      10
        \
        30
       /
      20
```

结构不自然。

### 2.	RL 型：Right-Left Rotation

```cpp
Node* rotateRightLeft(Node* nodeN) 
{
    nodeN->right = rotateRight(nodeN->right);
    return rotateLeft(nodeN);
}
```

#### 例：

#### 插入顺序：

10, 30, 20
普通 BST 会变成：
```text
10
  \
   30
   /
 20
```

这个叫：
Right-Left
右边的左边太重

第一步：对右孩子右旋
原来：
```text
10
  \
   30
   /
 20
```

先对 30 右旋：
```text
10
  \
   20
     \
     30
```

第二步：对 nodeN 左旋
现在：
```text
10
  \
   20
     \
     30
```

这是 RR 型。
所以对 10 左旋：
```text
     20
    /  \
  10    30
```

### 口诀：

单边歪：一次旋转
折线歪：两次旋转

左边的右边重，先左旋，再右旋。
右边的左边重，先右旋，再左旋。

## AVL 插入时如何判断 LL / RR / LR / RL?

 判断条件：
1. balance factor
2. 新插入的值 x 在哪一边
模板：
```cpp
#include <iostream>
#include <algorithm>
using namespace std;

class Node {
public:
    int data;
    Node* left;
    Node* right;
    int height;

    Node(int x) {
        data = x;
        left = NULL;
        right = NULL;
        height = 1;
    }
};

class AVLTree {
private:
    Node* root;

public:
    AVLTree() {
        root = NULL;
    }

    // 获取节点高度
    int getHeight(Node* node) {
        if (node == NULL) {
            return 0;
        }
        return node->height;
    }

    // 更新节点高度
    void updateHeight(Node* node) {
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    }

    // 计算 balance factor
    // balance > 1：左子树太高
    // balance < -1：右子树太高
    int getBalance(Node* node) {
        if (node == NULL) {
            return 0;
        }
        return getHeight(node->left) - getHeight(node->right);
    }

    // 这里只写函数声明，不写具体旋转代码
    Node* rotateRight(Node* nodeN);
    Node* rotateLeft(Node* nodeN);

    // AVL 插入
    Node* insert(Node* node, int x) {
        // 1. 普通 BST 插入
        if (node == NULL) {
            return new Node(x);
        }

        if (x < node->data) {
            node->left = insert(node->left, x);
        }
        else if (x > node->data) {
            node->right = insert(node->right, x);
        }
        else {
            // 不允许重复值
            return node;
        }

        // 2. 更新高度
        updateHeight(node);

        // 3. 计算平衡因子
        int balance = getBalance(node);

        // 4. 根据 balance 判断四种情况

        // LL 型：左边的左边太重，右旋
        if (balance > 1 && x < node->left->data) {
            return rotateRight(node);
        }

        // RR 型：右边的右边太重，左旋
        if (balance < -1 && x > node->right->data) {
            return rotateLeft(node);
        }

        // LR 型：左边的右边太重，先左旋左孩子，再右旋自己
        if (balance > 1 && x > node->left->data) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }

        // RL 型：右边的左边太重，先右旋右孩子，再左旋自己
        if (balance < -1 && x < node->right->data) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }

        // 没有失衡，直接返回当前节点
        return node;
    }

    // 对外插入接口
    void insert(int x) {
        root = insert(root, x); //因为每次插入所有的节点的Hight都要更新
    }
};
```

## AVL完整模板：

```cpp
#include <iostream>
#include <algorithm>
using namespace std;

class Node {
public:
    int data;
    Node* left;
    Node* right;
    int height;

    Node(int x) {
        data = x;
        left = NULL;
        right = NULL;
        height = 1;
    }
};

class AVLTree {
private:
    Node* root;

public:
    AVLTree() {
        root = NULL;
    }

    // 获取节点高度
    int getHeight(Node* node) {
        if (node == NULL) {
            return 0;
        }
        return node->height;
    }

    // 更新节点高度
    void updateHeight(Node* node) {
        node->height = 1 + max(getHeight(node->left), getHeight(node->right));
    }

    // 计算 balance factor
    // balance > 1：左子树太高
    // balance < -1：右子树太高
    int getBalance(Node* node) {
        if (node == NULL) {
            return 0;
        }
        return getHeight(node->left) - getHeight(node->right);
    }

    /*
        右旋 Right Rotation

              nodeN
              /
           nodeC
             \
             T2

        右旋后：

            nodeC
               \
               nodeN
               /
              T2
    */
    Node* rotateRight(Node* nodeN) {
        Node* nodeC = nodeN->left;
        Node* T2 = nodeC->right;

        // 左孩子上位
        nodeC->right = nodeN;

        // nodeC 原来的右子树交给 nodeN 的左边
        nodeN->left = T2;

        // 先更新下面的 nodeN，再更新上面的 nodeC
        updateHeight(nodeN);
        updateHeight(nodeC);

        // 返回新的根
        return nodeC;
    }

    /*
        左旋 Left Rotation

            nodeN
                \
                nodeC
                /
               T2

        左旋后：

              nodeC
              /
           nodeN
              \
              T2
    */
    Node* rotateLeft(Node* nodeN) {
        Node* nodeC = nodeN->right;
        Node* T2 = nodeC->left;

        // 右孩子上位
        nodeC->left = nodeN;

        // nodeC 原来的左子树交给 nodeN 的右边
        nodeN->right = T2;

        // 先更新下面的 nodeN，再更新上面的 nodeC
        updateHeight(nodeN);
        updateHeight(nodeC);

        // 返回新的根
        return nodeC;
    }

    // AVL 插入
    Node* insert(Node* node, int x) {
        // 1. 普通 BST 插入
        if (node == NULL) {
            return new Node(x);
        }

        if (x < node->data) {
            node->left = insert(node->left, x);
        }
        else if (x > node->data) {
            node->right = insert(node->right, x);
        }
        else {
            // AVL 一般不允许重复值
            return node;
        }

        // 2. 更新当前节点高度
        updateHeight(node);

        // 3. 计算当前节点的 balance factor
        int balance = getBalance(node);

        // 4. 判断四种失衡情况

        // LL 型：左边的左边太重，右旋
        if (balance > 1 && x < node->left->data) {
            return rotateRight(node);
        }

        // RR 型：右边的右边太重，左旋
        if (balance < -1 && x > node->right->data) {
            return rotateLeft(node);
        }

        // LR 型：左边的右边太重，先左旋左孩子，再右旋自己
        if (balance > 1 && x > node->left->data) {
            node->left = rotateLeft(node->left);
            return rotateRight(node);
        }

        // RL 型：右边的左边太重，先右旋右孩子，再左旋自己
        if (balance < -1 && x < node->right->data) {
            node->right = rotateRight(node->right);
            return rotateLeft(node);
        }

        // 没有失衡，返回当前节点
        return node;
    }

    // 对外插入接口
    void insert(int x) {
        root = insert(root, x);
    } //因为每次插入所有的节点的Hight都要更新

    // 中序遍历：输出结果应为升序
    void inorder(Node* node) {
        if (node == NULL) {
            return;
        }

        inorder(node->left);
        cout << node->data << " ";
        inorder(node->right);
    }

    void display() {
        inorder(root);
        cout << endl;
    }
};

int main() {
    AVLTree tree;

    tree.insert(30);
    tree.insert(20);
    tree.insert(10);

    tree.display();

    return 0;
}
```

## updateHeight(node); 如何工作？

比如插入 10：
```text
      30
     /
   20
  /
10
```

递归插入结束后，程序会一层一层往回走。
先更新 20：
updateHeight(20);
得到：
20 的 height = 2
再更新 30：
updateHeight(30);
得到：
30 的 height = 3
然后才能算：
int balance = getBalance(node);
也就是：
balance = 左子树高度 - 右子树高度
AVL 正是通过这个高度差判断是否需要旋转；课件里也强调 AVL 的左右子树高度差最多只能是 1。

## AVL意义：

让 BST 高度保持在 O(log N)，避免最坏情况变成 O(N)。
