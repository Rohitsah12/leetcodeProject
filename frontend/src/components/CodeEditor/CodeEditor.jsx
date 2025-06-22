import React, { useState, useRef, useEffect } from 'react';
import { Copy, RotateCcw, Settings, Maximize2, ZoomIn, ZoomOut } from 'lucide-react';

const CodeEditor = ({ 
  code, 
  onChange, 
  language, 
  onLanguageChange, 
  availableLanguages = [],
  fontSize = 14,
  onFontSizeChange,
  placeholder = "Write your code here..."
}) => {
  const textareaRef = useRef(null);
  const [lineNumbers, setLineNumbers] = useState([1]);

  // Update line numbers when code changes
  useEffect(() => {
    const lines = code.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [code]);

  // Handle tab key for indentation
  const handleKeyDown = (e) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      const newCode = code.substring(0, start) + '  ' + code.substring(end);
      onChange(newCode);
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        e.target.selectionStart = e.target.selectionEnd = start + 2;
      }, 0);
    }
  };

  // Copy code to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  // Reset code
  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset your code?')) {
      onChange('');
    }
  };

  // Get language display name
  const getLanguageDisplay = (lang) => {
    const langMap = {
      'javascript': 'JavaScript',
      'c++': 'C++',
      'java': 'Java'
    };
    return langMap[lang] || lang;
  };

  return (
    <div className="flex flex-col h-full bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-white font-medium">Code</span>
          
          {/* Language Selector */}
          {availableLanguages.length > 0 && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="bg-gray-700 text-white px-3 py-1 rounded border border-gray-600 focus:border-orange-500 focus:outline-none"
            >
              {availableLanguages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {getLanguageDisplay(lang.language)}
                </option>
              ))}
            </select>
          )}
          
          <span className="text-gray-400 text-sm">Auto</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Font Size Controls */}
          <button
            onClick={() => onFontSizeChange && onFontSizeChange(Math.max(10, fontSize - 1))}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Decrease font size"
          >
            <ZoomOut size={14} />
          </button>
          <span className="text-gray-400 text-xs px-1">{fontSize}px</span>
          <button
            onClick={() => onFontSizeChange && onFontSizeChange(Math.min(24, fontSize + 1))}
            className="p-1 text-gray-400 hover:text-white transition-colors"
            title="Increase font size"
          >
            <ZoomIn size={14} />
          </button>
          
          <div className="w-px h-4 bg-gray-600 mx-1" />
          
          <button
            onClick={handleReset}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Reset code"
          >
            <RotateCcw size={16} />
          </button>
          <button
            onClick={handleCopy}
            className="p-2 text-gray-400 hover:text-white transition-colors"
            title="Copy code"
          >
            <Copy size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Settings size={16} />
          </button>
          <button className="p-2 text-gray-400 hover:text-white transition-colors">
            <Maximize2 size={16} />
          </button>
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex relative">
        {/* Line Numbers */}
        <div 
          className="bg-gray-800 text-gray-500 text-right pr-3 py-4 select-none border-r border-gray-700"
          style={{ fontSize: `${fontSize}px`, lineHeight: '1.5', minWidth: '3rem' }}
        >
          {lineNumbers.map((num) => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>

        {/* Code Input */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full h-full bg-transparent text-white p-4 font-mono resize-none focus:outline-none leading-6"
            style={{ fontSize: `${fontSize}px`, lineHeight: '1.5' }}
            placeholder={placeholder}
            spellCheck={false}
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;