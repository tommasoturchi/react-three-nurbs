import{j as e}from"./jsx-runtime-DiklIkkE.js";import{C as h,O as S}from"./verb.es-vEISxjAU.js";import{N as x}from"./NurbsSurface-CTCV2Ahz.js";import"./index-DRjF_FHU.js";const C={title:"Components/NurbsSurface",component:x,parameters:{layout:"centered"},tags:["autodocs"],decorators:[p=>e.jsx("div",{style:{width:"100%",height:"100%"},children:e.jsxs(h,{camera:{position:[5,5,5],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(p,{}),e.jsx(S,{})]})})]},u=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],o=[[1,1,1],[1,1,1],[1,1,1]],r={args:{controlPoints:u,weights:o,degreeU:2,degreeV:2,color:"#ff0000",wireframe:!1}},s={args:{controlPoints:[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,2],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],weights:o,degreeU:2,degreeV:2,children:e.jsx("meshStandardMaterial",{color:"#00ff00",metalness:.5,roughness:.5,wireframe:!0})}},a={args:{controlPoints:u,weights:o,degreeU:2,degreeV:2,position:[0,0,0],rotation:[0,Math.PI/4,0],scale:[1,1,1],children:e.jsx("meshPhongMaterial",{color:"#0000ff",shininess:100,specular:"#ffffff",wireframe:!1})}};var t,n,i;r.parameters={...r.parameters,docs:{...(t=r.parameters)==null?void 0:t.docs,source:{originalSource:`{
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    color: "#ff0000",
    wireframe: false
  }
}`,...(i=(n=r.parameters)==null?void 0:n.docs)==null?void 0:i.source}}};var c,f,l;s.parameters={...s.parameters,docs:{...(c=s.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    controlPoints: [[[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 1, 0], [1, 1, 2], [2, 1, 0]], [[0, 2, 0], [1, 2, 0], [2, 2, 0]]],
    weights,
    degreeU: 2,
    degreeV: 2,
    children: <meshStandardMaterial color="#00ff00" metalness={0.5} roughness={0.5} wireframe={true} />
  }
}`,...(l=(f=s.parameters)==null?void 0:f.docs)==null?void 0:l.source}}};var m,d,g;a.parameters={...a.parameters,docs:{...(m=a.parameters)==null?void 0:m.docs,source:{originalSource:`{
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
    children: <meshPhongMaterial color="#0000ff" shininess={100} specular="#ffffff" wireframe={false} />
  }
}`,...(g=(d=a.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};const U=["SimpleSurface","BulgedSurface","CustomMaterialSurface"];export{s as BulgedSurface,a as CustomMaterialSurface,r as SimpleSurface,U as __namedExportsOrder,C as default};
