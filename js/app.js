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
      this.element.style.transform = `scale(${-this.growth},${this.growth})`
    }
    if (this.move.ri && this.x + this.speed <= this.xmax) {
      this.x += this.speed;
      this.element.style.left = `${this.x}px`;
      this.element.style.transform = `scale(${this.growth},${this.growth})`
    }
  }
  postion(){
    this.element.style.left = `${this.x}px`
    this.element.style.top = `${this.y}px`
  }
  trackdown(target) {
    if (this.x < target.x) {
      this.move.ri = true;
      this.move.lf = false;
    }else{
      this.move.ri = false;
      this.move.lf = true;
    }
    if (this.y > target.y) {
        this.move.up = true;
        this.move.dn = false;
    }else{
        this.move.up = false;
        this.move.dn = true;
    }
  }
}

class foodClass extends interObj{
    constructor(x, y, element){
        super(x, y, element.clientWidth, element.clientHeight, element)
        this.speed = 3;
        this.growth =1
    }
}

class petClass extends interObj {
  constructor(x,y,width,height,element) {
    super(x,y,width,height,element);
    this.owid=width
    this.ohei=height
    this.belly = 10;
    this.energy = 10;
    this.fun = 10;
    this.age = 0;
    this.appetite = 0.02;
    this.stamina = 0.01;
    this.attention = 0.015;
    this.speed = 5;
    this.age = 0;
    this.growth = 1;
    this.conditions = ['happy','hungry','sleepy','bored','sleeping','eating','singing']
    this.currentState = 'happy'
    this.spriteFrame = 0
    this.spriteFrameRate = 1
    this.spriteAnimationLength = {
      walking: 9,
      sleeping: 4,
      eating: 12,
      singing: 30,
    }
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
    let imgURL = ['assets/sprites/walking/','assets/sprites/sleeping/','assets/sprites/eating/','assets/sprites/sing/']
    if(this.currentState === pet.conditions[4]){
      return `${imgURL[1]}${this.spriteFrame}.png`
    } else if(this.currentState === pet.conditions[5]){
      return `${imgURL[2]}${this.spriteFrame}.png`
    } else if(this.currentState === pet.conditions[6] && pet.collision(stage)){
      return `${imgURL[3]}${this.spriteFrame}.png`
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

  stop(){
    this.speed = 0
    this.move.up = false
    this.move.ri = false
    this.move.dn = false
    this.move.lf = false
  }

  aging(){
    if(this.growth<3){
      this.growth = 1+this.age/100
      const xdif = this.owid*(this.growth-1)
      const ydif = this.ohei*(this.growth-1)
      this.element.style.transform = `scale(${this.growth},${this.growth})`
      this.width=Math.ceil(this.owid+xdif)
      this.height=Math.ceil(this.ohei+ydif)
      this.postion()
    }
  }

  petAi() {
    if(this.currentState === this.conditions[0]){
        this.stateHappy()
    }
    if(this.currentState === this.conditions[1]){
        this.stateHungry()
    }
    if(this.currentState === this.conditions[2]){
        this.stateSleepy()
    }
    if(this.currentState === this.conditions[3]){
        this.stateBored()
    }
    if(this.currentState === this.conditions[4]){
        this.stateSleeping()
    }
    if(this.currentState === this.conditions[5]){
      this.stateEating()
    }
    if(this.currentState === this.conditions[6]){
      this.stateSinging()
    }

  }

  stateHappy(){
    this.speed = 5
    if (this.x >= this.xmax - 4) {
        this.move.ri = false;
        this.move.lf = true;
      }
    if (this.x <= this.xmin + 4) {
        this.move.ri = true;
        this.move.lf = false;
    }
    this.spriteFrameMax = this.spriteAnimationLength.walking
    this.spriteFrameRate = 2
  }

  stateHungry(){
    this.speed = 10
    this.trackdown(food)
    if(this.collision(food)){
        this.spriteFrame = 0
        this.stateEating()
        this.currentState = this.conditions[5]
    }
    this.spriteFrameMax = this.spriteAnimationLength.walking
    this.spriteFrameRate = 1
  }

  stateSleepy(){
    this.speed = 1
    if (this.x >= this.xmax) {
        this.move.ri = false;
        this.move.lf = true;
      }
    if (this.x <= this.xmin) {
        this.move.ri = true;
        this.move.lf = false;
    }
    this.spriteFrameMax = this.spriteAnimationLength.walking
    this.spriteFrameRate = 3
  }

  stateBored(){
    this.speed = 3
    if (this.x >= this.xmax - 4) {
        this.move.ri = false;
        this.move.lf = true;
      }
    if (this.x <= this.xmin + 4) {
        this.move.ri = true;
        this.move.lf = false;
    }
    this.spriteFrameMax = this.spriteAnimationLength.walking
    this.spriteFrameRate = 2
  }

  stateSleeping() {
    this.stop()
    this.spriteFrameMax = this.spriteAnimationLength.sleeping
    this.spriteFrameRate = 3
  }

  stateEating() {
    this.stop()
    this.spriteFrameMax = this.spriteAnimationLength.eating
    this.spriteFrameRate = 1
  }

  stateSinging() {
    this.speed = 10
    this.spriteFrameRate = 1
      if(!this.collision(stage)){
        this.trackdown(stage)
      } else {
        this.stop()
        this.spriteFrameMax = this.spriteAnimationLength.singing
        this.spriteFrameRate = 2
      }
  
  }

  petUpdate() {
    this.belly -= this.appetite;
    this.energy -= this.stamina;
    this.fun -= this.attention;
    this.age += 1 / 20;
    this.aging()
    if (this.belly <= 0 || this.energy <= 0 || this.fun <= 0) {
      this.alive = false;
    }
    this.conditionCheck()
    if(!(frame%this.spriteFrameRate)){
      this.drawSprite()
    }
    this.moveFunction();
    this.petAi();
  }
  
  conditionCheck() {
    if (this.currentState === this.conditions[4]){
      if(this.energy<10){
        this.belly += this.appetite;
        this.energy += 0.2+this.stamina;
        this.fun += this.attention;
        if (this.energy > 10) {
          this.energy = 10
          this.move.ri = true
          this.currentState = ''
          this.conditionCheck()
        }
        return
      } 
    } 
  
  
    if (this.currentState === this.conditions[5]){
      if(this.spriteFrame < 5){
        food.trackdown(pet)
        food.moveFunction()
        food.element.style.transform = `scale(1)`
      }
      
      if(this.spriteFrame === 5){
        $('#food').addClass('hidden')
      }
      
      
      if(this.spriteFrame === this.spriteAnimationLength.eating){
        this.move.ri = true
        this.currentState = ''
        this.belly=10
        this.spriteFrame = 0
        this.conditionCheck()
      }else{
        this.belly += this.appetite;
        this.energy += this.stamina;
        this.fun += this.attention;
        
        return
      }
    } 
  
    if (this.currentState === this.conditions[6]){    
      if(this.spriteFrame === this.spriteAnimationLength.singing){
        this.move.ri = true
        this.currentState = ''
        this.fun=10
        this.spriteFrame = 0
        this.conditionCheck()
      }else{
        this.belly += this.appetite;
        this.energy += this.stamina;
        this.fun += this.attention;
        
        return
      }
    } 
  
  
  
      if (this.belly>=5 && this.energy>=5 && this.fun>=5) {
          this.currentState=this.conditions[0]
      } else
      if (this.belly < 5 && this.belly<=this.energy && this.belly<=this.fun) {
          this.currentState=this.conditions[1]
      } else
      if (this.energy < 5 && this.energy<=this.fun && this.energy<=this.belly) {
          this.currentState=this.conditions[2]
      } else
      if (this.fun < 5 && this.fun<=this.energy && this.fun<=this.belly) {
          this.currentState=this.conditions[3]
      }
    
  }
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
    food.postion()
  }
}

function sleep() {
  if (pet.energy < 10 && pet.currentState !== pet.conditions[4] && pet.currentState !== pet.conditions[5] && pet.currentState !== pet.conditions[6]) {
    pet.spriteFrame = 0
    pet.currentState = pet.conditions[4];
  }
}

function play() {
  if (pet.fun <= 5 && pet.currentState !== pet.conditions[4] && pet.currentState !== pet.conditions[5] && pet.currentState !== pet.conditions[6]) {
    pet.spriteFrame = 0
    pet.currentState = pet.conditions[6];
  }
}

//ANCHOR update each frame
function update() {
  if(!playwin.pause){  
  uiUpdate();
  pet.petUpdate();
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
  $('#food').addClass('hidden')
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
  if(pet.width === 0 || pet.height === 0){
    pet.width = $("#pet")[0].clientWidth
    pet.height = $("#pet")[0].clientHeight
    pet.xmax = playwin.width - pet.width;
    pet.ymax = playwin.height - pet.height;
    food.width = $("#food")[0].clientWidth
    food.height = $("#food")[0].clientHeight
    food.xmax = playwin.width - food.width;
    food.ymax = playwin.height - food.height;
  }
}

function pause() {
  if(pet.alive){
    playwin.pause = !playwin.pause
    if(playwin.pause){
      $("#music")[0].pause()
    }else{
      $("#music")[0].play()
    }
    if( playwin.pause){
      $('img.icon.pause').attr('src','assets/icons/play_arrow-24px.svg')
    }else{
      $('img.icon.pause').attr('src','assets/icons/pause-24px.svg')
    }
  }
}

function mute(){
  playwin.mute = !playwin.mute
  $('audio')[0].muted = playwin.mute
  if( playwin.mute){
    $('img.icon.mute').attr('src','assets/icons/volume_off-24px.svg')
  }else{
    $('img.icon.mute').attr('src','assets/icons/volume_up-24px.svg')
  }
}

function assignEvents() {
  $("#feedBtn").on("click", feed);
  $("#sleepBtn").on("click", sleep);
  $("#funBtn").on("click", play);
  $('#pauseBtn').on("click",pause)
  $('#muteBtn').on("click",mute)
  $('.notification').on('click',function () {
    if (!pet.alive) {
      game()
    }
  })
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
pet.postion()

const food =  new foodClass(0,0,$('#food')[0]);
food.x = -food.width
food.y = food.ymax + food.height

const stage = new interObj(playwin.width/2,playwin.height/2,10,10,'')

let frame = 0

const bellyEl = $("#belly");
const energyEl = $("#energy");
const funEl = $("#fun");
const ageEl = $("#age-display");
const mesEl = $("#message");
const ctx = playwin.element.getContext

assignEvents()
mute()