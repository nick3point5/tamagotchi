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
        this.belly = 10
        this.energy = 10
        this.fun = 10
        this.age = 0
        this.appetite = 0.005
        this.stamina = 0.001
        this.attention = 0.005

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
        pet.energy=10
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
    petUpdate()
}

function uiUpdate() {
    bellyEl.text(`Belly: ${Math.ceil(pet.belly)}`)
    energyEl.text(`Energy: ${Math.ceil(pet.energy)}`)
    funEl.text(`Entertainment: ${Math.ceil(pet.fun)}`)
    ageEl.text(`age: ${Math.floor(pet.age)}`)
}

function petUpdate(){
    pet.belly -= pet.appetite
    pet.energy -= pet.stamina
    pet.fun -= pet.attention

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
