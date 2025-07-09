import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Header from "@/components/organisms/Header";
import HomePage from "@/components/pages/HomePage";
import ExplorePage from "@/components/pages/ExplorePage";
import ProfilePage from "@/components/pages/ProfilePage";
import NotificationsPage from "@/components/pages/NotificationsPage";
import SettingsPage from "@/components/pages/SettingsPage";
import { usersService } from "@/services/api/usersService";
import { NotificationProvider, useNotifications } from "@/context/NotificationContext";
import { toast } from "react-toastify";

const AppContent = () => {
  const { requestNotificationPermission } = useNotifications();
// Mock current user - in a real app, this would come from auth context
  const [currentUser, setCurrentUser] = useState({
    Id: 1,
    username: "alexchen",
    displayName: "Alex Chen",
    bio: "Full-stack developer passionate about React and Node.js. Building the future one line of code at a time.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isPrivate: false,
    followersCount: 1247,
    postsCount: 89,
    createdAt: "2023-01-15T08:30:00Z"
  });

  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    // Request notification permission on app load
    const initializeNotifications = async () => {
      try {
        await requestNotificationPermission();
      } catch (error) {
        console.error("Failed to initialize notifications:", error);
      }
    };

    initializeNotifications();
  }, [requestNotificationPermission]);

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
      setCurrentUser(updatedUser);
    } catch (error) {
      throw new Error("Failed to update user");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        currentUser={currentUser}
        onSearch={handleSearch}
        searchResults={searchResults}
      />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage currentUser={currentUser} />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/profile" element={<ProfilePage currentUser={currentUser} />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage currentUser={currentUser} onUpdateUser={handleUpdateUser} />} />
        </Routes>
      </main>
    </div>
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