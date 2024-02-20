
/*                                                                              
                            ,--.                             ,--.                
,--.   ,--. ,---.  ,---.  ,-|  |     ,---.  ,--,--.,--.--. ,-|  | ,---. ,--,--,  
|  |.'.|  || .-. :| .-. :' .-. |    | .-. |' ,-.  ||  .--'' .-. || .-. :|      \ 
|   .'.   |\   --.\   --.\ `-' |    ' '-' '\ '-'  ||  |   \ `-' |\   --.|  ||  | 
'--'   '--' `----' `----' `---'     .`-  /  `--`--'`--'    `---'  `----'`--''--' 
                                    `---'                                        
An interactive plant growing environment based on L-System patterns.

By Slide Kelly
GSD 6483: Procedural Fields
Instructed by Jose Luis Garcia del Castillo Lopez

The ideal goal was to be able to click and plant new weeds around the canvas for a drawn garden.
For now, its fun to play with what grows.

References:
The Coding Train - L-System Fractal Trees - https://www.youtube.com/watch?v=E1B4UoSQMFw
L-System User Notes (Paul Bourke) - https://paulbourke.net/fractals/lsys/

*/

// Variable declarations
var choice = 1;

var sentence = axiomL(choice); //Depends on functions in l-system-definitions.js
var rules = rulesL(choice); //Depends on functions in l-system-definitions.js

var startLen = 10;
var len;
var angle;
var level = 4;
var weedBase;
var mousePos;
var geometry = [];

// Generate function
function generate() {
    len = startLen*0.55;
    var nextSentence =""
    for (var i = 0; i < sentence.length; i++){
        var current = sentence.charAt(i);
        var found = false;
        for (var j = 0; j < rules.length; j++){
            if (current == rules[j].a) {
                found = true;
                nextSentence += rules[j].b;
                break;
            }
        }
        if (!found){
            nextSentence += current;
        }
    }
    sentence = nextSentence;
    turtle();
}

function turtle(){ //going to interpret text like turtle graphic engine - saves "where you were"
    resetMatrix();
    weedBase = createVector(width/2,height);
    translate(weedBase);
    stroke(0);
    for(var i = 0; i < sentence.length; i++){
        var current = sentence.charAt(i);
        if (current == "F") {
            line(0,0,0,-len);
            translate(0,-len);
        } else if (current == "+") {
            rotate(angle);
        } else if (current == "-") {
            rotate(-angle);
        } else if (current == "[") {
            push();
        } else if (current == "]"){
            pop();
        }
    }
}

function setup() { 
    let canvas = createCanvas((windowWidth-650), windowHeight/2);
    canvas.parent('sketch-container');
    angle = radians(22.5);
    background(255);
    turtle();
    generate();

    //console.log(drawingContext.getTransform()); //Used for getting current transform matrix for p5 context (incomplete)
}

function draw() { //Draws a new L-System weed each frame based on variable inputs
    background(255);
    sentence = axiomL(choice);
    rules = rulesL(choice);
    for (var i = 0; i < level; i++){
        generate()
    }
    sentence = axiom;
    mousePos = createVector(mouseX,height);
    angle = -weedBase.angleBetween(mousePos)-cos(PI/2); //Changes branching angle of L-system based on mouse position
    if (keyIsDown(RIGHT_ARROW)){
        startLen += 1;
    } else if (keyIsDown(LEFT_ARROW)){
        startLen -= 1;
    }
}

function keyPressed() { //Keys controlling user interaction
    if (key == "=") { //Toggles which L-System weed is chosen for drawing.
        if (choice < 4){
            choice += 1;
            rules = rulesL(choice);
        }
    } else if (key == "-") {
        if (choice > 0){
            choice -= 1;
            rules = rulesL(choice);
        }
    } else if (key == "]"){ //Toggles number of times the L-System generates for each weed.
        level += 1;
    } else if (key == "["){
        level -= 1;
    }
}