var chicken;
var sky = [];
var score;
var mysound;
var music;

function startGame() {
    myGameArea.start();
    chicken = new component(20, 30, "yellow", 125, 365);
    score = new component("20px", "Consolas", "black", 125, 26, "text");
    mysound = new sound("./dunk.mp3");
    music = new sound("background.mp3");
    music.play();
}

var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 270;
        this.canvas.height = 400;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        this.frameNo = 0;
        window.addEventListener('keydown', function (e) {
            myGameArea.key = e.keyCode;
        })
        window.addEventListener('keyup', function (e) {
            myGameArea.key = false;
        })
    }, 
    clear : function(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function(){
        clearInterval(this.interval);
    }
}

function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

function component(width, height, color, x, y, type) {
    this.type = type;
    this.gamearea = myGameArea;
    this.width = width;
    this.height = height;
    this.speedX = 0;    

    this.x = x;
    this.y = y;
    this.update = function(){    
        ctx = myGameArea.context;
        if (this.type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = color;
            ctx.fillText(this.text, this.x, this.y);
        }else{
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);
            }
        }
    this.newPos = function() {
        this.x += this.speedX;

    } 
    this.crashWith = function(otherobj) {
        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherobj.x;
        var otherright = otherobj.x + (otherobj.width);
        var othertop = otherobj.y;
        var otherbottom = otherobj.y + (otherobj.height);
        var crash = true;
        if ((mybottom < othertop) || (mytop > otherbottom) || (myright < otherleft) || (myleft > otherright)) {
            crash = false;
        }
        return crash;
    }  
}

function updateGameArea() {
    var gap, minGap, maxGap, width, y, minWidth, maxWidth;
 
    for (i = 0; i < sky.length; i += 1) {
        if (chicken.crashWith(sky[i])) {
            music.stop();
            mysound.play();
            myGameArea.stop();
            return;
        } 
    }   
    myGameArea.clear();
    myGameArea.frameNo += 1;
    chicken.speedX = 0;
       
    if (myGameArea.key && myGameArea.key == 37) {chicken.speedX = -1; }
    if (myGameArea.key && myGameArea.key == 39) {chicken.speedX = 1; }

    if (myGameArea.frameNo == 1 || everyinterval(35)) {
    y = 0;
    minWidth = 20;
    maxWidth = 60;
    width = Math.floor(Math.random()*(maxWidth-minWidth+1)+minWidth);
    minGap = 0;
    maxGap = 240;
    gap = Math.floor(Math.random()*(maxGap-minGap+1)+minGap);
    
    sky.push(new component(width, 10, "blue", gap, y));
    
    }
        for (i = 0; i < sky.length; i += 1) {
        sky[i].y += 1;
        sky[i].newPos();
        sky[i].update();
    }
   
    score.text="SCORE: " + myGameArea.frameNo;
    score.update();
    chicken.newPos();
    chicken.update();
}

function everyinterval(n) {
    if ((myGameArea.frameNo / n) % 1 == 0) {return true;}
    return false;
}
