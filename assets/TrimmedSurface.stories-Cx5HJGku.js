import{j as c}from"./jsx-runtime-DFAAy_2V.js";import{N as S,B as Re,F as re,D as H,C as Ue,O as Ze,V as Fe}from"./curve-CYvlzlZm.js";import{r as F}from"./index-Bc2G9s8g.js";import{N as B}from"./surface-BKt_FIQR.js";import{N}from"./NurbsSurface-DrPwcZPL.js";import{N as k}from"./NurbsCurve-CQjwMhxT.js";import{g as X,p as _e,a as Ke,b as Le,c as Ee,s as K}from"./nurbs-DVTS2-kg.js";import{i as Oe}from"./materials-D2_MRo5E.js";import{L as R}from"./Line-BLcUCERj.js";function Ie(e,n,r=2){const o=n&&n.length,t=o?n[0]*r:e.length;let i=De(e,0,t,r,!0);const s=[];if(!i||i.next===i.prev)return s;let l,a,u;if(o&&(i=Ye(e,n,i,r)),e.length>80*r){l=e[0],a=e[1];let d=l,x=a;for(let v=r;v<t;v+=r){const f=e[v],m=e[v+1];f<l&&(l=f),m<a&&(a=m),f>d&&(d=f),m>x&&(x=m)}u=Math.max(d-l,x-a),u=u!==0?32767/u:0}return L(i,s,r,l,a,u,0),s}function De(e,n,r,o,t){let i;if(t===sr(e,n,r,o)>0)for(let s=n;s<r;s+=o)i=ce(s/o|0,e[s],e[s+1],i);else for(let s=r-o;s>=n;s-=o)i=ce(s/o|0,e[s],e[s+1],i);return i&&U(i,i.next)&&(O(i),i=i.next),i}function W(e,n){if(!e)return e;n||(n=e);let r=e,o;do if(o=!1,!r.steiner&&(U(r,r.next)||b(r.prev,r,r.next)===0)){if(O(r),r=n=r.prev,r===r.next)break;o=!0}else r=r.next;while(o||r!==n);return n}function L(e,n,r,o,t,i,s){if(!e)return;!s&&i&&Qe(e,o,t,i);let l=e;for(;e.prev!==e.next;){const a=e.prev,u=e.next;if(i?Be(e,o,t,i):He(e)){n.push(a.i,e.i,u.i),O(e),e=u.next,l=u.next;continue}if(e=u,e===l){s?s===1?(e=ze(W(e),n),L(e,n,r,o,t,i,2)):s===2&&Xe(e,n,r,o,t,i):L(W(e),n,r,o,t,i,1);break}}}function He(e){const n=e.prev,r=e,o=e.next;if(b(n,r,o)>=0)return!1;const t=n.x,i=r.x,s=o.x,l=n.y,a=r.y,u=o.y,d=Math.min(t,i,s),x=Math.min(l,a,u),v=Math.max(t,i,s),f=Math.max(l,a,u);let m=o.next;for(;m!==n;){if(m.x>=d&&m.x<=v&&m.y>=x&&m.y<=f&&_(t,l,i,a,s,u,m.x,m.y)&&b(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Be(e,n,r,o){const t=e.prev,i=e,s=e.next;if(b(t,i,s)>=0)return!1;const l=t.x,a=i.x,u=s.x,d=t.y,x=i.y,v=s.y,f=Math.min(l,a,u),m=Math.min(d,x,v),g=Math.max(l,a,u),p=Math.max(d,x,v),C=ne(f,m,n,r,o),D=ne(g,p,n,r,o);let h=e.prevZ,y=e.nextZ;for(;h&&h.z>=C&&y&&y.z<=D;){if(h.x>=f&&h.x<=g&&h.y>=m&&h.y<=p&&h!==t&&h!==s&&_(l,d,a,x,u,v,h.x,h.y)&&b(h.prev,h,h.next)>=0||(h=h.prevZ,y.x>=f&&y.x<=g&&y.y>=m&&y.y<=p&&y!==t&&y!==s&&_(l,d,a,x,u,v,y.x,y.y)&&b(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;h&&h.z>=C;){if(h.x>=f&&h.x<=g&&h.y>=m&&h.y<=p&&h!==t&&h!==s&&_(l,d,a,x,u,v,h.x,h.y)&&b(h.prev,h,h.next)>=0)return!1;h=h.prevZ}for(;y&&y.z<=D;){if(y.x>=f&&y.x<=g&&y.y>=m&&y.y<=p&&y!==t&&y!==s&&_(l,d,a,x,u,v,y.x,y.y)&&b(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function ze(e,n){let r=e;do{const o=r.prev,t=r.next.next;!U(o,t)&&je(o,r,r.next,t)&&E(o,t)&&E(t,o)&&(n.push(o.i,r.i,t.i),O(r),O(r.next),r=e=t),r=r.next}while(r!==e);return W(r)}function Xe(e,n,r,o,t,i){let s=e;do{let l=s.next.next;for(;l!==s.prev;){if(s.i!==l.i&&nr(s,l)){let a=Se(s,l);s=W(s,s.next),a=W(a,a.next),L(s,n,r,o,t,i,0),L(a,n,r,o,t,i,0);return}l=l.next}s=s.next}while(s!==e)}function Ye(e,n,r,o){const t=[];for(let i=0,s=n.length;i<s;i++){const l=n[i]*o,a=i<s-1?n[i+1]*o:e.length,u=De(e,l,a,o,!1);u===u.next&&(u.steiner=!0),t.push(rr(u))}t.sort(Ge);for(let i=0;i<t.length;i++)r=$e(t[i],r);return r}function Ge(e,n){let r=e.x-n.x;if(r===0&&(r=e.y-n.y,r===0)){const o=(e.next.y-e.y)/(e.next.x-e.x),t=(n.next.y-n.y)/(n.next.x-n.x);r=o-t}return r}function $e(e,n){const r=qe(e,n);if(!r)return n;const o=Se(r,e);return W(o,o.next),W(r,r.next)}function qe(e,n){let r=n;const o=e.x,t=e.y;let i=-1/0,s;if(U(e,r))return r;do{if(U(e,r.next))return r.next;if(t<=r.y&&t>=r.next.y&&r.next.y!==r.y){const x=r.x+(t-r.y)*(r.next.x-r.x)/(r.next.y-r.y);if(x<=o&&x>i&&(i=x,s=r.x<r.next.x?r:r.next,x===o))return s}r=r.next}while(r!==n);if(!s)return null;const l=s,a=s.x,u=s.y;let d=1/0;r=s;do{if(o>=r.x&&r.x>=a&&o!==r.x&&Ne(t<u?o:i,t,a,u,t<u?i:o,t,r.x,r.y)){const x=Math.abs(t-r.y)/(o-r.x);E(r,e)&&(x<d||x===d&&(r.x>s.x||r.x===s.x&&Je(s,r)))&&(s=r,d=x)}r=r.next}while(r!==l);return s}function Je(e,n){return b(e.prev,e,n.prev)<0&&b(n.next,e,e.next)<0}function Qe(e,n,r,o){let t=e;do t.z===0&&(t.z=ne(t.x,t.y,n,r,o)),t.prevZ=t.prev,t.nextZ=t.next,t=t.next;while(t!==e);t.prevZ.nextZ=null,t.prevZ=null,er(t)}function er(e){let n,r=1;do{let o=e,t;e=null;let i=null;for(n=0;o;){n++;let s=o,l=0;for(let u=0;u<r&&(l++,s=s.nextZ,!!s);u++);let a=r;for(;l>0||a>0&&s;)l!==0&&(a===0||!s||o.z<=s.z)?(t=o,o=o.nextZ,l--):(t=s,s=s.nextZ,a--),i?i.nextZ=t:e=t,t.prevZ=i,i=t;o=s}i.nextZ=null,r*=2}while(n>1);return e}function ne(e,n,r,o,t){return e=(e-r)*t|0,n=(n-o)*t|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,n=(n|n<<8)&16711935,n=(n|n<<4)&252645135,n=(n|n<<2)&858993459,n=(n|n<<1)&1431655765,e|n<<1}function rr(e){let n=e,r=e;do(n.x<r.x||n.x===r.x&&n.y<r.y)&&(r=n),n=n.next;while(n!==e);return r}function Ne(e,n,r,o,t,i,s,l){return(t-s)*(n-l)>=(e-s)*(i-l)&&(e-s)*(o-l)>=(r-s)*(n-l)&&(r-s)*(i-l)>=(t-s)*(o-l)}function _(e,n,r,o,t,i,s,l){return!(e===s&&n===l)&&Ne(e,n,r,o,t,i,s,l)}function nr(e,n){return e.next.i!==n.i&&e.prev.i!==n.i&&!tr(e,n)&&(E(e,n)&&E(n,e)&&or(e,n)&&(b(e.prev,e,n.prev)||b(e,n.prev,n))||U(e,n)&&b(e.prev,e,e.next)>0&&b(n.prev,n,n.next)>0)}function b(e,n,r){return(n.y-e.y)*(r.x-n.x)-(n.x-e.x)*(r.y-n.y)}function U(e,n){return e.x===n.x&&e.y===n.y}function je(e,n,r,o){const t=G(b(e,n,r)),i=G(b(e,n,o)),s=G(b(r,o,e)),l=G(b(r,o,n));return!!(t!==i&&s!==l||t===0&&Y(e,r,n)||i===0&&Y(e,o,n)||s===0&&Y(r,e,o)||l===0&&Y(r,n,o))}function Y(e,n,r){return n.x<=Math.max(e.x,r.x)&&n.x>=Math.min(e.x,r.x)&&n.y<=Math.max(e.y,r.y)&&n.y>=Math.min(e.y,r.y)}function G(e){return e>0?1:e<0?-1:0}function tr(e,n){let r=e;do{if(r.i!==e.i&&r.next.i!==e.i&&r.i!==n.i&&r.next.i!==n.i&&je(r,r.next,e,n))return!0;r=r.next}while(r!==e);return!1}function E(e,n){return b(e.prev,e,e.next)<0?b(e,n,e.next)>=0&&b(e,e.prev,n)>=0:b(e,n,e.prev)<0||b(e,e.next,n)<0}function or(e,n){let r=e,o=!1;const t=(e.x+n.x)/2,i=(e.y+n.y)/2;do r.y>i!=r.next.y>i&&r.next.y!==r.y&&t<(r.next.x-r.x)*(i-r.y)/(r.next.y-r.y)+r.x&&(o=!o),r=r.next;while(r!==e);return o}function Se(e,n){const r=te(e.i,e.x,e.y),o=te(n.i,n.x,n.y),t=e.next,i=n.prev;return e.next=n,n.prev=e,r.next=t,t.prev=r,o.next=r,r.prev=o,i.next=o,o.prev=i,o}function ce(e,n,r,o){const t=te(e,n,r);return o?(t.next=o.next,t.prev=o,o.next.prev=t,o.next=t):(t.prev=t,t.next=t),t}function O(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function te(e,n,r){return{i:e,x:n,y:r,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function sr(e,n,r,o){let t=0;for(let i=n,s=r-o;i<r;i+=o)t+=(e[s]-e[i])*(e[i+1]+e[s+1]),s=i;return t}function Z({color:e="#ffffff",trimCurveResolution:n=200,adaptiveMaxAngleDeg:r=5,adaptiveMaxDepth:o=10,wireframe:t=!1,world:i=!1,children:s,...l}){const{surfaceChild:a,curveChildren:u,materialChild:d}=F.useMemo(()=>{const f=F.Children.toArray(s);let m=null;const g=[];let p=null;for(const C of f)F.isValidElement(C)&&(C.type===N||C.type==="NurbsSurface"?m=C:C.type===k||C.type==="NurbsCurve"?g.push(C):Oe(C)&&(p=C));return{surfaceChild:m,curveChildren:g,materialChild:p}},[s]),x=F.useRef(null),v=F.useMemo(()=>{if(!a||u.length===0)return a||console.warn("TrimmedSurface requires a NurbsSurface child"),u.length===0&&console.warn("TrimmedSurface requires at least one NurbsCurve"),null;try{const f=a.props,m=X(f.controlPoints.length,f.degreeU),g=X(f.controlPoints[0].length,f.degreeV),p=B.byKnotsControlPointsWeights(f.degreeU,f.degreeV,m,g,f.controlPoints,f.weights),D=u.map(w=>{const P=w.props,V=P.knots??X(P.points.length,P.degree??2),j=S.byKnotsControlPointsWeights(P.degree??2,V,P.points,P.weights??Array(P.points.length).fill(1));if(i){const z=_e(p,j,n);if(z.length>1){const Ve=X(z.length,P.degree??2);return S.byKnotsControlPointsWeights(P.degree??2,Ve,z.map(([ke,We])=>[ke,We,0]),Array(z.length).fill(1))}return null}return j}).filter(w=>w!==null).map(w=>Ke(w,r,o)),h=[],y=[];let se=0;D.forEach((w,P)=>{P>0&&y.push(se),w.forEach(([V,j])=>{h.push(V,j),se++})});const Te=Ie(h,y,2),ie=[],le=[],ae=[],ue=[];for(let w=0;w<h.length;w+=2)ue.push([h[w],h[w+1]]);for(const[w,P]of ue){const V=Le(p,w,P),j=Ee(p,w,P);ie.push(V.x,V.y,V.z),le.push(j.x,j.y,j.z),ae.push(w,P)}const T=x.current??new Re;return T.setAttribute("position",new re(ie,3)),T.setAttribute("normal",new re(le,3)),T.setAttribute("uv",new re(ae,2)),T.setIndex(Array.from(Te)),T.computeBoundingSphere(),x.current=T,T}catch(f){return console.error("Error creating trimmed surface:",f),null}},[a,u,n,r,o,i]);return!v||!d?(!d&&a&&u.length>0&&console.warn("TrimmedSurface requires a material as a direct child"),null):c.jsx("mesh",{...l,geometry:v,children:d})}Z.__docgenInfo={description:"",methods:[],displayName:"TrimmedSurface",props:{color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ffffff"',computed:!1}},trimCurveResolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"200",computed:!1}},adaptiveMaxAngleDeg:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}},adaptiveMaxDepth:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},world:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"union",raw:"ReactElement | ReactElement[]",elements:[{name:"ReactElement"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const dr={title:"Components/TrimmedSurface",parameters:{layout:"centered"},decorators:[e=>c.jsx("div",{style:{width:"100vw",height:"100vh"},children:c.jsxs(Ue,{camera:{position:[2,2,2],fov:50},children:[c.jsx("ambientLight",{intensity:.5}),c.jsx("pointLight",{position:[10,10,10]}),c.jsx(e,{}),c.jsx(Ze,{})]})})],argTypes:{color:{control:"color",description:"Color of the trimmed surface"},wireframe:{control:"boolean",description:"Whether to show the surface as wireframe"},trimCurveResolution:{control:{type:"range",min:10,max:500,step:10},description:"Number of points to sample along the trimming curve"},adaptiveMaxAngleDeg:{control:{type:"range",min:1,max:45,step:1},description:"Maximum angle between adjacent triangles in degrees"},adaptiveMaxDepth:{control:{type:"range",min:1,max:20,step:1},description:"Maximum recursion depth for adaptive tessellation"},world:{control:"boolean",description:"Whether the trimming curve is in world space or UV space"},scale:{control:{type:"range",min:.1,max:1,step:.1},description:"Scale of the trimming curve"},curveX:{control:{type:"range",min:0,max:2,step:.1},description:"X position of the trimming curve center"},curveY:{control:{type:"range",min:0,max:2,step:.1},description:"Y position of the trimming curve center"}}},M=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],A=[[1,1,1],[1,1,1],[1,1,1]],oe=(e,n=[.5,.5],r=4)=>{const o=[];for(let s=0;s<r;s++){const l=s/r*Math.PI*2,a=n[0]+e*Math.cos(l),u=n[1]+e*Math.sin(l);o.push([a,u])}const t=2,i=Array(r+t+1).fill(0).map((s,l)=>l<t+1?0:l>=r?1:(l-t)/(r-t));return{points:o,knots:i}};function I(e,n,r,o=.01){const t=e.point(n,r),i=1e-4,s=e.point(n+i,r),l=e.point(n,r+i),a=[s[0]-t[0],s[1]-t[1],s[2]-t[2]],u=[l[0]-t[0],l[1]-t[1],l[2]-t[2]],d=[a[1]*u[2]-a[2]*u[1],a[2]*u[0]-a[0]*u[2],a[0]*u[1]-a[1]*u[0]],x=Math.sqrt(d[0]**2+d[1]**2+d[2]**2)||1;return[t[0]+d[0]/x*o,t[1]+d[1]/x*o,t[2]+d[2]/x*o]}const $={args:{color:"#ff0000",wireframe:!1,scale:.35,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#ff0000",wireframe:n=!1,scale:r=.35,trimCurveResolution:o=200,adaptiveMaxAngleDeg:t=5,adaptiveMaxDepth:i=10})=>{const l=oe(.5,[.5,.5],4).points.map(([v,f])=>[(v-.5)*Number(r)+.5,(f-.5)*Number(r)+.5]),a=Array(l.length+3).fill(0).map((v,f)=>f<3?0:f>=l.length?1:(f-2)/(l.length-2)),u=B.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],M,A),d=S.byKnotsControlPointsWeights(2,a,l.map(([v,f])=>[v,f,0]),Array(l.length).fill(1)),x=K(d,o).map(([v,f])=>I(u,v,f));return c.jsxs(c.Fragment,{children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2,wireframe:!0}),c.jsxs(Z,{trimCurveResolution:o,adaptiveMaxAngleDeg:t,adaptiveMaxDepth:i,children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2}),c.jsx(k,{points:l,weights:Array(l.length).fill(1),knots:a,degree:2}),c.jsx("meshPhongMaterial",{color:e,wireframe:n,side:H})]}),c.jsx(R,{points:x,color:"black"})]})}},q={args:{color:"#3366ff",wireframe:!1,scale:.45,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#3366ff",wireframe:n=!1,scale:r=.45,trimCurveResolution:o=200,adaptiveMaxAngleDeg:t=5,adaptiveMaxDepth:i=10})=>{const l=Array.from({length:6},(f,m)=>{const g=m/6*Math.PI*2;return[.5+Number(r)*.5*Math.cos(g),.5+Number(r)*.25*Math.sin(g)]}),a=2,u=Array(6+a+1).fill(0).map((f,m)=>m<a+1?0:m>=6?1:(m-a)/(6-a)),d=B.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],M,A),x=S.byKnotsControlPointsWeights(a,u,l.map(([f,m])=>[f,m,0]),Array(l.length).fill(1)),v=K(x,o).map(([f,m])=>I(d,f,m));return c.jsxs(c.Fragment,{children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2,wireframe:!0}),c.jsxs(Z,{trimCurveResolution:o,adaptiveMaxAngleDeg:t,adaptiveMaxDepth:i,children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2}),c.jsx(k,{points:l,weights:Array(l.length).fill(1),knots:u,degree:2}),c.jsx("meshPhongMaterial",{color:e,wireframe:n,side:H})]}),c.jsx(R,{points:v,color:"black"})]})}},J={args:{color:"#33cc33",wireframe:!1,scale:.45,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#33cc33",wireframe:n=!1,scale:r=.45,trimCurveResolution:o=200,adaptiveMaxAngleDeg:t=5,adaptiveMaxDepth:i=10})=>{const s=oe(.5,[.5,.5],6).points,l=oe(.5,[.5,.5],6).points,a=s.map(([g,p])=>[(g-.5)*Number(r)+.5,(p-.5)*Number(r)+.5]),u=l.map(([g,p])=>[(g-.5)*(Number(r)*.33)+.5,(p-.5)*(Number(r)*.33)+.5]),d=B.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],M,A),x=S.byKnotsControlPointsWeights(2,Array(a.length+3).fill(0).map((g,p)=>p<3?0:p>=a.length?1:(p-2)/(a.length-2)),a.map(([g,p])=>[g,p,0]),Array(a.length).fill(1)),v=S.byKnotsControlPointsWeights(2,Array(u.length+3).fill(0).map((g,p)=>p<3?0:p>=u.length?1:(p-2)/(u.length-2)),u.map(([g,p])=>[g,p,0]),Array(u.length).fill(1)),f=K(x,o).map(([g,p])=>I(d,g,p)),m=K(v,o).map(([g,p])=>I(d,g,p));return c.jsxs(c.Fragment,{children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2,wireframe:!0}),c.jsxs(Z,{trimCurveResolution:o,adaptiveMaxAngleDeg:t,adaptiveMaxDepth:i,children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2}),c.jsx(k,{points:a,weights:Array(a.length).fill(1),knots:Array(a.length+3).fill(0).map((g,p)=>p<3?0:p>=a.length?1:(p-2)/(a.length-2)),degree:2}),c.jsx(k,{points:u,weights:Array(u.length).fill(1),knots:Array(u.length+3).fill(0).map((g,p)=>p<3?0:p>=u.length?1:(p-2)/(u.length-2)),degree:2}),c.jsx("meshPhongMaterial",{color:e,wireframe:n,side:H})]}),c.jsx(R,{points:f,color:"black"}),c.jsx(R,{points:m,color:"black"})]})}},Q={args:{color:"#ffaa00",wireframe:!1,scale:.4,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#ffaa00",wireframe:n=!1,scale:r=.4,trimCurveResolution:o=200,adaptiveMaxAngleDeg:t=5,adaptiveMaxDepth:i=10})=>{const l=[.5,.5],a=Array.from({length:6},(m,g)=>{const p=g/6*Math.PI*2;return[l[0]+Number(r)*.5*Math.cos(p),l[1]+Number(r)*.5*Math.sin(p)]});a.push(a[0]);const u=2,d=Array(a.length+u+1).fill(0).map((m,g)=>g<u+1?0:g>=a.length?1:(g-u)/(a.length-u)),x=B.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],M,A),v=S.byKnotsControlPointsWeights(u,d,a.map(([m,g])=>[m,g,0]),Array(a.length).fill(1)),f=K(v,o).map(([m,g])=>I(x,m,g));return c.jsxs(c.Fragment,{children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2,wireframe:!0}),c.jsxs(Z,{trimCurveResolution:o,adaptiveMaxAngleDeg:t,adaptiveMaxDepth:i,children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2}),c.jsx(k,{points:a,weights:Array(a.length).fill(1),knots:d,degree:2}),c.jsx("meshPhongMaterial",{color:e,wireframe:n,side:H})]}),c.jsx(R,{points:f,color:"black"})]})}};function ir({color:e="#ff00ff",wireframe:n=!1,trimCurveResolution:r=200,adaptiveMaxAngleDeg:o=5,adaptiveMaxDepth:t=10,world:i=!0,curveX:s=1,curveY:l=1,scale:a=.4}){const u=[s,l,.5],d=6,x=.3*a,v=Array.from({length:d},(C,D)=>{const h=D/d*Math.PI*2;return[u[0]+x*Math.cos(h),u[1]+x*Math.sin(h),u[2]]});v.push(v[0]);const f=2,m=Array(v.length+f+1).fill(0).map((C,D)=>D<f+1?0:D>=v.length?1:(D-f)/(v.length-f)),g=S.byKnotsControlPointsWeights(f,m,v,Array(v.length).fill(1)),p=Array.from({length:r+1},(C,D)=>{const h=D/r,y=g.point(h);return[y[0],y[1],y[2]]});return c.jsxs(c.Fragment,{children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2,wireframe:!0}),c.jsxs(Z,{trimCurveResolution:r,adaptiveMaxAngleDeg:o,adaptiveMaxDepth:t,world:i,children:[c.jsx(N,{controlPoints:M,weights:A,degreeU:2,degreeV:2}),c.jsx(k,{points:v,weights:Array(v.length).fill(1),knots:m,degree:2}),c.jsx("meshPhongMaterial",{color:e,wireframe:n,side:H})]}),i&&c.jsxs(c.Fragment,{children:[c.jsx(R,{points:p,color:"black"}),c.jsxs("mesh",{position:new Fe(...u),children:[c.jsx("sphereGeometry",{args:[.05,16,16]}),c.jsx("meshBasicMaterial",{color:"red"})]})]})]})}const ee={args:{color:"#ff00ff",wireframe:!1,scale:.4,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10,world:!0,curveX:1,curveY:1},render:e=>c.jsx(ir,{...e}),parameters:{docs:{description:{story:"A trimmed surface with a circular trimming curve in world space, controlled by X and Y sliders."}}}};var fe,me,pe;$.parameters={...$.parameters,docs:{...(fe=$.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    color: "#ff0000",
    wireframe: false,
    scale: 0.35,
    trimCurveResolution: 200,
    adaptiveMaxAngleDeg: 5,
    adaptiveMaxDepth: 10
  },
  render: ({
    color = "#ff0000",
    wireframe = false,
    scale = 0.35,
    trimCurveResolution = 200,
    adaptiveMaxAngleDeg = 5,
    adaptiveMaxDepth = 10
  }: Record<string, any>) => {
    const basePoints = createCircularCurveUV(0.5, [0.5, 0.5], 4).points;
    const trim: [number, number][] = basePoints.map(([u, v]) => [(u - 0.5) * Number(scale) + 0.5, (v - 0.5) * Number(scale) + 0.5]);
    const knots = Array(trim.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= trim.length) return 1;
      return (i - 2) / (trim.length - 2);
    });
    const surface = NurbsSurfaceCore.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const nurbsTrim = NurbsCurveCore.byKnotsControlPointsWeights(2, knots, trim.map(([u, v]) => [u, v, 0]), Array(trim.length).fill(1));
    const trimLine = sampleNurbsCurve2D(nurbsTrim, trimCurveResolution).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface trimCurveResolution={trimCurveResolution} adaptiveMaxAngleDeg={adaptiveMaxAngleDeg} adaptiveMaxDepth={adaptiveMaxDepth}>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={trim} weights={Array(trim.length).fill(1)} knots={knots} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={trimLine} color="black" />
      </>;
  }
}`,...(pe=(me=$.parameters)==null?void 0:me.docs)==null?void 0:pe.source}}};var ge,he,de;q.parameters={...q.parameters,docs:{...(ge=q.parameters)==null?void 0:ge.docs,source:{originalSource:`{
  args: {
    color: "#3366ff",
    wireframe: false,
    scale: 0.45,
    trimCurveResolution: 200,
    adaptiveMaxAngleDeg: 5,
    adaptiveMaxDepth: 10
  },
  render: ({
    color = "#3366ff",
    wireframe = false,
    scale = 0.45,
    trimCurveResolution = 200,
    adaptiveMaxAngleDeg = 5,
    adaptiveMaxDepth = 10
  }: Record<string, any>) => {
    const numPoints = 6;
    const points: [number, number][] = Array.from({
      length: numPoints
    }, (_, i) => {
      const angle = i / numPoints * Math.PI * 2;
      return [0.5 + Number(scale) * 0.5 * Math.cos(angle), 0.5 + Number(scale) * 0.25 * Math.sin(angle)] as [number, number];
    });
    const degree = 2;
    const knots = Array(numPoints + degree + 1).fill(0).map((_, i) => i < degree + 1 ? 0 : i >= numPoints ? 1 : (i - degree) / (numPoints - degree));
    const surface = NurbsSurfaceCore.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const curve = NurbsCurveCore.byKnotsControlPointsWeights(degree, knots, points.map(([u, v]) => [u, v, 0]), Array(points.length).fill(1));
    const linePts = sampleNurbsCurve2D(curve, trimCurveResolution).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface trimCurveResolution={trimCurveResolution} adaptiveMaxAngleDeg={adaptiveMaxAngleDeg} adaptiveMaxDepth={adaptiveMaxDepth}>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={points} weights={Array(points.length).fill(1)} knots={knots} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={linePts} color="black" />
      </>;
  }
}`,...(de=(he=q.parameters)==null?void 0:he.docs)==null?void 0:de.source}}};var xe,ve,ye;J.parameters={...J.parameters,docs:{...(xe=J.parameters)==null?void 0:xe.docs,source:{originalSource:`{
  args: {
    color: "#33cc33",
    wireframe: false,
    scale: 0.45,
    trimCurveResolution: 200,
    adaptiveMaxAngleDeg: 5,
    adaptiveMaxDepth: 10
  },
  render: ({
    color = "#33cc33",
    wireframe = false,
    scale = 0.45,
    trimCurveResolution = 200,
    adaptiveMaxAngleDeg = 5,
    adaptiveMaxDepth = 10
  }: Record<string, any>) => {
    const baseOuter = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const baseHole = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const outer: [number, number][] = baseOuter.map(([u, v]) => [(u - 0.5) * Number(scale) + 0.5, (v - 0.5) * Number(scale) + 0.5]);
    const hole: [number, number][] = baseHole.map(([u, v]) => [(u - 0.5) * (Number(scale) * 0.33) + 0.5, (v - 0.5) * (Number(scale) * 0.33) + 0.5]);
    const surface = NurbsSurfaceCore.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const outerCurve = NurbsCurveCore.byKnotsControlPointsWeights(2, Array(outer.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= outer.length) return 1;
      return (i - 2) / (outer.length - 2);
    }), outer.map(([u, v]) => [u, v, 0]), Array(outer.length).fill(1));
    const holeCurve = NurbsCurveCore.byKnotsControlPointsWeights(2, Array(hole.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= hole.length) return 1;
      return (i - 2) / (hole.length - 2);
    }), hole.map(([u, v]) => [u, v, 0]), Array(hole.length).fill(1));
    const outer3D = sampleNurbsCurve2D(outerCurve, trimCurveResolution).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    const hole3D = sampleNurbsCurve2D(holeCurve, trimCurveResolution).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface trimCurveResolution={trimCurveResolution} adaptiveMaxAngleDeg={adaptiveMaxAngleDeg} adaptiveMaxDepth={adaptiveMaxDepth}>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={outer} weights={Array(outer.length).fill(1)} knots={Array(outer.length + 3).fill(0).map((_, i) => {
          if (i < 3) return 0;
          if (i >= outer.length) return 1;
          return (i - 2) / (outer.length - 2);
        })} degree={2} />
          <NurbsCurve points={hole} weights={Array(hole.length).fill(1)} knots={Array(hole.length + 3).fill(0).map((_, i) => {
          if (i < 3) return 0;
          if (i >= hole.length) return 1;
          return (i - 2) / (hole.length - 2);
        })} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={outer3D} color="black" />
        <Line points={hole3D} color="black" />
      </>;
  }
}`,...(ye=(ve=J.parameters)==null?void 0:ve.docs)==null?void 0:ye.source}}};var be,Ce,we;Q.parameters={...Q.parameters,docs:{...(be=Q.parameters)==null?void 0:be.docs,source:{originalSource:`{
  args: {
    color: "#ffaa00",
    wireframe: false,
    scale: 0.4,
    trimCurveResolution: 200,
    adaptiveMaxAngleDeg: 5,
    adaptiveMaxDepth: 10
  },
  render: ({
    color = "#ffaa00",
    wireframe = false,
    scale = 0.4,
    trimCurveResolution = 200,
    adaptiveMaxAngleDeg = 5,
    adaptiveMaxDepth = 10
  }: Record<string, any>) => {
    const numPoints = 6;
    const center: [number, number] = [0.5, 0.5];
    const closedPoints: [number, number][] = Array.from({
      length: numPoints
    }, (_, i) => {
      const angle = i / numPoints * Math.PI * 2;
      return [center[0] + Number(scale) * 0.5 * Math.cos(angle), center[1] + Number(scale) * 0.5 * Math.sin(angle)] as [number, number];
    });
    closedPoints.push(closedPoints[0]); // Ensure closure

    const degree = 2;
    const knots = Array(closedPoints.length + degree + 1).fill(0).map((_, i) => {
      if (i < degree + 1) return 0;
      if (i >= closedPoints.length) return 1;
      return (i - degree) / (closedPoints.length - degree);
    });
    const surface = NurbsSurfaceCore.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const closedCurve = NurbsCurveCore.byKnotsControlPointsWeights(degree, knots, closedPoints.map(([u, v]) => [u, v, 0]), Array(closedPoints.length).fill(1));
    const trimLine = sampleNurbsCurve2D(closedCurve, trimCurveResolution).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface trimCurveResolution={trimCurveResolution} adaptiveMaxAngleDeg={adaptiveMaxAngleDeg} adaptiveMaxDepth={adaptiveMaxDepth}>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={closedPoints} weights={Array(closedPoints.length).fill(1)} knots={knots} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={trimLine} color="black" />
      </>;
  }
}`,...(we=(Ce=Q.parameters)==null?void 0:Ce.docs)==null?void 0:we.source}}};var Pe,Me,Ae;ee.parameters={...ee.parameters,docs:{...(Pe=ee.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
  args: {
    color: "#ff00ff",
    wireframe: false,
    scale: 0.4,
    trimCurveResolution: 200,
    adaptiveMaxAngleDeg: 5,
    adaptiveMaxDepth: 10,
    world: true,
    curveX: 1.0,
    curveY: 1.0
  },
  render: (args: Record<string, any>) => <WorldSpaceTrimmedSurfaceDemo {...args} />,
  parameters: {
    docs: {
      description: {
        story: "A trimmed surface with a circular trimming curve in world space, controlled by X and Y sliders."
      }
    }
  }
}`,...(Ae=(Me=ee.parameters)==null?void 0:Me.docs)==null?void 0:Ae.source}}};const xr=["TrimmedBulgedSurface","TrimmedFlatEllipticalSurface","TrimmedSurfaceWithHole","TrimmedSurfaceClosedLoop","WorldSpaceTrimmedSurface"];export{$ as TrimmedBulgedSurface,q as TrimmedFlatEllipticalSurface,Q as TrimmedSurfaceClosedLoop,J as TrimmedSurfaceWithHole,ee as WorldSpaceTrimmedSurface,xr as __namedExportsOrder,dr as default};
