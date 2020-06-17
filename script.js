"use strict";
var THREE = window.THREE;
var WALL_SIZE = 30;
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
function makeWall(lineCount, color, pointsFn) {
    var material = new THREE.LineBasicMaterial({ color: color });
    var wall = new THREE.Mesh();
    for (var i = 0; i < lineCount; i++) {
        var geometry = new THREE.BufferGeometry().setFromPoints(pointsFn(i));
        wall.add(new THREE.Line(geometry, material));
    }
    return wall;
}
var floor = makeWall(WALL_SIZE * 2, 0xffff00, function (i) { return [
    new THREE.Vector3(i, 0, 0),
    new THREE.Vector3(i, 0, WALL_SIZE * 2)
]; });
scene.add(floor);
var leftWall = makeWall(WALL_SIZE, 0xff00ff, function (i) { return [
    new THREE.Vector3(0, i, 0),
    new THREE.Vector3(0, i, WALL_SIZE * 2)
]; });
scene.add(leftWall);
var backWall = makeWall(WALL_SIZE, 0x00ff00, function (i) { return [
    new THREE.Vector3(0, i, 0),
    new THREE.Vector3(WALL_SIZE * 2, i, 0)
]; });
scene.add(backWall);
camera.position.x = WALL_SIZE / 3;
camera.position.y = WALL_SIZE / 3;
camera.position.z = WALL_SIZE / 3;
var PI = 3.14159;
function addToVector(dest, vec) {
    dest.x += vec.x;
    dest.y += vec.y;
    dest.z += vec.z;
}
function randomNumber(min, max) {
    return Math.random() * (max - min) + min;
}
function getCameraAnimation() {
    // We only have two walls and a floor - need to make sure the camera doesn't look
    // away into empty space.  So:
    //
    // rotation.x should be between 0 and -0.5*PI
    // rotation.y should be between 0 and 0.5*PI
    // rotation.z can be anything.
    // position.x/y/z should be between at most WALL_SIZE/4, and at least around 4
    // (0 would be in the same plane as a wall/floor).
    var newRotation = {
        x: randomNumber(0, -0.5 * PI),
        y: randomNumber(0, 0.5 * PI),
        x: randomNumber(-0.15 * PI, -0.15 * PI),
        z: Math.random() * 0.3 * PI - 0.15
    };
    var newPosition = {
        x: randomNumber(WALL_SIZE / 4, WALL_SIZE / 3),
        y: randomNumber(WALL_SIZE / 8, WALL_SIZE / 3),
        z: randomNumber(WALL_SIZE / 4, WALL_SIZE / 3)
    };
    var newPY = Math.random() * (WALL_SIZE / 4 - 2) + 2;
    var animationFrames = 240;
    return {
        animationFrames: animationFrames,
        rotationIncrement: {
            x: (newRotation.x - camera.rotation.x) / animationFrames,
            y: (newRotation.y - camera.rotation.y) / animationFrames,
            z: (newRotation.z - camera.rotation.z) / animationFrames
        },
        positionIncrement: {
            x: (newPosition.x - camera.position.x) / animationFrames,
            y: (newPosition.y - camera.position.y) / animationFrames,
            z: (newPosition.z - camera.position.z) / animationFrames
        }
    };
}
var animationFrames = 0;
var rotationIncrement = { x: 0, y: 0, z: 0 };
var positionIncrement = { x: 0, y: 0, z: 0 };
var animate = function () {
    var _a;
    requestAnimationFrame(animate);
    if (animationFrames === 0) {
        (_a = getCameraAnimation(), animationFrames = _a.animationFrames, rotationIncrement = _a.rotationIncrement, positionIncrement = _a.positionIncrement);
    }
    addToVector(camera.rotation, rotationIncrement);
    addToVector(camera.position, positionIncrement);
    animationFrames--;
    renderer.render(scene, camera);
};
animate();
$(function () {
    $(".shape").addClass("shape-border");
    $(".svg-wrapper").click(function () {
        $(".shape").toggleClass("shape-border");
    });
});
$(function () {
    $(".shape").addClass("shape-border");
    $(".svg-wrapper").click(function () {
        $(".shape").toggleClass("shape-border");
    });
});