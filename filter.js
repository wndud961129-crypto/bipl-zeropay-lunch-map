(function(root,factory){
  if(typeof module==='object' && module.exports) module.exports=factory();
  else root.LunchFilter=factory();
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function matches(store,state,ignoreCategory){
    state=state||{};
    if(!ignoreCategory && state.cat && state.cat!=='전체' && store.cat!==state.cat) return false;
    var payment=store.payments||{};
    if(state.payment==='zeropay' && !payment.zeropay) return false;
    if(state.payment==='ticket' && !payment.ticket) return false;
    if(state.onlyMenu && !(store.menu && store.menu.length)) return false;
    if(state.q){
      var q=state.q.replace(/\s/g,'').toLowerCase();
      var hay=(store.name+' '+(store.menu||[]).join(' ')+' '+store.cat).replace(/\s/g,'').toLowerCase();
      if(hay.indexOf(q)<0) return false;
    }
    return true;
  }
  return {matches:matches};
});
