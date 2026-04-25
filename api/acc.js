import { createClient } from '@libsql/client';
const db = createClient({ url: process.env.TURSO_URL, authToken: process.env.TURSO_TOKEN });
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method!=='POST')return res.status(405).json({error:'Only POST'});
  var id=req.body.id;
  if(!id)return res.status(400).json({error:'ID diperlukan'});
  try{await db.execute({sql:'UPDATE laporan SET status=\'valid\' WHERE id=? AND status=\'pending\'',args:[id]});return res.status(200).json({ok:true})}
  catch(e){return res.status(500).json({error:'Gagal'})}
}
