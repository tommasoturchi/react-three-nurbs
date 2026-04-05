import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{D as c,C as j,O as P}from"./curve-CYvlzlZm.js";import{N as u}from"./NurbsSurface-DrPwcZPL.js";import"./index-Bc2G9s8g.js";import"./surface-BKt_FIQR.js";import"./nurbs-DVTS2-kg.js";import"./materials-D2_MRo5E.js";const T={title:"Components/NurbsSurface",parameters:{layout:"centered"},decorators:[r=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(j,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(r,{}),e.jsx(P,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:2,max:60,step:2},description:"Tessellation resolution in U direction"},resolutionV:{control:{type:"range",min:2,max:60,step:2},description:"Tessellation resolution in V direction"},degreeU:{control:{type:"range",min:1,max:3,step:1},description:"Surface degree in U direction"},degreeV:{control:{type:"range",min:1,max:3,step:1},description:"Surface degree in V direction"}}},b=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],f=[[1,1,1],[1,1,1],[1,1,1]],a={args:{color:"#ff0000",wireframe:!0,resolutionU:20,resolutionV:20,degreeU:2,degreeV:2},render:({color:r="#ff0000",wireframe:o=!0,resolutionU:n=20,resolutionV:s=20,degreeU:t=2,degreeV:i=2})=>e.jsx(u,{controlPoints:b,weights:f,degreeU:t,degreeV:i,resolutionU:n,resolutionV:s,children:e.jsx("meshStandardMaterial",{color:r,wireframe:o,side:c})})},y=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,2],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],l={args:{color:"#00ff00",wireframe:!1,resolutionU:30,resolutionV:30,degreeU:2,degreeV:2},render:({color:r="#00ff00",wireframe:o=!1,resolutionU:n=30,resolutionV:s=30,degreeU:t=2,degreeV:i=2})=>e.jsx(u,{controlPoints:y,weights:f,degreeU:t,degreeV:i,resolutionU:n,resolutionV:s,children:e.jsx("meshStandardMaterial",{color:r,wireframe:o,metalness:.5,roughness:.5,side:c})})},d={args:{color:"#0000ff",wireframe:!1,resolutionU:20,resolutionV:20,degreeU:2,degreeV:2},render:({color:r="#0000ff",wireframe:o=!1,resolutionU:n=20,resolutionV:s=20,degreeU:t=2,degreeV:i=2})=>e.jsx(u,{controlPoints:b,weights:f,degreeU:t,degreeV:i,resolutionU:n,resolutionV:s,rotation:[0,Math.PI/4,0],children:e.jsx("meshPhongMaterial",{color:r,wireframe:o,shininess:100,side:c})})};var g,m,p;a.parameters={...a.parameters,docs:{...(g=a.parameters)==null?void 0:g.docs,source:{originalSource:`{
  args: {
    color: "#ff0000",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    degreeU: 2,
    degreeV: 2
  },
  render: ({
    color = "#ff0000",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    degreeU = 2,
    degreeV = 2
  }: Record<string, any>) => <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={degreeU} degreeV={degreeV} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </NurbsSurface>
}`,...(p=(m=a.parameters)==null?void 0:m.docs)==null?void 0:p.source}}};var U,V,h;l.parameters={...l.parameters,docs:{...(U=l.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    color: "#00ff00",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    degreeU: 2,
    degreeV: 2
  },
  render: ({
    color = "#00ff00",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    degreeU = 2,
    degreeV = 2
  }: Record<string, any>) => <NurbsSurface controlPoints={bulgedControlPoints} weights={weights} degreeU={degreeU} degreeV={degreeV} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshStandardMaterial color={color} wireframe={wireframe} metalness={0.5} roughness={0.5} side={DoubleSide} />
    </NurbsSurface>
}`,...(h=(V=l.parameters)==null?void 0:V.docs)==null?void 0:h.source}}};var S,w,x;d.parameters={...d.parameters,docs:{...(S=d.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    color: "#0000ff",
    wireframe: false,
    resolutionU: 20,
    resolutionV: 20,
    degreeU: 2,
    degreeV: 2
  },
  render: ({
    color = "#0000ff",
    wireframe = false,
    resolutionU = 20,
    resolutionV = 20,
    degreeU = 2,
    degreeV = 2
  }: Record<string, any>) => <NurbsSurface controlPoints={controlPoints} weights={weights} degreeU={degreeU} degreeV={degreeV} resolutionU={resolutionU} resolutionV={resolutionV} rotation={[0, Math.PI / 4, 0]}>
      <meshPhongMaterial color={color} wireframe={wireframe} shininess={100} side={DoubleSide} />
    </NurbsSurface>
}`,...(x=(w=d.parameters)==null?void 0:w.docs)==null?void 0:x.source}}};const B=["SimpleSurface","BulgedSurface","CustomMaterialSurface"];export{l as BulgedSurface,d as CustomMaterialSurface,a as SimpleSurface,B as __namedExportsOrder,T as default};
