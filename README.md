# Vite 前端应用仓库

这是一个使用 Vite 的企业前端应用仓库。应用仓库只维护业务源码、依赖和测试；Docker、Nginx、Jenkins 等交付配置位于相邻的 `cicdproject-platform` 平台仓库中，由平台流水线拉取本仓库并完成构建发布。

| 组件 | 作用 |
| --- | --- |
| GitHub Actions | Pull Request 的快速检查 |
| Jenkins | 平台仓库中的流水线编排 |
| Docker / Nginx | 平台仓库中的统一交付运行时 |

## 本地运行

需要 Node.js 22 或更新版本。

```bash
npm install
npm run dev
```

打开 <http://localhost:5173>。运行 `npm test` 检查入口，运行 `npm run build` 生成 Vite 的 `dist/` 产物。

## 企业交付方式

平台仓库 `cicdproject-platform` 的 Jenkins Pipeline 会拉取本仓库、运行测试和 Vite 构建，再用统一的 Dockerfile 和 Nginx 配置生成镜像。业务仓库不保存生产服务器配置。

页面源码位于 `src/`，Vite 入口是根目录的 `index.html`，GitHub Actions 工作流位于 `.github/workflows/deploy.yml`。
