define("mvc/history/hdca-model",["exports","mvc/collection/collection-model","mvc/history/history-content-model","utils/localization"],function(t,e,o,i){"use strict";function l(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(t,"__esModule",{value:!0});var n=l(e),s=l(o),c=(l(i),s.default.HistoryContentMixin),a=n.default.DatasetCollection,r=a.extend(c).extend({defaults:_.extend(_.clone(a.prototype.defaults),{history_content_type:"dataset_collection",model_class:"HistoryDatasetCollectionAssociation"}),save:function(t,e){return this.isNew()&&((e=e||{}).url=this.urlRoot+this.get("history_id")+"/contents",(t=t||{}).type="dataset_collection"),a.prototype.save.call(this,t,e)},toString:function(){return"History"+a.prototype.toString.call(this)}});t.default={HistoryDatasetCollection:r}});
//# sourceMappingURL=../../../maps/mvc/history/hdca-model.js.map
