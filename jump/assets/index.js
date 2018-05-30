/**
 * Created by 陈俊 on 2018/3/27.
 */

var _clientWidth = document.getElementById('container').clientWidth,
    _clientHeight = document.getElementById('container').clientHeight,
    _container = document.getElementById('container'),
    activeIndex,//角色应在的box元素的下标
    dir = 0,//方向变量，0位x，y轴方向，1为-x，y轴方向
    score = 0,//得分
    canJump = false,//控制是否可以接收touch事件来进行跳跃
    context;//2d渲染环境
//初始化渲染器
var renderer;
function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(_clientWidth, _clientHeight);
    renderer.shadowMap.enabled = true;//渲染投影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.shadowMap.soft = true;
    renderer.shadowMap.height = 2048;
    renderer.shadowMap.width = 2048;
    _container.appendChild(renderer.domElement);
    renderer.setClearColor(0xf3f3f3, 1.0);
}

//初始化相机
var camera,
    lookAtPos = [0, 0, 0];//相机位置
function initCamera() {
    //透视相机
    camera = new THREE.PerspectiveCamera(45, _clientWidth / _clientHeight, 1, 10000);
    // camera.rotation.z = Math.PI / 4;
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 18;//18
    camera.lookAt = lookAtPos;
}

//初始化场景
var scene;
function initScene() {
    scene = new THREE.Scene();
    scene.rotation.x = -Math.PI / 4;
    scene.position.set(0,0,0);
    scene.background = 0xFFB6C1;
}

//添加光源
function initLight() {
    //方向光
    var light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(200, -80, 280);
    light.castShadow = true;//开启投影
    light.shadow.mapSize.width = 1024;  // default
    light.shadow.mapSize.height = 1024; // default
    light.shadow.camera.near = 0.5;    // default
    light.shadow.camera.far = 5000;
    light.shadow.camera.visible = true;
    scene.add(light);
    //环境光
    light = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(light);
}

//地面
var plane,planeSize = [100, 100];//地面大小
function initPlane() {
    var geometry = new THREE.PlaneGeometry(planeSize[0], planeSize[1]);
    var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;//接收投影
    scene.add(plane);
}

//加载3D模型文件
var role;
function initLoader() {
    var material = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide});
    var loader = new THREE.FBXLoader();
    loader.manager.onProgress = function (e) {
        console.log(e);
    }
    loader.load("../assets/Samba Dancing.fbx", function (object) {
        object.scale.set(0.005, 0.005, 0.005);
        object.rotation.x = Math.PI / 4;
        object.rotation.y = Math.PI / 4 * 3;
        object.position.set(boxList[activeIndex].position.x,boxList[activeIndex].position.y,boxList[activeIndex].position.z);
        object.traverse(function (child) {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
            child.color = 0x000000;
        });
        role = object;
        animateBox(role, 3, 1);
        document.getElementById("loadingText").style.display = 'none';
        document.getElementById("start").style.display = 'inline-block';
    });
}

document.getElementById('start').onclick = function(e){
    e.target.parentNode.style.display = 'none';
    e.preventDefault();
}


/* *
 * params:
 * l:长
 * w:宽
 * h:高
 * */
var Box = function (size, position) {
    var geometry = new THREE.BoxGeometry(size.l, size.w, size.h);
    var material = new THREE.MeshLambertMaterial({color: 0x999999});
    var _box = new THREE.Mesh(geometry, material);
    _box.rotation.z = Math.PI / 4;
    _box.castShadow = true;//开启投影
    _box.receiveShadow = true;//接收投影
    _box.position.set(position.x, position.y, position.z);
    return _box;
}


//物体初始化时自由下落动画，
function animateBox(mesh, startZ, endZ) {
    if(mesh.type == 'Group'){
        canJump = false;
    }
    scene.add(mesh);
    mesh.position.z = startZ;
    var _tween = new TWEEN.Tween(mesh.position);
    _tween.to({z: endZ}, 750);
    _tween.easing(TWEEN.Easing.Bounce.Out);//反弹Bounce
    _tween.start();

    animate();
    function animate() {
        requestNextAnimationFrame(animate);
        TWEEN.update();
    }

    _tween.onUpdate(function () {
        mesh.position.z = this._object.z;
        renderer.render(scene, camera);
    });
    _tween.onComplete(function () {
        if(mesh.type == 'Group'){
            canJump = true;
        }
    });
}

//角色移动，抛物线函数，role为移动的物体,pow接受初始力度/速度参数，默认方向为45度
function animateRole(role,pow){
    canJump = false;
    var _mark = 0;//标记角色运动到z值等于1到次数
    var start_time = +new Date();//运动开始时间
    var _vxy = pow / Math.sqrt(2) / 100;//x,y方向初始速度，
    var G = 9.7*3;//重力加速度，z方向的下降速度
    var _vz = pow * 2 / Math.sqrt(3) / 50;//z轴方向初始速度

    requestNextAnimationFrame(function step() {
        var d_time = (new Date() - start_time)/1000;
        start_time = + new Date();
        _vz = _vz - G * d_time;

        if(dir == 0){
            role.position.set(role.position.x + _vxy * d_time, role.position.y + _vxy * d_time, role.position.z + _vz * d_time);
        }
        else{
            role.position.set(role.position.x - _vxy * d_time, role.position.y + _vxy * d_time, role.position.z + _vz * d_time);
        }

        // role.rotation.x = role.rotation.x - Math.PI / 100;

        if(role.position.z < 1 && _mark != 1){
            _mark = 0;
        }
        if(role.position.z > 1){
            _mark =1;
        }
        if(role.position.z <= 1 && _mark == 1){
            _mark = 2;
        }

        if(_mark != 2){
            requestNextAnimationFrame(step);
            renderer.render(scene, camera);
        }
        else {
            role.position.z = 1;
            renderer.render(scene, camera);
            activeIndex ++;
            if(check()){//成功，进入下一步
                score++;
                canJump = true;
                document.getElementById('score').innerText = score;
                nextStep();
            }
            else{
                animateBox(role,role.position.z,0);
                setTimeout(function () {
                    document.getElementById('restartwrap').style.display = 'block';
                },1000);
            }
        }
    });
}

//检查跳跃后的结果
function check(){
    var points = getPoints(boxList[activeIndex]),
        result = true;
    //判断落点是否在下一个box上
    outer:
    for(var i = 0; i < points.length; i++){
        var p = points[i];
        switch(i){
            case 0:
                if(role.position.x > p[0] && role.position.y < p[1]){
                    break;
                }
                else{
                    result = false;
                    break outer;
                }
            case 1:
                if(role.position.x < p[0] && role.position.y < p[1]){
                    break;
                }
                else{
                    result = false;
                    break outer;
                }
            case 2:
                if(role.position.x > p[0] && role.position.y > p[1]){
                    break;
                }
                else{
                    result = false;
                    break outer;
                }
            case 3:
                if(role.position.x < p[0] && role.position.y > p[1]){
                    break;
                }
                else{
                    result = false;
                    break outer;
                }
        }
    };
    return result;
}

//根据盒子大小和位置，计算盒子上方四个顶点的位置,此计算忽略z轴的值,返回[上左点位置，上右，下右，下左]
function getPoints(box){
    return [
        [box.position.x - box.size.w/2,box.position.y+box.size.l/2],
        [box.position.x + box.size.w/2,box.position.y+box.size.l/2],
        [box.position.x - box.size.w/2,box.position.y-box.size.l/2],
        [box.position.x + box.size.w/2,box.position.y-box.size.l/2]
    ];
}

//移动场景scene
function animateScene(distance) {
    var _tween = new TWEEN.Tween(scene.position);
    _tween.to({x:scene.position.x-distance[0],y:scene.position.y-distance[1],z:scene.position.z + distance[1]}, 750);
    _tween.easing(TWEEN.Easing.Linear.None);//
    _tween.start();

    _animate();
    function _animate() {
        requestNextAnimationFrame(_animate);
        TWEEN.update();
    }

    _tween.onUpdate(function () {
        scene.position.set(this._object.x,this._object.y,this._object.z);
        renderer.render(scene, camera);
    });
}

//新建一个盒子，并移动场景位置
function nextStep(){
    var _box,_position,
        nextDistance = Math.ceil(Math.random()*2),//下一个盒子距上一个点距离
        prevBoxDistance = [];//角色上次移动的距离[x,y]

    prevBoxDistance = [
        boxList[activeIndex].position.x - boxList[activeIndex-1].position.x,
        boxList[activeIndex].position.y - boxList[activeIndex-1].position.y
    ];

    //随机方向
    dir = Math.random() > 0.5 ? 0 : 1;//方向变量，0为x，y轴方向，1为-x，y轴方向
    if(dir == 0){
        _position = {
            x: boxList[activeIndex].position.x + nextDistance + boxList[activeIndex].size.l/2,
            y: boxList[activeIndex].position.y + nextDistance + boxList[activeIndex].size.w/2,
            z: boxList[activeIndex].position.z
        }
    }
    else{
        _position = {
            x: boxList[activeIndex].position.x - nextDistance - boxList[activeIndex].size.l/2,
            y: boxList[activeIndex].position.y + nextDistance + boxList[activeIndex].size.w/2,
            z: boxList[activeIndex].position.z
        }
    }
    var _box_size = Math.ceil(Math.random()*2);
    // var _box_size = 2;
    _box = new Box({l: _box_size, w: _box_size, h: 1}, _position);
    _box.size = {l: _box_size, w: _box_size, h: 1};
    boxList.push(_box);
    animateScene(prevBoxDistance);
    setTimeout(function () {
        animateBox(_box, 2, 0.52);
    },750);
}

//计算当前动画的帧数率
var lastTime = 0;
function calculateFps() {
    var _now = +new Date(),
        fps = 1000 / (_now - lastTime);
    lastTime = _now;
    return fps;
}

//初始化
var boxList = [];//保存盒子对象列表
function init() {
    initRenderer();
    initCamera();
    initScene();
    initLight();
    initPlane();
    initLoader();
    start();
}

function start(){
    boxList = [];
    activeIndex = 0;
    dir = 0;
    score = 0;
    document.getElementById('score').innerText = score;
    var _box = new Box({l: 2, w: 2, h: 1}, {x: 0, y: 0, z: 2.5});
    _box.size = {l: 2, w: 2, h: 1};
    boxList.push(_box);
    animateBox(_box, _box.size.h/2, _box.size.h/2);

    _box = new Box({l: 2, w: 2, h: 1}, {x: 2, y: 2, z: 2.5});
    _box.size = {l: 2, w: 2, h: 1};
    boxList.push(_box);
    animateBox(_box, _box.size.h/2, _box.size.h/2);
}

function restart() {
    scene.children = [];
    scene.position.set(0,0,0);
    initLight();
    initPlane();
    initLoader();
    start();
}

//力度显示
var isScale= false;
function scaleMesh() {
    //跳跃前，蓄力压缩角色和box
    if(isScale && boxList[activeIndex].scale.z > 0.5 && role.scale.y > 0.0025){
        boxList[activeIndex].scale.set(1,1,boxList[activeIndex].scale.z-0.005);
        boxList[activeIndex].position.set(
            boxList[activeIndex].position.x,
            boxList[activeIndex].position.y,
            boxList[activeIndex].size.h*boxList[activeIndex].scale.z/2
        );

        role.scale.set(role.scale.x,role.scale.y- 0.000025,role.scale.z);
        role.position.set(role.position.x,role.position.y,boxList[activeIndex].size.h * boxList[activeIndex].scale.z);
        requestNextAnimationFrame(scaleMesh);
        renderer.render(scene,camera);
    }
}

//恢复蓄力收缩的mesh到原状
function resetMesh() {
    var mesh = boxList[activeIndex];
    var mesh_tween_scale = new TWEEN.Tween(mesh.scale);
    mesh_tween_scale.to({z: 1}, 200);
    mesh_tween_scale.easing(TWEEN.Easing.Elastic.Out);
    mesh_tween_scale.start();

    var mesh_tween_pos = new TWEEN.Tween(mesh.position);
    mesh_tween_pos.to({z: 0.5}, 0);
    mesh_tween_pos.easing(TWEEN.Easing.Linear.None);
    mesh_tween_pos.start();

    var role_tween_scale = new TWEEN.Tween(role.scale);
    role_tween_scale.to({y: 0.005}, 0);
    role_tween_scale.easing(TWEEN.Easing.Linear.None);
    role_tween_scale.start();

    var role_tween_pos = new TWEEN.Tween(role.position);
    role_tween_pos.to({z: 1}, 0);
    role_tween_pos.easing(TWEEN.Easing.Linear.None);
    role_tween_pos.start();

    animate();
    function animate() {
        requestNextAnimationFrame(animate);
        TWEEN.update();
    }

    mesh_tween_scale.onUpdate(function () {
        mesh.scale.z = this._object.z;
        renderer.render(scene, camera);
    });
    mesh_tween_pos.onUpdate(function () {
        mesh.position.z = this._object.z;
        renderer.render(scene, camera);
    });
    role_tween_scale.onUpdate(function () {
        role.scale.y = this._object.y;
        renderer.render(scene, camera);
    });
    role_tween_pos.onUpdate(function () {
        role.position.z = this._object.z;
        renderer.render(scene, camera);
    });

}

//用户操作事件
var jump = {
    downStartTime: 0,
    distanceTime: 0,//按住屏幕的时间，后面折算成弹力
    init: function () {
        if (window.navigator.appVersion.indexOf('Mobile') > -1) {
            _container.ontouchstart = function (e) {
                this.downStartTime = +new Date();
                isScale = true;
                scaleMesh();//蓄力压缩盒子和角色
                e.preventDefault();
            }
            _container.ontouchend = function (e) {
                this.distanceTime = +new Date() - this.downStartTime;
                isScale = false;
                resetMesh();//恢复被压缩到盒子和角色
                if(canJump){
                    animateRole(role, this.distanceTime);
                }
            }
        }
        else {
            _container.onmousedown = function (e) {
                this.downStartTime = +new Date();
                isScale = true;
                scaleMesh();//蓄力压缩盒子和角色
                e.preventDefault();
            }
            _container.onmouseup = function (e) {
                this.distanceTime = +new Date() - this.downStartTime;
                isScale = false;
                resetMesh();//恢复被压缩到盒子和角色
                if(canJump){
                    animateRole(role, this.distanceTime);
                }
            }
        }
        document.getElementById('restart').onclick = function (e) {
            e.target.parentNode.style.display = 'none';
            restart();
        }
    }
}

window.onload = function(){
    //判断浏览器是否支持webGL
    if (Detector.webgl) {
        init();
        jump.init();
    } else {
        var warning = Detector.getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
    }
}




