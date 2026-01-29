import React from 'react';
import ReactMarkdown from 'react-markdown';
import { TrendingUp, TrendingDown, BarChart3, AlertCircle, CheckCircle } from 'lucide-react';

// 1. 零件库 (MyComponentLibrary)
const MyLibrary = {
  ProfitChart: ({ data, title }: { data: number[], title: string }) => {
    const totalProfit = data.reduce((a, b) => a + b, 0);
    const isPositive = totalProfit >= 0;

    return (
      <div className="my-4 p-4 border-2 border-green-500 rounded-xl bg-white shadow-lg font-sans">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-bold text-green-700 flex items-center gap-2">
            <BarChart3 size={20} className="text-green-600" />
            {title}
          </h4>
          <div className={`flex items-center gap-1 px-2 py-1 rounded ${isPositive ? 'bg-green-100' : 'bg-red-100'}`}>
            {isPositive ? (
              <>
                <TrendingUp size={16} className="text-green-600" />
                <span className="text-xs font-semibold text-green-700">+{totalProfit}</span>
              </>
            ) : (
              <>
                <TrendingDown size={16} className="text-red-600" />
                <span className="text-xs font-semibold text-red-700">{totalProfit}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex items-end h-24 gap-2 border-b border-gray-200">
          {data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center">
              <div
                className={`w-full ${v >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ height: `${Math.min(Math.abs(v), 100)}%` }}
              />
              <span className="text-[10px] mt-1 font-medium">{v}</span>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-gray-400 mt-2 text-center italic">数据由 AI 驱动渲染</p>
      </div>
    );
  },
};

// 2. 模拟 AI 的输出流 (这里就是你之前看到的输入)
const aiResponse = `您好！根据您的要求，我为您生成了最近三天的收益分析。
<ProfitChart data={[80, -30, 65]} title="本周理财收益趋势" />
可以看到第二天的亏损已在第三天补回，整体表现稳健。`;

// 3. 渲染引擎组件
export default function App() {
  return (
    <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-gray-900">AI 聊天预览</h1>
        <p className="text-gray-600 mb-6">使用 React Markdown 和 Lucide React 渲染的交互式内容</p>

        <div className="bg-white p-8 rounded-2xl shadow-md border border-gray-200">
          <ReactMarkdown
            components={{
              p: ({ children }) => {
                const content = children?.[0];
                if (typeof content !== 'string') return <p>{children}</p>;

                // 正则表达式：匹配类似 <ProfitChart data={[...]} title="..." />
                const match = content.match(/<(\w+)\s+(.*)\s*\/>/);

                if (match) {
                  const [_, componentName, propsString] = match;
                  const Component = MyLibrary[componentName as keyof typeof MyLibrary];

                  if (Component) {
                    // 简单的属性解析技巧：将字符串转为对象
                    try {
                      // 利用简单的正则提取 data 和 title
                      const dataMatch = propsString.match(/data=\{\[(.*?)\]\}/);
                      const titleMatch = propsString.match(/title="(.*?)"/);

                      const data = dataMatch ? dataMatch[1].split(',').map(Number) : [];
                      const title = titleMatch ? titleMatch[1] : '';

                      return <Component data={data} title={title} />;
                    } catch (e) {
                      return <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded">
                        <AlertCircle size={18} />
                        <span>组件解析失败</span>
                      </div>;
                    }
                  }
                }
                return <p className="text-gray-700 leading-relaxed mb-4 text-base">{children}</p>;
              },
              h1: ({ children }) => <h1 className="text-2xl font-bold text-gray-900 mb-4 mt-6">{children}</h1>,
              h2: ({ children }) => <h2 className="text-xl font-bold text-gray-800 mb-3 mt-5">{children}</h2>,
              h3: ({ children }) => <h3 className="text-lg font-semibold text-gray-700 mb-2 mt-4">{children}</h3>,
              ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>,
              li: ({ children }) => <li className="ml-2">{children}</li>,
              code: ({ inline, children }) => {
                if (inline) {
                  return <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-red-600">{children}</code>;
                }
                return <code className="block bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm mb-4">{children}</code>;
              },
              blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 italic text-gray-600 bg-blue-50">{children}</blockquote>,
              a: ({ href, children }) => <a href={href} className="text-blue-600 hover:text-blue-800 underline">{children}</a>,
              strong: ({ children }) => <strong className="font-bold text-gray-900">{children}</strong>,
              em: ({ children }) => <em className="italic text-gray-700">{children}</em>,
            }}
          >
            {aiResponse}
          </ReactMarkdown>
        </div>

        <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-green-900">功能已启用</p>
            <p className="text-sm text-green-700 mt-1">项目已集成 react-markdown 和 lucide-react，支持自定义组件渲染</p>
          </div>
        </div>
      </div>
    </div>
  );
}