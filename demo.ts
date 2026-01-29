import React from 'react';
import ReactMarkdown from 'react-markdown';

// 1. 零件库：预设的理财图表组件
const ProfitChart = ({ data, title }: { data: number[], title: string }) => (
  <div className="my-4 p-4 border-2 border-green-500 rounded-xl bg-white shadow-lg">
    <h4 className="font-bold text-green-700 mb-2">📈 {title}</h4>
    <div className="flex items-end h-20 gap-2">
      {data.map((v, i) => (
        <div key={i} className="flex-1 bg-green-400" style={{ height: `${Math.abs(v)}%` }} />
      ))}
    </div>
    <p className="text-xs text-gray-500 mt-2 text-center">AI 自动生成的交互图表</p>
  </div>
);

const MyLibrary = { ProfitChart };

// 2. 渲染引擎
export const AIResponseRenderer = ({ rawText }: { rawText: string }) => {
  return (
    <ReactMarkdown
      components={{
        // 拦截文本段落
        p: ({ children }) => {
          const content = children?.[0];
          if (typeof content !== 'string') return <p>{children}</p>;

          // 匹配 <ComponentName props /> 的正则
          const match = content.match(/<(\w+)\s+(.*)\s*\/>/);
          
          if (match) {
            const [_, componentName, propsString] = match;
            const Component = MyLibrary[componentName as keyof typeof MyLibrary];

            if (Component) {
              // 简单的属性解析逻辑（实际可用 JSON.parse 增强）
              // 这里假设 AI 输出的是规范的 JSON 格式属性
              try {
                // 演示目的：手动解析简单的属性
                const data = [100, -20, 50]; // 实际应用中需从 propsString 解析
                return <Component data={data} title="三日收益动态" />;
              } catch (e) {
                return <p className="text-red-500">组件渲染失败</p>;
              }
            }
          }
          return <p>{children}</p>;
        }
      }}
    >
      {rawText}
    </ReactMarkdown>
  );
};