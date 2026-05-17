// CURSOR
const dot = document.getElementById('cursorDot');
const ring = document.getElementById('cursorRing');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;});
function animCursor(){
  if(dot){dot.style.left=mx+'px';dot.style.top=my+'px';}
  rx+=(mx-rx)*0.12;ry+=(my-ry)*0.12;
  if(ring){ring.style.left=rx+'px';ring.style.top=ry+'px';}
  requestAnimationFrame(animCursor);
}
animCursor();
document.querySelectorAll('a,button,.work-card,.service-card,.contact-link').forEach(el=>{
  el.addEventListener('mouseenter',()=>document.body.classList.add('cursor-hover'));
  el.addEventListener('mouseleave',()=>document.body.classList.remove('cursor-hover'));
});

// NAV
const navbar=document.getElementById('navbar');
window.addEventListener('scroll',()=>navbar.classList.toggle('scrolled',window.scrollY>60));

// HAMBURGER
const hamburger=document.getElementById('hamburger');
const mobileMenu=document.getElementById('mobileMenu');
hamburger.addEventListener('click',()=>{
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow=mobileMenu.classList.contains('open')?'hidden':'';
});
document.querySelectorAll('.mobile-link').forEach(l=>l.addEventListener('click',()=>{
  hamburger.classList.remove('open');mobileMenu.classList.remove('open');document.body.style.overflow='';
}));

// SCROLL REVEAL
const observer=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target);}});
},{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));

// LIGHTBOX
const lightbox=document.getElementById('lightbox');
const lightboxImg=document.getElementById('lightboxImg');
document.querySelectorAll('.work-card[data-src]').forEach(item=>{
  item.addEventListener('click',()=>{
    lightboxImg.src=item.dataset.src;
    lightbox.classList.add('open');
    document.body.style.overflow='hidden';
  });
});
document.getElementById('lightboxClose').addEventListener('click',closeLB);
lightbox.addEventListener('click',e=>{if(e.target===lightbox)closeLB();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLB();});
function closeLB(){lightbox.classList.remove('open');document.body.style.overflow='';}

// WORK FILTERS
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.filter-btn').forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');
    const f=btn.dataset.filter;
    document.querySelectorAll('.work-card').forEach(item=>{
      item.style.display=(f==='all'||item.dataset.category===f)?'':'none';
    });
  });
});

// CONTACT FORM
const cf=document.getElementById('contactForm');
if(cf)cf.addEventListener('submit',function(e){
  e.preventDefault();
  cf.style.display='none';
  document.getElementById('formSuccess').style.display='block';
});

// CHROME 3D CANVAS
function drawChrome(canvasId, mirror) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  let t = 0;

  // Define shapes: cubes and torus-like rings
  function project(x, y, z, fov, cx, cy) {
    const scale = fov / (fov + z);
    return { x: cx + x * scale, y: cy + y * scale, s: scale };
  }

  function rotateY(x, z, a) {
    return { x: x * Math.cos(a) - z * Math.sin(a), z: x * Math.sin(a) + z * Math.cos(a) };
  }
  function rotateX(y, z, a) {
    return { y: y * Math.cos(a) - z * Math.sin(a), z: y * Math.sin(a) + z * Math.cos(a) };
  }
  function rotateZ(x, y, a) {
    return { x: x * Math.cos(a) - y * Math.sin(a), y: x * Math.sin(a) + y * Math.cos(a) };
  }

  function chromeFill(ctx, brightness) {
    const g = ctx.createLinearGradient(0, -20, 0, 20);
    const b = Math.floor(brightness * 255);
    const r = Math.floor(brightness * 200);
    g.addColorStop(0, `rgba(${r+40},${r+40},${b+40},0.95)`);
    g.addColorStop(0.3, `rgba(${b},${b},${b},0.8)`);
    g.addColorStop(0.6, `rgba(${r+60},${r+50},${r+55},0.9)`);
    g.addColorStop(1, `rgba(${r+20},${r+20},${b},0.85)`);
    return g;
  }

  function drawCube(cx, cy, size, rx, ry2, rz) {
    // 8 vertices of cube
    let verts = [
      [-1,-1,-1],[1,-1,-1],[1,1,-1],[-1,1,-1],
      [-1,-1,1],[1,-1,1],[1,1,1],[-1,1,1]
    ].map(([x,y,z]) => {
      let v = {x:x*size,y:y*size,z:z*size};
      let r1 = rotateX(v.y,v.z,rx); v.y=r1.y;v.z=r1.z;
      let r2 = rotateY(v.x,v.z,ry2); v.x=r2.x;v.z=r2.z;
      let r3 = rotateZ(v.x,v.y,rz); v.x=r3.x;v.y=r3.y;
      return project(v.x,v.y,v.z,300,cx,cy);
    });

    const faces = [
      [0,1,2,3,0.9],[4,5,6,7,0.6],[0,1,5,4,0.75],[2,3,7,6,0.5],[0,3,7,4,0.7],[1,2,6,5,0.8]
    ];
    faces.sort((a,b)=>{
      const za=verts[a[0]].s+verts[a[1]].s+verts[a[2]].s+verts[a[3]].s;
      const zb=verts[b[0]].s+verts[b[1]].s+verts[b[2]].s+verts[b[3]].s;
      return za-zb;
    });
    faces.forEach(([i0,i1,i2,i3,bright])=>{
      ctx.beginPath();
      ctx.moveTo(verts[i0].x,verts[i0].y);
      ctx.lineTo(verts[i1].x,verts[i1].y);
      ctx.lineTo(verts[i2].x,verts[i2].y);
      ctx.lineTo(verts[i3].x,verts[i3].y);
      ctx.closePath();
      const g = ctx.createLinearGradient(verts[i0].x,verts[i0].y,verts[i2].x,verts[i2].y);
      const bv = Math.floor(bright*220);
      g.addColorStop(0,`rgba(${bv+20},${bv+20},${bv+30},0.95)`);
      g.addColorStop(0.4,`rgba(${bv-30},${bv-30},${bv-20},0.85)`);
      g.addColorStop(1,`rgba(${bv+10},${bv},${bv+15},0.9)`);
      ctx.fillStyle=g;
      ctx.fill();
      ctx.strokeStyle='rgba(200,200,220,0.15)';
      ctx.lineWidth=0.5;
      ctx.stroke();
    });
  }

  function drawRing(cx, cy, R, r2, rx2, ry2, segs=32) {
    for(let i=0;i<segs;i++){
      const a0=(i/segs)*Math.PI*2;
      const a1=((i+1)/segs)*Math.PI*2;
      const pts=[];
      for(const a of [a0,a1]){
        for(const b of [0,Math.PI*0.5,Math.PI,Math.PI*1.5]){
          let x=(R+r2*Math.cos(b))*Math.cos(a);
          let y=r2*Math.sin(b);
          let z=(R+r2*Math.cos(b))*Math.sin(a);
          let rv=rotateX(y,z,rx2);y=rv.y;z=rv.z;
          let rv2=rotateY(x,z,ry2);x=rv2.x;z=rv2.z;
          pts.push(project(x,y,z,300,cx,cy));
        }
      }
      const bright=0.5+0.5*Math.cos(a0+ry2);
      ctx.beginPath();
      ctx.moveTo(pts[0].x,pts[0].y);
      ctx.lineTo(pts[4].x,pts[4].y);
      ctx.lineTo(pts[5].x,pts[5].y);
      ctx.lineTo(pts[1].x,pts[1].y);
      ctx.closePath();
      const bv=Math.floor(bright*200);
      ctx.fillStyle=`rgba(${bv+30},${bv+30},${bv+40},0.7)`;
      ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.06)';
      ctx.lineWidth=0.3;
      ctx.stroke();
    }
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    t += 0.008;
    const mx2 = mirror ? -1 : 1;

    // Top cube
    drawCube(W/2, H*0.22, 55,
      t * 0.7,
      t * mx2,
      t * 0.3
    );

    // Middle ring
    drawRing(W/2, H*0.5, 65, 18,
      t * 0.5 + 0.5,
      t * 0.8 * mx2
    );

    // Bottom cube smaller
    drawCube(W/2, H*0.78, 38,
      t * -0.6,
      t * 1.1 * mx2,
      t * 0.5
    );

    requestAnimationFrame(frame);
  }
  frame();
}

drawChrome('chromeCanvasLeft', false);
drawChrome('chromeCanvasRight', true);
