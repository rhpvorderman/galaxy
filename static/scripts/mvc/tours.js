define("mvc/tours",["exports","utils/localization","libs/backbone","libs/underscore","libs/bootstrap-tour"],function(t,e,n,o){"use strict";function a(t){if(t&&t.__esModule)return t;var e={};if(null!=t)for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e.default=t,e}function r(t){var e=f(t);window.sessionStorage.setItem("activeGalaxyTour",JSON.stringify(t));var n=new d(c.extend({steps:e.steps},p));return n.init(),n.goTo(0),n.restart(),n}function i(t){var e=g+"api/tours/"+t;$.getJSON(e,function(t){r(t)})}function s(){var t=JSON.parse(window.sessionStorage.getItem("activeGalaxyTour"));if(t&&(t=f(t))&&t.steps&&window&&window.self===window.top){var e=new d(c.extend({steps:t.steps},p));e.init(),e.restart()}}Object.defineProperty(t,"__esModule",{value:!0}),t.ToursView=void 0,t.giveTourWithData=r,t.giveTourById=i,t.activeGalaxyTourRunner=s;var u=function(t){return t&&t.__esModule?t:{default:t}}(e),l=a(n),c=a(o),d=window.Tour,g="undefined"==typeof Galaxy?"/":Galaxy.root,p={storage:window.sessionStorage,onEnd:function(){window.sessionStorage.removeItem("activeGalaxyTour")},delay:150,orphan:!0},f=function(t){return c.each(t.steps,function(t){t.preclick&&(t.onShow=function(){c.each(t.preclick,function(t){$(t).click()})}),t.postclick&&(t.onHide=function(){c.each(t.postclick,function(t){$(t).click()})}),t.textinsert&&(t.onShown=function(){$(t.element).val(t.textinsert).trigger("change")}),t.path&&(console.warn("This Galaxy Tour is attempting to use path navigation.  This is known to be unstable and can possibly get the Galaxy client 'stuck' in a tour, and at this time is not allowed."),delete t.path)}),t},h=l.Model.extend({urlRoot:g+"api/tours"}),v=l.Collection.extend({url:g+"api/tours",model:h}),b=t.ToursView=l.View.extend({title:(0,u.default)("Tours"),initialize:function(){var t=this;this.setElement("<div/>"),this.model=new v,this.model.fetch({success:function(){t.render()},error:function(){console.error("Failed to fetch tours.")}})},render:function(){var t=c.template('\n    <h2>Galaxy Tours</h2>\n    <p>This page presents a list of interactive tours available on this Galaxy server.\n    Select any tour to get started (and remember, you can click \'End Tour\' at any time).</p>\n\n<div class="row mb-3">\n    <div class="col-12 btn-group" role="group" aria-label="Tag selector">\n        <% _.each(tourtagorder, function(tag) { %>\n        <button class="btn btn-primary tag-selector-button" tag-selector-button="<%- tag %>">\n            <%- tag %>\n        </button>\n        <% }); %>\n    </div>\n</div>\n\n<% _.each(tourtagorder, function(tourtagkey) { %>\n<div tag="<%- tourtagkey %>" class="row mb-3">\n    <div class="col-12">\n    <% var tourtag = tourtags[tourtagkey]; %>\n    <h4>\n        <%- tourtag.name %>\n    </h4>\n    <ul class="list-group">\n    <% _.each(tourtag.tours, function(tour) { %>\n        <li class="list-group-item">\n            <a href="/tours/<%- tour.id %>" class="tourItem" data-tour.id=<%- tour.id %>>\n                <%- tour.attributes.name || tour.id %>\n            </a>\n             - <%- tour.attributes.description || "No description given." %>\n             <% _.each(tour.attributes.tags, function(tag) { %>\n                <span class="badge badge-primary">\n                    <%- tag.charAt(0).toUpperCase() + tag.slice(1) %>\n                </span>\n             <% }); %>\n        </li>\n    <% }); %>\n    </ul>\n    </div>\n</div>\n<% }); %>'),e={};c.each(this.model.models,function(t){null===t.attributes.tags?(void 0===e.Untagged&&(e.Untagged={name:"Untagged",tours:[]}),e.Untagged.tours.push(t)):c.each(t.attributes.tags,function(n){n=n.charAt(0).toUpperCase()+n.slice(1),void 0===e[n]&&(e[n]={name:n,tours:[]}),e[n].tours.push(t)})});var n=Object.keys(e).sort();this.$el.html(t({tours:this.model.models,tourtags:e,tourtagorder:n})).on("click",".tourItem",function(t){t.preventDefault(),i($(this).data("tour.id"))}).on("click",".tag-selector-button",function(t){var e=$(t.target),n="block",o=e.attr("tag-selector-button");e.toggleClass("btn-primary"),e.toggleClass("btn-secondary"),e.hasClass("btn-secondary")&&(n="none"),$("div[tag='"+o+"']").css({display:n})})}});t.default={ToursView:b,giveTourWithData:r,giveTourById:i,activeGalaxyTourRunner:s}});
//# sourceMappingURL=../../maps/mvc/tours.js.map
