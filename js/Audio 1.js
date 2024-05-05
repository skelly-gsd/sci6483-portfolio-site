/*
FROM CLASS 3/5 - SIGN-DISTANCE FUNCTIONS
WORKSHOP 09
*/

// Geometry info
const circ = {
  center: [0.5, 0.5],  // in normalized coordinates
  radius: 75,
  width: 5
};

const rectangle = {
  center: [0.416, 0.375], // in normalized coordinates
  radii: [125, 75],
}

let sound, fft, waveform, spectrum;
let loopWidth = 950;
let loopHeight = 600;
let jlx;

// Our main render shader
let myShader;




// Always use `preload` in p5 for any async functions that may take long
// to execute but are needed before program starts.
function preload() {
  sound = loadSound('../assets/AUDIO 1.mp3');
  myShader = loadShader('../assets/shaders/vshader.vert', '../assets/shaders/fshader.frag');
}

function setup() {
  // Use WEBGL renderer for shaders
  let cnv = createCanvas(loopWidth, windowHeight, WEBGL);
  cnv.parent("sketch-holder")
  pixelDensity(1);
  cnv.mouseClicked(togglePlay);

  fft = new p5.FFT();
}

function draw() {
  // `waveform` is now an array of 1024 values 
  // ranging from -1.0 to 1.0, representing the amplitude
  // of the audio signal at each frequency sample.
  // https://p5js.org/reference/#/p5.FFT/waveform
  waveform = fft.waveform();

  // Alternatively, you can also use the `analyze` method.
  // `spectrum` is now an array of 1024 values
  // ranging from 0 to 255, representing the amplitude
  // of the audio signal at each frequency sample
  // with 127 representing silence.
  // https://p5js.org/reference/#/p5.FFT/analyze
  spectrum = fft.analyze();


  // Set the active shader
  shader(myShader);

  // Send whichever information we want to pass to the shader
  // using uniforms
  myShader.setUniform('u_resolution', [width, height]);
  myShader.setUniform('u_mouse', [mouseX, height - mouseY]);
  //myShader.setUniform('u_mouse_prev', [pmouseX, height - pmouseY]);
  myShader.setUniform('u_time', 0.001 * millis()); // time in secs

  // In this sketch, we will send the geometry as uniforms. 
  // This is not strictly necessary, the geometry parameters
  // could be defined in the shader itself too.
  myShader.setUniform('u_circle', [circ.center[0], 1 - circ.center[1], circ.radius, circ.width]);
  myShader.setUniform('u_rectangle', [rectangle.center[0], 1 - rectangle.center[1], rectangle.radii[0], rectangle.radii[1]]);

    // The best way to pass large amounts of data to a shader
  // is by converting the data to a texture. 
  // Here, we convert the waveform and spectrum arrays to
  // p5.Image objects and send them to the shader as textures.
  let waveformAsImg = floatArrayToImage(waveform);
  myShader.setUniform('u_waveform_tex', waveformAsImg);
  
  let spectrumAsImg = byteArrayToImage(spectrum);
  myShader.setUniform('u_spectrum_tex', spectrumAsImg);

  myShader.setUniform('u_bass', fft.getEnergy("bass"));
  myShader.setUniform('u_lowMid', fft.getEnergy("lowMid"));
  myShader.setUniform('u_mid', fft.getEnergy("mid"));
  myShader.setUniform('u_highMid', fft.getEnergy("highMid"));
  myShader.setUniform('u_treble', fft.getEnergy("treble"));

  // Draw a full screen rectangle to apply the shader to
  rect(0, 0, width, height);

  // console.log(`${width}x${height} FPS: ${Math.round(frameRate(), 0)}`);
  //console.log([mouseX/width, (height - mouseY)/height]);
}


function windowResized() {
  resizeCanvas(loopWidth, windowHeight);
}

function togglePlay() {
  if (sound.isPlaying()) {
    sound.pause();
  } else {
    sound.loop();
  }
}


function keyPressed() {
  if (key === 's') {
    console.log("Waveform:");
    console.log(waveform);
    
    console.log("Spectrum:");
    console.log(spectrum);
  }
}


/**
 * This function takes an array of floating point values
 * between [-1, 1] and returns a p5.Image object where
 * each pixel's color has been mapped from to [0, 255].
 * @param {*} array 
 * @returns 
 */
function floatArrayToImage(array) {
  let img = createImage(array.length, 1);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    const val = (0.5 + 0.5 * array[i]) * 255;
    img.pixels[i * 4 + 0] = val;
    img.pixels[i * 4 + 1] = val;
    img.pixels[i * 4 + 2] = val;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  return img;
}

/**
 * This function takes an array of byte values
 * between [0, 255] and returns a p5.Image object
 * where each pixel's color has been set to the
 * corresponding byte value.
 * @param {*} array 
 * @returns 
 */
function byteArrayToImage(array) {
  let img = createImage(array.length, 1);
  img.loadPixels();
  for (let i = 0; i < img.width; i++) {
    const val = array[i];
    img.pixels[i * 4 + 0] = val;
    img.pixels[i * 4 + 1] = val;
    img.pixels[i * 4 + 2] = val;
    img.pixels[i * 4 + 3] = 255;
  }
  img.updatePixels();
  return img;
}
