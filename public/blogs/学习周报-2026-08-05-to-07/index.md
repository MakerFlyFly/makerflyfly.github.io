# 学习周报｜2026-08-05-to-07

------------------------------------------------------------------------

## 1. 本周技术学习总结

### vpn环境配置

`1.1.1.1`

一个好用稳定的免费vpn，适合长期使用。

`SakuraCat`

一个不限时的便宜vpn，适合作为前一vpn的备选。

### Python 虚拟环境

虚拟环境可以理解为：

**给每一个 Python 项目单独准备一个依赖环境。**

例如：

项目 A 使用：

-   Python 3.12
-   pandas 2.x

项目 B 使用：

-   Python 3.11
-   pandas 1.x

两个项目互不影响。

使用 `uv` 时，通常会自动创建：

`.venv`

它就是当前项目的虚拟环境目录。

好处：

-   不污染电脑全局 Python 环境
-   不同项目可以使用不同依赖版本
-   减少"我的电脑能运行，你的电脑不能运行"的问题

### Git 基本工作流程

Git 可以理解为：

**为代码拍版本快照。**

最基本流程：

``` text
修改代码
↓
git status
↓
git add
↓
git commit
↓
git push
↓
GitHub
```

`git status`

查看当前有哪些文件被修改。

`git add`

告诉 Git：

这些修改准备进入下一次版本记录。

`git commit`

创建一次本地版本快照。

`git push`

把本地提交上传到 GitHub。

因此：

**Git 负责版本管理，GitHub 负责远程保存和协作。**

### 建立 Docker 运行环境

`Image 镜像` 安装包和运行环境模板 `Container 容器` 正在运行的镜像实例
`Dockerfile` 如何制作镜像的说明书 `Compose`
如何启动一个或多个容器的配置文件 `Volume 数据卷`
容器删除后仍保留数据的地方

### Dockerfile

`Dockerfile` 是：

**制作 Docker 镜像的说明书。**

它会告诉 Docker：

第一步做什么，第二步做什么。

例如：

``` dockerfile
FROM python:3.12

WORKDIR /app

COPY . .

RUN pip install -r requirements.txt

CMD ["python", "-m", "app"]
```

大致可以理解为：

``` text
准备 Python 环境
↓
创建工作目录
↓
复制项目代码
↓
安装依赖
↓
设置启动命令
```

Docker 根据这份说明书：

**构建 Image 镜像。**

### Dockerfile 和 Docker Compose

`Dockerfile` 解决的问题是：

**这个镜像怎么做出来？**

Docker Compose 解决的问题是：

**这些容器应该怎么一起运行？**

例如：

一个完整项目可能包括：

``` text
Python 程序
数据库
Redis
```

每一个服务都可能有自己的容器。

Compose 可以统一规定：

-   启动哪些服务
-   使用什么镜像
-   开放什么端口
-   使用什么环境变量
-   挂载什么 Volume
-   服务之间如何连接

因此：

``` text
Dockerfile
→ 制作一个运行环境

Compose
→ 组织多个运行环境
```

简单理解：

**Dockerfile 负责造车。**

**Compose 负责安排车队。**

### Image 和 Container

Image 镜像可以理解为：

**一个已经准备好的程序运行模板。**

Container 容器可以理解为：

**正在运行的镜像实例。**

例如：

``` text
Python 3.12 + 项目代码 + 项目依赖
```

可以制作成一个 Image。

启动这个 Image：

``` text
Image
↓
docker run
↓
Container
```

同一个 Image 可以启动多个 Container。

类似于：

``` text
安装包
→ Image

安装并运行起来的软件
→ Container
```

删除 Container，一般不会删除原来的 Image。

### Docker Volume

Container 本身可以被删除和重新创建。

因此重要数据不能完全依赖 Container 内部保存。

例如：

``` text
数据库数据
日志
模型文件
持久化配置
```

可以放到 Volume 中。

Volume 可以理解为：

**独立于容器存在的数据存储空间。**

关系大致是：

``` text
Container
↓
读写
↓
Volume
```

即使 Container 被删除：

``` text
Container ×
Volume ✓
```

数据仍然可以保留下来。

所以：

**Container 负责运行，Volume 负责保存重要数据。**

### Docker 端口映射

Container 内部也有自己的端口。

例如：

程序在容器内部运行在：

``` text
8000
```

但是电脑外部不能直接访问这个容器端口。

因此需要进行端口映射：

``` text
8000:8000
```

可以理解为：

``` text
电脑端口
↓
容器端口
```

例如：

``` text
8000:8000
```

表示：

访问电脑的 `8000` 端口，

实际上会进入 Container 的 `8000` 端口。

所以浏览器访问：

``` text
localhost:8000
```

就可以访问容器中的程序。

### localhost

`localhost` 表示：

**当前这台电脑自己。**

它通常对应：

``` text
127.0.0.1
```

例如：

``` text
localhost:8000
```

和：

``` text
127.0.0.1:8000
```

通常表示同一个意思：

**访问自己电脑上的 8000 端口。**

因此：

``` text
localhost
→ 找自己的电脑

8000
→ 找自己电脑上的某个程序
```

两者组合起来就是：

``` text
localhost:8000
```

### Docker 环境变量

程序运行时可能需要：

-   API Key
-   数据库地址
-   数据目录
-   服务配置

这些内容不一定直接写进 Docker Image。

可以在启动 Container 时传进去。

例如：

``` text
API_KEY=xxxx
```

这样可以做到：

``` text
镜像保持不变
+
运行配置可以改变
```

例如：

开发环境使用一个数据库。

正式环境使用另一个数据库。

不需要重新修改代码，只需要更换环境变量。

因此：

**Image 负责程序本身，环境变量负责运行时配置。**

### Docker 健康检查

Container 启动成功，并不代表程序一定正常。

例如：

``` text
Container 正在运行
```

但里面的 Python 程序可能：

-   无法连接数据库
-   启动失败
-   接口无法访问
-   依赖出现问题

所以可以增加：

`healthcheck`

健康检查会定期询问：

**这个服务现在真的能正常工作吗？**

例如检查：

``` text
http://localhost:8000/health
```

如果接口正常返回，就说明服务基本正常。

因此：

``` text
Container running
```

只代表：

**容器还活着。**

而：

``` text
healthy
```

更接近：

**里面的程序也正常工作。**

### Docker 日志

程序运行失败时，第一件很重要的事情就是：

**查看日志。**

日志会记录程序运行过程中发生了什么。

例如可能看到：

``` text
数据库连接失败
```

或者：

``` text
环境变量不存在
```

或者：

``` text
程序启动成功
```

Docker 可以查看 Container 输出的日志。

因此排查 Docker 问题时，可以按照：

``` text
Container 有没有启动
↓
查看日志
↓
判断错误原因
↓
修改配置或代码
```

日志可以理解为：

**程序运行过程留下的记录。**

### docker compose up 和 down

`docker compose up`

表示：

**按照 Compose 配置启动项目服务。**

例如：

``` powershell
docker compose up
```

可能同时启动：

``` text
Python 服务
数据库
Redis
```

如果使用：

``` powershell
docker compose up -d
```

其中：

`-d`

表示让服务在后台运行。

------------------------------------------------------------------------

`docker compose down`

表示：

**停止并删除 Compose 创建的 Container 和相关网络。**

简单理解：

``` text
docker compose up
→ 把项目启动起来

docker compose down
→ 把项目停下来
```

通常不会因为 `down` 就自动删除持久化 Volume 中的数据。

### Docker 验收

Docker 验收不是简单检查：

``` text
Dockerfile 存不存在
```

而是真正检查：

``` text
能否构建镜像
↓
能否启动 Container
↓
程序能否正常运行
↓
健康检查是否通过
```

如果这些步骤都通过，才能说明：

**项目的 Docker 配置实际上可以使用。**

所以：

``` text
配置文件写好了
≠
Docker 验收通过
```

只有真正运行成功，才算完成验证。

这也是为什么出现镜像无法拉取、代理异常等问题时，不能直接认为 Docker
部分已经完成。

### .env 与环境变量

`.env` 用来保存项目运行时需要的配置。

例如：

``` text
API_KEY=xxxx
DATABASE_URL=xxxx
```

这些内容通常包括：

-   API Key
-   数据库密码
-   服务地址
-   账号配置

这类信息不应该直接写死在代码中。

代码负责读取环境变量，`.env` 负责提供具体配置。

好处：

-   修改配置时不用修改代码
-   不同电脑可以使用不同配置
-   避免把密码、Token 等敏感信息上传到 GitHub

通常：

`.env`

保存真实配置，不上传 GitHub。

`.env.example`

保存配置格式，可以上传 GitHub。

例如：

``` text
API_KEY=
DATABASE_URL=
```

它告诉其他开发者：

**这个项目需要哪些环境变量，但不暴露真正的密码。**

### .gitignore

`.gitignore` 用来告诉 Git：

**哪些文件不要进行版本管理。**

常见内容包括：

``` text
.env
.venv/
__pycache__/
```

例如：

`.env`

可能包含密码和 API Key，不应该上传。

`.venv`

包含大量本地安装的 Python 包，没有必要上传。

`__pycache__`

是 Python 自动生成的缓存文件，也没有必要上传。

因此 `.gitignore` 的作用可以理解为：

**Git 项目的排除名单。**

### CLI 与 python -m app

CLI 全称：

Command Line Interface

中文可以理解为：

**命令行操作界面。**

例如运行：

``` powershell
python -m app
```

就是通过终端启动项目。

其中：

`python`

启动 Python。

`-m`

表示按照 Python 模块的方式运行。

`app`

表示运行 `app` 这个包。

通常需要：

``` text
app/
├── __init__.py
└── __main__.py
```

当运行：

``` powershell
python -m app
```

Python 会寻找：

``` text
app/__main__.py
```

并执行里面的代码。

这样做的好处是：

**项目有统一的启动入口。**

以后不用记：

``` powershell
python app/xxx/xxx/main.py
```

只需要：

``` powershell
python -m app
```

### pytest 测试

`pytest` 用来自动检查程序是否按照预期工作。

例如有一个函数：

``` python
def add(a, b):
    return a + b
```

可以写测试：

``` python
def test_add():
    assert add(1, 2) == 3
```

运行：

``` powershell
pytest
```

如果结果正确，测试通过。

如果以后修改代码，不小心把原来的功能改坏了，测试就可能失败。

因此测试的核心作用是：

**防止修改新代码时，把原来正常的功能弄坏。**

可以简单理解为：

代码负责完成工作。

测试负责检查代码有没有做错。

### Ruff 代码检查

`Ruff` 是 Python 代码检查工具。

它主要做两类事情：

**1. 检查代码格式**

例如：

-   缩进是否规范
-   空格是否规范
-   import 顺序是否合理
-   一行代码是否过长

**2. 检查常见代码问题**

例如：

``` python
import pandas as pd
```

但是后面根本没有使用 `pd`。

Ruff 就可能提醒：

**这个 import 没有使用。**

还可以检查：

-   未使用变量
-   重复导入
-   一些容易出错的写法
-   不符合项目规范的代码

因此可以简单理解为：

`pytest` 检查：

**代码运行结果对不对。**

`Ruff` 检查：

**代码写得规不规范，有没有明显问题。**

### README、CONTRIBUTING 和 AGENTS.md

这三个文件面对的对象不同。

`README.md`

主要给：

**使用项目的人看。**

通常包括：

-   项目是做什么的
-   如何安装
-   如何运行
-   项目基本结构

`CONTRIBUTING.md`

主要给：

**参与开发的人看。**

通常包括：

-   如何创建分支
-   如何提交代码
-   Commit 如何写
-   提交前需要运行哪些测试

`AGENTS.md`

主要给：

**Codex 等 AI 编程工具看。**

通常包括：

-   哪些目录可以修改
-   哪些目录不能随便修改
-   使用什么技术规范
-   修改代码后必须运行什么测试
-   不允许提前实现哪些功能

可以简单理解为：

``` text
README → 怎么使用项目

CONTRIBUTING → 人类怎么开发项目

AGENTS.md → AI 怎么开发项目
```

### pyproject.toml

`pyproject.toml` 可以理解为：

**Python 项目的总配置文件。**

里面通常会记录：

-   项目名称
-   Python 版本要求
-   项目依赖
-   开发依赖
-   Ruff 配置
-   pytest 配置
-   打包相关配置

例如：

``` toml
[project]
name = "hidden-dragon-strategy"
requires-python = ">=3.12"
```

它告诉开发工具：

**这是一个什么项目，需要什么环境。**

以前很多 Python 项目会把配置分散在多个文件中。

现在越来越多工具都支持直接读取：

`pyproject.toml`

所以它可以理解为：

**Python 项目的配置中心。**

### uv.lock

`pyproject.toml` 通常描述：

**项目需要什么依赖。**

`uv.lock` 则记录：

**最终实际安装了哪些具体版本。**

例如项目要求：

``` text
pandas >= 2.0
```

理论上可能安装：

``` text
2.1
2.2
2.3
```

不同时间安装，结果可能不同。

`uv.lock` 会把最终依赖版本锁定下来。

这样其他电脑运行：

``` powershell
uv sync
```

时，可以尽可能安装完全相同的环境。

因此：

``` text
pyproject.toml
→ 我需要什么

uv.lock
→ 我最终具体用了什么
```

一般情况下：

**`uv.lock` 应该提交到 Git。**

不要因为它是自动生成文件就随便删除。

### uv sync

`uv sync` 的作用是：

**让当前电脑的 Python 环境和项目配置保持一致。**

它会根据：

``` text
pyproject.toml
+
uv.lock
```

检查并安装项目需要的依赖。

例如新同事拿到项目后，可以运行：

``` powershell
uv sync
```

然后得到和原开发环境比较接近的依赖配置。

因此可以简单理解为：

``` text
GitHub
↓
拉取项目
↓
uv sync
↓
恢复 Python 环境
```

它解决的是：

**代码拿到了，但是依赖环境还没有准备好。**

------------------------------------------------------------------------

## 2. 遇到的问题

### 问题 1：Docker 无法拉取镜像

**现象：**

Docker Desktop 配置了 `127.0.0.1:7890`
代理，但该端口当前没有正常监听，导致镜像拉取失败。

**解决方案：**

将Docker Desktop 配置由镜像改为直连。

------------------------------------------------------------------------

## 3. 本周认知与感悟

现在的ai工具的工程能力太强了，而我的知识面的确是有所缺失的。我需要找到一种方式，能在快速完成工程任务的前提下积累必要的专业知识，让我能够可持续性的应用ai工具。

------------------------------------------------------------------------