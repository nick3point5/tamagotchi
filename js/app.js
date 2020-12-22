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
}

class petClass extends interObj {
  constructor() {
    super(
      0,
      342,
      $("#pet")[0].clientWidth,
      $("#pet")[0].clientHeight,
      $("#pet")[0]
    );
    this.belly = 10;
    this.energy = 10;
    this.fun = 10;
    this.age = 0;
    this.appetite = 0.05;
    this.stamina = 0.001;
    this.attention = 0.005;
    this.speed = 5;
    this.conditions = ['Happy','hungry','sleepy','bored']
    this.currentState = 'Happy'


    this.move = {
      up: false,
      ri: true,
      dn: false,
      lf: false,
    };

    this.awake = true;
    this.alive = false;
  }
}

function move(obj) {
  if (obj.move.up && obj.y - obj.speed >= obj.ymin) {
    obj.y -= obj.speed;
    obj.element.style.top = `${obj.y}px`;
  }
  if (obj.move.dn && obj.y + obj.speed <= obj.ymax) {
    obj.y += obj.speed;
    obj.element.style.top = `${obj.y}px`;
  }
  if (obj.move.lf && obj.x - obj.speed >= obj.xmin) {
    obj.x -= obj.speed;
    obj.element.style.left = `${obj.x}px`;
  }
  if (obj.move.ri && obj.x + obj.speed <= obj.xmax) {
    obj.x += obj.speed;
    obj.element.style.left = `${obj.x}px`;
  }
}

function petAi() {
    if(pet.currentState === 'Happy'){
        statefine()
    }
    if(pet.currentState === 'hungry'){
        statefine()
    }
    if(pet.currentState === 'sleepy'){
        statefine()
    }
    if(pet.currentState === 'bored'){
        statefine()
    }

}

function statefine(){
    pet.speed = 5
    if (pet.x >= pet.xmax - 4) {
        pet.move.ri = false;
        pet.move.lf = true;
      }
    if (pet.x <= pet.xmin + 4) {
        pet.move.ri = true;
        pet.move.lf = false;
    }
}
function stateHungry(){

}
function stateSleep(){

}
function stateBored(){

}


function feed() {
  if (pet.belly < 10) {
    pet.belly++;
  }
}

function sleep() {
  if (pet.energy < 10) {
    pet.energy = 10;
  }
}

function play() {
  if (pet.fun < 10) {
    pet.fun++;
  }
}

function assignEvents() {
  $("#feedBtn").on("click", feed);
  $("#sleepBtn").on("click", sleep);
  $("#playBtn").on("click", play);
  if (!pet.alive) {
      $('.notification').on('click',game)
  }
}

function update() {
  uiUpdate();
  petUpdate();
  move(pet);
  petAi();
}

function uiUpdate() {
  bellyEl.text(`Belly: ${Math.ceil(pet.belly)}`);
  energyEl.text(`Energy: ${Math.ceil(pet.energy)}`);
  funEl.text(`Entertainment: ${Math.ceil(pet.fun)}`);
  ageEl.text(`age: ${Math.floor(pet.age)} sec`);
  mesEl.text(`${$("#name")[0].value} is ${pet.currentState}`)
}

function petUpdate() {
  pet.belly -= pet.appetite;
  pet.energy -= pet.stamina;
  pet.fun -= pet.attention;
  pet.age += 1 / 20;
  if (pet.belly <= 0 || pet.energy <= 0 || pet.fun <= 0) {
    pet.alive = false;
  }
}

function gameover() {
    mesEl.text(`${$("#name")[0].value} has died`)
  $("#music")[0].pause();
  $("#music")[0].currentTime = 0;
}

function Init() {
  pet.alive = true;
  pet.belly = 10;
  pet.energy = 10;
  pet.fun = 10;
  pet.age = 0;
  pet.x = 0;
  pet.y = pet.ymax;
  $("#music")[0].muted = false
  $("#music")[0].play();
}

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

playwin = {
  height: 600,
  width: 800,
};

const pet = new petClass();
pet.element.style.top = `${pet.y}px`;
pet.element.style.left = `${pet.y}px`;

const bellyEl = $("#belly");
const energyEl = $("#energy");
const funEl = $("#fun");
const ageEl = $("#age");
const mesEl = $("#message")

assignEvents();