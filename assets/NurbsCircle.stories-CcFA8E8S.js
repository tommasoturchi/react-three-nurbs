import{j as r}from"./jsx-runtime-BjG_zV1W.js";import{C as f,O as x}from"./curve-CMOorlFs.js";import{N as m}from"./NurbsCircle-Ma14imfU.js";import"./index-Bqq-F1qZ.js";import"./index-BeZzvLdV.js";import"./construct-DAf8_fEZ.js";import"./Line-C9ZHJoHX.js";const b={title:"Curves/Circle",parameters:{layout:"centered"},decorators:[e=>r.jsx("div",{style:{width:"100vw",height:"100vh"},children:r.jsxs(f,{camera:{position:[3,3,3],fov:50},children:[r.jsx("ambientLight",{intensity:.5}),r.jsx(e,{}),r.jsx(x,{})]})})],argTypes:{color:{control:"color",description:"Circle color"},radius:{control:{type:"range",min:.1,max:3,step:.1},description:"Circle radius"},resolution:{control:{type:"range",min:16,max:128,step:8},description:"Sampling resolution"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"}}},o={args:{color:"#0066ff",radius:1,resolution:64,lineWidth:2},render:({color:e="#0066ff",radius:n=1,resolution:s=64,lineWidth:t=2})=>r.jsx(m,{center:[0,0,0],radius:n,resolution:s,color:e,lineWidth:t})},i={args:{color:"#ff0066",radius:1.5,resolution:64,lineWidth:2},render:({color:e="#ff0066",radius:n=1.5,resolution:s=64,lineWidth:t=2})=>r.jsx(m,{center:[0,0,0],xaxis:[1,0,0],yaxis:[0,1,1],radius:n,resolution:s,color:e,lineWidth:t})};var a,l,c;o.parameters={...o.parameters,docs:{...(a=o.parameters)==null?void 0:a.docs,source:{originalSource:`{
  args: {
    color: "#0066ff",
    radius: 1,
    resolution: 64,
    lineWidth: 2
  },
  render: ({
    color = "#0066ff",
    radius = 1,
    resolution = 64,
    lineWidth = 2
  }: Record<string, any>) => <NurbsCircle center={[0, 0, 0]} radius={radius} resolution={resolution} color={color} lineWidth={lineWidth} />
}`,...(c=(l=o.parameters)==null?void 0:l.docs)==null?void 0:c.source}}};var d,u,p;i.parameters={...i.parameters,docs:{...(d=i.parameters)==null?void 0:d.docs,source:{originalSource:`{
  args: {
    color: "#ff0066",
    radius: 1.5,
    resolution: 64,
    lineWidth: 2
  },
  render: ({
    color = "#ff0066",
    radius = 1.5,
    resolution = 64,
    lineWidth = 2
  }: Record<string, any>) => <NurbsCircle center={[0, 0, 0]} xaxis={[1, 0, 0]} yaxis={[0, 1, 1]} radius={radius} resolution={resolution} color={color} lineWidth={lineWidth} />
}`,...(p=(u=i.parameters)==null?void 0:u.docs)==null?void 0:p.source}}};const N=["Default","TiltedCircle"];export{o as Default,i as TiltedCircle,N as __namedExportsOrder,b as default};
