import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  wordsUsed: number;
  paymentProof?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  register: (username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialize admin user if it doesn't exist
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (!users.some((u: User) => u.username === 'iandjuhana')) {
      users.push({
        id: 'admin-1',
        username: 'iandjuhana',
        email: 'admin@example.com',
        isAdmin: true,
        isApproved: true,
        wordsUsed: 0,
        // Password is stored in a separate object for security
        // In a real app, this would be properly hashed on a backend
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
      passwords['iandjuhana'] = 'iandjuhana05061987';
      localStorage.setItem('passwords', JSON.stringify(passwords));
    }

    // Check if user is logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
    
    const foundUser = users.find((u: User) => u.username === username);
    
    if (foundUser && passwords[username] === password) {
      // Don't check approval for admin
      if (foundUser.isAdmin || foundUser.isApproved) {
        setUser(foundUser);
        localStorage.setItem('currentUser', JSON.stringify(foundUser));
        setLoading(false);
        return true;
      } else {
        alert('Your account is pending approval by an administrator.');
        setLoading(false);
        return false;
      }
    }
    
    setLoading(false);
    return false;
  };

  const register = async (username: string, email: string, password: string): Promise<boolean> => {
    setLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const passwords = JSON.parse(localStorage.getItem('passwords') || '{}');
    
    // Check if username already exists
    if (users.some((u: User) => u.username === username)) {
      alert('Username already exists');
      setLoading(false);
      return false;
    }
    
    // Create new user
    const newUser: User = {
      id: `user-${Date.now()}`,
      username,
      email,
      isAdmin: false,
      isApproved: false,
      wordsUsed: 0
    };
    
    users.push(newUser);
    passwords[username] = password;
    
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('passwords', JSON.stringify(passwords));
    
    setLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    
    // Also update in the users array
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u: User) => 
      u.id === updatedUser.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};
