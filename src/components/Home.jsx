import { Canvas } from "@react-three/fiber";
import { Loader } from "@react-three/drei";
import { Leva } from "leva";
import { Experience } from "./Experience";
import { UI } from "./UI";

const Home = () => {
  return (
    <>
      <Loader />
      <Leva hidden />
      <UI />
      <Canvas shadows camera={{ position: [0, 0, 1], fov: 30 }} style={{position:"absolute"}}>
        <Experience />
      </Canvas>
    </>
  );
};

export default Home;
