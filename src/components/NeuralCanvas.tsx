'use client';

import { useEffect, useRef } from 'react';

const vertexShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    attribute vec2 a_position;
    void main() {
        vUv = .5 * (a_position + 1.);
        gl_Position = vec4(a_position, 0.0, 1.0);
    }
`;

const fragmentShaderSource = `
    precision mediump float;
    varying vec2 vUv;
    uniform float u_time;
    uniform float u_ratio;
    uniform vec2 u_pointer_position;
    uniform float u_scroll_progress;
    
    vec2 rotate(vec2 uv, float th) {
        return mat2(cos(th), sin(th), -sin(th), cos(th)) * uv;
    }
    
    float neuro_shape(vec2 uv, float t, float p) {
        vec2 sine_acc = vec2(0.);
        vec2 res = vec2(0.);
        float scale = 8.;
        for (int j = 0; j < 15; j++) {
            uv = rotate(uv, 1.);
            sine_acc = rotate(sine_acc, 1.);
            vec2 layer = uv * scale + float(j) + sine_acc - t;
            sine_acc += sin(layer);
            res += (.5 + .5 * cos(layer)) / scale;
            scale *= (1.2 - .07 * p);
        }
        return res.x + res.y;
    }
    
    void main() {
        vec2 uv = .5 * vUv;
        uv.x *= u_ratio;
        vec2 pointer = vUv - u_pointer_position;
        pointer.x *= u_ratio;
        float p = clamp(length(pointer), 0., 1.);
        p = .5 * pow(1. - p, 2.);
        float t = .001 * u_time;
        vec3 color = vec3(0.);
        float noise = neuro_shape(uv, t, p);
        noise = 1.2 * pow(noise, 3.);
        noise += pow(noise, 10.);
        noise = max(.0, noise - .5);
        noise *= (1. - length(vUv - .5));
        color = normalize(vec3(.2, .5 + .4 * cos(3. * u_scroll_progress), .5 + .5 * sin(3. * u_scroll_progress)));
        color = color * noise;
        gl_FragColor = vec4(color, noise);
    }
`;

export default function NeuralCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(Date.now());
  const pointerRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl');
    if (!gl) return;

    // Create shaders
    const vertexShader = gl.createShader(gl.VERTEX_SHADER);
    const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    if (!vertexShader || !fragmentShader) return;

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(vertexShader);
    gl.compileShader(fragmentShader);

    // Create program
    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    gl.useProgram(program);

    // Set up buffers
    const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const positionLocation = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    // Get uniform locations
    const timeLocation = gl.getUniformLocation(program, 'u_time');
    const ratioLocation = gl.getUniformLocation(program, 'u_ratio');
    const pointerLocation = gl.getUniformLocation(program, 'u_pointer_position');
    const scrollLocation = gl.getUniformLocation(program, 'u_scroll_progress');

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform1f(ratioLocation, canvas.width / canvas.height);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current = {
        x: e.clientX / window.innerWidth,
        y: 1 - e.clientY / window.innerHeight,
      };
    };

    const handleScroll = () => {
      const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      gl.uniform1f(scrollLocation, scrollProgress);
    };

    const animate = () => {
      const time = Date.now() - startTimeRef.current;
      gl.uniform1f(timeLocation, time);
      gl.uniform2f(pointerLocation, pointerRef.current.x, pointerRef.current.y);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    // Set up event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('scroll', handleScroll);

    // Initial setup
    handleResize();
    handleScroll();
    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full pointer-events-none opacity-95"
    />
  );
}