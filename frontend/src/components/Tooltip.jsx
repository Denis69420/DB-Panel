// frontend/src/components/Tooltip.jsx
import React from 'react';

function Tooltip({ text, children }) {
  return (
    <div className="relative group">
      {children}
      <div className="absolute bottom-full mb-2 hidden group-hover:block bg-black text-white text-xs rounded py-1 px-2">
        {text}
      </div>
    </div>
  );
}

export default Tooltip;
