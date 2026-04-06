import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{N as x,V as y,C as w,O as T}from"./curve-y__KqdvR.js";import{N as V}from"./NurbsCircle-D2Bkv5Ei.js";import{N as C}from"./NurbsArc-3pG_YjrD.js";import{r as j}from"./index-Bc2G9s8g.js";import{g as q,h as M}from"./construct-CJBnbS0Q.js";import{L as v}from"./Line-CsLz4hyq.js";import{N as W}from"./NurbsCurve-CqxZhzUi.js";import"./nurbs-D1dIikfG.js";const A=({center:r=[0,0,0],xaxis:n=[1,0,0],yaxis:s=[0,.5,0],resolution:t=64,color:u="black",...o})=>{const c=j.useMemo(()=>{try{const a=new x(q(r,n,s));return Array.from({length:t+1},(p,i)=>{const f=i/t,l=a.point(f);return new y(l[0],l[1],l[2])})}catch(a){return console.error("NurbsEllipse: Error creating ellipse:",a),[]}},[r,n,s,t]);return c.length===0?null:e.jsx(v,{points:c,color:u,...o})};A.__docgenInfo={description:"",methods:[],displayName:"NurbsEllipse",props:{center:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},xaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},yaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0.5, 0]",computed:!1}},resolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"64",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"black"',computed:!1}}},composes:["Omit"]};const N=({center:r=[0,0,0],xaxis:n=[1,0,0],yaxis:s=[0,.5,0],startAngle:t=0,endAngle:u=Math.PI,resolution:o=50,color:c="black",...a})=>{const p=j.useMemo(()=>{try{const i=new x(M(r,n,s,t,u));return Array.from({length:o+1},(f,l)=>{const E=l/o,d=i.point(E);return new y(d[0],d[1],d[2])})}catch(i){return console.error("NurbsEllipseArc: Error creating ellipse arc:",i),[]}},[r,n,s,t,u,o]);return p.length===0?null:e.jsx(v,{points:p,color:c,...a})};N.__docgenInfo={description:"",methods:[],displayName:"NurbsEllipseArc",props:{center:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0, 0]",computed:!1}},xaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[1, 0, 0]",computed:!1}},yaxis:{required:!1,tsType:{name:"tuple",raw:"[number, number, number]",elements:[{name:"number"},{name:"number"},{name:"number"}]},description:"",defaultValue:{value:"[0, 0.5, 0]",computed:!1}},startAngle:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"0",computed:!1}},endAngle:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"Math.PI",computed:!0}},resolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"50",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"black"',computed:!1}}},composes:["Omit"]};const S={title:"Examples/Exact Conics (Circle, Arc, Ellipse)",parameters:{layout:"centered",docs:{description:{component:"Exact NURBS representations of conic sections: arc, circle, ellipse, ellipse arc, and a parabolic Bezier curve. These are mathematically exact (not polygon approximations)."}}},decorators:[r=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(w,{camera:{position:[0,0,30],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx(r,{}),e.jsx(T,{})]})})],argTypes:{lineWidth:{control:{type:"range",min:1,max:5,step:.5},description:"Line width for all curves"}}},m={args:{lineWidth:2},render:({lineWidth:r=2})=>e.jsxs(e.Fragment,{children:[e.jsxs("group",{position:[-12,0,0],children:[e.jsx(C,{center:[0,0,0],radius:3,startAngle:0,endAngle:Math.PI*1.5,color:"#ff0000",lineWidth:r,resolution:64}),e.jsx("mesh",{position:[0,-4.5,0],children:e.jsx("planeGeometry",{args:[0,0]})})]}),e.jsx("group",{position:[-4,0,0],children:e.jsx(V,{center:[0,0,0],radius:3,color:"#00cc00",lineWidth:r,resolution:64})}),e.jsx("group",{position:[4,0,0],children:e.jsx(A,{center:[0,0,0],xaxis:[3,0,0],yaxis:[0,1.5,0],color:"#0066ff",lineWidth:r,resolution:64})}),e.jsx("group",{position:[12,0,0],children:e.jsx(N,{center:[0,0,0],xaxis:[3,0,0],yaxis:[0,1.5,0],startAngle:0,endAngle:Math.PI*1.5,color:"#ff6600",lineWidth:r,resolution:64})}),e.jsxs("group",{position:[20,0,0],children:[e.jsx(W,{points:[[-3,-2,0],[0,4,0],[3,-2,0]],degree:2,color:"#cc00cc",lineWidth:r}),[[-3,-2,0],[0,4,0],[3,-2,0]].map((n,s)=>e.jsxs("mesh",{position:[n[0],n[1],n[2]],children:[e.jsx("sphereGeometry",{args:[.15,8,8]}),e.jsx("meshBasicMaterial",{color:"#cc00cc"})]},s))]})]})};var b,h,g;m.parameters={...m.parameters,docs:{...(b=m.parameters)==null?void 0:b.docs,source:{originalSource:`{
  args: {
    lineWidth: 2
  },
  render: ({
    lineWidth = 2
  }: Record<string, any>) => <>
      {/* Arc: 270 degrees */}
      <group position={[-12, 0, 0]}>
        <NurbsArc center={[0, 0, 0]} radius={3} startAngle={0} endAngle={Math.PI * 1.5} color="#ff0000" lineWidth={lineWidth} resolution={64} />
        <mesh position={[0, -4.5, 0]}>
          <planeGeometry args={[0, 0]} />
        </mesh>
      </group>

      {/* Circle */}
      <group position={[-4, 0, 0]}>
        <NurbsCircle center={[0, 0, 0]} radius={3} color="#00cc00" lineWidth={lineWidth} resolution={64} />
      </group>

      {/* Ellipse */}
      <group position={[4, 0, 0]}>
        <NurbsEllipse center={[0, 0, 0]} xaxis={[3, 0, 0]} yaxis={[0, 1.5, 0]} color="#0066ff" lineWidth={lineWidth} resolution={64} />
      </group>

      {/* Ellipse Arc: 270 degrees */}
      <group position={[12, 0, 0]}>
        <NurbsEllipseArc center={[0, 0, 0]} xaxis={[3, 0, 0]} yaxis={[0, 1.5, 0]} startAngle={0} endAngle={Math.PI * 1.5} color="#ff6600" lineWidth={lineWidth} resolution={64} />
      </group>

      {/* Bezier parabola (degree 2 curve with 3 control points) */}
      <group position={[20, 0, 0]}>
        <NurbsCurve points={[[-3, -2, 0], [0, 4, 0], [3, -2, 0]]} degree={2} color="#cc00cc" lineWidth={lineWidth} />
        {/* Show control points */}
        {[[-3, -2, 0], [0, 4, 0], [3, -2, 0]].map((pt, i) => <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
            <sphereGeometry args={[0.15, 8, 8]} />
            <meshBasicMaterial color="#cc00cc" />
          </mesh>)}
      </group>
    </>
}`,...(g=(h=m.parameters)==null?void 0:h.docs)==null?void 0:g.source}}};const z=["AllConics"];export{m as AllConics,z as __namedExportsOrder,S as default};
