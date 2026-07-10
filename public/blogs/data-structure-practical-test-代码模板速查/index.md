# Data Structure Practical Test 代码模板速查

> 本模板只覆盖 Array、Recursion、Linked List。

## 0. 考试范围速记

Array:

- Find min or max
- Swap
- Find second max or min
- Recursion on array
- Frequency

Linked List:

- Create multiple nodes then link them
- Insert front, middle, end
- Delete front, middle, end
- Single linked list
- Doubly linked list
- Circular linked list

Recursion:

- Base case: 直接返回、停止递归
- Recursive case: 调用自己处理更小问题

通用 C++ 头部：

```cpp
#include <iostream>
using namespace std;
```

---

## 1. Array 模板

Array 题通常都需要 `arr[]` 和 `n`。除非题目明确允许 empty array，否则 practical 题一般默认 `n > 0`。下面的 min/max 模板不处理空数组；如果题目说数组可能为空，要先判断 `n <= 0`。

### 1.1 Min / Max

```cpp
int findMin(const int arr[], int n) {
    int minValue = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] < minValue) {
            minValue = arr[i];
        }
    }
    return minValue;
}

int findMax(const int arr[], int n) {
    int maxValue = arr[0];
    for (int i = 1; i < n; i++) {
        if (arr[i] > maxValue) {
            maxValue = arr[i];
        }
    }
    return maxValue;
}
```

### 1.2 Swap

```cpp
void swapValues(int &a, int &b) {
    int temp = a;
    a = b;
    b = temp;
}

void swapFirstAndLast(int arr[], int n) {
    if (n >= 2) {
        swapValues(arr[0], arr[n - 1]);
    }
}
```

### 1.3 Second Max / Second Min

这里默认是 second distinct value，也就是第二个不同的最大值或最小值。

```cpp
bool findSecondMax(const int arr[], int n, int &secondMax) {
    bool hasMax = false;
    bool hasSecond = false;
    int maxValue = 0;

    for (int i = 0; i < n; i++) {
        int x = arr[i];
        if (!hasMax || x > maxValue) {
            if (hasMax && x != maxValue) {
                secondMax = maxValue;
                hasSecond = true;
            }
            maxValue = x;
            hasMax = true;
        } else if (x < maxValue && (!hasSecond || x > secondMax)) {
            secondMax = x;
            hasSecond = true;
        }
    }

    return hasSecond;
}

bool findSecondMin(const int arr[], int n, int &secondMin) {
    bool hasMin = false;
    bool hasSecond = false;
    int minValue = 0;

    for (int i = 0; i < n; i++) {
        int x = arr[i];
        if (!hasMin || x < minValue) {
            if (hasMin && x != minValue) {
                secondMin = minValue;
                hasSecond = true;
            }
            minValue = x;
            hasMin = true;
        } else if (x > minValue && (!hasSecond || x < secondMin)) {
            secondMin = x;
            hasSecond = true;
        }
    }

    return hasSecond;
}
```

### 1.4 Frequency

```cpp
int countFrequency(const int arr[], int n, int target) {
    int count = 0;
    for (int i = 0; i < n; i++) {
        if (arr[i] == target) {
            count++;
        }
    }
    return count;
}

void printAllFrequencies(const int arr[], int n) {
    bool *visited = new bool[n];
    for (int i = 0; i < n; i++) {
        visited[i] = false;
    }

    for (int i = 0; i < n; i++) {
        if (visited[i]) {
            continue;
        }

        int count = 1;
        for (int j = i + 1; j < n; j++) {
            if (arr[j] == arr[i]) {
                visited[j] = true;
                count++;
            }
        }

        cout << arr[i] << " appears " << count << " times" << endl;
    }

    delete[] visited;
}
```

### 1.5 Array Recursion

```cpp
int recursiveSum(const int arr[], int n) {
    if (n == 0) {
        return 0;
    }
    return arr[n - 1] + recursiveSum(arr, n - 1);
}

int recursiveMax(const int arr[], int n) {
    if (n == 1) {
        return arr[0];
    }

    int previousMax = recursiveMax(arr, n - 1);
    if (arr[n - 1] > previousMax) {
        return arr[n - 1];
    }
    return previousMax;
}
```

---

## 2. Recursion 模板

递归函数先写 base case，再写 recursive case。每次 recursive call 必须让问题变小。

### 2.1 Factorial / Fibonacci / Power

```cpp
int factorial(int n) {
    if (n < 0) {
        return -1;
    }
    if (n <= 1) {
        return 1;
    }
    return n * factorial(n - 1);
}

int fibonacci(int n) {
    if (n < 0) {
        return -1;
    }
    if (n == 0) {
        return 0;
    }
    if (n == 1) {
        return 1;
    }
    return fibonacci(n - 1) + fibonacci(n - 2);
}

int power(int base, int exponent) {
    if (exponent < 0) {
        return 0;
    }
    if (exponent == 0) {
        return 1;
    }
    return base * power(base, exponent - 1);
}
```

### 2.2 Count Zero Digits

```cpp
int countZeroDigits(int n) {
    if (n < 0) {
        return countZeroDigits(-n);
    }
    if (n == 0) {
        return 1;
    }
    if (n < 10) {
        return 0;
    }

    int lastDigitIsZero = (n % 10 == 0) ? 1 : 0;
    return lastDigitIsZero + countZeroDigits(n / 10);
}
```

### 2.3 Binary Search

Binary search 只能用于 sorted array。

```cpp
int binarySearch(const int arr[], int left, int right, int target) {
    if (left > right) {
        return -1;
    }

    int middle = left + (right - left) / 2;
    if (arr[middle] == target) {
        return middle;
    }
    if (target < arr[middle]) {
        return binarySearch(arr, left, middle - 1, target);
    }
    return binarySearch(arr, middle + 1, right, target);
}
```

---

## 3. Single Linked List 模板

### 3.1 Node 和手动建链

```cpp
struct Node {
    int data;
    Node *next;
};

Node *createManualList() {
    Node *head = new Node;
    Node *second = new Node;
    Node *third = new Node;

    head->data = 10;
    head->next = second;

    second->data = 20;
    second->next = third;

    third->data = 30;
    third->next = nullptr;

    return head;
}

void printList(Node *head) {
    Node *current = head;
    while (current != nullptr) {
        cout << current->data << " ";
        current = current->next;
    }
    cout << endl;
}
```

### 3.2 Insert Front / Middle / End

```cpp
void insertFront(Node *&head, int value) {
    Node *newNode = new Node;
    newNode->data = value;
    newNode->next = head;
    head = newNode;
}

void insertEnd(Node *&head, int value) {
    Node *newNode = new Node;
    newNode->data = value;
    newNode->next = nullptr;

    if (head == nullptr) {
        head = newNode;
        return;
    }

    Node *current = head;
    while (current->next != nullptr) {
        current = current->next;
    }
    current->next = newNode;
}

bool insertAtPosition(Node *&head, int position, int value) {
    if (position < 1) {
        return false;
    }
    if (position == 1) {
        insertFront(head, value);
        return true;
    }

    Node *current = head;
    for (int i = 1; current != nullptr && i < position - 1; i++) {
        current = current->next;
    }
    if (current == nullptr) {
        return false;
    }

    Node *newNode = new Node;
    newNode->data = value;
    newNode->next = current->next;
    current->next = newNode;
    return true;
}
```

### 3.3 Delete Front / Middle / End

```cpp
bool deleteFront(Node *&head) {
    if (head == nullptr) {
        return false;
    }

    Node *oldHead = head;
    head = head->next;
    delete oldHead;
    return true;
}

bool deleteEnd(Node *&head) {
    if (head == nullptr) {
        return false;
    }
    if (head->next == nullptr) {
        delete head;
        head = nullptr;
        return true;
    }

    Node *current = head;
    while (current->next->next != nullptr) {
        current = current->next;
    }

    delete current->next;
    current->next = nullptr;
    return true;
}

bool deleteAtPosition(Node *&head, int position) {
    if (position < 1 || head == nullptr) {
        return false;
    }
    if (position == 1) {
        return deleteFront(head);
    }

    Node *current = head;
    for (int i = 1; current->next != nullptr && i < position - 1; i++) {
        current = current->next;
    }
    if (current->next == nullptr) {
        return false;
    }

    Node *nodeToDelete = current->next;
    current->next = nodeToDelete->next;
    delete nodeToDelete;
    return true;
}
```

---

## 4. Doubly Linked List 模板

Doubly linked list 多一个 `prev` pointer。修改节点时，要同时维护 `prev` 和 `next`。

```cpp
struct DNode {
    int data;
    DNode *prev;
    DNode *next;
};

void insertDFront(DNode *&head, int value) {
    DNode *newNode = new DNode;
    newNode->data = value;
    newNode->prev = nullptr;
    newNode->next = head;

    if (head != nullptr) {
        head->prev = newNode;
    }
    head = newNode;
}

void insertDEnd(DNode *&head, int value) {
    DNode *newNode = new DNode;
    newNode->data = value;
    newNode->prev = nullptr;
    newNode->next = nullptr;

    if (head == nullptr) {
        head = newNode;
        return;
    }

    DNode *current = head;
    while (current->next != nullptr) {
        current = current->next;
    }

    current->next = newNode;
    newNode->prev = current;
}

bool insertDAtPosition(DNode *&head, int position, int value) {
    if (position < 1) {
        return false;
    }
    if (position == 1) {
        insertDFront(head, value);
        return true;
    }

    DNode *current = head;
    for (int i = 1; current != nullptr && i < position - 1; i++) {
        current = current->next;
    }
    if (current == nullptr) {
        return false;
    }

    DNode *newNode = new DNode;
    newNode->data = value;
    newNode->prev = current;
    newNode->next = current->next;
    if (current->next != nullptr) {
        current->next->prev = newNode;
    }
    current->next = newNode;
    return true;
}

bool deleteDFront(DNode *&head) {
    if (head == nullptr) {
        return false;
    }

    DNode *oldHead = head;
    head = head->next;
    if (head != nullptr) {
        head->prev = nullptr;
    }
    delete oldHead;
    return true;
}

bool deleteDEnd(DNode *&head) {
    if (head == nullptr) {
        return false;
    }
    if (head->next == nullptr) {
        return deleteDFront(head);
    }

    DNode *current = head;
    while (current->next != nullptr) {
        current = current->next;
    }

    current->prev->next = nullptr;
    delete current;
    return true;
}

bool deleteDAtPosition(DNode *&head, int position) {
    if (position < 1 || head == nullptr) {
        return false;
    }

    DNode *current = head;
    for (int i = 1; current != nullptr && i < position; i++) {
        current = current->next;
    }
    if (current == nullptr) {
        return false;
    }

    if (current->prev != nullptr) {
        current->prev->next = current->next;
    } else {
        head = current->next;
    }
    if (current->next != nullptr) {
        current->next->prev = current->prev;
    }

    delete current;
    return true;
}
```

---

## 5. Circular Linked List 模板

Circular linked list 的最后一个 node 指回 `head`，遍历时不能用 `nullptr` 判断结束。

```cpp
struct CNode {
    int data;
    CNode *next;
};

void printCircular(CNode *head) {
    if (head == nullptr) {
        cout << endl;
        return;
    }

    CNode *current = head;
    do {
        cout << current->data << " ";
        current = current->next;
    } while (current != head);
    cout << endl;
}

void insertCircularFront(CNode *&head, int value) {
    CNode *newNode = new CNode;
    newNode->data = value;

    if (head == nullptr) {
        head = newNode;
        newNode->next = head;
        return;
    }

    CNode *last = head;
    while (last->next != head) {
        last = last->next;
    }

    newNode->next = head;
    last->next = newNode;
    head = newNode;
}

void insertCircularEnd(CNode *&head, int value) {
    CNode *newNode = new CNode;
    newNode->data = value;

    if (head == nullptr) {
        head = newNode;
        newNode->next = head;
        return;
    }

    CNode *last = head;
    while (last->next != head) {
        last = last->next;
    }

    newNode->next = head;
    last->next = newNode;
}

bool insertCircularAtPosition(CNode *&head, int position, int value) {
    if (position < 1) {
        return false;
    }
    if (position == 1) {
        insertCircularFront(head, value);
        return true;
    }
    if (head == nullptr) {
        return false;
    }

    CNode *current = head;
    int index = 1;
    while (index < position - 1 && current->next != head) {
        current = current->next;
        index++;
    }
    if (index != position - 1) {
        return false;
    }

    CNode *newNode = new CNode;
    newNode->data = value;
    newNode->next = current->next;
    current->next = newNode;
    return true;
}

bool deleteCircularFront(CNode *&head) {
    if (head == nullptr) {
        return false;
    }
    if (head->next == head) {
        delete head;
        head = nullptr;
        return true;
    }

    CNode *last = head;
    while (last->next != head) {
        last = last->next;
    }

    CNode *oldHead = head;
    head = head->next;
    last->next = head;
    delete oldHead;
    return true;
}

bool deleteCircularEnd(CNode *&head) {
    if (head == nullptr) {
        return false;
    }
    if (head->next == head) {
        delete head;
        head = nullptr;
        return true;
    }

    CNode *current = head;
    while (current->next->next != head) {
        current = current->next;
    }

    delete current->next;
    current->next = head;
    return true;
}

bool deleteCircularAtPosition(CNode *&head, int position) {
    if (position < 1 || head == nullptr) {
        return false;
    }
    if (position == 1) {
        return deleteCircularFront(head);
    }

    CNode *current = head;
    int index = 1;
    while (index < position - 1 && current->next != head) {
        current = current->next;
        index++;
    }
    if (index != position - 1 || current->next == head) {
        return false;
    }

    CNode *nodeToDelete = current->next;
    current->next = nodeToDelete->next;
    delete nodeToDelete;
    return true;
}
```

---

## 6. 易错点清单

- `findMin` / `findMax` 不要用 `0` 初始化，应该用 `arr[0]`。
- `swap` 函数参数必须用 reference: `int &a, int &b`。
- second max/min 要注意 duplicate values。
- Recursion 必须有 base case，且每次问题规模要变小。
- Linked list 修改 head 时，函数参数要写 `Node *&head`。
- Insert middle 时，先让 `newNode->next` 接住后半段，再改 `current->next`。
- Delete node 时，先保存要删除的节点地址，再断链，最后 `delete`。
- Doubly linked list 不要忘记维护 `prev`。
- Circular linked list 遍历时用 `do while`，直到 current 回到 head。

## 7. 考前背写清单

最少要能手写：

- `findMin`, `findMax`
- `swapValues`
- `findSecondMax`, `findSecondMin`
- `countFrequency`, `printAllFrequencies`
- `recursiveSum`, `recursiveMax`
- `factorial`, `fibonacci`, `binarySearch`
- `struct Node`, `struct DNode`, `struct CNode`
- 手动创建 3 个 node 并 link
- `insertFront`, `insertEnd`, `insertAtPosition`
- `deleteFront`, `deleteEnd`, `deleteAtPosition`
- `insertDAtPosition`, `deleteDAtPosition`
- `insertCircularAtPosition`, `deleteCircularAtPosition`
- circular list 的 `last->next = head`

考试时先写特殊情况，再写一般情况，最后用一个小 `main()` 检查输出。
