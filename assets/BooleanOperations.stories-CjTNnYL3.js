const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["./boolean-Cj1mNhwT.js","./iframe-B1JGQa7l.js"])))=>i.map(i=>d[i]);
import{_}from"./iframe-B1JGQa7l.js";import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as u}from"./index-Bqq-F1qZ.js";import{C as v,O,D as d,B as E,F as T}from"./curve-CMOorlFs.js";import{N as w,a as l}from"./NurbsSolidComponent-DIhfuuNp.js";import"./index-BeZzvLdV.js";import"./construct-DAf8_fEZ.js";import"./surface-DTPA5pg2.js";import"./materials-D1wlUeyI.js";const Y={title:"Solids/Boolean Operations",parameters:{layout:"centered"},decorators:[o=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(v,{camera:{position:[4,4,4],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(o,{}),e.jsx(O,{})]})})],argTypes:{operation:{control:{type:"select"},options:["union","difference","intersection"],description:"Boolean operation type"},wireframe:{control:"boolean",description:"Wireframe rendering"},showInputs:{control:"boolean",description:"Show input solids as transparent"}}};function L({mesh:o,wireframe:s=!1}){const r=new E;return r.setAttribute("position",new T(o.vertices,3)),r.setIndex(Array.from(o.indices)),r.computeVertexNormals(),r.computeBoundingSphere(),e.jsx("mesh",{geometry:r,children:e.jsx("meshPhongMaterial",{color:"#4488ff",wireframe:s,side:d})})}function C({shapeA:o,shapeB:s,solidA:r,solidB:h,operation:c="difference",wireframe:I=!1,showInputs:m=!0}){const[f,x]=u.useState(null),[M,t]=u.useState("Loading OCCT WASM (~5MB)...");return u.useEffect(()=>{let a=!1;return t("Loading OCCT WASM (~5MB)..."),x(null),(async()=>{try{const{booleanOperation:n}=await _(async()=>{const{booleanOperation:D}=await import("./boolean-Cj1mNhwT.js");return{booleanOperation:D}},__vite__mapDeps([0,1]),import.meta.url);if(a)return;t(`Computing ${c}...`);const S=await n(o,s,c,.1);if(a)return;S.vertices.length===0?t("Boolean produced empty result"):(x(S),t(""))}catch(n){a||t(`Error: ${n instanceof Error?n.message:n}`)}})(),()=>{a=!0}},[o,s,c]),M?e.jsxs("mesh",{children:[e.jsx("boxGeometry",{args:[.3,.3,.3]}),e.jsx("meshBasicMaterial",{color:"#888888",wireframe:!0})]}):f?e.jsxs(e.Fragment,{children:[m&&r&&e.jsx(w,{solid:r,resolutionU:8,resolutionV:8,children:e.jsx("meshPhongMaterial",{color:"#ff4444",transparent:!0,opacity:.15,side:d,depthWrite:!1})}),m&&h&&e.jsx(w,{solid:h,resolutionU:12,resolutionV:8,children:e.jsx("meshPhongMaterial",{color:"#44ff44",transparent:!0,opacity:.15,side:d,depthWrite:!1})}),e.jsx(L,{mesh:f,wireframe:I})]}):null}const P={type:"box",dx:2,dy:2,dz:2,origin:[-1,-1,-1]},R={type:"cylinder",radius:.6,height:3,origin:[0,0,-1.5],axis:[0,0,1]},W={type:"sphere",radius:1,center:[-.5,0,0]},k={type:"sphere",radius:1,center:[.5,0,0]},N=l.makeBox(2,2,2,[-1,-1,-1]).asData(),V=l.makeCylinder(.6,3,[0,0,1],[0,0,-1.5]).asData(),F=l.makeSphere(1,[-.5,0,0]).asData(),G=l.makeSphere(1,[.5,0,0]).asData(),i={args:{operation:"difference",wireframe:!0,showInputs:!0},render:({operation:o="difference",wireframe:s=!1,showInputs:r=!0})=>e.jsx(C,{shapeA:P,shapeB:R,solidA:N,solidB:V,operation:o,wireframe:s,showInputs:r})},p={args:{operation:"union",wireframe:!0,showInputs:!0},render:({operation:o="union",wireframe:s=!1,showInputs:r=!0})=>e.jsx(C,{shapeA:W,shapeB:k,solidA:F,solidB:G,operation:o,wireframe:s,showInputs:r})};var y,g,B;i.parameters={...i.parameters,docs:{...(y=i.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    operation: "difference",
    wireframe: true,
    showInputs: true
  },
  render: ({
    operation = "difference",
    wireframe = false,
    showInputs = true
  }: Record<string, any>) => <BooleanDemo shapeA={boxShape} shapeB={cylShape} solidA={boxSolid} solidB={cylSolid} operation={operation} wireframe={wireframe} showInputs={showInputs} />
}`,...(B=(g=i.parameters)==null?void 0:g.docs)==null?void 0:B.source}}};var j,b,A;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    operation: "union",
    wireframe: true,
    showInputs: true
  },
  render: ({
    operation = "union",
    wireframe = false,
    showInputs = true
  }: Record<string, any>) => <BooleanDemo shapeA={sphere1Shape} shapeB={sphere2Shape} solidA={sphere1Solid} solidB={sphere2Solid} operation={operation} wireframe={wireframe} showInputs={showInputs} />
}`,...(A=(b=p.parameters)==null?void 0:b.docs)==null?void 0:A.source}}};const Z=["BoxMinusCylinder","TwoSpheres"];export{i as BoxMinusCylinder,p as TwoSpheres,Z as __namedExportsOrder,Y as default};
