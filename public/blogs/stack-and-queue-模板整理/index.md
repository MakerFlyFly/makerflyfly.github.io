# Stack and Queue 核心模板
---

## Part 1：Array Implementation of Stack（数组实现栈）

核心：

- `top` 表示栈顶下标
- 空栈：`top == -1`
- 满栈：`top == maxSize - 1`
- `Push`：插入到栈顶
- `Pop`：删除栈顶

```cpp
#include <iostream>
using namespace std;

class ArrayStack {
private:
    double* values;   // 存储栈元素
    int top;          // 栈顶下标
    int maxSize;      // 栈容量

public:
    ArrayStack(int size = 10) {
        maxSize = size;
        values = new double[maxSize];
        top = -1;
    }

    ~ArrayStack() {
        delete[] values;
    }

    bool IsEmpty() {
        return top == -1;
    }

    bool IsFull() {
        return top == maxSize - 1;
    }

    void Push(double x) {
        if (IsFull()) {
            cout << "Error: stack is full." << endl;
            return;
        }

        values[++top] = x;
    }

    double Pop() {
        if (IsEmpty()) {
            cout << "Error: stack is empty." << endl;
            return -1;
        }

        return values[top--];
    }

    double Top() {
        if (IsEmpty()) {
            cout << "Error: stack is empty." << endl;
            return -1;
        }

        return values[top];
    }

    void DisplayStack() {
        for (int i = top; i >= 0; i--) {
            cout << values[i] << endl;
        }
    }
};
```

---

## Part 2：Linked List Implementation of Stack（链表实现栈）

核心：

- `head` 表示栈顶
- 空栈：`head == NULL`
- `Push`：头插法
- `Pop`：删除头节点

```cpp
#include <iostream>
using namespace std;

class StackNode {
public:
    double data;
    StackNode* next;
};

class LinkedStack {
private:
    StackNode* head;   // 栈顶指针

public:
    LinkedStack() {
        head = NULL;
    }

    ~LinkedStack() {
        while (!IsEmpty()) {
            Pop();
        }
    }

    bool IsEmpty() {
        return head == NULL;
    }

    void Push(double x) {
        StackNode* newNode = new StackNode;
        newNode->data = x;
        newNode->next = head;
        head = newNode;
    }

    double Pop() {
        if (IsEmpty()) {
            cout << "Error: stack is empty." << endl;
            return -1;
        }

        StackNode* temp = head;
        double value = head->data;

        head = head->next;
        delete temp;

        return value;
    }

    double Top() {
        if (IsEmpty()) {
            cout << "Error: stack is empty." << endl;
            return -1;
        }

        return head->data;
    }

    void DisplayStack() {
        StackNode* current = head;

        while (current != NULL) {
            cout << current->data << endl;
            current = current->next;
        }
    }
};
```

---

## Part 3：Circular Array Implementation of Queue（循环数组实现队列）

核心：

- `front` 表示队头
- `rear` 表示队尾
- `counter` 表示当前元素数量
- 空队列：`counter == 0`
- 满队列：`counter == maxSize`
- 循环移动：`(index + 1) % maxSize`

```cpp
#include <iostream>
using namespace std;

class ArrayQueue {
private:
    double* values;   // 存储队列元素
    int front;        // 队头下标
    int rear;         // 队尾下标
    int counter;      // 当前元素数量
    int maxSize;      // 队列容量

public:
    ArrayQueue(int size = 10) {
        maxSize = size;
        values = new double[maxSize];

        front = 0;
        rear = -1;
        counter = 0;
    }

    ~ArrayQueue() {
        delete[] values;
    }

    bool IsEmpty() {
        return counter == 0;
    }

    bool IsFull() {
        return counter == maxSize;
    }

    bool Enqueue(double x) {
        if (IsFull()) {
            cout << "Error: queue is full." << endl;
            return false;
        }

        rear = (rear + 1) % maxSize;
        values[rear] = x;
        counter++;

        return true;
    }

    bool Dequeue(double& x) {
        if (IsEmpty()) {
            cout << "Error: queue is empty." << endl;
            return false;
        }

        x = values[front];
        front = (front + 1) % maxSize;
        counter--;

        return true;
    }

    void DisplayQueue() {
        for (int i = 0; i < counter; i++) {
            cout << values[(front + i) % maxSize] << " ";
        }

        cout << endl;
    }
};
```

---

## Part 4：Linked List Implementation of Queue（链表实现队列）

核心：

- `front` 表示队头
- `rear` 表示队尾
- `Enqueue`：插入到 `rear` 后面
- `Dequeue`：删除 `front`
- 队列删空后：`rear = NULL`

```cpp
#include <iostream>
using namespace std;

class QueueNode {
public:
    double data;
    QueueNode* next;
};

class LinkedQueue {
private:
    QueueNode* front;   // 队头指针
    QueueNode* rear;    // 队尾指针
    int counter;        // 当前元素数量

public:
    LinkedQueue() {
        front = NULL;
        rear = NULL;
        counter = 0;
    }

    ~LinkedQueue() {
        double value;

        while (!IsEmpty()) {
            Dequeue(value);
        }
    }

    bool IsEmpty() {
        return counter == 0;
    }

    void Enqueue(double x) {
        QueueNode* newNode = new QueueNode;
        newNode->data = x;
        newNode->next = NULL;

        if (IsEmpty()) {
            front = newNode;
            rear = newNode;
        } else {
            rear->next = newNode;
            rear = newNode;
        }

        counter++;
    }

    bool Dequeue(double& x) {
        if (IsEmpty()) {
            cout << "Error: queue is empty." << endl;
            return false;
        }

        QueueNode* temp = front;
        x = front->data;

        front = front->next;
        delete temp;

        counter--;

        if (counter == 0) {
            rear = NULL;
        }

        return true;
    }

    void DisplayQueue() {
        QueueNode* current = front;

        while (current != NULL) {
            cout << current->data << " ";
            current = current->next;
        }

        cout << endl;
    }
};
```

---

## Summary

| Structure | Rule | Insert | Delete |
|---|---|---|---|
| Stack | LIFO | top | top |
| Queue | FIFO | rear | front |
