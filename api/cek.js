import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN });
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  if(req.method==='OPTIONS')return res.status(200).end();
  var email=req.query.email;
  if(!email)return res.status(400).json({error:'Masukkan email'});
  try{
    var result=await db.execute({sql:'SELECT id,email,nama,status,waktu FROM laporan WHERE email=? ORDER BY id DESC LIMIT 50',args:[email]});
    return res.status(200).json({data:result.rows});
  }catch(e){return res.status(500).json({error:'Gagal'})}
}
