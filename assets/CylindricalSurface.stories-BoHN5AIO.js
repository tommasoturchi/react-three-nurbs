import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{B as G,F as M,D as v,C as H,O as W}from"./curve-y__KqdvR.js";import{r as h}from"./index-Bc2G9s8g.js";import{N as k}from"./surface-C_JOQJf4.js";import{b as z}from"./construct-CJBnbS0Q.js";import{i as J}from"./materials-D2_MRo5E.js";const V=h.forwardRef(function({axis:i=[0,1,0],xaxis:o=[1,0,0],base:l=[0,0,0],height:u=2,radius:c=1,resolutionU:y=30,resolutionV:d=10,color:O="#ff0000",wireframe:_=!1,children:S,...F},I){const j=h.useMemo(()=>{if(!S)return null;const m=h.Children.toArray(S);for(const b of m)if(J(b))return b;return null},[S]),w=h.useRef(null),T=h.useMemo(()=>{try{const m=z(i,o,l,u,c),b=new k(m),q=[],C=[],U=[];for(let r=0;r<=y;r++)for(let a=0;a<=d;a++){const f=r/y,p=a/d,t=b.point(f,p);q.push(t[0],t[1],t[2]),U.push(f,p)}for(let r=0;r<y;r++)for(let a=0;a<d;a++){const f=r*(d+1)+a,p=f+1,t=(r+1)*(d+1)+a,L=t+1;C.push(f,p,t),C.push(p,L,t)}w.current&&w.current.dispose();const n=new G;return n.setAttribute("position",new M(q,3)),n.setAttribute("uv",new M(U,2)),n.setIndex(C),n.computeVertexNormals(),n.computeBoundingSphere(),w.current=n,n}catch(m){return console.error("Error creating cylindrical surface:",m),null}},[i,o,l,u,c,y,d]);return T?e.jsx("mesh",{ref:I,...F,geometry:T,children:j||e.jsx("meshStandardMaterial",{color:O,wireframe:_,side:v})}):null});V.__docgenInfo={description:"",methods:[],displayName:"CylindricalSurface",props:{axis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 1, 0]",computed:!1}},xaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},base:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},height:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"2",computed:!1}},radius:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"1",computed:!1}},resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"30",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"10",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ff0000"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactElement"},description:""}},composes:["Omit"]};const $={title:"Surfaces/CylindricalSurface",parameters:{layout:"centered"},decorators:[s=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(H,{camera:{position:[4,4,4],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(s,{}),e.jsx(W,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},height:{control:{type:"range",min:.5,max:5,step:.1},description:"Cylinder height"},radius:{control:{type:"range",min:.1,max:3,step:.1},description:"Cylinder radius"},resolutionU:{control:{type:"range",min:8,max:60,step:4},description:"Circumferential resolution"},resolutionV:{control:{type:"range",min:2,max:20,step:1},description:"Height resolution"}}},g={args:{color:"#44aaff",wireframe:!1,height:2,radius:1,resolutionU:32,resolutionV:6},render:({color:s="#44aaff",wireframe:i=!1,height:o=2,radius:l=1,resolutionU:u=32,resolutionV:c=6})=>e.jsx(V,{axis:[0,1,0],xaxis:[1,0,0],base:[0,0,0],height:o,radius:l,resolutionU:u,resolutionV:c,children:e.jsx("meshStandardMaterial",{color:s,wireframe:i,side:v})})},x={args:{color:"#ff8844",wireframe:!0,height:3,radius:.8,resolutionU:24,resolutionV:8},render:({color:s="#ff8844",wireframe:i=!0,height:o=3,radius:l=.8,resolutionU:u=24,resolutionV:c=8})=>e.jsx(V,{axis:[1,1,0],xaxis:[0,0,1],base:[0,0,0],height:o,radius:l,resolutionU:u,resolutionV:c,children:e.jsx("meshStandardMaterial",{color:s,wireframe:i,side:v})})};var D,R,E;g.parameters={...g.parameters,docs:{...(D=g.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    color: "#44aaff",
    wireframe: false,
    height: 2,
    radius: 1,
    resolutionU: 32,
    resolutionV: 6
  },
  render: ({
    color = "#44aaff",
    wireframe = false,
    height = 2,
    radius = 1,
    resolutionU = 32,
    resolutionV = 6
  }: Record<string, any>) => <CylindricalSurface axis={[0, 1, 0]} xaxis={[1, 0, 0]} base={[0, 0, 0]} height={height} radius={radius} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </CylindricalSurface>
}`,...(E=(R=g.parameters)==null?void 0:R.docs)==null?void 0:E.source}}};var A,B,N;x.parameters={...x.parameters,docs:{...(A=x.parameters)==null?void 0:A.docs,source:{originalSource:`{
  args: {
    color: "#ff8844",
    wireframe: true,
    height: 3,
    radius: 0.8,
    resolutionU: 24,
    resolutionV: 8
  },
  render: ({
    color = "#ff8844",
    wireframe = true,
    height = 3,
    radius = 0.8,
    resolutionU = 24,
    resolutionV = 8
  }: Record<string, any>) => <CylindricalSurface axis={[1, 1, 0]} xaxis={[0, 0, 1]} base={[0, 0, 0]} height={height} radius={radius} resolutionU={resolutionU} resolutionV={resolutionV}>
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </CylindricalSurface>
}`,...(N=(B=x.parameters)==null?void 0:B.docs)==null?void 0:N.source}}};const ee=["Default","TiltedCylinder"];export{g as Default,x as TiltedCylinder,ee as __namedExportsOrder,$ as default};
