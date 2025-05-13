import{j as h}from"./jsx-runtime-DiklIkkE.js";import{V,u as we,v as S,B as Pe,F as Y,C as Ce,O as Se,D as X}from"./verb.es-vEISxjAU.js";import{r as A}from"./index-DRjF_FHU.js";import{N}from"./NurbsSurface-CTCV2Ahz.js";import{N as M,L as E}from"./NurbsCurve-B3syIbAM.js";function Ne(e,r,n=2){const i=r&&r.length,t=i?r[0]*n:e.length;let s=de(e,0,t,n,!0);const o=[];if(!s||s.next===s.prev)return o;let l,c,a;if(i&&(s=Te(e,r,s,n)),e.length>80*n){l=1/0,c=1/0;let f=-1/0,u=-1/0;for(let m=n;m<t;m+=n){const g=e[m],d=e[m+1];g<l&&(l=g),d<c&&(c=d),g>f&&(f=g),d>u&&(u=d)}a=Math.max(f-l,u-c),a=a!==0?32767/a:0}return K(s,o,n,l,c,a,0),o}function de(e,r,n,i,t){let s;if(t===Ie(e,r,n,i)>0)for(let o=r;o<n;o+=i)s=oe(o/i|0,e[o],e[o+1],s);else for(let o=n-i;o>=r;o-=i)s=oe(o/i|0,e[o],e[o+1],s);return s&&U(s,s.next)&&(O(s),s=s.next),s}function T(e,r){if(!e)return e;r||(r=e);let n=e,i;do if(i=!1,!n.steiner&&(U(n,n.next)||v(n.prev,n,n.next)===0)){if(O(n),n=r=n.prev,n===n.next)break;i=!0}else n=n.next;while(i||n!==r);return r}function K(e,r,n,i,t,s,o){if(!e)return;!o&&s&&Fe(e,i,t,s);let l=e;for(;e.prev!==e.next;){const c=e.prev,a=e.next;if(s?je(e,i,t,s):Ae(e)){r.push(c.i,e.i,a.i),O(e),e=a.next,l=a.next;continue}if(e=a,e===l){o?o===1?(e=Ve(T(e),r),K(e,r,n,i,t,s,2)):o===2&&Me(e,r,n,i,t,s):K(T(e),r,n,i,t,s,1);break}}}function Ae(e){const r=e.prev,n=e,i=e.next;if(v(r,n,i)>=0)return!1;const t=r.x,s=n.x,o=i.x,l=r.y,c=n.y,a=i.y,f=Math.min(t,s,o),u=Math.min(l,c,a),m=Math.max(t,s,o),g=Math.max(l,c,a);let d=i.next;for(;d!==r;){if(d.x>=f&&d.x<=m&&d.y>=u&&d.y<=g&&L(t,l,s,c,o,a,d.x,d.y)&&v(d.prev,d,d.next)>=0)return!1;d=d.next}return!0}function je(e,r,n,i){const t=e.prev,s=e,o=e.next;if(v(t,s,o)>=0)return!1;const l=t.x,c=s.x,a=o.x,f=t.y,u=s.y,m=o.y,g=Math.min(l,c,a),d=Math.min(f,u,m),C=Math.max(l,c,a),j=Math.max(f,u,m),F=q(g,d,r,n,i),z=q(C,j,r,n,i);let x=e.prevZ,p=e.nextZ;for(;x&&x.z>=F&&p&&p.z<=z;){if(x.x>=g&&x.x<=C&&x.y>=d&&x.y<=j&&x!==t&&x!==o&&L(l,f,c,u,a,m,x.x,x.y)&&v(x.prev,x,x.next)>=0||(x=x.prevZ,p.x>=g&&p.x<=C&&p.y>=d&&p.y<=j&&p!==t&&p!==o&&L(l,f,c,u,a,m,p.x,p.y)&&v(p.prev,p,p.next)>=0))return!1;p=p.nextZ}for(;x&&x.z>=F;){if(x.x>=g&&x.x<=C&&x.y>=d&&x.y<=j&&x!==t&&x!==o&&L(l,f,c,u,a,m,x.x,x.y)&&v(x.prev,x,x.next)>=0)return!1;x=x.prevZ}for(;p&&p.z<=z;){if(p.x>=g&&p.x<=C&&p.y>=d&&p.y<=j&&p!==t&&p!==o&&L(l,f,c,u,a,m,p.x,p.y)&&v(p.prev,p,p.next)>=0)return!1;p=p.nextZ}return!0}function Ve(e,r){let n=e;do{const i=n.prev,t=n.next.next;!U(i,t)&&ve(i,n,n.next,t)&&I(i,t)&&I(t,i)&&(r.push(i.i,n.i,t.i),O(n),O(n.next),n=e=t),n=n.next}while(n!==e);return T(n)}function Me(e,r,n,i,t,s){let o=e;do{let l=o.next.next;for(;l!==o.prev;){if(o.i!==l.i&&Le(o,l)){let c=be(o,l);o=T(o,o.next),c=T(c,c.next),K(o,r,n,i,t,s,0),K(c,r,n,i,t,s,0);return}l=l.next}o=o.next}while(o!==e)}function Te(e,r,n,i){const t=[];for(let s=0,o=r.length;s<o;s++){const l=r[s]*i,c=s<o-1?r[s+1]*i:e.length,a=de(e,l,c,i,!1);a===a.next&&(a.steiner=!0),t.push(De(a))}t.sort(ke);for(let s=0;s<t.length;s++)n=Ue(t[s],n);return n}function ke(e,r){let n=e.x-r.x;if(n===0&&(n=e.y-r.y,n===0)){const i=(e.next.y-e.y)/(e.next.x-e.x),t=(r.next.y-r.y)/(r.next.x-r.x);n=i-t}return n}function Ue(e,r){const n=Ze(e,r);if(!n)return r;const i=be(n,e);return T(i,i.next),T(n,n.next)}function Ze(e,r){let n=r;const i=e.x,t=e.y;let s=-1/0,o;if(U(e,n))return n;do{if(U(e,n.next))return n.next;if(t<=n.y&&t>=n.next.y&&n.next.y!==n.y){const u=n.x+(t-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(u<=i&&u>s&&(s=u,o=n.x<n.next.x?n:n.next,u===i))return o}n=n.next}while(n!==r);if(!o)return null;const l=o,c=o.x,a=o.y;let f=1/0;n=o;do{if(i>=n.x&&n.x>=c&&i!==n.x&&ye(t<a?i:s,t,c,a,t<a?s:i,t,n.x,n.y)){const u=Math.abs(t-n.y)/(i-n.x);I(n,e)&&(u<f||u===f&&(n.x>o.x||n.x===o.x&&We(o,n)))&&(o=n,f=u)}n=n.next}while(n!==l);return o}function We(e,r){return v(e.prev,e,r.prev)<0&&v(r.next,e,e.next)<0}function Fe(e,r,n,i){let t=e;do t.z===0&&(t.z=q(t.x,t.y,r,n,i)),t.prevZ=t.prev,t.nextZ=t.next,t=t.next;while(t!==e);t.prevZ.nextZ=null,t.prevZ=null,_e(t)}function _e(e){let r,n=1;do{let i=e,t;e=null;let s=null;for(r=0;i;){r++;let o=i,l=0;for(let a=0;a<n&&(l++,o=o.nextZ,!!o);a++);let c=n;for(;l>0||c>0&&o;)l!==0&&(c===0||!o||i.z<=o.z)?(t=i,i=i.nextZ,l--):(t=o,o=o.nextZ,c--),s?s.nextZ=t:e=t,t.prevZ=s,s=t;i=o}s.nextZ=null,n*=2}while(r>1);return e}function q(e,r,n,i,t){return e=(e-n)*t|0,r=(r-i)*t|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,e|r<<1}function De(e){let r=e,n=e;do(r.x<n.x||r.x===n.x&&r.y<n.y)&&(n=r),r=r.next;while(r!==e);return n}function ye(e,r,n,i,t,s,o,l){return(t-o)*(r-l)>=(e-o)*(s-l)&&(e-o)*(i-l)>=(n-o)*(r-l)&&(n-o)*(s-l)>=(t-o)*(i-l)}function L(e,r,n,i,t,s,o,l){return!(e===o&&r===l)&&ye(e,r,n,i,t,s,o,l)}function Le(e,r){return e.next.i!==r.i&&e.prev.i!==r.i&&!Ee(e,r)&&(I(e,r)&&I(r,e)&&Ke(e,r)&&(v(e.prev,e,r.prev)||v(e,r.prev,r))||U(e,r)&&v(e.prev,e,e.next)>0&&v(r.prev,r,r.next)>0)}function v(e,r,n){return(r.y-e.y)*(n.x-r.x)-(r.x-e.x)*(n.y-r.y)}function U(e,r){return e.x===r.x&&e.y===r.y}function ve(e,r,n,i){const t=B(v(e,r,n)),s=B(v(e,r,i)),o=B(v(n,i,e)),l=B(v(n,i,r));return!!(t!==s&&o!==l||t===0&&R(e,n,r)||s===0&&R(e,i,r)||o===0&&R(n,e,i)||l===0&&R(n,r,i))}function R(e,r,n){return r.x<=Math.max(e.x,n.x)&&r.x>=Math.min(e.x,n.x)&&r.y<=Math.max(e.y,n.y)&&r.y>=Math.min(e.y,n.y)}function B(e){return e>0?1:e<0?-1:0}function Ee(e,r){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==r.i&&n.next.i!==r.i&&ve(n,n.next,e,r))return!0;n=n.next}while(n!==e);return!1}function I(e,r){return v(e.prev,e,e.next)<0?v(e,r,e.next)>=0&&v(e,e.prev,r)>=0:v(e,r,e.prev)<0||v(e,e.next,r)<0}function Ke(e,r){let n=e,i=!1;const t=(e.x+r.x)/2,s=(e.y+r.y)/2;do n.y>s!=n.next.y>s&&n.next.y!==n.y&&t<(n.next.x-n.x)*(s-n.y)/(n.next.y-n.y)+n.x&&(i=!i),n=n.next;while(n!==e);return i}function be(e,r){const n=ee(e.i,e.x,e.y),i=ee(r.i,r.x,r.y),t=e.next,s=r.prev;return e.next=r,r.prev=e,n.next=t,t.prev=n,i.next=n,n.prev=i,s.next=i,i.prev=s,i}function oe(e,r,n,i){const t=ee(e,r,n);return i?(t.next=i.next,t.prev=i,i.next.prev=t,i.next=t):(t.prev=t,t.next=t),t}function O(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function ee(e,r,n){return{i:e,x:r,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Ie(e,r,n,i){let t=0;for(let s=r,o=n-i;s<n;s+=i)t+=(e[o]-e[s])*(e[s+1]+e[o+1]),o=s;return t}function Oe(e,r,n){const i=e.point(r,n);return new V(i[0],i[1],i[2])}function He(e,r,n,i=1e-4){const t=e.point(r,n),s=e.point(r+i,n),o=e.point(r,n+i),l=new V().subVectors(new V(...s),new V(...t)),c=new V().subVectors(new V(...o),new V(...t));return new V().crossVectors(l,c).normalize()}function Z(e,r=100){return Array.from({length:r},(n,i)=>{const t=i/(r-1),s=e.point(t);return[s[0],s[1]]})}function W({color:e="#ffffff",wireframe:r=!1,children:n,...i}){const{scene:t}=we(),[s,o]=A.useState(null);if(A.useEffect(()=>{if(!n)return;const c=A.Children.toArray(n);if(c.length<2){console.warn("TrimmedSurface requires a NurbsSurface and at least one NurbsCurve");return}const a=c.find(y=>A.isValidElement(y)&&[N,"NurbsSurface"].includes(y.type));if(!a||!A.isValidElement(a)){console.warn("First child must be a NurbsSurface");return}const f=c.filter(y=>A.isValidElement(y)&&[M,"NurbsCurve"].includes(y.type));if(f.length===0){console.warn("At least one NurbsCurve is required");return}const u=a.props,m=S.geom.NurbsSurface.byKnotsControlPointsWeights(u.degreeU,u.degreeV,Array(u.controlPoints.length+u.degreeU+1).fill(0).map((y,b)=>b<u.degreeU+1?0:b>=u.controlPoints.length?1:(b-u.degreeU)/(u.controlPoints.length-u.degreeU)),Array(u.controlPoints[0].length+u.degreeV+1).fill(0).map((y,b)=>b<u.degreeV+1?0:b>=u.controlPoints[0].length?1:(b-u.degreeV)/(u.controlPoints[0].length-u.degreeV)),u.controlPoints,u.weights),d=f.map(y=>{if(!A.isValidElement(y))return null;const b=y.props;return S.geom.NurbsCurve.byKnotsControlPointsWeights(b.degree,b.knots,b.points,b.weights)}).filter(y=>y!==null).map(y=>Z(y,200)),C=[],j=[];let F=0;d.forEach((y,b)=>{b>0&&j.push(F),y.forEach(([_,D])=>{C.push(_,D),F++})});const z=Ne(C,j,2),x=[],p=[],re=[],te=[];for(let y=0;y<C.length;y+=2)te.push([C[y],C[y+1]]);for(const[y,b]of te){const _=Oe(m,y,b),D=He(m,y,b);x.push(_.x,_.y,_.z),p.push(D.x,D.y,D.z),re.push(y,b)}const k=new Pe;return k.setAttribute("position",new Y(x,3)),k.setAttribute("normal",new Y(p,3)),k.setAttribute("uv",new Y(re,2)),k.setIndex(z),o(k),()=>k.dispose()},[n,e,r,t]),!s)return null;const l=A.Children.toArray(n).find(c=>A.isValidElement(c)&&c.type.toString().includes("Material")&&![N,M,"NurbsSurface","NurbsCurve"].includes(c.type));return l?h.jsxs("mesh",{...i,children:[h.jsx("primitive",{object:s,attach:"geometry"}),l]}):(console.warn("TrimmedSurface requires a material as a direct child"),null)}W.__docgenInfo={description:"",methods:[],displayName:"TrimmedSurface",props:{color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ffffff"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"union",raw:"ReactElement | ReactElement[]",elements:[{name:"ReactElement"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const Je={title:"Components/TrimmedSurface",component:W,parameters:{layout:"fullscreen"},decorators:[e=>h.jsx("div",{style:{width:"100vw",height:"100vh"},children:h.jsxs(Ce,{camera:{position:[5,5,5],fov:50},children:[h.jsx("ambientLight",{intensity:.5}),h.jsx("pointLight",{position:[10,10,10]}),h.jsx(e,{}),h.jsx(Se,{})]})})],argTypes:{color:{control:"color"},wireframe:{control:"boolean"},scale:{control:{type:"range",min:.1,max:.7,step:.01}}}},w=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],P=[[1,1,1],[1,1,1],[1,1,1]],ne=(e,r=[.5,.5],n=4)=>{const i=[];for(let o=0;o<n;o++){const l=o/n*Math.PI*2,c=r[0]+e*Math.cos(l),a=r[1]+e*Math.sin(l);i.push([c,a])}const t=2,s=Array(n+t+1).fill(0).map((o,l)=>l<t+1?0:l>=n?1:(l-t)/(n-t));return{points:i,knots:s}};function H(e,r,n,i=.01){const t=e.point(r,n),s=1e-4,o=e.point(r+s,n),l=e.point(r,n+s),c=[o[0]-t[0],o[1]-t[1],o[2]-t[2]],a=[l[0]-t[0],l[1]-t[1],l[2]-t[2]],f=[c[1]*a[2]-c[2]*a[1],c[2]*a[0]-c[0]*a[2],c[0]*a[1]-c[1]*a[0]],u=Math.sqrt(f[0]**2+f[1]**2+f[2]**2)||1;return[t[0]+f[0]/u*i,t[1]+f[1]/u*i,t[2]+f[2]/u*i]}const G={args:{color:"#ff0000",wireframe:!1,scale:.35},render:({color:e="#ff0000",wireframe:r=!1,scale:n=.35})=>{const t=ne(.5,[.5,.5],4).points.map(([a,f])=>[(a-.5)*n+.5,(f-.5)*n+.5]),s=Array(t.length+3).fill(0).map((a,f)=>f<3?0:f>=t.length?1:(f-2)/(t.length-2)),o=S.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],w,P),l=S.geom.NurbsCurve.byKnotsControlPointsWeights(2,s,t.map(([a,f])=>[a,f,0]),Array(t.length).fill(1)),c=Z(l,200).map(([a,f])=>H(o,a,f));return h.jsxs(h.Fragment,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(W,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2}),h.jsx(M,{points:t,weights:Array(t.length).fill(1),knots:s,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:r,side:X})]}),h.jsx(E,{points:c,color:"black"})]})}},$={args:{color:"#3366ff",wireframe:!1,scale:.45},render:({color:e="#3366ff",wireframe:r=!1,scale:n=.45})=>{const t=Array.from({length:6},(f,u)=>{const m=u/6*Math.PI*2;return[.5+n*.5*Math.cos(m),.5+n*.25*Math.sin(m)]}),s=2,o=Array(6+s+1).fill(0).map((f,u)=>u<s+1?0:u>=6?1:(u-s)/(6-s)),l=S.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],w,P),c=S.geom.NurbsCurve.byKnotsControlPointsWeights(s,o,t.map(([f,u])=>[f,u,0]),Array(t.length).fill(1)),a=Z(c,200).map(([f,u])=>H(l,f,u));return h.jsxs(h.Fragment,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(W,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2}),h.jsx(M,{points:t,weights:Array(t.length).fill(1),knots:o,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:r,side:X})]}),h.jsx(E,{points:a,color:"black"})]})}},J={args:{color:"#33cc33",wireframe:!1,scale:.45},render:({color:e="#33cc33",wireframe:r=!1,scale:n=.45})=>{const i=ne(.5,[.5,.5],6).points,t=ne(.5,[.5,.5],6).points,s=i.map(([m,g])=>[(m-.5)*n+.5,(g-.5)*n+.5]),o=t.map(([m,g])=>[(m-.5)*(n*.33)+.5,(g-.5)*(n*.33)+.5]),l=S.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],w,P),c=S.geom.NurbsCurve.byKnotsControlPointsWeights(2,Array(s.length+3).fill(0).map((m,g)=>g<3?0:g>=s.length?1:(g-2)/(s.length-2)),s.map(([m,g])=>[m,g,0]),Array(s.length).fill(1)),a=S.geom.NurbsCurve.byKnotsControlPointsWeights(2,Array(o.length+3).fill(0).map((m,g)=>g<3?0:g>=o.length?1:(g-2)/(o.length-2)),o.map(([m,g])=>[m,g,0]),Array(o.length).fill(1)),f=Z(c,200).map(([m,g])=>H(l,m,g)),u=Z(a,200).map(([m,g])=>H(l,m,g));return h.jsxs(h.Fragment,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(W,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2}),h.jsx(M,{points:s,weights:Array(s.length).fill(1),knots:Array(s.length+3).fill(0).map((m,g)=>g<3?0:g>=s.length?1:(g-2)/(s.length-2)),degree:2}),h.jsx(M,{points:o,weights:Array(o.length).fill(1),knots:Array(o.length+3).fill(0).map((m,g)=>g<3?0:g>=o.length?1:(g-2)/(o.length-2)),degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:r,side:X})]}),h.jsx(E,{points:f,color:"black"}),h.jsx(E,{points:u,color:"black"})]})}},Q={args:{color:"#ffaa00",wireframe:!1,scale:.4},render:({color:e="#ffaa00",wireframe:r=!1,scale:n=.4})=>{const t=[.5,.5],s=Array.from({length:6},(u,m)=>{const g=m/6*Math.PI*2;return[t[0]+n*.5*Math.cos(g),t[1]+n*.5*Math.sin(g)]});s.push(s[0]);const o=2,l=Array(s.length+o+1).fill(0).map((u,m)=>m<o+1?0:m>=s.length?1:(m-o)/(s.length-o)),c=S.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],w,P),a=S.geom.NurbsCurve.byKnotsControlPointsWeights(o,l,s.map(([u,m])=>[u,m,0]),Array(s.length).fill(1)),f=Z(a,200).map(([u,m])=>H(c,u,m));return h.jsxs(h.Fragment,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(W,{children:[h.jsx(N,{controlPoints:w,weights:P,degreeU:2,degreeV:2}),h.jsx(M,{points:s,weights:Array(s.length).fill(1),knots:l,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:r,side:X})]}),h.jsx(E,{points:f,color:"black"})]})}};var se,ie,le;G.parameters={...G.parameters,docs:{...(se=G.parameters)==null?void 0:se.docs,source:{originalSource:`{
  args: {
    color: "#ff0000",
    wireframe: false,
    scale: 0.35
  },
  render: ({
    color = "#ff0000",
    wireframe = false,
    scale = 0.35
  }) => {
    const basePoints = createCircularCurveUV(0.5, [0.5, 0.5], 4).points;
    const trim: [number, number][] = basePoints.map(([u, v]) => [(u - 0.5) * scale + 0.5, (v - 0.5) * scale + 0.5]);
    const knots = Array(trim.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= trim.length) return 1;
      return (i - 2) / (trim.length - 2);
    });
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const nurbsTrim = verb.geom.NurbsCurve.byKnotsControlPointsWeights(2, knots, trim.map(([u, v]) => [u, v, 0]), Array(trim.length).fill(1));
    const trimLine = sampleNurbsCurve2D(nurbsTrim, 200).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={trim} weights={Array(trim.length).fill(1)} knots={knots} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={trimLine} color="black" />
      </>;
  }
}`,...(le=(ie=G.parameters)==null?void 0:ie.docs)==null?void 0:le.source}}};var ue,ce,ae;$.parameters={...$.parameters,docs:{...(ue=$.parameters)==null?void 0:ue.docs,source:{originalSource:`{
  args: {
    color: "#3366ff",
    wireframe: false,
    scale: 0.45
  },
  render: ({
    color = "#3366ff",
    wireframe = false,
    scale = 0.45
  }) => {
    const numPoints = 6;
    const points: [number, number][] = Array.from({
      length: numPoints
    }, (_, i) => {
      const angle = i / numPoints * Math.PI * 2;
      return [0.5 + scale * 0.5 * Math.cos(angle), 0.5 + scale * 0.25 * Math.sin(angle)] as [number, number];
    });
    const degree = 2;
    const knots = Array(numPoints + degree + 1).fill(0).map((_, i) => i < degree + 1 ? 0 : i >= numPoints ? 1 : (i - degree) / (numPoints - degree));
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const curve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, points.map(([u, v]) => [u, v, 0]), Array(points.length).fill(1));
    const linePts = sampleNurbsCurve2D(curve, 200).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={points} weights={Array(points.length).fill(1)} knots={knots} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={linePts} color="black" />
      </>;
  }
}`,...(ae=(ce=$.parameters)==null?void 0:ce.docs)==null?void 0:ae.source}}};var fe,me,ge;J.parameters={...J.parameters,docs:{...(fe=J.parameters)==null?void 0:fe.docs,source:{originalSource:`{
  args: {
    color: "#33cc33",
    wireframe: false,
    scale: 0.45
  },
  render: ({
    color = "#33cc33",
    wireframe = false,
    scale = 0.45
  }) => {
    const baseOuter = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const baseHole = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const outer: [number, number][] = baseOuter.map(([u, v]) => [(u - 0.5) * scale + 0.5, (v - 0.5) * scale + 0.5]);
    const hole: [number, number][] = baseHole.map(([u, v]) => [(u - 0.5) * (scale * 0.33) + 0.5, (v - 0.5) * (scale * 0.33) + 0.5]);
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const outerCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(2, Array(outer.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= outer.length) return 1;
      return (i - 2) / (outer.length - 2);
    }), outer.map(([u, v]) => [u, v, 0]), Array(outer.length).fill(1));
    const holeCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(2, Array(hole.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= hole.length) return 1;
      return (i - 2) / (hole.length - 2);
    }), hole.map(([u, v]) => [u, v, 0]), Array(hole.length).fill(1));
    const outer3D = sampleNurbsCurve2D(outerCurve, 200).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    const hole3D = sampleNurbsCurve2D(holeCurve, 200).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface>
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
}`,...(ge=(me=J.parameters)==null?void 0:me.docs)==null?void 0:ge.source}}};var he,xe,pe;Q.parameters={...Q.parameters,docs:{...(he=Q.parameters)==null?void 0:he.docs,source:{originalSource:`{
  args: {
    color: "#ffaa00",
    wireframe: false,
    scale: 0.4
  },
  render: ({
    color = "#ffaa00",
    wireframe = false,
    scale = 0.4
  }) => {
    const numPoints = 6;
    const center: [number, number] = [0.5, 0.5];
    const closedPoints: [number, number][] = Array.from({
      length: numPoints
    }, (_, i) => {
      const angle = i / numPoints * Math.PI * 2;
      return [center[0] + scale * 0.5 * Math.cos(angle), center[1] + scale * 0.5 * Math.sin(angle)] as [number, number];
    });
    closedPoints.push(closedPoints[0]); // Ensure closure

    const degree = 2;
    const knots = Array(closedPoints.length + degree + 1).fill(0).map((_, i) => {
      if (i < degree + 1) return 0;
      if (i >= closedPoints.length) return 1;
      return (i - degree) / (closedPoints.length - degree);
    });
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const closedCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, closedPoints.map(([u, v]) => [u, v, 0]), Array(closedPoints.length).fill(1));
    const trimLine = sampleNurbsCurve2D(closedCurve, 200).map(([u, v]) => projectUVTo3DWithOffset(surface, u, v));
    return <>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} wireframe />
        <TrimmedSurface>
          <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={2} degreeV={2} />
          <NurbsCurve points={closedPoints} weights={Array(closedPoints.length).fill(1)} knots={knots} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </TrimmedSurface>
        <Line points={trimLine} color="black" />
      </>;
  }
}`,...(pe=(xe=Q.parameters)==null?void 0:xe.docs)==null?void 0:pe.source}}};const Qe=["TrimmedBulgedSurface","TrimmedFlatEllipticalSurface","TrimmedSurfaceWithHole","TrimmedSurfaceClosedLoop"];export{G as TrimmedBulgedSurface,$ as TrimmedFlatEllipticalSurface,Q as TrimmedSurfaceClosedLoop,J as TrimmedSurfaceWithHole,Qe as __namedExportsOrder,Je as default};
