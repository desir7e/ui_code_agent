import React from 'react';
import ReactMarkdown from 'react-markdown';
import { TrendingUp, TrendingDown, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

// 1. 零件库：预设的理财图表组件
const ProfitChart = ({ data, title }: { data: number[], title: string }) => {
  const totalProfit = data.reduce((a, b) => a + b, 0);
  const isPositive = totalProfit >= 0;

  return (
    <div className="my-4 p-4 border-2 border-green-500 rounded-xl bg-white shadow-lg">
      <div className="flex items-center justify-between mb-3">
        <h4 className="font-bold text-green-700 flex items-center gap-2">
          <BarChart3 size={18} className="text-green-600" />
          {title}
        </h4>
        <div className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold ${isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {isPositive ? (
            <>
              <TrendingUp size={14} />
              +{totalProfit}
            </>
          ) : (
            <>
              <TrendingDown size={14} />
              {totalProfit}
            </>
          )}
        </div>
      </div>
      <div className="flex items-end h-20 gap-2">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div
              className={`w-full ${v >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
              style={{ height: `${Math.abs(v)}%` }}
            />
            <span className="text-[10px] mt-1 font-medium">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-500 mt-2 text-center">AI 自动生成的交互图表</p>
    </div>
  );
};

const MyLibrary = { ProfitChart };

// 2. 增强的渲染引擎
export const AIResponseRenderer = ({ rawText }: { rawText: string }) => {
  return (
    <ReactMarkdown
      components={{
        p: ({ children }) => {
          const content = children?.[0];
          if (typeof content !== 'string') return <p className="text-gray-700 mb-3">{children}</p>;

          const match = content.match(/<(\w+)\s+(.*)\s*\/>/);

          if (match) {
            const [_, componentName, propsString] = match;
            const Component = MyLibrary[componentName as keyof typeof MyLibrary];

            if (Component) {
              try {
                const dataMatch = propsString.match(/data=\{\[(.*?)\]\}/);
                const titleMatch = propsString.match(/title="(.*?)"/);

                const data = dataMatch ? dataMatch[1].split(',').map(Number) : [];
                const title = titleMatch ? titleMatch[1] : '';

                return <Component data={data} title={title} />;
              } catch (e) {
                return <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
                  <AlertCircle size={16} />
                  <span className="text-sm">组件渲染失败</span>
                </div>;
              }
            }
          }
          return <p className="text-gray-700 leading-relaxed mb-3">{children}</p>;
        },
        h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-3 mt-4">{children}</h1>,
        h2: ({ children }) => <h2 className="text-xl font-bold text-gray-800 mb-2 mt-3">{children}</h2>,
        ul: ({ children }) => <ul className="list-disc list-inside mb-3 space-y-1 text-gray-700">{children}</ul>,
        li: ({ children }) => <li className="ml-2">{children}</li>,
        code: ({ inline, children }) => {
          if (inline) {
            return <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono text-red-600">{children}</code>;
          }
          return <code className="block bg-gray-800 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto mb-3">{children}</code>;
        },
        blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-3 py-2 mb-3 italic text-gray-600 bg-blue-50 text-sm">{children}</blockquote>,
        strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
      }}
    >
      {rawText}
    </ReactMarkdown>
  );
};