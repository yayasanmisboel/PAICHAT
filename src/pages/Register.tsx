import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AtSign, Lock, Upload, User } from 'lucide-react';
import NavBar from '../components/NavBar';

interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  paymentProof: FileList;
}

const Register = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm<RegisterFormData>();
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [paymentImagePreview, setPaymentImagePreview] = useState<string | null>(null);

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    setRegisterError('');
    
    try {
      // Convert image to base64 for localStorage
      let paymentProofBase64 = '';
      if (data.paymentProof && data.paymentProof.length > 0) {
        const file = data.paymentProof[0];
        const reader = new FileReader();
        
        paymentProofBase64 = await new Promise((resolve) => {
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(file);
        });
      }
      
      const success = await registerUser(data.username, data.email, data.password);
      
      if (success) {
        // Add payment proof to user
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.username === data.username);
        
        if (userIndex !== -1) {
          users[userIndex].paymentProof = paymentProofBase64;
          localStorage.setItem('users', JSON.stringify(users));
        }
        
        navigate('/login');
        alert('Registration successful! Please wait for admin approval before logging in.');
      } else {
        setRegisterError('Registration failed. Please try again.');
      }
    } catch (error) {
      setRegisterError('An error occurred during registration');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPaymentImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPaymentImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <div className="flex flex-col items-center justify-center flex-grow px-6 py-12">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Create an Account</h1>
            <p className="text-gray-600 mt-2">
              Join IslamEdu AI to access AI-powered tools for Islamic education
            </p>
          </div>
          
          {registerError && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {registerError}
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
                  placeholder="Choose a username"
                  {...register('username', { 
                    required: 'Username is required',
                    minLength: { value: 3, message: 'Username must be at least 3 characters' }
                  })}
                />
              </div>
              {errors.username && (
                <p className="mt-1 text-sm text-red-600">{errors.username.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <AtSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2.5"
                  placeholder="Enter your email"
                  {...register('email', { 
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>
            
            <div className="mb-4">
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
                  placeholder="Create a password"
                  {...register('password', { 
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  type="password"
                  className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 border p-2.5"
                  placeholder="Confirm your password"
                  {...register('confirmPassword', { 
                    required: 'Please confirm your password',
                    validate: (value) => value === watch('password') || 'Passwords do not match'
                  })}
                />
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
              )}
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="paymentProof">
                Payment Proof (Screenshot)
              </label>
              <div className="mt-1 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-4">
                {paymentImagePreview ? (
                  <div className="flex flex-col items-center">
                    <img 
                      src={paymentImagePreview} 
                      alt="Payment proof" 
                      className="h-32 object-contain mb-2"
                    />
                    <button
                      type="button"
                      onClick={() => setPaymentImagePreview(null)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="mx-auto h-10 w-10 text-gray-400" />
                    <div className="mt-2 flex text-sm text-gray-600">
                      <label
                        htmlFor="paymentProof"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-green-600 hover:text-green-500 focus-within:outline-none"
                      >
                        <span>Upload a file</span>
                        <input
                          id="paymentProof"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          {...register('paymentProof', { 
                            required: 'Payment proof is required',
                            onChange: handleFileChange
                          })}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </div>
                )}
              </div>
              {errors.paymentProof && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentProof.message}</p>
              )}
            </div>
            
            <button
              type="submit"
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'Registering...' : 'Register'}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-800 font-medium">
                Login here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
