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
  // Calculate control point for curved path (more dramatic curve)
  const controlX = (fromX + toX) / 2;
  const controlY = (fromY + toY) / 2 - 80;

  const path = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  return (
    <g>
      {/* Base dashed line */}
      <path
        d={path}
        stroke={isActive ? "url(#streamGradientActive)" : "url(#streamGradientInactive)"}
        strokeWidth={isActive ? "2.5" : "1.5"}
        strokeDasharray="8 8"
        fill="none"
        opacity={isActive ? 0.8 : 0.2}
        className={isActive ? "stream-line-dashed" : ""}
        style={{
          filter: isActive ? 'drop-shadow(0 0 4px rgba(0, 229, 255, 0.5))' : 'none',
          transition: 'all 0.5s ease-in-out'
        }}
      />

      {/* Animated particles flowing through */}
      {isActive && (
        <>
          {/* Primary particle */}
          <circle r="4" fill="rgba(66, 153, 225, 0.9)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin={`${index * 0.4}s`}
            >
              <mpath href={`#path-${index}`} />
            </animateMotion>
          </circle>
          
          {/* Secondary particle */}
          <circle r="3" fill="rgba(0, 229, 255, 0.9)">
            <animateMotion
              dur="3s"
              repeatCount="indefinite"
              begin={`${index * 0.4 + 1.5}s`}
            >
              <mpath href={`#path-${index}`} />
            </animateMotion>
          </circle>

          {/* Tertiary small particle */}
          <circle r="2" fill="rgba(255, 255, 255, 0.8)">
            <animateMotion
              dur="2.5s"
              repeatCount="indefinite"
              begin={`${index * 0.4 + 0.75}s`}
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
