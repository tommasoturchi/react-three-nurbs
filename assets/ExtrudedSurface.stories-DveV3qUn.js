import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{N as K,B as I,F as X,D as C,C as L,O as k}from"./curve-y__KqdvR.js";import{r as b}from"./index-Bc2G9s8g.js";import{N as G}from"./surface-C_JOQJf4.js";import{d as $}from"./construct-DAf8_fEZ.js";import{N as y}from"./NurbsCurve-CqxZhzUi.js";import{g as z}from"./nurbs-D1dIikfG.js";import{i as H}from"./materials-D2_MRo5E.js";import"./Line-CsLz4hyq.js";const N=({direction:n,resolutionU:t=20,resolutionV:r=20,color:f="#ff0000",wireframe:m=!1,children:u,...p})=>{const{profileChild:c,materialChild:V}=b.useMemo(()=>{let o=null,h=null;const S=b.Children.toArray(u);for(const a of S)b.isValidElement(a)&&(a.type===y?o=a:H(a)&&(h=a));return{profileChild:o,materialChild:h}},[u]),w=b.useRef(null),P=b.useMemo(()=>{if(!c)return console.error("ExtrudedSurface requires a NurbsCurve child"),null;try{const{points:o,degree:h=3,weights:S,knots:a}=c.props,W=Array(o.length).fill(1),B=a??z(o.length,h),F=K.byKnotsControlPointsWeights(h,B,o,S??W),O=new G($(F.asData(),n)),R=[],j=[],U=[];for(let i=0;i<=t;i++)for(let s=0;s<=r;s++){const g=i/t,x=s/r,d=O.point(g,x);R.push(d[0],d[1],d[2]),U.push(g,x)}for(let i=0;i<t;i++)for(let s=0;s<r;s++){const g=i*(r+1)+s,x=g+1,d=(i+1)*(r+1)+s,_=d+1;j.push(g,x,d),j.push(x,_,d)}w.current&&w.current.dispose();const l=new I;return l.setAttribute("position",new X(R,3)),l.setAttribute("uv",new X(U,2)),l.setIndex(j),l.computeVertexNormals(),l.computeBoundingSphere(),w.current=l,l}catch(o){return console.error("Error creating extruded surface:",o),null}},[c,n,t,r]);return P?e.jsx("mesh",{...p,geometry:P,children:V||e.jsx("meshStandardMaterial",{color:f,wireframe:m,side:C})}):null};N.__docgenInfo={description:"",methods:[],displayName:"ExtrudedSurface",props:{direction:{required:!0,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:""},resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ff0000"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"union",raw:"ReactElement<NurbsCurveProps> | ReactElement[]",elements:[{name:"ReactElement",elements:[{name:"NurbsCurveProps"}],raw:"ReactElement<NurbsCurveProps>"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const ae={title:"Surfaces/Extruded Surface",parameters:{layout:"centered"},decorators:[n=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(L,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(n,{}),e.jsx(k,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in U direction"},resolutionV:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in V direction"},dirX:{control:{type:"range",min:-3,max:3,step:.1},description:"Extrusion direction X"},dirY:{control:{type:"range",min:-3,max:3,step:.1},description:"Extrusion direction Y"},dirZ:{control:{type:"range",min:-3,max:3,step:.1},description:"Extrusion direction Z"}}},Y=[[0,0,0],[.5,.5,0],[1,0,0],[1.5,-.5,0],[2,0,0]],v={args:{color:"#4488ff",wireframe:!0,resolutionU:60,resolutionV:60,dirX:-.1,dirY:0,dirZ:2},render:({color:n="#4488ff",wireframe:t=!1,resolutionU:r=20,resolutionV:f=20,dirX:m=0,dirY:u=0,dirZ:p=2})=>e.jsxs(e.Fragment,{children:[e.jsxs(N,{direction:[m,u,p],resolutionU:r,resolutionV:f,children:[e.jsx(y,{points:Y,degree:3}),e.jsx("meshStandardMaterial",{color:n,wireframe:t,side:C})]}),e.jsx(y,{points:Y,degree:3,color:"#ff0000",lineWidth:2})]})},E={args:{color:"#ff4488",wireframe:!1,resolutionU:30,resolutionV:30,dirX:1,dirY:2,dirZ:1},render:({color:n="#ff4488",wireframe:t=!1,resolutionU:r=30,resolutionV:f=30,dirX:m=1,dirY:u=2,dirZ:p=1})=>{const c=[[0,0,0],[1,1,0],[2,0,0]];return e.jsxs(e.Fragment,{children:[e.jsxs(N,{direction:[m,u,p],resolutionU:r,resolutionV:f,children:[e.jsx(y,{points:c,degree:2}),e.jsx("meshPhongMaterial",{color:n,wireframe:t,side:C})]}),e.jsx(y,{points:c,degree:2,color:"#ff0000",lineWidth:2})]})}};var Z,D,T;v.parameters={...v.parameters,docs:{...(Z=v.parameters)==null?void 0:Z.docs,source:{originalSource:`{
  args: {
    color: "#4488ff",
    wireframe: true,
    resolutionU: 60,
    resolutionV: 60,
    dirX: -0.1,
    dirY: 0,
    dirZ: 2
  },
  render: ({
    color = "#4488ff",
    wireframe = false,
    resolutionU = 20,
    resolutionV = 20,
    dirX = 0,
    dirY = 0,
    dirZ = 2
  }: Record<string, any>) => <>
      <ExtrudedSurface direction={[dirX, dirY, dirZ]} resolutionU={resolutionU} resolutionV={resolutionV}>
        <NurbsCurve points={profilePoints} degree={3} />
        <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
      </ExtrudedSurface>
      {/* Show the profile curve */}
      <NurbsCurve points={profilePoints} degree={3} color="#ff0000" lineWidth={2} />
    </>
}`,...(T=(D=v.parameters)==null?void 0:D.docs)==null?void 0:T.source}}};var M,q,A;E.parameters={...E.parameters,docs:{...(M=E.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    color: "#ff4488",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    dirX: 1,
    dirY: 2,
    dirZ: 1
  },
  render: ({
    color = "#ff4488",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    dirX = 1,
    dirY = 2,
    dirZ = 1
  }: Record<string, any>) => {
    const arcPoints = [[0, 0, 0], [1, 1, 0], [2, 0, 0]];
    return <>
        <ExtrudedSurface direction={[dirX, dirY, dirZ]} resolutionU={resolutionU} resolutionV={resolutionV}>
          <NurbsCurve points={arcPoints} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </ExtrudedSurface>
        <NurbsCurve points={arcPoints} degree={2} color="#ff0000" lineWidth={2} />
      </>;
  }
}`,...(A=(q=E.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};const le=["Default","DiagonalExtrusion"];export{v as Default,E as DiagonalExtrusion,le as __namedExportsOrder,ae as default};
