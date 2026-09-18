import { Component } from "react";

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error("Lingua runtime error", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;
    return (
      <main className="grid min-h-screen place-items-center bg-mist p-6 text-ink dark:bg-dark1 dark:text-white">
        <section className="panel max-w-md p-8 text-center">
          <p className="eyebrow">Lingua cần khởi động lại</p>
          <h1 className="mt-2 font-display text-2xl font-bold">Đã xảy ra lỗi không mong muốn</h1>
          <p className="mt-3 text-sm leading-6 text-ink/55 dark:text-white/55">Dữ liệu đã lưu vẫn được giữ nguyên. Hãy tải lại ứng dụng để tiếp tục phiên học.</p>
          <button onClick={this.handleReload} className="mt-6 rounded-xl bg-ink px-4 py-3 text-sm font-bold text-white dark:bg-lime dark:text-ink">Tải lại ứng dụng</button>
        </section>
      </main>
    );
  }
}
