import{j as e}from"./jsx-runtime-DiklIkkE.js";import{C as m,O as f}from"./verb.es-vEISxjAU.js";import{N as h}from"./NurbsCurve-BwaQL-zY.js";import"./index-DRjF_FHU.js";const W={title:"Components/NurbsCurve",component:h,parameters:{layout:"centered"},tags:["autodocs"],decorators:[g=>e.jsx("div",{style:{width:"100%",height:"100%"},children:e.jsxs(m,{camera:{position:[5,5,5],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(g,{}),e.jsx(f,{})]})})]},r={args:{points:[[0,0,0],[1,1,0],[2,0,0]],degree:2,knots:[0,0,0,1,1,1],resolution:50,color:"#ff0000",lineWidth:1}},o={args:{points:[[0,0,0],[1,1,0],[2,1,0],[3,0,0]],degree:3,knots:[0,0,0,0,1,1,1,1],resolution:50,color:"#00ff00",lineWidth:1}},s={args:{points:[[0,0,0],[1,1,0],[2,0,0]],degree:2,knots:[0,0,0,1,1,1],weights:[1,2,1],resolution:50,color:"#0000ff",lineWidth:1}};var t,n,i;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    points: [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    resolution: 50,
    color: "#ff0000",
    lineWidth: 1
  }
}`,...(i=(n=r.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var a,c,d;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    points: [[0, 0, 0], [1, 1, 0], [2, 1, 0], [3, 0, 0]],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    resolution: 50,
    color: "#00ff00",
    lineWidth: 1
  }
}`,...(d=(c=o.parameters)==null?void 0:c.docs)==null?void 0:d.source}}};var p,u,l;s.parameters={...s.parameters,docs:{...(p=s.parameters)==null?void 0:p.docs,source:{originalSource:`{
  args: {
    points: [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    weights: [1, 2, 1],
    resolution: 50,
    color: "#0000ff",
    lineWidth: 1
  }
}`,...(l=(u=s.parameters)==null?void 0:u.docs)==null?void 0:l.source}}};const k=["Degree2Curve","Degree3Curve","WeightedCurve"];export{r as Degree2Curve,o as Degree3Curve,s as WeightedCurve,k as __namedExportsOrder,W as default};
