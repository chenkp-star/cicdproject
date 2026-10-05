// 无网络 transport：用于模拟模式和隔离测试。
export function createMockTransport() {
  return {
    send() {
      console.info('[Sentry MOCK] 已捕获监控事件，仅本地模拟，未发送网络请求。');
      return Promise.resolve({ statusCode: 200 });
    },
    flush() { return Promise.resolve(true); },
  };
}
