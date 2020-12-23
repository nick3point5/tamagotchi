//ANCHOR define classes

class interObj {
  constructor(x, y, width, height, element) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.xmin = 0;
    this.xmax = playwin.width - width;
    this.ymin = 0;
    this.ymax = playwin.height - height;
    this.speed = 0;
    this.move = {
      up: false,
      ri: false,
      dn: false,
      lf: false,
    };
    this.element = element;
  }
  collision(hurtbox){
    if (
        this.x + this.width > hurtbox.x &&
        this.x < hurtbox.x + hurtbox.width &&
        this.y + this.height > hurtbox.y &&
        this.y < hurtbox.y + hurtbox.width
    ) {
        return true
    }
    return false
  };
  moveFunction() {
    if (this.move.up && this.y - this.speed >= this.ymin) {
      this.y -= this.speed;
      this.element.style.top = `${this.y}px`;
    }
    if (this.move.dn && this.y + this.speed <= this.ymax) {
      this.y += this.speed;
      this.element.style.top = `${this.y}px`;
    }
    if (this.move.lf && this.x - this.speed >= this.xmin) {
      this.x -= this.speed;
      this.element.style.left = `${this.x}px`;
      this.element.style.transform = 'scaleX(-1)'
    }
    if (this.move.ri && this.x + this.speed <= this.xmax) {
      this.x += this.speed;
      this.element.style.left = `${this.x}px`;
      this.element.style.transform = 'scaleX(1)'
    }
  }
}

class foodClass extends interObj{
    constructor(x, y, element){
        super(x, y, element.clientWidth, element.clientHeight, element)
    }
}

class petClass extends interObj {
  constructor(x,y,width,height,element) {
    super(x,y,width,height,element);
    this.belly = 10;
    this.energy = 10;
    this.fun = 10;
    this.age = 0;
    this.appetite = 0.05;
    this.stamina = 0.01;
    this.attention = 0.01;
    this.speed = 5;
    this.conditions = ['happy','hungry','sleepy','bored','sleeping','eating']
    this.currentState = 'happy'
    this.spriteFrame = 0
    this.spriteFrameRate = 1
    this.spriteFrameMax = 9

    this.move = {
      up: false,
      ri: true,
      dn: false,
      lf: false,
    };

    this.alive = false;
  }
  spriteFile(){
    let imgURL = ['assets/sprites/walking/','assets/sprites/sleeping/','assets/sprites/eating/']
    if(this.currentState === pet.conditions[4]){
      return `${imgURL[1]}${this.spriteFrame}.png`
    } else if(this.currentState === pet.conditions[5]){
      return `${imgURL[2]}${this.spriteFrame}.png`
    } else {
      return `${imgURL[0]}${this.spriteFrame}.png`
    }
  }
  drawSprite() {
    if (this.spriteFrame > this.spriteFrameMax){
      this.spriteFrame = 0
    }
    this.element.setAttribute('src', this.spriteFile())
  
    this.spriteFrame++
  }
}

//ANCHOR pet behaviors
function petAi() {
    if(pet.currentState === pet.conditions[0]){
        stateHappy()
    }
    if(pet.currentState === pet.conditions[1]){
        stateHungry()
    }
    if(pet.currentState === pet.conditions[2]){
        stateSleepy()
    }
    if(pet.currentState === pet.conditions[3]){
        stateBored()
    }
    if(pet.currentState === pet.conditions[4]){
        stateSleeping()
    }
    if(pet.currentState === pet.conditions[5]){
      stateEating()
    }

}

function stateHappy(){
    pet.speed = 5
    if (pet.x >= pet.xmax - 4) {
        pet.move.ri = false;
        pet.move.lf = true;
      }
    if (pet.x <= pet.xmin + 4) {
        pet.move.ri = true;
        pet.move.lf = false;
    }
    pet.spriteFrameMax = 9
    pet.spriteFrameRate = 2
}
function stateHungry(){
    pet.speed = 10
    // const food = $('#food')[0]
    if (pet.x < food.x) {
        pet.move.ri = true;
        pet.move.lf = false;
      }else{
        pet.move.ri = false;
        pet.move.lf = true;
      }
    if (pet.y > food.y) {
        pet.move.up = true;
        pet.move.dn = false;
    }else{
        pet.move.up = false;
        pet.move.dn = true;
    }
    
    if(pet.collision(food)){
        pet.spriteFrame = 0
        stateEating()
        pet.currentState = pet.conditions[5]
        
        food.x = -food.width
        food.y = food.ymax + food.height
    }
    pet.spriteFrameMax = 9
    pet.spriteFrameRate = 1
}
function stateSleepy(){
    pet.speed = 1
    if (pet.x >= pet.xmax) {
        pet.move.ri = false;
        pet.move.lf = true;
      }
    if (pet.x <= pet.xmin) {
        pet.move.ri = true;
        pet.move.lf = false;
    }
    pet.spriteFrameMax = 9
    pet.spriteFrameRate = 3
}
function stateBored(){

}

function stateSleeping() {
    pet.speed = 0
    pet.move.up = false
    pet.move.ri = false
    pet.move.dn = false
    pet.move.lf = false
    pet.spriteFrameMax = 4
    pet.spriteFrameRate = 3
}

function stateEating() {
  pet.speed = 0
  pet.move.up = false
  pet.move.ri = false
  pet.move.dn = false
  pet.move.lf = false
  pet.spriteFrameMax = 12
  pet.spriteFrameRate = 1 
  pet.belly=10
}


//ANCHOR UI buttons
function feed() {
    createFood();
}

function createFood() {
  if (pet.alive) {
    $('#food').removeClass('hidden')
    food.x = getRand(food.xmax,food.xmin)
    food.y = getRand(food.ymax,food.ymin)
    food.element.style.left = `${food.x}px`;
    food.element.style.top = `${food.y}px`;
  }
}

function sleep() {
  if (pet.energy < 10) {
    pet.spriteFrame = 0
    pet.currentState = pet.conditions[4];
  }
}

function play() {
  if (pet.fun < 10) {
    if(pet.fun>9){
      pet.fun = 10
    }else{
      pet.fun++;

    }
  }
}

//ANCHOR update each frame
function update() {
  if(!playwin.pause){  
  uiUpdate();
  petUpdate();
  pet.moveFunction();
  petAi();
  frame++}
}

function uiUpdate() {
  const belly = Math.ceil(pet.belly)
  const energy = Math.ceil(pet.energy)
  const fun = Math.ceil(pet.fun)
  gaugeUi(belly,energy,fun)
  ageEl.text(`${Math.floor(pet.age)} sec old`);
  mesEl.text(`${$("#name")[0].value} is ${pet.currentState}`)
}

function gaugeUi(belly,energy,fun) {
  bellyEl.attr('src',`assets/Bars/food/pixil-frame-0 (${belly}).png`)
  energyEl.attr('src',`assets/Bars/energy/pixil-frame-0 (${energy}).png`)
  funEl.attr('src',`assets/Bars/fun/pixil-frame-0 (${fun}).png`)
}

function petUpdate() {
  pet.belly -= pet.appetite;
  pet.energy -= pet.stamina;
  pet.fun -= pet.attention;
  pet.age += 1 / 20;
  if (pet.belly <= 0 || pet.energy <= 0 || pet.fun <= 0) {
    pet.alive = false;
  }
  conditionCheck()
  if(!(frame%pet.spriteFrameRate)){
    pet.drawSprite()
  }
}

function conditionCheck() {
  if (pet.currentState === pet.conditions[4]){
    if(pet.energy<10){
      pet.belly += pet.appetite;
      pet.energy += 0.2+pet.stamina;
      pet.fun += pet.attention;
      if (pet.energy > 10) {
        pet.energy = 10
        pet.move.ri = true
        pet.currentState = ''
        conditionCheck()
      }
      return
    } 
  } 


  if (pet.currentState === pet.conditions[5]){
    if(pet.spriteFrame === 5){
      $('#food').addClass('hidden')
    }
    
    
    if(pet.spriteFrame === 11){
      pet.move.ri = true
      pet.currentState = ''
      pet.belly=10
      pet.spriteFrame = 0
      conditionCheck()
    }else{
      pet.belly += pet.appetite;
      pet.energy += pet.stamina;
      pet.fun += pet.attention;
      
      return
    }
  } 

    if (pet.belly>=5 && pet.energy>=5 && pet.fun>=5) {
        pet.currentState=pet.conditions[0]
    } else
    if (pet.belly < 5 && pet.belly<=pet.energy && pet.belly<=pet.fun) {
        pet.currentState=pet.conditions[1]
    } else
    if (pet.energy < 5 && pet.energy<=pet.fun && pet.energy<=pet.belly) {
        pet.currentState=pet.conditions[2]
    } else
    if (pet.fun < 5 && pet.fun<=pet.energy && pet.fun<=pet.belly) {
        pet.currentState=pet.conditions[3]
    }
  
}

//ANCHOR function utility

function getRand(max, min) {
    let num = Math.random() * (max + 1 - min) + min - 1;
    num = Math.ceil(num);
    return num;
  }

//ANCHOR metagame functions

function game() {
  Init();

  const framerate = 20;
  const active = setInterval(() => {
    update();
    if (!pet.alive) {
      uiUpdate();
      clearInterval(active);
      gameover();
    }
  }, 1000 / framerate);

}

function gameover() {
    mesEl.text(`${$("#name")[0].value} has died`)
  $("#music")[0].pause();
  $("#music")[0].currentTime = 0;
  $("#pet").addClass('hidden')
}

function Init() {
  pet.alive = true;
  pet.belly = 10;
  pet.energy = 10;
  pet.fun = 10;
  pet.age = 0;
  pet.x = 0;
  pet.y = pet.ymax;
  $("#music")[0].play();
  $("#pet").removeClass('hidden')
}

function pause() {
  playwin.pause = !playwin.pause
  if(playwin.pause){
    $("#music")[0].pause()
  }else{
    $("#music")[0].play()
  }
}

function mute(){
  playwin.mute = !playwin.mute
  $('audio')[0].muted = playwin.mute

}

function assignEvents() {
  $("#feedBtn").on("click", feed);
  $("#sleepBtn").on("click", sleep);
  $("#playBtn").on("click", play);
  $('#pauseBtn').on("click",pause)
  $('#muteBtn').on("click",mute)
  if (!pet.alive) {
      $('.notification').on('click',game)
  }
}

//ANCHOR global var and obj

playwin = {
  height: 600,
  width: 800,
  element: $('.play-space'),
  mute: false,
  pause: false
};

const pet = new petClass(
  0,
  530,
  $("#pet")[0].clientWidth,
  $("#pet")[0].clientHeight,
  $("#pet")[0]);
pet.element.style.top = `${pet.y}px`;
pet.element.style.left = `${pet.y}px`;

const food =  new foodClass(0,0,$('#food')[0]);
food.x = -food.width
food.y = food.ymax + food.height

let frame = 0

const bellyEl = $("#belly");
const energyEl = $("#energy");
const funEl = $("#fun");
const ageEl = $("#age-display");
const mesEl = $("#message");
const ctx = playwin.element.getContext

assignEvents()