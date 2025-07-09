import { useContext } from 'react';
import { AuthContext } from '../App';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const LogoutButton = ({ variant = "ghost", size = "sm", className = "" }) => {
  const { logout } = useContext(AuthContext);

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={logout}
      className={className}
    >
      <ApperIcon name="LogOut" size={16} className="mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton;