import React, { useRef } from 'react';

interface TiltedFrameProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const TiltedFrame: React.FC<TiltedFrameProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const frameRef = useRef<HTMLDivElement | null>(null);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = frameRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 7;
    const ry = (px - 0.5) * 7;

    el.style.setProperty('--tilt-rx', `${rx.toFixed(2)}deg`);
    el.style.setProperty('--tilt-ry', `${ry.toFixed(2)}deg`);
    el.style.setProperty('--tilt-s', '1.015');
    el.style.setProperty('--glare-x', `${(px * 100).toFixed(1)}%`);
    el.style.setProperty('--glare-y', `${(py * 100).toFixed(1)}%`);
  };

  const handlePointerLeave = () => {
    const el = frameRef.current;
    if (!el) return;
    el.style.setProperty('--tilt-rx', '0deg');
    el.style.setProperty('--tilt-ry', '0deg');
    el.style.setProperty('--tilt-s', '1');
  };

  return (
    <div
      ref={frameRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onClick={onClick}
      className={`tilted-card ${className}`}
    >
      <div className="tilted-card-inner w-full h-full">{children}</div>
      <div className="tilted-card-glare" />
    </div>
  );
};
