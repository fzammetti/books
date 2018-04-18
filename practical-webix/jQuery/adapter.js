(function(){

if (window.jQuery){

	var $ = jQuery;
	var methods = [];

	var get_id = function(node){
		if (node && node.getAttribute)
			return node.getAttribute("view_id");
	};

	var get_helper = function(name){
		return function(config){
			if (typeof(config) === 'string') {
				if (methods[config] ) {
					return methods[config].apply(this, []);
				}else {
					$.error('Method ' +  config + ' does not exist on jQuery.'.name);
				}
			} else {
				var views = [];
				this.each(function() {
					var view;
					var id;

					//if target a webix component - return it
					var id = get_id(this) || get_id(this.firstChild);
					if (id)
						view = webix.$$(id);

					if (!view){
						//do not include data in copy as it can be massive
						var temp_data = config?config.data:0;
						if (temp_data) config.data = null;

						var copy = webix.copy(config||{ autoheight:true, autowidth:true });
						copy.view = name;
						if (temp_data) config.data = copy.data = temp_data;


						if (this.tagName.toLowerCase() === 'table') {
							var div = webix.html.create("div",{
								id:(this.getAttribute("id")||""),
								"class":(this.getAttribute("class")||"")
							},"");

							this.parentNode.insertBefore(div, this);
							copy.container = div;
							view = webix.ui(copy);
							view.parse(this, "htmltable");
						} else {
							copy.container = this;
							view = webix.ui(copy);
						}
					}
					views.push(view);
				});

				if (views.length === 1) return views[0];
				return views;
			}
		};
	};

	var run = function(){
		for (var key in webix.ui){
			var name = "webix_"+key;
			if (!$.fn[name])
				$.fn[name] = get_helper(key);
		}
	};

	run();
	$(run);

}

})();
