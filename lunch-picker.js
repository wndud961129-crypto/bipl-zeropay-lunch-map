(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LunchPicker=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function getCandidates(stores,options){
    options=options||{};
    var budget=options.budget||12000,minTotal=options.minTotal||11000,minMeal=options.minMeal||8000,payment=options.payment||'all',meals=[],drinks=[],seen=Object.create(null),result=[];
    stores.forEach(function(s){
      if((s.cat!=='음식점'&&s.cat!=='카페')||!Number.isFinite(s.dist)||s.dist>600)return;
      if(payment==='zeropay'&&!(s.payments||{}).zeropay)return;
      if(payment==='ticket'&&!(s.payments||{}).ticket)return;
      var menus=(s.menu||[]).map(function(text){
        var m=text.match(/^(.+?)\(([\d,]+)원\)$/);if(!m||/\d+\s*g\b|접시|추가|사리|토핑/i.test(m[1]))return null;
        var price=Number(m[2].replace(/,/g,''));return price>0&&price<=budget?{menu:m[1].trim(),price:price}:null;
      }).filter(Boolean);
      menus.forEach(function(m){var item={store:s,key:s.name+'|'+s.addr,menu:m.menu,price:m.price};if(s.cat==='카페'){if(/아메리카노|메가리카노|커피|라떼|프라페|스무디|에이드|밀크티|녹차|홍차/.test(m.menu))drinks.push(item);}else if(m.price>=minMeal)meals.push(item);});
    });
    drinks.sort(function(a,b){return a.price-b.price});
    function add(meal,cafe){var total=meal.price+(cafe?cafe.price:0);if(total<minTotal||total>budget)return;var id=JSON.stringify([meal.key,meal.menu,meal.price,cafe&&cafe.key,cafe&&cafe.menu,cafe&&cafe.price]);if(seen[id])return;seen[id]=true;result.push({store:meal.store,key:meal.key,menu:meal.menu,price:meal.price,cafe:cafe?{store:cafe.store,menu:cafe.menu,price:cafe.price}:null,total:total});}
    meals.forEach(function(meal){
      if(meal.price>10000){add(meal,null);return;}
      var lo=0,hi=drinks.length;while(lo<hi){var mid=(lo+hi)>>>1;if(drinks[mid].price<minTotal-meal.price)lo=mid+1;else hi=mid;}
      for(var i=lo;i<drinks.length&&drinks[i].price<=budget-meal.price;i++)add(meal,drinks[i]);
    });
    return result;
  }
  function plan(stores,options,random){
    options=options||{};random=random||Math.random;
    var candidates=getCandidates(stores,options),previous=options.previous||[],index=Object.create(null),groups=[],choices=[];
    candidates.forEach(function(c){var g=index[c.key];if(!g){g={key:c.key,best:c.total,items:[]};index[c.key]=g;groups.push(g);}if(c.total>g.best){g.best=c.total;g.items=[];}if(c.total===g.best)g.items.push(c);});
    var count=groups.length;
    while(groups.length&&choices.length<3){var best=Math.max.apply(null,groups.map(function(g){return g.best})),top=groups.filter(function(g){return g.best===best}),fresh=top.filter(function(g){return previous.indexOf(g.key)<0}),pool=fresh.length?fresh:top,g=pool[Math.floor(random()*pool.length)];choices.push(g.items[Math.floor(random()*g.items.length)]);groups.splice(groups.indexOf(g),1);}
    return {choices:choices,candidateCount:candidates.length,restaurantCount:count};
  }
  function recommend(stores,options,random){return plan(stores,options,random).choices;}
  return {recommend:recommend,getCandidates:getCandidates,plan:plan};
});
