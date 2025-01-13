import { useAnimations, useFBX } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useEffect, useRef, useState } from "react";
import { useGraph } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { SkeletonUtils } from 'three-stdlib';

const facialExpressions = {
    default: {},
    // other expressions ...
};

const corresponding = {
    A: "viseme_PP",
    // other visemes...
};

let setupMode = false;

export function Avatar(props) {
    const [blink, setBlink] = useState(false);
    const [animation, setAnimation] = useState("LookAround");
    
    const { scene } = useGLTF('/models/6780edf43b064b4dff0d2278.glb');
    const clone = React.useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);

    const { animations: IdleAnimation } = useFBX("/animations/Idle.fbx");
    const { animations: AdministeringAnimation } = useFBX("/animations/Administering Cpr.fbx");
    const { animations: DismissingAnimation } = useFBX("/animations/Dismissing Gesture.fbx");
    const { animations: ThankfulAnimation } = useFBX("/animations/Thankful.fbx");
    const { animations: LookAroundAnimation } = useFBX("/animations/Look Around.fbx");
    const { animations: HeadShakeAnimation } = useFBX("/animations/Thoughtful Head Shake.fbx");

    IdleAnimation[0].name = "Idle";
    AdministeringAnimation[0].name = "Administering";
    DismissingAnimation[0].name = "Dismissing";
    ThankfulAnimation[0].name = "Thankful";
    HeadShakeAnimation[0].name = "HeadShake";  
    LookAroundAnimation[0].name = "LookAround";

    const group = useRef();
    const { actions } = useAnimations([IdleAnimation[0], AdministeringAnimation[0], DismissingAnimation[0], ThankfulAnimation[0], HeadShakeAnimation[0], LookAroundAnimation[0]], group);

    useEffect(() => {
        actions[animation].reset().fadeIn(0.5).play();
        return () => actions[animation].fadeOut(0.5);
    }, [animation]);

    useFrame(() => {
        // This stops any rotation based on user input or camera zoom changes
        group.current.rotation.set(0, 0, 0);
    });

    return (
        <group {...props} dispose={null} ref={group}>
            <primitive object={nodes.Hips} />
            <skinnedMesh geometry={nodes.Wolf3D_Outfit_Bottom.geometry} material={materials.Wolf3D_Outfit_Bottom} skeleton={nodes.Wolf3D_Outfit_Bottom.skeleton} />
            <skinnedMesh geometry={nodes.Wolf3D_Outfit_Footwear.geometry} material={materials.Wolf3D_Outfit_Footwear} skeleton={nodes.Wolf3D_Outfit_Footwear.skeleton} />
            <skinnedMesh geometry={nodes.Wolf3D_Outfit_Top.geometry} material={materials.Wolf3D_Outfit_Top} skeleton={nodes.Wolf3D_Outfit_Top.skeleton} />
            <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
            <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
            <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
            <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
        </group>
    );
}

useGLTF.preload('/models/6780edf43b064b4dff0d2278.glb');
