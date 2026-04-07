import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{C as y,O as b}from"./curve-y__KqdvR.js";import{N as l}from"./NurbsCurve-CqxZhzUi.js";import"./index-Bc2G9s8g.js";import"./nurbs-D1dIikfG.js";import"./Line-CsLz4hyq.js";const L={title:"Curves/NURBS Curve",parameters:{layout:"centered"},decorators:[r=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(y,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(r,{}),e.jsx(b,{})]})})],argTypes:{color:{control:"color",description:"Line color"},resolution:{control:{type:"range",min:10,max:200,step:10},description:"Number of points sampled along the curve"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"},dashed:{control:"boolean",description:"Dashed line"}}},t={args:{color:"#ff0000",resolution:50,lineWidth:2,dashed:!1},render:({color:r="#ff0000",resolution:o=50,lineWidth:s=2,dashed:n=!1})=>e.jsx(l,{points:[[0,0,0],[1,1,0],[2,0,0]],degree:2,knots:[0,0,0,1,1,1],resolution:o,color:r,lineWidth:s,dashed:n})},i={args:{color:"#00ff00",resolution:50,lineWidth:2,dashed:!1},render:({color:r="#00ff00",resolution:o=50,lineWidth:s=2,dashed:n=!1})=>e.jsx(l,{points:[[0,0,0],[1,1,0],[2,1,0],[3,0,0]],degree:3,knots:[0,0,0,0,1,1,1,1],resolution:o,color:r,lineWidth:s,dashed:n})},d={args:{color:"#0000ff",resolution:50,lineWidth:2,dashed:!1},render:({color:r="#0000ff",resolution:o=50,lineWidth:s=2,dashed:n=!1})=>e.jsx(l,{points:[[0,0,0],[1,1,0],[2,0,0]],degree:2,knots:[0,0,0,1,1,1],weights:[1,2,1],resolution:o,color:r,lineWidth:s,dashed:n})},a={args:{color:"#ff00ff",resolution:80,lineWidth:2,dashed:!1},render:({color:r="#ff00ff",resolution:o=80,lineWidth:s=2,dashed:n=!1})=>e.jsx(l,{points:[[0,0,0],[.5,1,0],[1.5,-.5,.5],[2,1,1],[3,0,0]],degree:3,resolution:o,color:r,lineWidth:s,dashed:n})};var c,f,u;t.parameters={...t.parameters,docs:{...(c=t.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    color: "#ff0000",
    resolution: 50,
    lineWidth: 2,
    dashed: false
  },
  render: ({
    color = "#ff0000",
    resolution = 50,
    lineWidth = 2,
    dashed = false
  }: Record<string, any>) => <NurbsCurve points={[[0, 0, 0], [1, 1, 0], [2, 0, 0]]} degree={2} knots={[0, 0, 0, 1, 1, 1]} resolution={resolution} color={color} lineWidth={lineWidth} dashed={dashed} />
}`,...(u=(f=t.parameters)==null?void 0:f.docs)==null?void 0:u.source}}};var h,p,g;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    color: "#00ff00",
    resolution: 50,
    lineWidth: 2,
    dashed: false
  },
  render: ({
    color = "#00ff00",
    resolution = 50,
    lineWidth = 2,
    dashed = false
  }: Record<string, any>) => <NurbsCurve points={[[0, 0, 0], [1, 1, 0], [2, 1, 0], [3, 0, 0]]} degree={3} knots={[0, 0, 0, 0, 1, 1, 1, 1]} resolution={resolution} color={color} lineWidth={lineWidth} dashed={dashed} />
}`,...(g=(p=i.parameters)==null?void 0:p.docs)==null?void 0:g.source}}};var m,W,v;d.parameters={...d.parameters,docs:{...(m=d.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    color: "#0000ff",
    resolution: 50,
    lineWidth: 2,
    dashed: false
  },
  render: ({
    color = "#0000ff",
    resolution = 50,
    lineWidth = 2,
    dashed = false
  }: Record<string, any>) => <NurbsCurve points={[[0, 0, 0], [1, 1, 0], [2, 0, 0]]} degree={2} knots={[0, 0, 0, 1, 1, 1]} weights={[1, 2, 1]} resolution={resolution} color={color} lineWidth={lineWidth} dashed={dashed} />
}`,...(v=(W=d.parameters)==null?void 0:W.docs)==null?void 0:v.source}}};var x,C,j;a.parameters={...a.parameters,docs:{...(x=a.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    color: "#ff00ff",
    resolution: 80,
    lineWidth: 2,
    dashed: false
  },
  render: ({
    color = "#ff00ff",
    resolution = 80,
    lineWidth = 2,
    dashed = false
  }: Record<string, any>) => <NurbsCurve points={[[0, 0, 0], [0.5, 1, 0], [1.5, -0.5, 0.5], [2, 1, 1], [3, 0, 0]]} degree={3} resolution={resolution} color={color} lineWidth={lineWidth} dashed={dashed} />
}`,...(j=(C=a.parameters)==null?void 0:C.docs)==null?void 0:j.source}}};const O=["Degree2Curve","Degree3Curve","WeightedCurve","AutoKnots"];export{a as AutoKnots,t as Degree2Curve,i as Degree3Curve,d as WeightedCurve,O as __namedExportsOrder,L as default};
