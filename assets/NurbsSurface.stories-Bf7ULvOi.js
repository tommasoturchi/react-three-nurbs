import{j as s}from"./jsx-runtime-DiklIkkE.js";import{u as ne,v as oe,B as ae,F as O,M as ie,D as ce,a as ue,b as me,C as le,O as fe}from"./verb.es-vEISxjAU.js";import{r as q}from"./index-DRjF_FHU.js";function W({controlPoints:u,weights:T,degreeU:t,degreeV:n,color:N="#ffffff",wireframe:E=!1,children:m,...H}){const{scene:x}=ne(),[V,J]=q.useState(null);return q.useEffect(()=>{const j=u.length+t+1,v=u[0].length+n+1,Q=Array(j).fill(0).map((r,e)=>e<t+1?0:e>=j-t-1?1:(e-t)/(j-2*t-1)),X=Array(v).fill(0).map((r,e)=>e<n+1?0:e>=v-n-1?1:(e-n)/(v-2*n-1)),b=oe.geom.NurbsSurface.byKnotsControlPointsWeights(t,n,Q,X,u,T),o=new ae,_=[],B=[],M=[],A=20,d=20,Y=1/A,Z=1/d;for(let r=0;r<=A;r++)for(let e=0;e<=d;e++){const a=r*Y,i=e*Z,h=b.point(a,i),l=1e-4,ee=b.point(a+l,i),re=b.point(a,i+l),I=b.point(a,i),f=ee.map((g,P)=>(g-I[P])/l),p=re.map((g,P)=>(g-I[P])/l),c=[f[1]*p[2]-f[2]*p[1],f[2]*p[0]-f[0]*p[2],f[0]*p[1]-f[1]*p[0]],se=Math.sqrt(c[0]*c[0]+c[1]*c[1]+c[2]*c[2]),te=c.map(g=>g/se);_.push(...h),B.push(...te)}for(let r=0;r<A;r++)for(let e=0;e<d;e++){const a=r*(d+1)+e,i=a+1,h=(r+1)*(d+1)+e,l=h+1;M.push(a,i,h),M.push(i,l,h)}if(o.setAttribute("position",new O(_,3)),o.setAttribute("normal",new O(B,3)),o.setIndex(M),J(o),!m){const r=new ie({color:new ue(N),side:ce,wireframe:E}),e=new me(o,r);return x.add(e),()=>{x.remove(e),o.dispose(),r.dispose()}}return()=>{o.dispose()}},[u,T,t,n,N,E,x,m]),V&&m?!q.isValidElement(m)||!m.type.toString().includes("Material")?(console.warn("NurbsSurface children must be a material component"),null):s.jsxs("mesh",{...H,children:[s.jsx("primitive",{object:V,attach:"geometry"}),m]}):null}W.__docgenInfo={description:"",methods:[],displayName:"NurbsSurface",props:{controlPoints:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"Array",elements:[{name:"number"}],raw:"number[]"}],raw:"number[][]"}],raw:"number[][][]"},description:""},weights:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"number"}],raw:"number[]"}],raw:"number[][]"},description:""},degreeU:{required:!0,tsType:{name:"number"},description:""},degreeV:{required:!0,tsType:{name:"number"},description:""},color:{required:!1,tsType:{name:"string"},description:"",defaultValue:{value:'"#ffffff"',computed:!1}},wireframe:{required:!1,tsType:{name:"boolean"},description:"",defaultValue:{value:"false",computed:!1}},children:{required:!1,tsType:{name:"ReactElement"},description:""}},composes:["Omit"]};const ge={title:"Components/NurbsSurface",component:W,parameters:{layout:"centered"},tags:["autodocs"],decorators:[u=>s.jsx("div",{style:{width:"100%",height:"100%"},children:s.jsxs(le,{camera:{position:[5,5,5],fov:50},children:[s.jsx("ambientLight",{intensity:.5}),s.jsx("pointLight",{position:[10,10,10]}),s.jsx(u,{}),s.jsx(fe,{})]})})]},$=[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,1],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],C=[[1,1,1],[1,1,1],[1,1,1]],S={args:{controlPoints:$,weights:C,degreeU:2,degreeV:2,color:"#ff0000",wireframe:!1}},y={args:{controlPoints:[[[0,0,0],[1,0,0],[2,0,0]],[[0,1,0],[1,1,2],[2,1,0]],[[0,2,0],[1,2,0],[2,2,0]]],weights:C,degreeU:2,degreeV:2,children:s.jsx("meshStandardMaterial",{color:"#00ff00",metalness:.5,roughness:.5,wireframe:!0})}},w={args:{controlPoints:$,weights:C,degreeU:2,degreeV:2,position:[0,0,0],rotation:[0,Math.PI/4,0],scale:[1,1,1],children:s.jsx("meshPhongMaterial",{color:"#0000ff",shininess:100,specular:"#ffffff",wireframe:!1})}};var K,U,k;S.parameters={...S.parameters,docs:{...(K=S.parameters)==null?void 0:K.docs,source:{originalSource:`{
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    color: '#ff0000',
    wireframe: false
  }
}`,...(k=(U=S.parameters)==null?void 0:U.docs)==null?void 0:k.source}}};var D,F,G;y.parameters={...y.parameters,docs:{...(D=y.parameters)==null?void 0:D.docs,source:{originalSource:`{
  args: {
    controlPoints: [[[0, 0, 0], [1, 0, 0], [2, 0, 0]], [[0, 1, 0], [1, 1, 2], [2, 1, 0]], [[0, 2, 0], [1, 2, 0], [2, 2, 0]]],
    weights,
    degreeU: 2,
    degreeV: 2,
    children: <meshStandardMaterial color="#00ff00" metalness={0.5} roughness={0.5} wireframe={true} />
  }
}`,...(G=(F=y.parameters)==null?void 0:F.docs)==null?void 0:G.source}}};var L,R,z;w.parameters={...w.parameters,docs:{...(L=w.parameters)==null?void 0:L.docs,source:{originalSource:`{
  args: {
    controlPoints,
    weights,
    degreeU: 2,
    degreeV: 2,
    position: [0, 0, 0],
    rotation: [0, Math.PI / 4, 0],
    scale: [1, 1, 1],
    children: <meshPhongMaterial color="#0000ff" shininess={100} specular="#ffffff" wireframe={false} />
  }
}`,...(z=(R=w.parameters)==null?void 0:R.docs)==null?void 0:z.source}}};const be=["SimpleSurface","BulgedSurface","CustomMaterialSurface"];export{y as BulgedSurface,w as CustomMaterialSurface,S as SimpleSurface,be as __namedExportsOrder,ge as default};
