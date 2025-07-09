import { forwardRef } from "react";
import { cn } from "@/utils/cn";

const Avatar = forwardRef(({ 
  className, 
  src, 
  alt = "Avatar", 
  size = "md",
  fallback,
  ...props 
}, ref) => {
  const sizes = {
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
    "2xl": "w-24 h-24 text-2xl",
  };

  const getInitials = (name) => {
    if (!name) return "?";
    return name.split(" ").map(word => word[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <div
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-white font-medium overflow-hidden ring-2 ring-gray-700",
        sizes[size],
        className
      )}
      {...props}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.style.display = "none";
          }}
        />
      ) : (
        <span className="select-none">
          {fallback || getInitials(alt)}
        </span>
      )}
    </div>
  );
});

Avatar.displayName = "Avatar";

export default Avatar;