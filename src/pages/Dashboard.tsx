import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import { CircleAlert, Check, Download, FileUp, RefreshCw } from 'lucide-react';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<{ name: string; type: string; content: string }[]>([]);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerate = () => {
    if (!prompt.trim()) {
      setError('Please enter a prompt for the AI');
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
      
      // Update user's word count in storage
      if (user) {
        const updatedUser = {
          ...user,
          wordsUsed: (user.wordsUsed || 0) + words
        };
        updateUser(updatedUser);
      }
      
      setIsGenerating(false);
    }, 2000);
  };

  const generateAIResponse = (userPrompt: string) => {
    // This is a simulation of an AI response
    // In a real app, this would call an API
    const responses = [
      `The concept of Tawhid (monotheism) is central to Islamic theology. It refers to the belief in the oneness of Allah and is the most fundamental principle of faith. Tawhid can be categorized into three types: Tawhid al-Rububiyyah (oneness of lordship), Tawhid al-Uluhiyyah (oneness of worship), and Tawhid al-Asma wa-Sifat (oneness of names and attributes).

      Scholars throughout Islamic history have elaborated on the concept of Tawhid. Ibn Taymiyyah, a prominent 13th-century scholar, emphasized the practical implementation of Tawhid in daily life, arguing that true monotheism extends beyond mere recognition of Allah's existence to complete submission to His will in all matters.

      Modern applications of Tawhid include its influence on Islamic economics, which prohibits interest-based transactions as they contradict the principle of Divine ownership. Similarly, Islamic ethics and governance are rooted in the understanding that all authority ultimately belongs to Allah.`,
      
      `The Qur'an serves as the primary source of Islamic law (Shariah) and contains guidance on various aspects of human life. Its revelation spanned approximately 23 years of Prophet Muhammad's life, with portions revealed in Mecca and others in Medina, each addressing different aspects of the developing Muslim community.

      Qur'anic exegesis (Tafsir) has evolved significantly since the early days of Islam. Scholars employ various methodologies, including textual analysis, consideration of historical context, and reference to authenticated hadith. Contemporary approaches also incorporate interdisciplinary perspectives while maintaining fidelity to traditional Islamic scholarship.

      The literary style of the Qur'an is considered inimitable (I'jaz), featuring distinctive rhetorical devices, narrative techniques, and linguistic structures that have influenced Arabic literature and culture profoundly. Modern scholarship continues to explore the Qur'an's linguistic features, historical context, and interpretive traditions.`,
      
      `Islamic education (Tarbiyah) has historically integrated both religious and secular knowledge, emphasizing holistic development. Traditional institutions like madrasas focused on Qur'anic memorization, hadith studies, jurisprudence, and classical Arabic, while also teaching mathematics, astronomy, and medicine.

      Contemporary Islamic education faces challenges of balancing traditional methods with modern pedagogical approaches. Various models have emerged, from integrated curricula that incorporate Islamic perspectives into standard subjects to specialized programs focusing on Islamic sciences.

      Educational technology offers opportunities for enhancing Islamic education through virtual learning environments, digital Qur'anic resources, and interactive platforms. These innovations make Islamic knowledge more accessible while preserving the importance of the teacher-student relationship (isnad) in knowledge transmission.`,
    ];
    
    // Choose a response based on the prompt
    let response = responses[Math.floor(Math.random() * responses.length)];
    
    // Personalize it slightly based on prompt
    response = `Regarding "${userPrompt}":\n\n${response}`;
    
    return response;
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    Array.from(files).forEach(file => {
      // Check file type
      if (!file.type.match('application/pdf') && !file.type.match('image/*')) {
        setError('Only PDF and image files are supported');
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && event.target.result) {
          const fileContent = event.target.result as string;
          setUploadedFiles(prev => [
            ...prev, 
            { name: file.name, type: file.type, content: fileContent }
          ]);
        }
      };
      
      if (file.type.match('application/pdf')) {
        reader.readAsDataURL(file);
      } else {
        reader.readAsDataURL(file);
      }
    });
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Welcome, {user?.username}</h1>
          <p className="text-gray-600 mb-4">
            You have used {user?.wordsUsed || 0} words so far.
          </p>
          
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center text-sm">
              <CircleAlert className="h-5 w-5 mr-2" />
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Generate Content</h2>
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
                disabled={isGenerating}
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
          
          <div>
            <h2 className="text-xl font-semibold mb-4">Upload Files</h2>
            <p className="text-sm text-gray-600 mb-3">
              Upload PDFs or images to enhance your research
            </p>
            
            <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="application/pdf,image/*"
                multiple
                onChange={handleFileUpload}
              />
              <FileUp className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600 mb-2">Drag and drop files here, or</p>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
              >
                Browse Files
              </button>
              <p className="text-xs text-gray-500 mt-2">
                Supported formats: PDF, JPG, PNG, GIF
              </p>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-medium mb-2">Uploaded Files</h3>
                <ul className="divide-y divide-gray-200">
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="py-3 flex items-center">
                      <Check className="h-5 w-5 text-green-500 mr-2" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      {file.type.includes('image') && (
                        <img 
                          src={file.content} 
                          alt={file.name} 
                          className="h-10 ml-auto object-contain" 
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
