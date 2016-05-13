define(["utils/utils","utils/deferred","mvc/ui/ui-misc","mvc/form/form-view","mvc/tool/tool-template","mvc/citation/citation-model","mvc/citation/citation-view"],function(a,b,c,d,e,f,g){return d.extend({initialize:function(a){var c=this;d.prototype.initialize.call(this,a),this.deferred=new b,a.inputs?(this._buildForm(a),a.needs_update&&this.deferred.execute(function(a){c._updateModel(a)})):this.deferred.execute(function(b){c._buildModel(b,a,!0)})},remove:function(){var a=this;this.$el.hide(),this.deferred.execute(function(){d.prototype.remove.call(a),Galaxy.emit.debug("tool-form-base::remove()","Destroy view.")})},_buildForm:function(b){var c=this;this.options=a.merge(b,this.options),this.options=a.merge({icon:b.icon,title:"<b>"+b.name+"</b> "+b.description+" (Galaxy Version "+b.version+")",operations:this._operations(),onchange:function(){c.deferred.reset(),c.deferred.execute(function(a){c._updateModel(a)})}},this.options),this.options.customize&&this.options.customize(this.options),this.render(),this.options.collapsible||this.$el.append($("<div/>").addClass("ui-margin-top-large").append(this._footer()))},_buildModel:function(b,d,e){var f=this;this.options.id=d.id,this.options.version=d.version;var g="",h={};d.job_id?g=Galaxy.root+"api/jobs/"+d.job_id+"/build_for_rerun":(g=Galaxy.root+"api/tools/"+d.id+"/build",Galaxy.params&&Galaxy.params.tool_id==d.id&&(h=$.extend({},Galaxy.params),d.version&&(h.tool_version=d.version))),a.request({type:"GET",url:g,data:h,success:function(a){return a=a.tool_model||a,a.display?(f._buildForm(a),!e&&f.message.update({status:"success",message:"Now you are using '"+f.options.name+"' version "+f.options.version+", id '"+f.options.id+"'.",persistent:!1}),Galaxy.emit.debug("tool-form-base::initialize()","Initial tool model ready.",a),void b.resolve()):void(window.location=Galaxy.root)},error:function(a,d){var e=a&&a.err_msg||"Uncaught error.";401==d.status?window.location=Galaxy.root+"user/login?"+$.param({redirect:Galaxy.root+"?tool_id="+f.options.id}):f.$el.is(":empty")?f.$el.prepend(new c.Message({message:e,status:"danger",persistent:!0,large:!0}).$el):Galaxy.modal.show({title:"Tool request failed",body:e,buttons:{Close:function(){Galaxy.modal.hide()}}}),Galaxy.emit.debug("tool-form::initialize()","Initial tool model request failed.",a),b.reject()}})},_updateModel:function(b){var c=this,d=this.options.update_url||Galaxy.root+"api/tools/"+this.options.id+"/build",e={tool_id:this.options.id,tool_version:this.options.version,inputs:$.extend(!0,{},c.data.create())};this.wait(!0),Galaxy.emit.debug("tool-form-base::_updateModel()","Sending current state.",e),a.request({type:"POST",url:d,data:e,success:function(a){c.update(a.tool_model||a),c.options.update&&c.options.update(a),c.wait(!1),Galaxy.emit.debug("tool-form-base::_updateModel()","Received new model.",a),b.resolve()},error:function(a){Galaxy.emit.debug("tool-form-base::_updateModel()","Refresh request failed.",a),b.reject()}})},_operations:function(){var a=this,b=this.options,d=new c.ButtonMenu({icon:"fa-cubes",title:!b.narrow&&"Versions"||null,tooltip:"Select another tool version"});if(!b.sustain_version&&b.versions&&b.versions.length>1)for(var f in b.versions){var g=b.versions[f];g!=b.version&&d.addMenu({title:"Switch to "+g,version:g,icon:"fa-cube",onclick:function(){var c=b.id.replace(b.version,this.version),d=this.version;a.deferred.reset(),a.deferred.execute(function(b){a._buildModel(b,{id:c,version:d})})}})}else d.$el.hide();var h=new c.ButtonMenu({icon:"fa-caret-down",title:!b.narrow&&"Options"||null,tooltip:"View available options"});return b.biostar_url&&(h.addMenu({icon:"fa-question-circle",title:"Question?",tooltip:"Ask a question about this tool (Biostar)",onclick:function(){window.open(b.biostar_url+"/p/new/post/")}}),h.addMenu({icon:"fa-search",title:"Search",tooltip:"Search help for this tool (Biostar)",onclick:function(){window.open(b.biostar_url+"/local/search/page/?q="+b.name)}})),h.addMenu({icon:"fa-share",title:"Share",tooltip:"Share this tool",onclick:function(){prompt("Copy to clipboard: Ctrl+C, Enter",window.location.origin+Galaxy.root+"root?tool_id="+b.id)}}),Galaxy.user&&Galaxy.user.get("is_admin")&&h.addMenu({icon:"fa-download",title:"Download",tooltip:"Download this tool",onclick:function(){window.location.href=Galaxy.root+"api/tools/"+b.id+"/download"}}),b.requirements&&b.requirements.length>0&&h.addMenu({icon:"fa-info-circle",title:"Requirements",tooltip:"Display tool requirements",onclick:function(){this.visible?(this.visible=!1,a.message.update({message:""})):(this.visible=!0,a.message.update({persistent:!0,message:e.requirements(b),status:"info"}))}}),b.sharable_url&&h.addMenu({icon:"fa-external-link",title:"See in Tool Shed",tooltip:"Access the repository",onclick:function(){window.open(b.sharable_url)}}),{menu:h,versions:d}},_footer:function(){var a=this.options,b=$("<div/>").append(e.help(a));if(a.citations){var c=$("<div/>"),d=new f.ToolCitationCollection;d.tool_id=a.id;var h=new g.CitationListView({el:c,collection:d});h.render(),d.fetch(),b.append(c)}return b}})});
//# sourceMappingURL=../../../maps/mvc/tool/tool-form-base.js.map