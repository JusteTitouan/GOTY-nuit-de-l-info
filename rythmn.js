const canvas = document.getElementById("rythm");
const ctx = canvas.getContext("2d");
const sprite = document.getElementsByClassName("unusual");
const aud = document.getElementsByClassName("music");
const dam = document.getElementsByClassName("damage");
const ef = document.getElementsByClassName("effect");

for(const a of aud) {
    a.volume = 0.3;
}
for(const e of ef) 
    e.volume = 1;

var audio_i;
var lives;
var elmts;
var dir;
var x;
var flash;
var i;
var score;
var cooldown;
var cooldownr;
var speed;
var scoreMax;
var id;
var hit;
var pressed;
var begin;
const colors = ["#eb7d34", "#52eb34", "#eb4c34", "#3486eb", "#eb34cf"];

function drawPist(i, color) {
    ctx.beginPath();
    ctx.rect((canvas.width/5)*i, 0, canvas.width/5, canvas.height);
    ctx.fillStyle = color + (flash ? "dd":"cc");
    ctx.fill();
    ctx.closePath();
}

function init() {
    audio_i = Math.floor(Math.random()*1.99);
    lives = 4;
    elmts = [];
    dir = 0;
    x = 2;
    flash = false;
    i = 0;
    score = 0;
    cooldown = 30;
    cooldownr = 30;
    scoreMax = 20;
    speed = 75;
    hit = 0;
    pressed = false;
    begin = false;
}

function drawupdateSpeed() {
    clearInterval(id);
    id = setInterval(draw, speed);
}

init();

function draw() {
    hit--;
    if(i >= 11) {
        if(lives > 0 && begin) {
            let rand = Math.floor(Math.random()*10.99);
            if(rand > 2 && cooldown < 0) {
                cooldown = cooldownr;
                if(rand < 9) {
                    let f = false;
                    for(const e of elmts) {
                        if(e.type == 0) {
                            f = true;
                            e.type = 1;
                            e.y = 0;
                            e.h = 125;
                            e.x = Math.floor(Math.random()*4.99);
                            break;
                        }
                    }
                    if(!f) {
                        elmts.push({});
                        elmts[elmts.length-1].type = 1;
                        elmts[elmts.length-1].y = 0;
                        elmts[elmts.length-1].h = 125;
                        elmts[elmts.length-1].x = Math.floor(Math.random()*4.99);
                    }
                } else {
                    let f = false;
                    for(const e of elmts) {
                        if(e.type == 0) {
                            f = true;
                            e.type = 2;
                            e.y = 0;
                            e.h = 125;
                            e.x = Math.floor(Math.random()*4.99);
                            break;
                        }
                    }
                    if(!f) {
                        elmts.push({});
                        elmts[elmts.length-1].type = 2;
                        elmts[elmts.length-1].y = 0;
                        elmts[elmts.length-1].h = 125;
                        elmts[elmts.length-1].x = Math.floor(Math.random()*4.99);
                    }
                }
            }
            flash = !flash;
            score++;
        }
        i = 0;
    }
    if(lives > 0 && begin) {
        if(score > scoreMax) {
            scoreMax *= 2;
            cooldownr -= 3;
            if(speed - 5 > 0)
                speed -= 5;
            ef[0].play();
            drawupdateSpeed();
        }
        cooldown--;
        for(const e of elmts) {
            e.y += 10;
            if(e.y - e.h >= canvas.height && e.type != 0) {
                e.type = 0;
                e.y = -100;
                if(hit < 0) {
                    hit = 10;
                    lives--;
                    dam[Math.floor(Math.random()*2.99)].play();
                }
                e.x = -1;
            }
        }
        
    }
    ctx.clearRect(0,0, canvas.width, canvas.height);
    drawPist(0, colors[0]);
    drawPist(1, colors[1]);
    drawPist(2, colors[2]);
    drawPist(3, colors[3]);
    drawPist(4, colors[4]);
    drawElmt();
    if(hit >= 0) 
        ctx.drawImage(sprite[i+11], (canvas.width/5)*x-47, canvas.height-150, canvas.width/5+90, 150);
    else
        ctx.drawImage(sprite[i], (canvas.width/5)*x-47, canvas.height-150, canvas.width/5+90, 150);
    ctx.fillStyle = "#000000";
    ctx.font = "30px Arial";
    ctx.fillText("score: " + score, 10, 30);
    ctx.fillText("lives: " + lives, 10, 60);
    if(!begin) {
        ctx.fillStyle = "#00000088";
        ctx.fillRect(0, canvas.height/2-canvas.height/4, canvas.width, canvas.height/2);
        ctx.font= "64px Arial";
        ctx.fillStyle = "#FFFFFFFF";
        ctx.fillText("To play:", canvas.width/2-100, canvas.height/2-120);
        ctx.fillText("-Move with the right and", 0, canvas.height/2-20);
        ctx.fillText("left arrows", 0, canvas.height/2+40);
        ctx.fillText("-Press space to eliminate", 0, canvas.height/2+110);
        ctx.fillText("the circles", 0, canvas.height/2+170)
    } else if(lives <= 0) {
        ctx.fillStyle = "#00000088";
        ctx.fillRect(0, canvas.height/2-canvas.height/4, canvas.width, canvas.height/2);
        ctx.font= "64px Arial";
        ctx.fillStyle = "#FFFFFFFF";
        ctx.fillText("Score: " + score, canvas.width/2-120, canvas.height/2);
        ctx.fillText("You losed the rythm!", canvas.width/2-300, canvas.height/2-65);
        ctx.font = "48px Arial";
        ctx.fillText("press enter to restart...", canvas.width/2-230, canvas.height/2+100);
    } 
    i++;
}
id = setInterval(draw, speed);

document.addEventListener("keyup", (e) => {
    if(e.key == "Enter") {
        if(lives <= 0) {
            clearInterval(id);
            init();
            location.reload();
            return;
        } 
        begin = true;
    }
    if(e.code == "Space")
        pressed = false;
});

document.addEventListener("keydown", (e) => {
    if(e.code == "Space" && e.key == " " && lives > 0 && !pressed) {
        pressed = true;
        let a = false;
        for(const el of elmts) {
            if(el.y >= canvas.height-175 && el.y - el.h < canvas.height && x == el.x) {
                a = true;
                score += 10;
                el.y = -100;
                el.type = 0;
                return;
            }
        }
        if(!a && hit < 0) {
            lives--;
            hit = 10;
            dam[Math.floor(Math.random()*2.99)].play();
        }
    }
});

document.addEventListener("keyup", (e) => {
    if((e.key == "Right" || e.key == "ArrowRight") && x < 4)
        x += 1;
    else if (e.key == "Left" || e.key == "ArrowLeft" && x >= 1)
        x -= 1;
});

function drawElmt() {
    for(const e of elmts) {
        if(e.type != 0) {
            ctx.beginPath();
            ctx.fillStyle = "#000000";
            ctx.arc((canvas.width/5)*e.x+70, e.y - e.h, canvas.width/10-5, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
            ctx.beginPath();
            ctx.fillStyle = colors[e.x] + "cc";
            ctx.arc((canvas.width/5)*e.x+70, e.y - e.h, canvas.width/10-5, 0, Math.PI*2);
            ctx.fill();
            ctx.closePath();
        }
    }
}

aud[audio_i].play();
function audEnd(audios) {
    audios[audio_i].onended = () => {
        audio_i++;
        audio_i %= audios.length;
        audios[audio_i].play();
        audEnd(aud);
    };
}
audEnd(aud);