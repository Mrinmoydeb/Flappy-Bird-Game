let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let frames = 0;

let sourecImg= new Image(); 
sourecImg.src = "sprite.png";

//game sounds
const scoreSound = new Audio();
scoreSound.src ="audio/audio_sfx_point.wav";

const birdSwooshsound = new Audio();
birdSwooshsound.src  = "audio/audio_sfx_swooshing.wav";

const birdDieSound = new Audio();
birdDieSound.src = "audio/audio_sfx_die.wav";

const birdFlapSound = new Audio();
birdFlapSound.src = "audio/audio_sfx_flap.wav"

const birdHitsound = new Audio();
birdHitsound.src = "audio/audio_sfx_hit.wav"

//Game state
const state = { 
 current : 0,
 getReady : 0, 
 game : 1, 
over : 2 
}

//control The Game
canvas.addEventListener("click",function(event){

switch(state.current){
    case state.getReady:
        state.current = state.game;
        birdSwooshsound.play()
        break;
        case state.game: 
            bird.flap();
            birdFlapSound.play();
            break
            case state.over:
                let rect = canvas.getBoundingClientRect();
                let clickX =event.clientX - rect.left;
                let clickY = event.clientY - rect.top;

                if(clickX >= Startbtn.x && clickX <= Startbtn.x+Startbtn.w && clickY >= Startbtn.y && clickY <= Startbtn.y + Startbtn.h){
                    pipes.reset();
                    bird.speedReset();
                    score.reset();
                    state.current = state.getReady;
                } 
                break

}

});

// possition of Start Button
const Startbtn ={
    x: 120,
    y: 263,
    w:83,
    h:29,
}
 
// Load all images
//background
let bg ={
    sX:0,
    sY:0,
    w:275,
    h:226,
    x:0,
 
    y:canvas.height-226,
    drawn: function(){
        ctx.drawImage(sourecImg,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)

        ctx.drawImage(sourecImg,this.sX,this.sY,this.w,this.h,this.x + this.w,this.y,this.w,this.h) 
    },

    
 };

 //Fore Ground
 const fg = {
    sX:276,
    sY:0,
    w:224,
    h:112,
    x:0,
    y:canvas.height - 112,
    leftx: 3,
 
    draw:function(){
        ctx.drawImage(sourecImg,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h)

        ctx.drawImage(sourecImg,this.sX,this.sY,this.w,this.h,this.x + this.w,this.y,this.w,this.h)
    },
    update : function(){
       if(state.current ==  state.game){
        this.x = (this.x - this.leftx) % (this.w/4)
       }
    }

 }

 // Bird
 const degree = Math.PI/180;

 const bird ={
  
 radius:12,
    animation : [
        {sX:276, sY:112},
        {sX:276, sY:139},
        {sX:276, sY:164},
        {sX:276, sY:139}, 
    ],
    x: 50,
    y:150,
    w:34,
    h:26,
   rotation:0,
    frame :0,
    draw:function(){
        let birds = this.animation[this.frame]
        ctx.save();
        ctx.translate(this.x,this.y );
        ctx.rotate(this.rotation);
        ctx.drawImage(sourecImg,birds.sX,birds.sY,this.w,this.h, -this.w/2 , - this.h/2,this.w,this.h)
        ctx.restore()
    },

    speed :0, 
    gravity: 0.10,
    jump: 2.2,

    

  update : function(){
    //IF  the game state is get ready state, the bird must flap slowly
    let period = state.current == state.getReady ? 10 : 5;
    //Increment the frame by 1, Each period
    this.frame += frames % period == 0 ? 1 : 0;
    //frame goes from 0 to 4, then again to 0
    this.frame = this.frame % this.animation.length;

    if(state.current == state.getReady){
        this.y = 150;
        this.rotation = 0*degree
    }else{
        this.speed+=this.gravity;
        // console.log(this.speed+=this.gravity)
        this.y += this.speed;
       

        if(this.y + this.h/2 > canvas.height - fg.h){
            this.y = canvas.height - fg.h - this.h/2
            if(state.current == state.game){
                state.current = state.over;
                birdDieSound.play()
            }
        };
        if(this.speed >= this.jump){
            this.rotation = 90 * degree
            this.frame = 1
        }else{
            this.rotation = -25 * degree
        }
    }
  },

  flap : function(){ 
    this.speed = - this.jump;
       }, 

       speedReset: function(){ 
        this.speed = 0;
  },
 };
//Get ready message
 const getReady = {
    sX:0,
    sY:228,
    w:173,  
    h:152,
    x:canvas.width/2 - 172/2,
    y:80,
    draw:function(){
         if(state.current == state.getReady){
            ctx.drawImage(sourecImg,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h) 
         }
       
    }

 }

 //Game over message
 const gameOver ={
    sX:175,
    sY:228,
    w:225,
    h:202,
    x:canvas.width/2 - 225/2,
    y:90,
    draw:function(){
        if(state.current ==state.over){
            ctx.drawImage(sourecImg,this.sX,this.sY,this.w,this.h,this.x,this.y,this.w,this.h) 

        }
       
    }

 }

 // Pipe obeject start 
 const pipes = {
   
     possition:[],
 top:{
    sX:553,
    sY:0,
 },
 bottom:{
    sX:502, 
    sY:0,
 },
 w:53,
 h:400,
 gap:85,
 dx:2,
 maxYpossition:-150,
 draw:function(){

    for(let i =0 ; i<this.possition.length; i++){

        let p = this.possition[i];
        let topYpos = p.y;
        let bottomYposs = p.y +this.h +this.gap
        //top pipe
    ctx.drawImage(sourecImg,this.top.sX,this.top.sY,this.w,this.h, p.x  , topYpos  ,this.w,this.h) 
// bottom pipe
    ctx.drawImage(sourecImg,this.bottom.sX,this.bottom.sY,this.w,this.h, p.x , bottomYposs  ,this.w,this.h) 
}  
 },


 update:function(){
if(state.current !== state.game) return;
if(frames %100 == 0){
    this.possition.push({
        x: canvas.width, 
        y: this.maxYpossition *(Math.random() +1)
    });
}
for(let i =0 ; i < this.possition.length; i++){
    let p = this.possition[i];
    let bottomPipeYpossition = p.y+this.gap+this.h ;
    //collision detection
//top pipe
if(bird.x+bird.radius> p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > p.y && bird.y-bird.radius < p.y+ this.h ){
    state.current = state.over;
    birdHitsound.play();
}

//bottom pipe
if(bird.x+bird.radius> p.x && bird.x - bird.radius < p.x + this.w && bird.y + bird.radius > bottomPipeYpossition && bird.y-bird.radius < bottomPipeYpossition+ this.h ){
    state.current = state.over;
    birdHitsound.play();
}

    //

    p.x -= this.dx;
    if(p.x + this.w <= 0){
        this.possition.shift();
        score.value += 1;
        scoreSound.play();
        score.best = Math.max(score.value, score.best)
        localStorage.setItem("best", score.best);

    }
}
 },
 reset : function(){
    this.possition =[];
},
 };
 // end...
 const score ={
   
    best: parseInt(localStorage.getItem("best"))|| 0,
    value: 0,
    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokestyle = "#000";
        if(state.current ==state.game){
            ctx.lineWidth = 2;
            ctx.font ="30px Teko";
            ctx.fillText(this.value, canvas.width/2 , 50);
            // ctx.strokeText(this.value, canvas.width/2 , 50);

            
        }else if(state.current == state.over){
            ctx.font ="25px Teko";
            ctx.fillText(this.value, 225 , 186);
            // ctx.strokeText(this.value, 225, 186);
            //Best score
            ctx.fillText(this.best, 225 , 228);
            // ctx.strokeText(this.best, 225, 228);



        }
    },
    reset : function(){
        this.value = 0;
    },
 };


//draw function
function draw(){
ctx.fillStyle = "#70c5ce"
ctx.fillRect(0,0,canvas.width,canvas.height)
bg.drawn();
pipes.draw()
fg.draw();
bird.draw();
getReady.draw();
gameOver.draw();
score.draw();

}


//update function
function update(){
bird.update();  
fg.update();
pipes.update()
}

function loop(){
    update();
draw();
frames++

requestAnimationFrame(loop)
}
loop()
