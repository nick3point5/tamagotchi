playwin ={
    height: 600,
    width: 800,
}

class interObj {
    constructor(x,y,width,height){
        this.x = x
        this.y = y
        this.width= width
        this.height= height
        this.xmin = 0
        this.xmax = playwin.width-width
        this.ymin = 0
        this.ymax = playwin.height-height
        this.move = {
            up: false,
            ri: false,
            dn: false,
            lf: false,
        }
    }
}

class petClass extends interObj {
    constructor(){
        super(0,0,$('#pet').width,$('#pet').height)
        this.belly = 1
        this.energy = 1
        this.fun = 1
        this.age = 0
        this.awake = true
        this.alive = true
    }
}



function feed() {
    if (pet.belly<10) {
        pet.belly++
    }
}

function sleep() {
    if (pet.energy<10) {
        pet.energy++
    }
}

function play() {
    if (pet.fun<10) {
        pet.fun++
    }
}

function assignEvents() {
    $('#feedBtn').on('click', feed)
    $('#sleepBtn').on('click', sleep)
    $('#playBtn').on('click', play)
}

function update(){
    uiUpdate()
    pet.age += 1/20
}

function uiUpdate() {
    bellyEl.text(`Belly: ${pet.belly}`)
    energyEl.text(`Energy: ${pet.energy}`)
    funEl.text(`Entertainment: ${pet.fun}`)
    ageEl.text(`age: ${Math.floor(pet.age)} sec`)
}

function game() {
    const framerate = 20
    const active = setInterval(() => {
        update()
        if(!pet.alive){
            clearInterval(active)
        }
    }, 1000/framerate);
    assignEvents()
}

const pet = new petClass();

const bellyEl = $('#belly')
const energyEl = $('#energy')
const funEl = $('#fun')
const ageEl = $('#age')

game()
