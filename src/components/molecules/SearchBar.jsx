import { useState } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Input from "@/components/atoms/Input";
import Avatar from "@/components/atoms/Avatar";
import { hashtagService } from "@/services/api/hashtagService";
const SearchBar = ({ onSearch, placeholder = "Search users, hashtags...", results = [] }) => {
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);

const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setShowResults(value.length > 0);
    onSearch(value);
  };

  const handleResultClick = (user) => {
    setQuery("");
    setShowResults(false);
    // Handle navigation to user profile
  };

  const isHashtagSearch = query.startsWith('#');
  const displayPlaceholder = isHashtagSearch ? "Search hashtags..." : placeholder;

  return (
    <div className="relative">
      <div className="relative">
        <ApperIcon 
          name="Search" 
          size={20}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" 
        />
<Input
          type="text"
          placeholder={displayPlaceholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-4 py-3"
          onFocus={() => setShowResults(query.length > 0)}
          onBlur={() => setTimeout(() => setShowResults(false), 200)}
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              setShowResults(false);
              onSearch("");
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <ApperIcon name="X" size={16} />
          </button>
        )}
      </div>

      {showResults && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-surface border border-gray-600 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto"
        >
{results.length > 0 ? (
            results.map((user) => (
              <motion.div
                key={user.Id}
                whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                onClick={() => handleResultClick(user)}
                className="flex items-center space-x-3 p-3 cursor-pointer border-b border-gray-700 last:border-b-0"
              >
                <Avatar src={user.avatar} alt={user.displayName} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">
                    {user.displayName}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    @{user.username}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-400">
              <ApperIcon name="Search" size={24} className="mx-auto mb-2" />
              <p>{isHashtagSearch ? "No hashtags found" : "No users found"}</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default SearchBar;