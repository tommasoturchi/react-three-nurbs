import{j as e}from"./jsx-runtime-DiklIkkE.js";import{v as S,C as H,O as J}from"./verb.es-vEISxjAU.js";import{r as w}from"./index-DRjF_FHU.js";import{N as y}from"./NurbsCurve-B5DrWz7P.js";const z=({center:m=[0,0,0],axis:r=[1,0,0],angle:x=2*Math.PI,resolutionU:f=20,resolutionV:u=20,color:D="#ff0000",wireframe:_=!1,children:d})=>{const a=w.useMemo(()=>{if(!w.isValidElement(d)||d.type!==y)return console.error("RevolvedSurface requires a single NurbsCurve child"),null;try{const{points:i,degree:L=3,weights:O,knots:F}=d.props,G=Array(i.length).fill(1);if(!i||i.length<2)return console.error("Profile curve must have at least 2 points"),null;const p=Math.sqrt(r[0]*r[0]+r[1]*r[1]+r[2]*r[2]);if(p===0)return console.error("Axis vector cannot be zero"),null;const K=[r[0]/p,r[1]/p,r[2]/p],U=S.geom.NurbsCurve.byKnotsControlPointsWeights(L,F,i,O??G),$=new S.geom.RevolvedSurface(U,m,K,x),j=[],h=[],C=[];for(let t=0;t<=f;t++)for(let s=0;s<=u;s++){const l=t/f,c=s/u,n=$.point(l,c);j.push(n[0],n[1],n[2]),C.push(l,c)}for(let t=0;t<f;t++)for(let s=0;s<u;s++){const l=t*(u+1)+s,c=l+1,n=(t+1)*(u+1)+s,B=n+1;h.push(l,c,n),h.push(c,B,n)}return{vertices:j,indices:h,uvs:C}}catch(i){return console.error("Error creating revolved surface:",i),null}},[d,m,r,x,f,u]);return a?e.jsxs("mesh",{children:[e.jsxs("bufferGeometry",{children:[e.jsx("bufferAttribute",{attach:"attributes-position",count:a.vertices.length/3,array:new Float32Array(a.vertices),itemSize:3}),e.jsx("bufferAttribute",{attach:"attributes-uv",count:a.uvs.length/2,array:new Float32Array(a.uvs),itemSize:2}),e.jsx("bufferAttribute",{attach:"index",count:a.indices.length,array:new Uint32Array(a.indices),itemSize:1})]}),e.jsx("meshStandardMaterial",{color:D,wireframe:_})]}):null};z.__docgenInfo={description:"",methods:[],displayName:"RevolvedSurface",props:{center:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},axis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},angle:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"2 * Math.PI",computed:!1}},resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ff0000"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"ReactElement",elements:[{name:"NurbsCurveProps"}],raw:"ReactElement<NurbsCurveProps>"},description:""}}};const ee={title:"Components/RevolvedSurface",component:z,parameters:{layout:"fullscreen"},decorators:[m=>e.jsxs(H,{camera:{position:[5,5,5],fov:75},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(m,{}),e.jsx(J,{})]})]},o={args:{center:[0,0,0],axis:[0,1,0],angle:2*Math.PI,resolutionU:20,resolutionV:20,color:"#ff0000",wireframe:!1,children:e.jsx(y,{points:[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],degree:3,knots:[0,0,0,0,1,1,1,1]})}},v={args:{...o.args,wireframe:!0}},g={args:{...o.args,angle:Math.PI}},b={args:{...o.args,axis:[1,1,0],children:e.jsx(y,{points:[[0,0,0],[0,0,1],[1,0,1],[1,0,0]],degree:3,knots:[0,0,0,0,1,1,1,1]})}};var P,A,q;o.parameters={...o.parameters,docs:{...(P=o.parameters)==null?void 0:P.docs,source:{originalSource:`{
  args: {
    center: [0, 0, 0],
    axis: [0, 1, 0],
    angle: 2 * Math.PI,
    resolutionU: 20,
    resolutionV: 20,
    color: "#ff0000",
    wireframe: false,
    children: <NurbsCurve points={[[0, 0, 0], [0, 1, 0], [1, 1, 0], [1, 0, 0]]} degree={3} knots={[0, 0, 0, 0, 1, 1, 1, 1]} />
  }
}`,...(q=(A=o.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var R,M,N;v.parameters={...v.parameters,docs:{...(R=v.parameters)==null?void 0:R.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    wireframe: true
  }
}`,...(N=(M=v.parameters)==null?void 0:M.docs)==null?void 0:N.source}}};var T,E,I;g.parameters={...g.parameters,docs:{...(T=g.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    angle: Math.PI
  }
}`,...(I=(E=g.parameters)==null?void 0:E.docs)==null?void 0:I.source}}};var V,W,k;b.parameters={...b.parameters,docs:{...(V=b.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    ...Default.args,
    axis: [1, 1, 0],
    children: <NurbsCurve points={[[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]]} degree={3} knots={[0, 0, 0, 0, 1, 1, 1, 1]} />
  }
}`,...(k=(W=b.parameters)==null?void 0:W.docs)==null?void 0:k.source}}};const re=["Default","WithWireframe","PartialRevolution","CustomAxis"];export{b as CustomAxis,o as Default,g as PartialRevolution,v as WithWireframe,re as __namedExportsOrder,ee as default};
