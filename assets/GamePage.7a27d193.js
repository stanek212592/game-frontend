import{g as de}from"./QBtn.9e3b89e7.js";import{T as tt,b as he,S as at,P as nt,E as it,M as B,c as ge,B as ot,G as st,e as G,R as Dt,d as _t,f as vt,V as D,h as U,i as Q,j as $e,k as qe,l as k,m as Nt,g as i,n as T,u as H,a as g,Q as rt,o as xt,W as Lt,p as kt}from"./QImg.48660372.js";import{_ as lt,O as _,U as Me,V as ue,f as $,R as ye,X as q,Q as F,ah as ct,Z as pe,F as dt,d as jt,k as J,u as zt,a1 as Gt,Y as ee,$ as Ft,a0 as Yt}from"./index.c3c15e3d.js";import{q as Pe,Q as Xe,o as Vt,p as Wt}from"./imagesEnum.fb9bed4e.js";const E=he.card;var A={config:E,createCard:Ut,createTexturedMaterial:Ht,createColoredMaterial:Bt,createFromUrlMaterial:Kt,createCardFromMaterials:$t};const fe=new tt;function Ut(t,n=G.DROW_PILE,s=null,e=null){if(t=Math.floor(Number(t)),isNaN(t)||t<1)return null;const o=E.width*E.size,r=E.height*E.size,l=E.radius*E.size,c=E.radius,u=E.depth*E.size,m=new at;m.moveTo(0,l),m.lineTo(0,r-l),m.quadraticCurveTo(0,r,l,r),m.lineTo(o-l,r),m.quadraticCurveTo(o,r,o,r-l),m.lineTo(o,l),m.quadraticCurveTo(o,0,o-l,0),m.lineTo(l,0),m.quadraticCurveTo(0,0,0,l);const h=new nt;h.moveTo(c,c),h.lineTo(o-c,c),h.lineTo(o-c,r-c),h.lineTo(c,r-c),h.lineTo(c,c),m.holes.push(h);const f={steps:1,depth:u*t,bevelEnabled:!1},w=new it(m,f),P=new B({color:"#000000"}),S=new ge(w,P),I=new ot(o-2*c,r-2*c,u*t),j=[P,P,P,P,P,new B({map:fe.load(Pe.CARD_BACK.path)})],v=s?[P,P,P,P,new B({map:fe.load(s.path)}),new B({map:fe.load(Pe.CARD_BACK.path)})]:null,z=new ge(I,s?v:j),b=new st;return S.position.x-=o/2,S.position.y-=r/2,S.position.z-=u*t/2,S.name=G.CARD_FRAME,b.add(S),b.add(z),b.rotateX(Math.PI/2),b.name=n,b.params={...e},b.select=(M=!0)=>{M?S.material=new B({color:"#ea7c01"}):S.material=P},s&&(b.hidePicture=(M=!0)=>{z.material=M?j:v}),b}function Ht(t){const n=new tt().load("data:image/jpeg;base64,"+t);return new B({map:n})}function Bt(t){return new B({color:t})}function Kt(t=Pe.CARD_BACK.path){return new B({map:fe.load(t)})}function $t(t,n,s,e,o,r=null){if(!n||!s||!(o!=null&&o.primary)||!(o!=null&&o.secondary)||(t=Math.floor(Number(t)),isNaN(t)||t<1))return null;const l=E.width*E.size,c=E.height*E.size,u=E.radius*E.size,m=E.radius,h=E.depth*E.size,f=new at;f.moveTo(0,u),f.lineTo(0,c-u),f.quadraticCurveTo(0,c,u,c),f.lineTo(l-u,c),f.quadraticCurveTo(l,c,l,c-u),f.lineTo(l,u),f.quadraticCurveTo(l,0,l-u,0),f.lineTo(u,0),f.quadraticCurveTo(0,0,0,u);const w=new nt;w.moveTo(m,m),w.lineTo(l-m,m),w.lineTo(l-m,c-m),w.lineTo(m,c-m),w.lineTo(m,m),f.holes.push(w);const P={steps:1,depth:h*t,bevelEnabled:!1},S=new it(f,P),I=new ge(S,o.primary),j=new ot(l-2*m,c-2*m,h*t),v=[o.primary,o.primary,o.primary,o.primary,o.primary,e],z=[o.primary,o.primary,o.primary,o.primary,s,e],b=new ge(j,v),M=new st;return I.position.x-=l/2,I.position.y-=c/2,I.position.z-=h*t/2,I.name=G.CARD_FRAME,M.add(I),M.add(b),M.rotateX(Math.PI/2),M.name=n,M.params={...r},M.select=(N=!0)=>{N?I.material=new B({color:"#ea7c01"}):I.material=o.primary},M.hidePicture=(N=!0)=>{b.material=N?v:z},M}const Ze={type:"change"},Ie={type:"start"},Qe={type:"end"},me=new Dt,Je=new _t,qt=Math.cos(70*Nt.DEG2RAD);class Xt extends vt{constructor(n,s){super(),this.object=n,this.domElement=s,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new D,this.cursor=new D,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:U.ROTATE,MIDDLE:U.DOLLY,RIGHT:U.PAN},this.touches={ONE:Q.ROTATE,TWO:Q.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return c.phi},this.getAzimuthalAngle=function(){return c.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(a){a.addEventListener("keydown",Se),this._domElementKeyEvents=a},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",Se),this._domElementKeyEvents=null},this.saveState=function(){e.target0.copy(e.target),e.position0.copy(e.object.position),e.zoom0=e.object.zoom},this.reset=function(){e.target.copy(e.target0),e.object.position.copy(e.position0),e.object.zoom=e.zoom0,e.object.updateProjectionMatrix(),e.dispatchEvent(Ze),e.update(),r=o.NONE},this.update=function(){const a=new D,d=new $e().setFromUnitVectors(n.up,new D(0,1,0)),p=d.clone().invert(),y=new D,O=new $e,K=new D,x=2*Math.PI;return function(At=null){const Be=e.object.position;a.copy(Be).sub(e.target),a.applyQuaternion(d),c.setFromVector3(a),e.autoRotate&&r===o.NONE&&ae(ut(At)),e.enableDamping?(c.theta+=u.theta*e.dampingFactor,c.phi+=u.phi*e.dampingFactor):(c.theta+=u.theta,c.phi+=u.phi);let Y=e.minAzimuthAngle,V=e.maxAzimuthAngle;isFinite(Y)&&isFinite(V)&&(Y<-Math.PI?Y+=x:Y>Math.PI&&(Y-=x),V<-Math.PI?V+=x:V>Math.PI&&(V-=x),Y<=V?c.theta=Math.max(Y,Math.min(V,c.theta)):c.theta=c.theta>(Y+V)/2?Math.max(Y,c.theta):Math.min(V,c.theta)),c.phi=Math.max(e.minPolarAngle,Math.min(e.maxPolarAngle,c.phi)),c.makeSafe(),e.enableDamping===!0?e.target.addScaledVector(h,e.dampingFactor):e.target.add(h),e.target.sub(e.cursor),e.target.clampLength(e.minTargetRadius,e.maxTargetRadius),e.target.add(e.cursor);let ie=!1;if(e.zoomToCursor&&se||e.object.isOrthographicCamera)c.radius=Ee(c.radius);else{const W=c.radius;c.radius=Ee(c.radius*m),ie=W!=c.radius}if(a.setFromSpherical(c),a.applyQuaternion(p),Be.copy(e.target).add(a),e.object.lookAt(e.target),e.enableDamping===!0?(u.theta*=1-e.dampingFactor,u.phi*=1-e.dampingFactor,h.multiplyScalar(1-e.dampingFactor)):(u.set(0,0,0),h.set(0,0,0)),e.zoomToCursor&&se){let W=null;if(e.object.isPerspectiveCamera){const oe=a.length();W=Ee(oe*m);const ce=oe-W;e.object.position.addScaledVector(M,ce),e.object.updateMatrixWorld(),ie=!!ce}else if(e.object.isOrthographicCamera){const oe=new D(N.x,N.y,0);oe.unproject(e.object);const ce=e.object.zoom;e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/m)),e.object.updateProjectionMatrix(),ie=ce!==e.object.zoom;const Ke=new D(N.x,N.y,0);Ke.unproject(e.object),e.object.position.sub(Ke).add(oe),e.object.updateMatrixWorld(),W=a.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),e.zoomToCursor=!1;W!==null&&(this.screenSpacePanning?e.target.set(0,0,-1).transformDirection(e.object.matrix).multiplyScalar(W).add(e.object.position):(me.origin.copy(e.object.position),me.direction.set(0,0,-1).transformDirection(e.object.matrix),Math.abs(e.object.up.dot(me.direction))<qt?n.lookAt(e.target):(Je.setFromNormalAndCoplanarPoint(e.object.up,e.target),me.intersectPlane(Je,e.target))))}else if(e.object.isOrthographicCamera){const W=e.object.zoom;e.object.zoom=Math.max(e.minZoom,Math.min(e.maxZoom,e.object.zoom/m)),W!==e.object.zoom&&(e.object.updateProjectionMatrix(),ie=!0)}return m=1,se=!1,ie||y.distanceToSquared(e.object.position)>l||8*(1-O.dot(e.object.quaternion))>l||K.distanceToSquared(e.target)>l?(e.dispatchEvent(Ze),y.copy(e.object.position),O.copy(e.object.quaternion),K.copy(e.target),!0):!1}}(),this.dispose=function(){e.domElement.removeEventListener("contextmenu",Ue),e.domElement.removeEventListener("pointerdown",Ge),e.domElement.removeEventListener("pointercancel",ne),e.domElement.removeEventListener("wheel",Fe),e.domElement.removeEventListener("pointermove",Te),e.domElement.removeEventListener("pointerup",ne),e.domElement.getRootNode().removeEventListener("keydown",Ye,{capture:!0}),e._domElementKeyEvents!==null&&(e._domElementKeyEvents.removeEventListener("keydown",Se),e._domElementKeyEvents=null)};const e=this,o={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6};let r=o.NONE;const l=1e-6,c=new qe,u=new qe;let m=1;const h=new D,f=new k,w=new k,P=new k,S=new k,I=new k,j=new k,v=new k,z=new k,b=new k,M=new D,N=new k;let se=!1;const R=[],te={};let Ce=!1;function ut(a){return a!==null?2*Math.PI/60*e.autoRotateSpeed*a:2*Math.PI/60/60*e.autoRotateSpeed}function re(a){const d=Math.abs(a*.01);return Math.pow(.95,e.zoomSpeed*d)}function ae(a){u.theta-=a}function le(a){u.phi-=a}const Oe=function(){const a=new D;return function(p,y){a.setFromMatrixColumn(y,0),a.multiplyScalar(-p),h.add(a)}}(),Ae=function(){const a=new D;return function(p,y){e.screenSpacePanning===!0?a.setFromMatrixColumn(y,1):(a.setFromMatrixColumn(y,0),a.crossVectors(e.object.up,a)),a.multiplyScalar(p),h.add(a)}}(),X=function(){const a=new D;return function(p,y){const O=e.domElement;if(e.object.isPerspectiveCamera){const K=e.object.position;a.copy(K).sub(e.target);let x=a.length();x*=Math.tan(e.object.fov/2*Math.PI/180),Oe(2*p*x/O.clientHeight,e.object.matrix),Ae(2*y*x/O.clientHeight,e.object.matrix)}else e.object.isOrthographicCamera?(Oe(p*(e.object.right-e.object.left)/e.object.zoom/O.clientWidth,e.object.matrix),Ae(y*(e.object.top-e.object.bottom)/e.object.zoom/O.clientHeight,e.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),e.enablePan=!1)}}();function we(a){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?m/=a:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function De(a){e.object.isPerspectiveCamera||e.object.isOrthographicCamera?m*=a:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),e.enableZoom=!1)}function be(a,d){if(!e.zoomToCursor)return;se=!0;const p=e.domElement.getBoundingClientRect(),y=a-p.left,O=d-p.top,K=p.width,x=p.height;N.x=y/K*2-1,N.y=-(O/x)*2+1,M.set(N.x,N.y,1).unproject(e.object).sub(e.object.position).normalize()}function Ee(a){return Math.max(e.minDistance,Math.min(e.maxDistance,a))}function _e(a){f.set(a.clientX,a.clientY)}function mt(a){be(a.clientX,a.clientX),v.set(a.clientX,a.clientY)}function ve(a){S.set(a.clientX,a.clientY)}function ht(a){w.set(a.clientX,a.clientY),P.subVectors(w,f).multiplyScalar(e.rotateSpeed);const d=e.domElement;ae(2*Math.PI*P.x/d.clientHeight),le(2*Math.PI*P.y/d.clientHeight),f.copy(w),e.update()}function pt(a){z.set(a.clientX,a.clientY),b.subVectors(z,v),b.y>0?we(re(b.y)):b.y<0&&De(re(b.y)),v.copy(z),e.update()}function ft(a){I.set(a.clientX,a.clientY),j.subVectors(I,S).multiplyScalar(e.panSpeed),X(j.x,j.y),S.copy(I),e.update()}function gt(a){be(a.clientX,a.clientY),a.deltaY<0?De(re(a.deltaY)):a.deltaY>0&&we(re(a.deltaY)),e.update()}function yt(a){let d=!1;switch(a.code){case e.keys.UP:a.ctrlKey||a.metaKey||a.shiftKey?le(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):X(0,e.keyPanSpeed),d=!0;break;case e.keys.BOTTOM:a.ctrlKey||a.metaKey||a.shiftKey?le(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):X(0,-e.keyPanSpeed),d=!0;break;case e.keys.LEFT:a.ctrlKey||a.metaKey||a.shiftKey?ae(2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):X(e.keyPanSpeed,0),d=!0;break;case e.keys.RIGHT:a.ctrlKey||a.metaKey||a.shiftKey?ae(-2*Math.PI*e.rotateSpeed/e.domElement.clientHeight):X(-e.keyPanSpeed,0),d=!0;break}d&&(a.preventDefault(),e.update())}function Ne(a){if(R.length===1)f.set(a.pageX,a.pageY);else{const d=Z(a),p=.5*(a.pageX+d.x),y=.5*(a.pageY+d.y);f.set(p,y)}}function xe(a){if(R.length===1)S.set(a.pageX,a.pageY);else{const d=Z(a),p=.5*(a.pageX+d.x),y=.5*(a.pageY+d.y);S.set(p,y)}}function Le(a){const d=Z(a),p=a.pageX-d.x,y=a.pageY-d.y,O=Math.sqrt(p*p+y*y);v.set(0,O)}function Pt(a){e.enableZoom&&Le(a),e.enablePan&&xe(a)}function Ct(a){e.enableZoom&&Le(a),e.enableRotate&&Ne(a)}function ke(a){if(R.length==1)w.set(a.pageX,a.pageY);else{const p=Z(a),y=.5*(a.pageX+p.x),O=.5*(a.pageY+p.y);w.set(y,O)}P.subVectors(w,f).multiplyScalar(e.rotateSpeed);const d=e.domElement;ae(2*Math.PI*P.x/d.clientHeight),le(2*Math.PI*P.y/d.clientHeight),f.copy(w)}function je(a){if(R.length===1)I.set(a.pageX,a.pageY);else{const d=Z(a),p=.5*(a.pageX+d.x),y=.5*(a.pageY+d.y);I.set(p,y)}j.subVectors(I,S).multiplyScalar(e.panSpeed),X(j.x,j.y),S.copy(I)}function ze(a){const d=Z(a),p=a.pageX-d.x,y=a.pageY-d.y,O=Math.sqrt(p*p+y*y);z.set(0,O),b.set(0,Math.pow(z.y/v.y,e.zoomSpeed)),we(b.y),v.copy(z);const K=(a.pageX+d.x)*.5,x=(a.pageY+d.y)*.5;be(K,x)}function wt(a){e.enableZoom&&ze(a),e.enablePan&&je(a)}function bt(a){e.enableZoom&&ze(a),e.enableRotate&&ke(a)}function Ge(a){e.enabled!==!1&&(R.length===0&&(e.domElement.setPointerCapture(a.pointerId),e.domElement.addEventListener("pointermove",Te),e.domElement.addEventListener("pointerup",ne)),!Ot(a)&&(Rt(a),a.pointerType==="touch"?We(a):Et(a)))}function Te(a){e.enabled!==!1&&(a.pointerType==="touch"?It(a):Tt(a))}function ne(a){switch(Mt(a),R.length){case 0:e.domElement.releasePointerCapture(a.pointerId),e.domElement.removeEventListener("pointermove",Te),e.domElement.removeEventListener("pointerup",ne),e.dispatchEvent(Qe),r=o.NONE;break;case 1:const d=R[0],p=te[d];We({pointerId:d,pageX:p.x,pageY:p.y});break}}function Et(a){let d;switch(a.button){case 0:d=e.mouseButtons.LEFT;break;case 1:d=e.mouseButtons.MIDDLE;break;case 2:d=e.mouseButtons.RIGHT;break;default:d=-1}switch(d){case U.DOLLY:if(e.enableZoom===!1)return;mt(a),r=o.DOLLY;break;case U.ROTATE:if(a.ctrlKey||a.metaKey||a.shiftKey){if(e.enablePan===!1)return;ve(a),r=o.PAN}else{if(e.enableRotate===!1)return;_e(a),r=o.ROTATE}break;case U.PAN:if(a.ctrlKey||a.metaKey||a.shiftKey){if(e.enableRotate===!1)return;_e(a),r=o.ROTATE}else{if(e.enablePan===!1)return;ve(a),r=o.PAN}break;default:r=o.NONE}r!==o.NONE&&e.dispatchEvent(Ie)}function Tt(a){switch(r){case o.ROTATE:if(e.enableRotate===!1)return;ht(a);break;case o.DOLLY:if(e.enableZoom===!1)return;pt(a);break;case o.PAN:if(e.enablePan===!1)return;ft(a);break}}function Fe(a){e.enabled===!1||e.enableZoom===!1||r!==o.NONE||(a.preventDefault(),e.dispatchEvent(Ie),gt(St(a)),e.dispatchEvent(Qe))}function St(a){const d=a.deltaMode,p={clientX:a.clientX,clientY:a.clientY,deltaY:a.deltaY};switch(d){case 1:p.deltaY*=16;break;case 2:p.deltaY*=100;break}return a.ctrlKey&&!Ce&&(p.deltaY*=10),p}function Ye(a){a.key==="Control"&&(Ce=!0,e.domElement.getRootNode().addEventListener("keyup",Ve,{passive:!0,capture:!0}))}function Ve(a){a.key==="Control"&&(Ce=!1,e.domElement.getRootNode().removeEventListener("keyup",Ve,{passive:!0,capture:!0}))}function Se(a){e.enabled===!1||e.enablePan===!1||yt(a)}function We(a){switch(He(a),R.length){case 1:switch(e.touches.ONE){case Q.ROTATE:if(e.enableRotate===!1)return;Ne(a),r=o.TOUCH_ROTATE;break;case Q.PAN:if(e.enablePan===!1)return;xe(a),r=o.TOUCH_PAN;break;default:r=o.NONE}break;case 2:switch(e.touches.TWO){case Q.DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;Pt(a),r=o.TOUCH_DOLLY_PAN;break;case Q.DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;Ct(a),r=o.TOUCH_DOLLY_ROTATE;break;default:r=o.NONE}break;default:r=o.NONE}r!==o.NONE&&e.dispatchEvent(Ie)}function It(a){switch(He(a),r){case o.TOUCH_ROTATE:if(e.enableRotate===!1)return;ke(a),e.update();break;case o.TOUCH_PAN:if(e.enablePan===!1)return;je(a),e.update();break;case o.TOUCH_DOLLY_PAN:if(e.enableZoom===!1&&e.enablePan===!1)return;wt(a),e.update();break;case o.TOUCH_DOLLY_ROTATE:if(e.enableZoom===!1&&e.enableRotate===!1)return;bt(a),e.update();break;default:r=o.NONE}}function Ue(a){e.enabled!==!1&&a.preventDefault()}function Rt(a){R.push(a.pointerId)}function Mt(a){delete te[a.pointerId];for(let d=0;d<R.length;d++)if(R[d]==a.pointerId){R.splice(d,1);return}}function Ot(a){for(let d=0;d<R.length;d++)if(R[d]==a.pointerId)return!0;return!1}function He(a){let d=te[a.pointerId];d===void 0&&(d=new k,te[a.pointerId]=d),d.set(a.pageX,a.pageY)}function Z(a){const d=a.pointerId===R[0]?R[1]:R[0];return te[d]}e.domElement.addEventListener("contextmenu",Ue),e.domElement.addEventListener("pointerdown",Ge),e.domElement.addEventListener("pointercancel",ne),e.domElement.addEventListener("wheel",Fe,{passive:!1}),e.domElement.getRootNode().addEventListener("keydown",Ye,{passive:!0,capture:!0}),this.update()}}var Zt={add:Qt};function Qt(t,n){const s=new Xt(t,n.domElement);return s.enableDamping=!0,s.dampingFactor=.05,s.screenSpacePanning=!0,s.enablePan=!1,s.mouseButtons={LEFT:U.ROTATE,MIDDLE:U.DOLLY,RIGHT:U.ROTATE},s.enableZoom=!0,s.minDistance=300,s.maxDistance=3e3,s.minPolarAngle=-1,s.maxPolarAngle=Math.PI/2.01,s}var C={moveCardVertically:Jt,moveCard:ea,rotateCardTo:ta,rotateCardBy:aa,moveCardTo:na};async function Jt(t,n=i().animate.stepSize,s=T.tableConfig.height+150){const e=Math.sign(s-t.position.y);n||(n=i().animate.stepSize),n*=i().speed;let o=null;return new Promise(r=>{const l=()=>{if(Math.abs(t.position.y-s)<=n){t.position.y=s,r(!0);return}if(t.position.y+=e*n,i().state===g.NO_GAME){o&&cancelAnimationFrame(o),r(!1);return}o=requestAnimationFrame(l)};l()})}async function ea(t,n=100,s=Math.PI,e=i().animate.stepSize){e*=i().speed;let o=0;const r=H.vector(s,e);let l=null;return new Promise(c=>{const u=()=>{if(n-o<=e){c(!0);return}if(t.position.x+=r.x,t.position.z+=r.z,o+=e,i().state===g.NO_GAME){l&&cancelAnimationFrame(l),c(!1);return}l=requestAnimationFrame(u)};u()})}async function ta(t,n=null,s=null,e=null){const o=i().animate.angleSize*i().speed,r=Math.sign(1/n),l=Math.sign(1/e),c=Math.sign(1/s);let u=null;return new Promise(m=>{const h=()=>{if(n!=null&&Math.abs(n-t.rotation.x)<=o?t.rotation.x+=o*r:n!=null&&(t.rotation.x=n,n=null),s!=null&&Math.abs(s-t.rotation.y)<=o?t.rotation.y+=o*c:s!=null&&(t.rotation.y=s,s=null),e!=null&&Math.abs(e-t.rotation.z)<=o?t.rotation.z+=o*l:e!=null&&(t.rotation.z=e,e=null),n===null&&s===null&&e===null){m(!0);return}if(i().state===g.NO_GAME){u&&cancelAnimationFrame(u),m(!1);return}u=requestAnimationFrame(h)};h()})}async function aa(t,n=null,s=null,e=null){const o=i().animate.angleSize*i().speed,r=n?Math.abs(Math.ceil(n/o)):null,l=s?Math.abs(Math.ceil(s/o)):null,c=e?Math.abs(Math.ceil(e/o)):null;let u=0,m=null;return new Promise(h=>{const f=()=>{if(r&&r>u&&t.rotateX(n/r),l&&l>u&&t.rotateY(s/l),c&&c>u&&t.rotateZ(e/c),Math.max(r,c,l)===u){h(!0);return}if(u++,i().state===g.NO_GAME){m&&cancelAnimationFrame(m),h(!1);return}m=requestAnimationFrame(f)};f()})}async function na(t,n={x:0,z:0},s=null,e=i().animate.stepSize){n.x=H.round(n.x),n.z=H.round(n.z),e*=i().speed;const o=t.position;let r=0;const l=Math.atan2(n.z-o.z,n.x-o.x),c=H.vector(l,e),u=H.distance(o.x,n.x,o.z,n.z);let m=null;return new Promise(h=>{const f=()=>{if(u-r<=e){t.position.x=H.round(n.x),t.position.z=H.round(n.z),h(!0);return}if(t.position.x+=c.x,t.position.z+=c.z,s!==null&&Math.abs(t.rotation.z-s)<=i().animate.angleSize?(t.rotation.z=s,s=null):s!==null&&(t.rotation.z+=i().animate.angleSize),r+=e,i().state===g.NO_GAME){m&&cancelAnimationFrame(m),h(!1);return}m=requestAnimationFrame(f)};f()})}var L=Object.freeze({DRAW_TO_DISCARD:"DRAW_TO_DISCARD",DRAW_TO_PLAYER:"DRAW_TO_PLAYER",PLAYER_TO_DISCARD:"PLAYER_TO_DISCARD",NOT_PLAY:"NOT_PLAY",GAME_OVER:"GAME_OVER"});const ia={name:"SuitSelectDialog",props:{modelValue:{type:Boolean,default:!1},items:{type:Array,default:()=>[]}},data:()=>({}),computed:{modelValueComp:{get(){return this.modelValue},set(t){this.$emit("update:model-value",t)}},itemSelected(){return!!this.items.filter(t=>t.selected).length}},methods:{handleClick(t){if(!t.selected){this.items.forEach(n=>n.selected=!1),t.selected=!0;return}this.$emit("select",t.name),this.$emit("update:model-value",!1)}}},oa={class:"text-h6"};function sa(t,n,s,e,o,r){return _(),Me(Wt,{modelValue:r.modelValueComp,"onUpdate:modelValue":n[0]||(n[0]=l=>r.modelValueComp=l),persistent:""},{default:ue(()=>[$(Vt,null,{default:ue(()=>[$(Xe,null,{default:ue(()=>[ye("div",oa,"Vyberte barvu "+q(r.itemSelected?"(vyberte znovu pro potvrzen\xED)":""),1)]),_:1}),$(Xe,{class:"fp-row"},{default:ue(()=>[(_(!0),F(dt,null,ct(s.items,(l,c)=>(_(),Me(rt,{key:c,src:l.image,style:pe(`width: 200px; border: solid 3px ${l.selected?"red":"white"};`),onClick:u=>r.handleClick(l)},null,8,["src","style","onClick"]))),128))]),_:1})]),_:1})]),_:1},8,["modelValue"])}var ra=lt(ia,[["render",sa]]);const et=new xt,Re=new k,la=jt({name:"GamePage",components:{SuitSelectDialog:ra},data:()=>({suits:[],itemsSelectSuits:[],showSelectSuit:!1,computerStopBtn:!1,gameContainerWidth:0,gameContainerHeight:0,camera:null,renderer:null,scene:null,drawPileObject:null,materials:{cardFrame:{primary:null,secondary:null},cardBack:null,table:null,sky:null,grass:null},cameraView:{PLAYER:"player",TABLE:"table"},playerSelectObject:null,timeouts:[],axiosCancelTokenStoreName:"game"}),computed:{loading(){return i().state===g.LOADING},showMenu(){return J().showMenu},showStausBar(){return!1},players(){return i().players.length},activePlayer(){return i().players.find(t=>t.id===i().activePlayerId)},gameWarning(){return i().warning},gameInfo(){return i().info},hasMoreMoves(){var t;return i().activePlayerId?!(i().lastPlayerMove===L.PLAYER_TO_DISCARD||i().lastPlayerMove===L.NOT_PLAY||i().lastPlayerMove===L.DRAW_TO_PLAYER&&((t=i().rules)==null?void 0:t.numberOfCardsToDraw)===0):!0},lastMove(){return i().lastPlayerMove},showStopBtn(){var l,c,u,m;const t=i().discardPileCardsIds,n=t[t.length-1],s=(u=(c=(l=i())==null?void 0:l.gameCards)==null?void 0:c.find(h=>h.params.cardId===n))==null?void 0:u.params,e=(s==null?void 0:s.power)==="GET"&&(s==null?void 0:s.powerValue)===0,o=((m=i().rules)==null?void 0:m.numberOfCardsToDraw)>0;return g.PLAYER_TURN===i().state&&e&&!o},showSuits(){var e,o,r,l;if(!((e=i().gameCards)!=null&&e.length))return[];if(!((o=i().discardPileCardsIds)!=null&&o.length))return[];const t=i().discardPileCardsIds,n=t[t.length-1];return((r=i().gameCards.find(c=>c.params.cardId===n).params)==null?void 0:r.power)!=="SELECT_SUIT"?[]:(l=i().rules)!=null&&l.suit?this.suits.filter(c=>c.name===i().rules.suit):this.suits},mainPlayer(){const t=i().players.find(n=>n.id===zt().id);return t||{}},isGameActive(){return i().state!==g.NO_GAME}},methods:{async startGame(){const t=i().settings;this.resetGame(),i().setGameState(g.LOADING),this.materials.cardFrame.primary=A.createColoredMaterial("#000000"),this.materials.cardFrame.secondary=A.createColoredMaterial("#fb8d3c"),this.materials.cardBack=A.createFromUrlMaterial(Pe.CARD_BACK.path),i().gameCards=await this.getDrawCardPileFromServer(t.cardGroupId);const n=await this.getNewGameFromServer(t);if(!n){this.resetGame();return}i().setPiles(n),i().setPlayers(n.players),i().setGameState(g.DEAL_CARDS),this.createDrawPile(),await this.dealCards(n.movesList),i().setFromState(n),i().setActivePlayerById(n.nextPLayerId)},async dealCards(t){const n=t.map((s,e)=>new Promise(o=>{const r=setTimeout(async()=>{await this.executeMove(s),o()},e*500);this.timeouts.push(r)}));await Promise.all(n)},async executeMove(t,n){var s,e;switch(t.type){case L.DRAW_TO_DISCARD:n=await this.getDrawPileCard(null,!0),await this.moveToDiscardPile(n)||i().setGameState(g.ERROR);return;case L.DRAW_TO_PLAYER:const r=i().rules;if(!r){await this.getDrawPileCard(this.getPlayer(t.to));return}if(r.numberOfCardsToDraw===0){i().setWarning("Nepovolen\xFD tah");return}else if(r.numberOfCardsToDraw--,r.permittedCardIdsOnDiscardPile=[],r.numberOfCardsToDraw===0&&i().setGameState(this.activePlayer===this.mainPlayer?g.PLAYER_TURN_PROCESSING:g.COMPUTER_TURN_PROCESSING,!1),await this.getDrawPileCard(this.getPlayer(t.to)),await this.shuffleIfNeeded(),r.numberOfCardsToDraw>0)return;break;case L.PLAYER_TO_DISCARD:const l=this.getPlayer(t.from);if(this.mainPlayer!==l)i().setGameState(g.COMPUTER_TURN_PROCESSING,!1),n=i().gameCards.find(c=>c.params.cardId===t.cardId),t.newSuit&&(i().rules.suit=t.newSuit),await this.moveToDiscardPile(n,l);else if((((s=i().rules)==null?void 0:s.permittedCardIdsOnDiscardPile)||[]).includes(n.params.cardId))i().setGameState(g.PLAYER_TURN_PROCESSING),await this.moveToDiscardPile(n,l);else{i().setWarning("Nepovolen\xFD tah");return}break;case L.NOT_PLAY:this.activePlayer===this.mainPlayer?i().setGameState(g.PLAYER_TURN_PROCESSING):(this.computerStopBtn=!0,await this.sleep(2e3),this.computerStopBtn=!1,i().setGameState(g.COMPUTER_TURN_PROCESSING,!1));break}i().lastPlayerMove=t.type,i().state===g.COMPUTER_TURN_PROCESSING&&this.getNextPlayerActions(),i().state===g.PLAYER_TURN_PROCESSING&&(t.type===L.PLAYER_TO_DISCARD&&((e=n==null?void 0:n.params)==null?void 0:e.power)==="SELECT_SUIT"?this.openSelectSuitDialog():this.getNextPlayerActions())},async shuffleIfNeeded(){if(i().drawPileCardsIds.length===0){const t=[],n=i().discardPileCardsIds,s=n[n.length-1],e=n.slice(0,-1);for(const r of e){const l=i().gameCards.find(c=>c.params.cardId===r);await C.moveCard(l,he.card.height*1.1),await C.moveCardVertically(l,void 0,T.tableConfig.height+75+t.length),await C.rotateCardTo(l,Math.PI/2,0,0),l.hidePicture(!0),await C.moveCardVertically(l,void 0,T.tableConfig.height+150+t.length),t.push(l)}if(t.length>2)for(let r=0;r<50;r++){const l=Math.floor(Math.random()*t.length),c=t[l];await C.moveCard(c,100,void 0,15),await C.moveCardVertically(c,15,T.tableConfig.height+150+t.length+r),await C.moveCard(c,100,2*Math.PI,15);for(let u=0;u<t.length;u++){const m=t[u];await C.moveCardVertically(m,15,T.tableConfig.height+150+t.length+u)}}for(let r=0;r<t.length;r++){const l=t[r];await C.moveCardTo(l,he.animate.drawPilePosition,void 0,15),await C.moveCardVertically(l,15,T.tableConfig.height+r*.5),i().drawPileCardsIds.push(l.params.cardId),this.scene.remove(l),this.scene.remove(this.drawPileObject),this.createDrawPile()}i().drawPileCardsIds=this.shuffleArray(e),i().discardPileCardsIds=[s];const o=i().gameCards.find(r=>r.params.cardId===s);await C.moveCardVertically(o,15,T.tableConfig.height+he.card.depth)}},shuffleArray(t){for(let n=t.length-1;n>0;n--){const s=Math.floor(Math.random()*(n+1));[t[n],t[s]]=[t[s],t[n]]}return t},createDrawPile(){const t=i().drawPileCardsIds.length,n=A.createCardFromMaterials(t,G.DROW_PILE,this.materials.cardFrame,this.materials.cardBack,this.materials.cardFrame,{selectable:!0});n&&(n.position.y=T.tableConfig.height+(t+1)*A.config.depth,n.position.x=i().animate.drawPilePosition.x,n.position.z=i().animate.drawPilePosition.z,this.scene.add(n)),this.drawPileObject=n},handleMouseClickOnCard(t){var e;const n=i().players[0];if(n.id!==i().activePlayerId||!((e=t==null?void 0:t.params)!=null&&e.selectable))return;if(!this.playerSelectObject||this.playerSelectObject&&this.playerSelectObject!==t){this.clearPlayerSelect(),t.select(),this.playerSelectObject=t;return}this.clearPlayerSelect();const s=t.params.cardId;n.cardInHandIds.includes(s)&&this.executeMove({type:L.PLAYER_TO_DISCARD,from:n.id},t)},handleMouseClickOnDrawPile(t){if(i().players[0].id===i().activePlayerId){if(!this.playerSelectObject||this.playerSelectObject!==t){this.clearPlayerSelect(),t.select(),this.playerSelectObject=t;return}this.clearPlayerSelect(),this.executeMove({type:L.DRAW_TO_PLAYER,to:this.mainPlayer.id})}},getPlayer(t){return i().players.find(n=>n.id===t)},clearPlayerSelect(){const t=this.playerSelectObject;!t||(t.select&&t.select(!1),this.playerSelectObject=null)},async addCardToHand(t,n,s=i().animate.cardAngleView){const e=Math.abs(Math.ceil(s/(i().animate.angleSize*i().speed)));let o=0,r=null;return new Promise(l=>{const c=async()=>{if(o<e)t.rotateX(s/e),o++;else{n.cardInHandIds.push(t.params.cardId);const u=i().animate.maxCardsPerRow;let m=(n.cardInHandIds.length-1)%u+1,h=Math.floor((n.cardInHandIds.length-1)/u);switch(h){case 0:h=1;break;case 1:h=0;break;case 2:break;default:h=-h+2}if(h*=i().animate.cardOverlap,h-=1,m-1){const f=n.point,w=m%2===0?n.angle-Math.PI/2:n.angle+Math.PI/2,P=H.vector(w,(A.config.width*2+10)*Math.floor(m/2));if(P.x+=f.x,P.z+=f.z,!await C.moveCardTo(t,P)){l(!1);return}}if(!await C.moveCardVertically(t,null,T.tableConfig.height-h*A.config.height)){l(!1);return}if(!await C.moveCard(t,A.config.height*Math.abs(h),Math.sign(h)*n.angle)){l(!1);return}l(!0);return}if(i().state===g.NO_GAME){r&&cancelAnimationFrame(r),l(!1);return}r=requestAnimationFrame(c)};c()})},async moveToDiscardPile(t,n){if(!t)return!1;t.params.selectable=!1,t.hidePicture(!1);const s=t.params.cardId,e=T.tableConfig.height+i().discardPileCardsIds.length*A.config.depth*4,o=i().animate.discardPilePosition,r={...t.position};i().discardPileCardsIds.push(s);let l=null,c=!0;if(n){const m=n.cardInHandIds,h=m.findIndex(w=>w===s),f=m.length-1;h!==f&&(l=i().gameCards.find(w=>w.params.cardId===m[f]),m.splice(h,1,l.params.cardId),c=!1),m.pop()}const u=async()=>{await C.moveCardVertically(l,void 0,r.y),await C.moveCardTo(l,{x:r.x,z:r.z})};return new Promise(async m=>{let h=await C.moveCardVertically(t);c||u(),h&&(h=await C.rotateCardBy(t,Math.PI/2+i().animate.cardAngleView)),h&&(h=await C.moveCardTo(t,o));const f=H.round(Math.random()*2*Math.PI);if(h&&(h=await C.rotateCardTo(t,-Math.PI/2,0,f)),h&&(h=await C.moveCardVertically(t,void 0,e)),!h){i().setGameState(g.ERROR),m(!1);return}t.params.selectable=!0,m(!0)})},async getDrawPileCard(t,n){const s=i().drawPileCardsIds.length;if(!s)return i().setGameState(g.ERROR),!1;const e=i().drawPileCardsIds[0],o=i().gameCards.find(c=>c.params.cardId===e);i().drawPileCardsIds=i().drawPileCardsIds.slice(1),o.params.selectable=!1,o.hidePicture(!1);const r=this.drawPileObject,l={x:r.position.x,z:r.position.z};if(o.position.y=T.tableConfig.height+s*2*A.config.depth,o.position.x=l.x,o.position.z=l.z,this.scene.add(o),this.scene.remove(r),this.createDrawPile(l.x,l.z),!await C.moveCardVertically(o))return!1;if(n)return o.params.selectable=!0,o;if(!await C.moveCardTo(o,t.point,-Math.PI/2+t.angle))return!1;await this.addCardToHand(o,t),o.params.selectable=!0},showNextPlayerNameBeforeServerResponse(){let t=i().players.findIndex(e=>e.id===i().activePlayerId)+1;const n=i().players.length,s=i().players[t%n];return this.mainPlayer!==s&&i().setInfo("Hraje "+s.name),s.id},addListeners(){window.addEventListener("resize",this.handleChangeWindowSize.bind(this)),this.$refs.gameContainer.addEventListener("click",this.onMouseClick),this.$refs.gameContainer.addEventListener("dblclick",this.onMouseDoubleClick)},removeListeners(){window.removeEventListener("resize",this.handleChangeWindowSize),this.$refs.gameContainer.removeEventListener("click",this.onMouseClick),this.$refs.gameContainer.removeEventListener("dblclick",this.onMouseDoubleClick)},resetScene(){const t=[G.CARD,G.DROW_PILE,G.DISCARD_PILE,G.TABLE],n=this.scene;n.children.filter(o=>t.includes(o.name)).forEach(o=>{n.remove(o)});const e=T.createTable(this.materials.table);e&&this.scene.add(e)},resetGame(){this.resetScene(),i().reset(),this.timeouts.forEach(clearTimeout);const t=J().axiosRequests[this.axiosCancelTokenStoreName];t!=null&&t.length&&t.forEach(n=>{n.cancel&&n.cancel()}),this.timeouts=[]},initWebGL(){this.materials.table=T.createTableMaterial();const t=this.$refs.gameContainer,n=t.clientWidth,s=t.clientHeight,e=new Lt({antialias:!0});e.setSize(n,s),t.appendChild(e.domElement);const o=new kt(75,n/s,1,1e4);o.lookAt(0,T.tableConfig.height+A.config.height*3,0);const r=Zt.add(o,e),l=T.create(),c=T.createTable(this.materials.table);c&&l.add(c);const u=()=>{requestAnimationFrame(u),r.update(),e.render(l,o)};this.scene=l,this.renderer=e,this.camera=o,this.gameContainerWidth=n,this.gameContainerHeight=s,this.changeCameraView(this.cameraView.PLAYER),u()},changeCameraView(t){t||(t=i().cameraView);const n=this.camera,s=this.cameraView,e=this.mainPlayer.point||{x:0,z:T.tableConfig.radius};switch(t){case null:case s.PLAYER:n.position.set(0,T.tableConfig.height*2+A.config.height*2,e.z*1.4+A.config.height*2);break;case s.TABLE:n.position.set(0,e.z*1.3,0);break}i().cameraView=t},handleChangePlayers(){this.resetScene()},handleChangeWindowSize(){const t=this.$refs.gameContainer,n=t.clientWidth,s=t.clientHeight;this.fitGameContainerToSize(n,s)},handleSuitSelect(t){i().rules.suit=t,this.getNextPlayerActions()},handleNotPlay(){this.executeMove({type:L.NOT_PLAY})},openSelectSuitDialog(){this.$get("prsi/suits",{groupId:i().settings.cardGroupId}).then(t=>{this.itemsSelectSuits=[],t.forEach(n=>{n.image.startsWith("data:image")||(n.image="data:"+n.imageType+";base64,"+n.image)}),this.itemsSelectSuits=t,this.showSelectSuit=!0})},onMouseClick(t){var o,r;if(t.stopPropagation(),i().state===g.LOADING||i().state===g.DEAL_CARDS||i().state===g.WAITING_FOR_SERVER||i().state===g.PLAYER_TURN_PROCESSING){i().setWarning("Po\u010Dkejte na dokon\u010Den\xED akce");return}if(i().state===g.COMPUTER_TURN||i().state===g.COMPUTER_TURN_PROCESSING){i().setWarning("Po\u010Dkejte na tah protihr\xE1\u010De");return}const s=this.$refs.gameContainer.getBoundingClientRect();Re.x=(t.clientX-s.left)/s.width*2-1,Re.y=-((t.clientY-s.top)/s.height)*2+1,et.setFromCamera(Re,this.camera);const e=et.intersectObjects(this.scene.children);switch((r=(o=e[0].object)==null?void 0:o.parent)==null?void 0:r.name){case G.CARD:this.handleMouseClickOnCard(e[0].object.parent);return;case G.DROW_PILE:this.handleMouseClickOnDrawPile(e[0].object.parent);return}this.playerSelectObject&&this.clearPlayerSelect()},handleSwitchMenu(){window.innerWidth<J().minimumViewPort||(J().showMenu?setTimeout(()=>{this.fitGameContainerToSize(this.gameContainerWidth-J().menuWidth)},200):this.fitGameContainerToSize(this.gameContainerWidth+J().menuWidth))},fitGameContainerToSize(t,n){n==null&&(n=this.gameContainerHeight),t==null&&(t=this.gameContainerWidth),this.camera.aspect=t/n,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,n),this.gameContainerWidth=t,this.gameContainerHeight=n},clearAll(){this.resetScene(),this.scene=null,this.renderer=null,this.camera=null,this.gameContainerWidth=null,this.gameContainerHeight=null},gameOver(t){console.log("ukon\u010Dit hru"),console.log(t),i().activePlayerId=null,i().setGameState(g.GAME_OVER)},async getDrawCardPileFromServer(t){this.$get("prsi/suits",{groupId:i().settings.cardGroupId},!1,this.axiosCancelTokenStoreName).then(e=>{e&&(e.forEach(o=>{o.image.startsWith("data:image")||(o.image="data:"+o.imageType+";base64,"+o.image)}),this.suits=e)});const n=[],s=await this.$get("prsi/all_cards",{groupId:t},!1,this.axiosCancelTokenStoreName);if(s!==null)return s.forEach(e=>{n.push(A.createCardFromMaterials(1,G.CARD,A.createTexturedMaterial(e.face),this.materials.cardBack,this.materials.cardFrame,{cardId:e.id,selectable:!0,face:e.face,power:e.power,powerValue:e.powerValue})),delete e.face}),n},async getNewGameFromServer(t){return await this.$post("prsi/start",t,!1,this.axiosCancelTokenStoreName)},async getNextPlayerActions(){if(i().state===g.NO_GAME)return;const t={stateId:i().stateId,players:i().players.map(e=>({id:e.id,cardIds:e.cardInHandIds})),drawPile:i().drawPileCardsIds,discardPile:i().discardPileCardsIds,rules:i().rules,lastMove:i().lastPlayerMove,lastMoveBy:i().activePlayerId},n=this.showNextPlayerNameBeforeServerResponse();i().setGameState(g.WAITING_FOR_SERVER);const s=await this.$post("prsi/next",t,!1,this.axiosCancelTokenStoreName);i().activePlayerId=n,i().setGameState(this.mainPlayer===this.activePlayer?g.PLAYER_TURN:g.COMPUTER_TURN,this.mainPlayer===this.activePlayer),i().setFromState(s);for(const e of s.movesList){if(e.type===L.GAME_OVER){this.gameOver(e);return}await this.executeMove(e),await this.sleep(500)}},async sleep(t){return new Promise(n=>setTimeout(n,t))}},mounted(){this.initWebGL(),this.addListeners()},beforeUnmount(){this.removeListeners(),this.clearAll()},watch:{showMenu(){this.handleSwitchMenu()},players(){this.handleChangePlayers()},isGameActive(){i().state===g.START_GAME&&this.startGame(),i().state===g.NO_GAME&&this.resetGame()}}}),ca=t=>(Ft("data-v-7fb9c813"),t=t(),Yt(),t),da={class:"height-100 width-100 fp-column game-page",ref:"gamePage"},ua={key:0,class:"overlay"},ma=ca(()=>ye("span",{class:"overlay-text"},"Na\u010D\xEDt\xE1n\xED hry",-1)),ha=[ma],pa={id:"gameContainer",ref:"gameContainer",class:"game-container"},fa={key:1,class:"game-statusbar non-selectable"},ga={class:"fp-column",style:{position:"absolute",right:"3px"}},ya={key:2,class:"non-selectable width-100 page-info"},Pa={key:3,class:"non-selectable width-100 page-warning"};function Ca(t,n,s,e,o,r){var c;const l=Gt("suit-select-dialog");return _(),F("div",da,[t.loading?(_(),F("div",ua,ha)):ee("",!0),ye("div",pa,null,512),t.showStausBar?(_(),F("div",fa," hr\xE1\u010D\u016F: "+q(t.players)+", hr\xE1\u010D: "+q((c=t.activePlayer)==null?void 0:c.name)+", existuje tah: "+q(t.hasMoreMoves)+", posledn\xED tah: "+q(t.lastMove)+", ",1)):ee("",!0),ye("div",ga,[$(de,{style:{margin:"3px","z-index":"10"},icon:"panorama",color:"accent",title:"Zobrazit pohled hr\xE1\u010De",onClick:n[0]||(n[0]=u=>t.changeCameraView(t.cameraView.PLAYER))}),$(de,{style:{margin:"3px","z-index":"10"},icon:"visibility",color:"accent",title:"N\xE1hled na hern\xED st\u016Fl",onClick:n[1]||(n[1]=u=>t.changeCameraView(t.cameraView.TABLE))})]),!t.gameWarning&&t.gameInfo?(_(),F("div",ya,q(t.gameInfo),1)):ee("",!0),t.gameWarning?(_(),F("div",Pa,q(t.gameWarning),1)):ee("",!0),t.computerStopBtn?(_(),F("div",{key:4,style:pe(`position: absolute; left: ${t.gameContainerWidth/2-50}px; top: ${t.gameContainerHeight/3-50}px`)},[$(de,{icon:"front_hand",color:"red",title:"St\xE1t",style:{width:"100px",height:"100px"},class:"page-warning",onClick:n[2]||(n[2]=u=>t.handleNotPlay())})],4)):ee("",!0),t.showStopBtn?(_(),F("div",{key:5,style:pe(`position: absolute; left: ${t.gameContainerWidth/2-50}px; bottom: 100px`)},[$(de,{icon:"front_hand",color:"accent",title:"St\xE1t",style:{margin:"3px"},class:"page-warning",onClick:n[3]||(n[3]=u=>t.handleNotPlay())})],4)):t.showSuits.length?(_(),F("div",{key:6,style:pe(`position: absolute; left: ${t.gameContainerWidth/2-t.showSuits.length*27}px; bottom: 30px`)},[(_(!0),F(dt,null,ct(t.showSuits,(u,m)=>(_(),Me(rt,{key:m,src:u.image,style:{width:"50px",margin:"4px"}},null,8,["src"]))),128))],4)):ee("",!0),$(l,{modelValue:t.showSelectSuit,"onUpdate:modelValue":n[4]||(n[4]=u=>t.showSelectSuit=u),items:t.itemsSelectSuits,onSelect:t.handleSuitSelect},null,8,["modelValue","items","onSelect"])],512)}var Ra=lt(la,[["render",Ca],["__scopeId","data-v-7fb9c813"]]);export{Ra as default};
