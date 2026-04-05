import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{N as K,B as k,F as M,D as b,C as F,O as I}from"./curve-CYvlzlZm.js";import{r as m}from"./index-Bc2G9s8g.js";import{N as L}from"./surface-P5fBJWnA.js";import{e as G}from"./construct-BPpITUJd.js";import{N as p}from"./NurbsCurve-CQjwMhxT.js";import{g as P}from"./nurbs-DVTS2-kg.js";import{i as $}from"./materials-D2_MRo5E.js";import"./Line-BLcUCERj.js";const j=({resolutionU:t=20,resolutionV:o=20,color:f="#ff0000",wireframe:d=!1,children:V,..._})=>{const{profileChild:S,railChild:x,materialChild:N}=m.useMemo(()=>{const a=[];let h=null;const v=m.Children.toArray(V);for(const l of v)m.isValidElement(l)&&(l.type===p?a.push(l):$(l)&&(h=l));return{profileChild:a[0]??null,railChild:a[1]??null,materialChild:h}},[V]),E=m.useRef(null),U=m.useMemo(()=>{if(!S||!x)return console.error("SweptSurface requires exactly 2 NurbsCurve children (profile and rail)"),null;try{const a=s=>{const{points:r,degree:i=3,weights:c,knots:n}=s,C=n??P(r.length,i);return K.byKnotsControlPointsWeights(i,C,r,c??Array(r.length).fill(1))},h=a(S.props),v=a(x.props),l=new L(G(h.asData(),v.asData())),R=[],y=[],D=[];for(let s=0;s<=t;s++)for(let r=0;r<=o;r++){const i=s/t,c=r/o,n=l.point(i,c);R.push(n[0],n[1],n[2]),D.push(i,c)}for(let s=0;s<t;s++)for(let r=0;r<o;r++){const i=s*(o+1)+r,c=i+1,n=(s+1)*(o+1)+r,C=n+1;y.push(i,c,n),y.push(c,C,n)}const u=E.current??new k;return u.setAttribute("position",new M(R,3)),u.setAttribute("uv",new M(D,2)),u.setIndex(y),u.computeVertexNormals(),u.computeBoundingSphere(),E.current=u,u}catch(a){return console.error("Error creating swept surface:",a),null}},[S,x,t,o]);return U?e.jsx("mesh",{..._,geometry:U,children:N||e.jsx("meshStandardMaterial",{color:f,wireframe:d,side:b})}):null};j.__docgenInfo={description:"",methods:[],displayName:"SweptSurface",props:{resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ff0000"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"union",raw:"ReactElement | ReactElement[]",elements:[{name:"ReactElement"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const te={title:"Components/SweptSurface",parameters:{layout:"centered"},decorators:[t=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(F,{camera:{position:[4,4,4],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(t,{}),e.jsx(I,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in U direction"},resolutionV:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in V direction"}}},g={args:{color:"#44ff88",wireframe:!1,resolutionU:30,resolutionV:30},render:({color:t="#44ff88",wireframe:o=!1,resolutionU:f=30,resolutionV:d=30})=>e.jsxs(j,{resolutionU:f,resolutionV:d,children:[e.jsx(p,{points:[[0,-.2,0],[.2,0,0],[0,.2,0],[-.2,0,0],[0,-.2,0]],degree:2}),e.jsx(p,{points:[[0,0,0],[1,1,.5],[2,0,1],[3,-1,1.5],[4,0,2]],degree:3}),e.jsx("meshStandardMaterial",{color:t,wireframe:o,side:b})]})},w={args:{color:"#ff8844",wireframe:!0,resolutionU:20,resolutionV:20},render:({color:t="#ff8844",wireframe:o=!0,resolutionU:f=20,resolutionV:d=20})=>e.jsxs(j,{resolutionU:f,resolutionV:d,children:[e.jsx(p,{points:[[0,-.3,0],[.3,0,0],[0,.3,0],[-.3,0,0],[0,-.3,0]],degree:2}),e.jsx(p,{points:[[0,0,0],[1,0,1],[2,1,2],[3,0,3]],degree:2}),e.jsx("meshStandardMaterial",{color:t,wireframe:o,side:b})]})};var T,A,q;g.parameters={...g.parameters,docs:{...(T=g.parameters)==null?void 0:T.docs,source:{originalSource:`{
  args: {
    color: "#44ff88",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30
  },
  render: ({
    color = "#44ff88",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30
  }: Record<string, any>) => <SweptSurface resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve points={[[0, -0.2, 0], [0.2, 0, 0], [0, 0.2, 0], [-0.2, 0, 0], [0, -0.2, 0]]} degree={2} />
      <NurbsCurve points={[[0, 0, 0], [1, 1, 0.5], [2, 0, 1], [3, -1, 1.5], [4, 0, 2]]} degree={3} />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </SweptSurface>
}`,...(q=(A=g.parameters)==null?void 0:A.docs)==null?void 0:q.source}}};var B,O,W;w.parameters={...w.parameters,docs:{...(B=w.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    color: "#ff8844",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20
  },
  render: ({
    color = "#ff8844",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20
  }: Record<string, any>) => <SweptSurface resolutionU={resolutionU} resolutionV={resolutionV}>
      <NurbsCurve points={[[0, -0.3, 0], [0.3, 0, 0], [0, 0.3, 0], [-0.3, 0, 0], [0, -0.3, 0]]} degree={2} />
      <NurbsCurve points={[[0, 0, 0], [1, 0, 1], [2, 1, 2], [3, 0, 3]]} degree={2} />
      <meshStandardMaterial color={color} wireframe={wireframe} side={DoubleSide} />
    </SweptSurface>
}`,...(W=(O=w.parameters)==null?void 0:O.docs)==null?void 0:W.source}}};const oe=["Default","Wireframe"];export{g as Default,w as Wireframe,oe as __namedExportsOrder,te as default};
