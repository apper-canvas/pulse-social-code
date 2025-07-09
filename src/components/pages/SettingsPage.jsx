import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Avatar from "@/components/atoms/Avatar";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const SettingsPage = ({ currentUser, onUpdateUser }) => {
  const { tab } = useParams();
  const [activeTab, setActiveTab] = useState(tab || "profile");
  const [profileData, setProfileData] = useState({
    displayName: currentUser.displayName,
    username: currentUser.username,
    bio: currentUser.bio || "",
    avatar: currentUser.avatar,
  });
  const [privacySettings, setPrivacySettings] = useState({
    isPrivate: currentUser.isPrivate || false,
    allowMessages: true,
    allowTagging: true,
    showActivity: true,
  });
const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (tab) {
      setActiveTab(tab);
    }
  }, [tab]);

  const tabs = [
    { id: "profile", label: "Profile", icon: "User" },
    { id: "privacy", label: "Privacy", icon: "Shield" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "appearance", label: "Appearance", icon: "Palette" },
    { id: "account", label: "Account", icon: "Settings" },
  ];

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await onUpdateUser({ ...currentUser, ...profileData });
      toast.success("Profile updated successfully!");
    } catch (error) {
      toast.error("Failed to update profile");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrivacyChange = (setting, value) => {
    setPrivacySettings(prev => ({ ...prev, [setting]: value }));
  };

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex-1">
        <h3 className="text-white font-medium">{label}</h3>
        <p className="text-gray-400 text-sm mt-1">{description}</p>
      </div>
      <button
        onClick={() => onChange(!enabled)}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-gray-600"
        }`}
      >
        <div
          className={`absolute w-5 h-5 bg-white rounded-full top-0.5 transition-transform ${
            enabled ? "translate-x-6" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            <div className="flex items-center space-x-6">
              <Avatar src={profileData.avatar} alt={profileData.displayName} size="xl" />
              <div>
                <Button variant="secondary" type="button">
                  <ApperIcon name="Upload" size={16} className="mr-2" />
                  Change Avatar
                </Button>
                <p className="text-gray-400 text-sm mt-2">
                  JPG, PNG or GIF. Max size 5MB.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Display Name"
                value={profileData.displayName}
                onChange={(e) => setProfileData(prev => ({ ...prev, displayName: e.target.value }))}
                placeholder="Your display name"
              />
              <Input
                label="Username"
                value={profileData.username}
                onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="@username"
              />
            </div>
            
            <Textarea
              label="Bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
              placeholder="Tell us about yourself..."
              rows={4}
            />
            
            <div className="flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating ? (
                  <>
                    <ApperIcon name="Loader2" size={16} className="mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Save" size={16} className="mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        );

      case "privacy":
        return (
          <div className="space-y-6">
            <ToggleSwitch
              enabled={privacySettings.isPrivate}
              onChange={(value) => handlePrivacyChange("isPrivate", value)}
              label="Private Account"
              description="Only approved followers can see your posts"
            />
            
            <ToggleSwitch
              enabled={privacySettings.allowMessages}
              onChange={(value) => handlePrivacyChange("allowMessages", value)}
              label="Allow Direct Messages"
              description="Let people send you direct messages"
            />
            
            <ToggleSwitch
              enabled={privacySettings.allowTagging}
              onChange={(value) => handlePrivacyChange("allowTagging", value)}
              label="Allow Tagging"
              description="Let people tag you in posts and comments"
            />
            
            <ToggleSwitch
              enabled={privacySettings.showActivity}
              onChange={(value) => handlePrivacyChange("showActivity", value)}
              label="Show Activity Status"
              description="Let others see when you're active"
            />
          </div>
        );

      case "notifications":
        return (
          <div className="space-y-6">
            <ToggleSwitch
              enabled={true}
              onChange={() => {}}
              label="Push Notifications"
              description="Receive notifications on your device"
            />
            
            <ToggleSwitch
              enabled={true}
              onChange={() => {}}
              label="Email Notifications"
              description="Receive notifications via email"
            />
            
            <ToggleSwitch
              enabled={true}
              onChange={() => {}}
              label="Like Notifications"
              description="Get notified when someone likes your posts"
            />
            
            <ToggleSwitch
              enabled={true}
              onChange={() => {}}
              label="Comment Notifications"
              description="Get notified when someone comments on your posts"
            />
            
            <ToggleSwitch
              enabled={true}
              onChange={() => {}}
              label="Follow Notifications"
              description="Get notified when someone follows you"
            />
          </div>
        );

      case "appearance":
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Theme</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-800 rounded-lg border-2 border-primary cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Dark Mode</span>
                    <ApperIcon name="Check" size={16} className="text-primary" />
                  </div>
                  <p className="text-gray-400 text-sm">Dark theme for better night viewing</p>
                </div>
                
                <div className="p-4 bg-gray-800 rounded-lg border-2 border-gray-600 cursor-pointer hover:border-gray-500">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Light Mode</span>
                  </div>
                  <p className="text-gray-400 text-sm">Light theme for daytime use</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white">Font Size</h3>
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">Small</span>
                <input
                  type="range"
                  min="1"
                  max="3"
                  defaultValue="2"
                  className="flex-1"
                />
                <span className="text-gray-400">Large</span>
              </div>
            </div>
          </div>
        );

      case "account":
        return (
          <div className="space-y-6">
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-2">Export Data</h3>
              <p className="text-gray-400 mb-4">
                Download a copy of your posts, comments, and other data.
              </p>
              <Button variant="secondary">
                <ApperIcon name="Download" size={16} className="mr-2" />
                Request Export
              </Button>
            </div>
            
            <div className="p-4 bg-gray-800 rounded-lg border border-gray-600">
              <h3 className="text-lg font-semibold text-white mb-2">Deactivate Account</h3>
              <p className="text-gray-400 mb-4">
                Temporarily deactivate your account. You can reactivate it anytime.
              </p>
              <Button variant="danger">
                <ApperIcon name="UserX" size={16} className="mr-2" />
                Deactivate Account
              </Button>
            </div>
            
            <div className="p-4 bg-red-900/20 rounded-lg border border-red-700">
              <h3 className="text-lg font-semibold text-red-400 mb-2">Delete Account</h3>
              <p className="text-gray-400 mb-4">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
              <Button variant="danger">
                <ApperIcon name="Trash2" size={16} className="mr-2" />
                Delete Account
              </Button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold gradient-text">Settings</h1>
            <p className="text-gray-400 mt-2">Manage your account and preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      activeTab === tab.id
                        ? "bg-primary text-white"
                        : "text-gray-400 hover:text-white hover:bg-gray-800"
                    }`}
                  >
                    <ApperIcon name={tab.icon} size={20} />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="lg:col-span-3">
              <div className="bg-surface rounded-xl p-8 border border-gray-700">
                <h2 className="text-2xl font-semibold text-white mb-6">
                  {tabs.find(tab => tab.id === activeTab)?.label}
                </h2>
                {renderTabContent()}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default SettingsPage;