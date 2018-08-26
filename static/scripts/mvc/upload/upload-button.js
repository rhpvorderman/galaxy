define("mvc/upload/upload-button",["exports","utils/localization"],function(t,e){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var o=function(t){return t&&t.__esModule?t:{default:t}}(e),s=Backbone.View.extend({initialize:function(t){var e=this;this.model=t&&t.model||new Backbone.Model({icon:"fa-upload",tooltip:(0,o.default)("Download from URL or upload files from disk"),label:"Load Data",percentage:0,status:"",onunload:function(){},onclick:function(){}}).set(t),this.setElement(this._template()),this.$progress=this.$(".progress-bar"),this.listenTo(this.model,"change",this.render,this),this.render(),$(window).on("beforeunload",function(){return e.model.get("onunload")()})},render:function(){var t=this.model.attributes;this.$el.off("click").on("click",function(e){t.onclick(e)}).tooltip({title:this.model.get("tooltip"),placement:"bottom",trigger:"hover"}),this.$progress.removeClass().addClass("progress-bar").addClass("progress-bar-notransition").addClass(""!=t.status&&"progress-bar-"+t.status).css({width:t.percentage+"%"})},_template:function(){return'<div class="upload-button"><div class="progress"><div class="progress-bar"/><a class="panel-header-button" href="javascript:void(0)" id="tool-panel-upload-button"><span class="fa fa-upload"/></a></div></div>'}});t.default={View:s}});
//# sourceMappingURL=../../../maps/mvc/upload/upload-button.js.map
