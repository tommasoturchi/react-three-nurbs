import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{B as H,F as M,N as $,D as T,C as z,O as J}from"./curve-CYvlzlZm.js";import{r as P}from"./index-Bc2G9s8g.js";import{N as o}from"./NurbsCurve-CQjwMhxT.js";import{i as Q}from"./materials-D2_MRo5E.js";import{g as X}from"./nurbs-DVTS2-kg.js";import"./Line-BLcUCERj.js";function Y(t,i,f,g,n,r){const c=t.point(0),b=t.point(1),u=i.point(0),x=i.point(1),C=(n+1)*(r+1),W=new Float32Array(C*3),s=new Float32Array(C*2);let v=0,N=0;for(let m=0;m<=n;m++)for(let w=0;w<=r;w++){const l=m/n,a=w/r,A=t.point(l),R=i.point(l),O=f.point(a),G=g.point(a);for(let h=0;h<3;h++){const K=(1-a)*A[h]+a*R[h],I=(1-l)*O[h]+l*G[h],L=(1-l)*(1-a)*c[h]+l*(1-a)*b[h]+(1-l)*a*u[h]+l*a*x[h];W[v++]=K+I-L}s[N++]=l,s[N++]=a}const d=n*r*6,p=new Uint32Array(d);let y=0;for(let m=0;m<n;m++)for(let w=0;w<r;w++){const l=m*(r+1)+w,a=l+1,A=(m+1)*(r+1)+w,R=A+1;p[y++]=l,p[y++]=a,p[y++]=A,p[y++]=a,p[y++]=R,p[y++]=A}const j=new H;return j.setAttribute("position",new M(W,3)),j.setAttribute("uv",new M(s,2)),j.setIndex(Array.from(p)),j.computeVertexNormals(),j.computeBoundingSphere(),j}const B=P.forwardRef(function({resolutionU:i=20,resolutionV:f=20,color:g="#ff0000",wireframe:n=!1,children:r,...c},b){const{curveChildren:u,materialChild:x}=P.useMemo(()=>{const s=[];let v=null;const N=P.Children.toArray(r);for(const d of N)P.isValidElement(d)&&d.type===o?s.push(d):Q(d)&&(v=d);return{curveChildren:s,materialChild:v}},[r]),C=P.useRef(null),W=P.useMemo(()=>{if(u.length!==4)return console.error("CoonsPatch requires exactly 4 NurbsCurve children (bottom, top, left, right)"),null;try{const s=u.map(N=>{const{points:d,degree:p=3,weights:y,knots:j}=N.props,m=j??X(d.length,p);return $.byKnotsControlPointsWeights(p,m,d,y??Array(d.length).fill(1))}),v=Y(s[0],s[1],s[2],s[3],i,f);return C.current&&C.current!==v&&C.current.dispose(),C.current=v,v}catch(s){return console.error("Error creating Coons patch:",s),null}},[u,i,f]);return W?e.jsx("mesh",{ref:b,...c,geometry:W,children:x||e.jsx("meshPhongMaterial",{color:g,wireframe:n,side:T})}):null});B.__docgenInfo={description:"",methods:[],displayName:"CoonsPatch",props:{resolutionU:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},resolutionV:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"20",computed:!1}},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ff0000"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!0,tsType:{name:"union",raw:"ReactElement | ReactElement[]",elements:[{name:"ReactElement"},{name:"Array",elements:[{name:"ReactElement"}],raw:"ReactElement[]"}]},description:""}},composes:["Omit"]};const ie={title:"Components/CoonsPatch",parameters:{layout:"centered",docs:{description:{component:"Creates a smooth surface that fills the region enclosed by 4 boundary curves. The 4 curves define the edges: bottom (red), top (green), left (blue), right (orange). The surface smoothly interpolates between them using bilinear Coons interpolation. This is the standard technique for filling holes between surface patches in CAD."}}},decorators:[t=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(z,{camera:{position:[2,3,4],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx("pointLight",{position:[10,10,10]}),e.jsx(t,{}),e.jsx(J,{})]})})],argTypes:{color:{control:"color",description:"Surface color"},wireframe:{control:"boolean",description:"Wireframe rendering"},resolutionU:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in U"},resolutionV:{control:{type:"range",min:5,max:60,step:5},description:"Tessellation resolution in V"},bulge:{control:{type:"range",min:0,max:2,step:.1},description:"How much the boundary curves bulge upward"}}};function _(t){const i=[[0,0,0],[1,0,t*.5],[2,0,0]],f=[[0,2,0],[1,2,t],[2,2,0]],g=[[0,0,0],[0,1,t*.3],[0,2,0]],n=[[2,0,0],[2,1,t*.8],[2,2,0]];return{bottom:i,top:f,left:g,right:n}}const V={args:{color:"#6688cc",wireframe:!1,resolutionU:30,resolutionV:30,bulge:1},render:({color:t="#6688cc",wireframe:i=!1,resolutionU:f=30,resolutionV:g=30,bulge:n=1})=>{const{bottom:r,top:c,left:b,right:u}=_(n);return e.jsxs(e.Fragment,{children:[e.jsxs(B,{resolutionU:f,resolutionV:g,children:[e.jsx(o,{points:r,degree:2}),e.jsx(o,{points:c,degree:2}),e.jsx(o,{points:b,degree:2}),e.jsx(o,{points:u,degree:2}),e.jsx("meshPhongMaterial",{color:t,wireframe:i,side:T})]}),e.jsx(o,{points:r,degree:2,color:"#ff3333",lineWidth:3}),e.jsx(o,{points:c,degree:2,color:"#33ff33",lineWidth:3}),e.jsx(o,{points:b,degree:2,color:"#3333ff",lineWidth:3}),e.jsx(o,{points:u,degree:2,color:"#ffaa00",lineWidth:3}),[r[0],r[2],c[0],c[2]].map((x,C)=>e.jsxs("mesh",{position:[x[0],x[1],x[2]],children:[e.jsx("sphereGeometry",{args:[.05,8,8]}),e.jsx("meshBasicMaterial",{color:"#ffffff"})]},C))]})}},E={args:{color:"#ff4488",wireframe:!0,resolutionU:20,resolutionV:20,bulge:.8},render:({color:t="#ff4488",wireframe:i=!0,resolutionU:f=20,resolutionV:g=20,bulge:n=.8})=>{const{bottom:r,top:c,left:b,right:u}=_(n);return e.jsxs(e.Fragment,{children:[e.jsxs(B,{resolutionU:f,resolutionV:g,children:[e.jsx(o,{points:r,degree:2}),e.jsx(o,{points:c,degree:2}),e.jsx(o,{points:b,degree:2}),e.jsx(o,{points:u,degree:2}),e.jsx("meshPhongMaterial",{color:t,wireframe:i,side:T})]}),e.jsx(o,{points:r,degree:2,color:"#ff3333",lineWidth:3}),e.jsx(o,{points:c,degree:2,color:"#33ff33",lineWidth:3}),e.jsx(o,{points:b,degree:2,color:"#3333ff",lineWidth:3}),e.jsx(o,{points:u,degree:2,color:"#ffaa00",lineWidth:3})]})}};var U,k,q;V.parameters={...V.parameters,docs:{...(U=V.parameters)==null?void 0:U.docs,source:{originalSource:`{
  args: {
    color: "#6688cc",
    wireframe: false,
    resolutionU: 30,
    resolutionV: 30,
    bulge: 1.0
  },
  render: ({
    color = "#6688cc",
    wireframe = false,
    resolutionU = 30,
    resolutionV = 30,
    bulge = 1.0
  }: Record<string, any>) => {
    const {
      bottom,
      top,
      left,
      right
    } = makeBoundaries(bulge);
    return <>
        <CoonsPatch resolutionU={resolutionU} resolutionV={resolutionV}>
          <NurbsCurve points={bottom} degree={2} />
          <NurbsCurve points={top} degree={2} />
          <NurbsCurve points={left} degree={2} />
          <NurbsCurve points={right} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </CoonsPatch>
        {/* Boundary curves colored to show which is which */}
        <NurbsCurve points={bottom} degree={2} color="#ff3333" lineWidth={3} />
        <NurbsCurve points={top} degree={2} color="#33ff33" lineWidth={3} />
        <NurbsCurve points={left} degree={2} color="#3333ff" lineWidth={3} />
        <NurbsCurve points={right} degree={2} color="#ffaa00" lineWidth={3} />
        {/* Corner markers */}
        {[bottom[0], bottom[2], top[0], top[2]].map((pt, i) => <mesh key={i} position={[pt[0], pt[1], pt[2]]}>
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>)}
      </>;
  }
}`,...(q=(k=V.parameters)==null?void 0:k.docs)==null?void 0:q.source}}};var D,S,F;E.parameters={...E.parameters,docs:{...(D=E.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    color: "#ff4488",
    wireframe: true,
    resolutionU: 20,
    resolutionV: 20,
    bulge: 0.8
  },
  render: ({
    color = "#ff4488",
    wireframe = true,
    resolutionU = 20,
    resolutionV = 20,
    bulge = 0.8
  }: Record<string, any>) => {
    const {
      bottom,
      top,
      left,
      right
    } = makeBoundaries(bulge);
    return <>
        <CoonsPatch resolutionU={resolutionU} resolutionV={resolutionV}>
          <NurbsCurve points={bottom} degree={2} />
          <NurbsCurve points={top} degree={2} />
          <NurbsCurve points={left} degree={2} />
          <NurbsCurve points={right} degree={2} />
          <meshPhongMaterial color={color} wireframe={wireframe} side={DoubleSide} />
        </CoonsPatch>
        <NurbsCurve points={bottom} degree={2} color="#ff3333" lineWidth={3} />
        <NurbsCurve points={top} degree={2} color="#33ff33" lineWidth={3} />
        <NurbsCurve points={left} degree={2} color="#3333ff" lineWidth={3} />
        <NurbsCurve points={right} degree={2} color="#ffaa00" lineWidth={3} />
      </>;
  }
}`,...(F=(S=E.parameters)==null?void 0:S.docs)==null?void 0:F.source}}};const le=["Default","Wireframe"];export{V as Default,E as Wireframe,le as __namedExportsOrder,ie as default};
