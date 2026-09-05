import { authenticate, supabase } from './_supabase.js';

function cleanSlug(value){
  return String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,48);
}

export default async function handler(req,res){
  try{
    if(req.method==='GET'){
      const rows=await supabase('/rest/v1/styles?select=*&is_active=eq.true&order=created_at.desc');
      return res.status(200).json({styles:Array.isArray(rows)?rows:[]});
    }
    const admin=await authenticate(req);
    if(!admin?.isAdmin) return res.status(403).json({error:'Admin access denied.'});
    if(req.method==='POST'){
      const body=req.body||{};
      const name=String(body.name||'').trim();
      if(!name) return res.status(400).json({error:'Style name is required.'});
      const type=['PERMANENT','SEASONAL','MONTHLY','THEMATIC'].includes(body.type)?body.type:'THEMATIC';
      const slug=cleanSlug(body.id||name);
      if(!slug) return res.status(400).json({error:'A valid style name is required.'});
      const rows=await supabase('/rest/v1/styles?select=id&or=(id.eq.'+encodeURIComponent(slug)+',name.ilike.'+encodeURIComponent(name)+')');
      if(rows?.length) return res.status(409).json({error:'A style with this name already exists.'});
      const created=await supabase('/rest/v1/styles',{method:'POST',headers:{Prefer:'return=representation'},body:JSON.stringify({name,description:String(body.description||''),type,image_url:body.image_url||null,animation_url:body.animation_url||null,is_active:false,is_system:false,start_date:body.start_date||null,end_date:body.end_date||null})});
      return res.status(201).json({style:created?.[0]||created});
    }
    const id=String(req.query?.id||'').trim();
    if(!id) return res.status(400).json({error:'Style id is required.'});
    if(req.method==='PATCH'){
      const body=req.body||{};
      const patch={};
      for(const key of ['name','description','type','image_url','animation_url','start_date','end_date','is_active']) if(body[key]!==undefined) patch[key]=body[key];
      patch.updated_at=new Date().toISOString();
      const updated=await supabase('/rest/v1/styles?id=eq.'+encodeURIComponent(id),{method:'PATCH',headers:{Prefer:'return=representation'},body:JSON.stringify(patch)});
      return res.status(200).json({style:updated?.[0]||updated});
    }
    if(req.method==='DELETE'){
      const rows=await supabase('/rest/v1/styles?id=eq.'+encodeURIComponent(id)+'&select=is_system,image_url,animation_url');
      if(rows?.[0]?.is_system) return res.status(400).json({error:'System styles cannot be deleted.'});
      await supabase('/rest/v1/styles?id=eq.'+encodeURIComponent(id),{method:'DELETE'});
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'Method not allowed'});
  }catch(error){
    console.error('styles api error:',error);
    return res.status(500).json({error:error?.message||'Unable to manage styles.'});
  }
}
