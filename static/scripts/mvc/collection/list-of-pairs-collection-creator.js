define("mvc/collection/list-of-pairs-collection-creator",["exports","utils/levenshtein","utils/natural-sort","mvc/collection/base-creator","mvc/base-mvc","utils/localization","ui/hoverhighlight"],function(e,t,i,a,r,n){"use strict";function s(e){return e&&e.__esModule?e:{default:e}}function l(e){function t(){return i.length||(i=[new RegExp(this.filters[0]),new RegExp(this.filters[1])]),i}(e=e||{}).createPair=e.createPair||function(e){var t=(e=e||{}).listA.splice(e.indexA,1)[0],i=e.listB.splice(e.indexB,1)[0],a=e.listB.indexOf(t),r=e.listA.indexOf(i);return-1!==a&&e.listB.splice(a,1),-1!==r&&e.listA.splice(r,1),this._pair(t,i,{silent:!0})};var i=[];return e.preprocessMatch=e.preprocessMatch||function(e){var i=t.call(this);return _.extend(e,{matchTo:e.matchTo.name.replace(i[0],""),possible:e.possible.name.replace(i[1],"")})},function(t){this.debug("autopair _strategy ---------------------------");var i,a=(t=t||{}).listA,r=t.listB,n=0,s={score:0,index:null},l=[];for(this.debug("starting list lens:",a.length,r.length),this.debug("bestMatch (starting):",JSON.stringify(s,null,"  "));n<a.length;){var o=a[n];for(s.score=0,i=0;i<r.length;i++){var d=r[i];if(this.debug(n+":"+o.name),this.debug(i+":"+d.name),a[n]!==r[i]&&(s=e.match.call(this,e.preprocessMatch.call(this,{matchTo:o,possible:d,index:i,bestMatch:s})),this.debug("bestMatch:",JSON.stringify(s,null,"  ")),1===s.score)){this.debug("breaking early due to perfect match");break}}var c=e.scoreThreshold.call(this);if(this.debug("scoreThreshold:",c),this.debug("bestMatch.score:",s.score),s.score>=c?l.push(e.createPair.call(this,{listA:a,indexA:n,listB:r,indexB:s.index})):n+=1,!a.length||!r.length)return l}return this.debug("paired:",JSON.stringify(l,null,"  ")),this.debug("autopair _strategy ---------------------------"),l}}Object.defineProperty(e,"__esModule",{value:!0});var o=s(t),d=s(i),c=s(a),u=s(r),h=s(n),p=Backbone.View.extend(u.default.LoggableMixin).extend({_logNamespace:"collections",tagName:"li",className:"dataset paired",initialize:function(e){this.pair=e.pair||{}},template:_.template(['<span class="forward-dataset-name flex-column"><%- pair.forward.name %></span>','<span class="pair-name-column flex-column">','<span class="pair-name"><%- pair.name %></span>',"</span>",'<span class="reverse-dataset-name flex-column"><%- pair.reverse.name %></span>'].join("")),render:function(){this.dragStartHandler=_.bind(this._dragstart,this),this.dragEndHandler=_.bind(this._dragend,this);var e=this.$el.attr("draggable",!0).data("pair",this.pair).html(this.template({pair:this.pair})).addClass("flex-column-container").get(0);return e.addEventListener("dragstart",this.dragStartHandler,!1),e.addEventListener("dragend",this.dragEndHandler,!1),this},events:{dragover:"_sendToParent",drop:"_sendToParent"},_dragstart:function(e){e.currentTarget.style.opacity="0.4",e.originalEvent&&(e=e.originalEvent),e.dataTransfer.effectAllowed="move",e.dataTransfer.setData("text/plain",JSON.stringify(this.pair)),this.$el.parent().trigger("pair.dragstart",[this])},_dragend:function(e){e.currentTarget.style.opacity="1.0",this.$el.parent().trigger("pair.dragend",[this])},_sendToParent:function(e){this.$el.parent().trigger(e)},toString:function(){return"PairView("+this.pair.name+")"}}),f=Backbone.View.extend(u.default.LoggableMixin).extend(c.default.CollectionCreatorMixin).extend({_logNamespace:"collections",className:"list-of-pairs-collection-creator collection-creator flex-row-container",initialize:function(e){this.metric("PairedCollectionCreator.initialize",e),e=_.defaults(e,{datasets:[],filters:this.DEFAULT_FILTERS,automaticallyPair:!0,strategy:"lcs",matchPercentage:.9,twoPassAutopairing:!0}),this.initialList=e.datasets,this.historyId=e.historyId,this.filters=this.commonFilters[e.filters]||this.commonFilters[this.DEFAULT_FILTERS],_.isArray(e.filters)&&(this.filters=e.filters),this.automaticallyPair=e.automaticallyPair,this.strategy=this.strategies[e.strategy]||this.strategies[this.DEFAULT_STRATEGY],_.isFunction(e.strategy)&&(this.strategy=e.strategy),this.matchPercentage=e.matchPercentage,this.twoPassAutopairing=e.twoPassAutopairing,this.removeExtensions=!0,this.oncancel=e.oncancel,this.oncreate=e.oncreate,this.autoscrollDist=e.autoscrollDist||24,this.unpairedPanelHidden=!1,this.pairedPanelHidden=!1,this.$dragging=null,this.blocking=!1,this._setUpCommonSettings(e),this._setUpBehaviors(),this._dataSetUp()},commonFilters:{illumina:["_1","_2"],Rs:["_R1","_R2"]},DEFAULT_FILTERS:"illumina",strategies:{simple:"autopairSimple",lcs:"autopairLCS",levenshtein:"autopairLevenshtein"},DEFAULT_STRATEGY:"lcs",_dataSetUp:function(){this.paired=[],this.unpaired=[],this.selectedIds=[],this._sortInitialList(),this._ensureIds(),this.unpaired=this.initialList.slice(0),this.automaticallyPair&&(this.autoPair(),this.once("rendered:initial",function(){this.trigger("autopair")}))},_sortInitialList:function(){this._sortDatasetList(this.initialList)},_sortDatasetList:function(e){return e.sort(function(e,t){return(0,d.default)(e.name,t.name)}),e},_ensureIds:function(){return this.initialList.forEach(function(e){e.hasOwnProperty("id")||(e.id=_.uniqueId())}),this.initialList},_splitByFilters:function(){function e(e,t){return t.test(e.name)}var t=this.filters.map(function(e){return new RegExp(e)}),i=[[],[]];return this.unpaired.forEach(function(a){t.forEach(function(t,r){e(a,t)&&i[r].push(a)})}),i},_addToUnpaired:function(e){var t=this;this.unpaired.splice(function i(a,r){if(a===r)return a;var n=Math.floor((r-a)/2)+a,s=(0,d.default)(e.name,t.unpaired[n].name);if(s<0)return i(a,n);if(s>0)return i(n+1,r);for(;t.unpaired[n]&&t.unpaired[n].name===e.name;)n++;return n}(0,this.unpaired.length),0,e)},autoPair:function(e){var t=this._splitByFilters(),i=[];return this.twoPassAutopairing&&(i=this.autopairSimple({listA:t[0],listB:t[1]}),t=this._splitByFilters()),e=e||this.strategy,t=this._splitByFilters(),i=i.concat(this[e].call(this,{listA:t[0],listB:t[1]}))},autopairSimple:l({scoreThreshold:function(){return.6},match:function(e){return(e=e||{}).matchTo===e.possible?{index:e.index,score:1}:e.bestMatch}}),autopairLevenshtein:l({scoreThreshold:function(){return this.matchPercentage},match:function(e){e=e||{};var t=1-(0,o.default)(e.matchTo,e.possible)/Math.max(e.matchTo.length,e.possible.length);return t>e.bestMatch.score?{index:e.index,score:t}:e.bestMatch}}),autopairLCS:l({scoreThreshold:function(){return this.matchPercentage},match:function(e){e=e||{};var t=this._naiveStartingAndEndingLCS(e.matchTo,e.possible).length/Math.max(e.matchTo.length,e.possible.length);return t>e.bestMatch.score?{index:e.index,score:t}:e.bestMatch}}),_naiveStartingAndEndingLCS:function(e,t){for(var i="",a="",r=0,n=0;r<e.length&&r<t.length&&e[r]===t[r];)i+=e[r],r+=1;if(r===e.length)return e;if(r===t.length)return t;for(r=e.length-1,n=t.length-1;r>=0&&n>=0&&e[r]===t[n];)a=[e[r],a].join(""),r-=1,n-=1;return i+a},_pair:function(e,t,i){i=i||{},this.debug("_pair:",e,t);var a=this._createPair(e,t,i.name);return this.paired.push(a),this.unpaired=_.without(this.unpaired,e,t),i.silent||this.trigger("pair:new",a),a},_createPair:function(e,t,i){if(!e||!t||e===t)throw new Error("Bad pairing: "+[JSON.stringify(e),JSON.stringify(t)]);return i=i||this._guessNameForPair(e,t),{forward:e,name:i,reverse:t}},_guessNameForPair:function(e,t,i){i=void 0!==i?i:this.removeExtensions;var a=e.name,r=t.name,n=this._naiveStartingAndEndingLCS(a.replace(new RegExp(this.filters[0]),""),r.replace(new RegExp(this.filters[1]),""));if(i){var s=n.lastIndexOf(".");if(s>0){var l=n.slice(s,n.length);n=n.replace(l,""),a=a.replace(l,""),r=r.replace(l,"")}}return n||a+" & "+r},_unpair:function(e,t){if(t=t||{},!e)throw new Error("Bad pair: "+JSON.stringify(e));return this.paired=_.without(this.paired,e),this._addToUnpaired(e.forward),this._addToUnpaired(e.reverse),t.silent||this.trigger("pair:unpair",[e]),e},unpairAll:function(){for(var e=[];this.paired.length;)e.push(this._unpair(this.paired[0],{silent:!0}));this.trigger("pair:unpair",e)},_pairToJSON:function(e){return{collection_type:"paired",src:"new_collection",name:e.name,element_identifiers:[{name:"forward",id:e.forward.id,src:e.forward.src||"hda"},{name:"reverse",id:e.reverse.id,src:e.reverse.src||"hda"}]}},createList:function(e){var t=this,i=Galaxy.root+"api/histories/"+this.historyId+"/contents/dataset_collections",a={type:"dataset_collection",collection_type:"list:paired",hide_source_items:t.hideOriginals||!1,name:_.escape(e||t.$(".collection-name").val()),element_identifiers:t.paired.map(function(e){return t._pairToJSON(e)})};return t.blocking=!0,jQuery.ajax(i,{type:"POST",contentType:"application/json",dataType:"json",data:JSON.stringify(a)}).always(function(){t.blocking=!1}).fail(function(e,i,a){t._ajaxErrHandler(e,i,a)}).done(function(e,i,a){t.trigger("collection:created",e,i,a),t.metric("collection:created",e),"function"==typeof t.oncreate&&t.oncreate.call(this,e,i,a)})},_ajaxErrHandler:function(e,t,i){this.error(e,t,i);var a=this,r=(0,h.default)("An error occurred while creating this collection");e&&(0===e.readyState&&0===e.status?r+=": "+(0,h.default)("Galaxy could not be reached and may be updating.")+(0,h.default)(" Try again in a few minutes."):e.responseJSON?r+="<br /><pre>"+JSON.stringify(e.responseJSON)+"</pre>":r+=": "+i),a._showAlert(r,"alert-danger")},render:function(e,t){return this.$el.empty().html(this.templates.main()),this._renderHeader(e),this._renderMiddle(e),this._renderFooter(e),this._addPluginComponents(),this.trigger("rendered",this),this},_renderHeader:function(e,t){var i=this.$(".header").empty().html(this.templates.header()).find(".help-content").prepend($(this.templates.helpContent()));return this._renderFilters(),i},_renderFilters:function(){return this.$(".forward-column .column-header input").val(this.filters[0]).add(this.$(".reverse-column .column-header input").val(this.filters[1]))},_renderMiddle:function(e,t){var i=this.$(".middle").empty().html(this.templates.middle());return this.unpairedPanelHidden?this.$(".unpaired-columns").hide():this.pairedPanelHidden&&this.$(".paired-columns").hide(),this._renderUnpaired(),this._renderPaired(),i},_renderUnpaired:function(e,t){var i,a,r=this,n=[],s=this._splitByFilters();this.$(".forward-column .title").text([s[0].length,(0,h.default)("unpaired forward")].join(" ")),this.$(".forward-column .unpaired-info").text(this._renderUnpairedDisplayStr(this.unpaired.length-s[0].length)),this.$(".reverse-column .title").text([s[1].length,(0,h.default)("unpaired reverse")].join(" ")),this.$(".reverse-column .unpaired-info").text(this._renderUnpairedDisplayStr(this.unpaired.length-s[1].length)),this.$(".unpaired-columns .column-datasets").empty(),this.$(".autopair-link").toggle(0!==this.unpaired.length),0!==this.unpaired.length?(a=s[1].map(function(e,t){return void 0!==s[0][t]&&s[0][t]!==e&&n.push(r._renderPairButton()),r._renderUnpairedDataset(e)}),(i=s[0].map(function(e){return r._renderUnpairedDataset(e)})).length||a.length?(this.$(".unpaired-columns .forward-column .column-datasets").append(i).add(this.$(".unpaired-columns .paired-column .column-datasets").append(n)).add(this.$(".unpaired-columns .reverse-column .column-datasets").append(a)),this._adjUnpairedOnScrollbar()):this._renderUnpairedNotShown()):this._renderUnpairedEmpty()},_renderUnpairedDisplayStr:function(e){return["(",e," ",(0,h.default)("filtered out"),")"].join("")},_renderUnpairedDataset:function(e){return $("<li/>").attr("id","dataset-"+e.id).addClass("dataset unpaired").attr("draggable",!0).addClass(e.selected?"selected":"").append($("<span/>").addClass("dataset-name").text(e.name)).data("dataset",e)},_renderPairButton:function(){return $("<li/>").addClass("dataset unpaired").append($("<span/>").addClass("dataset-name").text((0,h.default)("Pair these datasets")))},_renderUnpairedEmpty:function(){var e=$('<div class="empty-message"></div>').text("("+(0,h.default)("no remaining unpaired datasets")+")");return this.$(".unpaired-columns .paired-column .column-datasets").empty().prepend(e),e},_renderUnpairedNotShown:function(){var e=$('<div class="empty-message"></div>').text("("+(0,h.default)("no datasets were found matching the current filters")+")");return this.$(".unpaired-columns .paired-column .column-datasets").empty().prepend(e),e},_adjUnpairedOnScrollbar:function(){var e=this.$(".unpaired-columns").last(),t=this.$(".unpaired-columns .reverse-column .dataset").first();if(t.length){var i=e.offset().left+e.outerWidth(),a=t.offset().left+t.outerWidth(),r=Math.floor(i)-Math.floor(a);this.$(".unpaired-columns .forward-column").css("margin-left",r>0?r:0)}},_renderPaired:function(e,t){if(this.$(".paired-column-title .title").text([this.paired.length,(0,h.default)("paired")].join(" ")),this.$(".unpair-all-link").toggle(0!==this.paired.length),0!==this.paired.length){this.$(".remove-extensions-link").show(),this.$(".paired-columns .column-datasets").empty();var i=this;this.paired.forEach(function(e,t){var a=new p({pair:e});i.$(".paired-columns .column-datasets").append(a.render().$el).append(['<button class="unpair-btn">','<span class="fa fa-unlink" title="',(0,h.default)("Unpair"),'"></span>',"</button>"].join(""))})}else this._renderPairedEmpty()},_renderPairedEmpty:function(){var e=$('<div class="empty-message"></div>').text("("+(0,h.default)("no paired datasets yet")+")");return this.$(".paired-columns .column-datasets").empty().prepend(e),e},footerSettings:{".hide-originals":"hideOriginals",".remove-extensions":"removeExtensions"},_addPluginComponents:function(){this._chooseFiltersPopover(".choose-filters-link"),this.$(".help-content i").hoverhighlight(".collection-creator","rgba( 64, 255, 255, 1.0 )")},_chooseFiltersPopover:function(e){function t(e,t){return['<button class="filter-choice btn" ','data-forward="',e,'" data-reverse="',t,'">',(0,h.default)("Forward"),": ",e,", ",(0,h.default)("Reverse"),": ",t,"</button>"].join("")}var i=$(_.template(['<div class="choose-filters">','<div class="help">',(0,h.default)("Choose from the following filters to change which unpaired reads are shown in the display"),":</div>",_.values(this.commonFilters).map(function(e){return t(e[0],e[1])}).join(""),"</div>"].join(""))({}));return this.$(e).popover({container:".collection-creator",placement:"bottom",html:!0,content:i})},_validationWarning:function(e,t){"name"===e&&(e=this.$(".collection-name").add(this.$(".collection-name-prompt")),this.$(".collection-name").focus().select()),t?(e=e||this.$(".validation-warning")).removeClass("validation-warning"):e.addClass("validation-warning")},_setUpBehaviors:function(){return this.once("rendered",function(){this.trigger("rendered:initial",this)}),this.on("pair:new",function(){this._renderUnpaired(),this._renderPaired(),this.$(".paired-columns").scrollTop(8e6)}),this.on("pair:unpair",function(e){this._renderUnpaired(),this._renderPaired(),this.splitView()}),this.on("filter-change",function(){this.filters=[this.$(".forward-unpaired-filter input").val(),this.$(".reverse-unpaired-filter input").val()],this.metric("filter-change",this.filters),this._renderFilters(),this._renderUnpaired()}),this.on("autopair",function(){this._renderUnpaired(),this._renderPaired();var e,t=null;this.paired.length?(t="alert-success",e=this.paired.length+" "+(0,h.default)("pairs created"),this.unpaired.length||(e+=": "+(0,h.default)("all datasets have been successfully paired"),this.hideUnpaired(),this.$(".collection-name").focus())):e=(0,h.default)(["Could not automatically create any pairs from the given dataset names.","You may want to choose or enter different filters and try auto-pairing again.","Close this message using the X on the right to view more help."].join(" ")),this._showAlert(e,t)}),this},events:{"click .more-help":"_clickMoreHelp","click .less-help":"_clickLessHelp","click .main-help":"_toggleHelp","click .header .alert button":"_hideAlert","click .forward-column .column-title":"_clickShowOnlyUnpaired","click .reverse-column .column-title":"_clickShowOnlyUnpaired","click .unpair-all-link":"_clickUnpairAll","change .forward-unpaired-filter input":function(e){this.trigger("filter-change")},"focus .forward-unpaired-filter input":function(e){$(e.currentTarget).select()},"click .autopair-link":"_clickAutopair","click .choose-filters .filter-choice":"_clickFilterChoice","click .clear-filters-link":"_clearFilters","change .reverse-unpaired-filter input":function(e){this.trigger("filter-change")},"focus .reverse-unpaired-filter input":function(e){$(e.currentTarget).select()},"click .forward-column .dataset.unpaired":"_clickUnpairedDataset","click .reverse-column .dataset.unpaired":"_clickUnpairedDataset","click .paired-column .dataset.unpaired":"_clickPairRow","click .unpaired-columns":"clearSelectedUnpaired","mousedown .unpaired-columns .dataset":"_mousedownUnpaired","click .paired-column-title":"_clickShowOnlyPaired","mousedown .flexible-partition-drag":"_startPartitionDrag","click .paired-columns .dataset.paired":"selectPair","click .paired-columns":"clearSelectedPaired","click .paired-columns .pair-name":"_clickPairName","click .unpair-btn":"_clickUnpair","dragover .paired-columns .column-datasets":"_dragoverPairedColumns","drop .paired-columns .column-datasets":"_dropPairedColumns","pair.dragstart .paired-columns .column-datasets":"_pairDragstart","pair.dragend   .paired-columns .column-datasets":"_pairDragend","change .remove-extensions":function(e){this.toggleExtensions()},"change .collection-name":"_changeName","keydown .collection-name":"_nameCheckForEnter","change .hide-originals":"_changeHideOriginals","click .cancel-create":"_cancelCreate","click .create-collection":"_clickCreate"},_clickShowOnlyUnpaired:function(e){this.$(".paired-columns").is(":visible")?this.hidePaired():this.splitView()},_clickShowOnlyPaired:function(e){this.$(".unpaired-columns").is(":visible")?this.hideUnpaired():this.splitView()},hideUnpaired:function(e,t){this.unpairedPanelHidden=!0,this.pairedPanelHidden=!1,this._renderMiddle(e,t)},hidePaired:function(e,t){this.unpairedPanelHidden=!1,this.pairedPanelHidden=!0,this._renderMiddle(e,t)},splitView:function(e,t){return this.unpairedPanelHidden=this.pairedPanelHidden=!1,this._renderMiddle(e,t),this},_clickUnpairAll:function(e){this.metric("unpairAll"),this.unpairAll()},_clickAutopair:function(e){var t=this.autoPair();this.metric("autopair",t.length,this.unpaired.length),this.trigger("autopair")},_clickFilterChoice:function(e){var t=$(e.currentTarget);this.$(".forward-unpaired-filter input").val(t.data("forward")),this.$(".reverse-unpaired-filter input").val(t.data("reverse")),this._hideChooseFilters(),this.trigger("filter-change")},_hideChooseFilters:function(){this.$(".choose-filters-link").popover("hide"),this.$(".popover").css("display","none")},_clearFilters:function(e){this.$(".forward-unpaired-filter input").val(""),this.$(".reverse-unpaired-filter input").val(""),this.trigger("filter-change")},_clickUnpairedDataset:function(e){return e.stopPropagation(),this.toggleSelectUnpaired($(e.currentTarget))},toggleSelectUnpaired:function(e,t){t=t||{};var i=e.data("dataset"),a=void 0!==t.force?t.force:!e.hasClass("selected");return e.length&&void 0!==i?(a?(e.addClass("selected"),t.waitToPair||this.pairAllSelected()):e.removeClass("selected"),e):e},pairAllSelected:function(e){e=e||{};var t=this,i=[],a=[],r=[];return t.$(".unpaired-columns .forward-column .dataset.selected").each(function(){i.push($(this).data("dataset"))}),t.$(".unpaired-columns .reverse-column .dataset.selected").each(function(){a.push($(this).data("dataset"))}),i.length=a.length=Math.min(i.length,a.length),i.forEach(function(e,i){try{r.push(t._pair(e,a[i],{silent:!0}))}catch(e){t.error(e)}}),r.length&&!e.silent&&this.trigger("pair:new",r),r},clearSelectedUnpaired:function(){this.$(".unpaired-columns .dataset.selected").removeClass("selected")},_mousedownUnpaired:function(e){if(e.shiftKey){var t=this,i=$(e.target).addClass("selected"),a=function(e){t.$(e.target).filter(".dataset").addClass("selected")};i.parent().on("mousemove",a),$(document).one("mouseup",function(e){i.parent().off("mousemove",a),t.pairAllSelected()})}},_clickPairRow:function(e){var t=$(e.currentTarget).index(),i=$(".unpaired-columns .forward-column .dataset").eq(t).data("dataset"),a=$(".unpaired-columns .reverse-column .dataset").eq(t).data("dataset");this._pair(i,a)},_startPartitionDrag:function(e){function t(e){var t=e.pageY-a;i.adjPartition(t)||$("body").trigger("mouseup"),i._adjUnpairedOnScrollbar(),a+=t}var i=this,a=e.pageY;$("body").css("cursor","ns-resize"),i.$(".flexible-partition-drag").css("color","black"),$("body").mousemove(t),$("body").one("mouseup",function(e){i.$(".flexible-partition-drag").css("color",""),$("body").css("cursor","").unbind("mousemove",t)})},adjPartition:function(e){var t=this.$(".unpaired-columns"),i=this.$(".paired-columns"),a=parseInt(t.css("height"),10),r=parseInt(i.css("height"),10);a=Math.max(10,a+e),r-=e;var n=e<0;if(n){if(this.unpairedPanelHidden)return!1;if(a<=10)return this.hideUnpaired(),!1}else this.unpairedPanelHidden&&(t.show(),this.unpairedPanelHidden=!1);if(n)this.pairedPanelHidden&&(i.show(),this.pairedPanelHidden=!1);else{if(this.pairedPanelHidden)return!1;if(r<=15)return this.hidePaired(),!1}return t.css({height:a+"px",flex:"0 0 auto"}),!0},selectPair:function(e){e.stopPropagation(),$(e.currentTarget).toggleClass("selected")},clearSelectedPaired:function(e){this.$(".paired-columns .dataset.selected").removeClass("selected")},_clickPairName:function(e){e.stopPropagation();var t=$(e.currentTarget),i=t.parent().parent().index(".dataset.paired"),a=this.paired[i],r=prompt("Enter a new name for the pair:",a.name);r&&(a.name=r,a.customizedName=!0,t.text(a.name))},_clickUnpair:function(e){var t=Math.floor($(e.currentTarget).index(".unpair-btn"));this._unpair(this.paired[t])},_dragoverPairedColumns:function(e){e.preventDefault();var t=this.$(".paired-columns .column-datasets");this._checkForAutoscroll(t,e.originalEvent.clientY);var i=this._getNearestPairedDatasetLi(e.originalEvent.clientY);$(".element-drop-placeholder").remove();var a=$('<div class="element-drop-placeholder"></div>');i.length?i.before(a):t.append(a)},_checkForAutoscroll:function(e,t){var i=e.offset(),a=e.scrollTop(),r=t-i.top,n=i.top+e.outerHeight()-t;r>=0&&r<this.autoscrollDist?e.scrollTop(a-2):n>=0&&n<this.autoscrollDist&&e.scrollTop(a+2)},_getNearestPairedDatasetLi:function(e){for(var t=this.$(".paired-columns .column-datasets li").toArray(),i=0;i<t.length;i++){var a=$(t[i]),r=a.offset().top,n=Math.floor(a.outerHeight()/2)+4;if(r+n>e&&r-n<e)return a}return $()},_dropPairedColumns:function(e){e.preventDefault(),e.dataTransfer.dropEffect="move";var t=this._getNearestPairedDatasetLi(e.originalEvent.clientY);return t.length?this.$dragging.insertBefore(t):this.$dragging.insertAfter(this.$(".paired-columns .unpair-btn").last()),this._syncPairsToDom(),!1},_syncPairsToDom:function(){var e=[];this.$(".paired-columns .dataset.paired").each(function(){e.push($(this).data("pair"))}),this.paired=e,this._renderPaired()},_pairDragstart:function(e,t){t.$el.addClass("selected");var i=this.$(".paired-columns .dataset.selected");this.$dragging=i},_pairDragend:function(e,t){$(".element-drop-placeholder").remove(),this.$dragging=null},toggleExtensions:function(e){var t=this;t.removeExtensions=void 0!==e?e:!t.removeExtensions,_.each(t.paired,function(e){e.customizedName||(e.name=t._guessNameForPair(e.forward,e.reverse))}),t._renderPaired(),t._renderFooter()},_printList:function(e){var t=this;_.each(e,function(i){e===t.paired?t._printPair(i):t.debug(i)})},_printPair:function(e){this.debug(e.forward.name,e.reverse.name,": ->",e.name)},toString:function(){return"PairedCollectionCreator"},templates:_.extend({},c.default.CollectionCreatorMixin._creatorTemplates,{header:_.template(['<div class="main-help well clear">','<a class="more-help" href="javascript:void(0);">',(0,h.default)("More help"),"</a>",'<div class="help-content">','<a class="less-help" href="javascript:void(0);">',(0,h.default)("Less"),"</a>","</div>","</div>",'<div class="alert alert-dismissable">','<button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>','<span class="alert-message"></span>',"</div>",'<div class="column-headers vertically-spaced flex-column-container">','<div class="forward-column flex-column column">','<div class="column-header">','<div class="column-title">','<span class="title">',(0,h.default)("Unpaired forward"),"</span>",'<span class="title-info unpaired-info"></span>',"</div>",'<div class="unpaired-filter forward-unpaired-filter float-left">','<input class="search-query" placeholder="',(0,h.default)("Filter this list"),'" />',"</div>","</div>","</div>",'<div class="paired-column flex-column no-flex column">','<div class="column-header">','<a class="choose-filters-link" href="javascript:void(0)">',(0,h.default)("Choose filters"),"</a>",'<a class="clear-filters-link" href="javascript:void(0);">',(0,h.default)("Clear filters"),"</a><br />",'<a class="autopair-link" href="javascript:void(0);">',(0,h.default)("Auto-pair"),"</a>","</div>","</div>",'<div class="reverse-column flex-column column">','<div class="column-header">','<div class="column-title">','<span class="title">',(0,h.default)("Unpaired reverse"),"</span>",'<span class="title-info unpaired-info"></span>',"</div>",'<div class="unpaired-filter reverse-unpaired-filter float-left">','<input class="search-query" placeholder="',(0,h.default)("Filter this list"),'" />',"</div>","</div>","</div>","</div>"].join("")),middle:_.template(['<div class="unpaired-columns flex-column-container scroll-container flex-row">','<div class="forward-column flex-column column">','<ol class="column-datasets"></ol>',"</div>",'<div class="paired-column flex-column no-flex column">','<ol class="column-datasets"></ol>',"</div>",'<div class="reverse-column flex-column column">','<ol class="column-datasets"></ol>',"</div>","</div>",'<div class="flexible-partition">','<div class="flexible-partition-drag" title="',(0,h.default)("Drag to change"),'"></div>','<div class="column-header">','<div class="column-title paired-column-title">','<span class="title"></span>',"</div>",'<a class="unpair-all-link" href="javascript:void(0);">',(0,h.default)("Unpair all"),"</a>","</div>","</div>",'<div class="paired-columns flex-column-container scroll-container flex-row">','<ol class="column-datasets"></ol>',"</div>"].join("")),footer:_.template(['<div class="attributes clear">','<div class="clear">','<label class="setting-prompt float-right">',(0,h.default)("Hide original elements"),"?",'<input class="hide-originals float-right" type="checkbox" />',"</label>",'<label class="setting-prompt float-right">',(0,h.default)("Remove file extensions from pair names"),"?",'<input class="remove-extensions float-right" type="checkbox" />',"</label>","</div>",'<div class="clear">','<input class="collection-name form-control float-right" ','placeholder="',(0,h.default)("Enter a name for your new list"),'" />','<div class="collection-name-prompt float-right">',(0,h.default)("Name"),":</div>","</div>","</div>",'<div class="actions clear vertically-spaced">','<div class="other-options float-left">','<button class="cancel-create btn" tabindex="-1">',(0,h.default)("Cancel"),"</button>",'<div class="create-other btn-group dropup">','<button class="btn btn-secondary dropdown-toggle" data-toggle="dropdown">',(0,h.default)("Create a different kind of collection"),' <span class="caret"></span>',"</button>",'<ul class="dropdown-menu" role="menu">','<li><a href="#">',(0,h.default)("Create a <i>single</i> pair"),"</a></li>",'<li><a href="#">',(0,h.default)("Create a list of <i>unpaired</i> datasets"),"</a></li>","</ul>","</div>","</div>",'<div class="main-options float-right">','<button class="create-collection btn btn-primary">',(0,h.default)("Create list"),"</button>","</div>","</div>"].join("")),helpContent:_.template(["<p>",(0,h.default)(["Collections of paired datasets are ordered lists of dataset pairs (often forward and reverse reads). ","These collections can be passed to tools and workflows in order to have analyses done on each member of ","the entire group. This interface allows you to create a collection, choose which datasets are paired, ","and re-order the final collection."].join("")),"</p>","<p>",(0,h.default)(['Unpaired datasets are shown in the <i data-target=".unpaired-columns">unpaired section</i> ',"(hover over the underlined words to highlight below). ",'Paired datasets are shown in the <i data-target=".paired-columns">paired section</i>.',"<ul>To pair datasets, you can:","<li>Click a dataset in the ",'<i data-target=".unpaired-columns .forward-column .column-datasets,','.unpaired-columns .forward-column">forward column</i> ',"to select it then click a dataset in the ",'<i data-target=".unpaired-columns .reverse-column .column-datasets,','.unpaired-columns .reverse-column">reverse column</i>.',"</li>",'<li>Click one of the "Pair these datasets" buttons in the ','<i data-target=".unpaired-columns .paired-column .column-datasets,','.unpaired-columns .paired-column">middle column</i> ',"to pair the datasets in a particular row.","</li>",'<li>Click <i data-target=".autopair-link">"Auto-pair"</i> ',"to have your datasets automatically paired based on name.","</li>","</ul>"].join("")),"</p>","<p>",(0,h.default)(["<ul>You can filter what is shown in the unpaired sections by:","<li>Entering partial dataset names in either the ",'<i data-target=".forward-unpaired-filter input">forward filter</i> or ','<i data-target=".reverse-unpaired-filter input">reverse filter</i>.',"</li>","<li>Choosing from a list of preset filters by clicking the ",'<i data-target=".choose-filters-link">"Choose filters" link</i>.',"</li>","<li>Entering regular expressions to match dataset names. See: ",'<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions"',' target="_blank">MDN\'s JavaScript Regular Expression Tutorial</a>. ',"Note: forward slashes (\\) are not needed.","</li>","<li>Clearing the filters by clicking the ",'<i data-target=".clear-filters-link">"Clear filters" link</i>.',"</li>","</ul>"].join("")),"</p>","<p>",(0,h.default)(["To unpair individual dataset pairs, click the ",'<i data-target=".unpair-btn">unpair buttons ( <span class="fa fa-unlink"></span> )</i>. ','Click the <i data-target=".unpair-all-link">"Unpair all" link</i> to unpair all pairs.'].join("")),"</p>","<p>",(0,h.default)(['You can include or remove the file extensions (e.g. ".fastq") from your pair names by toggling the ','<i data-target=".remove-extensions-prompt">"Remove file extensions from pair names?"</i> control.'].join("")),"</p>","<p>",(0,h.default)(['Once your collection is complete, enter a <i data-target=".collection-name">name</i> and ','click <i data-target=".create-collection">"Create list"</i>. ',"(Note: you do not have to pair all unpaired datasets to finish.)"].join("")),"</p>"].join(""))})}),m=function(e,t){var i,a=jQuery.Deferred();if(t=_.defaults(t||{},{datasets:e,oncancel:function(){Galaxy.modal.hide(),a.reject("cancelled")},oncreate:function(e,t){Galaxy.modal.hide(),a.resolve(t)},title:(0,h.default)("Create a collection of paired datasets")}),!window.Galaxy||!Galaxy.modal)throw new Error("Galaxy or Galaxy.modal not found");return i=new f(t),Galaxy.modal.show({title:t.title,body:i.$el,width:"80%",height:"800px",closing_events:!0}),i.render(),window.creator=i,a};e.default={PairedCollectionCreator:f,pairedCollectionCreatorModal:m,createListOfPairsCollection:function(e,t){var i=e.toJSON();return m(i,{historyId:e.historyId,defaultHideSourceItems:t})}}});
//# sourceMappingURL=../../../maps/mvc/collection/list-of-pairs-collection-creator.js.map
