import React, { useState } from 'react';
import { Play, Send, CheckCircle, XCircle, AlertCircle, Clock } from 'lucide-react';

const TestCasePanel = ({
  testCases = [],
  testResults = null,
  onRunCode,
  onSubmitCode,
  isRunning = false,
  isSubmitting = false,
  canRun = true,
  canSubmit = true
}) => {
  const [activeTab, setActiveTab] = useState('testcase');
  const [selectedTestCase, setSelectedTestCase] = useState(0);

  const getStatusIcon = (statusId) => {
    switch (statusId) {
      case 3: return <CheckCircle size={16} className="text-green-400" />;
      case 4: return <XCircle size={16} className="text-red-400" />;
      default: return <AlertCircle size={16} className="text-yellow-400" />;
    }
  };

  const getStatusText = (statusId) => {
    switch (statusId) {
      case 3: return 'Accepted';
      case 4: return 'Wrong Answer';
      case 5: return 'Time Limit Exceeded';
      case 6: return 'Compilation Error';
      default: return 'Runtime Error';
    }
  };

  return (
    <div className="bg-gray-800 border-t border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700">
        <div className="flex">
          <button
            onClick={() => setActiveTab('testcase')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'testcase'
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Testcase
          </button>
          <button
            onClick={() => setActiveTab('result')}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === 'result'
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Test Result
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRunCode}
            disabled={!canRun || isRunning}
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Running...
              </>
            ) : (
              <>
                <Play size={16} />
                Run
              </>
            )}
          </button>
          
          <button
            onClick={onSubmitCode}
            disabled={!canSubmit || isSubmitting}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Submitting...
              </>
            ) : (
              <>
                <Send size={16} />
                Submit
              </>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 h-48 overflow-y-auto">
        {activeTab === 'testcase' && (
          <div>
            {/* Test Case Selector */}
            {testCases.length > 0 && (
              <div className="flex gap-2 mb-4">
                {testCases.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedTestCase(index)}
                    className={`px-3 py-1 rounded text-sm transition-colors ${
                      selectedTestCase === index
                        ? 'bg-orange-500 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Case {index + 1}
                  </button>
                ))}
              </div>
            )}

            {/* Selected Test Case */}
            {testCases[selectedTestCase] && (
              <div className="space-y-3">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Input:</label>
                  <div className="bg-gray-900 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                    {testCases[selectedTestCase].input}
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Expected Output:</label>
                  <div className="bg-gray-900 p-3 rounded font-mono text-sm whitespace-pre-wrap">
                    {testCases[selectedTestCase].output}
                  </div>
                </div>
                {testCases[selectedTestCase].explaination && (
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Explanation:</label>
                    <div className="bg-gray-900 p-3 rounded text-sm">
                      {testCases[selectedTestCase].explaination}
                    </div>
                  </div>
                )}
              </div>
            )}

            {testCases.length === 0 && (
              <div className="text-gray-400 text-center py-8">
                No test cases available
              </div>
            )}
          </div>
        )}

        {activeTab === 'result' && (
          <div>
            {testResults ? (
              <div className="space-y-4">
                {testResults.error ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-red-400">
                      <XCircle size={16} />
                      <span className="font-medium">Runtime Error</span>
                    </div>
                    <div className="bg-red-900/20 border border-red-700 p-3 rounded">
                      <div className="text-red-400 text-sm font-mono whitespace-pre-wrap">
                        {testResults.error}
                      </div>
                    </div>
                  </div>
                ) : testResults.isSubmission ? (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 ${testResults.accepted ? 'text-green-400' : 'text-red-400'}`}>
                      {testResults.accepted ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      <span className="font-medium">
                        {testResults.accepted ? 'Accepted' : 'Wrong Answer'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="text-gray-400 mb-1">Test Cases Passed</div>
                        <div className="font-mono text-lg">
                          {testResults.passedTestCases}/{testResults.totalTestCases}
                        </div>
                      </div>
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="text-gray-400 mb-1">Runtime</div>
                        <div className="font-mono text-lg">
                          {testResults.runtime?.toFixed(2)}ms
                        </div>
                      </div>
                    </div>

                    {testResults.memory && (
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="text-gray-400 mb-1">Memory Usage</div>
                        <div className="font-mono text-lg">
                          {testResults.memory} KB
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 ${testResults.success ? 'text-green-400' : 'text-red-400'}`}>
                      {testResults.success ? <CheckCircle size={16} /> : <XCircle size={16} />}
                      <span className="font-medium">
                        {testResults.success ? 'All test cases passed' : 'Some test cases failed'}
                      </span>
                    </div>
                    
                    {testResults.testCases && (
                      <div className="space-y-2">
                        {testResults.testCases.map((result, index) => (
                          <div key={index} className="bg-gray-900 p-3 rounded">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {getStatusIcon(result.status_id)}
                                <span className="text-sm font-medium">
                                  Test Case {index + 1}
                                </span>
                              </div>
                              <span className="text-xs text-gray-400">
                                {getStatusText(result.status_id)}
                              </span>
                            </div>
                            
                            {result.status_id !== 3 && (
                              <div className="space-y-2 text-sm">
                                {result.stdout && (
                                  <div>
                                    <div className="text-gray-400">Your Output:</div>
                                    <div className="font-mono text-red-400 bg-red-900/20 p-2 rounded">
                                      {result.stdout}
                                    </div>
                                  </div>
                                )}
                                {result.stderr && (
                                  <div>
                                    <div className="text-gray-400">Error:</div>
                                    <div className="font-mono text-red-400 bg-red-900/20 p-2 rounded">
                                      {result.stderr}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}

                            {result.time && (
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                <Clock size={12} />
                                <span>{parseFloat(result.time).toFixed(2)}ms</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {testResults.runtime && (
                      <div className="bg-gray-900 p-3 rounded">
                        <div className="text-gray-400 mb-1">Total Runtime</div>
                        <div className="font-mono">{testResults.runtime.toFixed(2)}ms</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-gray-400 text-center py-8">
                <div className="mb-2">
                  <Play size={24} className="mx-auto opacity-50" />
                </div>
                <div>Run your code to see the results here</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCasePanel;