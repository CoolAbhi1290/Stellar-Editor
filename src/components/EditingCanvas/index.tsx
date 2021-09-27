import { FC } from 'react';
import { Canvas } from '@react-three/fiber';
import 'react-dom';
import { OrbitControls } from '@react-three/drei';

import Part from '../Part';
import * as FuelTank from '../../parts/FuelTank';

import './index.scss';

interface IEditingCanvas {
  render: Array<FuelTank.Type>;
}
const EditingCanvas: FC<IEditingCanvas> = ({ render }) => {
  let partsJsx = render.map((part) => <FuelTank.Part key={Math.random()} data={part} />);

  return (
    <Canvas frameloop={'demand'} orthographic camera={{ zoom: 32, position: [0, 0, 10] }} className="editing-canvas">
      <directionalLight position={[-10, 20, 100]} />
      <ambientLight intensity={0.5} />

      <OrbitControls enableDamping={false} enablePan={true} enableZoom={true} enableRotate={false} />
      <gridHelper position={[0, 0, -100]} args={[1000, 1000, '#b062f5', '#22272e']} rotation={[Math.PI / 2, 0, 0]} />
      {/* <InfiniteGridHelper axes="yxz" size1={1} size2={2} /> */}

      {partsJsx}
    </Canvas>
  );
};

export default EditingCanvas;
