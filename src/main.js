import './style.css';

document.querySelector('#app').innerHTML = `
  <main class="shell">
    <nav class="nav">
      <div class="brand"><span class="brand-mark">C</span><span>CloudBoard</span></div>
      <span class="status"><i></i> Production ready</span>
    </nav>
    <section class="hero">
      <p class="eyebrow">FRONTEND DELIVERY PLATFORM</p>
      <h1>从提交代码到上线，<br /><em>每一步都可追踪。</em></h1>
      <p class="intro">一个使用 Vite 构建的企业前端示例。GitHub、Jenkins、Docker 和 Nginx 共同完成自动化交付。</p>
      <div class="actions"><a class="primary" href="#pipeline">查看交付流程 <span>→</span></a><a class="secondary" href="https://vite.dev" target="_blank" rel="noreferrer">了解 Vite</a></div>
    </section>
    <section id="pipeline" class="pipeline">
      <div class="section-heading"><p class="eyebrow">DELIVERY PIPELINE</p><h2>一次提交，四个阶段</h2></div>
      <div class="steps"><article><strong>01</strong><h3>Commit</h3><p>GitHub 管理源码和 Pull Request。</p></article><article><strong>02</strong><h3>Verify</h3><p>Jenkins 运行测试并检查构建结果。</p></article><article><strong>03</strong><h3>Package</h3><p>Docker 固化 Vite 产物和 Nginx 环境。</p></article><article><strong>04</strong><h3>Deliver</h3><p>Nginx 提供高性能静态页面服务。</p></article></div>
    </section>
  </main>
`;
