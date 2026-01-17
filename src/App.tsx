import { useState } from 'react';
import { Canvas } from './components/editor/Canvas';
import { Sidebar } from './components/editor/Sidebar';
import { PropertiesPanel } from './components/editor/PropertiesPanel';
import { Code, Play, Smartphone, Monitor } from 'lucide-react';
import { useEditorStore } from './lib/store';
import { generateCode } from './lib/generator';

function App() {
  const { page } = useEditorStore();
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');

  const handleExport = () => {
    const json = JSON.stringify(page, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'page-schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePublish = () => {
    const code = generateCode(page);
    const blob = new Blob([code], { type: 'text/typescript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Page.tsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-white text-gray-900 font-sans">
      {/* Toolbar */}
      <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-50">
        <div className="flex items-center gap-3 w-80">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-bold text-lg">
            B
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-sm leading-tight">Untitled Project</span>
            <span className="text-[10px] text-gray-500">Auto-saved</span>
          </div>
        </div>

        {/* Center Actions */}
        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setViewMode('desktop')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Monitor size={16} />
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Smartphone size={16} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-80 justify-end">
          <button
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
            onClick={handleExport}
          >
            <Code size={14} />
            JSON
          </button>
          <button
            onClick={handlePublish}
            className="flex items-center gap-2 px-4 py-1.5 text-xs font-semibold text-white bg-black hover:bg-gray-800 rounded-md transition-all shadow-sm"
          >
            <Play size={14} />
            Export Code
          </button>
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex overflow-hidden">
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </main>
    </div>
  );
}

export default App;
