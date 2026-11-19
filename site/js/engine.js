/* ═════════════════════════════════════════════════════════════════════════════
   OMNI ENGINE — zero-dependency WebGL2 cinematic scene renderer.
   • 6 scenes (blackhole, nebula, orb, liquid, aurora, terrain), one compiled at a time
   • Scroll progress + pointer drive every scene; palette comes from config.js
   • Dynamic resolution (keeps ~60 fps), phone profile, reduced-motion, tab-pause
   • ACES tone mapping, vignette, blue-noise-ish dithering (no banding)
   • Graceful fallback: CSS gradient if WebGL2 is missing or a shader fails
   Classic script (no modules) so it also runs from file://, Android WebView, Electron.
   ═══════════════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  // ── shared GLSL ────────────────────────────────────────────────────────────
  const HEAD = `#version 300 es
precision highp float;
out vec4 fragColor;
uniform vec2 uRes; uniform float uTime, uP, uDim, uZoom; uniform vec2 uMouse, uShift;
uniform vec3 uBg, uGlow, uCool, uAccent;
float h31(vec3 p3){p3=fract(p3*.1031);p3+=dot(p3,p3.zyx+31.32);return fract((p3.x+p3.y)*p3.z);}
float n3(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);
 return mix(mix(mix(h31(i),h31(i+vec3(1,0,0)),f.x),mix(h31(i+vec3(0,1,0)),h31(i+vec3(1,1,0)),f.x),f.y),
            mix(mix(h31(i+vec3(0,0,1)),h31(i+vec3(1,0,1)),f.x),mix(h31(i+vec3(0,1,1)),h31(i+vec3(1,1,1)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}
float fbm3(vec3 p){float a=.5,s=0.;for(int i=0;i<3;i++){s+=a*n3(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s/.875;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,-s,s,c);}
vec3 aces(vec3 x){return clamp((x*(2.51*x+.03))/(x*(2.43*x+.59)+.14),0.,1.);}
vec3 stars(vec3 d,float k){vec3 c=vec3(0);
 for(int i=0;i<2;i++){float sc=i==0?90.:210.;vec3 p=d*sc;vec3 id=floor(p);vec3 f=fract(p)-.5;
  float h=h31(id+float(i)*17.);
  if(h>.982){vec3 off=vec3(h31(id+1.),h31(id+2.),h31(id+3.))-.5;float dd=length(f-off*.5);
   float b=(h-.982)/.018;c+=mix(vec3(1.,.82,.66),vec3(.72,.84,1.),h31(id+5.))*b*b*smoothstep(.16,0.,dd)*3.*k;}}
 return c;}
vec3 scene(vec2 uv, vec2 fc);
void main(){
 vec2 fc=gl_FragCoord.xy; vec2 uv=(fc-.5*uRes)/uRes.y;
 vec2 suv=(uv-uShift)*uZoom;
 vec3 col=scene(suv,fc)*mix(1.,.62,uDim);
 col=aces(col); col=pow(col,vec3(1./2.2));
 vec2 vu=uv*vec2(.75,1.); col*=1.-.42*dot(vu,vu);
 col+=(h31(vec3(fc,fract(uTime)*97.))-.5)*(2./255.);
 fragColor=vec4(col,1);
}
`;

  // ── scenes (each defines vec3 scene(vec2 uv, vec2 fc)) ─────────────────────
  const SCENES = {
    // Schwarzschild black hole: geodesic ray bending, thin accretion disk with
    // Doppler beaming + gravitational redshift, lensed procedural sky.
    blackhole: `
vec4 disk(vec3 q,float r,vec3 dir){
 float w=uTime*.35*pow(3./r,1.5);
 vec2 s=rot(w)*q.xz;
 float n=fbm(vec3(s*.55,r*2.4));
 float rings=.82+.18*sin(r*5.+n*9.);
 float temp=pow(3./r,.75)*smoothstep(2.4,3.3,r)*smoothstep(12.,5.5,r);
 vec3 vhat=normalize(vec3(-q.z,0.,q.x));float b=clamp(sqrt(.5/r),0.,.7);
 float D=1./(inversesqrt(1.-b*b)*(1.-b*dot(vhat,-normalize(dir))));
 float grav=sqrt(max(0.,1.-1./r));
 vec3 hot=mix(uGlow,vec3(1.,.93,.84),clamp(temp*.9,0.,1.));
 vec3 c=hot*temp*temp*4.2*pow(D,3.)*grav*(.35+n*1.25)*rings;
 c*=mix(vec3(1.,.72,.5),vec3(.86,.95,1.15),smoothstep(.8,1.5,D));
 return vec4(c,clamp(temp*(.5+n)*1.1,0.,.95));
}
vec3 sky(vec3 d){
 vec3 bn=normalize(vec3(.3,1.,.2));float band=exp(-abs(dot(d,bn))*5.);
 float m=fbm3(d*3.5);
 return stars(d,1.)+uCool*band*m*m*.11+uGlow*band*pow(m,4.)*.06+uBg*.6;
}
vec3 scene(vec2 uv,vec2 fc){
 float p=uP;
 float dist=mix(30.,4.6,pow(p,.8));
 float yaw=-.5+p*1.9+uMouse.x*.10;
 float pitch=mix(.20,.075,p)+uMouse.y*.05;
 vec3 ro=dist*vec3(sin(yaw)*cos(pitch),sin(pitch),cos(yaw)*cos(pitch));
 vec3 ww=normalize(-ro),uu=normalize(cross(ww,vec3(0,1,0))),vv=cross(uu,ww);
 vec3 dir=normalize(uv.x*uu+uv.y*vv+mix(1.9,1.3,p)*ww);
 vec3 pos=ro;vec3 h=cross(pos,dir);float h2=dot(h,h);
 vec3 col=vec3(0);float T=1.;bool hole=false;
 for(int i=0;i<STEPS;i++){
  float r2=dot(pos,pos);float r=sqrt(r2);
  if(r2<1.){hole=true;break;}
  if(r2>1600.&&dot(pos,dir)>0.)break;
  float dt=clamp(.075*r,.025,1.6);
  vec3 np=pos+dir*dt;
  dir+=-1.5*h2*pos/(r2*r2*r)*dt;
  if(pos.y*np.y<0.){float t=pos.y/(pos.y-np.y);vec3 q=mix(pos,np,t);float rq=length(q);
   if(rq>2.3&&rq<12.5){vec4 dc=disk(q,rq,dir);col+=T*dc.rgb*dc.a;T*=1.-dc.a;if(T<.01)break;}}
  pos=np;
 }
 if(!hole)col+=T*sky(normalize(dir));
 return col;
}`,

    // Volumetric nebula fly-through with emissive core and starfield.
    nebula: `
vec3 scene(vec2 uv,vec2 fc){
 float z=uP*16.+uTime*.12;
 vec3 ro=vec3(sin(uP*2.)*1.5,cos(uP*1.3),z);
 vec3 rd=normalize(vec3(uv+uMouse*.06,1.5));rd.xy*=rot(uP*.9+.2);
 vec3 col=stars(rd,.9)+uBg*.5;float T=1.;
 float t=.3+h31(vec3(fc,fract(uTime)*13.))*.25;
 for(int i=0;i<VSTEPS;i++){
  vec3 p=ro+rd*t;
  float raw=fbm(p*.32+vec3(0,0,uTime*.015));
  float d=smoothstep(.52,.9,raw);
  if(d>.002){
   float l=fbm(p*.32+vec3(.25,.35,.1));
   float sh=clamp((raw-l)*5.+.5,0.,1.);
   float core=exp(-length(p.xy-vec2(sin(p.z*.15)*2.,cos(p.z*.11)*1.5))*.6);
   vec3 c=mix(uCool*.35,uGlow*1.1,sh*sh)+uAccent*core*core*1.2;
   float a=d*.09;col+=T*c*a;T*=1.-a;if(T<.02)break;}
  t+=.22+t*.025;
 }
 return col;
}`,

    // Raymarched morphing orb: noise-displaced SDF, thin-film iridescence, rim + key light.
    orb: `
float map(vec3 p){
 float m=.15+.35*uP;
 float d=length(p)-1.1;
 d+=(fbm3(p*1.4+vec3(0,uTime*.18,uP*2.))-.5)*m*1.4;
 return d*.7;
}
vec3 nrm(vec3 p){vec2 e=vec2(.002,-.002);
 return normalize(e.xyy*map(p+e.xyy)+e.yyx*map(p+e.yyx)+e.yxy*map(p+e.yxy)+e.xxx*map(p+e.xxx));}
vec3 scene(vec2 uv,vec2 fc){
 float a=uP*3.2+uTime*.05+uMouse.x*.3;
 vec3 ro=vec3(sin(a)*5.4,.5+uMouse.y*.3+sin(uP*3.)*.6,cos(a)*5.4);
 vec3 ww=normalize(-ro),uu=normalize(cross(ww,vec3(0,1,0))),vv=cross(uu,ww);
 vec3 rd=normalize(uv.x*uu+uv.y*vv+1.7*ww);
 vec3 bg=uBg*.8+uCool*.06*exp(-length(uv+vec2(0.,.35))*2.);
 float t=0.;bool hit=false;
 for(int i=0;i<RSTEPS;i++){float d=map(ro+rd*t);if(d<.001){hit=true;break;}t+=d;if(t>9.)break;}
 if(!hit)return bg+stars(rd,.35);
 vec3 p=ro+rd*t,n=nrm(p);
 vec3 L=normalize(vec3(.8,.9,.4));
 float fr=pow(1.-max(dot(n,-rd),0.),3.);
 float film=fbm3(p*2.)*2.+fr*5.;
 vec3 iri=.5+.5*cos(film+vec3(0.,2.1,4.2));
 vec3 base=mix(uCool,uGlow,iri.x)*.38+uAccent*iri.z*.12;
 float dif=max(dot(n,L),0.);
 float spec=pow(max(dot(reflect(rd,n),L),0.),60.);
 vec3 c=base*(.03+dif*.95)+spec*vec3(1.,.95,.9)*3.+fr*uCool*.9;
 c+=uGlow*pow(max(dot(n,-L),0.),2.)*.15;
 return c;
}`,

    // Liquid metal: iq-style domain warping with screen-space normals and specular.
    liquid: `
vec3 scene(vec2 uv,vec2 fc){
 vec2 q=uv*1.3;q*=rot(uP*1.4+.3);q+=uMouse*.08;
 float t=uTime*.05+uP*2.5;
 vec3 p=vec3(q,t);
 float f1=fbm3(p);
 vec3 r=vec3(fbm3(p+vec3(f1*2.,1.7,0.)),fbm3(p+vec3(8.3,f1*2.,2.8)),t);
 float f=fbm(p+r*2.4);
 vec3 n=normalize(vec3(-dFdx(f)*90.,-dFdy(f)*90.,1.));
 vec3 L=normalize(vec3(-.5,.6,.7));
 float spec=pow(max(dot(reflect(vec3(0,0,-1),n),L),0.),24.);
 vec3 c=mix(uBg*1.5,uCool*.7,clamp(f*f*2.2,0.,1.));
 c=mix(c,uGlow*.9,clamp(length(r.xy)*.9-.55,0.,1.));
 c+=uAccent*pow(clamp(f-.45,0.,1.)*2.,3.)*1.3;
 c*=.12+f*.8;
 c+=spec*mix(vec3(1.),uAccent,.3)*1.3;
 return c;
}`,

    // Aurora over mountains and still water.
    aurora: `
float ridge(float x){return .02+fbm3(vec3(x*1.6,0.,0.))*.16;}
vec3 auroraCol(vec3 rd){
 vec3 c=vec3(0);
 float x=atan(rd.x,rd.z)*2.2+uP*1.2, y=rd.y;
 for(int k=0;k<2;k++){
  float fk=float(k);
  float y0=.16+fk*.13+.07*sin(x*1.3+fk*2.+uTime*.07)+(fbm3(vec3(x*.8,fk*3.,uTime*.03))-.5)*.22;
  float dy=y-y0;
  float body=smoothstep(-.012,.004,dy)*exp(-max(dy,0.)*(5.+fk*3.));
  float rays=0.;
  for(int i=0;i<ASTEPS/6;i++){float fi=float(i);
   rays+=pow(1.-abs(2.*n3(vec3(x*(7.+fi*3.),fi*1.7,uTime*.15))-1.),4.);}
  rays/=float(ASTEPS/6);
  float vis=smoothstep(.2,.7,n3(vec3(x*.6,fk*5.,uTime*.02)));
  vec3 cc=mix(uCool*2.2,uGlow*1.6,smoothstep(0.,.22,dy));
  c+=cc*body*(.35+rays*1.6)*vis*(.9-fk*.3);
 }
 return c*smoothstep(0.,.05,rd.y);
}
vec3 scene(vec2 uv,vec2 fc){
 float pitch=mix(.26,.5,uP)+uMouse.y*.04;
 vec3 rd=normalize(vec3(uv.x+uMouse.x*.05,uv.y+pitch,1.2));
 rd.xz*=rot(uP*.5);
 vec3 sky=uBg*.5+uCool*.025*exp(-max(rd.y,0.)*6.);
 if(rd.y>0.){
  vec3 c=sky+stars(rd,.8)*smoothstep(.05,.3,rd.y)+auroraCol(rd);
  float ang=atan(rd.x,rd.z);
  if(rd.y<ridge(ang))return uBg*.25+uCool*.02;
  return c;
 }
 vec3 rr=vec3(rd.x,-rd.y,rd.z);
 rr.x+=(n3(vec3(rd.xz/rd.y*3.,uTime*.4))-.5)*.02;
 float ang=atan(rr.x,rr.z);
 vec3 refl=(rr.y<ridge(ang))?uBg*.2:(sky+auroraCol(rr)+stars(rr,.4));
 return refl*.55*(1.-exp(rd.y*10.)*.3);
}`,

    // Raymarched ridged terrain at golden hour with aerial perspective.
    terrain: `
float H(vec2 x){float a=.5,s=0.;vec2 p=x*.18;
 for(int i=0;i<5;i++){float n=n3(vec3(p,0.));n=1.-abs(n*2.-1.);s+=a*n*n;p=rot(.6)*p*2.04;a*=.5;}
 return s*3.2;}
float Hlo(vec2 x){float a=.5,s=0.;vec2 p=x*.18;
 for(int i=0;i<3;i++){float n=n3(vec3(p,0.));n=1.-abs(n*2.-1.);s+=a*n*n;p=rot(.6)*p*2.04;a*=.5;}
 return s*3.2/.875*.97;}
vec3 scene(vec2 uv,vec2 fc){
 float z=uP*45.+uTime*.25;
 vec3 ro=vec3(sin(z*.05)*3.,0.,z);ro.y=Hlo(ro.xz)+1.4+uP*1.5;
 vec3 rd=normalize(vec3(uv.x+uMouse.x*.06,uv.y-.12+uMouse.y*.04,1.3));
 rd.xz*=rot(sin(z*.05)*.15);
 vec3 sun=normalize(vec3(-.4,mix(.18,.06,uP),1.));
 float sd=max(dot(rd,sun),0.);
 vec3 sky=mix(uGlow*.9,uCool*.5,smoothstep(-.02,.45,rd.y))+uGlow*pow(sd,40.)*4.+uAccent*pow(sd,6.)*.4;
 float t=.5;bool hit=false;
 for(int i=0;i<TSTEPS;i++){vec3 p=ro+rd*t;float d=p.y-H(p.xz);if(d<.004*t){hit=true;break;}t+=d*.45;if(t>60.)break;}
 if(!hit)return sky;
 vec3 p=ro+rd*t;vec2 e=vec2(.03,0.);
 vec3 n=normalize(vec3(H(p.xz-e.xy)-H(p.xz+e.xy),2.*e.x,H(p.xz-e.yx)-H(p.xz+e.yx)));
 float dif=max(dot(n,sun),0.);
 vec3 rock=mix(uBg*2.+vec3(.02),uCool*.25,smoothstep(.6,.9,n.y));
 vec3 c=rock*(.08+dif*uGlow*1.6)+uCool*.05*n.y;
 float fog=1.-exp(-t*.045);
 return mix(c,sky*.85,fog);
}`,
  };

  const hexToLin = h => {
    const v = parseInt(h.replace('#', ''), 16);
    return [(v >> 16) & 255, (v >> 8) & 255, v & 255].map(c => Math.pow(c / 255, 2.2));
  };

  function create(canvas, opts) {
    const o = Object.assign({ scene: 'blackhole', palette: {}, mobile: false, reduced: false, shift: [0, 0], zoom: 1 }, opts);
    const gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, powerPreference: 'high-performance', preserveDrawingBuffer: !!o.preserve });
    if (!gl) return null;
    const name = SCENES[o.scene] ? o.scene : 'blackhole';
    const m = o.mobile;
    const defs = `#define STEPS ${m ? 110 : 190}\n#define VSTEPS ${m ? 40 : 70}\n#define RSTEPS ${m ? 64 : 96}\n#define ASTEPS ${m ? 18 : 30}\n#define TSTEPS ${m ? 90 : 150}\n`;
    const src = HEAD.replace('out vec4 fragColor;', defs + 'out vec4 fragColor;') + SCENES[name];
    const vsrc = `#version 300 es\nin vec2 a;void main(){gl_Position=vec4(a,0,1);}`;
    const sh = (type, s) => { const x = gl.createShader(type); gl.shaderSource(x, s); gl.compileShader(x); return x; };
    const vs = sh(gl.VERTEX_SHADER, vsrc), fs = sh(gl.FRAGMENT_SHADER, src);
    const prog = gl.createProgram(); gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    const ext = gl.getExtension('KHR_parallel_shader_compile');
    const t0 = performance.now();

    let ready = false, failed = false, raf = 0, last = 0, scale = m ? 0.75 : 1, frames = 0, acc = 0;
    let target = 0, p = 0, vel = 0, mx = 0, my = 0, tmx = 0, tmy = 0, dim = 0, tdim = 0, time = 0, firstFrameCb = null;
    const U = {};
    const dprCap = m ? 1.5 : 1.75;

    function finishLink() {
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
        failed = true;
        console.error('[omni-engine] shader error:', gl.getShaderInfoLog(fs) || gl.getProgramInfoLog(prog));
        return false;
      }
      gl.useProgram(prog);
      const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'a'); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      ['uRes', 'uTime', 'uP', 'uShift', 'uZoom', 'uDim', 'uMouse', 'uBg', 'uGlow', 'uCool', 'uAccent'].forEach(k => U[k] = gl.getUniformLocation(prog, k));
      const pal = o.palette;
      gl.uniform3fv(U.uBg, hexToLin(pal.bg || '#030305'));
      gl.uniform3fv(U.uGlow, hexToLin(pal.glow || '#ff7a2f'));
      gl.uniform3fv(U.uCool, hexToLin(pal.cool || '#6f8cff'));
      gl.uniform3fv(U.uAccent, hexToLin(pal.accent || '#ffb46b'));
      ready = true;
      api.compileMs = Math.round(performance.now() - t0);
      return true;
    }

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, dprCap) * scale;
      const w = Math.max(2, Math.round(innerWidth * dpr)), h = Math.max(2, Math.round(innerHeight * dpr));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    }

    function frame(now) {
      raf = requestAnimationFrame(frame);
      if (!ready) {
        if (failed) return;
        if (ext && !gl.getProgramParameter(prog, ext.COMPLETION_STATUS_KHR)) return;
        if (!finishLink()) { api.onfail && api.onfail(); return; }
      }
      const dt = Math.min(0.1, last ? (now - last) / 1000 : 0.016); last = now;
      // critically-damped spring toward scroll target (silky, never overshoots badly)
      const k = o.reduced ? 60 : 22;
      vel += (target - p) * k * dt; vel *= Math.exp(-2 * Math.sqrt(k) * dt); p += vel * dt;
      if (Math.abs(target - p) < 1e-5) p = target;
      mx += (tmx - mx) * Math.min(1, dt * 3); my += (tmy - my) * Math.min(1, dt * 3);
      dim += (tdim - dim) * Math.min(1, dt * 2.5);
      time += o.reduced ? dt * 0.15 : dt;
      // dynamic resolution: aim for ~16.7 ms
      frames++; acc += dt;
      if (frames >= 20) {
        const avg = acc / frames; frames = 0; acc = 0;
        if (avg > 0.021 && scale > 0.45) scale = Math.max(0.45, scale - 0.1);
        else if (avg < 0.015 && scale < 1) scale = Math.min(1, scale + 0.05);
      }
      resize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uRes, canvas.width, canvas.height);
      gl.uniform1f(U.uTime, time); gl.uniform1f(U.uP, Math.max(0, Math.min(1, p)));
      gl.uniform2f(U.uShift, o.shift[0], o.shift[1]); gl.uniform1f(U.uZoom, o.zoom || 1); gl.uniform1f(U.uDim, dim);
      gl.uniform2f(U.uMouse, mx, my);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (firstFrameCb) { const cb = firstFrameCb; firstFrameCb = null; cb(); }
    }

    const api = {
      scene: name, compileMs: 0,
      get progress() { return p; },
      get scale() { return scale; },
      setProgress(v) { target = v; },
      jump(v) { target = p = v; vel = 0; },
      setPointer(x, y) { tmx = x; tmy = y; },
      setDim(v) { tdim = v; },
      setShift(v, z) { o.shift = v; if (z) o.zoom = z; },
      onFirstFrame(cb) { firstFrameCb = cb; },
      start() { if (!raf) raf = requestAnimationFrame(frame); },
      stop() { cancelAnimationFrame(raf); raf = 0; last = 0; },
      get failed() { return failed; },
    };
    document.addEventListener('visibilitychange', () => document.hidden ? api.stop() : api.start());
    canvas.addEventListener('webglcontextlost', e => { e.preventDefault(); api.stop(); });
    return api;
  }

  window.OmniEngine = { create, scenes: Object.keys(SCENES) };
})();
