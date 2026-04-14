import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as N}from"./index-Bc2G9s8g.js";import{D as j,C as T,O as C,V as u}from"./curve-y__KqdvR.js";import{N as D}from"./surface-C_JOQJf4.js";import{N as w}from"./NurbsSurface-CQXq4uhV.js";import{u as A}from"./useNurbsSurface-DMZlIm4R.js";import{L as H}from"./Line-CsLz4hyq.js";import"./nurbs-D1dIikfG.js";import"./materials-D2_MRo5E.js";const q={title:"Surfaces/Operations",parameters:{layout:"centered"},decorators:[s=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(T,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(s,{}),e.jsx(C,{})]})})]},p=[[[0,0,0],[.5,0,.3],[1,0,-.2],[1.5,0,.1],[2,0,0]],[[0,.5,.2],[.5,.5,.8],[1,.5,.5],[1.5,.5,.6],[2,.5,.1]],[[0,1,-.1],[.5,1,.4],[1,1,1],[1.5,1,.3],[2,1,-.1]],[[0,1.5,.1],[.5,1.5,.6],[1,1.5,.5],[1.5,1.5,.7],[2,1.5,.2]],[[0,2,0],[.5,2,.2],[1,2,-.1],[1.5,2,.1],[2,2,0]]],m=p.map(s=>s.map(()=>1));function _(){const{surface:s}=A({controlPoints:p,weights:m,degreeU:3,degreeV:3}),i=N.useMemo(()=>{if(!s)return[];const r=50,n=[],d=s.isocurve(0,!1);n.push({points:Array.from({length:r+1},(t,l)=>{const o=d.point(l/r);return new u(o[0],o[1],o[2])}),color:"#ff0000",label:"u=0"});const f=s.isocurve(1,!1);n.push({points:Array.from({length:r+1},(t,l)=>{const o=f.point(l/r);return new u(o[0],o[1],o[2])}),color:"#00ff00",label:"u=1"});const c=s.isocurve(0,!0);n.push({points:Array.from({length:r+1},(t,l)=>{const o=c.point(l/r);return new u(o[0],o[1],o[2])}),color:"#0000ff",label:"v=0"});const a=s.isocurve(1,!0);return n.push({points:Array.from({length:r+1},(t,l)=>{const o=a.point(l/r);return new u(o[0],o[1],o[2])}),color:"#ffaa00",label:"v=1"}),n},[s]);return e.jsxs(e.Fragment,{children:[e.jsx(w,{controlPoints:p,weights:m,degreeU:3,degreeV:3,resolutionU:30,resolutionV:30,children:e.jsx("meshPhongMaterial",{color:"#aaaacc",transparent:!0,opacity:.5,side:j,depthWrite:!1})}),i.map(r=>e.jsx(H,{points:r.points,color:r.color,lineWidth:3},r.label))]})}const g={render:()=>e.jsx(_,{})};function B({numTestPoints:s=6}){const i=N.useMemo(()=>{const r=D.byKnotsControlPointsWeights(3,3,[0,0,0,0,.5,1,1,1,1],[0,0,0,0,.5,1,1,1,1],p,m),n=Array.from({length:s},(c,a)=>[.5+1.5*Math.cos(a*1.3),.5+1.5*Math.sin(a*.9),1.5+Math.sin(a*2)]),d=[],f=[];for(const c of n){const a=r.closestParam(c),t=r.point(a[0],a[1]);d.push({from:new u(c[0],c[1],c[2]),to:new u(t[0],t[1],t[2])}),f.push(new u(t[0],t[1],t[2]))}return{testPts:n,lines:d,closestPts:f}},[s]);return e.jsxs(e.Fragment,{children:[e.jsx(w,{controlPoints:p,weights:m,degreeU:3,degreeV:3,resolutionU:30,resolutionV:30,children:e.jsx("meshPhongMaterial",{color:"#4488ff",transparent:!0,opacity:.6,side:j,depthWrite:!1})}),i.testPts.map((r,n)=>e.jsxs("mesh",{position:[r[0],r[1],r[2]],children:[e.jsx("sphereGeometry",{args:[.05,8,8]}),e.jsx("meshBasicMaterial",{color:"#ff0000"})]},`tp-${n}`)),i.closestPts.map((r,n)=>e.jsxs("mesh",{position:r,children:[e.jsx("sphereGeometry",{args:[.05,8,8]}),e.jsx("meshBasicMaterial",{color:"#00ff00"})]},`cp-${n}`)),i.lines.map((r,n)=>e.jsx(H,{points:[r.from,r.to],color:"#888888",lineWidth:1},`line-${n}`))]})}const h={args:{numTestPoints:6},argTypes:{numTestPoints:{control:{type:"range",min:2,max:15,step:1},description:"Number of test points"}},render:s=>e.jsx(B,{...s})},x={args:{resLow:5,resHigh:30},argTypes:{resLow:{control:{type:"range",min:2,max:15,step:1},description:"Low resolution"},resHigh:{control:{type:"range",min:15,max:60,step:5},description:"High resolution"}},render:({resLow:s=5,resHigh:i=30})=>e.jsxs(e.Fragment,{children:[e.jsx("group",{position:[-1.5,0,0],children:e.jsx(w,{controlPoints:p,weights:m,degreeU:3,degreeV:3,resolutionU:s,resolutionV:s,children:e.jsx("meshPhongMaterial",{color:"#ff4444",wireframe:!0,side:j})})}),e.jsx("group",{position:[1.5,0,0],children:e.jsx(w,{controlPoints:p,weights:m,degreeU:3,degreeV:3,resolutionU:i,resolutionV:i,children:e.jsx("meshPhongMaterial",{color:"#4488ff",wireframe:!0,side:j})})})]})};var y,P,S;g.parameters={...g.parameters,docs:{...(y=g.parameters)==null?void 0:y.docs,source:{originalSource:`{
  render: () => <SurfaceBoundariesDemo />
}`,...(S=(P=g.parameters)==null?void 0:P.docs)==null?void 0:S.source}}};var b,v,V;h.parameters={...h.parameters,docs:{...(b=h.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    numTestPoints: 6
  },
  argTypes: {
    numTestPoints: {
      control: {
        type: "range",
        min: 2,
        max: 15,
        step: 1
      },
      description: "Number of test points"
    }
  },
  render: (args: Record<string, any>) => <SurfaceClosestPointDemo {...args} />
}`,...(V=(v=h.parameters)==null?void 0:v.docs)==null?void 0:V.source}}};var L,M,U;x.parameters={...x.parameters,docs:{...(L=x.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    resLow: 5,
    resHigh: 30
  },
  argTypes: {
    resLow: {
      control: {
        type: "range",
        min: 2,
        max: 15,
        step: 1
      },
      description: "Low resolution"
    },
    resHigh: {
      control: {
        type: "range",
        min: 15,
        max: 60,
        step: 5
      },
      description: "High resolution"
    }
  },
  render: ({
    resLow = 5,
    resHigh = 30
  }: Record<string, any>) => <>
      {/* Low res - offset left */}
      <group position={[-1.5, 0, 0]}>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={3} degreeV={3} resolutionU={resLow} resolutionV={resLow}>
          <meshPhongMaterial color="#ff4444" wireframe side={DoubleSide} />
        </NurbsSurface>
      </group>
      {/* High res - offset right */}
      <group position={[1.5, 0, 0]}>
        <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={3} degreeV={3} resolutionU={resHigh} resolutionV={resHigh}>
          <meshPhongMaterial color="#4488ff" wireframe side={DoubleSide} />
        </NurbsSurface>
      </group>
    </>
}`,...(U=(M=x.parameters)==null?void 0:M.docs)==null?void 0:U.source}}};const z=["SurfaceBoundaries","SurfaceClosestPoint","AdaptiveTessellation"];export{x as AdaptiveTessellation,g as SurfaceBoundaries,h as SurfaceClosestPoint,z as __namedExportsOrder,q as default};
