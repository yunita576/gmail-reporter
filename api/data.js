import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN });
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,OPTIONS');
  if(req.method==='OPTIONS')return res.status(200).end();
  try{await db.execute('CREATE TABLE IF NOT EXISTS laporan(id INTEGER PRIMARY KEY AUTOINCREMENT,nama TEXT,email TEXT UNIQUE,password TEXT,status TEXT DEFAULT \'pending\',waktu TEXT)')}catch(e){}
  var filter=req.query.filter||'all';
  var sql='SELECT id,nama,email,status,waktu FROM laporan';
  if(filter!=='all')sql+=' WHERE status=?';
  sql+=' ORDER BY id DESC LIMIT 200';
  var args=filter!=='all'?[filter]:[];
  try{
    var data=await db.execute({sql:sql,args:args});
    var stats=await db.execute('SELECT COUNT(*) as total,(SELECT COUNT(*) FROM laporan WHERE status=\'pending\') as pending,(SELECT COUNT(*) FROM laporan WHERE status=\'valid\') as valid,(SELECT COUNT(*) FROM laporan WHERE status=\'tolak\') as tolak FROM laporan');
    return res.status(200).json({data:data.rows,stats:stats.rows[0]});
  }catch(e){return res.status(500).json({error:'Gagal memuat data'})}
}
