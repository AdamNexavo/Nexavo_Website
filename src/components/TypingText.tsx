import { useState, useEffect, useRef } from "react";
import { useInView } from "framer-motion";

interface TypingTextProps {
  children: React.ReactNode;
  className?: string;
  speed?: number; // milliseconds per character
}

// Helper to extract text and color info from React children
const extractTextParts = (node: React.ReactNode): Array<{ text: string; isPurple: boolean }> => {
  if (typeof node === "string") {
    return [{ text: node, isPurple: false }];
  }
  
  if (Array.isArray(node)) {
    return node.flatMap(extractTextParts);
  }
  
  if (node && typeof node === "object" && "props" in node) {
    const props = (node as any).props;
    const isPurple = props?.className?.includes("text-[#6a50ff]");
    
    if (props.children) {
      const childrenParts = extractTextParts(props.children);
      return childrenParts.map(part => ({ ...part, isPurple: isPurple || part.isPurple }));
    }
  }
  
  return [];
};

export const TypingText = ({ children, className = "", speed = 50 }: TypingTextProps) => {
  const [displayedLength, setDisplayedLength] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLHeadingElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const textPartsRef = useRef<Array<{ text: string; isPurple: boolean }>>([]);
  const fullTextRef = useRef("");

  useEffect(() => {
    if (!isInView || hasAnimated) return;

    // Extract text parts once
    textPartsRef.current = extractTextParts(children);
    fullTextRef.current = textPartsRef.current.map(part => part.text).join("");
    
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= fullTextRef.current.length) {
        setDisplayedLength(currentIndex);
        currentIndex++;
      } else {
        clearInterval(interval);
        setHasAnimated(true);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [isInView, hasAnimated, children, speed]);

  // Build the displayed text with proper color spans
  const buildDisplayedText = () => {
    if (!isInView || hasAnimated) {
      return children;
    }

    const result: React.ReactNode[] = [];
    let currentPos = 0;
    let partIndex = 0;

    while (currentPos < displayedLength && partIndex < textPartsRef.current.length) {
      const part = textPartsRef.current[partIndex];
      const partStart = currentPos;
      const partEnd = currentPos + part.text.length;
      const displayEnd = Math.min(partEnd, displayedLength);

      if (displayEnd > partStart) {
        const displayedPart = part.text.slice(0, displayEnd - partStart);
        
        if (part.isPurple) {
          result.push(
            <span key={`purple-${partIndex}`} className="text-[#6a50ff]">
              {displayedPart}
            </span>
          );
        } else {
          result.push(displayedPart);
        }
      }

      currentPos = partEnd;
      partIndex++;
    }

    return result;
  };

  return (
    <h2 ref={ref} className={className}>
      {buildDisplayedText()}
      {isInView && !hasAnimated && displayedLength < fullTextRef.current.length && (
        <span className="animate-pulse ml-0.5">|</span>
      )}
    </h2>
  );
};
