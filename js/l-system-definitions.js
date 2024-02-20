var axiom = [];
axiom[0] = "F" //Brush Axiom
axiom[1] = "X" //Branch Axiom
axiom[2] = "VZFFF" //Fern Axiom
axiom[3] = "Y" //Stochastic Axiom
axiom[4] = "F" //Weed Axiom

var rules = [];

function axiomL(x) {
    return axiom[x]
}

function rulesL(x){
    if (x == 0){ //Brush Rules
        rules[0] = {
            a: "F",
            b: "FF+[+F-F-F]-[-F+F+F]"
        }
    } else if (x == 1){ //Branch Rules
        rules[0] = {
            a: "F",
            b: "FF"
        }
        rules[1] = { //Fern Rules
            a: "X",
            b: "F-[[X]+X]+F[+FX]-X"
        }
    } else if (x == 2){ 
        rules[0] = {
            a: "V",
            b: "[+++W][---W]YV"
        }
        rules[1] = {
            a: "W",
            b: "+X[-W]Z"
        }
        rules[2] = {
            a: "X",
            b: "-W[+X]Z"
        }
        rules[3] = {
            a: "Y",
            b: "YZ"
        }
        rules[4] = {
            a: "Z",
            b: "[-FFF][+FFF]F"
        }
    } else if (x == 3){ //Stochastic Rules
        rules[0] = {
            a: "X",
            b: "[-FFF][+FFF]FX"
        }
        rules[1] = {
            a: "Y",
            b: "YFX[+Y][-Y]"
        }
    } else if (x == 4){ //Weed Rules
        rules[0] = {
            a: "F",
            b: "FF-[XY]+[XY]"
        }
        rules[1] = {
            a: "X",
            b: "+FY"
        }
        rules[2] = {
            a: "Y",
            b: "-FX"
        }
    }
    return rules;
}