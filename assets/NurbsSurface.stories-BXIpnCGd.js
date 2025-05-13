import{j as e}from"./jsx-runtime-DiklIkkE.js";import{C as S,O as x,D as a}from"./verb.es-vEISxjAU.js";import{N as j}from"./NurbsSurface-CTCV2Ahz.js";import"./index-DRjF_FHU.js";const C={title:"Components/NurbsSurface",component:j,parameters:{layout:"centered"},tags:["autodocs"],decorators:[p=>e.jsx("div",{style:{width:"100%",height:"100%"},children:e.jsxs(S,{camera:{position:[5,5,5],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(p,{}),e.jsx(x,{})]})})]},h=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],t=[[1,1,1],[1,1,1],[1,1,1]],r={args:{controlPoints:h,weights:t,degreeU:2,degreeV:2,color:"#ff0000",wireframe:!0,children:e.jsx("meshStandardMaterial",{color:"#ff0000",wireframe:!0,side:a})}},s={args:{controlPoints:[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,2],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],weights:t,degreeU:2,degreeV:2,children:e.jsx("meshStandardMaterial",{color:"#00ff00",metalness:.5,roughness:.5,wireframe:!0,side:a})}},o={args:{controlPoints:h,weights:t,degreeU:2,degreeV:2,position:[0,0,0],rotation:[0,Math.PI/4,0],scale:[1,1,1],children:e.jsx("meshPhongMaterial",{color:"#0000ff",shininess:100,specular:"#ffffff",side:a})}};var n,i,c;r.parameters={...r.parameters,docs:{...(n=r.parameters)==null?void 0:n.docs,source:{originalSource:`{
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    color: "#ff0000",
    wireframe: true,
    children: <meshStandardMaterial color="#ff0000" wireframe={true} side={DoubleSide} />
  }
}`,...(c=(i=r.parameters)==null?void 0:i.docs)==null?void 0:c.source}}};var d,l,f;s.parameters={...s.parameters,docs:{...(d=s.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    controlPoints: [[[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 1, 0], [1, 1, 2], [2, 1, 0]], [[0, 2, 0], [1, 2, 0], [2, 2, 0]]],
    weights,
    degreeU: 2,
    degreeV: 2,
    children: <meshStandardMaterial color="#00ff00" metalness={0.5} roughness={0.5} wireframe={true} side={DoubleSide} />
  }
}`,...(f=(l=s.parameters)==null?void 0:l.docs)==null?void 0:f.source}}};var m,u,g;o.parameters={...o.parameters,docs:{...(m=o.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
    children: <meshPhongMaterial color="#0000ff" shininess={100} specular="#ffffff" side={DoubleSide} />
  }
}`,...(g=(u=o.parameters)==null?void 0:u.docs)==null?void 0:g.source}}};const U=["SimpleSurface","BulgedSurface","CustomMaterialSurface"];export{s as BulgedSurface,o as CustomMaterialSurface,r as SimpleSurface,U as __namedExportsOrder,C as default};
