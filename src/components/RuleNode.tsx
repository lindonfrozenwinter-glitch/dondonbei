import { useEffect, useRef, useState, type ReactNode } from 'react';
import gsap from 'gsap';
import {
  Shield,
  Sword,
  Trophy,
  Coins,
  Star,
  AlertTriangle,
  CalendarDays,
} from 'lucide-react';

interface RuleNodeProps {
  id: string;
  number: string;
  iconName: string;
  title: string;
  content: ReactNode;
  position: { x: number; y: number };
  isActive: boolean;
  onActivate: (id: string | null) => void;
  delay: number;
}

const iconMap: Record<string, ReactNode> = {
  Shield: <Shield size={18} />,
  Sword: <Sword size={18} />,
  Trophy: <Trophy size={18} />,
  Coins: <Coins size={18} />,
  Star: <Star size={18} />,
  AlertTriangle: <AlertTriangle size={18} />,
  CalendarDays: <CalendarDays size={18} />,
};

export default function RuleNode({
  id,
  number,
  iconName,
  title,
  content,
  position,
  isActive,
  onActivate,
  delay,
}: RuleNodeProps) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [textRevealed, setTextRevealed] = useState(false);
  const [displayText, setDisplayText] = useState<string>('');

  // Entrance animation
  useEffect(() => {
    if (!nodeRef.current) return;
    gsap.fromTo(
      nodeRef.current,
      { scale: 0, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.6, delay, ease: 'back.out(1.7)' }
    );
  }, [delay]);

  // Detail panel animation
  useEffect(() => {
    if (!detailRef.current) return;

    if (isActive) {
      setVisible(true);
      gsap.fromTo(
        detailRef.current,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 0.5,
          ease: 'power3.out',
          onComplete: () => setTextRevealed(true),
        }
      );
    } else {
      gsap.to(detailRef.current, {
        scaleX: 0,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.in',
        onComplete: () => {
          setVisible(false);
          setTextRevealed(false);
          setDisplayText('');
        },
      });
    }
  }, [isActive]);

  // Text scramble effect
  useEffect(() => {
    if (!textRevealed || !isActive) return;

    const targetText = typeof content === 'string' ? content : '';
    const chars = '!<>-_\\/[]{}--=+*^?#________';
    const totalChars = targetText.length;
    let frame = 0;
    let intervalId: number;

    intervalId = window.setInterval(() => {
      frame++;
      const revealCount = Math.min(Math.floor((frame / 20) * totalChars), totalChars);

      let result = '';
      for (let i = 0; i < totalChars; i++) {
        if (i < revealCount) {
          result += targetText[i];
        } else if (targetText[i] === '\n' || targetText[i] === ' ') {
          result += targetText[i];
        } else {
          result += chars[Math.floor(Math.random() * chars.length)];
        }
      }
      setDisplayText(result);

      if (revealCount >= totalChars) {
        clearInterval(intervalId);
        setDisplayText(targetText);
      }
    }, 30);

    return () => clearInterval(intervalId);
  }, [textRevealed, isActive, content]);

  const handleClick = () => {
    if (isActive) {
      onActivate(null);
    } else {
      onActivate(id);
    }
  };

  // Calculate detail panel position
  const panelWidth = 480;
  let panelLeft = position.x + 100;
  let panelTop = position.y - 60;

  // Adjust if panel would go off the right edge of scroll container
  if (panelLeft + panelWidth > 3000) {
    panelLeft = position.x - panelWidth - 20;
  }

  return (
    <>
      <div
        ref={nodeRef}
        className={`rule-node ${isActive ? 'active' : ''}`}
        style={{
          left: position.x,
          top: position.y,
          opacity: 0,
        }}
        onClick={handleClick}
      >
        <span className="rule-node-number">{number}</span>
        <span className="rule-node-icon">{iconMap[iconName]}</span>
      </div>

      {/* Detail Panel */}
      {visible && (
        <div
          ref={detailRef}
          className="rule-detail-panel"
          style={{
            left: panelLeft,
            top: panelTop,
            width: panelWidth,
            transformOrigin: `${isActive ? 'left center' : 'right center'}`,
            opacity: 0,
          }}
        >
          <div className="rule-detail-title">{number}、{title}</div>
          <div className="rule-detail-content">
            {textRevealed && typeof content === 'string' ? (
              <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word', fontFamily: 'inherit', margin: 0 }}>
                {displayText}
              </pre>
            ) : (
              content
            )}
          </div>
        </div>
      )}

      {/* Connection line */}
      {isActive && (
        <svg
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 5,
          }}
        >
          <line
            x1={position.x + 40}
            y1={position.y + 40}
            x2={panelLeft}
            y2={panelTop + 60}
            stroke="rgba(0, 229, 255, 0.4)"
            strokeWidth="1"
            strokeDasharray="4 4"
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to="-16"
              dur="1s"
              repeatCount="indefinite"
            />
          </line>
        </svg>
      )}
    </>
  );
}
