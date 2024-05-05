/*
FROM CLASS 3/5 - SIGN-DISTANCE FUNCTIONS
WORKSHOP 09
*/

#ifdef GL_ES
precision mediump float;
#endif

// Define constant values
#define TAU 6.2831853071
#define waveLength 25.0

// Define uniforms passed to the shader.
// (Using book of shaders naming convention)
uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_time;
uniform vec4 u_circle;

uniform sampler2D u_waveform_tex;
uniform sampler2D u_spectrum_tex;

uniform float u_bass;
uniform float u_lowMid;
uniform float u_mid;
uniform float u_highMid;
uniform float u_treble;

// SDF functions
// From https://iquilezles.org/articles/distfunctions2d/
float sdCircle( in vec2 p, in float r ) 
{
    return length(p)-r;
}

float sdBox( in vec2 p, in vec2 b )
{
    vec2 d = abs(p)-b;
    return length(max(d,0.0)) + min(max(d.x,d.y),0.0);
}

float opUnion( float d1, float d2 )
{
    return min(d1,d2);
}

float opSubtraction( float d1, float d2 )
{
    return max(-d1,d2);
}

float opIntersection( float d1, float d2 )
{
    return max(d1,d2);
}

float opSmoothUnion( float d1, float d2, float k )
{
    float h = clamp( 0.5 + 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) - k*h*(1.0-h);
}

float opSmoothSubtraction( float d1, float d2, float k )
{
    float h = clamp( 0.5 - 0.5*(d2+d1)/k, 0.0, 1.0 );
    return mix( d2, -d1, h ) + k*h*(1.0-h);
}

float opSmoothIntersection( float d1, float d2, float k )
{
    float h = clamp( 0.5 - 0.5*(d2-d1)/k, 0.0, 1.0 );
    return mix( d2, d1, h ) + k*h*(1.0-h);
}

float modulus( float x, float y )
{
    return x - y * floor(x/y);
}

// Wobble Function - an adaptation of an HLSL SDF function from Ronja's Tutorials 
// https://www.ronja-tutorials.com/post/036-sdf-space-manipulation/

vec2 wobble(in vec2 position, float frequency, float amount){
    vec2 wob = sin(position.yx * frequency) * amount;
    return position + wob ;
}

void main() {

    vec2 circleCenter = u_circle.xy * u_resolution;
    vec2 mouseCircCenter = u_mouse;
    vec2 mouseInvCenter = vec2(u_resolution.x - u_mouse.x, u_resolution.y - u_mouse.y);

    // Normalized coordinates
    vec2 n = gl_FragCoord.xy / u_resolution.xy;   

    // Map the location of this pixel to the uniform textures.
    // This will give us the values of the waveform and spectrum
    // as vec4s. 
    vec4 wave = texture2D(u_waveform_tex, n);
    vec4 spec = texture2D(u_spectrum_tex, n);

    float soundOn = u_bass + u_lowMid + u_mid + u_highMid + u_treble;

    // Position the center of each geometry in relation to the predefined circle center, 
    vec2 pc = gl_FragCoord.xy - circleCenter;
    vec2 pm = gl_FragCoord.xy - mouseCircCenter;
    vec2 pi = gl_FragCoord.xy - mouseInvCenter;
    
    // 
    vec2 wobSinCirc = wobble(pc, sin(u_time)/(20. - u_mid/4.), 50.);
    vec2 wobCosCirc = wobble(pc, cos(u_time + TAU*1.5)/(20. - u_mid/4.), 40.);

    

    // Compute SDF for each object
    float sdfS = sdCircle(wobCosCirc, u_circle.z*(sin(u_time)/2.+TAU/4.+u_treble/100.));
    float sdfC = sdCircle(wobSinCirc, u_circle.z*(cos(u_time)/2.+TAU/4.+u_treble/200.));
    float sdfN = sdCircle(pc, u_circle.z*u_bass/128.);
    float sdfM = sdCircle(pm, u_circle.z*(cos(u_time)/1.5 + TAU/6.));
    float sdfI = sdCircle(pi, u_circle.z*(sin(u_time)/1.5 + TAU/6.));

    // Compute final SDF as your choice of boolean operation
    float sdfA = opUnion(sdfC, sdfS);
    float sdfO = opSmoothSubtraction(sdfA, sdfN, 50.0);
    float sdfR = opSmoothUnion(sdfS, sdfI, 200.0);
    float sdf = opSmoothUnion(sdfC, sdfM, 200.0);

    //Define color pixels for R G B channels based on computed boolean SDFs
    float colorR = (abs(sdfR) / waveLength);
    float colorB = (abs(sdf) / waveLength);
    float colorG = (abs(sdfO) / waveLength/6.);

    //Define gl_FragColor as a combination of the colorR, colorB, and colorG channel values.
    gl_FragColor = vec4(colorR, colorB, colorG, 1.0);
}
