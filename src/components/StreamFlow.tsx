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
  // Calculate control point for curved path
  const controlX = (fromX + toX) / 2;
  const controlY = (fromY + toY) / 2 - 50;

  const path = `M ${fromX} ${fromY} Q ${controlX} ${controlY} ${toX} ${toY}`;

  return (
    <g>
      {/* Base line */}
      <path
        d={path}
        stroke="url(#streamGradient)"
        strokeWidth="2"
        fill="none"
        opacity={isActive ? 0.6 : 0.15}
        className="transition-opacity duration-500"
      />

      {/* Animated particles */}
      {isActive && (
        <>
          <circle r="3" fill="hsl(var(--primary))">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              begin={`${index * 0.3}s`}
            >
              <mpath href={`#path-${index}`} />
            </animateMotion>
          </circle>
          <circle r="3" fill="hsl(var(--secondary))">
            <animateMotion
              dur="2s"
              repeatCount="indefinite"
              begin={`${index * 0.3 + 1}s`}
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
