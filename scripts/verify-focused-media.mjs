// Offline lifecycle checks for the supplied-video slot and unchanged policy text.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
import ts from 'typescript';
const source=fs.readFileSync(new URL('../src/app/website-design/_components/ChicagoHeroBackground.tsx',import.meta.url),'utf8');
const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,jsx:ts.JsxEmit.ReactJSX}}).outputText;
function mount({src='/local-fixture.mp4',reduced=false,hydrated=true,paused=false,failed=false}={}) {
 const effects=[],listeners=new Map(),counts={play:0,pause:0},observers=[];
 const video={play(){counts.play++;return Promise.resolve();},pause(){counts.pause++;}};
 const document={hidden:false,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)};
 const loadedModule={exports:{}};
 const jsx=(type,props)=>({type,props});
 let stateIndex=0;
 vm.runInNewContext(code,{module:loadedModule,exports:loadedModule.exports,document,IntersectionObserver:class {constructor(cb){this.cb=cb;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}},require(id){
  if(id==='react')return {useRef:()=>({current:video}),useState:initial=>[[paused,initial,initial,failed][stateIndex++],()=>{}],useEffect:fn=>effects.push(fn),useSyncExternalStore:()=>hydrated};
  if(id==='react/jsx-runtime')return {jsx,jsxs:jsx};
  if(id==='lucide-react')return {Pause:'PauseIcon',Play:'PlayIcon'};
  if(id==='@/lib/use-reduced-motion')return {useReducedMotion:()=>reduced};
  throw Error(id);
 }});
 const tree=loadedModule.exports.default({src}); const cleanups=effects.map(fn=>fn()).filter(Boolean);
 const videos=tree.props.children.filter(node=>node&&node.type==='video');
 return {videos,counts,document,listeners,get observer(){return observers[0];},cleanup:()=>cleanups.forEach(fn=>fn())};
}
let checks=0;
for(const options of [{src:''},{reduced:true},{hydrated:false},{failed:true}]){
 const h=mount(options);assert.equal(h.videos.length,0);assert.equal(h.counts.play,0);checks++;
}
const h=mount();assert.equal(h.videos.length,1);for(const key of ['muted','loop','playsInline','autoPlay'])assert.equal(h.videos[0].props[key],true);checks++;
h.observer.cb([{isIntersecting:false}]);assert.equal(h.counts.pause,1);
h.observer.cb([{isIntersecting:true}]);assert.equal(h.counts.play,2);
h.document.hidden=true;h.listeners.get('visibilitychange')();assert.equal(h.counts.pause,2);checks++;
h.cleanup();assert.equal(h.observer.disconnected,true);assert.equal(h.listeners.size,0);checks++;
assert.equal(mount({paused:true}).counts.play,0);checks++;
for(const [route,name] of [['privacy-policy','PRIVACY_SECTIONS'],['terms-of-use','TERMS_SECTIONS']]) {
 const old=execFileSync('git',['show',`HEAD:src/app/${route}/page.tsx`],{encoding:'utf8'});
 const now=fs.readFileSync(new URL(`../src/app/_components/${route}-content.tsx`,import.meta.url),'utf8');
 function array(text,name){const file=ts.createSourceFile('policy.tsx',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.TSX);let found;file.forEachChild(node=>{if(ts.isVariableStatement(node))for(const decl of node.declarationList.declarations)if(decl.name.getText(file)===name)found=decl.initializer.getText(file);});assert.ok(found);return found.replaceAll('\r\n','\n');}
 assert.equal(array(old,'SECTIONS'),array(now,name));checks++;
}
console.log(`${checks} focused media/policy checks passed. No external requests.`);
