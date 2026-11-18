(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.LunchPicker=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
  // 두 좌표 사이 직선거리(m)
  function meters(a,b){
    var R=6371000,r=Math.PI/180,dLat=(b.lat-a.lat)*r,dLon=(b.lon-a.lon)*r;
    var x=Math.sin(dLat/2)*Math.sin(dLat/2)+Math.cos(a.lat*r)*Math.cos(b.lat*r)*Math.sin(dLon/2)*Math.sin(dLon/2);
    return 2*R*Math.asin(Math.min(1,Math.sqrt(x)));
  }
  // 출발지 → 음식점 → (카페) → 출발지 왕복 직선거리(m). 좌표가 없으면 저장된 직선거리로 근사
  function routeLength(origin,meal,cafe){
    var hasCoord=function(s){return s&&Number.isFinite(s.lat)&&Number.isFinite(s.lon);};
    if(origin&&hasCoord(origin)&&hasCoord(meal)&&(!cafe||hasCoord(cafe))){
      return cafe?meters(origin,meal)+meters(meal,cafe)+meters(cafe,origin):2*meters(origin,meal);
    }
    return cafe?meal.dist+Math.abs(meal.dist-cafe.dist)+cafe.dist:2*meal.dist;
  }
  function getCandidates(stores,options){
    options=options||{};
    var budget=options.budget||12000,minTotal=options.minTotal||11000,minMeal=options.minMeal||8000,payment=options.payment||'all',origin=options.origin||null,meals=[],drinks=[],seen=Object.create(null),result=[];
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
    function add(meal,cafe){
      var total=meal.price+(cafe?cafe.price:0);if(total<minTotal||total>budget)return;
      var id=JSON.stringify([meal.key,meal.menu,meal.price,cafe&&cafe.key,cafe&&cafe.menu,cafe&&cafe.price]);if(seen[id])return;seen[id]=true;
      result.push({store:meal.store,key:meal.key,menu:meal.menu,price:meal.price,cafe:cafe?{store:cafe.store,menu:cafe.menu,price:cafe.price}:null,total:total,route:Math.round(routeLength(origin,meal.store,cafe&&cafe.store)),popular:isPopularMenu(meal.store,meal.menu)});
    }
    meals.forEach(function(meal){
      if(meal.price>10000){add(meal,null);return;}
      var lo=0,hi=drinks.length;while(lo<hi){var mid=(lo+hi)>>>1;if(drinks[mid].price<minTotal-meal.price)lo=mid+1;else hi=mid;}
      for(var i=lo;i<drinks.length&&drinks[i].price<=budget-meal.price;i++)add(meal,drinks[i]);
    });
    return result;
  }
  // 리뷰 인기도 (store.pop = 카카오 평점·후기 수·추천 메뉴, index.html 에서 붙임)
  var PRIOR_RATING=4.0,PRIOR_WEIGHT=10,POPULAR_MENU_BONUS=0.3;
  function isPopularMenu(store,menu){var p=store&&store.pop;return !!(p&&p.menus&&p.menus.indexOf(menu)>=0);}
  // 후기가 적은 매장의 평점이 과하게 반영되지 않도록 평균 4.0점 쪽으로 당긴 평점 (베이지안 평균)
  function storeRating(store){
    var p=store&&store.pop;if(!p||!Number.isFinite(p.rating))return PRIOR_RATING;
    var v=Number.isFinite(p.reviews)?p.reviews:0;return (v*p.rating+PRIOR_WEIGHT*PRIOR_RATING)/(v+PRIOR_WEIGHT);
  }
  // 음식점 안에서 고르는 순서: 인기 메뉴 → 12,000원에 가까운 합계 → 짧은 왕복 동선
  function better(a,b){
    if(a.popular!==b.popular)return a.popular?-1:1;
    if(a.total!==b.total)return b.total-a.total;
    return a.route-b.route;
  }
  // 음식점 사이 순서: 인기 점수(보정 평점 + 인기 메뉴 가산) → 합계 → 동선. 같은 점수면 무작위
  function plan(stores,options,random){
    options=options||{};random=random||Math.random;
    var candidates=getCandidates(stores,options),previous=options.previous||[],index=Object.create(null),groups=[],choices=[];
    candidates.forEach(function(c){
      var g=index[c.key];if(!g){g={key:c.key,top:c,items:[]};index[c.key]=g;groups.push(g);}
      var d=better(c,g.top);if(d<0){g.top=c;g.items=[];}
      if(better(c,g.top)===0)g.items.push(c);
    });
    groups.forEach(function(g){g.rating=storeRating(g.top.store);g.score=g.rating+(g.top.popular?POPULAR_MENU_BONUS:0);g.tie=random();});
    groups.sort(function(a,b){return (b.score-a.score)||(b.top.total-a.top.total)||(a.top.route-b.top.route)||(a.tie-b.tie);});
    var fresh=groups.filter(function(g){return previous.indexOf(g.key)<0}),seen=groups.filter(function(g){return previous.indexOf(g.key)>=0});
    fresh.concat(seen).slice(0,3).forEach(function(g){var c=g.items[Math.floor(random()*g.items.length)];c.rating=g.rating;c.score=g.score;choices.push(c);});
    return {choices:choices,candidateCount:candidates.length,restaurantCount:groups.length};
  }
  function recommend(stores,options,random){return plan(stores,options,random).choices;}

  // ── 요기요 점메추 ─────────────────────────────────────────────
  // store.ymenu = 요기요 메뉴·최소주문·배달팁 구간, store.delivery = 배달/포장 가능 정보 (index.html 에서 붙임)
  // 한 사람당 식사 1개(같은 메뉴 여러 개 가능)를 골라, 함께결제 인원 × 1인 예산 안에 들어오는 주문을 찾는다
  var Y_MEAL_MIN=7000,Y_MEAL_MAX=16000,Y_TOP=12;
  var Y_NOT_MEAL=/2인|3인|2~3인|한상|＋|\+|조각|1봉|사시미|요거트|스무디|에이드|아메리카노|아이스티|민트티|라떼|주스|셔벗|스프|감자튀김|호밀빵|타르트|탕수육|깐풍기|유린기|깐쇼|튀김|계란말이|순대$/;
  function yogiyoMeals(m){
    return (m.items||[]).filter(function(i){return i[1]>=Y_MEAL_MIN&&i[1]<=Y_MEAL_MAX&&!Y_NOT_MEAL.test(i[0]);})
      .map(function(i){return {name:i[0],price:i[1],rep:!!i[2],reviews:i[3]||0};})
      .sort(function(a,b){return (b.rep-a.rep)||(b.reviews-a.reviews)||(a.price-b.price);}).slice(0,Y_TOP);
  }
  function deliveryFee(tiers,food){for(var i=0;i<tiers.length;i++){if(food>=tiers[i][0])return tiers[i][1];}return null;}
  function yogiyoRating(m){var v=m.reviews||0,C=4.7,w=30;return Number.isFinite(m.rating)&&m.rating>0?(v*m.rating+w*C)/(v+w):C;}
  // 메뉴 n개 조합(중복 허용)을 모두 훑는다
  function multisets(list,n,cb){var pick=[];(function go(start,left){if(!left){cb(pick.slice());return;}for(var i=start;i<list.length;i++){pick.push(list[i]);go(i,left-1);pick.pop();}})(0,n);}
  function yogiyoOrder(store,options){
    var m=store.ymenu,n=options.people||1,mode=options.mode||'delivery',budget=n*(options.perPerson||12000),floor=n*(options.minPerPerson||11000),best=null;
    var meals=yogiyoMeals(m);
    multisets(meals,n,function(pick){
      var food=0,rep=0,reviews=0,names=Object.create(null);
      pick.forEach(function(p){food+=p.price;rep+=p.rep?1:0;reviews+=p.reviews;names[p.name]=(names[p.name]||0)+1;});
      var fee=0;
      if(mode==='delivery'){if(food<m.min)return;fee=deliveryFee(m.tiers,food);if(fee==null)return;}
      var total=food+fee;if(total>budget||total<floor)return;
      var distinct=Object.keys(names).length;
      var c={rep:rep,total:total,distinct:distinct,reviews:reviews};
      if(!best||(c.rep-best.rep||c.total-best.total||c.distinct-best.distinct||c.reviews-best.reviews)>0){
        best={rep:rep,total:total,distinct:distinct,reviews:reviews,food:food,fee:fee,
          items:Object.keys(names).map(function(k){var p=pick.filter(function(x){return x.name===k;})[0];return {name:k,price:p.price,qty:names[k],rep:p.rep};})};
      }
    });
    return best;
  }
  function planYogiyo(stores,options,random){
    options=options||{};random=random||Math.random;
    var n=options.people||1,mode=options.mode||'delivery',payment=options.payment||'all',previous=options.previous||[],groups=[],eligible=0;
    stores.forEach(function(s){
      if(!s.ymenu||!s.delivery)return;
      if(mode==='pickup'&&!s.delivery.pickup)return;
      if(payment==='zeropay'&&!(s.payments||{}).zeropay)return;
      if(payment==='ticket'&&!(s.payments||{}).ticket)return;
      eligible++;
      var o=yogiyoOrder(s,options);if(!o)return;
      var rating=yogiyoRating(s.ymenu),score=rating+0.3*(o.rep/n);
      groups.push({key:s.name+'|'+s.addr,store:s,order:o,rating:rating,score:score,tie:random()});
    });
    groups.sort(function(a,b){return (b.score-a.score)||(b.order.total-a.order.total)||(a.tie-b.tie);});
    var fresh=groups.filter(function(g){return previous.indexOf(g.key)<0}),seen=groups.filter(function(g){return previous.indexOf(g.key)>=0});
    var choices=fresh.concat(seen).slice(0,3).map(function(g){var o=g.order;return {key:g.key,store:g.store,items:o.items,food:o.food,fee:o.fee,total:o.total,perPerson:Math.ceil(o.total/n),people:n,mode:mode,rep:o.rep,rating:g.rating};});
    return {choices:choices,storeCount:groups.length,eligibleCount:eligible};
  }
  return {recommend:recommend,getCandidates:getCandidates,plan:plan,routeLength:routeLength,storeRating:storeRating,planYogiyo:planYogiyo,deliveryFee:deliveryFee};
});
