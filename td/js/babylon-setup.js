import {Baby} from './baby.js'

export class Setup {

    static start() {
        Baby.canvas = document.getElementById("renderCanvas");
        Baby.engine = new BABYLON.Engine(Baby.canvas, true, {preserveDrawingBuffer: true, stencil: true});
        Baby.scene = new BABYLON.Scene(Baby.engine);
        Baby.camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, Math.PI / 4, 100, BABYLON.Vector3.Zero(), Baby.scene);
        Baby.camera.attachControl(Baby.canvas, true);

        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), Baby.scene);

        // Skybox
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, Baby.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", Baby.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/TropicalSunnyDay", Baby.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // Ground
        const groundTexture = new BABYLON.Texture("textures/sand.jpg", Baby.scene);
        groundTexture.vScale = groundTexture.uScale = 4.0;

        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", Baby.scene);
        groundMaterial.diffuseTexture = groundTexture;

        const ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 32, Baby.scene, false);
        ground.position.y = -1;
        ground.material = groundMaterial;

        // Water
        const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, Baby.scene, false);
        const water = new BABYLON.WaterMaterial("water", Baby.scene, new BABYLON.Vector2(1024, 1024));
        water.backFaceCulling = true;
        water.bumpTexture = new BABYLON.Texture("textures/waterbump.png", Baby.scene);
        water.windForce = -5;
        water.waveHeight = 0.5;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;
        water.colorBlendFactor = 0;
        water.addToRenderList(skybox);
        water.addToRenderList(ground);
        waterMesh.material = water;


        Baby.engine.runRenderLoop(function () {
            if (Baby.scene) {
                Baby.scene.render();
            }
        });

        // Resize
        window.addEventListener("resize", function () {
            Baby.engine.resize();
        });
    }
}