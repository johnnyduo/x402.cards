interface StreamFlowProps {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  isActive: boolean;
  index: number;
}

export const StreamFlow = ({
  fromX,
  fromY,
  toX,
  toY,
  isActive,
  index,
}: StreamFlowProps) => {
  // Calculate elegant curved path with dynamic control point
  const dx = toX - fromX;
  const dy = toY - fromY;
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Control point creates smooth, natural curve
  const controlX = (fromX + toX) / 2;
  const controlY = (fromY + toY) / 2 - (distance * 0.15);

  const path = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  return (
    <g>
      {/* Base dashed line with glow effect */}
      <path
        d={path}
        stroke={isActive ? "url(#streamGradientActive)" : "url(#streamGradientInactive)"}
        strokeWidth={isActive ? "3" : "2"}
        strokeDasharray="10 10"
        fill="none"
        opacity={isActive ? 0.9 : 0.25}
        className={isActive ? "stream-line-dashed" : ""}
        style={{
          filter: isActive ? 'drop-shadow(0 0 6px rgba(0, 229, 255, 0.6))' : 'none',
          transition: 'all 0.5s ease-in-out'
        }}
      />

      {/* Animated particles flowing through with glow */}
      {isActive && (
        <>
          {/* Primary particle with glow */}
          <circle r="5" fill="rgba(66, 153, 225, 0.9)" filter="url(#glow)">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              begin={`${index * 0.5}s`}
            >
              <mpath href={`#path-${index}`} />
            </animateMotion>
          </circle>
          
          {/* Secondary particle */}
          <circle r="4" fill="rgba(0, 229, 255, 0.95)" filter="url(#glow)">
            <animateMotion
              dur="3.5s"
              repeatCount="indefinite"
              begin={`${index * 0.5 + 1.75}s`}
            >
              <mpath href={`#path-${index}`} />
            </animateMotion>
          </circle>

          {/* Tertiary small particle */}
          <circle r="2.5" fill="rgba(255, 255, 255, 0.9)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin={`${index * 0.5 + 0.9}s`}
            >
              <mpath href={`#path-${index}`} />
            </animateMotion>
          </circle>
        </>
      )}

      {/* Hidden path for animation reference */}
      <path id={`path-${index}`} d={path} fill="none" opacity="0" />
    </g>
  );
};
