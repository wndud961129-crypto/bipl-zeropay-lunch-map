(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LunchPicker=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function recommend(stores,options,random){
    options=options||{};random=random||Math.random;
    var budget=options.budget||12000,payment=options.payment||'all',previous=options.previous||[],groups=[],cafes=[],keys={};
    stores.forEach(function(s){
      if((s.cat!=='음식점'&&s.cat!=='카페')||!Number.isFinite(s.dist)||s.dist>600)return;
      if(payment==='zeropay'&&!(s.payments||{}).zeropay)return;
      if(payment==='ticket'&&!(s.payments||{}).ticket)return;
      var menus=(s.menu||[]).map(function(text){
        var m=text.match(/^(.+?)\(([\d,]+)원\)$/);if(!m||/\d+\s*g\b|접시|추가|사리|토핑/i.test(m[1]))return null;
        var price=Number(m[2].replace(/,/g,''));return price>0&&price<=budget?{menu:m[1].trim(),price:price}:null;
      }).filter(Boolean);
      if(s.cat==='카페'){menus=menus.filter(function(m){return /아메리카노|메가리카노|커피|라떼|프라페|스무디|에이드|밀크티|녹차|홍차/.test(m.menu)});if(menus.length)cafes.push({store:s,menus:menus});return;}
      var key=s.name+'|'+s.addr;if(menus.length&&!keys[key]){groups.push({store:s,menus:menus,key:key});keys[key]=true;}
    });
    var fresh=groups.filter(function(g){return previous.indexOf(g.key)<0}),old=groups.filter(function(g){return previous.indexOf(g.key)>=0}),result=[];
    [fresh,old].forEach(function(pool){while(pool.length&&result.length<3){var i=Math.floor(random()*pool.length),g=pool.splice(i,1)[0],m=g.menus[Math.floor(random()*g.menus.length)],cafe=null;
      if(m.price<=10000){var affordable=cafes.map(function(c){return {store:c.store,menus:c.menus.filter(function(d){return d.price+m.price<=budget})}}).filter(function(c){return c.menus.length});
        if(affordable.length){var c=affordable[Math.floor(random()*affordable.length)],drink=c.menus[Math.floor(random()*c.menus.length)];cafe={store:c.store,menu:drink.menu,price:drink.price};}}
      result.push({store:g.store,key:g.key,menu:m.menu,price:m.price,cafe:cafe,total:m.price+(cafe?cafe.price:0)});
    }});
    return result;
  }
  return {recommend:recommend};
});
