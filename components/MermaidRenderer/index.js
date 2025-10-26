import { useEffect } from "react";

/**
 * MermaidRenderer 组件
 * 用于在客户端渲染页面中的 mermaid 代码块
 * 该组件会自动查找所有 .language-mermaid 代码块并渲染为图表
 */
export default function MermaidRenderer() {
  useEffect(() => {
    const renderMermaidCharts = async () => {
      try {
        // 查找所有 mermaid 代码块
        const mermaidBlocks = document.querySelectorAll(
          ".mermaid:not([data-processed])"
        );

        console.log(
          "MermaidRenderer: mermaidBlocks.length = ",
          mermaidBlocks.length
        );

        if (!mermaidBlocks.length) return;

        // 动态导入 mermaid（ESM 模块）
        const mermaid = (await import("mermaid")).default;

        // 初始化 mermaid 配置
        mermaid.initialize({
          startOnLoad: true,
          theme: "dark", // 暗色主题
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
          },
        });
      } catch (error) {
        console.error("Failed to load mermaid:", error);
      }
    };

    renderMermaidCharts();
  }, []); // 空依赖数组，只在组件挂载时执行一次

  // 这个组件不渲染任何可见内容
  return null;
}
