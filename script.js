
//---------------Game main functions-------------------------
let gameDiv = document.getElementById("game");
let gameSize = [parseInt(getComputedStyle(gameDiv).width), parseInt(getComputedStyle(gameDiv).height)];
let loop;
let gameSpeed = 1;
let distance = 0;
let isTheGameOver = false;

let start = () => {

    
    isTheGameOver = false;

    document.getElementById("game-start").classList.add("hidden");

    loop = setInterval(() => {
        gameLoop();
    }, 10);

    createObstacle();

    increaseSpeed();
}

let gameLoop = () => {

    controls();

    movePlayer();
    
    gravity();

    obstacleList.forEach((element) => {
        moveObstacle(element);
        if(verifyCollision(player.reference, element.reference)){
            gameOver();
        }
    });

    if(!isTheGameOver){
        increaseDistance(3);
    }
    
}

let gameOver = () => {
    clearInterval(loop);
    alert("Gamover!");
    isTheGameOver = true;
    playerAnimation(true);
    restart();
}

let restart = () => {
    obstacleList.forEach((item) =>{
        item.reference.remove();
    });

    obstacleList = [];

    player.position = [0, 300];
    player.velocity = [0, 0];
    player.canJump = true;
    distance = 0;
    increaseDistance(0);
    gameSpeed = 1;

    // keyState.forEach((element) => {
    //     element = false;
    // });

    keyState = [];

    document.getElementById("game-start").classList.remove("hidden");

}

let gravity = () => {
    player.velocity[1] += .1;
    
}

let increaseSpeed = () => {
    if(!isTheGameOver){
        setTimeout(() => {
            gameSpeed += .1;
            increaseSpeed();
        }, 5000);
    }
}

let increaseDistance = (number) => {
    distance += number;
    document.getElementById("distance-count").textContent = distance;
}

//-----------------------Obstacle-------------------------------
let obstacleList = [];

let createObstacle = () => {
    let baseElement = document.getElementsByClassName("obstacle")[0];

    let newElement = document.createElement("img");
    newElement.setAttribute("src", baseElement.getAttribute("src"));
    newElement.classList = baseElement.classList;
    
    newElement.style.left = gameSize[0] - parseInt(getComputedStyle(baseElement).width) + "px";
    newElement.style.top = gameSize[1] - parseInt(getComputedStyle(baseElement).height) + "px";
    newElement.style.zIndex = 0;

    console.log(parseInt(getComputedStyle(baseElement).height));

    newElement.classList.remove("hidden");

    let obstacle = {
        reference: newElement,
        position: [
            gameSize[0] - parseInt(getComputedStyle(baseElement).width),
            gameSize[1] - parseInt(getComputedStyle(baseElement).height)
        ]
    }

    obstacleList.push(obstacle);

    gameDiv.appendChild(obstacle.reference);

    console.log("created!@");

    nextObstacle();
}

let nextObstacle = () => {
    let min = 500;
    let maxInterval = 1500;
    let spawnTime = Math.floor(Math.random() * maxInterval) + min;
    if(!isTheGameOver){
        obstacleLoop = setTimeout(() => {
            createObstacle();
        }, spawnTime);
    }    
}

let moveObstacle = (element) => {

    element.position[0] -= 3 * gameSpeed;
    let size = [
        parseInt(getComputedStyle(element.reference).width),
        parseInt(getComputedStyle(element.reference).height)
    ];
    if(checkLimitProj(gameDiv, element.position, size).includes("left")){
        deleteObstacle(element);
    }

    element.reference.style.left = element.position[0] + "px";
    element.reference.style.top = element.position[1] + "px";
}

let deleteObstacle = (element) => {
    element.reference.remove();
        let index = obstacleList.findIndex((item) => {
            if(item === element){
                return true;
            }

            return false;
        });
        obstacleList.splice(index, 1);
}

//----------------Collision related functions-------------------

let checkLimitProj = (limiter, objPos, objectSize) => {

    let pos1 = objPos;
    
    let limiterSize = [
        parseInt(getComputedStyle(limiter).width),
        parseInt(getComputedStyle(limiter).height)
    ];

    let borders = [];

    if((pos1[0] - objectSize[0] / 2) < 0){
        borders.push("left");
    }

    if((pos1[0] + objectSize[0] / 2) > limiterSize[0]){
        borders.push("right");
    }

    if((pos1[1] - objectSize[1] / 2) < 0){
        borders.push("top");
    }

    if((pos1[1] + objectSize[1] / 2) > limiterSize[1]){
        borders.push("bottom");
    }

    return borders;

}

let getCenterPos = (element) => {
    let size = [
        parseInt(getComputedStyle(element).width),
        parseInt(getComputedStyle(element).height)
    ];

    let position = [
        parseInt(getComputedStyle(element).left),
        parseInt(getComputedStyle(element).top)
    ];

    let centerPos = [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2
    ];

    return centerPos;
}

let verifyCollision = (obj1, obj2) => {

    let centerPos1 = getCenterPos(obj1);

    let centerPos2 = getCenterPos(obj2);

    let distanceVector = [Math.abs(centerPos1[0] - centerPos2[0]), Math.abs(centerPos1[1] - centerPos2[1])];

    let size1 = [
        parseInt(getComputedStyle(obj1).width),
        parseInt(getComputedStyle(obj1).height)
    ];

    let size2 = [
        parseInt(getComputedStyle(obj2).width),
        parseInt(getComputedStyle(obj2).height)
    ];

    let limitVector = [(size1[0] + size2[0]) / 2, (size1[1] + size2[1]) / 2];

    if(distanceVector[0] < limitVector[0] && distanceVector[1] < limitVector[1]){
        return true;
    }

    return false;

}

//------------Player functions---------------

let player = {
    reference: document.getElementById("player"),
    position: [0, 300],
    velocity: [0, 0],
    jumpSpeed: 7,
    HSpeed: 2,
    canJump: true,
    isBigDino: false
};


let movePlayer = () => {
    position = player.position;
    velocity = player.velocity;

    position[1] += velocity[1];

    //---------This section is used to calculate the collision before the player is moved------------
    //Just to prevent the player from bouncing on the edge
    let size = [
        parseInt(getComputedStyle(player.reference).width),
        parseInt(getComputedStyle(player.reference).height)
    ];

    let centerPos = [
        position[0] + size[0] / 2,
        position[1] + size[1] / 2
    ];

    let collision = checkLimitProj(gameDiv, centerPos, size);
    //------------------------------------------------------------------------------------------------

    if(collision.includes("left")){
        position[0] = 0;
        player.reference.style.left = position[0] + "px";

    } else if(collision.includes("right")){
        position[0] = gameSize[0] - size[0];
        player.reference.style.left = position[0] + "px";
    }

    if(collision.includes("top")){
        position[1] = 0;
        player.reference.style.top = position[1] + "px";
        player.velocity[1] = 0;

    } else if(collision.includes("bottom")){
        position[1] = gameSize[1] - size[1];
        player.reference.style.top = position[1] + "px";
        player.velocity[1] = 0;
        player.canJump = true;
        playerAnimation(false);
    }

    player.reference.style.left = position[0] + "px";
    player.reference.style.top = position[1] + "px";
}

let jump = () => {
    player.velocity[1] -= player.jumpSpeed;
    player.canJump = false;

    playerAnimation(true);

    if(player.position[1] < 200){
        player.velocity = [0, 0];
    }
}

let playerAnimation = (stop) => {
    if(stop){
        player.reference.classList.add("stopAnimation");
        player.reference.src = "./img/dinosaur_jumping.png";
    } else {
        player.reference.classList.remove("stopAnimation");
        player.reference.src = "./img/dinosaur_idle.png";
    }
}

var keyState = [];
let controls = () => {

    if(keyState[87] && player.canJump){
        jump();
    }

    if(keyState[65]){
        player.position[0] -= player.HSpeed;
    }

    if(keyState[68]){
        player.position[0] += player.HSpeed;
    }
}

let keydownControls = (e) => {
    keyState[e.keyCode] = true;
}

let keyupControls = (e) => {
    keyState[e.keyCode] = false;
}

//----------Initialization------------------

window.addEventListener("keydown", keydownControls);
window.addEventListener("keyup", keyupControls);


document.getElementById("game-start").addEventListener("click", start);