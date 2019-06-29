import {Baby} from './baby.js'
import {MapManager} from "./buildmap.js";

export class Setup {

    static start() {
        Baby.canvas = document.getElementById("renderCanvas");
        Baby.engine = new BABYLON.Engine(Baby.canvas, true, {preserveDrawingBuffer: true, stencil: true});
        Baby.scene = new BABYLON.Scene(Baby.engine);
        //Person 1
        Baby.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI, Math.PI / 4, 100, new BABYLON.Vector3(150, 10, 150), Baby.scene);
        Baby.camera.setPosition(new BABYLON.Vector3(Math.PI, Math.PI / 4, 100));
        //Person 2
        // Baby.camera = new BABYLON.ArcRotateCamera("Camera", 2 * Math.PI, Math.PI / 4, 100, new BABYLON.Vector3(100, 10, 256), Baby.scene);
        Baby.camera.attachControl(Baby.canvas, true);

        // Baby.camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 10, new BABYLON.Vector3(0, 0, 0), Baby.scene);
        // Baby.camera.setPosition(new BABYLON.Vector3(0, 0, 20));
        // Baby.camera.attachControl(Baby.canvas, true);


        //Fly
        // Baby.camera = new BABYLON.FlyCamera("FlyCamera", new BABYLON.Vector3(0, 5, -10), Baby.scene);
        // Baby.camera.attachControl(Baby.canvas, true);


        //Maybe
        // Baby.camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 5, 20), Baby.scene);
        // Baby.camera.setTarget(BABYLON.Vector3.Zero());
        // Baby.camera.attachControl(Baby.canvas, true);



        const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), Baby.scene);

        // Skybox
        const skybox = BABYLON.Mesh.CreateBox("skyBox", 1000.0, Baby.scene);
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBox", Baby.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("td/textures/TropicalSunnyDay", Baby.scene);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.disableLighting = true;
        skybox.material = skyboxMaterial;

        // Ground
        const groundTexture = new BABYLON.Texture("td/textures/sand.jpg", Baby.scene);
        groundTexture.vScale = groundTexture.uScale = 4.0;

        const groundMaterial = new BABYLON.StandardMaterial("groundMaterial", Baby.scene);
        groundMaterial.diffuseTexture = groundTexture;

        const ground = BABYLON.Mesh.CreateGround("ground", 512, 512, 20, Baby.scene, false);
        ground.position.y = -1;
        ground.material = groundMaterial;
        ground.position.x += 192
        ground.position.z += 192

        // Water
        const waterMesh = BABYLON.Mesh.CreateGround("waterMesh", 512, 512, 32, Baby.scene, false);
        const water = new BABYLON.WaterMaterial("water", Baby.scene, new BABYLON.Vector2(1024, 1024));
        water.backFaceCulling = true;
        water.bumpTexture = new BABYLON.Texture("td/textures/waterbump.png", Baby.scene);
        water.windForce = -5;
        water.waveHeight = 0.5;
        water.bumpHeight = 0.1;
        water.waveLength = 0.1;
        water.colorBlendFactor = 0;
        water.addToRenderList(skybox);
        water.addToRenderList(ground);
        waterMesh.material = water;
        waterMesh.position.x += 192
        waterMesh.position.z += 192



        Baby.engine.runRenderLoop(function () {
            if (Baby.scene) {
                Baby.scene.render();
            }
        });

        // Resize
        window.addEventListener("resize", function () {
            Baby.engine.resize();
        });

        Setup.createBaseTile()
        Setup.createMap()


    }

    static createBaseTile() {
        Baby.baseTile = BABYLON.MeshBuilder.CreateBox("box", {height: 0.1, width: 20, depth: 20}, Baby.scene);
        Baby.baseTile.position.y += 3

        const myMaterial = new BABYLON.StandardMaterial("myMaterial", Baby.scene);
        myMaterial.diffuseTexture = new BABYLON.Texture("td/textures/tile1.jpg", Baby.scene);
        Baby.baseTile.material = myMaterial;
        Baby.baseTile.visibility = false


        Baby.darkMaterial = new BABYLON.StandardMaterial("darkMaterial", Baby.scene);
        Baby.darkMaterial.diffuseTexture = new BABYLON.Texture("td/textures/dark_tile.jpg", Baby.scene);
    }

    static createMap() {
        let pX = 0;
        let pZ = 0;
        for (const rows of MapManager.getMap().puzzleMaze) {
            pZ++
            for (const row of rows) {
                pX++

                if (row === 0) {
                    continue
                }

                let newTile = Baby.baseTile.clone("newTile" + pX + "." + pZ)
                newTile.position.x = pX * 20;
                newTile.position.z = pZ * 20;

                if (row === 2) {
                    newTile.material = Baby.darkMaterial
                }

                newTile.visibility = true
            }
            pX = 0
        }


    }


}