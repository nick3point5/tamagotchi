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
        this.xmax = win.width-width
        this.ymin = 0
        this.ymax = win.height-height
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
    }
}

