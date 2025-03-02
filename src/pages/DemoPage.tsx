import { useState, useEffect } from 'react';
import NavBar from '../components/NavBar';
import { Link } from 'react-router-dom';
import { ArrowRight, CircleAlert, Download, RefreshCw } from 'lucide-react';

const DemoPage = () => {
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [error, setError] = useState('');
  const [wordsRemaining, setWordsRemaining] = useState(5000);

  // Load and calculate remaining words on component mount
  useEffect(() => {
    const today = new Date().toDateString();
    const demoUsage = JSON.parse(localStorage.getItem('demoUsage') || '{}');
    
    // Check if there's usage data for today
    if (!demoUsage[today]) {
      demoUsage[today] = 0;
      localStorage.setItem('demoUsage', JSON.stringify(demoUsage));
    }
    
    setWordsRemaining(Math.max(0, 5000 - demoUsage[today]));
  }, []);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for the AI');
      return;
    }
    
    if (wordsRemaining <= 0) {
      setError('You have reached your daily limit of 5000 words. Please register for full access.');
      return;
    }
    
    setError('');
    setIsGenerating(true);
    
    // Simulate AI processing
    setTimeout(() => {
      // Generate text based on prompt
      const generatedContent = generateAIResponse(prompt);
      setGeneratedText(generatedContent);
      
      // Count words
      const words = generatedContent.trim().split(/\s+/).length;
      setWordCount(words);
      
      // Update demo usage in storage
      const today = new Date().toDateString();
      const demoUsage = JSON.parse(localStorage.getItem('demoUsage') || '{}');
      demoUsage[today] = (demoUsage[today] || 0) + words;
      localStorage.setItem('demoUsage', JSON.stringify(demoUsage));
      
      // Update remaining words
      setWordsRemaining(Math.max(0, 5000 - demoUsage[today]));
      
      setIsGenerating(false);
    }, 2000);
  };

  const generateAIResponse = (userPrompt: string) => {
    // This is a simulation of an AI response
    // In a real app, this would call an API
    const responses = [
      `The concept of Tawhid (monotheism) is central to Islamic theology. It refers to the belief in the oneness of Allah and is the most fundamental principle of faith. Tawhid can be categorized into three types: Tawhid al-Rububiyyah (oneness of lordship), Tawhid al-Uluhiyyah (oneness of worship), and Tawhid al-Asma wa-Sifat (oneness of names and attributes).

      The Qur'an emphasizes Tawhid in numerous verses, stating clearly that there is no deity worthy of worship except Allah. This principle distinguishes Islam from polytheistic religions and forms the foundation of Islamic belief and practice.

      In practical terms, Tawhid influences how Muslims approach their daily lives, encouraging them to recognize that all actions should be performed with the consciousness that Allah is One and that all worship and devotion should be directed solely to Him.`,
      
      `Islamic ethics and morality are derived from the Qur'an and the Sunnah of Prophet Muhammad (peace be upon him). These sources provide comprehensive guidance on personal conduct, social interactions, and spiritual development.

      Key ethical principles in Islam include honesty (sidq), trustworthiness (amanah), justice (adl), compassion (rahmah), and moderation (wasatiyyah). These values are not merely theoretical concepts but are meant to be actively practiced in all aspects of life.

      The concept of taqwa (God-consciousness) serves as a motivation for ethical behavior, reminding believers that their actions are always witnessed by Allah. This awareness encourages Muslims to strive for moral excellence even in situations where there might be no worldly accountability.`,
      
      `Islamic education historically embraced a holistic approach that integrated religious knowledge with sciences, arts, and humanities. During the Islamic Golden Age, centers of learning like the House of Wisdom in Baghdad brought together scholars from diverse backgrounds to translate, preserve, and advance knowledge.

      Traditional Islamic educational methods emphasize the importance of the teacher-student relationship, memorization of core texts, critical discussion, and practical application of knowledge. This approach ensures both preservation of traditional knowledge and development of analytical skills.

      In contemporary contexts, Islamic education faces the challenge of maintaining its core principles while adapting to modern educational methodologies and addressing current issues. Many institutions are exploring innovative approaches to make Islamic education relevant and engaging for new generations.`,
    ];
    
    // Choose a response based on the prompt
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Personalize it slightly based on prompt
    response = `Regarding "${userPrompt}":\n\n${response}`;
    
    return response;
  };

  const downloadGeneratedText = () => {
    if (!generatedText) return;
    
    const blob = new Blob([generatedText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'generated-content.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Demo Mode</h1>
          <div className="flex justify-between items-center mb-6">
            <p className="text-gray-600">
              Try our AI content generator with a daily limit of 5000 words.
            </p>
            <div className="text-sm font-medium bg-green-100 text-green-800 px-3 py-1 rounded-full">
              {wordsRemaining} words remaining today
            </div>
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center text-sm">
              <CircleAlert className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              What would you like the AI to write about?
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 min-h-[120px]"
              placeholder="Enter a topic or question about Islamic education..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <div className="mt-3 flex justify-end">
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 flex items-center"
                onClick={handleGenerate}
                disabled={isGenerating || wordsRemaining <= 0}
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate Content'
                )}
              </button>
            </div>
          </div>
          
          {generatedText && (
            <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-medium">Generated Content</h3>
                <button
                  onClick={downloadGeneratedText}
                  className="text-green-600 hover:text-green-700 flex items-center text-sm"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-2">Word count: {wordCount}</p>
              <div className="whitespace-pre-line text-gray-800">
                {generatedText}
              </div>
            </div>
          )}
          
          <div className="mt-8 bg-green-50 p-4 rounded-lg border border-green-100">
            <h2 className="text-lg font-semibold text-green-800 mb-2">Unlock Full Access</h2>
            <p className="text-gray-700 mb-4">
              Register for a full account to enjoy unlimited word generation, file uploads, and more features.
            </p>
            <Link
              to="/register"
              className="flex items-center justify-center bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
            >
              Register Now
              <ArrowRight className="h-4 w-4 ml-2" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoPage;
