import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import NavBar from '../components/NavBar';
import { Check, CircleCheck, Clock, User, X } from 'lucide-react';

interface UserData {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
  isApproved: boolean;
  wordsUsed: number;
  paymentProof?: string;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);

  useEffect(() => {
    // Load users from localStorage
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(storedUsers);
  }, []);

  const handleApproveUser = (userId: string) => {
    const updatedUsers = users.map(u => 
      u.id === userId ? { ...u, isApproved: true } : u
    );
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser({ ...selectedUser, isApproved: true });
    }
  };

  const handleRejectUser = (userId: string) => {
    const updatedUsers = users.filter(u => u.id !== userId);
    
    setUsers(updatedUsers);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    
    if (selectedUser && selectedUser.id === userId) {
      setSelectedUser(null);
    }
  };

  const handleViewUser = (userData: UserData) => {
    setSelectedUser(userData);
  };

  const pendingUsers = users.filter(u => !u.isAdmin && !u.isApproved);
  const approvedUsers = users.filter(u => !u.isAdmin && u.isApproved);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      
      <div className="container mx-auto px-4 py-8 flex-grow">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">
            Welcome, {user?.username}. Manage user accounts and approvals.
          </p>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1">
              <div className="mb-6">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-orange-500" />
                  Pending Approvals ({pendingUsers.length})
                </h2>
                
                {pendingUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No pending approvals</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {pendingUsers.map(userData => (
                      <li 
                        key={userData.id} 
                        className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50 px-3 rounded"
                        onClick={() => handleViewUser(userData)}
                      >
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-gray-400 mr-2" />
                          <span className="text-sm font-medium text-gray-700">{userData.username}</span>
                        </div>
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleApproveUser(userData.id);
                            }}
                            className="p-1 text-green-600 hover:text-green-800"
                          >
                            <Check className="h-5 w-5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRejectUser(userData.id);
                            }}
                            className="p-1 text-red-600 hover:text-red-800"
                          >
                            <X className="h-5 w-5" />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <CircleCheck className="h-5 w-5 mr-2 text-green-500" />
                  Approved Users ({approvedUsers.length})
                </h2>
                
                {approvedUsers.length === 0 ? (
                  <p className="text-gray-500 text-sm">No approved users yet</p>
                ) : (
                  <ul className="divide-y divide-gray-200">
                    {approvedUsers.map(userData => (
                      <li 
                        key={userData.id} 
                        className="py-3 cursor-pointer hover:bg-gray-50 px-3 rounded"
                        onClick={() => handleViewUser(userData)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <User className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-sm font-medium text-gray-700">{userData.username}</span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {userData.wordsUsed} words used
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            
            <div className="lg:col-span-2">
              {selectedUser ? (
                <div className="border border-gray-200 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{selectedUser.username}</h2>
                      <p className="text-gray-600">{selectedUser.email}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isApproved 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {selectedUser.isApproved ? 'Approved' : 'Pending'}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Account Details</h3>
                    <div className="bg-gray-50 p-4 rounded-md">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-500">User ID</p>
                          <p className="font-medium text-gray-800">{selectedUser.id}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Words Used</p>
                          <p className="font-medium text-gray-800">{selectedUser.wordsUsed}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {selectedUser.paymentProof && (
                    <div className="mb-6">
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Proof</h3>
                      <div className="bg-gray-50 p-4 rounded-md">
                        <img 
                          src={selectedUser.paymentProof} 
                          alt="Payment proof" 
                          className="max-h-64 object-contain mx-auto border border-gray-200 rounded"
                        />
                      </div>
                    </div>
                  )}
                  
                  {!selectedUser.isApproved && (
                    <div className="flex space-x-4">
                      <button
                        onClick={() => handleApproveUser(selectedUser.id)}
                        className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                      >
                        Approve User
                      </button>
                      <button
                        onClick={() => handleRejectUser(selectedUser.id)}
                        className="flex-1 bg-white text-red-600 border border-red-600 py-2 px-4 rounded-md hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                      >
                        Reject User
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="border border-gray-200 border-dashed rounded-lg p-12 flex flex-col items-center justify-center text-center">
                  <User className="h-12 w-12 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select a User</h3>
                  <p className="text-gray-500 max-w-md">
                    Click on a user from the list on the left to view their details and manage their account status.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
