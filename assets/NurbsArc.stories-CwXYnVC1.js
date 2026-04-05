import{j as r}from"./jsx-runtime-DFAAy_2V.js";import{N as P,V as W,C as j,O as V}from"./curve-CYvlzlZm.js";import{r as N}from"./index-Bc2G9s8g.js";import{a as T}from"./construct-BPpITUJd.js";import{L as q}from"./Line-BLcUCERj.js";const m=({center:e=[0,0,0],radius:n=1,xaxis:t=[1,0,0],yaxis:a=[0,1,0],startAngle:s=0,endAngle:o=Math.PI/2,resolution:u=50,color:x="black",...v})=>{const p=N.useMemo(()=>{try{const c=new P(T(e,t,a,n,s,o));return Array.from({length:u+1},(w,I)=>{const M=I/u,d=c.point(M);return new W(d[0],d[1],d[2])})}catch(c){return console.error("NurbsArc: Error creating arc:",c),[]}},[e,t,a,n,s,o,u]);return p.length===0?null:r.jsx(q,{points:p,color:x,...v})};m.__docgenInfo={description:"",methods:[],displayName:"NurbsArc",props:{center:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},radius:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},xaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},yaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 1, 0]",computed:!1}},startAngle:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},endAngle:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"Math.PI / 2",computed:!1}},resolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"50",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"black"',computed:!1}}},composes:["Omit"]};const O={title:"Components/NurbsArc",parameters:{layout:"centered"},decorators:[e=>r.jsx("div",{style:{width:"100vw",height:"100vh"},children:r.jsxs(j,{camera:{position:[3,3,3],fov:50},children:[r.jsx("ambientLight",{intensity:.5}),r.jsx(e,{}),r.jsx(V,{})]})})],argTypes:{color:{control:"color",description:"Arc color"},radius:{control:{type:"range",min:.1,max:3,step:.1},description:"Arc radius"},startAngle:{control:{type:"range",min:0,max:6.28,step:.1},description:"Start angle (radians)"},endAngle:{control:{type:"range",min:0,max:6.28,step:.1},description:"End angle (radians)"},resolution:{control:{type:"range",min:10,max:100,step:5},description:"Sampling resolution"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"}}},l={args:{color:"#ff6600",radius:1,startAngle:0,endAngle:Math.PI/2,resolution:50,lineWidth:2},render:({color:e="#ff6600",radius:n=1,startAngle:t=0,endAngle:a=Math.PI/2,resolution:s=50,lineWidth:o=2})=>r.jsx(m,{center:[0,0,0],radius:n,startAngle:t,endAngle:a,resolution:s,color:e,lineWidth:o})},i={args:{color:"#00cc66",radius:1.5,startAngle:0,endAngle:Math.PI,resolution:50,lineWidth:2},render:({color:e="#00cc66",radius:n=1.5,startAngle:t=0,endAngle:a=Math.PI,resolution:s=50,lineWidth:o=2})=>r.jsx(m,{center:[0,0,0],radius:n,startAngle:t,endAngle:a,resolution:s,color:e,lineWidth:o})};var g,f,b;l.parameters={...l.parameters,docs:{...(g=l.parameters)==null?void 0:g.docs,source:{originalSource:`{
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
}`,...(b=(f=l.parameters)==null?void 0:f.docs)==null?void 0:b.source}}};var h,A,y;i.parameters={...i.parameters,docs:{...(h=i.parameters)==null?void 0:h.docs,source:{originalSource:`{
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
}`,...(y=(A=i.parameters)==null?void 0:A.docs)==null?void 0:y.source}}};const R=["Default","Semicircle"];export{l as Default,i as Semicircle,R as __namedExportsOrder,O as default};
