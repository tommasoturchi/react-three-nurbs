import{j as r}from"./jsx-runtime-DFAAy_2V.js";import{N as W,V as j,C as N,O as T}from"./curve-CYvlzlZm.js";import{r as w}from"./index-Bc2G9s8g.js";import{b as V}from"./construct-BPpITUJd.js";import{L as q}from"./Line-BLcUCERj.js";const c=({center:e=[0,0,0],radius:n=1,xaxis:t=[1,0,0],yaxis:s=[0,1,0],resolution:a=64,color:g="black",...y})=>{const m=w.useMemo(()=>{try{const l=new W(V(e,t,s,n));return Array.from({length:a+1},(_,C)=>{const v=C/a,u=l.point(v);return new j(u[0],u[1],u[2])})}catch(l){return console.error("NurbsCircle: Error creating circle:",l),[]}},[e,t,s,n,a]);return m.length===0?null:r.jsx(q,{points:m,color:g,...y})};c.__docgenInfo={description:"",methods:[],displayName:"NurbsCircle",props:{center:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},radius:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},xaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},yaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 1, 0]",computed:!1}},resolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"64",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"black"',computed:!1}}},composes:["Omit"]};const k={title:"Components/NurbsCircle",parameters:{layout:"centered"},decorators:[e=>r.jsx("div",{style:{width:"100vw",height:"100vh"},children:r.jsxs(N,{camera:{position:[3,3,3],fov:50},children:[r.jsx("ambientLight",{intensity:.5}),r.jsx(e,{}),r.jsx(T,{})]})})],argTypes:{color:{control:"color",description:"Circle color"},radius:{control:{type:"range",min:.1,max:3,step:.1},description:"Circle radius"},resolution:{control:{type:"range",min:16,max:128,step:8},description:"Sampling resolution"},lineWidth:{control:{type:"range",min:1,max:10,step:.5},description:"Line width"}}},o={args:{color:"#0066ff",radius:1,resolution:64,lineWidth:2},render:({color:e="#0066ff",radius:n=1,resolution:t=64,lineWidth:s=2})=>r.jsx(c,{center:[0,0,0],radius:n,resolution:t,color:e,lineWidth:s})},i={args:{color:"#ff0066",radius:1.5,resolution:64,lineWidth:2},render:({color:e="#ff0066",radius:n=1.5,resolution:t=64,lineWidth:s=2})=>r.jsx(c,{center:[0,0,0],xaxis:[1,0,0],yaxis:[0,1,1],radius:n,resolution:t,color:e,lineWidth:s})};var d,p,f;o.parameters={...o.parameters,docs:{...(d=o.parameters)==null?void 0:d.docs,source:{originalSource:`{
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
}`,...(f=(p=o.parameters)==null?void 0:p.docs)==null?void 0:f.source}}};var b,h,x;i.parameters={...i.parameters,docs:{...(b=i.parameters)==null?void 0:b.docs,source:{originalSource:`{
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
}`,...(x=(h=i.parameters)==null?void 0:h.docs)==null?void 0:x.source}}};const D=["Default","TiltedCircle"];export{o as Default,i as TiltedCircle,D as __namedExportsOrder,k as default};
