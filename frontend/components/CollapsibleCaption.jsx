import React, { useState } from 'react';

const CollapsibleCaption = ({ 
  text,
  charLimit = 100
 }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  const renderText = () => {
    if (text.length <= charLimit || isExpanded) {
      return text;
    }
    return text.slice(0, charLimit) + '...';
  };

  return (
    <span>
      {renderText()}
      {text.length > charLimit && (
        <span className="collpase-content" onClick={toggleExpand}>
          {isExpanded ? ' > ' : '...'}
        </span>
      )}
    </span>
  );
};

export default CollapsibleCaption;
