## 固定长度编码 Fixed-length Code

解释：每一个字符使用相同数量的 bits

例：

A = 000   B = 001   C = 010   D = 011   E = 100

ASCII 和 Unicode之类。

最少需要的Bits数量通用公式：

\(2^n \ge \text{字符种类数量}\)

\(\text{总编码长度} = \text{字符数量} \times \text{每个字符的 bit 数量}\)

## 可变长度编码 Variable-length Code

出现频率高的字符 → 使用较短的编码

出现频率低的字符 → 使用较长的编码

### Prefix Property 前缀性质

一个编码具有前缀性质，要求：

No codeword is a prefix of another codeword.

任何一个字符的完整编码，都不能是另一个字符编码的开头。

### Huffman Code Tree（哈夫曼编码树）

A Huffman coding tree is a binary tree used to generate prefix-free variable-length codes.

哈夫曼编码树是一棵二叉树，用来生成无前缀冲突的可变长度编码。

结构：

leaf node：叶节点

储存真正的字符，例如 A、B、C。

internal node：内部节点

储存其子树中字符频率的总和。

left edge：左边的边

通常标记为 0。

right edge：右边的边

通常标记为 1。

为什么树生成的编码一定满足 Prefix Property？

因为字符只能放在 leaf nodes（叶节点） 中。

构建 Huffman Tree 的核心规则

Repeatedly select the two trees with the smallest frequencies and combine them into a new tree.

不断选择频率最小的两棵树，将它们合并成一棵新树。

新节点的频率为：

\(\text{new frequency} = \text{frequency}_1 + \text{frequency}_2\)

## Huffman Decoding 哈夫曼解码

Read the bitstream from left to right and stop whenever a complete codeword is matched.

从左到右读取比特流，每当匹配到一个完整码字，就解码出一个字符。

## Average Code Length 平均编码长度

## Huffman Coding 的目标:

Minimize the average code length.使平均编码长度最小。

公式：\(L = \sum P(S) \times l(S)\)

The average code length is calculated by multiplying each symbol's probability by its code length and adding the results.

中文：

平均编码长度等于每个字符的概率乘以其码字长度，再把所有结果相加。

（在大学考试中，注意区分是求Total Encoded Length还是Average Code Length）

## 处理 Equal Frequencies 相同频率

When several nodes have the same frequency, any two of the smallest nodes may be selected. Different trees may be produced, but the total encoded length remains optimal.

当多个节点具有相同频率时，可以任选两个最小频率节点进行合并。最终生成的树可能不同，但总编码长度仍然是最优的。

## Huffman Tree 为什么是 Optimal？（课外拓展）

A Huffman code minimizes the total weighted path length among all prefix-free binary codes.在所有无前缀冲突的二进制编码中，哈夫曼编码使加权路径总长度最小。

详细数学证明见拓展。

## Huffman Decoding 哈夫曼解码

Start from the root for every symbol. Read 0 to move left and 1 to move right. When a leaf node is reached, output the symbol and return to the root.

中文：

每解码一个字符都从根节点开始；读到 0 向左走，读到 1 向右走；到达叶节点后输出字符，再回到根节点。

## Huffman Coding 做题步骤

1. Sort

Sort all symbols by frequency in ascending order.按频率从小到大排列。

2. Combine

Combine the two nodes with the smallest frequencies.合并频率最小的两个节点。

3. Reinsert

Insert the new node back into the collection.将新节点放回集合中。

4. Repeat

Repeat until only one tree remains.重复操作，直到只剩一棵树。

5. Label edges

left edge  = 0

right edge = 1

左边和右边也可以交换，但整棵树要保持一致。

6. Generate codes

Follow the path from the root to each leaf node.从根节点走到每个叶节点，得到对应编码。

拓：

## 为什么最小频率应该放在最深层？

假设：

- 字符 A 的频率较大：\(w_A > w_B\)
- 但是 A 在更深的位置：\(d_A > d_B\)

它们目前的成本是：

$$w_A d_A + w_B d_B$$

交换 A 和 B 后：

$$w_A d_B + w_B d_A$$

原成本减去交换后的成本：

$$(w_A d_A + w_B d_B) - (w_A d_B + w_B d_A)$$

整理得：

$$(w_A - w_B)(d_A - d_B)$$

因为：

$$w_A - w_B > 0$$

并且：

$$d_A - d_B > 0$$

所以结果大于 0。

也就是说，交换以后成本会下降。

因此，在最优树中一定满足：

> Higher-frequency symbols should not be deeper than lower-frequency symbols.
> 高频字符不应该比低频字符放得更深。

所以最低频率的字符一定可以放在树的最深层。

这个证明方法叫：

> Exchange Argument（交换论证）
