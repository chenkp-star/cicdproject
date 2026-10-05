# Sentry 错误监控：默认模拟，后续切换真实服务

## 当前实现

| 环节 | 模拟行为 |
| --- | --- |
| 浏览器 | 使用 @sentry/vue 捕获异常，mock transport 仅打印标记，不创建上报请求 |
| 构建 | Vite 生成 hidden sourcemap，模拟上传后删除所有 .map |
| 部署 | 最终 dist 不含 .map；包体积检查也会拒绝残留的 .map |
| 版本 | Jenkins 传入镜像标签作为 release，例如 cicd-vite-demo:8 |

默认就能使用，不需要复制环境文件。运行 npm run dev，点击页面的“触发测试错误”；提示“模拟错误已捕获，没有上传到 Sentry”，控制台出现 [Sentry MOCK] 标记。Vue 异常和浏览器未处理异常也由 SDK 捕获。

## 配置

.env.example 全部是占位值。可以复制成 .env.local；本地配置已被 Git 忽略。

| 变量 | 作用 | 是否可进入前端 |
| --- | --- | --- |
| VITE_SENTRY_MODE | mock / live / off | 是 |
| VITE_SENTRY_DSN | 错误上报项目地址，默认 sentry.invalid | 是，DSN 是公开配置 |
| VITE_SENTRY_ENVIRONMENT | 环境名称 | 是 |
| VITE_SENTRY_RELEASE | 构建版本；SDK 与上传插件共用 | 是 |
| SENTRY_UPLOAD_MODE | mock / live | 否 |
| SENTRY_ORG | Sentry 组织 slug | 否 |
| SENTRY_PROJECT | 项目 slug | 否 |
| SENTRY_AUTH_TOKEN | sourcemap 上传授权 Token | **绝不能进入前端** |

替换占位密钥不会自动发送：需要明确把相关 MODE 改为 live。SDK 上报与 sourcemap 上传是两个独立开关。

## 未来本地接入真实 Sentry

1. 创建 Sentry Vue 项目，取得真实 DSN。
2. 将 .env.local 中 VITE_SENTRY_MODE 改成 live，替换 DSN，指定环境和唯一 release。
3. 如需上传 sourcemap，将 SENTRY_UPLOAD_MODE 改成 live，填写真实 org、project、Token。
4. 执行 npm run ci。真实模式使用 @sentry/vite-plugin 上传，并清理 .map；上传错误会阻止构建。
5. 发布本次生成的 dist。点击测试按钮，在 Sentry 后台确认事件和源码定位。

## 未来 Jenkins 接入

当前 Docker 流程只启用模拟上传，不需要凭据。Dockerfile 不复制 .env.local。

真实接入时不能只修改本机 .env.local：Docker 构建需要额外接入公开配置以及 Jenkins Credentials 中的 Token。

- DSN、environment、release 可以使用构建参数。
- Token 应使用 BuildKit secret mount，并仅在 npm run ci 的构建步骤临时读取。
- 现有 Jenkins Docker CLI 尚未配置 Buildx，需要先升级构建工具，再接入 secret。
- 不允许把 Token 用 Docker ARG/ENV、VITE_*、Git 文件传入。

这次没有改动 Jenkins 的真实上传凭据通道，也没有进行真实网络上报。模拟不等于已验证 Sentry 真实接收或源码还原。

## 检查

npm run ci 包含 SDK 无网络集成测试，以及 sourcemap 清理后的产物检查。

包体积限制保持：250 KiB raw、100 KiB gzip。接入 SDK 后约 178.9 KiB raw / 65.2 KiB gzip。

官方参考：https://docs.sentry.io/platforms/javascript/guides/vue/
