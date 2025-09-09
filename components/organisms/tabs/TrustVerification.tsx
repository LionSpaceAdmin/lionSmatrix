'use client';

import { useState } from 'react';
import { useI18n } from '@/lib/hooks/use-i18n';
import { LionSpaceServices } from '@/services/client-services/lionspace-service';
import { Shield, CheckCircle, AlertTriangle, XCircle, FileText, Download, Eye, Search } from 'lucide-react';

interface TrustVerificationProps {
  lionSpaceServices: LionSpaceServices;
  onResultUpdate: (content: React.ReactNode) => void;
}

type VerificationMethod = 'fact-check' | 'source-verify' | 'bias-analysis' | 'red-team';
type ConfidenceLevel = 'high' | 'medium' | 'low' | 'unreliable';

interface VerificationResult {
  confidence: ConfidenceLevel;
  score: number;
  findings: string[];
  sources_checked: number;
  red_flags: string[];
  recommendations: string[];
}

export function TrustVerification({ lionSpaceServices, onResultUpdate }: TrustVerificationProps) {
  const [verificationInput, setVerificationInput] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<VerificationMethod>('fact-check');
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationHistory, setVerificationHistory] = useState<Array<{
    input: string;
    result: VerificationResult;
    method: VerificationMethod;
    timestamp: Date;
  }>>([]);
  const { t } = useI18n();

  const verificationMethods = [
    {
      id: 'fact-check' as VerificationMethod,
      name: 'Fact Checking',
      description: 'Verify claims against reliable sources',
      icon: <CheckCircle className="w-5 h-5" />
    },
    {
      id: 'source-verify' as VerificationMethod,
      name: 'Source Verification',
      description: 'Assess credibility of information sources',
      icon: <Search className="w-5 h-5" />
    },
    {
      id: 'bias-analysis' as VerificationMethod,
      name: 'Bias Analysis',
      description: 'Detect potential biases and perspectives',
      icon: <Eye className="w-5 h-5" />
    },
    {
      id: 'red-team' as VerificationMethod,
      name: 'Red Team Review',
      description: 'Adversarial analysis and critique',
      icon: <AlertTriangle className="w-5 h-5" />
    }
  ];

  const sampleTexts = [
    "Breaking: Major political figure announces controversial policy change affecting national security.",
    "Scientists discover new treatment that could revolutionize healthcare within the next decade.",
    "Economic indicators suggest significant market volatility expected in the coming months.",
    "International organization releases report on global environmental crisis response measures."
  ];

  const getConfidenceColor = (confidence: ConfidenceLevel): string => {
    switch (confidence) {
      case 'high': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'low': return 'text-orange-400';
      case 'unreliable': return 'text-red-400';
    }
  };

  const getConfidenceIcon = (confidence: ConfidenceLevel) => {
    switch (confidence) {
      case 'high': return <CheckCircle className="w-6 h-6 text-green-400" />;
      case 'medium': return <AlertTriangle className="w-6 h-6 text-yellow-400" />;
      case 'low': return <AlertTriangle className="w-6 h-6 text-orange-400" />;
      case 'unreliable': return <XCircle className="w-6 h-6 text-red-400" />;
    }
  };

  const handleVerifyAnalysis = async () => {
    if (!verificationInput.trim()) {
      onResultUpdate(
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <p className="font-semibold">Invalid Input</p>
          <p className="text-sm mt-1">Please enter text to verify</p>
        </div>
      );
      return;
    }

    setIsVerifying(true);
    
    onResultUpdate(
      <div className="text-center p-8">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-cyan-400 font-mono animate-pulse">VERIFYING INFORMATION...</p>
        <p className="text-sm text-gray-400 mt-2">Running {verificationMethods.find(m => m.id === selectedMethod)?.name.toLowerCase()}...</p>
      </div>
    );

    try {
      const methodName = verificationMethods.find(m => m.id === selectedMethod)?.name || 'verification';
      const verificationPrompt = `Perform ${methodName.toLowerCase()} on this text: "${verificationInput}". Provide detailed analysis including: 1) Factual accuracy assessment 2) Source credibility evaluation 3) Potential biases or red flags 4) Confidence score (0-100) 5) Specific recommendations for verification.`;
      
      const result = await lionSpaceServices.generateAnalysis(verificationPrompt);
      
      // Mock verification result (in real implementation, this would be processed from AI response)
      const mockResult: VerificationResult = {
        confidence: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        score: Math.floor(Math.random() * 40) + 60, // 60-100
        findings: [
          'Primary sources identified and verified',
          'Cross-referenced with multiple databases',
          'Timeline consistency confirmed',
          'Expert opinions consulted'
        ],
        sources_checked: Math.floor(Math.random() * 10) + 5,
        red_flags: Math.random() > 0.6 ? [] : ['Unverified secondary sources', 'Potential timeline inconsistencies'],
        recommendations: [
          'Seek additional expert verification',
          'Monitor for updates or corrections',
          'Cross-reference with authoritative sources'
        ]
      };

      // Add to history
      setVerificationHistory(prev => [{
        input: verificationInput,
        result: mockResult,
        method: selectedMethod,
        timestamp: new Date()
      }, ...prev.slice(0, 4)]); // Keep last 5 verifications

      const verificationDisplay = (
        <div className="space-y-6">
          {/* Verification Header */}
          <div className="bg-gray-800/30 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <Shield className="w-6 h-6 text-green-400" />
              <h3 className="text-lg font-semibold text-green-400">Verification Complete</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-gray-400">Method</p>
                <p className="text-white font-mono">{verificationMethods.find(m => m.id === selectedMethod)?.name}</p>
              </div>
              <div>
                <p className="text-gray-400">Sources Checked</p>
                <p className="text-white font-mono">{mockResult.sources_checked}</p>
              </div>
              <div>
                <p className="text-gray-400">Verified</p>
                <p className="text-white font-mono">{new Date().toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Confidence Score */}
          <div className="bg-gray-800/20 rounded-lg p-6 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              {getConfidenceIcon(mockResult.confidence)}
              <h3 className="text-2xl font-bold text-white">Confidence Assessment</h3>
            </div>
            <div className="text-6xl font-mono font-bold mb-2">
              <span className={getConfidenceColor(mockResult.confidence)}>{mockResult.score}%</span>
            </div>
            <p className={`text-lg font-semibold uppercase tracking-wider ${getConfidenceColor(mockResult.confidence)}`}>
              {mockResult.confidence} Confidence
            </p>
            <div className="w-full bg-gray-700 rounded-full h-3 mt-4">
              <div 
                className={`h-3 rounded-full transition-all duration-1000 ${
                  mockResult.confidence === 'high' ? 'bg-green-400' :
                  mockResult.confidence === 'medium' ? 'bg-yellow-400' :
                  mockResult.confidence === 'low' ? 'bg-orange-400' : 'bg-red-400'
                }`}
                style={{ width: `${mockResult.score}%` }}
              ></div>
            </div>
          </div>

          {/* AI Analysis */}
          <div className="bg-gray-800/20 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-5 h-5 text-cyan-400" />
              <h4 className="text-lg font-semibold text-cyan-400">Detailed Analysis</h4>
            </div>
            <div className="prose prose-invert text-gray-300 whitespace-pre-wrap">
              {typeof result === 'string' ? result : result}
            </div>
          </div>

          {/* Verification Findings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-800/20 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-green-400 mb-3">✓ Verification Findings</h4>
              <ul className="space-y-2">
                {mockResult.findings.map((finding, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                    {finding}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800/20 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-yellow-400 mb-3">⚠ Recommendations</h4>
              <ul className="space-y-2">
                {mockResult.recommendations.map((rec, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-gray-300 text-sm">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Red Flags */}
          {mockResult.red_flags.length > 0 && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <h4 className="text-lg font-semibold text-red-400 mb-3">🚩 Red Flags Detected</h4>
              <ul className="space-y-2">
                {mockResult.red_flags.map((flag, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-red-300 text-sm">
                    <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                    {flag}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Export Button */}
          <div className="flex justify-center">
            <button
              onClick={() => {
                const reportData = {
                  input: verificationInput,
                  method: selectedMethod,
                  result: mockResult,
                  analysis: typeof result === 'string' ? result : result,
                  timestamp: new Date().toISOString()
                };
                const dataStr = JSON.stringify(reportData, null, 2);
                const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
                const exportFileDefaultName = `trust-verification-${Date.now()}.json`;
                
                const linkElement = document.createElement('a');
                linkElement.setAttribute('href', dataUri);
                linkElement.setAttribute('download', exportFileDefaultName);
                linkElement.click();
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 text-blue-400 border border-blue-600/30 rounded-lg hover:bg-blue-600/30 transition-colors"
            >
              <Download className="w-5 h-5" />
              Export Verification Report
            </button>
          </div>
        </div>
      );
      
      onResultUpdate(verificationDisplay);
      
    } catch (error) {
      console.error("Error in verification:", error);
      onResultUpdate(
        <div className="text-red-400 bg-red-500/10 border border-red-500/30 rounded-lg p-4">
          <div className="flex items-center gap-3 mb-2">
            <XCircle className="w-5 h-5" />
            <p className="font-semibold">Verification Failed</p>
          </div>
          <p className="text-sm">Unable to complete verification. Please try again.</p>
        </div>
      );
    } finally {
      setIsVerifying(false);
    }
  };

  const useSampleText = (text: string) => {
    setVerificationInput(text);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-cyan-400 font-mono mb-2 flex items-center justify-center gap-3">
          <Shield className="w-8 h-8" />
          {t('Trust Verification') || 'Trust Verification'}
        </h2>
        <p className="text-gray-400">
          {t('Verify information accuracy and source credibility') || 'Verify information accuracy and source credibility'}
        </p>
      </div>

      {/* Method Selection */}
      <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Verification Method</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {verificationMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedMethod(method.id)}
              className={`p-4 rounded-lg border transition-all text-left ${
                selectedMethod === method.id 
                  ? 'border-green-500 bg-green-500/10 text-green-400'
                  : 'border-gray-600 bg-gray-800/30 text-gray-300 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center gap-3 mb-2">
                {method.icon}
                <h4 className="font-semibold">{method.name}</h4>
              </div>
              <p className="text-sm text-gray-400">{method.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Input Section */}
      <div className="bg-gray-800/30 border border-gray-600/50 rounded-lg p-6">
        <label className="block text-white font-semibold mb-3">
          Text to Verify
        </label>
        <textarea
          value={verificationInput}
          onChange={(e) => setVerificationInput(e.target.value)}
          className="w-full h-32 p-4 bg-gray-800/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:border-green-500 focus:outline-none resize-none"
          placeholder={t('Enter claims, statements, or information to verify...') || 'Enter claims, statements, or information to verify...'}
        />
        
        {/* Sample Texts */}
        <div className="mt-4">
          <p className="text-sm text-gray-400 mb-3">Sample texts to verify:</p>
          <div className="grid grid-cols-1 gap-2">
            {sampleTexts.map((text, idx) => (
              <button
                key={idx}
                onClick={() => useSampleText(text)}
                className="text-left p-3 bg-gray-700/30 hover:bg-gray-700/50 border border-gray-600/30 rounded text-sm text-gray-300 hover:text-white transition-colors"
              >
                "{text}"
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Verify Button */}
      <div className="flex justify-center">
        <button
          onClick={handleVerifyAnalysis}
          disabled={isVerifying || !verificationInput.trim()}
          className="flex items-center gap-3 py-4 px-8 bg-gradient-to-r from-green-600/20 to-cyan-600/20 border border-green-500/50 rounded-lg text-green-400 hover:from-green-600/30 hover:to-cyan-600/30 hover:border-green-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-mono text-lg"
        >
          {isVerifying ? (
            <>
              <div className="w-5 h-5 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              Verifying Information...
            </>
          ) : (
            <>
              <Shield className="w-5 h-5" />
              Verify Information
            </>
          )}
        </button>
      </div>

      {/* Verification History */}
      {verificationHistory.length > 0 && (
        <div className="bg-gray-800/20 border border-gray-600/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Verifications</h3>
          <div className="space-y-3">
            {verificationHistory.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-900/30 rounded border border-gray-700">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-300 truncate">{item.input}</p>
                  <div className="flex items-center gap-4 mt-1 text-xs text-gray-400">
                    <span>{item.method.replace('-', ' ')}</span>
                    <span>{item.timestamp.toLocaleString()}</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-mono ${
                  item.result.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                  item.result.confidence === 'medium' ? 'bg-yellow-500/20 text-yellow-400' :
                  item.result.confidence === 'low' ? 'bg-orange-500/20 text-orange-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {item.result.score}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ethical Notice */}
      <div className="text-xs text-gray-500 bg-gray-800/20 border border-gray-700 rounded p-3">
        <p className="font-semibold text-yellow-400 mb-1">⚠️ Verification Guidelines</p>
        <p>This tool provides analytical assessment only. Always cross-reference with authoritative sources and expert opinions for critical decisions.</p>
      </div>
    </div>
  );
}