import{j as e}from"./jsx-runtime-BjG_zV1W.js";import{r as a}from"./index-Bqq-F1qZ.js";import{C as U,O as V,D as c}from"./curve-CMOorlFs.js";import{a as l,N as d}from"./NurbsSolidComponent-DIhfuuNp.js";import"./index-BeZzvLdV.js";import"./construct-DAf8_fEZ.js";import"./surface-DTPA5pg2.js";import"./materials-D1wlUeyI.js";const F={title:"Solids/Primitives",parameters:{layout:"centered"},decorators:[r=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(U,{camera:{position:[4,4,4],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(r,{}),e.jsx(V,{})]})})],argTypes:{color:{control:"color",description:"Solid color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:5,max:40,step:5},description:"Tessellation resolution U"},resolutionV:{control:{type:"range",min:5,max:40,step:5},description:"Tessellation resolution V"}}};function b({dx:r=2,dy:n=1.5,dz:o=1,color:s="#4488ff",wireframe:i=!1,resolutionU:t=10,resolutionV:x=10}){const T=a.useMemo(()=>l.makeBox(r,n,o).asData(),[r,n,o]);return e.jsx(d,{solid:T,resolutionU:t,resolutionV:x,children:e.jsx("meshPhongMaterial",{color:s,wireframe:i,side:c})})}const m={args:{dx:2,dy:1.5,dz:1,color:"#4488ff",wireframe:!0,resolutionU:10,resolutionV:10},argTypes:{dx:{control:{type:"range",min:.5,max:4,step:.1},description:"Width"},dy:{control:{type:"range",min:.5,max:4,step:.1},description:"Height"},dz:{control:{type:"range",min:.5,max:4,step:.1},description:"Depth"}},render:r=>e.jsx(b,{...r})};function k({radius:r=1,height:n=2,color:o="#ff6644",wireframe:s=!1,resolutionU:i=20,resolutionV:t=10}){const x=a.useMemo(()=>l.makeCylinder(r,n).asData(),[r,n]);return e.jsx(d,{solid:x,resolutionU:i,resolutionV:t,children:e.jsx("meshPhongMaterial",{color:o,wireframe:s,side:c})})}const p={args:{radius:1,height:2,color:"#ff6644",wireframe:!0,resolutionU:20,resolutionV:10},argTypes:{radius:{control:{type:"range",min:.2,max:3,step:.1},description:"Radius"},height:{control:{type:"range",min:.5,max:5,step:.1},description:"Height"}},render:r=>e.jsx(k,{...r})};function B({radius:r=1,color:n="#44cc88",wireframe:o=!1,resolutionU:s=25,resolutionV:i=25}){const t=a.useMemo(()=>l.makeSphere(r).asData(),[r]);return e.jsx(d,{solid:t,resolutionU:s,resolutionV:i,children:e.jsx("meshPhongMaterial",{color:n,wireframe:o,side:c})})}const u={args:{radius:1,color:"#44cc88",wireframe:!0,resolutionU:25,resolutionV:25},argTypes:{radius:{control:{type:"range",min:.2,max:3,step:.1},description:"Radius"}},render:r=>e.jsx(B,{...r})};function A({wireframe:r=!1,resolutionU:n=20,resolutionV:o=20}){const s=a.useMemo(()=>l.makeBox(1.5,1.5,1.5).asData(),[]),i=a.useMemo(()=>l.makeCylinder(.8,2).asData(),[]),t=a.useMemo(()=>l.makeSphere(1).asData(),[]);return e.jsxs(e.Fragment,{children:[e.jsx("group",{position:[-3,0,0],children:e.jsx(d,{solid:s,resolutionU:n,resolutionV:o,children:e.jsx("meshPhongMaterial",{color:"#4488ff",wireframe:r,side:c})})}),e.jsx("group",{position:[0,0,0],children:e.jsx(d,{solid:i,resolutionU:n,resolutionV:o,children:e.jsx("meshPhongMaterial",{color:"#ff6644",wireframe:r,side:c})})}),e.jsx("group",{position:[3,0,0],children:e.jsx(d,{solid:t,resolutionU:n,resolutionV:o,children:e.jsx("meshPhongMaterial",{color:"#44cc88",wireframe:r,side:c})})})]})}const g={args:{wireframe:!0,resolutionU:20,resolutionV:20,color:"#a93939"},render:r=>e.jsx(A,{...r})};var h,f,y;m.parameters={...m.parameters,docs:{...(h=m.parameters)==null?void 0:h.docs,source:{originalSource:`{
  args: {
    dx: 2,
    dy: 1.5,
    dz: 1,
    color: "#4488ff",
    wireframe: true,
    resolutionU: 10,
    resolutionV: 10
  },
  argTypes: {
    dx: {
      control: {
        type: "range",
        min: 0.5,
        max: 4,
        step: 0.1
      },
      description: "Width"
    },
    dy: {
      control: {
        type: "range",
        min: 0.5,
        max: 4,
        step: 0.1
      },
      description: "Height"
    },
    dz: {
      control: {
        type: "range",
        min: 0.5,
        max: 4,
        step: 0.1
      },
      description: "Depth"
    }
  },
  render: (args: Record<string, any>) => <BoxDemo {...args} />
}`,...(y=(f=m.parameters)==null?void 0:f.docs)==null?void 0:y.source}}};var j,D,S;p.parameters={...p.parameters,docs:{...(j=p.parameters)==null?void 0:j.docs,source:{originalSource:`{
  args: {
    radius: 1,
    height: 2,
    color: "#ff6644",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 10
  },
  argTypes: {
    radius: {
      control: {
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1
      },
      description: "Radius"
    },
    height: {
      control: {
        type: "range",
        min: 0.5,
        max: 5,
        step: 0.1
      },
      description: "Height"
    }
  },
  render: (args: Record<string, any>) => <CylinderDemo {...args} />
}`,...(S=(D=p.parameters)==null?void 0:D.docs)==null?void 0:S.source}}};var M,P,v;u.parameters={...u.parameters,docs:{...(M=u.parameters)==null?void 0:M.docs,source:{originalSource:`{
  args: {
    radius: 1,
    color: "#44cc88",
    wireframe: true,
    resolutionU: 25,
    resolutionV: 25
  },
  argTypes: {
    radius: {
      control: {
        type: "range",
        min: 0.2,
        max: 3,
        step: 0.1
      },
      description: "Radius"
    }
  },
  render: (args: Record<string, any>) => <SphereDemo {...args} />
}`,...(v=(P=u.parameters)==null?void 0:P.docs)==null?void 0:v.source}}};var C,w,R;g.parameters={...g.parameters,docs:{...(C=g.parameters)==null?void 0:C.docs,source:{originalSource:`{
  args: {
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    color: "#a93939"
  },
  render: (args: Record<string, any>) => <AllPrimitivesDemo {...args} />
}`,...(R=(w=g.parameters)==null?void 0:w.docs)==null?void 0:R.source}}};const q=["Box","Cylinder","Sphere","AllPrimitives"];export{g as AllPrimitives,m as Box,p as Cylinder,u as Sphere,q as __namedExportsOrder,F as default};
