import{j as r}from"./jsx-runtime-DFAAy_2V.js";import{N,B as O,F as U,D as T,C as _,O as G}from"./curve-CYvlzlZm.js";import{r as y}from"./index-Bc2G9s8g.js";import{i as L}from"./materials-D2_MRo5E.js";import{N as W}from"./surface-P5fBJWnA.js";function k({points:s,degreeU:f=3,degreeV:m=3,resolutionU:a=20,resolutionV:o=20}){const u=y.useMemo(()=>{if(!s||s.length<2)return null;for(const n of s)if(!n||n.length<2)return null;try{const n=s.map(l=>N.byPoints(l,Math.min(f,l.length-1)));return W.byLoftingCurves(n,Math.min(m,n.length-1))}catch(n){return console.error("useInterpolatedSurface: Error creating surface:",n),null}},[s,f,m]),I=y.useMemo(()=>{if(!u)return null;try{const n=(a+1)*(o+1),l=new Float32Array(n*3),i=new Float32Array(n*3),v=new Float32Array(n*2);let w=0,t=0,j=0;for(let d=0;d<=a;d++)for(let p=0;p<=o;p++){const x=d/a,b=p/o,h=u.point(x,b);l[w++]=h[0],l[w++]=h[1],l[w++]=h[2];try{const g=u.normal(x,b),V=Math.sqrt(g[0]**2+g[1]**2+g[2]**2);V>0?(i[t++]=g[0]/V,i[t++]=g[1]/V,i[t++]=g[2]/V):(i[t++]=0,i[t++]=1,i[t++]=0)}catch{i[t++]=0,i[t++]=1,i[t++]=0}v[j++]=x,v[j++]=b}const S=a*o*6,e=new Uint32Array(S);let c=0;for(let d=0;d<a;d++)for(let p=0;p<o;p++){const x=d*(o+1)+p,b=x+1,h=(d+1)*(o+1)+p,g=h+1;e[c++]=x,e[c++]=b,e[c++]=h,e[c++]=b,e[c++]=g,e[c++]=h}return{vertices:l,normals:i,uvs:v,indices:e}}catch(n){return console.error("useInterpolatedSurface: Error generating geometry:",n),null}},[u,a,o]);return{surface:u,geometry:I}}const P=y.forwardRef(function({points:f,degreeU:m=3,degreeV:a=3,resolutionU:o=20,resolutionV:u=20,color:I="#ffffff",wireframe:n=!1,children:l,...i},v){const w=y.useMemo(()=>{if(!l)return null;const e=y.Children.toArray(l);for(const c of e)if(L(c))return c;return null},[l]),{geometry:t}=k({points:f,degreeU:m,degreeV:a,resolutionU:o,resolutionV:u}),j=y.useRef(null),S=y.useMemo(()=>{if(!t)return null;const e=j.current??new O;return e.setAttribute("position",new U(t.vertices,3)),e.setAttribute("normal",new U(t.normals,3)),e.setAttribute("uv",new U(t.uvs,2)),e.setIndex(Array.from(t.indices)),e.computeBoundingSphere(),j.current=e,e},[t]);return S?r.jsx("mesh",{ref:v,...i,geometry:S,children:w||r.jsx("meshPhongMaterial",{color:I,wireframe:n,side:T})}):null});P.__docgenInfo={description:"",methods:[],displayName:"InterpolatedSurface",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"Array",elements:[{name:"number"}],raw:"number[]"}],raw:"number[][]"}],raw:"number[][][]"},description:""},degreeU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},degreeV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ffffff"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactElement"},description:""}},composes:["Omit"]};const X={title:"Components/InterpolatedSurface",parameters:{layout:"centered"},decorators:[s=>r.jsx("div",{style:{width:"100vw",height:"100vh"},children:r.jsxs(_,{camera:{position:[4,4,4],fov:50},children:[r.jsx("ambientLight",{intensity:.5}),r.jsx("pointLight",{position:[10,10,10]}),r.jsx(s,{}),r.jsx(G,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in U"},resolutionV:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in V"}}},C=[[[0,0,0],[1,0,0],[2,0,0],[3,0,0]],[[0,1,0],[1,1,.5],[2,1,.5],[3,1,0]],[[0,2,0],[1,2,1],[2,2,1],[3,2,0]],[[0,3,0],[1,3,0],[2,3,0],[3,3,0]]],M={args:{color:"#44ccff",wireframe:!1,resolutionU:30,resolutionV:30},render:({color:s="#44ccff",wireframe:f=!1,resolutionU:m=30,resolutionV:a=30})=>r.jsxs(r.Fragment,{children:[r.jsx(P,{points:C,degreeU:3,degreeV:3,resolutionU:m,resolutionV:a,children:r.jsx("meshPhongMaterial",{color:s,wireframe:f,side:T})}),C.flat().map((o,u)=>r.jsxs("mesh",{position:[o[0],o[1],o[2]],children:[r.jsx("sphereGeometry",{args:[.05,8,8]}),r.jsx("meshBasicMaterial",{color:"#ffaa00"})]},u))]})},A={args:{color:"#ff8844",wireframe:!0,resolutionU:20,resolutionV:20},render:({color:s="#ff8844",wireframe:f=!0,resolutionU:m=20,resolutionV:a=20})=>r.jsx(P,{points:C,degreeU:3,degreeV:3,resolutionU:m,resolutionV:a,children:r.jsx("meshPhongMaterial",{color:s,wireframe:f,side:T})})};var q,D,E;M.parameters={...M.parameters,docs:{...(q=M.parameters)==null?void 0:q.docs,source:{originalSource:`{
  args: {
    color: "#44ccff",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30
  },
  render: ({
    color = "#44ccff",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30
  }: Record<string, any>) => <>
      <InterpolatedSurface points={gridPoints} degreeU={3} degreeV={3} resolutionU={resolutionU} resolutionV={resolutionV}>
        <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      </InterpolatedSurface>
      {/* Show the through-points */}
      {gridPoints.flat().map((pt, i) => <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.05, 8, 8]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>)}
    </>
}`,...(E=(D=M.parameters)==null?void 0:D.docs)==null?void 0:E.source}}};var R,B,F;A.parameters={...A.parameters,docs:{...(R=A.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    color: "#ff8844",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20
  },
  render: ({
    color = "#ff8844",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20
  }: Record<string, any>) => <InterpolatedSurface points={gridPoints} degreeU={3} degreeV={3} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </InterpolatedSurface>
}`,...(F=(B=A.parameters)==null?void 0:B.docs)==null?void 0:F.source}}};const Y=["Default","Wireframe"];export{M as Default,A as Wireframe,Y as __namedExportsOrder,X as default};
