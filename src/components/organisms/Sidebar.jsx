import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";

const Sidebar = ({ currentUser, onCreatePost }) => {
  const location = useLocation();

  const navigation = [
    { name: "Home", path: "/", icon: "Home" },
    { name: "Explore", path: "/explore", icon: "Compass" },
    { name: "Notifications", path: "/notifications", icon: "Bell" },
    { name: "Messages", path: "/messages", icon: "MessageCircle" },
    { name: "Bookmarks", path: "/bookmarks", icon: "Bookmark" },
    { name: "Profile", path: "/profile", icon: "User" },
    { name: "Settings", path: "/settings", icon: "Settings" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="w-64 bg-surface border-r border-gray-700 h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-700">
        <Link to="/" className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
            <ApperIcon name="Zap" size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold gradient-text">Pulse</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
              isActive(item.path)
                ? "bg-gradient-to-r from-primary/20 to-secondary/20 text-primary border border-primary/30"
                : "text-gray-400 hover:text-white hover:bg-gray-800"
            }`}
          >
            <ApperIcon 
              name={item.icon} 
              size={20} 
              className={`${isActive(item.path) ? "text-primary" : "text-gray-400 group-hover:text-white"}`}
            />
            <span className="font-medium">{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Create Post Button */}
      <div className="p-4 border-t border-gray-700">
        <Button 
          onClick={onCreatePost}
          className="w-full justify-center"
          size="lg"
        >
          <ApperIcon name="Plus" size={20} className="mr-2" />
          Create Post
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-700">
        <Link to="/profile" className="flex items-center space-x-3 p-3 rounded-xl hover:bg-gray-800 transition-colors">
          <Avatar 
            src={currentUser.avatar} 
            alt={currentUser.displayName} 
            size="md" 
          />
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium truncate">
              {currentUser.displayName}
            </p>
            <p className="text-gray-400 text-sm truncate">
              @{currentUser.username}
            </p>
          </div>
          <ApperIcon name="MoreHorizontal" size={20} className="text-gray-400" />
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;