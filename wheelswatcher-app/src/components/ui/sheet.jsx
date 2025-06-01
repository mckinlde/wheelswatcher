import React, { useState } from "react";
import { cn } from "../../lib/utils";

const SheetContext = React.createContext();

const Sheet = ({ children }) => {
  const [open, setOpen] = useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ children }) => {
  const { setOpen } = React.useContext(SheetContext);
  return React.cloneElement(children, {
    onClick: () => setOpen(true),
  });
};

const SheetContent = ({ children, side = "left", className }) => {
  const { open, setOpen } = React.useContext(SheetContext);

  if (!open) return null;

  return (
    <div
      className={cn(
        "fixed top-0 bottom-0 bg-white shadow-lg z-50 transition-transform",
        side === "left" ? "left-0 w-80" : "right-0 w-80",
        className
      )}
    >
      <button
        onClick={() => setOpen(false)}
        className="absolute top-2 right-2 text-gray-500 hover:text-black"
      >
        ✕
      </button>
      {children}
    </div>
  );
};

const SheetHeader = ({ children }) => (
  <div className="p-4 border-b">{children}</div>
);

const SheetTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle };
