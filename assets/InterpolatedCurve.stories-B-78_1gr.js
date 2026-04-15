import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{C as v,O as j}from"./curve-CMOorlFs.js";import{I as x}from"./InterpolatedCurve-Cvwvrn_H.js";import"./index-Bqq-F1qZ.js";import"./index-BeZzvLdV.js";import"./Line-C9ZHJoHX.js";const b={title:"Curves/Interpolated Curve",parameters:{layout:"centered",docs:{description:{component:"Creates a smooth NURBS curve that passes exactly through a set of points. Unlike NurbsCurve (which uses control points that the curve is attracted to but doesn't touch), InterpolatedCurve guarantees the curve goes through every point. Orange spheres show the through-points."}}},decorators:[o=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(v,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx(o,{}),e.jsx(j,{})]})})],argTypes:{color:{control:"color",description:"Curve color"},resolution:{control:{type:"range",min:10,max:200,step:10},description:"Sampling resolution"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"},degree:{control:{type:"range",min:2,max:5,step:1},description:"Interpolation degree (higher = smoother between points)"}}},c=[[0,0,0],[.5,1,.3],[1,.2,.8],[1.5,.8,1.2],[2,0,.5],[2.5,-.5,0]],t={args:{color:"#ff0000",resolution:150,lineWidth:2,degree:3},render:({color:o="#ff0000",resolution:s=150,lineWidth:i=2,degree:a=3})=>e.jsxs(e.Fragment,{children:[e.jsx(x,{throughPoints:c,degree:a,resolution:s,color:o,lineWidth:i}),c.map((r,l)=>e.jsxs("mesh",{position:[r[0],r[1],r[2]],children:[e.jsx("sphereGeometry",{args:[.04,16,16]}),e.jsx("meshBasicMaterial",{color:"#ffaa00"})]},l))]})},h=[[-2,0,0],[-1,1,0],[0,0,0],[1,-1,0],[2,0,0],[3,1,0],[4,0,0]],n={args:{color:"#0066ff",resolution:100,lineWidth:2,degree:3},render:({color:o="#0066ff",resolution:s=100,lineWidth:i=2,degree:a=3})=>e.jsxs(e.Fragment,{children:[e.jsx(x,{throughPoints:h,degree:a,resolution:s,color:o,lineWidth:i}),h.map((r,l)=>e.jsxs("mesh",{position:[r[0],r[1],r[2]],children:[e.jsx("sphereGeometry",{args:[.05,16,16]}),e.jsx("meshBasicMaterial",{color:"#ffaa00"})]},l))]})};var d,p,m;t.parameters={...t.parameters,docs:{...(d=t.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    color: "#ff0000",
    resolution: 150,
    lineWidth: 2,
    degree: 3
  },
  render: ({
    color = "#ff0000",
    resolution = 150,
    lineWidth = 2,
    degree = 3
  }: Record<string, any>) => <>
      <InterpolatedCurve throughPoints={throughPoints} degree={degree} resolution={resolution} color={color} lineWidth={lineWidth} />
      {throughPoints.map((pt, i) => <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.04, 16, 16]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>)}
    </>
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};var u,g,f;n.parameters={...n.parameters,docs:{...(u=n.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    color: "#0066ff",
    resolution: 100,
    lineWidth: 2,
    degree: 3
  },
  render: ({
    color = "#0066ff",
    resolution = 100,
    lineWidth = 2,
    degree = 3
  }: Record<string, any>) => <>
      <InterpolatedCurve throughPoints={wavePoints} degree={degree} resolution={resolution} color={color} lineWidth={lineWidth} />
      {wavePoints.map((pt, i) => <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
          <sphereGeometry args={[0.05, 16, 16]} />
          <meshBasicMaterial color="#ffaa00" />
        </mesh>)}
    </>
}`,...(f=(g=n.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};const B=["Default","Wave"];export{t as Default,n as Wave,B as __namedExportsOrder,b as default};
