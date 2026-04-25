export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if(req.method==='OPTIONS')return res.status(200).end();
  if(req.method!=='POST')return res.status(405).json({error:'Only POST'});
  var pw=req.body.password;
  if(!pw)return res.status(400).json({error:'Masukkan password'});
  if(pw!==process.env.ADMIN_PW)return res.status(401).json({error:'Password salah'});
  return res.status(200).json({ok:true,token:'admin_'+Date.now()+'_'+Math.random().toString(36)});
}
