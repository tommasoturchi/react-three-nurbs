import{j as r}from"./jsx-runtime-BjG_zV1W.js";import{C as h,O as x}from"./curve-CMOorlFs.js";import{N as A}from"./NurbsArc-BY20Rar1.js";import"./index-Bqq-F1qZ.js";import"./index-BeZzvLdV.js";import"./construct-DAf8_fEZ.js";import"./Line-C9ZHJoHX.js";const v={title:"Curves/Arc",parameters:{layout:"centered"},decorators:[e=>r.jsx("div",{style:{width:"100vw",height:"100vh"},children:r.jsxs(h,{camera:{position:[3,3,3],fov:50},children:[r.jsx("ambientLight",{intensity:.5}),r.jsx(e,{}),r.jsx(x,{})]})})],argTypes:{color:{control:"color",description:"Arc color"},radius:{control:{type:"range",min:.1,max:3,step:.1},description:"Arc radius"},startAngle:{control:{type:"range",min:0,max:6.28,step:.1},description:"Start angle (radians)"},endAngle:{control:{type:"range",min:0,max:6.28,step:.1},description:"End angle (radians)"},resolution:{control:{type:"range",min:10,max:100,step:5},description:"Sampling resolution"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"}}},n={args:{color:"#ff6600",radius:1,startAngle:0,endAngle:Math.PI/2,resolution:50,lineWidth:2},render:({color:e="#ff6600",radius:o=1,startAngle:s=0,endAngle:i=Math.PI/2,resolution:a=50,lineWidth:l=2})=>r.jsx(A,{center:[0,0,0],radius:o,startAngle:s,endAngle:i,resolution:a,color:e,lineWidth:l})},t={args:{color:"#00cc66",radius:1.5,startAngle:0,endAngle:Math.PI,resolution:50,lineWidth:2},render:({color:e="#00cc66",radius:o=1.5,startAngle:s=0,endAngle:i=Math.PI,resolution:a=50,lineWidth:l=2})=>r.jsx(A,{center:[0,0,0],radius:o,startAngle:s,endAngle:i,resolution:a,color:e,lineWidth:l})};var c,d,g;n.parameters={...n.parameters,docs:{...(c=n.parameters)==null?void 0:c.docs,source:{originalSource:`{
  args: {
    color: "#ff6600",
    radius: 1,
    startAngle: 0,
    endAngle: Math.PI / 2,
    resolution: 50,
    lineWidth: 2
  },
  render: ({
    color = "#ff6600",
    radius = 1,
    startAngle = 0,
    endAngle = Math.PI / 2,
    resolution = 50,
    lineWidth = 2
  }: Record<string, any>) => <NurbsArc center={[0, 0, 0]} radius={radius} startAngle={startAngle} endAngle={endAngle} resolution={resolution} color={color} lineWidth={lineWidth} />
}`,...(g=(d=n.parameters)==null?void 0:d.docs)==null?void 0:g.source}}};var u,p,m;t.parameters={...t.parameters,docs:{...(u=t.parameters)==null?void 0:u.docs,source:{originalSource:`{
  args: {
    color: "#00cc66",
    radius: 1.5,
    startAngle: 0,
    endAngle: Math.PI,
    resolution: 50,
    lineWidth: 2
  },
  render: ({
    color = "#00cc66",
    radius = 1.5,
    startAngle = 0,
    endAngle = Math.PI,
    resolution = 50,
    lineWidth = 2
  }: Record<string, any>) => <NurbsArc center={[0, 0, 0]} radius={radius} startAngle={startAngle} endAngle={endAngle} resolution={resolution} color={color} lineWidth={lineWidth} />
}`,...(m=(p=t.parameters)==null?void 0:p.docs)==null?void 0:m.source}}};const S=["Default","Semicircle"];export{n as Default,t as Semicircle,S as __namedExportsOrder,v as default};
