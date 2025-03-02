import { Link } from 'react-router-dom';
import { BookOpen, Check, FileText, Upload } from 'lucide-react';
import NavBar from '../components/NavBar';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="lg:w-1/2">
                <h1 className="text-4xl font-bold mb-4">
                  AI-Powered Islamic Education Resources
                </h1>
                <p className="text-xl mb-8">
                  Generate plagiarism-free content for your Islamic studies courses and research.
                </p>
                <div className="space-x-4">
                  <Link
                    to="/register"
                    className="bg-white text-green-700 px-6 py-2 rounded-md font-medium hover:bg-gray-100"
                  >
                    Register Now
                  </Link>
                  <Link
                    to="/demo"
                    className="bg-transparent border border-white text-white px-6 py-2 rounded-md font-medium hover:bg-green-800"
                  >
                    Try Demo
                  </Link>
                </div>
              </div>
              <div className="hidden lg:block lg:w-1/2">
                <img 
                  src="https://images.unsplash.com/photo-1542816643-1c25ba8d6937?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80" 
                  alt="Islamic Education" 
                  className="rounded-lg shadow-lg w-full object-cover h-80"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Features Section */}
        <div className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              Key Features
            </h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <FileText className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">AI Content Generation</h3>
                <p className="text-gray-600">
                  Create unique, plagiarism-free content for your Islamic studies courses with our AI technology.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <Upload className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">File Upload</h3>
                <p className="text-gray-600">
                  Upload PDFs and images to enhance your research and get AI-assisted analysis.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 text-center">
                <div className="flex justify-center mb-4">
                  <Check className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Approved Access</h3>
                <p className="text-gray-600">
                  Secure access with admin approval ensures quality and authenticity of our platform.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* CTA Section */}
        <div className="bg-gray-50 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-gray-600 max-w-3xl mx-auto">
              Join our platform and access AI-powered tools specifically designed for Islamic education.
            </p>
            <Link
              to="/register"
              className="bg-green-600 text-white px-6 py-3 rounded-md font-medium hover:bg-green-700"
            >
              Register Now
            </Link>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <BookOpen className="h-8 w-8 text-green-400" />
              <span className="ml-2 text-xl font-semibold">IslamEdu AI</span>
            </div>
            <div className="text-gray-400 text-sm">
              © 2023 IslamEdu AI. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
