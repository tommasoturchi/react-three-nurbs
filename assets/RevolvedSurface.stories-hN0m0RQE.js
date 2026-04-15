import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{N as Y,B as Z,F as E,D as S,C as ee,O as re}from"./curve-CMOorlFs.js";import{r as g}from"./index-Bqq-F1qZ.js";import{N as ne}from"./surface-DTPA5pg2.js";import{e as te}from"./construct-DAf8_fEZ.js";import{N as w}from"./NurbsCurve-dE9_dQxd.js";import{g as oe}from"./nurbs-xWhcT55R.js";import{i as se}from"./materials-D1wlUeyI.js";import"./index-BeZzvLdV.js";import"./Line-C9ZHJoHX.js";const y=({center:t=[0,0,0],axis:r=[1,0,0],angle:a=2*Math.PI,resolutionU:o=20,resolutionV:n=20,color:W="#ff0000",wireframe:F=!1,children:V,...z})=>{const{profileChild:R,materialChild:j}=g.useMemo(()=>{let s=null,d=null;const C=g.Children.toArray(V);for(const u of C)g.isValidElement(u)&&(u.type===w?s=u:se(u)&&(d=u));return{profileChild:s,materialChild:d}},[V]),M=g.useRef(null),I=g.useMemo(()=>{if(!R)return console.error("RevolvedSurface requires a NurbsCurve child"),null;try{const{points:s,degree:d=3,weights:C,knots:u}=R.props,G=Array(s.length).fill(1);if(!s||s.length<2)return null;const h=Math.sqrt(r[0]**2+r[1]**2+r[2]**2);if(h===0)return null;const $=[r[0]/h,r[1]/h,r[2]/h],H=u??oe(s.length,d),J=Y.byKnotsControlPointsWeights(d,H,s,C??G),Q=new ne(te(J.asData(),t,$,a)),U=[],P=[],N=[];for(let i=0;i<=o;i++)for(let l=0;l<=n;l++){const f=i/o,p=l/n,m=Q.point(f,p);U.push(m[0],m[1],m[2]),N.push(f,p)}for(let i=0;i<o;i++)for(let l=0;l<n;l++){const f=i*(n+1)+l,p=f+1,m=(i+1)*(n+1)+l,X=m+1;P.push(f,p,m),P.push(p,X,m)}M.current&&M.current.dispose();const c=new Z;return c.setAttribute("position",new E(U,3)),c.setAttribute("uv",new E(N,2)),c.setIndex(P),c.computeVertexNormals(),c.computeBoundingSphere(),M.current=c,c}catch(s){return console.error("Error creating revolved surface:",s),null}},[R,t,r,a,o,n]);return I?e.jsx("mesh",{...z,geometry:I,children:j||e.jsx("meshStandardMaterial",{color:W,wireframe:F,side:S})}):null};y.__docgenInfo={description:"",methods:[],displayName:"RevolvedSurface",props:{center:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},axis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},angle:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"2 * Math.PI",computed:!1}},resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ff0000"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"union",raw:"ReactElement<NurbsCurveProps> | ReactElement[]",elements:[{name:"ReactElement",elements:[{name:"NurbsCurveProps"}],raw:"ReactElement<NurbsCurveProps>"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const he={title:"Surfaces/Revolved Surface",parameters:{layout:"centered"},decorators:[t=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(ee,{camera:{position:[3,3,3],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(t,{}),e.jsx(re,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in U direction"},resolutionV:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in V direction"},angle:{control:{type:"range",min:.1,max:6.28,step:.1},description:"Rotation angle in radians"}}},L=[[0,0,0],[0,1,0],[1,1,0],[1,0,0]],v={args:{color:"#ff0000",wireframe:!0,resolutionU:20,resolutionV:20,angle:2*Math.PI},render:({color:t="#ff0000",wireframe:r=!0,resolutionU:a=20,resolutionV:o=20,angle:n=2*Math.PI})=>e.jsxs(y,{center:[0,0,0],axis:[0,1,0],angle:n,resolutionU:a,resolutionV:o,children:[e.jsx(w,{points:L,degree:3,knots:[0,0,0,0,1,1,1,1]}),e.jsx("meshStandardMaterial",{color:t,wireframe:r,side:S})]})},b={args:{color:"#00ccff",wireframe:!1,resolutionU:30,resolutionV:30,angle:Math.PI},render:({color:t="#00ccff",wireframe:r=!1,resolutionU:a=30,resolutionV:o=30,angle:n=Math.PI})=>e.jsxs(y,{center:[0,0,0],axis:[0,1,0],angle:n,resolutionU:a,resolutionV:o,children:[e.jsx(w,{points:L,degree:3,knots:[0,0,0,0,1,1,1,1]}),e.jsx("meshStandardMaterial",{color:t,wireframe:r,side:S})]})},x={args:{color:"#ffaa00",wireframe:!0,resolutionU:20,resolutionV:20,angle:2*Math.PI},render:({color:t="#ffaa00",wireframe:r=!0,resolutionU:a=20,resolutionV:o=20,angle:n=2*Math.PI})=>e.jsxs(y,{center:[0,0,0],axis:[1,1,0],angle:n,resolutionU:a,resolutionV:o,children:[e.jsx(w,{points:[[0,0,0],[0,0,1],[1,0,1],[1,0,0]],degree:3,knots:[0,0,0,0,1,1,1,1]}),e.jsx("meshStandardMaterial",{color:t,wireframe:r,side:S})]})};var T,q,A;v.parameters={...v.parameters,docs:{...(T=v.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    color: "#ff0000",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    angle: 2 * Math.PI
  },
  render: ({
    color = "#ff0000",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    angle = 2 * Math.PI
  }: Record<string, any>) => <RevolvedSurface center={[0, 0, 0]} axis={[0, 1, 0]} angle={angle} resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve points={profilePoints} degree={3} knots={[0, 0, 0, 0, 1, 1, 1, 1]} />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </RevolvedSurface>
}`,...(A=(q=v.parameters)==null?void 0:q.docs)==null?void 0:A.source}}};var D,k,B;b.parameters={...b.parameters,docs:{...(D=b.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    color: "#00ccff",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    angle: Math.PI
  },
  render: ({
    color = "#00ccff",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    angle = Math.PI
  }: Record<string, any>) => <RevolvedSurface center={[0, 0, 0]} axis={[0, 1, 0]} angle={angle} resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve points={profilePoints} degree={3} knots={[0, 0, 0, 0, 1, 1, 1, 1]} />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </RevolvedSurface>
}`,...(B=(k=b.parameters)==null?void 0:k.docs)==null?void 0:B.source}}};var O,_,K;x.parameters={...x.parameters,docs:{...(O=x.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    color: "#ffaa00",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    angle: 2 * Math.PI
  },
  render: ({
    color = "#ffaa00",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    angle = 2 * Math.PI
  }: Record<string, any>) => <RevolvedSurface center={[0, 0, 0]} axis={[1, 1, 0]} angle={angle} resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve points={[[0, 0, 0], [0, 0, 1], [1, 0, 1], [1, 0, 0]]} degree={3} knots={[0, 0, 0, 0, 1, 1, 1, 1]} />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </RevolvedSurface>
}`,...(K=(_=x.parameters)==null?void 0:_.docs)==null?void 0:K.source}}};const ve=["Default","PartialRevolution","CustomAxis"];export{x as CustomAxis,v as Default,b as PartialRevolution,ve as __namedExportsOrder,he as default};
