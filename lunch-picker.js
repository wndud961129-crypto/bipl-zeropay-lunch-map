(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LunchPicker=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function recommend(stores,options,random){
    options=options||{};random=random||Math.random;
    var budget=options.budget||12000,payment=options.payment||'all',previous=options.previous||[],groups=[],keys={};
    stores.forEach(function(s){
      if(s.cat!=='음식점'||!Number.isFinite(s.dist)||s.dist>600)return;
      if(payment==='zeropay'&&!(s.payments||{}).zeropay)return;
      if(payment==='ticket'&&!(s.payments||{}).ticket)return;
      var menus=(s.menu||[]).map(function(text){
        var m=text.match(/^(.+?)\(([\d,]+)원\)$/);if(!m||/\d+\s*g\b|접시|추가|사리|토핑/i.test(m[1]))return null;
        var price=Number(m[2].replace(/,/g,''));return price>0&&price<=budget?{menu:m[1].trim(),price:price}:null;
      }).filter(Boolean);
      var key=s.name+'|'+s.addr;if(menus.length&&!keys[key]){groups.push({store:s,menus:menus,key:key});keys[key]=true;}
    });
    var fresh=groups.filter(function(g){return previous.indexOf(g.key)<0}),old=groups.filter(function(g){return previous.indexOf(g.key)>=0}),result=[];
    [fresh,old].forEach(function(pool){while(pool.length&&result.length<3){var i=Math.floor(random()*pool.length),g=pool.splice(i,1)[0],m=g.menus[Math.floor(random()*g.menus.length)];result.push({store:g.store,key:g.key,menu:m.menu,price:m.price});}});
    return result;
  }
  return {recommend:recommend};
});
