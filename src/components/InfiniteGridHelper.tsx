import { GroupProps } from '@react-three/fiber';
import { forwardRef } from 'react';
import { Color, DoubleSide, Mesh } from 'three';

interface InfiniteGridHelperProps extends GroupProps {
  size1?: number;
  size2?: number;
  color?: THREE.Color;
  distance?: number;
  axes?: string;
}
/**
 * Thanks, Fyrestar, for [THREE.InfiniteGridHelper](https://github.com/Fyrestar/THREE.InfiniteGridHelper/)!
 */
const InfiniteGridHelper = forwardRef<Mesh, InfiniteGridHelperProps>(
  (
    {
      size1 = 10,
      size2 = 100,
      color = new Color('white'),
      axes = 'xzy',
      ...props
    },
    ref,
  ) => {
    const planeAxes = axes.slice(0, 2);

    return (
      // @ts-ignore
      <mesh ref={ref} frustumCulled={false} {...props}>
        <shaderMaterial
          args={[
            {
              side: DoubleSide,
              uniforms: {
                uSize1: { value: size1 },
                uSize2: { value: size2 },
                uColor: { value: color },
                uDistance: { value: 1e4 },
              },
              extensions: { derivatives: true },
              transparent: true,

              vertexShader: `
              varying vec3 worldPosition;
              uniform float uDistance;

              void main() {
                vec3 pos = position.${axes} * uDistance;
                pos.${planeAxes} += cameraPosition.${planeAxes};
                worldPosition = pos;
                gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
              }
            `,

              fragmentShader: `
              varying vec3 worldPosition;
              uniform float uSize1;
              uniform float uSize2;
              uniform vec3 uColor;
              uniform float uDistance;

              float getGrid(float size) {
                vec2 r = worldPosition.${planeAxes} / size;
                vec2 grid = abs(fract(r - 0.5) - 0.5) / fwidth(r * 1.5);
                float line = min(grid.x, grid.y);

                return 1.0 - min(line, 1.0);
              }

              void main() {
                float d = 1.0;
                float g1 = getGrid(uSize1);
                float g2 = getGrid(uSize2);

                gl_FragColor = vec4(uColor.rgb, mix(g2, g1, g1));
                gl_FragColor.a = mix(0.5 * gl_FragColor.a, gl_FragColor.a, g2);

                if ( gl_FragColor.a <= 0.0 ) discard;
              }
            `,
            },
          ]}
        />
        <planeBufferGeometry />
      </mesh>
    );
  },
);

export default InfiniteGridHelper;
