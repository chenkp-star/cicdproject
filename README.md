# 简单的 CI/CD 部署项目

这是一个使用 Vite 的企业化前端 CI/CD 骨架：GitHub Actions 负责云端检查，Jenkinsfile 负责企业内网流水线，Docker 产出不可变镜像，Nginx 负责生产静态文件服务。

| 组件 | 作用 |
| --- | --- |
| GitHub Actions | Pull Request 的快速测试与 GitHub Pages 发布 |
| Jenkins | 企业内网中的流水线编排、构建 Docker 镜像、触发部署 |
| Docker | 固定运行时和构建产物，避免“在我机器上能跑” |
| Nginx | 高效提供构建后的静态文件，并提供 `/healthz` 健康检查 |

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm run dev
```

打开 <http://localhost:5173>。运行 `npm test` 检查 Vite 入口，运行 `npm run build` 将 Vite 产物输出到 `dist/`。

## Docker 本地运行

```bash
docker compose up --build
```

打开 <http://localhost:8080>，健康检查地址是 `/healthz`。

## Jenkins 本地演示

```bash
docker compose --profile ci up -d jenkins
```

浏览 <http://localhost:8081>，从日志中取得初始管理员密码，并创建一个 Pipeline 任务，配置为读取仓库中的 `Jenkinsfile`。Jenkins 会测试代码、构建镜像，并在 `main` 分支归档带版本的镜像包。生产环境可把镜像推送到 Harbor、GHCR 或 ECR，再由企业发布平台上线。

### Windows 首次安装 Docker Desktop

Docker Desktop 需要 WSL2。若 Docker Desktop 无法启动，请用管理员 PowerShell 运行：

```powershell
.\scripts\setup-windows.ps1
```

重启 Windows 后打开 Docker Desktop，等待状态变为 Running，再执行上面的 Compose 命令。

## 启用自动部署

1. 在 GitHub 创建仓库，并把此项目推送到 `main` 分支。
2. 在仓库 **Settings → Pages → Build and deployment → Source** 中选择 **GitHub Actions**。
3. 打开 **Actions**，等待 **CI and deploy** 工作流完成。部署地址会显示在 `deploy` 作业的环境链接中。

页面源码位于 `src/`，Vite 入口是根目录的 `index.html`，工作流位于 `.github/workflows/deploy.yml`。
