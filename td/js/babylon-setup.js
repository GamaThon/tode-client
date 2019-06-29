import {Baby} from './baby.js'
import {MapManager} from "./buildmap.js";

export class Setup {

    static start() {
        Baby.canvas = document.getElementById("renderCanvas");
        Baby.engine = new BABYLON.Engine(Baby.canvas, true, {preserveDrawingBuffer: true, stencil: true});
        Baby.scene = new BABYLON.Scene(Baby.engine);

        
        //Model creation - https://doc.babylonjs.com/how_to/how_to_use_assetsmanager
        let assetsManager = new BABYLON.AssetsManager(Baby.scene);
        let meshTask = assetsManager.addMeshTask("meshtask1", "", "td/models/", "tower.babylon");
        
        let texture;
        let meshes;
        
        meshTask.onSuccess = function (task) {
                meshes = task.loadedMeshes;
                console.log("MESHLOADEDTASK LENGTH: " +task.loadedMeshes.length)
                mesh.material = new BABYLON.StandardMaterial("tower1material", Baby.scene)
                updateTexture();
            }	

            let textureTask = assetsManager.addTextureTask("textureTask", "td/textures/tower1.jpg")

        textureTask.onSuccess = function (task) {
                texture = task.texture;
                updateTexture();
            }

            let matera1 = new BABYLON.StandardMaterial("Mat", Baby.scene);
            matera1.ambientTexture = new BABYLON.Texture("td/textures/tower1.jpg", Baby.scene);

            function updateTexture() {
                
                    if (meshes && texture) {
                    
    
                    const scl = 0.06
                    const scalingFactor = new BABYLON.Vector3(scl, 0.04, scl)
                    
                    for(const m of meshes) {
                        m.scaling = scalingFactor;
                        m.material = matera1;
                        m.material.emissiveColor = BABYLON.Color3.Red();
                        m.material.diffuseColor = BABYLON.Color3.Yellow();        
                    }    
                }
            
                
            }
            
            assetsManager.load();
        //End Model creation / AssetManager role

        //Person 1
        // Radians explained: https://en.wikipedia.org/wiki/Unit_circle#/media/File:Unit_circle_angles_color.svg
        // Vector: x, lower/raise camera, z --> Used for point of rotation for camera
        Baby.camera = new BABYLON.ArcRotateCamera("Camera", Math.PI, 2 * Math.PI / 6, 250, new BABYLON.Vector3(160, -40, 160), Baby.scene);
        //Person 2
        // Baby.camera = new BABYLON.ArcRotateCamera("Camera", 0, 2 * Math.PI / 6, 250, new BABYLON.Vector3(150, -40, 150), Baby.scene);
        Baby.camera.attachControl(Baby.canvas, true);


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
        Setup.createBaseCreep()
        Setup.createTwoCreeps()
        Setup.createBaseTree(3 * 20, -4, 12 * 20)
        //More trees
        Setup.createAnotherTree("1", 4 * 20, -4, 13 * 20)
        Setup.createAnotherTree("2", 3 * 20, -4, 13 * 20)
        Setup.createAnotherTree("3", 4 * 20, -4, 12 * 20)
        Setup.createAnotherTree("4", 255, -4, 62.5)
        Setup.createAnotherTree("5", 255, -4, 78)
        Setup.createAnotherTree("6", 240, -4, 78)
        Setup.createAnotherTree("7", 240, -4, 62.5)

        const track = BABYLON.MeshBuilder.CreateLines('track', {points: this.createPath1()}, Baby.scene);
        track.color = new BABYLON.Color3(0, 0, 0);


        const trackP2 = BABYLON.MeshBuilder.CreateLines('track2', {points: this.createPath2()}, Baby.scene);
        trackP2.color = new BABYLON.Color3(0, 0, 0);


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

        Baby.grassMaterial = new BABYLON.StandardMaterial("grassMaterial", Baby.scene);
        Baby.grassMaterial.diffuseTexture = new BABYLON.Texture("td/textures/grass_tile.jpg", Baby.scene);

        Baby.treeMaterial = new BABYLON.StandardMaterial("treeMaterial", Baby.scene);
        Baby.treeMaterial.diffuseTexture = new BABYLON.Texture("td/textures/tree_tile.jpg", Baby.scene);

        Baby.waterMaterial = new BABYLON.StandardMaterial("waterMaterial", Baby.scene);
        Baby.waterMaterial.diffuseTexture = new BABYLON.Texture("td/textures/water_tile.jpg", Baby.scene);
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

                if (row === 3) {
                    newTile.material = Baby.grassMaterial
                }

                if (row === 4) {
                    newTile.material = Baby.treeMaterial
                }

                if (row === 5) {
                    newTile.material = Baby.waterMaterial
                }

                newTile.visibility = true
            }
            pX = 0
        }


    }

    static createPath1() {
        let p = []
        p.push(new BABYLON.Vector3(20, 8, 160))
        p.push(new BABYLON.Vector3(300, 8, 160))
        return p;
    }

    static createPath2() {

        let p = [];
        p.push(this.getVector3(1, 8, 8))
        p.push(this.getVector3(1, 8, 6))
        p.push(this.getVector3(3, 8, 6))
        p.push(this.getVector3(3, 8, 3))
        p.push(this.getVector3(7, 8, 3))
        p.push(this.getVector3(7, 8, 4))
        p.push(this.getVector3(8, 8, 4))
        p.push(this.getVector3(8, 8, 12))
        p.push(this.getVector3(9, 8, 12))
        p.push(this.getVector3(9, 8, 13))
        p.push(this.getVector3(13, 8, 13))
        p.push(this.getVector3(13, 8, 10))
        p.push(this.getVector3(15, 8, 10))
        p.push(this.getVector3(15, 8, 8))
        return p;
    }

    static getVector3(x, y, z) {
        return new BABYLON.Vector3(x * 20, 8, z * 20)
    }


    static createBaseCreep() {

        Baby.sphereMaterial = new BABYLON.StandardMaterial("sphereMaterial", Baby.scene);
        Baby.sphereMaterial.diffuseTexture = new BABYLON.Texture("//www.babylonjs.com/assets/wood.jpg", Baby.scene);

        Baby.sphereMesh = BABYLON.Mesh.CreateSphere("sphere", 20, 10, Baby.scene)
        Baby.sphereMesh.position.y = 7
        Baby.sphereMesh.material = Baby.sphereMaterial

        Baby.sphereMesh.position.x = 20
        Baby.sphereMesh.position.y = 8
        Baby.sphereMesh.position.z = 20 * 8


        Baby.sphereMesh.visibility = false

    }

    static createTwoCreeps() {
        Baby.c1 = Baby.sphereMesh.clone("c1")
        Baby.c1.visibility = true

        Baby.c2 = Baby.sphereMesh.clone("c1")
        Baby.c2.position.x = 15 * 20
        Baby.c2.visibility = true



        //Move it
        let i = setInterval(() => {
            Baby.c1.position.x += 0.5
            if (Baby.c1.position.x > 300) {
                clearInterval(i)
                Baby.c1.dispose()
            }

        }, 30)

        let i2 = setInterval(() => {
            Baby.c2.position.x -= 0.5
            if (Baby.c2.position.x < 20) {
                clearInterval(i2)
                Baby.c2.dispose()
            }

        }, 30)



    }

    static createAnotherTree(id, x, y, z) {
        let tree = Baby.tree.clone("tree" + id)
        tree.position.x = x
        tree.position.y = y
        tree.position.z = z

    }


    static createBaseTree(x, y, z) {

    //leaf material
    	let green = new BABYLON.StandardMaterial("green", Baby.scene);
    	green.diffuseColor = new BABYLON.Color3(0,1,0);

    	//trunk and branch material
    	let bark = new BABYLON.StandardMaterial("bark", Baby.scene);
    	bark.emissiveTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg", Baby.scene);
    	bark.diffuseTexture = new BABYLON.Texture("https://upload.wikimedia.org/wikipedia/commons/thumb/d/da/Bark_texture_wood.jpg/800px-Bark_texture_wood.jpg", Baby.scene);
    	bark.diffuseTexture.uScale = 2.0;//Repeat 5 times on the Vertical Axes
    	bark.diffuseTexture.vScale = 2.0;//Repeat 5 times on the Horizontal Axes

    	//Tree parameters
    	let trunk_height = 20;
        let trunk_taper = 0.6;
        let trunk_slices = 5;
        let boughs = 2; // 1 or 2
    	let forks = 4;
    	let fork_angle = Math.PI/4;
        let fork_ratio = 2/(1+Math.sqrt(5)); //PHI the golden ratio
    	let branch_angle = Math.PI/3;
    	let bow_freq = 2;
    	let bow_height = 3.5;
    	let branches = 10;
    	let leaves_on_branch = 5;
        let leaf_wh_ratio = 0.5;

        var coordSystem=function(b){var g=b.normalize();b=0==Math.abs(b.x)&&0==Math.abs(b.y)?(new BABYLON.Vector3(b.z,0,0)).normalize():(new BABYLON.Vector3(b.y,-b.x,0)).normalize();var r=BABYLON.Vector3.Cross(b,g);return{x:b,y:g,z:r}},randPct=function(b,g){return 0==g?b:(1+(1-2*Math.random())*g)*b},createBranch=function(b,g,r,w,h,l,v,n,x){for(var t=[],d,c=[],f,q=[],a=0;12>a;a++)t[a]=[];for(var m=0;m<h;m++)for(a=m/h,d=g.y.scale(a*r),d.addInPlace(g.x.scale(v*Math.exp(-a)*Math.sin(l*a*Math.PI))),d.addInPlace(b),c[m]=d,d=n*(1+(.4*Math.random()-.2))*(1-(1-w)*a),q.push(d),a=0;12>a;a++)f=a*Math.PI/6,f=g.x.scale(d*Math.cos(f)).add(g.z.scale(d*Math.sin(f))),f.addInPlace(c[m]),t[a].push(f);for(a=0;12>a;a++)t[a].push(c[c.length-1]);return{branch:BABYLON.MeshBuilder.CreateRibbon("branch",{pathArray:t,closeArray:!0},x),core:c,_radii:q}},createTreeBase=function(b,g,r,w,h,l,v,n,x,t){var d=2/(1+Math.sqrt(5)),c=new BABYLON.Vector3(0,1,0),f,c=coordSystem(c),q=new BABYLON.Vector3(0,0,0),a=[],m=[],e=[],A=[],q=createBranch(q,c,b,g,r,1,x,1,t);a.push(q.branch);var y=q.core;m.push(y);e.push(q._radii);A.push(c);for(var q=y[y.length-1],y=2*Math.PI/h,z,u,p,C,B=0;B<h;B++)if(f=randPct(B*y,.25),f=c.y.scale(Math.cos(randPct(l,.15))).add(c.x.scale(Math.sin(randPct(l,.15))*Math.sin(f))).add(c.z.scale(Math.sin(randPct(l,.15))*Math.cos(f))),z=coordSystem(f),f=createBranch(q,z,b*v,g,r,n,x*d,g,t),p=f.core,p=p[p.length-1],a.push(f.branch),m.push(f.core),e.push(f._radii),A.push(z),1<w)for(var D=0;D<h;D++)u=randPct(D*y,.25),u=z.y.scale(Math.cos(randPct(l,.15))).add(z.x.scale(Math.sin(randPct(l,.15))*Math.sin(u))).add(z.z.scale(Math.sin(randPct(l,.15))*Math.cos(u))),u=coordSystem(u),C=createBranch(p,u,b*v*v,g,r,n,x*d*d,g*g,t),a.push(C.branch),m.push(C.core),e.push(f._radii),A.push(u);return{tree:BABYLON.Mesh.MergeMeshes(a),paths:m,radii:e,directions:A}},createTree=function(b,g,r,w,h,l,v,n,x,t,d,c,f,q,a,m){1!=h&&2!=h&&(h=1);var e=createTreeBase(b,g,r,h,l,v,n,d,c,m);e.tree.material=w;var A=b*Math.pow(n,h),y=A/(2*f),z=1.5*Math.pow(g,h-1);n=BABYLON.MeshBuilder.CreateDisc("leaf",{radius:z/2,tessellation:12,sideOrientation:BABYLON.Mesh.DOUBLESIDE},m);b=new BABYLON.SolidParticleSystem("leaveSPS",m,{updatable:!1});b.addShape(n,2*f*Math.pow(l,h),{positionFunction:function(b,a,g){a=Math.floor(g/(2*f));1==h?a++:a=2+a%l+Math.floor(a/l)*(l+1);var E=(g%(2*f)*y+3*y/2)/A,d=Math.ceil(r*E);d>e.paths[a].length-1&&(d=e.paths[a].length-1);var k=d-1,c=k/(r-1),m=d/(r-1);b.position=new BABYLON.Vector3(e.paths[a][k].x+(e.paths[a][d].x-e.paths[a][k].x)*(E-c)/(m-c),e.paths[a][k].y+(e.paths[a][d].y-e.paths[a][k].y)*(E-c)/(m-c)+(.6*z/q+e.radii[a][d])*(g%2*2-1),e.paths[a][k].z+(e.paths[a][d].z-e.paths[a][k].z)*(E-c)/(m-c));b.rotation.z=Math.random()*Math.PI/4;b.rotation.y=Math.random()*Math.PI/2;b.rotation.z=Math.random()*Math.PI/4;b.scale.y=1/q}});b=b.buildMesh();b.billboard=!0;n.dispose();d=new BABYLON.SolidParticleSystem("miniSPS",m,{updatable:!1});n=new BABYLON.SolidParticleSystem("minileavesSPS",m,{updatable:!1});var u=[];c=2*Math.PI/l;for(var p=0;p<Math.pow(l,h+1);p++)u.push(randPct(Math.floor(p/Math.pow(l,h))*c,.2));c=function(a,b,d){var c=d%Math.pow(l,h);1==h?c++:c=2+c%l+Math.floor(c/l)*(l+1);var f=e.directions[c],c=new BABYLON.Vector3(e.paths[c][e.paths[c].length-1].x,e.paths[c][e.paths[c].length-1].y,e.paths[c][e.paths[c].length-1].z),k=u[d],k=f.y.scale(Math.cos(randPct(v,0))).add(f.x.scale(Math.sin(randPct(v,0))*Math.sin(k))).add(f.z.scale(Math.sin(randPct(v,0))*Math.cos(k))),f=BABYLON.Vector3.Cross(BABYLON.Axis.Y,k),k=Math.acos(BABYLON.Vector3.Dot(k,BABYLON.Axis.Y)/k.length());a.scale=new BABYLON.Vector3(Math.pow(g,h+1),Math.pow(g,h+1),Math.pow(g,h+1));a.quaternion=BABYLON.Quaternion.RotationAxis(f,k);a.position=c;};for(var C=[],B=[],p=e.paths.length,D=e.paths[0].length,F=0;F<x;F++)C.push(2*Math.PI*Math.random()-Math.PI),B.push([Math.floor(Math.random()*p),Math.floor(Math.random()*(D-1)+1)]);p=function(a,c,b){var d=B[b][0],f=B[b][1],k=e.directions[d];c=new BABYLON.Vector3(e.paths[d][f].x,e.paths[d][f].y,e.paths[d][f].z);c.addInPlace(k.z.scale(e.radii[d][f]/2));b=C[b];k=k.y.scale(Math.cos(randPct(t,0))).add(k.x.scale(Math.sin(randPct(t,0))*Math.sin(b))).add(k.z.scale(Math.sin(randPct(t,0))*Math.cos(b)));b=BABYLON.Vector3.Cross(BABYLON.Axis.Y,k);k=Math.acos(BABYLON.Vector3.Dot(k,BABYLON.Axis.Y)/k.length());a.scale=new BABYLON.Vector3(Math.pow(g,h+1),Math.pow(g,h+1),Math.pow(g,h+1));a.quaternion=BABYLON.Quaternion.RotationAxis(b,k);a.position=c};d.addShape(e.tree,Math.pow(l,h+1),{positionFunction:c});d.addShape(e.tree,x,{positionFunction:p});d=d.buildMesh();d.material=w;n.addShape(b,Math.pow(l,h+1),{positionFunction:c});n.addShape(b,x,{positionFunction:p});w=n.buildMesh();b.dispose();w.material=a;a=BABYLON.MeshBuilder.CreateBox("",{},m);a.isVisible=!1;e.tree.parent=a;d.parent=a;return w.parent=a};

    	let tree = createTree(trunk_height, trunk_taper, trunk_slices, bark, boughs, forks, fork_angle, fork_ratio, branches, branch_angle, bow_freq, bow_height, leaves_on_branch, leaf_wh_ratio, green, Baby.scene);
        tree.position.y = -10;

        // tree.visibility = false
        tree.position.x = x
        tree.position.y = y
        tree.position.z = z

        Baby.tree = tree


    }


}