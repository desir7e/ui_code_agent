import React from 'react';
import ReactMarkdown from 'react-markdown';

// 1. 零件库 (MyComponentLibrary)
const MyLibrary = {
  ProfitChart: ({ data, title }: { data: number[], title: string }) => (
    <div className="my-4 p-4 border-2 border-green-500 rounded-xl bg-white shadow-lg font-sans">
      <h4 className="font-bold text-green-700 mb-2">📈 {title}</h4>
      <div className="flex items-end h-24 gap-2 border-b border-gray-200">
        {data.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div 
              className={`w-full ${v >= 0 ? 'bg-green-400' : 'bg-red-400'}`} 
              style={{ height: `${Math.min(Math.abs(v), 100)}%` }} 
            />
            <span className="text-[10px] mt-1">{v}</span>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-2 text-center italic">数据由 AI 驱动渲染</p>
    </div>
  ),
};

// 2. 模拟 AI 的输出流 (这里就是你之前看到的输入)
const aiResponse = `您好！根据您的要求，我为您生成了最近三天的收益分析。
<ProfitChart data={[80, -30, 65]} title="本周理财收益趋势" />
可以看到第二天的亏损已在第三天补回，整体表现稳健。`;

// 3. 渲染引擎组件
export default function App() {
  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <h1 className="text-xl font-bold mb-4">AI 聊天预览</h1>
      <div className="max-w-md bg-white p-6 rounded-2xl shadow-md">
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
                    return <span className="text-red-500">组件解析失败</span>;
                  }
                }
              }
              return <p className="text-gray-700 leading-relaxed mb-4">{children}</p>;
            }
          }}
        >
          {aiResponse}
        </ReactMarkdown>
      </div>
    </div>
  );
}