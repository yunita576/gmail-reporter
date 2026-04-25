import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN });
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method!=='POST')return res.status(405).json({error:'Only POST'});
  try{await db.execute('CREATE TABLE IF NOT EXISTS laporan(id INTEGER PRIMARY KEY AUTOINCREMENT,nama TEXT,email TEXT UNIQUE,password TEXT,status TEXT DEFAULT \'pending\',waktu TEXT)')}catch(e){}
  const{nama,email,password}=req.body;
  if(!nama||!email)return res.status(400).json({error:'Nama dan email wajib diisi'});
  if(!/\S+@\S+\.\S+/.test(email))return res.status(400).json({error:'Format email tidak valid'});
  try{
    var result=await db.execute({sql:'INSERT INTO laporan(nama,email,password,waktu)VALUES(?,?,?,?)',args:[nama,email,email.includes('@gmail')?'aass1122':'',new Date().toLocaleString('id-ID',{day:'2-digit',month:'2-digit',year:'numeric',hour:'2-digit',minute:'2-digit'})]});
    return res.status(200).json({ok:true,id:result.lastInsertRowid});
  }catch(e){
    if(String(e).includes('UNIQUE'))return res.status(400).json({error:'Email sudah pernah dikirim'});
    return res.status(500).json({error:'Gagal menyimpan'});
  }
}
