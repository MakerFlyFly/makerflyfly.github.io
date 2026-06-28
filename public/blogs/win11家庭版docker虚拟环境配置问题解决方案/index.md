今天首次尝试在我机械革命上配置Docker，按照教程上面一步步配置，最终却还是无法正常使用。打开就是一个报错：

```text
Docker Desktop failed to start because virtualisation support wasn’t detected.

Contact your IT admin to enable virtualization or check system requirements.
```

在长达一上午的折磨后，我经过一系列操作，意外成功启动了。这是我的实现路径：

---

## 1. 家庭版默认没有Hyper-V图形界面，但可以通过管理员PowerShell运行以下命令来尝试安装

```powershell
dism.exe /online /enable-feature /featurename:Microsoft-Hyper-V-All /all /norestart
```

---

## 2. 检查并确保Hypervisor已启动

在开始菜单搜索"cmd"或"PowerShell"，右键选择"以管理员身份运行"。

输入以下命令并回车：

```powershell
bcdedit /enum
```

找到 hypervisorlaunchtype 这一行。查看值：

如果值是 Auto，说明设置正确。

如果值是 Off，输入以下命令修正:

```powershell
bcdedit /set hypervisorlaunchtype Auto
```

本人的设备是机械革命，默认启用了了虚拟化。使用其他设备的兄弟们可能要在BIOS/UEFI中开启虚拟化支持。具体操作可以去各自电脑品牌的帖子里面查看，这里就不多赘述了。

---

CSDN文章链接：https://blog.csdn.net/MakerFly/article/details/155133501
