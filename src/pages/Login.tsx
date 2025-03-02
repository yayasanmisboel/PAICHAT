import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, User } from 'lucide-react';
import NavBar from '../components/NavBar';

interface LoginFormData {
  username: string;
  password: string;
}

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    setLoginError('');
    
    try {
      const success = await login(data.username, data.password);
      
      if (success) {
        if (data.username === 'iandjuhana') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setLoginError('Invalid username or password');
      }
    } catch (error) {
      setLoginError('An error occurred during login');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Login to IslamEdu AI</h1>
            <p className="text-gray-600 mt-2">
              Access your account to generate content and manage resources
            </p>
          </div>
          
          {loginError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {loginError}
            </div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="username">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  type="text"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2.5"
                  placeholder="Enter your username"
                  {...register('username', { required: 'Username is required' })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  type="password"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2.5"
                  placeholder="Enter your password"
                  {...register('password', { required: 'Password is required' })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-green-600 hover:text-green-800 font-medium">
                Register here
              </Link>
            </p>
            <p className="text-sm text-gray-600 mt-2">
              Or{' '}
              <Link to="/demo" className="text-green-600 hover:text-green-800 font-medium">
                try our demo
              </Link>{' '}
              without registration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
