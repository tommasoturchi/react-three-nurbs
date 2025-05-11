import{j as ie}from"./jsx-runtime-DiklIkkE.js";import{r as y}from"./index-DRjF_FHU.js";import{R as se,I as oe,F as V,c as N,d as M,W as re,e as j,S as Q,V as S,f as ae,U as G,g as q,h as Y,b as le,i as z,L as ce,j as de,k as fe,u as ue,a as pe,_ as F,v as me}from"./verb.es-vEISxjAU.js";const Z=parseInt(se.replace(/\D+/g,"")),ee=Z>=125?"uv1":"uv2",k=new j,C=new S;class H extends oe{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";const e=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],t=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],s=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(s),this.setAttribute("position",new V(e,3)),this.setAttribute("uv",new V(t,2))}applyMatrix4(e){const t=this.attributes.instanceStart,s=this.attributes.instanceEnd;return t!==void 0&&(t.applyMatrix4(e),s.applyMatrix4(e),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(e){let t;e instanceof Float32Array?t=e:Array.isArray(e)&&(t=new Float32Array(e));const s=new N(t,6,1);return this.setAttribute("instanceStart",new M(s,3,0)),this.setAttribute("instanceEnd",new M(s,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(e,t=3){let s;e instanceof Float32Array?s=e:Array.isArray(e)&&(s=new Float32Array(e));const n=new N(s,t*2,1);return this.setAttribute("instanceColorStart",new M(n,t,0)),this.setAttribute("instanceColorEnd",new M(n,t,t)),this}fromWireframeGeometry(e){return this.setPositions(e.attributes.position.array),this}fromEdgesGeometry(e){return this.setPositions(e.attributes.position.array),this}fromMesh(e){return this.fromWireframeGeometry(new re(e.geometry)),this}fromLineSegments(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new j);const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;e!==void 0&&t!==void 0&&(this.boundingBox.setFromBufferAttribute(e),k.setFromBufferAttribute(t),this.boundingBox.union(k))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Q),this.boundingBox===null&&this.computeBoundingBox();const e=this.attributes.instanceStart,t=this.attributes.instanceEnd;if(e!==void 0&&t!==void 0){const s=this.boundingSphere.center;this.boundingBox.getCenter(s);let n=0;for(let i=0,a=e.count;i<a;i++)C.fromBufferAttribute(e,i),n=Math.max(n,s.distanceToSquared(C)),C.fromBufferAttribute(t,i),n=Math.max(n,s.distanceToSquared(C));this.boundingSphere.radius=Math.sqrt(n),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(e){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(e)}}class te extends H{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(e){const t=e.length-3,s=new Float32Array(2*t);for(let n=0;n<t;n+=3)s[2*n]=e[n],s[2*n+1]=e[n+1],s[2*n+2]=e[n+2],s[2*n+3]=e[n+3],s[2*n+4]=e[n+4],s[2*n+5]=e[n+5];return super.setPositions(s),this}setColors(e,t=3){const s=e.length-t,n=new Float32Array(2*s);if(t===3)for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5];else for(let i=0;i<s;i+=t)n[2*i]=e[i],n[2*i+1]=e[i+1],n[2*i+2]=e[i+2],n[2*i+3]=e[i+3],n[2*i+4]=e[i+4],n[2*i+5]=e[i+5],n[2*i+6]=e[i+6],n[2*i+7]=e[i+7];return super.setColors(n,t),this}fromLine(e){const t=e.geometry;return this.setPositions(t.attributes.position.array),this}}class W extends ae{constructor(e){super({type:"LineMaterial",uniforms:G.clone(G.merge([q.common,q.fog,{worldUnits:{value:1},linewidth:{value:1},resolution:{value:new Y(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}}])),vertexShader:`
				#include <common>
				#include <fog_pars_vertex>
				#include <logdepthbuf_pars_vertex>
				#include <clipping_planes_pars_vertex>

				uniform float linewidth;
				uniform vec2 resolution;

				attribute vec3 instanceStart;
				attribute vec3 instanceEnd;

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
						attribute vec4 instanceColorStart;
						attribute vec4 instanceColorEnd;
					#else
						varying vec3 vLineColor;
						attribute vec3 instanceColorStart;
						attribute vec3 instanceColorEnd;
					#endif
				#endif

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#ifdef USE_DASH

					uniform float dashScale;
					attribute float instanceDistanceStart;
					attribute float instanceDistanceEnd;
					varying float vLineDistance;

				#endif

				void trimSegment( const in vec4 start, inout vec4 end ) {

					// trim end segment so it terminates between the camera plane and the near plane

					// conservative estimate of the near plane
					float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
					float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
					float nearEstimate = - 0.5 * b / a;

					float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

					end.xyz = mix( start.xyz, end.xyz, alpha );

				}

				void main() {

					#ifdef USE_COLOR

						vLineColor = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

					#endif

					#ifdef USE_DASH

						vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
						vUv = uv;

					#endif

					float aspect = resolution.x / resolution.y;

					// camera space
					vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
					vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

					#ifdef WORLD_UNITS

						worldStart = start.xyz;
						worldEnd = end.xyz;

					#else

						vUv = uv;

					#endif

					// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
					// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
					// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
					// perhaps there is a more elegant solution -- WestLangley

					bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

					if ( perspective ) {

						if ( start.z < 0.0 && end.z >= 0.0 ) {

							trimSegment( start, end );

						} else if ( end.z < 0.0 && start.z >= 0.0 ) {

							trimSegment( end, start );

						}

					}

					// clip space
					vec4 clipStart = projectionMatrix * start;
					vec4 clipEnd = projectionMatrix * end;

					// ndc space
					vec3 ndcStart = clipStart.xyz / clipStart.w;
					vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

					// direction
					vec2 dir = ndcEnd.xy - ndcStart.xy;

					// account for clip-space aspect ratio
					dir.x *= aspect;
					dir = normalize( dir );

					#ifdef WORLD_UNITS

						// get the offset direction as perpendicular to the view vector
						vec3 worldDir = normalize( end.xyz - start.xyz );
						vec3 offset;
						if ( position.y < 0.5 ) {

							offset = normalize( cross( start.xyz, worldDir ) );

						} else {

							offset = normalize( cross( end.xyz, worldDir ) );

						}

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						float forwardOffset = dot( worldDir, vec3( 0.0, 0.0, 1.0 ) );

						// don't extend the line if we're rendering dashes because we
						// won't be rendering the endcaps
						#ifndef USE_DASH

							// extend the line bounds to encompass  endcaps
							start.xyz += - worldDir * linewidth * 0.5;
							end.xyz += worldDir * linewidth * 0.5;

							// shift the position of the quad so it hugs the forward edge of the line
							offset.xy -= dir * forwardOffset;
							offset.z += 0.5;

						#endif

						// endcaps
						if ( position.y > 1.0 || position.y < 0.0 ) {

							offset.xy += dir * 2.0 * forwardOffset;

						}

						// adjust for linewidth
						offset *= linewidth * 0.5;

						// set the world position
						worldPos = ( position.y < 0.5 ) ? start : end;
						worldPos.xyz += offset;

						// project the worldpos
						vec4 clip = projectionMatrix * worldPos;

						// shift the depth of the projected points so the line
						// segments overlap neatly
						vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
						clip.z = clipPose.z * clip.w;

					#else

						vec2 offset = vec2( dir.y, - dir.x );
						// undo aspect ratio adjustment
						dir.x /= aspect;
						offset.x /= aspect;

						// sign flip
						if ( position.x < 0.0 ) offset *= - 1.0;

						// endcaps
						if ( position.y < 0.0 ) {

							offset += - dir;

						} else if ( position.y > 1.0 ) {

							offset += dir;

						}

						// adjust for linewidth
						offset *= linewidth;

						// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
						offset /= resolution.y;

						// select end
						vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

						// back to clip space
						offset *= clip.w;

						clip.xy += offset;

					#endif

					gl_Position = clip;

					vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

					#include <logdepthbuf_vertex>
					#include <clipping_planes_vertex>
					#include <fog_vertex>

				}
			`,fragmentShader:`
				uniform vec3 diffuse;
				uniform float opacity;
				uniform float linewidth;

				#ifdef USE_DASH

					uniform float dashOffset;
					uniform float dashSize;
					uniform float gapSize;

				#endif

				varying float vLineDistance;

				#ifdef WORLD_UNITS

					varying vec4 worldPos;
					varying vec3 worldStart;
					varying vec3 worldEnd;

					#ifdef USE_DASH

						varying vec2 vUv;

					#endif

				#else

					varying vec2 vUv;

				#endif

				#include <common>
				#include <fog_pars_fragment>
				#include <logdepthbuf_pars_fragment>
				#include <clipping_planes_pars_fragment>

				#ifdef USE_COLOR
					#ifdef USE_LINE_COLOR_ALPHA
						varying vec4 vLineColor;
					#else
						varying vec3 vLineColor;
					#endif
				#endif

				vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

					float mua;
					float mub;

					vec3 p13 = p1 - p3;
					vec3 p43 = p4 - p3;

					vec3 p21 = p2 - p1;

					float d1343 = dot( p13, p43 );
					float d4321 = dot( p43, p21 );
					float d1321 = dot( p13, p21 );
					float d4343 = dot( p43, p43 );
					float d2121 = dot( p21, p21 );

					float denom = d2121 * d4343 - d4321 * d4321;

					float numer = d1343 * d4321 - d1321 * d4343;

					mua = numer / denom;
					mua = clamp( mua, 0.0, 1.0 );
					mub = ( d1343 + d4321 * ( mua ) ) / d4343;
					mub = clamp( mub, 0.0, 1.0 );

					return vec2( mua, mub );

				}

				void main() {

					#include <clipping_planes_fragment>

					#ifdef USE_DASH

						if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

						if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

					#endif

					float alpha = opacity;

					#ifdef WORLD_UNITS

						// Find the closest points on the view ray and the line segment
						vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
						vec3 lineDir = worldEnd - worldStart;
						vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

						vec3 p1 = worldStart + lineDir * params.x;
						vec3 p2 = rayEnd * params.y;
						vec3 delta = p1 - p2;
						float len = length( delta );
						float norm = len / linewidth;

						#ifndef USE_DASH

							#ifdef USE_ALPHA_TO_COVERAGE

								float dnorm = fwidth( norm );
								alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

							#else

								if ( norm > 0.5 ) {

									discard;

								}

							#endif

						#endif

					#else

						#ifdef USE_ALPHA_TO_COVERAGE

							// artifacts appear on some hardware if a derivative is taken within a conditional
							float a = vUv.x;
							float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
							float len2 = a * a + b * b;
							float dlen = fwidth( len2 );

							if ( abs( vUv.y ) > 1.0 ) {

								alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

							}

						#else

							if ( abs( vUv.y ) > 1.0 ) {

								float a = vUv.x;
								float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
								float len2 = a * a + b * b;

								if ( len2 > 1.0 ) discard;

							}

						#endif

					#endif

					vec4 diffuseColor = vec4( diffuse, alpha );
					#ifdef USE_COLOR
						#ifdef USE_LINE_COLOR_ALPHA
							diffuseColor *= vLineColor;
						#else
							diffuseColor.rgb *= vLineColor;
						#endif
					#endif

					#include <logdepthbuf_fragment>

					gl_FragColor = diffuseColor;

					#include <tonemapping_fragment>
					#include <${Z>=154?"colorspace_fragment":"encodings_fragment"}>
					#include <fog_fragment>
					#include <premultiplied_alpha_fragment>

				}
			`,clipping:!0}),this.isLineMaterial=!0,this.onBeforeCompile=function(){this.transparent?this.defines.USE_LINE_COLOR_ALPHA="1":delete this.defines.USE_LINE_COLOR_ALPHA},Object.defineProperties(this,{color:{enumerable:!0,get:function(){return this.uniforms.diffuse.value},set:function(t){this.uniforms.diffuse.value=t}},worldUnits:{enumerable:!0,get:function(){return"WORLD_UNITS"in this.defines},set:function(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}},linewidth:{enumerable:!0,get:function(){return this.uniforms.linewidth.value},set:function(t){this.uniforms.linewidth.value=t}},dashed:{enumerable:!0,get:function(){return"USE_DASH"in this.defines},set(t){!!t!="USE_DASH"in this.defines&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}},dashScale:{enumerable:!0,get:function(){return this.uniforms.dashScale.value},set:function(t){this.uniforms.dashScale.value=t}},dashSize:{enumerable:!0,get:function(){return this.uniforms.dashSize.value},set:function(t){this.uniforms.dashSize.value=t}},dashOffset:{enumerable:!0,get:function(){return this.uniforms.dashOffset.value},set:function(t){this.uniforms.dashOffset.value=t}},gapSize:{enumerable:!0,get:function(){return this.uniforms.gapSize.value},set:function(t){this.uniforms.gapSize.value=t}},opacity:{enumerable:!0,get:function(){return this.uniforms.opacity.value},set:function(t){this.uniforms.opacity.value=t}},resolution:{enumerable:!0,get:function(){return this.uniforms.resolution.value},set:function(t){this.uniforms.resolution.value.copy(t)}},alphaToCoverage:{enumerable:!0,get:function(){return"USE_ALPHA_TO_COVERAGE"in this.defines},set:function(t){!!t!="USE_ALPHA_TO_COVERAGE"in this.defines&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1)}}}),this.setValues(e)}}const P=new z,$=new S,J=new S,d=new z,f=new z,w=new z,I=new S,R=new de,u=new ce,K=new S,O=new j,D=new Q,x=new z;let _,U;function X(l,e,t){return x.set(0,0,-e,1).applyMatrix4(l.projectionMatrix),x.multiplyScalar(1/x.w),x.x=U/t.width,x.y=U/t.height,x.applyMatrix4(l.projectionMatrixInverse),x.multiplyScalar(1/x.w),Math.abs(Math.max(x.x,x.y))}function he(l,e){const t=l.matrixWorld,s=l.geometry,n=s.attributes.instanceStart,i=s.attributes.instanceEnd,a=Math.min(s.instanceCount,n.count);for(let o=0,p=a;o<p;o++){u.start.fromBufferAttribute(n,o),u.end.fromBufferAttribute(i,o),u.applyMatrix4(t);const h=new S,m=new S;_.distanceSqToSegment(u.start,u.end,m,h),m.distanceTo(h)<U*.5&&e.push({point:m,pointOnLine:h,distance:_.origin.distanceTo(m),object:l,face:null,faceIndex:o,uv:null,[ee]:null})}}function ve(l,e,t){const s=e.projectionMatrix,i=l.material.resolution,a=l.matrixWorld,o=l.geometry,p=o.attributes.instanceStart,h=o.attributes.instanceEnd,m=Math.min(o.instanceCount,p.count),c=-e.near;_.at(1,w),w.w=1,w.applyMatrix4(e.matrixWorldInverse),w.applyMatrix4(s),w.multiplyScalar(1/w.w),w.x*=i.x/2,w.y*=i.y/2,w.z=0,I.copy(w),R.multiplyMatrices(e.matrixWorldInverse,a);for(let g=0,B=m;g<B;g++){if(d.fromBufferAttribute(p,g),f.fromBufferAttribute(h,g),d.w=1,f.w=1,d.applyMatrix4(R),f.applyMatrix4(R),d.z>c&&f.z>c)continue;if(d.z>c){const r=d.z-f.z,v=(d.z-c)/r;d.lerp(f,v)}else if(f.z>c){const r=f.z-d.z,v=(f.z-c)/r;f.lerp(d,v)}d.applyMatrix4(s),f.applyMatrix4(s),d.multiplyScalar(1/d.w),f.multiplyScalar(1/f.w),d.x*=i.x/2,d.y*=i.y/2,f.x*=i.x/2,f.y*=i.y/2,u.start.copy(d),u.start.z=0,u.end.copy(f),u.end.z=0;const A=u.closestPointToPointParameter(I,!0);u.at(A,K);const b=fe.lerp(d.z,f.z,A),L=b>=-1&&b<=1,T=I.distanceTo(K)<U*.5;if(L&&T){u.start.fromBufferAttribute(p,g),u.end.fromBufferAttribute(h,g),u.start.applyMatrix4(a),u.end.applyMatrix4(a);const r=new S,v=new S;_.distanceSqToSegment(u.start,u.end,v,r),t.push({point:v,pointOnLine:r,distance:_.origin.distanceTo(v),object:l,face:null,faceIndex:g,uv:null,[ee]:null})}}}class ne extends le{constructor(e=new H,t=new W({color:Math.random()*16777215})){super(e,t),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){const e=this.geometry,t=e.attributes.instanceStart,s=e.attributes.instanceEnd,n=new Float32Array(2*t.count);for(let a=0,o=0,p=t.count;a<p;a++,o+=2)$.fromBufferAttribute(t,a),J.fromBufferAttribute(s,a),n[o]=o===0?0:n[o-1],n[o+1]=n[o]+$.distanceTo(J);const i=new N(n,2,1);return e.setAttribute("instanceDistanceStart",new M(i,1,0)),e.setAttribute("instanceDistanceEnd",new M(i,1,1)),this}raycast(e,t){const s=this.material.worldUnits,n=e.camera;n===null&&!s&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');const i=e.params.Line2!==void 0&&e.params.Line2.threshold||0;_=e.ray;const a=this.matrixWorld,o=this.geometry,p=this.material;U=p.linewidth+i,o.boundingSphere===null&&o.computeBoundingSphere(),D.copy(o.boundingSphere).applyMatrix4(a);let h;if(s)h=U*.5;else{const c=Math.max(n.near,D.distanceToPoint(_.origin));h=X(n,c,p.resolution)}if(D.radius+=h,_.intersectsSphere(D)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),O.copy(o.boundingBox).applyMatrix4(a);let m;if(s)m=U*.5;else{const c=Math.max(n.near,O.distanceToPoint(_.origin));m=X(n,c,p.resolution)}O.expandByScalar(m),_.intersectsBox(O)!==!1&&(s?he(this,t):ve(this,n,t))}onBeforeRender(e){const t=this.material.uniforms;t&&t.resolution&&(e.getViewport(P),this.material.uniforms.resolution.value.set(P.z,P.w))}}class ge extends ne{constructor(e=new te,t=new W({color:Math.random()*16777215})){super(e,t),this.isLine2=!0,this.type="Line2"}}const ye=y.forwardRef(function({points:e,color:t=16777215,vertexColors:s,linewidth:n,lineWidth:i,segments:a,dashed:o,...p},h){var m,c;const g=ue(L=>L.size),B=y.useMemo(()=>a?new ne:new ge,[a]),[E]=y.useState(()=>new W),A=(s==null||(m=s[0])==null?void 0:m.length)===4?4:3,b=y.useMemo(()=>{const L=a?new H:new te,T=e.map(r=>{const v=Array.isArray(r);return r instanceof S||r instanceof z?[r.x,r.y,r.z]:r instanceof Y?[r.x,r.y,0]:v&&r.length===3?[r[0],r[1],r[2]]:v&&r.length===2?[r[0],r[1],0]:r});if(L.setPositions(T.flat()),s){t=16777215;const r=s.map(v=>v instanceof pe?v.toArray():v);L.setColors(r.flat(),A)}return L},[e,a,s,A]);return y.useLayoutEffect(()=>{B.computeLineDistances()},[e,B]),y.useLayoutEffect(()=>{o?E.defines.USE_DASH="":delete E.defines.USE_DASH,E.needsUpdate=!0},[o,E]),y.useEffect(()=>()=>{b.dispose(),E.dispose()},[b]),y.createElement("primitive",F({object:B,ref:h},p),y.createElement("primitive",{object:b,attach:"geometry"}),y.createElement("primitive",F({object:E,attach:"material",color:t,vertexColors:!!s,resolution:[g.width,g.height],linewidth:(c=n??i)!==null&&c!==void 0?c:1,dashed:o,transparent:A===4},p)))}),Se=({points:l,degree:e=3,weights:t,knots:s,curveResolution:n=50,color:i="black",segments:a,dashed:o=!1,vertexColors:p,...h})=>{const m=y.useMemo(()=>{if(!s)return console.error("NurbsCurve requires knots to be provided"),[];try{const c=Array(l.length).fill(1),g=me.geom.NurbsCurve.byKnotsControlPointsWeights(e,s,l,t??c);return Array.from({length:n+1},(B,E)=>{const A=E/n,b=g.point(A);return new S(b[0],b[1],b[2])})}catch(c){return console.error("Error creating NURBS curve:",c),[]}},[l,e,t,s,n]);return m.length===0?null:ie.jsx(ye,{points:m,color:i,segments:a,dashed:o,vertexColors:p,...h})};Se.__docgenInfo={description:"",methods:[],displayName:"NurbsCurve",props:{points:{required:!0,tsType:{name:"Array",elements:[{name:"Array",elements:[{name:"number"}],raw:"number[]"}],raw:"number[][]"},description:""},degree:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"3",computed:!1}},weights:{required:!1,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:""},knots:{required:!0,tsType:{name:"Array",elements:[{name:"number"}],raw:"number[]"},description:""},curveResolution:{required:!1,tsType:{name:"number"},description:"",defaultValue:{value:"50",computed:!1}},color:{defaultValue:{value:'"black"',computed:!1},required:!1},dashed:{defaultValue:{value:"false",computed:!1},required:!1}},composes:["Omit"]};export{Se as N};
