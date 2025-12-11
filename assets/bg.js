(function(){
  const canvas = document.getElementById('bg-canvas');
  if(!canvas) return;
  const ctx = canvas.getContext('2d');
  let width = 0, height = 0, dpr = Math.max(1, window.devicePixelRatio || 1);
  const particles = [];
  const PARTICLE_COUNT = Math.max(20, Math.min(80, Math.floor((window.innerWidth*window.innerHeight)/80000)));
  const COLORS = ['#e50914','#ff6b6b','#7f0b0b'];
  let running = true;

  function resize(){
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }

  function rand(min, max){ return Math.random()*(max-min)+min }

  function createParticle(){
    return {
      x: rand(-50, width+50),
      y: rand(-50, height+50),
      vx: rand(-0.2, 0.6),
      vy: rand(-0.25, 0.25),
      size: rand(0.8, 3.6),
      hue: COLORS[Math.floor(Math.random()*COLORS.length)],
      life: rand(60, 220),
      blink: Math.random()<0.08
    };
  }

  function init(){
    particles.length = 0;
    for(let i=0;i<PARTICLE_COUNT;i++) particles.push(createParticle());
    resize();
  }

  let t=0;
  function draw(){
    if(!running) return;
    t += 1/60;
    // subtle radial vignette gradient
    ctx.clearRect(0,0,width,height);

    // background animated gradient
    const g = ctx.createLinearGradient(0,0,width,height);
    g.addColorStop(0, 'rgba(8,8,8,0.96)');
    g.addColorStop(0.35, 'rgba(14,4,4,0.75)');
    g.addColorStop(1, 'rgba(6,0,0,0.9)');
    ctx.fillStyle = g;
    ctx.fillRect(0,0,width,height);

    // soft moving spotlight
    const rx = width * 0.2 + (Math.sin(t*0.23)+1)*0.4*width;
    const ry = height * 0.3 + (Math.cos(t*0.17)+1)*0.35*height;
    const rg = ctx.createRadialGradient(rx, ry, 60, rx, ry, Math.max(width,height)*0.9);
    rg.addColorStop(0, 'rgba(230,9,20,0.06)');
    rg.addColorStop(0.15, 'rgba(230,9,20,0.03)');
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = rg;
    ctx.fillRect(0,0,width,height);

    // particles
    for(let i=0;i<particles.length;i++){
      const p = particles[i];
      p.x += p.vx * (1 + Math.sin(t*0.5)*0.6);
      p.y += p.vy * (1 + Math.cos(t*0.4)*0.5);
      p.life -= 1;
      if(p.life<=0 || p.x < -80 || p.x > width+80 || p.y < -80 || p.y > height+80){
        particles[i] = createParticle();
        continue;
      }
      // glow
      ctx.beginPath();
      const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size*6);
      grad.addColorStop(0, p.hue);
      grad.addColorStop(0.15, p.hue+'55');
      grad.addColorStop(0.5, p.hue+'33');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.arc(p.x, p.y, p.size*6, 0, Math.PI*2);
      ctx.fill();

      // core
      ctx.beginPath();
      ctx.fillStyle = p.hue;
      ctx.globalAlpha = p.blink ? (0.4 + 0.6*Math.abs(Math.sin(t*2 + i))) : 0.95;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    // faint connecting lines for nearby particles
    ctx.lineWidth = 0.7;
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const a = particles[i], b = particles[j];
        const dx = a.x-b.x, dy = a.y-b.y;
        const dist = Math.sqrt(dx*dx+dy*dy);
        if(dist<110){
          ctx.beginPath();
          const alpha = 0.12 * (1 - dist/110);
          ctx.strokeStyle = 'rgba(229,9,20,'+alpha.toFixed(3)+')';
          ctx.moveTo(a.x,a.y);
          ctx.lineTo(b.x,b.y);
          ctx.stroke();
        }
      }
    }

    // subtle noise overlay for retro-futuristic texture
    ctx.globalCompositeOperation = 'overlay';
    ctx.fillStyle = 'rgba(255,255,255,0.003)';
    ctx.fillRect(0,0,width,height);
    ctx.globalCompositeOperation = 'source-over';

    requestAnimationFrame(draw);
  }

  // visibility handling for performance
  function onVisibility(){
    if(document.hidden){ running = false; }
    else{ running = true; requestAnimationFrame(draw); }
  }

  window.addEventListener('resize', ()=>{ dpr = Math.max(1, window.devicePixelRatio || 1); resize(); });
  document.addEventListener('visibilitychange', onVisibility);

  // low-power preference respect
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(prefersReduced){
    // static subtle gradient, no animation
    resize();
    ctx.fillStyle = 'linear-gradient(180deg, #050505, #070707)';
    ctx.clearRect(0,0,canvas.width,canvas.height);
    return;
  }

  init();
  requestAnimationFrame(draw);
})();
