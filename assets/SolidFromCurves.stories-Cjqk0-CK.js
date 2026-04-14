import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as c}from"./index-Bc2G9s8g.js";import{C as E,O as P,N as T,D as m,V as U}from"./curve-y__KqdvR.js";import{N as k}from"./surface-C_JOQJf4.js";import{a as d,N as g}from"./NurbsSolidComponent-BBUOIwP8.js";import{a as M}from"./construct-DAf8_fEZ.js";import{N}from"./NurbsSurface-CQXq4uhV.js";import{L as I}from"./Line-CsLz4hyq.js";import"./materials-D2_MRo5E.js";import"./nurbs-D1dIikfG.js";const Q={title:"Solids/Construction",parameters:{layout:"centered"},decorators:[r=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(E,{camera:{position:[4,4,4],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(r,{}),e.jsx(P,{})]})})],argTypes:{wireframe:{control:"boolean",description:"Wireframe rendering"},showInput:{control:"boolean",description:"Show the input curve/surface"},resolutionU:{control:{type:"range",min:5,max:40,step:5},description:"Tessellation resolution U"},resolutionV:{control:{type:"range",min:5,max:40,step:5},description:"Tessellation resolution V"}}},h=T.byKnotsControlPointsWeights(3,[0,0,0,0,.2,.4,.6,.8,1,1,1,1],[[0,-1,0],[.6,-1,0],[.9,-.3,0],[.3,.2,0],[.8,.7,0],[.5,1.2,0],[.15,1.5,0],[0,1.6,0]],[1,1,1,1,1,1,1,1]),f=M([0,0,0],[1,0,0],[0,1,0],.8),W=k.byKnotsControlPointsWeights(2,2,[0,0,0,1,1,1],[0,0,0,1,1,1],[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,.8],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],[[1,1,1],[1,1,1],[1,1,1]]);function V({curve:r,color:t="#ff0000",lineWidth:s=2}){const a=c.useMemo(()=>Array.from({length:80},(n,o)=>{const i=r.point(o/79);return new U(i[0],i[1],i[2])}),[r]);return e.jsx(I,{points:a,color:t,lineWidth:s})}function L({wireframe:r=!0,showInput:t=!0,resolutionU:s=25,resolutionV:a=25,angle:n=6.28,capped:o=!1}){const i=c.useMemo(()=>d.fromRevolution(h.asData(),[0,0,0],[0,1,0],n,o).asData(),[n,o]);return e.jsxs(e.Fragment,{children:[t&&e.jsx(V,{curve:h,color:"#ff3333",lineWidth:3}),e.jsx(g,{solid:i,resolutionU:s,resolutionV:a,children:e.jsx("meshPhongMaterial",{color:"#cc4488",wireframe:r,side:m})})]})}const u={args:{wireframe:!0,showInput:!0,resolutionU:25,resolutionV:25,angle:6.28,capped:!1},argTypes:{angle:{control:{type:"range",min:.5,max:6.28,step:.1},description:"Revolution angle (radians)"},capped:{control:"boolean",description:"Cap partial revolutions"}},render:r=>e.jsx(L,{...r})};function F({wireframe:r=!0,showInput:t=!0,resolutionU:s=20,resolutionV:a=10,height:n=2,capped:o=!1}){const i=c.useMemo(()=>new T(f),[]),R=c.useMemo(()=>d.fromExtrusion(f,[0,0,n],o).asData(),[n,o]);return e.jsxs(e.Fragment,{children:[t&&e.jsx(V,{curve:i,color:"#ff3333",lineWidth:3}),e.jsx(g,{solid:R,resolutionU:s,resolutionV:a,children:e.jsx("meshPhongMaterial",{color:"#4488cc",wireframe:r,side:m})})]})}const l={args:{wireframe:!0,showInput:!0,resolutionU:20,resolutionV:10,height:2,capped:!1},argTypes:{height:{control:{type:"range",min:.5,max:5,step:.1},description:"Extrusion height"},capped:{control:"boolean",description:"Cap ends"}},render:r=>e.jsx(F,{...r})};function O({wireframe:r=!0,showInput:t=!0,resolutionU:s=20,resolutionV:a=20,thickness:n=.3}){const o=c.useMemo(()=>d.fromSurface(W.asData(),n).asData(),[n]);return e.jsxs(e.Fragment,{children:[t&&e.jsx(N,{controlPoints:[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,.8],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],weights:[[1,1,1],[1,1,1],[1,1,1]],degreeU:2,degreeV:2,resolutionU:20,resolutionV:20,children:e.jsx("meshPhongMaterial",{color:"#ff3333",transparent:!0,opacity:.3,side:m,depthWrite:!1})}),e.jsx(g,{solid:o,resolutionU:s,resolutionV:a,children:e.jsx("meshPhongMaterial",{color:"#88cc44",wireframe:r,side:m})})]})}const p={args:{wireframe:!0,showInput:!0,resolutionU:20,resolutionV:20,thickness:.3},argTypes:{thickness:{control:{type:"range",min:.05,max:1,step:.05},description:"Shell thickness"}},render:r=>e.jsx(O,{...r})};var x,v,j;u.parameters={...u.parameters,docs:{...(x=u.parameters)==null?void 0:x.docs,source:{originalSource:`{
  args: {
    wireframe: true,
    showInput: true,
    resolutionU: 25,
    resolutionV: 25,
    angle: 6.28,
    capped: false
  },
  argTypes: {
    angle: {
      control: {
        type: "range",
        min: 0.5,
        max: 6.28,
        step: 0.1
      },
      description: "Revolution angle (radians)"
    },
    capped: {
      control: "boolean",
      description: "Cap partial revolutions"
    }
  },
  render: (args: Record<string, any>) => <RevolveCurveDemo {...args} />
}`,...(j=(v=u.parameters)==null?void 0:v.docs)==null?void 0:j.source}}};var y,C,w;l.parameters={...l.parameters,docs:{...(y=l.parameters)==null?void 0:y.docs,source:{originalSource:`{
  args: {
    wireframe: true,
    showInput: true,
    resolutionU: 20,
    resolutionV: 10,
    height: 2,
    capped: false
  },
  argTypes: {
    height: {
      control: {
        type: "range",
        min: 0.5,
        max: 5,
        step: 0.1
      },
      description: "Extrusion height"
    },
    capped: {
      control: "boolean",
      description: "Cap ends"
    }
  },
  render: (args: Record<string, any>) => <ExtrudeCurveDemo {...args} />
}`,...(w=(C=l.parameters)==null?void 0:C.docs)==null?void 0:w.source}}};var S,b,D;p.parameters={...p.parameters,docs:{...(S=p.parameters)==null?void 0:S.docs,source:{originalSource:`{
  args: {
    wireframe: true,
    showInput: true,
    resolutionU: 20,
    resolutionV: 20,
    thickness: 0.3
  },
  argTypes: {
    thickness: {
      control: {
        type: "range",
        min: 0.05,
        max: 1,
        step: 0.05
      },
      description: "Shell thickness"
    }
  },
  render: (args: Record<string, any>) => <ThickenSurfaceDemo {...args} />
}`,...(D=(b=p.parameters)==null?void 0:b.docs)==null?void 0:D.source}}};const X=["RevolveCurve","ExtrudeCurve","ThickenSurface"];export{l as ExtrudeCurve,u as RevolveCurve,p as ThickenSurface,X as __namedExportsOrder,Q as default};
