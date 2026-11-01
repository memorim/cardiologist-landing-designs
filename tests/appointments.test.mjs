import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { setTimeout as wait } from 'node:timers/promises';
import { randomUUID } from 'node:crypto';
test('both forms save once and private contacts cannot be listed', async t => {
  const child=spawn(process.execPath,['server.js'],{stdio:'inherit',env:{...process.env,PORT:'4834'}});
  t.after(()=>child.kill());
  const base='http://127.0.0.1:4834/api';
  for(let i=0;i<50;i++){try{if((await fetch(base+'/health')).ok)break}catch{} await wait(100)}
  for(const site of ['focus','takt']){
    const url=base+'/appointments/'+site;
    const data={id:randomUUID(),contact:'fixture@example.test',preference:'morning'};
    const post=(body,headers={})=>fetch(url,{method:'POST',headers:{'Content-Type':'application/json',...headers},body:JSON.stringify(body)});
    const [a,b]=await Promise.all([post(data),post(data)]);
    assert.equal(a.status,201);assert.equal(b.status,201);
    assert.equal((await a.json()).id,data.id);
    assert.equal((await post({...data,preference:'any'})).status,409);
    assert.equal((await post({...data,contact:'abc'})).status,400);
    assert.equal((await post(data,{Origin:'https://outside.example'})).status,403);
    assert.equal((await fetch(url)).status,404);
  }
});
