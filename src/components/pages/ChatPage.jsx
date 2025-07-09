import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Avatar from "@/components/atoms/Avatar";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import { chatService } from "@/services/api/chatService";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { toast } from "react-toastify";

const ChatPage = ({ currentUser }) => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sendingMessage, setSendingMessage] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      loadMessages(selectedChat.Id);
    }
  }, [selectedChat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadChats = async () => {
    try {
      setLoading(true);
      const chatData = await chatService.getAll();
      setChats(chatData);
      if (chatData.length > 0) {
        setSelectedChat(chatData[0]);
      }
    } catch (err) {
      setError("Failed to load chats");
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async (chatId) => {
    try {
      const messageData = await chatService.getMessages(chatId);
      setMessages(messageData);
      // Mark messages as read
      await chatService.markAsRead(chatId);
      // Update chat list to reflect read status
      setChats(prev => prev.map(chat => 
        chat.Id === chatId ? { ...chat, unreadCount: 0 } : chat
      ));
    } catch (err) {
      toast.error("Failed to load messages");
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedChat || sendingMessage) return;

    const messageText = newMessage.trim();
    setNewMessage("");
    setSendingMessage(true);

    try {
      const messageData = {
        chatId: selectedChat.Id,
        senderId: currentUser.Id,
        content: messageText,
        type: "text"
      };

      const newMsg = await chatService.sendMessage(messageData);
      setMessages(prev => [...prev, newMsg]);
      
      // Update chat list with new last message
      setChats(prev => prev.map(chat => 
        chat.Id === selectedChat.Id 
          ? { 
              ...chat, 
              lastMessage: messageText,
              lastMessageAt: new Date().toISOString(),
              unreadCount: 0
            }
          : chat
      ));

      toast.success("Message sent");
    } catch (err) {
      toast.error("Failed to send message");
      setNewMessage(messageText); // Restore message on error
    } finally {
      setSendingMessage(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getOtherParticipant = (chat) => {
    return chat.participants.find(p => p.Id !== currentUser.Id);
  };

  const isOnline = (userId) => {
    // Mock online status - in real app, this would come from real-time service
    return [1, 2, 3].includes(userId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} />;

  return (
    <div className="flex h-screen bg-background">
      {/* Chat List Sidebar */}
      <div className="w-80 bg-surface border-r border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700">
          <h1 className="text-xl font-bold text-white">Messages</h1>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {chats.map((chat) => {
            const otherParticipant = getOtherParticipant(chat);
            const isActive = selectedChat?.Id === chat.Id;
            
            return (
              <motion.div
                key={chat.Id}
                className={`p-4 border-b border-gray-800 cursor-pointer transition-colors ${
                  isActive 
                    ? "bg-primary/10 border-primary/30" 
                    : "hover:bg-gray-800"
                }`}
                onClick={() => setSelectedChat(chat)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Avatar 
                      src={otherParticipant.avatar} 
                      alt={otherParticipant.displayName}
                      size="md"
                    />
                    {isOnline(otherParticipant.Id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-white truncate">
                        {otherParticipant.displayName}
                      </p>
                      {chat.lastMessageAt && (
                        <span className="text-xs text-gray-400">
                          {formatDistanceToNow(new Date(chat.lastMessageAt), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-400 truncate">
                        {chat.lastMessage || "No messages yet"}
                      </p>
                      {chat.unreadCount > 0 && (
                        <span className="bg-primary text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                          {chat.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 bg-surface">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <Avatar 
                    src={getOtherParticipant(selectedChat).avatar} 
                    alt={getOtherParticipant(selectedChat).displayName}
                    size="md"
                  />
                  {isOnline(getOtherParticipant(selectedChat).Id) && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface"></div>
                  )}
                </div>
                
                <div className="flex-1">
                  <h2 className="font-semibold text-white">
                    {getOtherParticipant(selectedChat).displayName}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {isOnline(getOtherParticipant(selectedChat).Id) ? "Online" : "Offline"}
                  </p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Phone" size={18} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="Video" size={18} />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ApperIcon name="MoreVertical" size={18} />
                  </Button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => {
                const isOwnMessage = message.senderId === currentUser.Id;
                const sender = isOwnMessage 
                  ? currentUser 
                  : getOtherParticipant(selectedChat);
                
                return (
                  <motion.div
                    key={message.Id}
                    className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${
                      isOwnMessage ? "flex-row-reverse space-x-reverse" : ""
                    }`}>
                      <Avatar 
                        src={sender.avatar} 
                        alt={sender.displayName}
                        size="sm"
                      />
                      
                      <div className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? "bg-primary text-white rounded-br-md"
                          : "bg-gray-700 text-white rounded-bl-md"
                      }`}>
                        <p className="text-sm">{message.content}</p>
                        <p className={`text-xs mt-1 ${
                          isOwnMessage ? "text-primary-100" : "text-gray-400"
                        }`}>
                          {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700 bg-surface">
              <form onSubmit={handleSendMessage} className="flex items-center space-x-3">
                <Button variant="ghost" size="sm" type="button">
                  <ApperIcon name="Paperclip" size={18} />
                </Button>
                
                <div className="flex-1">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="bg-gray-800 border-gray-600 text-white placeholder-gray-400"
                    disabled={sendingMessage}
                  />
                </div>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  type="button"
                  onClick={() => setNewMessage(prev => prev + "😊")}
                >
                  <ApperIcon name="Smile" size={18} />
                </Button>
                
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={!newMessage.trim() || sendingMessage}
                  className="bg-primary hover:bg-primary/90"
                >
                  {sendingMessage ? (
                    <ApperIcon name="Loader2" size={18} className="animate-spin" />
                  ) : (
                    <ApperIcon name="Send" size={18} />
                  )}
                </Button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <ApperIcon name="MessageCircle" size={48} className="text-gray-400 mb-4 mx-auto" />
              <h3 className="text-lg font-semibold text-white mb-2">Select a conversation</h3>
              <p className="text-gray-400">Choose a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;