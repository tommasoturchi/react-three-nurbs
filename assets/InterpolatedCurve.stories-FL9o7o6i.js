import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{N as b,V as W,C as w,O as I}from"./curve-CYvlzlZm.js";import{r as P}from"./index-Bc2G9s8g.js";import{L as k}from"./Line-BLcUCERj.js";const d=({throughPoints:r,degree:n=3,resolution:o=50,color:a="black",...t})=>{const s=P.useMemo(()=>{if(!r||r.length<2)return[];try{const c=b.byPoints(r,n);return Array.from({length:o+1},(B,j)=>{const C=j/o,p=c.point(C);return new W(p[0],p[1],p[2])})}catch(c){return console.error("InterpolatedCurve: Error creating curve:",c),[]}},[r,n,o]);return s.length===0?null:e.jsx(k,{points:s,color:a,...t})};d.__docgenInfo={description:"",methods:[],displayName:"InterpolatedCurve",props:{throughPoints:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"number"}],raw:"number[]"}],raw:"number[][]"},description:""},degree:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},resolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"50",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"black"',computed:!1}}},composes:["Omit"]};const V={title:"Components/InterpolatedCurve",parameters:{layout:"centered",docs:{description:{component:"Creates a smooth NURBS curve that passes exactly through a set of points. Unlike NurbsCurve (which uses control points that the curve is attracted to but doesn't touch), InterpolatedCurve guarantees the curve goes through every point. Orange spheres show the through-points."}}},decorators:[r=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(w,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx(r,{}),e.jsx(I,{})]})})],argTypes:{color:{control:"color",description:"Curve color"},resolution:{control:{type:"range",min:10,max:200,step:10},description:"Sampling resolution"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"},degree:{control:{type:"range",min:2,max:5,step:1},description:"Interpolation degree (higher = smoother between points)"}}},u=[[0,0,0],[.5,1,.3],[1,.2,.8],[1.5,.8,1.2],[2,0,.5],[2.5,-.5,0]],i={args:{color:"#ff0000",resolution:150,lineWidth:2,degree:3},render:({color:r="#ff0000",resolution:n=150,lineWidth:o=2,degree:a=3})=>e.jsxs(e.Fragment,{children:[e.jsx(d,{throughPoints:u,degree:a,resolution:n,color:r,lineWidth:o}),u.map((t,s)=>e.jsxs("mesh",{position:[t[0],t[1],t[2]],children:[e.jsx("sphereGeometry",{args:[.04,16,16]}),e.jsx("meshBasicMaterial",{color:"#ffaa00"})]},s))]})},m=[[-2,0,0],[-1,1,0],[0,0,0],[1,-1,0],[2,0,0],[3,1,0],[4,0,0]],l={args:{color:"#0066ff",resolution:100,lineWidth:2,degree:3},render:({color:r="#0066ff",resolution:n=100,lineWidth:o=2,degree:a=3})=>e.jsxs(e.Fragment,{children:[e.jsx(d,{throughPoints:m,degree:a,resolution:n,color:r,lineWidth:o}),m.map((t,s)=>e.jsxs("mesh",{position:[t[0],t[1],t[2]],children:[e.jsx("sphereGeometry",{args:[.05,16,16]}),e.jsx("meshBasicMaterial",{color:"#ffaa00"})]},s))]})};var h,g,f;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(f=(g=i.parameters)==null?void 0:g.docs)==null?void 0:f.source}}};var v,y,x;l.parameters={...l.parameters,docs:{...(v=l.parameters)==null?void 0:v.docs,source:{originalSource:`{
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
}`,...(x=(y=l.parameters)==null?void 0:y.docs)==null?void 0:x.source}}};const _=["Default","Wave"];export{i as Default,l as Wave,_ as __namedExportsOrder,V as default};
