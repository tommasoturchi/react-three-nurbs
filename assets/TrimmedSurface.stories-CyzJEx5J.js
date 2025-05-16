import{j as h}from"./jsx-runtime-DiklIkkE.js";import{V,u as Ue,v as D,B as _e,F as te,C as Ze,O as Fe,D as Y}from"./verb.es-vEISxjAU.js";import{r as j}from"./index-DRjF_FHU.js";import{N as S}from"./NurbsSurface-CTCV2Ahz.js";import{N as W,L}from"./NurbsCurve-B3syIbAM.js";function Re(e,t,n=2){const r=t&&t.length,o=r?t[0]*n:e.length;let s=Se(e,0,o,n,!0);const i=[];if(!s||s.next===s.prev)return i;let u,a,l;if(r&&(s=Oe(e,t,s,n)),e.length>80*n){u=1/0,a=1/0;let g=-1/0,c=-1/0;for(let p=n;p<o;p+=n){const d=e[p],m=e[p+1];d<u&&(u=d),m<a&&(a=m),d>g&&(g=d),m>c&&(c=m)}l=Math.max(g-u,c-a),l=l!==0?32767/l:0}return O(s,i,n,u,a,l,0),i}function Se(e,t,n,r,o){let s;if(o===en(e,t,n,r)>0)for(let i=t;i<n;i+=r)s=me(i/r|0,e[i],e[i+1],s);else for(let i=n-r;i>=t;i-=r)s=me(i/r|0,e[i],e[i+1],s);return s&&K(s,s.next)&&(H(s),s=s.next),s}function Z(e,t){if(!e)return e;t||(t=e);let n=e,r;do if(r=!1,!n.steiner&&(K(n,n.next)||P(n.prev,n,n.next)===0)){if(H(n),n=t=n.prev,n===n.next)break;r=!0}else n=n.next;while(r||n!==t);return t}function O(e,t,n,r,o,s,i){if(!e)return;!i&&s&&Ye(e,r,o,s);let u=e;for(;e.prev!==e.next;){const a=e.prev,l=e.next;if(s?Le(e,r,o,s):Ee(e)){t.push(a.i,e.i,l.i),H(e),e=l.next,u=l.next;continue}if(e=l,e===u){i?i===1?(e=Ke(Z(e),t),O(e,t,n,r,o,s,2)):i===2&&Ie(e,t,n,r,o,s):O(Z(e),t,n,r,o,s,1);break}}}function Ee(e){const t=e.prev,n=e,r=e.next;if(P(t,n,r)>=0)return!1;const o=t.x,s=n.x,i=r.x,u=t.y,a=n.y,l=r.y,g=Math.min(o,s,i),c=Math.min(u,a,l),p=Math.max(o,s,i),d=Math.max(u,a,l);let m=r.next;for(;m!==t;){if(m.x>=g&&m.x<=p&&m.y>=c&&m.y<=d&&I(o,u,s,a,i,l,m.x,m.y)&&P(m.prev,m,m.next)>=0)return!1;m=m.next}return!0}function Le(e,t,n,r){const o=e.prev,s=e,i=e.next;if(P(o,s,i)>=0)return!1;const u=o.x,a=s.x,l=i.x,g=o.y,c=s.y,p=i.y,d=Math.min(u,a,l),m=Math.min(g,c,p),f=Math.max(u,a,l),x=Math.max(g,c,p),M=re(d,m,t,n,r),N=re(f,x,t,n,r);let v=e.prevZ,y=e.nextZ;for(;v&&v.z>=M&&y&&y.z<=N;){if(v.x>=d&&v.x<=f&&v.y>=m&&v.y<=x&&v!==o&&v!==i&&I(u,g,a,c,l,p,v.x,v.y)&&P(v.prev,v,v.next)>=0||(v=v.prevZ,y.x>=d&&y.x<=f&&y.y>=m&&y.y<=x&&y!==o&&y!==i&&I(u,g,a,c,l,p,y.x,y.y)&&P(y.prev,y,y.next)>=0))return!1;y=y.nextZ}for(;v&&v.z>=M;){if(v.x>=d&&v.x<=f&&v.y>=m&&v.y<=x&&v!==o&&v!==i&&I(u,g,a,c,l,p,v.x,v.y)&&P(v.prev,v,v.next)>=0)return!1;v=v.prevZ}for(;y&&y.z<=N;){if(y.x>=d&&y.x<=f&&y.y>=m&&y.y<=x&&y!==o&&y!==i&&I(u,g,a,c,l,p,y.x,y.y)&&P(y.prev,y,y.next)>=0)return!1;y=y.nextZ}return!0}function Ke(e,t){let n=e;do{const r=n.prev,o=n.next.next;!K(r,o)&&Ve(r,n,n.next,o)&&B(r,o)&&B(o,r)&&(t.push(r.i,n.i,o.i),H(n),H(n.next),n=e=o),n=n.next}while(n!==e);return Z(n)}function Ie(e,t,n,r,o,s){let i=e;do{let u=i.next.next;for(;u!==i.prev;){if(i.i!==u.i&&$e(i,u)){let a=Te(i,u);i=Z(i,i.next),a=Z(a,a.next),O(i,t,n,r,o,s,0),O(a,t,n,r,o,s,0);return}u=u.next}i=i.next}while(i!==e)}function Oe(e,t,n,r){const o=[];for(let s=0,i=t.length;s<i;s++){const u=t[s]*r,a=s<i-1?t[s+1]*r:e.length,l=Se(e,u,a,r,!1);l===l.next&&(l.steiner=!0),o.push(Ge(l))}o.sort(Be);for(let s=0;s<o.length;s++)n=He(o[s],n);return n}function Be(e,t){let n=e.x-t.x;if(n===0&&(n=e.y-t.y,n===0)){const r=(e.next.y-e.y)/(e.next.x-e.x),o=(t.next.y-t.y)/(t.next.x-t.x);n=r-o}return n}function He(e,t){const n=ze(e,t);if(!n)return t;const r=Te(n,e);return Z(r,r.next),Z(n,n.next)}function ze(e,t){let n=t;const r=e.x,o=e.y;let s=-1/0,i;if(K(e,n))return n;do{if(K(e,n.next))return n.next;if(o<=n.y&&o>=n.next.y&&n.next.y!==n.y){const c=n.x+(o-n.y)*(n.next.x-n.x)/(n.next.y-n.y);if(c<=r&&c>s&&(s=c,i=n.x<n.next.x?n:n.next,c===r))return i}n=n.next}while(n!==t);if(!i)return null;const u=i,a=i.x,l=i.y;let g=1/0;n=i;do{if(r>=n.x&&n.x>=a&&r!==n.x&&je(o<l?r:s,o,a,l,o<l?s:r,o,n.x,n.y)){const c=Math.abs(o-n.y)/(r-n.x);B(n,e)&&(c<g||c===g&&(n.x>i.x||n.x===i.x&&Xe(i,n)))&&(i=n,g=c)}n=n.next}while(n!==u);return i}function Xe(e,t){return P(e.prev,e,t.prev)<0&&P(t.next,e,e.next)<0}function Ye(e,t,n,r){let o=e;do o.z===0&&(o.z=re(o.x,o.y,t,n,r)),o.prevZ=o.prev,o.nextZ=o.next,o=o.next;while(o!==e);o.prevZ.nextZ=null,o.prevZ=null,qe(o)}function qe(e){let t,n=1;do{let r=e,o;e=null;let s=null;for(t=0;r;){t++;let i=r,u=0;for(let l=0;l<n&&(u++,i=i.nextZ,!!i);l++);let a=n;for(;u>0||a>0&&i;)u!==0&&(a===0||!i||r.z<=i.z)?(o=r,r=r.nextZ,u--):(o=i,i=i.nextZ,a--),s?s.nextZ=o:e=o,o.prevZ=s,s=o;r=i}s.nextZ=null,n*=2}while(t>1);return e}function re(e,t,n,r,o){return e=(e-n)*o|0,t=(t-r)*o|0,e=(e|e<<8)&16711935,e=(e|e<<4)&252645135,e=(e|e<<2)&858993459,e=(e|e<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,e|t<<1}function Ge(e){let t=e,n=e;do(t.x<n.x||t.x===n.x&&t.y<n.y)&&(n=t),t=t.next;while(t!==e);return n}function je(e,t,n,r,o,s,i,u){return(o-i)*(t-u)>=(e-i)*(s-u)&&(e-i)*(r-u)>=(n-i)*(t-u)&&(n-i)*(s-u)>=(o-i)*(r-u)}function I(e,t,n,r,o,s,i,u){return!(e===i&&t===u)&&je(e,t,n,r,o,s,i,u)}function $e(e,t){return e.next.i!==t.i&&e.prev.i!==t.i&&!Je(e,t)&&(B(e,t)&&B(t,e)&&Qe(e,t)&&(P(e.prev,e,t.prev)||P(e,t.prev,t))||K(e,t)&&P(e.prev,e,e.next)>0&&P(t.prev,t,t.next)>0)}function P(e,t,n){return(t.y-e.y)*(n.x-t.x)-(t.x-e.x)*(n.y-t.y)}function K(e,t){return e.x===t.x&&e.y===t.y}function Ve(e,t,n,r){const o=G(P(e,t,n)),s=G(P(e,t,r)),i=G(P(n,r,e)),u=G(P(n,r,t));return!!(o!==s&&i!==u||o===0&&q(e,n,t)||s===0&&q(e,r,t)||i===0&&q(n,e,r)||u===0&&q(n,t,r))}function q(e,t,n){return t.x<=Math.max(e.x,n.x)&&t.x>=Math.min(e.x,n.x)&&t.y<=Math.max(e.y,n.y)&&t.y>=Math.min(e.y,n.y)}function G(e){return e>0?1:e<0?-1:0}function Je(e,t){let n=e;do{if(n.i!==e.i&&n.next.i!==e.i&&n.i!==t.i&&n.next.i!==t.i&&Ve(n,n.next,e,t))return!0;n=n.next}while(n!==e);return!1}function B(e,t){return P(e.prev,e,e.next)<0?P(e,t,e.next)>=0&&P(e,e.prev,t)>=0:P(e,t,e.prev)<0||P(e,e.next,t)<0}function Qe(e,t){let n=e,r=!1;const o=(e.x+t.x)/2,s=(e.y+t.y)/2;do n.y>s!=n.next.y>s&&n.next.y!==n.y&&o<(n.next.x-n.x)*(s-n.y)/(n.next.y-n.y)+n.x&&(r=!r),n=n.next;while(n!==e);return r}function Te(e,t){const n=oe(e.i,e.x,e.y),r=oe(t.i,t.x,t.y),o=e.next,s=t.prev;return e.next=t,t.prev=e,n.next=o,o.prev=n,r.next=n,n.prev=r,s.next=r,r.prev=s,r}function me(e,t,n,r){const o=oe(e,t,n);return r?(o.next=r.next,o.prev=r,r.next.prev=o,r.next=o):(o.prev=o,o.next=o),o}function H(e){e.next.prev=e.prev,e.prev.next=e.next,e.prevZ&&(e.prevZ.nextZ=e.nextZ),e.nextZ&&(e.nextZ.prevZ=e.prevZ)}function oe(e,t,n){return{i:e,x:t,y:n,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function en(e,t,n,r){let o=0;for(let s=t,i=n-r;s<n;s+=r)o+=(e[i]-e[s])*(e[s+1]+e[i+1]),i=s;return o}function nn(e,t,n){const r=e.point(t,n);return new V(r[0],r[1],r[2])}function tn(e,t,n,r=1e-4){const o=e.point(t,n),s=e.point(t+r,n),i=e.point(t,n+r),u=new V().subVectors(new V(...s),new V(...o)),a=new V().subVectors(new V(...i),new V(...o));return new V().crossVectors(u,a).normalize()}function z(e,t=100){return Array.from({length:t},(n,r)=>{const o=r/(t-1),s=e.point(o);return[s[0],s[1]]})}function rn(e,t=5,n=10){const r=l=>[l[0],l[1]],o=(l,g,c)=>{const p=[g[0]-l[0],g[1]-l[1]],d=[c[0]-g[0],c[1]-g[1]],m=p[0]*d[0]+p[1]*d[1],f=Math.sqrt(p[0]*p[0]+p[1]*p[1]),x=Math.sqrt(d[0]*d[0]+d[1]*d[1]);return f===0||x===0?0:Math.acos(Math.max(-1,Math.min(1,m/(f*x))))*(180/Math.PI)};function s(l,g,c){const p=r(e.point(l)),d=r(e.point((l+g)/2)),m=r(e.point(g));if(o(p,d,m)>t&&c<n){const x=s(l,(l+g)/2,c+1),M=s((l+g)/2,g,c+1);return[...x.slice(0,-1),...M]}else return[p,m]}const i=[],u=10;let a=null;for(let l=0;l<u;l++){const g=s(l/u,(l+1)/u,0);for(const c of g)(!a||c[0]!==a[0]||c[1]!==a[1])&&(i.push(c),a=c)}return i}function on(e,t,n=20){let r=1/0,o=null;for(let g=0;g<=n;g++)for(let c=0;c<=n;c++){const p=g/n,d=c/n,m=e.point(p,d),f=Math.sqrt(Math.pow(m[0]-t[0],2)+Math.pow(m[1]-t[1],2)+Math.pow(m[2]-t[2],2));f<r&&(r=f,o=[p,d])}if(!o)return null;const s=1e-4,i=.01,u=100;let[a,l]=o;for(let g=0;g<u;g++){const c=e.point(a,l),p=e.point(a+s,l),d=e.point(a,l+s),m=[(p[0]-c[0])/s,(p[1]-c[1])/s,(p[2]-c[2])/s],f=[(d[0]-c[0])/s,(d[1]-c[1])/s,(d[2]-c[2])/s],x=2*(m[0]*(c[0]-t[0])+m[1]*(c[1]-t[1])+m[2]*(c[2]-t[2])),M=2*(f[0]*(c[0]-t[0])+f[1]*(c[1]-t[1])+f[2]*(c[2]-t[2])),N=Math.max(0,Math.min(1,a-i*x)),v=Math.max(0,Math.min(1,l-i*M));if(Math.abs(N-a)<s&&Math.abs(v-l)<s)return[N,v];a=N,l=v}return[a,l]}function F({color:e="#ffffff",trimCurveResolution:t=200,adaptiveMaxAngleDeg:n=5,adaptiveMaxDepth:r=10,wireframe:o=!1,world:s=!1,children:i,...u}){const{scene:a}=Ue(),[l,g]=j.useState(null);if(j.useEffect(()=>{if(!i)return;const p=j.Children.toArray(i);if(p.length<2){console.warn("TrimmedSurface requires a NurbsSurface and at least one NurbsCurve");return}const d=p.find(b=>j.isValidElement(b)&&[S,"NurbsSurface"].includes(b.type));if(!d||!j.isValidElement(d)){console.warn("First child must be a NurbsSurface");return}const m=p.filter(b=>j.isValidElement(b)&&[W,"NurbsCurve"].includes(b.type));if(m.length===0){console.warn("At least one NurbsCurve is required");return}const f=d.props,x=D.geom.NurbsSurface.byKnotsControlPointsWeights(f.degreeU,f.degreeV,Array(f.controlPoints.length+f.degreeU+1).fill(0).map((b,w)=>w<f.degreeU+1?0:w>=f.controlPoints.length?1:(w-f.degreeU)/(f.controlPoints.length-f.degreeU)),Array(f.controlPoints[0].length+f.degreeV+1).fill(0).map((b,w)=>w<f.degreeV+1?0:w>=f.controlPoints[0].length?1:(w-f.degreeV)/(f.controlPoints[0].length-f.degreeV)),f.controlPoints,f.weights),N=m.map(b=>{if(!j.isValidElement(b))return null;const w=b.props,T=D.geom.NurbsCurve.byKnotsControlPointsWeights(w.degree,w.knots,w.points,w.weights);if(s){const k=t,U=[];for(let E=0;E<=k;E++){const _=E/k,We=T.point(_),fe=on(x,We);fe&&U.push(fe)}return U.length>0?D.geom.NurbsCurve.byKnotsControlPointsWeights(w.degree,Array(U.length+w.degree+1).fill(0).map((E,_)=>_<w.degree+1?0:_>=U.length?1:(_-w.degree)/(U.length-w.degree)),U.map(([E,_])=>[E,_,0]),Array(U.length).fill(1)):null}return T}).filter(b=>b!==null).map(b=>rn(b,n,r)),v=[],y=[];let ie=0;N.forEach((b,w)=>{w>0&&y.push(ie),b.forEach(([T,k])=>{v.push(T,k),ie++})});const ke=Re(v,y,2),le=[],ae=[],ue=[],ce=[];for(let b=0;b<v.length;b+=2)ce.push([v[b],v[b+1]]);for(const[b,w]of ce){const T=nn(x,b,w),k=tn(x,b,w);le.push(T.x,T.y,T.z),ae.push(k.x,k.y,k.z),ue.push(b,w)}const R=new _e;return R.setAttribute("position",new te(le,3)),R.setAttribute("normal",new te(ae,3)),R.setAttribute("uv",new te(ue,2)),R.setIndex(ke),g(R),()=>R.dispose()},[i,e,o,a,t,n,r,s]),!l)return null;const c=j.Children.toArray(i).find(p=>j.isValidElement(p)&&p.type.toString().includes("Material")&&![S,W,"NurbsSurface","NurbsCurve"].includes(p.type));return c?h.jsxs("mesh",{...u,children:[h.jsx("primitive",{object:l,attach:"geometry"}),c]}):(console.warn("TrimmedSurface requires a material as a direct child"),null)}F.__docgenInfo={description:"",methods:[],displayName:"TrimmedSurface",props:{color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ffffff"',computed:!1}},trimCurveResolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"200",computed:!1}},adaptiveMaxAngleDeg:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"5",computed:!1}},adaptiveMaxDepth:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},world:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"union",raw:"ReactElement | ReactElement[]",elements:[{name:"ReactElement"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const mn={title:"Components/TrimmedSurface",component:F,parameters:{layout:"centered"},decorators:[e=>h.jsx("div",{style:{width:"100vw",height:"100vh"},children:h.jsxs(Ze,{camera:{position:[2,2,2],fov:50},children:[h.jsx("ambientLight",{intensity:.5}),h.jsx("pointLight",{position:[10,10,10]}),h.jsx(e,{}),h.jsx(Fe,{})]})})],argTypes:{color:{control:"color",description:"Color of the trimmed surface"},wireframe:{control:"boolean",description:"Whether to show the surface as wireframe"},trimCurveResolution:{control:{type:"range",min:10,max:500,step:10},description:"Number of points to sample along the trimming curve"},adaptiveMaxAngleDeg:{control:{type:"range",min:1,max:45,step:1},description:"Maximum angle between adjacent triangles in degrees"},adaptiveMaxDepth:{control:{type:"range",min:1,max:20,step:1},description:"Maximum recursion depth for adaptive tessellation"},world:{control:"boolean",description:"Whether the trimming curve is in world space or UV space"},scale:{control:{type:"range",min:.1,max:1,step:.1},description:"Scale of the trimming curve"},curveX:{control:{type:"range",min:0,max:2,step:.1},description:"X position of the trimming curve center"},curveY:{control:{type:"range",min:0,max:2,step:.1},description:"Y position of the trimming curve center"}}},C=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],A=[[1,1,1],[1,1,1],[1,1,1]],se=(e,t=[.5,.5],n=4)=>{const r=[];for(let i=0;i<n;i++){const u=i/n*Math.PI*2,a=t[0]+e*Math.cos(u),l=t[1]+e*Math.sin(u);r.push([a,l])}const o=2,s=Array(n+o+1).fill(0).map((i,u)=>u<o+1?0:u>=n?1:(u-o)/(n-o));return{points:r,knots:s}};function X(e,t,n,r=.01){const o=e.point(t,n),s=1e-4,i=e.point(t+s,n),u=e.point(t,n+s),a=[i[0]-o[0],i[1]-o[1],i[2]-o[2]],l=[u[0]-o[0],u[1]-o[1],u[2]-o[2]],g=[a[1]*l[2]-a[2]*l[1],a[2]*l[0]-a[0]*l[2],a[0]*l[1]-a[1]*l[0]],c=Math.sqrt(g[0]**2+g[1]**2+g[2]**2)||1;return[o[0]+g[0]/c*r,o[1]+g[1]/c*r,o[2]+g[2]/c*r]}const $={args:{color:"#ff0000",wireframe:!1,scale:.35,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#ff0000",wireframe:t=!1,scale:n=.35,trimCurveResolution:r=200,adaptiveMaxAngleDeg:o=5,adaptiveMaxDepth:s=10})=>{const u=se(.5,[.5,.5],4).points.map(([p,d])=>[(p-.5)*Number(n)+.5,(d-.5)*Number(n)+.5]),a=Array(u.length+3).fill(0).map((p,d)=>d<3?0:d>=u.length?1:(d-2)/(u.length-2)),l=D.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],C,A),g=D.geom.NurbsCurve.byKnotsControlPointsWeights(2,a,u.map(([p,d])=>[p,d,0]),Array(u.length).fill(1)),c=z(g,r).map(([p,d])=>X(l,p,d));return h.jsxs(h.Fragment,{children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(F,{trimCurveResolution:r,adaptiveMaxAngleDeg:o,adaptiveMaxDepth:s,children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2}),h.jsx(W,{points:u,weights:Array(u.length).fill(1),knots:a,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:t,side:Y})]}),h.jsx(L,{points:c,color:"black"})]})}},J={args:{color:"#3366ff",wireframe:!1,scale:.45,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#3366ff",wireframe:t=!1,scale:n=.45,trimCurveResolution:r=200,adaptiveMaxAngleDeg:o=5,adaptiveMaxDepth:s=10})=>{const u=Array.from({length:6},(d,m)=>{const f=m/6*Math.PI*2;return[.5+Number(n)*.5*Math.cos(f),.5+Number(n)*.25*Math.sin(f)]}),a=2,l=Array(6+a+1).fill(0).map((d,m)=>m<a+1?0:m>=6?1:(m-a)/(6-a)),g=D.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],C,A),c=D.geom.NurbsCurve.byKnotsControlPointsWeights(a,l,u.map(([d,m])=>[d,m,0]),Array(u.length).fill(1)),p=z(c,r).map(([d,m])=>X(g,d,m));return h.jsxs(h.Fragment,{children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(F,{trimCurveResolution:r,adaptiveMaxAngleDeg:o,adaptiveMaxDepth:s,children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2}),h.jsx(W,{points:u,weights:Array(u.length).fill(1),knots:l,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:t,side:Y})]}),h.jsx(L,{points:p,color:"black"})]})}},Q={args:{color:"#33cc33",wireframe:!1,scale:.45,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#33cc33",wireframe:t=!1,scale:n=.45,trimCurveResolution:r=200,adaptiveMaxAngleDeg:o=5,adaptiveMaxDepth:s=10})=>{const i=se(.5,[.5,.5],6).points,u=se(.5,[.5,.5],6).points,a=i.map(([f,x])=>[(f-.5)*Number(n)+.5,(x-.5)*Number(n)+.5]),l=u.map(([f,x])=>[(f-.5)*(Number(n)*.33)+.5,(x-.5)*(Number(n)*.33)+.5]),g=D.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],C,A),c=D.geom.NurbsCurve.byKnotsControlPointsWeights(2,Array(a.length+3).fill(0).map((f,x)=>x<3?0:x>=a.length?1:(x-2)/(a.length-2)),a.map(([f,x])=>[f,x,0]),Array(a.length).fill(1)),p=D.geom.NurbsCurve.byKnotsControlPointsWeights(2,Array(l.length+3).fill(0).map((f,x)=>x<3?0:x>=l.length?1:(x-2)/(l.length-2)),l.map(([f,x])=>[f,x,0]),Array(l.length).fill(1)),d=z(c,r).map(([f,x])=>X(g,f,x)),m=z(p,r).map(([f,x])=>X(g,f,x));return h.jsxs(h.Fragment,{children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(F,{trimCurveResolution:r,adaptiveMaxAngleDeg:o,adaptiveMaxDepth:s,children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2}),h.jsx(W,{points:a,weights:Array(a.length).fill(1),knots:Array(a.length+3).fill(0).map((f,x)=>x<3?0:x>=a.length?1:(x-2)/(a.length-2)),degree:2}),h.jsx(W,{points:l,weights:Array(l.length).fill(1),knots:Array(l.length+3).fill(0).map((f,x)=>x<3?0:x>=l.length?1:(x-2)/(l.length-2)),degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:t,side:Y})]}),h.jsx(L,{points:d,color:"black"}),h.jsx(L,{points:m,color:"black"})]})}},ee={args:{color:"#ffaa00",wireframe:!1,scale:.4,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10},render:({color:e="#ffaa00",wireframe:t=!1,scale:n=.4,trimCurveResolution:r=200,adaptiveMaxAngleDeg:o=5,adaptiveMaxDepth:s=10})=>{const u=[.5,.5],a=Array.from({length:6},(m,f)=>{const x=f/6*Math.PI*2;return[u[0]+Number(n)*.5*Math.cos(x),u[1]+Number(n)*.5*Math.sin(x)]});a.push(a[0]);const l=2,g=Array(a.length+l+1).fill(0).map((m,f)=>f<l+1?0:f>=a.length?1:(f-l)/(a.length-l)),c=D.geom.NurbsSurface.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],C,A),p=D.geom.NurbsCurve.byKnotsControlPointsWeights(l,g,a.map(([m,f])=>[m,f,0]),Array(a.length).fill(1)),d=z(p,r).map(([m,f])=>X(c,m,f));return h.jsxs(h.Fragment,{children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(F,{trimCurveResolution:r,adaptiveMaxAngleDeg:o,adaptiveMaxDepth:s,children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2}),h.jsx(W,{points:a,weights:Array(a.length).fill(1),knots:g,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:t,side:Y})]}),h.jsx(L,{points:d,color:"black"})]})}};function sn({color:e="#ff00ff",wireframe:t=!1,trimCurveResolution:n=200,adaptiveMaxAngleDeg:r=5,adaptiveMaxDepth:o=10,world:s=!0,curveX:i=1,curveY:u=1}){const a=[i,u,.5],l=6,g=.3,c=Array.from({length:l},(x,M)=>{const N=M/l*Math.PI*2;return[a[0]+g*Math.cos(N),a[1]+g*Math.sin(N),a[2]]});c.push(c[0]);const p=2,d=Array(c.length+p+1).fill(0).map((x,M)=>M<p+1?0:M>=c.length?1:(M-p)/(c.length-p)),m=D.geom.NurbsCurve.byKnotsControlPointsWeights(p,d,c,Array(c.length).fill(1)),f=Array.from({length:n+1},(x,M)=>{const N=M/n,v=m.point(N);return[v[0],v[1],v[2]]});return h.jsxs(h.Fragment,{children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2,wireframe:!0}),h.jsxs(F,{trimCurveResolution:n,adaptiveMaxAngleDeg:r,adaptiveMaxDepth:o,world:s,children:[h.jsx(S,{controlPoints:C,weights:A,degreeU:2,degreeV:2}),h.jsx(W,{points:c,weights:Array(c.length).fill(1),knots:d,degree:2}),h.jsx("meshPhongMaterial",{color:e,wireframe:t,side:Y})]}),s&&h.jsxs(h.Fragment,{children:[h.jsx(L,{points:f,color:"black"}),h.jsxs("mesh",{position:new V(...a),children:[h.jsx("sphereGeometry",{args:[.05,16,16]}),h.jsx("meshBasicMaterial",{color:"red"})]})]})]})}const ne={args:{color:"#ff00ff",wireframe:!1,scale:.4,trimCurveResolution:200,adaptiveMaxAngleDeg:5,adaptiveMaxDepth:10,world:!0,curveX:1,curveY:1},render:e=>{if("curveX"in e&&"curveY"in e&&"scale"in e)return h.jsx(sn,{...e});throw new Error("WorldSpaceTrimmedSurface requires curveX, curveY, and scale props")},parameters:{docs:{description:{story:"A trimmed surface with a circular trimming curve in world space, controlled by X and Y sliders."}}}};var ge,pe,he;$.parameters={...$.parameters,docs:{...(ge=$.parameters)==null?void 0:ge.docs,source:{originalSource:`{
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
  }) => {
    const basePoints = createCircularCurveUV(0.5, [0.5, 0.5], 4).points;
    const trim: [number, number][] = basePoints.map(([u, v]) => [(u - 0.5) * Number(scale) + 0.5, (v - 0.5) * Number(scale) + 0.5]);
    const knots = Array(trim.length + 3).fill(0).map((_, i) => {
      if (i < 3) return 0;
      if (i >= trim.length) return 1;
      return (i - 2) / (trim.length - 2);
    });
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const nurbsTrim = verb.geom.NurbsCurve.byKnotsControlPointsWeights(2, knots, trim.map(([u, v]) => [u, v, 0]), Array(trim.length).fill(1));
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
}`,...(he=(pe=$.parameters)==null?void 0:pe.docs)==null?void 0:he.source}}};var de,xe,ve;J.parameters={...J.parameters,docs:{...(de=J.parameters)==null?void 0:de.docs,source:{originalSource:`{
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
  }) => {
    const numPoints = 6;
    const points: [number, number][] = Array.from({
      length: numPoints
    }, (_, i) => {
      const angle = i / numPoints * Math.PI * 2;
      return [0.5 + Number(scale) * 0.5 * Math.cos(angle), 0.5 + Number(scale) * 0.25 * Math.sin(angle)] as [number, number];
    });
    const degree = 2;
    const knots = Array(numPoints + degree + 1).fill(0).map((_, i) => i < degree + 1 ? 0 : i >= numPoints ? 1 : (i - degree) / (numPoints - degree));
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const curve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, points.map(([u, v]) => [u, v, 0]), Array(points.length).fill(1));
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
}`,...(ve=(xe=J.parameters)==null?void 0:xe.docs)==null?void 0:ve.source}}};var ye,be,we;Q.parameters={...Q.parameters,docs:{...(ye=Q.parameters)==null?void 0:ye.docs,source:{originalSource:`{
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
  }) => {
    const baseOuter = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const baseHole = createCircularCurveUV(0.5, [0.5, 0.5], 6).points;
    const outer: [number, number][] = baseOuter.map(([u, v]) => [(u - 0.5) * Number(scale) + 0.5, (v - 0.5) * Number(scale) + 0.5]);
    const hole: [number, number][] = baseHole.map(([u, v]) => [(u - 0.5) * (Number(scale) * 0.33) + 0.5, (v - 0.5) * (Number(scale) * 0.33) + 0.5]);
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
}`,...(we=(be=Q.parameters)==null?void 0:be.docs)==null?void 0:we.source}}};var Pe,Me,Ce;ee.parameters={...ee.parameters,docs:{...(Pe=ee.parameters)==null?void 0:Pe.docs,source:{originalSource:`{
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
  }) => {
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
    const surface = verb.geom.NurbsSurface.byKnotsControlPointsWeights(2, 2, [0, 0, 0, 1, 1, 1], [0, 0, 0, 1, 1, 1], controlPoints, weights);
    const closedCurve = verb.geom.NurbsCurve.byKnotsControlPointsWeights(degree, knots, closedPoints.map(([u, v]) => [u, v, 0]), Array(closedPoints.length).fill(1));
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
}`,...(Ce=(Me=ee.parameters)==null?void 0:Me.docs)==null?void 0:Ce.source}}};var Ae,Ne,De;ne.parameters={...ne.parameters,docs:{...(Ae=ne.parameters)==null?void 0:Ae.docs,source:{originalSource:`{
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
  } as WorldSpaceProps,
  render: (args: Props) => {
    if ("curveX" in args && "curveY" in args && "scale" in args) {
      return <WorldSpaceTrimmedSurfaceDemo {...args} />;
    }
    throw new Error("WorldSpaceTrimmedSurface requires curveX, curveY, and scale props");
  },
  parameters: {
    docs: {
      description: {
        story: "A trimmed surface with a circular trimming curve in world space, controlled by X and Y sliders."
      }
    }
  }
}`,...(De=(Ne=ne.parameters)==null?void 0:Ne.docs)==null?void 0:De.source}}};const gn=["TrimmedBulgedSurface","TrimmedFlatEllipticalSurface","TrimmedSurfaceWithHole","TrimmedSurfaceClosedLoop","WorldSpaceTrimmedSurface"];export{$ as TrimmedBulgedSurface,J as TrimmedFlatEllipticalSurface,ee as TrimmedSurfaceClosedLoop,Q as TrimmedSurfaceWithHole,ne as WorldSpaceTrimmedSurface,gn as __namedExportsOrder,mn as default};
