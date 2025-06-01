import React from "react";

const ScrollArea = ({ className, children }) => {
  return (
    <div className={`overflow-y-auto ${className}`}>
      {children}
    </div>
  );
};

export { ScrollArea };
