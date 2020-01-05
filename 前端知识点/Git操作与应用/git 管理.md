## 前端分支创建及发布管理

测试阶段，公司统一测试人员新建 release 分支，在拉取前端分支后进行测试。

- 前端 bug 修复（只涉及到前端代码）
  【1】在 master 分支上创建 hotfix-xxx 分支进行开发。

  ```
  git pull origin master    // 保证本地 master 分支代码和线上的一致（新拉项目省略这一步）
  git checkout -b hotfix-xxx
  ```

  【2】开发完成后，拉取并合并线上 master 代码（防止线上 master 分支代码有新变更而导致代码不一致）

  ```
  git fetch origin master   // 更新远程仓库的 master 分支到本地
  git merge origin/master   // 与远程仓库比较，如果有冲突，先修改冲突
  或者
  git pull origin master
  ```

  【3】合并线上 master 分支后，提交代码，让测试自己新建 release-hotfix-xxx 分支进行测试

  【4】测试阶段 bug 修复在本地 hotfix-xxx 分支上进行，每次 bug 重测，测试需重新拉取你到分支代码

  【5】测试全部通过，有愈发环境走愈发测试，没有，直接发布线上测试

  【@】线上测试通过，接下来就是合并 master 分支代码

  【6】切换本地 master 分支，拉取线上 master 分支代码到本地

  ```
  git pull origin master
  ```

  【7】本地 master 分支合并线上 release-hotfix-xxx 分支

  ```
  git fetch origin release-hotfix-xxx   // 更新远程仓库的 release 分支到本地
  git merge origin/release-hotfix-xxx   // 合并测试 release 分支，如果有冲突，先修改冲突
  或者
  git pull origin master
  ```

  【@】合并完成后也可以自己在本地 master 分支上运行下

  【8】本地 master 分支提交线上

- 前端+后端项目迭代
  【1】在 master 分支上创建新分支进行开发，新分支可以和后端保持统一，也可以自己新建。

  ```
  git pull origin master    // 保证本地 master 分支代码和线上的一致（新拉项目省略这一步）
  git checkout -b feature-xxx 或者 后端提供分支
  ```

  【2】同上
