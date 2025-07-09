import { createContext, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';
import Header from "@/components/organisms/Header";
import HomePage from "@/components/pages/HomePage";
import ExplorePage from "@/components/pages/ExplorePage";
import ProfilePage from "@/components/pages/ProfilePage";
import NotificationsPage from "@/components/pages/NotificationsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import ChatPage from "@/components/pages/ChatPage";
import CreatePage from "@/components/pages/CreatePage";
import Login from '@/components/pages/Login';
import Signup from '@/components/pages/Signup';
import Callback from '@/components/pages/Callback';
import ErrorPage from '@/components/pages/ErrorPage';
import ResetPassword from '@/components/pages/ResetPassword';
import PromptPassword from '@/components/pages/PromptPassword';
import { usersService } from "@/services/api/usersService";
import { NotificationProvider, useNotifications } from "@/context/NotificationContext";

// Create auth context
export const AuthContext = createContext(null);

const AppContent = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const { requestNotificationPermission } = useNotifications();
  
  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;
  const currentUser = userState?.user;
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || 
                           currentPath.includes('/callback') || currentPath.includes('/error') || 
                           currentPath.includes('/prompt-password') || currentPath.includes('/reset-password');
        
        if (user) {
          // User is authenticated
          if (redirectPath) {
            navigate(redirectPath);
          } else if (!isAuthPage) {
            if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
              navigate(currentPath);
            } else {
              navigate('/');
            }
          } else {
            navigate('/');
          }
          // Store user information in Redux
          dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
          // User is not authenticated
          if (!isAuthPage) {
            navigate(
              currentPath.includes('/signup')
                ? `/signup?redirect=${currentPath}`
                : currentPath.includes('/login')
                ? `/login?redirect=${currentPath}`
                : '/login'
            );
          } else if (redirectPath) {
            if (
              !['error', 'signup', 'login', 'callback', 'prompt-password', 'reset-password'].some((path) => currentPath.includes(path))
            ) {
              navigate(`/login?redirect=${redirectPath}`);
            } else {
              navigate(currentPath);
            }
          } else if (isAuthPage) {
            navigate(currentPath);
          } else {
            navigate('/login');
          }
          dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, []);// No props and state should be bound

  useEffect(() => {
    if (isAuthenticated) {
      // Request notification permission on app load
      const initializeNotifications = async () => {
        try {
          await requestNotificationPermission();
        } catch (error) {
          console.error("Failed to initialize notifications:", error);
        }
      };

      initializeNotifications();
    }
  }, [isAuthenticated, requestNotificationPermission]);

  const handleSearch = async (query) => {
    try {
      const results = await usersService.searchUsers(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      const updatedUser = await usersService.update(currentUser.Id, userData);
      dispatch(setUser(updatedUser));
    } catch (error) {
      throw new Error("Failed to update user");
    }
  };
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };
  
  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="loading flex items-center justify-center p-6 h-full w-full"><svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" ><path d="M12 2v4"></path><path d="m16.2 7.8 2.9-2.9"></path><path d="M18 12h4"></path><path d="m16.2 16.2 2.9 2.9"></path><path d="M12 18v4"></path><path d="m4.9 19.1 2.9-2.9"></path><path d="M2 12h4"></path><path d="m4.9 4.9 2.9 2.9"></path></svg></div>;
  }

  // Show auth pages for non-authenticated users
  if (!isAuthenticated) {
    return (
      <AuthContext.Provider value={authMethods}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/callback" element={<Callback />} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
          <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </AuthContext.Provider>
    );
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen bg-background">
        <Header 
          currentUser={currentUser}
          onSearch={handleSearch}
          searchResults={searchResults}
        />
        
        <main>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/callback" element={<Callback />} />
            <Route path="/error" element={<ErrorPage />} />
            <Route path="/prompt-password/:appId/:emailAddress/:provider" element={<PromptPassword />} />
            <Route path="/reset-password/:appId/:fields" element={<ResetPassword />} />
            <Route path="/" element={<HomePage currentUser={currentUser} />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/create" element={<CreatePage currentUser={currentUser} />} />
            <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/messages" element={<ChatPage currentUser={currentUser} />} />
            <Route path="/settings" element={<SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />} />
            <Route path="/settings/:tab" element={<SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />} />
          </Routes>
        </main>
      </div>
    </AuthContext.Provider>
  );
};

function App() {
  return (
    <NotificationProvider>
      <AppContent />
    </NotificationProvider>
  );
}

export default App;