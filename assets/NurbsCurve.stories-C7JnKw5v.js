import{j as e}from"./jsx-runtime-DiklIkkE.js";import{C as I,O as L}from"./verb.es-vEISxjAU.js";import{N as M}from"./NurbsCurve-DhYxFihl.js";import"./index-DRjF_FHU.js";const A={title:"Components/NurbsCurve",component:M,parameters:{layout:"centered"},tags:["autodocs"],decorators:[E=>e.jsx("div",{style:{width:"100%",height:"100%"},children:e.jsxs(I,{camera:{position:[5,5,5],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(E,{}),e.jsx(L,{})]})})]},c=[[0,0,0],[1,1,0],[2,0,0],[3,1,0],[4,0,0]],d=[0,0,0,.25,.5,.75,1,1,1],r={args:{points:c,knots:d,degree:2,color:"black"}},o={args:{points:c,knots:d,degree:2,color:"red",dashed:!0,segments:!0}},s={args:{points:c,knots:d,degree:2,vertexColors:[[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1]]}},n={args:{points:c,knots:d,degree:2,curveResolution:100,color:"blue",position:[0,0,0],rotation:[0,Math.PI/4,0],scale:[1,1,1]}},t={args:{points:[[0,0,0],[1,1,0],[2,0,0]],degree:2,knots:[0,0,0,1,1,1],resolution:50,color:"#ff0000",lineWidth:1}},a={args:{points:[[0,0,0],[1,1,0],[2,1,0],[3,0,0]],degree:3,knots:[0,0,0,0,1,1,1,1],resolution:50,color:"#00ff00",lineWidth:1}},i={args:{points:[[0,0,0],[1,1,0],[2,0,0]],degree:2,knots:[0,0,0,1,1,1],weights:[1,2,1],resolution:50,color:"#0000ff",lineWidth:1}};var u,p,l;r.parameters={...r.parameters,docs:{...(u=r.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    points,
    knots,
    degree: 2,
    color: 'black'
  }
}`,...(l=(p=r.parameters)==null?void 0:p.docs)==null?void 0:l.source}}};var g,m,C;o.parameters={...o.parameters,docs:{...(g=o.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    points,
    knots,
    degree: 2,
    color: 'red',
    dashed: true,
    segments: true
  }
}`,...(C=(m=o.parameters)==null?void 0:m.docs)==null?void 0:C.source}}};var h,v,f;s.parameters={...s.parameters,docs:{...(h=s.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    points,
    knots,
    degree: 2,
    vertexColors: [[1, 0, 0],
    // red
    [0, 1, 0],
    // green
    [0, 0, 1],
    // blue
    [1, 1, 0],
    // yellow
    [1, 0, 1] // magenta
    ]
  }
}`,...(f=(v=s.parameters)==null?void 0:v.docs)==null?void 0:f.source}}};var k,x,b;n.parameters={...n.parameters,docs:{...(k=n.parameters)==null?void 0:k.docs,source:{originalSource:`{
  args: {
    points,
    knots,
    degree: 2,
    curveResolution: 100,
    color: 'blue',
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1]
  }
}`,...(b=(x=n.parameters)==null?void 0:x.docs)==null?void 0:b.source}}};var S,j,W;t.parameters={...t.parameters,docs:{...(S=t.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    points: [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    resolution: 50,
    color: '#ff0000',
    lineWidth: 1
  }
}`,...(W=(j=t.parameters)==null?void 0:j.docs)==null?void 0:W.source}}};var D,w,y;a.parameters={...a.parameters,docs:{...(D=a.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    points: [[0, 0, 0], [1, 1, 0], [2, 1, 0], [3, 0, 0]],
    degree: 3,
    knots: [0, 0, 0, 0, 1, 1, 1, 1],
    resolution: 50,
    color: '#00ff00',
    lineWidth: 1
  }
}`,...(y=(w=a.parameters)==null?void 0:w.docs)==null?void 0:y.source}}};var N,O,R;i.parameters={...i.parameters,docs:{...(N=i.parameters)==null?void 0:N.docs,source:{originalSource:`{
  args: {
    points: [[0, 0, 0], [1, 1, 0], [2, 0, 0]],
    degree: 2,
    knots: [0, 0, 0, 1, 1, 1],
    weights: [1, 2, 1],
    resolution: 50,
    color: '#0000ff',
    lineWidth: 1
  }
}`,...(R=(O=i.parameters)==null?void 0:O.docs)==null?void 0:R.source}}};const B=["SimpleCurve","DashedCurve","ColoredCurve","CustomCurve","Degree2Curve","Degree3Curve","WeightedCurve"];export{s as ColoredCurve,n as CustomCurve,o as DashedCurve,t as Degree2Curve,a as Degree3Curve,r as SimpleCurve,i as WeightedCurve,B as __namedExportsOrder,A as default};
