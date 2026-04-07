import{j as e}from"./jsx-runtime-DFAAy_2V.js";import{r as f}from"./index-Bc2G9s8g.js";import{C as z,O as H,N as j,V as h}from"./curve-y__KqdvR.js";import{I as D}from"./InterpolatedCurve-BbJb-N0y.js";import{L as v}from"./Line-CsLz4hyq.js";const ne={title:"Curves/Operations",parameters:{layout:"centered"},decorators:[s=>e.jsx("div",{style:{width:"100vw",height:"100vh"},children:e.jsxs(z,{camera:{position:[5,5,5],fov:50},children:[e.jsx("ambientLight",{intensity:.5}),e.jsx(s,{}),e.jsx(H,{})]})})]},x=[[-3,0,0],[-1,2,-1],[1,-1,1],[3,1,0],[5,0,-1]];function J({numTestPoints:s=8}){const n=f.useMemo(()=>{const r=j.byPoints(x,3),t=Array.from({length:s},(i,a)=>{const o=Math.floor(a/3),d=a%3;return[-2+a/(s-1)*8,-3+d*3,-2+o*1.5]}),c=[],p=[];for(const i of t){const a=r.closestParam(i),o=r.point(a);c.push({from:new h(i[0],i[1],i[2]),to:new h(o[0],o[1],o[2])}),p.push(new h(o[0],o[1],o[2]))}return{testPoints:t,lines:c,closestPts:p}},[s]);return e.jsxs(e.Fragment,{children:[e.jsx(D,{throughPoints:x,degree:3,color:"#0066ff",lineWidth:2}),n.testPoints.map((r,t)=>e.jsxs("mesh",{position:[r[0],r[1],r[2]],children:[e.jsx("sphereGeometry",{args:[.08,8,8]}),e.jsx("meshBasicMaterial",{color:"#ff0000"})]},`tp-${t}`)),n.closestPts.map((r,t)=>e.jsxs("mesh",{position:r,children:[e.jsx("sphereGeometry",{args:[.08,8,8]}),e.jsx("meshBasicMaterial",{color:"#00ff00"})]},`cp-${t}`)),n.lines.map((r,t)=>e.jsx(v,{points:[r.from,r.to],color:"#888888",lineWidth:1},`line-${t}`))]})}const y={args:{numTestPoints:8},argTypes:{numTestPoints:{control:{type:"range",min:3,max:20,step:1},description:"Number of test points"}},render:s=>e.jsx(J,{...s})};function Q({divisions:s=12}){const n=f.useMemo(()=>j.byPoints(x,3).divideByEqualArcLength(s),[s]);return e.jsxs(e.Fragment,{children:[e.jsx(D,{throughPoints:x,degree:3,color:"#0066ff",lineWidth:2}),n.map((r,t)=>e.jsxs("mesh",{position:[r.pt[0],r.pt[1],r.pt[2]],children:[e.jsx("sphereGeometry",{args:[.06,8,8]}),e.jsx("meshBasicMaterial",{color:"#ffaa00"})]},t))]})}const P={args:{divisions:12},argTypes:{divisions:{control:{type:"range",min:2,max:40,step:1},description:"Number of divisions"}},render:s=>e.jsx(Q,{...s})};function U(){const s=f.useMemo(()=>[[-3,-1,0],[0,3,0],[3,-1,0]],[]),n=f.useMemo(()=>[[-3,1,0],[0,-3,0],[3,1,0]],[]),r=f.useMemo(()=>{const t=j.byPoints(s,2),c=j.byPoints(n,2),p=[],i=200;for(let a=0;a<i;a++){const o=t.point(a/i);for(let d=0;d<i;d++){const m=c.point(d/i);if(Math.sqrt((o[0]-m[0])**2+(o[1]-m[1])**2+(o[2]-m[2])**2)<.05){const l=new h((o[0]+m[0])/2,(o[1]+m[1])/2,(o[2]+m[2])/2);p.some(E=>E.distanceTo(l)<.2)||p.push(l)}}}return p},[s,n]);return e.jsxs(e.Fragment,{children:[e.jsx(D,{throughPoints:s,degree:2,color:"#ff0000",lineWidth:2}),e.jsx(D,{throughPoints:n,degree:2,color:"#0066ff",lineWidth:2}),r.map((t,c)=>e.jsxs("mesh",{position:t,children:[e.jsx("sphereGeometry",{args:[.12,16,16]}),e.jsx("meshBasicMaterial",{color:"#ffff00"})]},c))]})}const C={render:()=>e.jsx(U,{})};function X(){const s=f.useMemo(()=>{const n=j.byPoints(x,3),r=n.reverse(),t=50,c=Array.from({length:t+1},(m,g)=>{const l=n.point(g/t);return new h(l[0],l[1],l[2])}),p=Array.from({length:t+1},(m,g)=>{const l=r.point(g/t);return new h(l[0],l[1]-3,l[2])}),i=n.point(0),a=n.point(1),o=r.point(0),d=r.point(1);return{originalPts:c,reversedPts:p,origStart:i,origEnd:a,revStart:o,revEnd:d}},[]);return e.jsxs(e.Fragment,{children:[e.jsx(v,{points:s.originalPts,color:"#0066ff",lineWidth:2}),e.jsx(v,{points:s.reversedPts,color:"#ff6600",lineWidth:2}),e.jsxs("mesh",{position:[s.origStart[0],s.origStart[1],s.origStart[2]],children:[e.jsx("sphereGeometry",{args:[.1,8,8]}),e.jsx("meshBasicMaterial",{color:"#00ff00"})]}),e.jsxs("mesh",{position:[s.origEnd[0],s.origEnd[1],s.origEnd[2]],children:[e.jsx("sphereGeometry",{args:[.1,8,8]}),e.jsx("meshBasicMaterial",{color:"#ff0000"})]}),e.jsxs("mesh",{position:[s.revStart[0],s.revStart[1]-3,s.revStart[2]],children:[e.jsx("sphereGeometry",{args:[.1,8,8]}),e.jsx("meshBasicMaterial",{color:"#00ff00"})]}),e.jsxs("mesh",{position:[s.revEnd[0],s.revEnd[1]-3,s.revEnd[2]],children:[e.jsx("sphereGeometry",{args:[.1,8,8]}),e.jsx("meshBasicMaterial",{color:"#ff0000"})]})]})}const M={render:()=>e.jsx(X,{})};function Y({splitParam:s=.4}){const n=f.useMemo(()=>{const r=j.byPoints(x,3),[t,c]=r.split(s),p=50,i=t.knots(),a=i[t.degree()],o=i[i.length-t.degree()-1],d=Array.from({length:p+1},(V,b)=>{const w=a+(o-a)*b/p,u=t.point(w);return new h(u[0],u[1],u[2])}),m=c.knots(),g=m[c.degree()],l=m[m.length-c.degree()-1],E=Array.from({length:p+1},(V,b)=>{const w=g+(l-g)*b/p,u=c.point(w);return new h(u[0],u[1],u[2])}),K=r.point(s);return{leftPts:d,rightPts:E,splitPt:K}},[s]);return e.jsxs(e.Fragment,{children:[e.jsx(v,{points:n.leftPts,color:"#ff0000",lineWidth:3}),e.jsx(v,{points:n.rightPts,color:"#0066ff",lineWidth:3}),e.jsxs("mesh",{position:[n.splitPt[0],n.splitPt[1],n.splitPt[2]],children:[e.jsx("sphereGeometry",{args:[.12,16,16]}),e.jsx("meshBasicMaterial",{color:"#ffff00"})]}),x.map((r,t)=>e.jsxs("mesh",{position:[r[0],r[1],r[2]],children:[e.jsx("sphereGeometry",{args:[.06,8,8]}),e.jsx("meshBasicMaterial",{color:"#888888"})]},t))]})}const S={args:{splitParam:.4},argTypes:{splitParam:{control:{type:"range",min:.1,max:.9,step:.05},description:"Split parameter (0-1)"}},render:s=>e.jsx(Y,{...s})};var B,G,T;y.parameters={...y.parameters,docs:{...(B=y.parameters)==null?void 0:B.docs,source:{originalSource:`{
  args: {
    numTestPoints: 8
  },
  argTypes: {
    numTestPoints: {
      control: {
        type: "range",
        min: 3,
        max: 20,
        step: 1
      },
      description: "Number of test points"
    }
  },
  render: (args: Record<string, any>) => <ClosestPointDemo {...args} />
}`,...(T=(G=y.parameters)==null?void 0:G.docs)==null?void 0:T.source}}};var W,A,R;P.parameters={...P.parameters,docs:{...(W=P.parameters)==null?void 0:W.docs,source:{originalSource:`{
  args: {
    divisions: 12
  },
  argTypes: {
    divisions: {
      control: {
        type: "range",
        min: 2,
        max: 40,
        step: 1
      },
      description: "Number of divisions"
    }
  },
  render: (args: Record<string, any>) => <CurveDivideDemo {...args} />
}`,...(R=(A=P.parameters)==null?void 0:A.docs)==null?void 0:R.source}}};var _,I,L;C.parameters={...C.parameters,docs:{...(_=C.parameters)==null?void 0:_.docs,source:{originalSource:`{
  render: () => <CurveIntersectionDemo />
}`,...(L=(I=C.parameters)==null?void 0:I.docs)==null?void 0:L.source}}};var N,F,q;M.parameters={...M.parameters,docs:{...(N=M.parameters)==null?void 0:N.docs,source:{originalSource:`{
  render: () => <CurveReverseDemo />
}`,...(q=(F=M.parameters)==null?void 0:F.docs)==null?void 0:q.source}}};var O,$,k;S.parameters={...S.parameters,docs:{...(O=S.parameters)==null?void 0:O.docs,source:{originalSource:`{
  args: {
    splitParam: 0.4
  },
  argTypes: {
    splitParam: {
      control: {
        type: "range",
        min: 0.1,
        max: 0.9,
        step: 0.05
      },
      description: "Split parameter (0-1)"
    }
  },
  render: (args: Record<string, any>) => <CurveSplitDemo {...args} />
}`,...(k=($=S.parameters)==null?void 0:$.docs)==null?void 0:k.source}}};const oe=["ClosestPoint","EqualArcLengthDivision","CurveIntersection","CurveReverse","CurveSplit"];export{y as ClosestPoint,C as CurveIntersection,M as CurveReverse,S as CurveSplit,P as EqualArcLengthDivision,oe as __namedExportsOrder,ne as default};
