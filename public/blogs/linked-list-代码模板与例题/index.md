Linked List 代码模板与例题
1.单向链表代码模板（C++）
```cpp
#include <iostream>
using namespace std;

/*
    Node 表示“一个节点”
    每个节点包含两部分：
    1. data：存储的数据
    2. next：指向下一个节点的指针
*/
class Node {
public:
    double data;    // 当前节点存储的数据
    Node* next;     // 指向下一个 Node 的指针
};


/*
    List 表示“整条链表”
    它不直接存所有数据，而是只保存一个 head 指针。
    head 指向链表的第一个节点。
*/
class List {
public:
    /*
        Constructor 构造函数

        创建一条空链表时，head 先指向 NULL。
        NULL 表示现在链表里没有任何节点。
    */
    List() {
        head = NULL;
    }

    /*
        Destructor 析构函数

        程序结束时，释放链表中所有通过 new 创建的节点。
        否则会产生 memory leak。
    */
    ~List() {
        Node* currNode = head;      // 从第一个节点开始
        Node* nextNode = NULL;      // 用来暂存下一个节点

        while (currNode != NULL) {
            nextNode = currNode->next;  // 先保存下一个节点的位置
            delete currNode;            // 删除当前节点
            currNode = nextNode;        // 移动到下一个节点
        }
    }

    /*
        判断链表是否为空

        如果 head == NULL，说明链表没有第一个节点。
    */
    bool IsEmpty() {
        return head == NULL;
    }

    /*
        InsertNode(index, x)

        功能：
        在指定位置插入一个新节点，新节点的数据是 x。

        index 的含义：
        index = 0：插入到最前面，成为新的第一个节点
        index = 1：插入到第一个节点后面
        index = 2：插入到第二个节点后面

        如果插入成功，返回新节点地址。
        如果插入失败，返回 NULL。
    */
    Node* InsertNode(int index, double x) {
        // index 不能是负数
        if (index < 0) {
            return NULL;
        }

        /*
            currNode 用来找到“插入位置的前一个节点”。

            注意：
            当 index = 0 时，不需要找前一个节点，
            因为新节点要直接插到 head 前面。
        */
        int currIndex = 1;
        Node* currNode = head;

        /*
            目标：
            如果 index = 2，就要找到第 2 个节点；
            如果 index = 3，就要找到第 3 个节点。

            currNode 不断向后移动：
            currNode = currNode->next;
        */
        while (currNode != NULL && index > currIndex) {
            currNode = currNode->next;
			//重要：currNode->next等价于：(*currNode).next
            currIndex++;
        }

        /*
            如果 index > 0，但是 currNode == NULL，
            说明想插入的位置超过了链表长度，插入失败。
        */
        if (index > 0 && currNode == NULL) {
            return NULL;
        }

        // 创建新节点
        Node* newNode = new Node;
        newNode->data = x;

        /*
            情况 1：插入到链表最前面

            原来：
            head -> A -> B -> NULL

            插入 newNode 后：
            head -> newNode -> A -> B -> NULL
        */
        if (index == 0) {
            newNode->next = head;   // 新节点先指向原来的第一个节点
            head = newNode;         // head 再改成指向新节点
        }

        /*
            情况 2：插入到中间或末尾

            原来：
            currNode -> oldNext

            插入后：
            currNode -> newNode -> oldNext
        */
        else {
            newNode->next = currNode->next;  // 新节点先接住后面的节点
            currNode->next = newNode;        // 前一个节点再指向新节点
        }

        return newNode;
    }

    /*
        FindNode(x)

        功能：
        查找数据等于 x 的节点。

        如果找到，返回它的位置。
        如果找不到，返回 0。

        注意：
        这里的位置从 1 开始，不是从 0 开始。
    */
    int FindNode(double x) {
        Node* currNode = head;  // 从第一个节点开始找
        int currIndex = 1;      // 位置从 1 开始

        /*
            只要 currNode 不是 NULL，
            并且当前节点的数据不是 x，
            就继续往后找。
        */
        while (currNode != NULL && currNode->data != x) {
            currNode = currNode->next;
            currIndex++;
        }

        // 如果 currNode 不是 NULL，说明找到了
        if (currNode != NULL) {
            return currIndex;
        }

        // 否则说明没找到
        return 0;
    }

    /*
        DeleteNode(x)

        功能：
        删除第一个数据等于 x 的节点。

        如果删除成功，返回被删除节点的位置。
        如果没找到，返回 0。
    */
    int DeleteNode(double x) {
        Node* prevNode = NULL;  // 当前节点的前一个节点
        Node* currNode = head;  // 当前正在检查的节点
        int currIndex = 1;      // 当前节点的位置

        /*
            找到 data == x 的节点。
            找的过程中，同时维护 prevNode 和 currNode。

            prevNode 永远指向 currNode 的前一个节点。
        */
        while (currNode != NULL && currNode->data != x) {
            prevNode = currNode;
            currNode = currNode->next;
            currIndex++;
        }

        /*
            如果 currNode == NULL，
            说明整条链表找完了也没有 x。
        */
        if (currNode == NULL) {
            return 0;
        }

        /*
            情况 1：删除的不是第一个节点

            原来：
            prevNode -> currNode -> nextNode

            删除后：
            prevNode -> nextNode
        */
        if (prevNode != NULL) {
            prevNode->next = currNode->next;
            delete currNode;
        }

        /*
            情况 2：删除的是第一个节点

            原来：
            head -> currNode -> nextNode

            删除后：
            head -> nextNode
        */
        else {
            head = currNode->next;
            delete currNode;
        }

        return currIndex;
    }

    /*
        DisplayList()

        功能：
        打印链表中所有节点的数据，
        并统计节点数量。
    */
    void DisplayList() {
        int num = 0;
        Node* currNode = head;

        while (currNode != NULL) {
            cout << currNode->data << endl;
            currNode = currNode->next;
            num++;
        }

        cout << "Number of nodes in the list: " << num << endl;
    }

private:
    /*
        head 是整条链表的入口。

        如果：
        head == NULL

        说明链表为空。

        如果：
        head -> 6 -> 7 -> 5 -> NULL

        说明 head 指向第一个节点 6，
        然后 6 的 next 指向 7，
        7 的 next 指向 5，
        5 的 next 指向 NULL。
    */
    Node* head;
};


int main() {
    List list;

    /*
        插入节点
        注意 index 的含义：

        InsertNode(0, 7.0)
        表示把 7.0 插入到最前面。

        InsertNode(1, 5.0)
        表示把 5.0 插入到第一个节点后面。
    */
    list.InsertNode(0, 7.0);     // 成功：7
    list.InsertNode(1, 5.0);     // 成功：7 -> 5
    list.InsertNode(-1, 5.0);    // 失败：index 不能是负数
    list.InsertNode(0, 6.0);     // 成功：6 -> 7 -> 5
    list.InsertNode(8, 4.0);     // 失败：index 超出链表长度

    // 打印当前链表
    list.DisplayList();

    // 查找 5.0
    if (list.FindNode(5.0) > 0) {
        cout << "5.0 found" << endl;
    } else {
        cout << "5.0 not found" << endl;
    }

    // 查找 4.5
    if (list.FindNode(4.5) > 0) {
        cout << "4.5 found" << endl;
    } else {
        cout << "4.5 not found" << endl;
    }

    // 删除 7.0
    list.DeleteNode(7.0);

    // 再次打印链表
    list.DisplayList();

    return 0;
}
```
________________________________________
2. 例题指引
顺序	题目	难度	对应知识点
1	203. Remove Linked List Elements
Easy	删除指定值节点，对应 DeleteNode
2	83. Remove Duplicates from Sorted List
Easy	遍历链表，删除重复节点
3	876. Middle of the Linked List
Easy	链表遍历，理解 currNode = currNode->next
4	206. Reverse Linked List
Easy	修改 next 指针
5	21. Merge Two Sorted Lists
Easy	连接两个链表
