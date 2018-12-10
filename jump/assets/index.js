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

//照相机配置
var fov = 45,//拍摄距离  视野角值越大，场景中的物体越小
    near = 0.1,//最小范围
    far = 1000;//最大范围


//初始化渲染器
var renderer;

function initRenderer() {
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(_clientWidth, _clientHeight);
    renderer.shadowMap.enabled = true;//渲染投影
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 更加柔和的阴影,默认的是THREE.PCFShadowMap
    renderer.shadowMap.soft = true;
    renderer.shadowMap.height = 1024 * 4;
    renderer.shadowMap.width = 1024 * 4;
    _container.appendChild(renderer.domElement);
    renderer.setClearColor(0xff0000, 1.0);
}

//初始化相机
var camera,
    lookAtPos = [0, 0, 0];//相机位置
function initCamera() {
    //透视相机
    camera = new THREE.PerspectiveCamera(fov, _clientWidth / _clientHeight, near, 1000); // fov, aspect, near, far
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 18;//18
    camera.lookAt = lookAtPos;
}

//初始化场景
var scene, group;

function initScene() {
    scene = new THREE.Scene();
    scene.rotation.x = -Math.PI / 4;
    scene.position.set(0, 0, 0);
    scene.background = 0xFFB6C1;

    group = new THREE.Group();
    scene.add(group);
}

//添加光源
var light;

function initLight() {
    //方向光
    light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(200, -80, 230); // 200, -80, 280
    light.castShadow = true;//开启投影
    light.target = plane;

    light.shadow.camera.near = 0.5;    // default0.5产生阴影的最近距离
    light.shadow.camera.far = 5000; // 200产生阴影的最远距离
    console.log(light.shadow.camera.left);
    light.shadow.camera.left = -50; //产生阴影距离位置的最左边位置
    light.shadow.camera.right = 20; //最右边
    light.shadow.camera.top = 50; //最上边
    light.shadow.camera.bottom = -50; //最下面

    //这两个值决定使用多少像素生成阴影 默认512，值越大，阴影效果越好
    light.shadow.mapSize.width = 4096;  // default512
    light.shadow.mapSize.height = 4096; // default512


    light.shadow.camera.visible = true;
    scene.add(light);
    // group.add(light);
    //环境光
    light = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(light);
    // group.add(light);
}

//地面
var plane, planeSize = [50, 50];//地面大小
function initPlane() {
    var geometry = new THREE.PlaneGeometry(planeSize[0], planeSize[1]);
    var material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
    plane = new THREE.Mesh(geometry, material);
    plane.receiveShadow = true;//接收投影
    plane.position.set(0, 0, 0);
    scene.add(plane);
}

//加载模型文件，和纹理图片
var role;
var _material = [];
var base_url = '../assets/materials/',
    load_materialss = ['bag.png', 'dict.png', 'disk.png', 'disk_dark.png', 'door.png', 'emotion.png', 'express.png', 'gift.png',
    'glow_bag.png', 'golf_bottom.png', 'golf_top.png', 'gray.png', 'green.png', 'green_face.png', 'head.png', 'medicine.png', 'money.png',
    'well.png', 'westore.png', 'westore_desk.png', 'white_face.png'];

function initLoader() {
    var material = new THREE.MeshLambertMaterial({color: 0x000000, side: THREE.DoubleSide});
    var loader = new THREE.FBXLoader(); // 3d模型loader
    // var texture = new THREE.ImageUtils.loadTexture; // 图片loader，用来做纹理
    loader.manager.onProgress = function (e) {
        console.log(e);
    }
    // 加载3D模型
    loader.load("../assets/Samba Dancing.fbx", function (object) {
        object.scale.set(0.005, 0.005, 0.005);
        object.rotation.x = Math.PI / 4;
        object.position.set(boxList[activeIndex].position.x, boxList[activeIndex].position.y, boxList[activeIndex].position.z);
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

    // 同步加载纹理
    for(var i = 0; i < load_materialss.length; i++) {
        var texture = THREE.ImageUtils.loadTexture(base_url + load_materialss[i]);
        _material.push(new THREE.MeshLambertMaterial({color: 0x999999, map: texture}));
    }
}

document.getElementById('start').onclick = function (e) {
    e.target.parentNode.style.display = 'none';
    e.preventDefault();
}


/* *
 *  构造一个盒子，接受长宽高以及位置
 * params:
 * l:长
 * w:宽
 * h:高
 * */
var Box = function (size, position) {
    var geometry = new THREE.BoxGeometry(size.l, size.w, size.h);
    var _box = new THREE.Mesh(geometry, _material[Math.floor(Math.random() * 100) % _material.length]);
    _box.rotation.z = Math.PI / 4;
    _box.castShadow = true;//开启投影
    _box.receiveShadow = true;//接收投影
    _box.position.set(position.x, position.y, position.z);
    return _box;
}

//盒子初始化时自由下落动画，
function animateBox(mesh, startZ, endZ) {
    if (mesh.type == 'Group') { // Group标示和角色
        canJump = false;
    }
    group.add(mesh);
    if (group.children.length > 6) {
        group.children.shift();
    }

    if (group.children.indexOf('Group') < 0 && role) {
        group.add(role);
    }

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
        if (mesh.type == 'Group') {
            canJump = true;
        }
    });
}

/**
 *
 * @param role
 * @param pow pow等于400等于场景中的1个单位
 */
function animateRole(role, pow) {
    canJump = false;

    var _tween = new TWEEN.Tween({
        x: role.position.x,
        y: role.position.y,
        z: role.position.z,
        rx: role.rotation.x,
        ry: role.rotation.y,
        rz: role.rotation.z
    });

    if(dir === 0 ) { // 向x轴正向移动
        _tween.to({
            x: role.position.x + pow / 400,
            y: role.position.y + pow / 400,
            z: role.position.z,
            rx: role.rotation.x + Math.PI * 2,
            ry: role.rotation.y,
            rz: role.rotation.z
        }, 750);
    } else {
        _tween.to({
            x: role.position.x - pow / 400,
            y: role.position.y + pow / 400,
            z: role.position.z,
            rx: role.rotation.x,
            ry: role.rotation.y + Math.PI * 2,
            rz: role.rotation.z
        }, 750);
    }

    _tween.easing(TWEEN.Easing.Linear.None);//反弹Bounce
    _tween.start();

    animate();
    function animate() {
        requestNextAnimationFrame(animate);
        TWEEN.update();
    }

    _tween.onUpdate(function () {
        role.position.z = this._object.z;
        role.position.x = this._object.x;
        role.position.y = this._object.y;
        role.rotation.z = this._object.rx;
        role.rotation.x = this._object.ry;
        role.rotation.y = this._object.rz;
        renderer.render(scene, camera);
    });
    _tween.onComplete(function () {
        canJump = true;
        console.log(role);
    });


    //角色移动，抛物线函数，role为移动的物体,pow接受初始力度/速度参数，默认方向为45度
    // var _mark = 0;//标记角色运动到z值等于1到次数
    // var start_time = +new Date();//运动开始时间
    // var _vxy = pow / Math.sqrt(2) / 100;//x,y方向初始速度，
    // var G = 9.7 * 3;//重力加速度，z方向的下降速度
    // var _vz = pow * 2 / Math.sqrt(3) / 50;//z轴方向初始速度
    //
    // requestNextAnimationFrame(function step() {
    //     var d_time = (new Date() - start_time) / 1000;
    //     start_time = +new Date();
    //     _vz = _vz - G * d_time;
    //
    //     if (dir == 0) {
    //         role.position.set(role.position.x + _vxy * d_time, role.position.y + _vxy * d_time, role.position.z + _vz * d_time);
    //     }
    //     else {
    //         role.position.set(role.position.x - _vxy * d_time, role.position.y + _vxy * d_time, role.position.z + _vz * d_time);
    //     }
    //
    //     // role.rotation.x = role.rotation.x - Math.PI / 100;
    //
    //     if (role.position.z < 1 && _mark != 1) {
    //         _mark = 0;
    //     }
    //     if (role.position.z > 1) {
    //         _mark = 1;
    //     }
    //     if (role.position.z <= 1 && _mark == 1) {
    //         _mark = 2;
    //     }
    //
    //     if (_mark != 2) {
    //         requestNextAnimationFrame(step);
    //         renderer.render(scene, camera);
    //     }
    //     else {
    //         role.position.z = 1;
    //         renderer.render(scene, camera);
    //         activeIndex++;
    //         if (check()) {//成功，进入下一步
    //             score++;
    //             canJump = true;
    //             document.getElementById('score').innerText = score;
    //             nextStep();
    //         }
    //         else {
    //             animateBox(role, role.position.z, 0);
    //             setTimeout(function () {
    //                 document.getElementById('restartwrap').style.display = 'block';
    //             }, 1000);
    //         }
    //     }
    // });
}

//检查跳跃后的结果
function check() {
    var points = getPoints(boxList[activeIndex]),
        result = true;
    //判断落点是否在下一个box上
    return true;
    outer:
        for (var i = 0; i < points.length; i++) {
            var p = points[i];
            switch (i) {
                case 0:
                    if (role.position.x > p[0] && role.position.y < p[1]) {
                        break;
                    }
                    else {
                        result = false;
                        break outer;
                    }
                case 1:
                    if (role.position.x < p[0] && role.position.y < p[1]) {
                        break;
                    }
                    else {
                        result = false;
                        break outer;
                    }
                case 2:
                    if (role.position.x > p[0] && role.position.y > p[1]) {
                        break;
                    }
                    else {
                        result = false;
                        break outer;
                    }
                case 3:
                    if (role.position.x < p[0] && role.position.y > p[1]) {
                        break;
                    }
                    else {
                        result = false;
                        break outer;
                    }
            }
        }
    ;
    return result;
}

//根据盒子大小和位置，计算盒子上方四个顶点的位置,此计算忽略z轴的值,返回[上左点位置，上右，下右，下左]
function getPoints(box) {
    return [
        [box.position.x - box.size.w / 2, box.position.y + box.size.l / 2],
        [box.position.x + box.size.w / 2, box.position.y + box.size.l / 2],
        [box.position.x - box.size.w / 2, box.position.y - box.size.l / 2],
        [box.position.x + box.size.w / 2, box.position.y - box.size.l / 2]
    ];
}

/**
 * 移动所有的盒子和角色的位置
 * @param distance [x,y]
 */
function animateScene(distance) {
    var role_tween = new TWEEN.Tween(group.position);
    role_tween.to({x: group.position.x - distance[0], y: group.position.y - distance[1], z: group.position.z}, 750);
    role_tween.easing(TWEEN.Easing.Linear.None);//
    role_tween.start();

    _animate();

    function _animate() {
        requestNextAnimationFrame(_animate);
        TWEEN.update();
    }

    role_tween.onUpdate(function () {
        group.position.set(this._object.x, this._object.y, this._object.z);
        renderer.render(scene, camera);
    });
}

//新建一个盒子，并移动场景位置
function nextStep() {
    var _box, _position,
        nextDistance = Math.ceil(Math.random() * 2),//下一个盒子距上一个点距离
        prevBoxDistance = [];//角色上次移动的距离[x,y]

    prevBoxDistance = [
        boxList[activeIndex].position.x - boxList[activeIndex - 1].position.x,
        boxList[activeIndex].position.y - boxList[activeIndex - 1].position.y
    ];

    //随机方向
    dir = Math.random() > 0.5 ? 0 : 1;//方向变量，0为x，y轴方向，1为-x，y轴方向
    if (dir == 0) {
        _position = {
            x: boxList[activeIndex].position.x + nextDistance + boxList[activeIndex].size.l / 2,
            y: boxList[activeIndex].position.y + nextDistance + boxList[activeIndex].size.w / 2,
            z: boxList[activeIndex].position.z
        }
    }
    else {
        _position = {
            x: boxList[activeIndex].position.x - nextDistance - boxList[activeIndex].size.l / 2,
            y: boxList[activeIndex].position.y + nextDistance + boxList[activeIndex].size.w / 2,
            z: boxList[activeIndex].position.z
        }
    }
    // var _box_size = Math.ceil(Math.random()*2);
    var _box_size = 2;
    _box = new Box({l: _box_size, w: _box_size, h: 1}, _position);
    _box.size = {l: _box_size, w: _box_size, h: 1};
    boxList.push(_box);
    animateScene(prevBoxDistance);
    // setTimeout(function () {
    animateBox(_box, 2, 0.52);
    // },750);
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

var cameraRound = 18;
var xarf = 0;
var xoldArf = 0;
var yarf = 0;
var yoldArf = 0;
var mouseDownY, mouseDownX, moveCamera = false;

function init() {
    initRenderer();
    initCamera();
    initScene();
    initPlane();
    initLoader();
    initLight();
    start();
    //监听鼠标滚动事件，改变相机fov值
    _container.addEventListener('mousewheel', mousewheel, false);
    // //监听鼠标拖动事件，旋转场景
    // _container.addEventListener('mousedown',function(ev) {
    //     moveCamera = true;
    //     mouseDownY = ev.pageY;
    //     mouseDownX = ev.pageX;
    // });
    // _container.addEventListener('mouseup',function(ev) {
    //     moveCamera = false;
    // });
    // _container.addEventListener('mousemove',function(ev) {
    //     if(moveCamera) {
    //         var zeroPoint = new THREE.Vector3(0, 0, 0);
    //         var mouseMoveY = ev.pageY;
    //         var mouseMoveX = ev.pageX;
    //         xarf = (mouseMoveX - mouseDownX)/1000; // 角度
    //         yarf = (mouseMoveY - mouseDownY)/1000;
    //         // camera.position.z = cameraRound *(Math.cos(xarf));
    //         // camera.position.x = cameraRound *(Math.sin(xarf));
    //         // camera.position.y = cameraRound *(Math.sin(yarf));
    //
    //         scene.rotation.x = scene.rotation.x + yarf;
    //         console.log(scene.rotation.x);
    //         scene.rotation.z = scene.rotation.z + xarf;
    //
    //         // console.log(scene.rotation)
    //         // camera.lookAt = zeroPoint;
    //         // camera.updateProjectionMatrix();
    //         renderer.render(scene, camera);
    //     }
    // });
}

function mousewheel(e) {
    e.preventDefault();
    if (e.wheelDelta) {  //判断浏览器IE，谷歌滑轮事件
        if (e.wheelDelta > 0) { //当滑轮向上滚动时
            fov -= (near < fov ? 1 : 0);
        }
        if (e.wheelDelta < 0) { //当滑轮向下滚动时
            fov += (fov < far ? 1 : 0);
        }
    } else if (e.detail) {  //Firefox滑轮事件
        if (e.detail > 0) { //当滑轮向上滚动时
            fov -= 1;
        }
        if (e.detail < 0) { //当滑轮向下滚动时
            fov += 1;
        }
    }
    console.info('camera.fov:' + camera.fov);
    console.info('camera.x:' + camera.position);
    //改变fov值，并更新场景的渲染
    camera.fov = fov;
    camera.updateProjectionMatrix();
    renderer.render(scene, camera);
    //updateinfo();
}


function start() {
    boxList = [];
    activeIndex = 0;
    dir = 0;
    score = 0;
    document.getElementById('score').innerText = score;

    var _box = new Box({l: 2, w: 2, h: 1}, {x: -1, y: -1, z: 2.5});
    _box.size = {l: 2, w: 2, h: 1};
    boxList.push(_box);
    animateBox(_box, _box.size.h / 2, _box.size.h / 2);

    _box = new Box({l: 2, w: 2, h: 1}, {x: 2, y: 2, z: 2.5});
    _box.size = {l: 2, w: 2, h: 1};
    boxList.push(_box);
    animateBox(_box, _box.size.h / 2, _box.size.h / 2);
}

function restart() {
    scene.children = [];
    scene.position.set(0, 0, 0);
    initLight();
    initPlane();
    initLoader();
    start();
}

//力度显示
var isScale = false;

function scaleMesh() {
    //跳跃前，蓄力压缩角色和box
    if (isScale && boxList[activeIndex].scale.z > 0.5 && role.scale.y > 0.0025) {
        boxList[activeIndex].scale.set(1, 1, boxList[activeIndex].scale.z - 0.005);
        boxList[activeIndex].position.set(
            boxList[activeIndex].position.x,
            boxList[activeIndex].position.y,
            boxList[activeIndex].size.h * boxList[activeIndex].scale.z / 2
        );

        role.scale.set(role.scale.x, role.scale.y - 0.000025, role.scale.z);
        role.position.set(role.position.x, role.position.y, boxList[activeIndex].size.h * boxList[activeIndex].scale.z);
        requestNextAnimationFrame(scaleMesh);
        renderer.render(scene, camera);
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
                if (canJump) {
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
                if (canJump) {
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

window.onload = function () {
    //判断浏览器是否支持webGL
    if (Detector.webgl) {
        init();
        jump.init();
    } else {
        var warning = Detector.getWebGLErrorMessage();
        document.getElementById('container').appendChild(warning);
    }
}




