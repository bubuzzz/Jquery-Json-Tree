/*
 * Jquery Plugin created by Thai Tran. 
 * 
 * Inspired by http://www.akchauhan.com/create-simple-left-tree-menu-using-jquery/
 * 
 * Version: 1.0.0
 */

(function($) {
	var index = 0;
	var _options = null;
	
	// Jquery plugin backbone
	$.fn.extend({
		// This is where you write your plugin's name
		treeJson : function(pre) {

			var defaults = {
				jsonSrc : '',
				displayText : '',
				sndValue : '',
				collapse : true,
				recursion : true,
				after : null
			};

			var options = $.extend(defaults, pre);

			// Iterate over the current set of matched elements
			return this.each(function() {
				_options = options;

				var that = $(this);
				
				that.append(createControls());
			});
		}
	});
	
	repositionDiv = function() {
		if ($('#divRootAd').is(':hidden')) {
			// get the field position
			var sf_pos    = $("#txtAdVal").offset();
			var sf_top    = sf_pos.top;
			var sf_left   = sf_pos.left;		
			
			// get the field size
			var sf_height = $("#txtAdVal").height();
			
			// apply the css styles - optimized for Firefox
			$("#divRootAd").css("position","absolute");
			$("#divRootAd").css("left", sf_left);
			$("#divRootAd").css("top", sf_top + sf_height + 5);

			$('#divRootAd').show();
			
			// clear div if there is no focus
			var t = 0;
			$('#divRootAd').mouseout(function(event){
				t = setTimeout(function(){
					clearDiv();					
				}, 1000);
			});
			
			$('#divRootAd').mouseover(function(event){
				clearTimeout(t);
			});
			
			
		} else {
			clearDiv();
		}
	};
	
	// clear auto complete box
	clearDiv = function() {
		$('#divRootAd').hide();
		$('#divRootAd').remove();
	};
	
	toggleNode = function(childid) {
		var id = "#" + String(childid);
		if ($(id).is(':hidden')){
			$("a[childid='"+childid+"']").removeClass('collapsed').addClass('expanded');
			$(id).show();
		}
		else {
			$("a[childid='"+childid+"']").removeClass('expanded').addClass('collapsed');
			$(id).hide();
		}
	};
	
	createControls = function() {
		nDiv = document.createElement("div");
		nDiv.id = "treeRootWrapper";
		
		nTxt = document.createElement("input");
		nTxt.id = 'txtAdVal';
		nTxt.setAttribute('type','text');
		$(nTxt).css("width", "300px");
	    $(nTxt).attr("disabled", true); 
		
		nBut = document.createElement("button");
		nBut.innerHTML = "Select ...";
		nBut.className = "buttonStyleTreeJson"; // never use setAttribute to creating class[bug on IE]
		
		nDiv.appendChild(nTxt);
		nDiv.appendChild(nBut);
		
		$(nBut).bind('click', function(event) {
			index = 0;
			createTree();
		});
		
		return nDiv;
	};
	
	createTree = function() {
		$.getJSON(_options.jsonSrc, function(data) {
			nDiv = document.createElement("div");
			nDiv.id = "divRootAd";
			$(nDiv).css('display', 'none');
			
			jsonObj = data["treeJson"];

			nUl = document.createElement("ul");
			nUl.appendChild(createNode(jsonObj));
			
			nDiv.appendChild(nUl);	
						
			$("body").append(nDiv);
			
			repositionDiv();
		});
	};
	
	createNode = function(jsonObj) {
		id = "c_";
		index ++;
		id += String(index);
		
		var nDiv = document.createElement("div");
		// create the root ul
		var nLi = document.createElement("li");
		
		var hpLink = document.createElement("a");
		
		$(hpLink).attr("href", "#");
		$(hpLink).attr("childid", id);
		hpLink.className = "category";
		
		var hpLinkT = document.createElement("a");
		hpLinkT.className = "nodeName";
		hpLinkT.innerHTML = jsonObj[_options.displayText];
		$(hpLinkT).attr("value", jsonObj[_options.sndValue]);
		$(hpLinkT).attr("href", "#");
		
		nLi.appendChild(hpLink);
		
		nLi.appendChild(hpLinkT);
		nDiv.appendChild(nLi);
		
		var subDir = jsonObj["subDirect"];
		var nUl = document.createElement("ul");
		nUl.id = id;
		
		if (_options.collapse == true) {
			if (jsonObj[_options.displayText] == "Root"){
				nUl.style.cssText = "display: block";	
			}
			else {
				nUl.style.cssText = "display: none";
			}
		}
		
		
		if (subDir.length > 0) {
			if (jsonObj[_options.displayText] == "Root") {
				$(hpLink).addClass('expanded');	
			}
			else {
				$(hpLink).addClass('collapsed');
			}
			
			
			$(hpLink).bind("click", function (event) {
				toggleNode($(this).attr("childid"));
			});
			
		}
		else {
			$(hpLink).css("background-image", "");
		}
		
		$(hpLinkT).bind('click', function(){
			$('#txtAdVal').val($(this).text());
			
			clearDiv();
			
			if (_options.after != null && typeof _options.after == "function") {
				_options.after($(this).val());				
			}
		});
		
		for ( var i = 0; i < subDir.length; i++) {
			nUl.appendChild(createNode(subDir[i]));
		}
		
		nDiv.appendChild(nUl);
		return nDiv;
	};

})(jQuery);
