import express from 'express';
import pg from 'pg';
import { readFile } from 'node:fs/promises';
const db = new pg.Pool({connectionString:process.env.DATABASE_URL, max:3, connectionTimeoutMillis:10000});
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is required');
await db.query(await readFile(new URL('./001_appointments.sql',import.meta.url),'utf8'));
const app=express();
app.disable('x-powered-by');
app.get('/api/health',(_req,res)=>res.json({status:'ok'}));
app.use('/api/appointments', (req,res,next)=>{
  const origin=req.get('origin');
  if (origin && !['https://memorim.github.io',process.env.RENDER_EXTERNAL_URL].includes(origin) &&
      !(process.env.NODE_ENV !== 'production' && /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin))) return res.sendStatus(403);
  res.vary('Origin');
  if (origin) res.set('Access-Control-Allow-Origin',origin);
  res.set({'Access-Control-Allow-Methods':'POST','Access-Control-Allow-Headers':'Content-Type','Cache-Control':'no-store'});
  if (req.method==='OPTIONS') return res.sendStatus(204);
  next();
});
let writes=0,windowEnd=0;
app.post('/api/appointments/:site',express.json({limit:'4kb'}),async(req,res)=>{
  if (!req.is('application/json')) return res.sendStatus(415);
  const site=req.params.site;
  const {id,contact,preference}=req.body||{};
  if (!['focus','takt'].includes(site) || typeof contact!=='string' || contact.length>254 ||
      !(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact) || (/^[+\d ()-]+$/.test(contact) && /^\d{7,15}$/.test(contact.replace(/\D/g,'')))) ||
      typeof id!=='string' || !/^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/i.test(id) ||
      !['any','morning','afternoon'].includes(preference)) return res.status(400).json({error:'Проверьте контакт для связи.'});
  if (Date.now()>=windowEnd){windowEnd=Date.now()+60000;writes=0}
  if (++writes>40) return res.status(429).json({error:'Повторите через минуту.'});
  const result=await db.query(`INSERT INTO appointment_requests(id,site,contact,preference) VALUES ($1,$2,$3,$4)
    ON CONFLICT (id) DO UPDATE SET id=excluded.id WHERE
    (appointment_requests.site,appointment_requests.contact,appointment_requests.preference) =
    (excluded.site,excluded.contact,excluded.preference) RETURNING id`,[id,site,contact,preference]);
  return result.rowCount ? res.status(201).json({id}) : res.sendStatus(409);
});
app.use((error,_req,res,_next)=>res.status([400,413].includes(error.status)?error.status:503).json({error:'Заявка не сохранена. Повторите отправку.'}));
app.listen(Number(process.env.PORT||4833),process.env.RENDER?'0.0.0.0':'127.0.0.1');
