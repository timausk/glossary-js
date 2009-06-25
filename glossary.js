/*-------------------------------------------
	Glossary-JS version 3.0 
	Michigan State University
	Virtual University Design and Technology
	Creator:  Nathan Lounds
	Project Page: http://code.google.com/p/glossary-js/
	Dependencies:  jquery.js (http://jquery.com)
		glossary.css
	Copyright (c) 2009 Michigan State University Board of Trustees
	License: http://www.opensource.org/licenses/mit-license.php
--------------------------------------------*/
GlossaryJS_css = window.GlossaryJS_css || "glossary.css";
GlossaryJS_txt = window.GlossaryJS_txt || "glossary.txt";
GlossaryJS_section = window.GlossaryJS_section || "";  
var GlossaryJS = {
	glossary: new Array(),
	initialize : function() {
		//<![CDATA[
		// loading the stylesheet into the document header
		if(document.createStyleSheet) { // non-standard IE way of doing it
			document.createStyleSheet(GlossaryJS_css);
		} else { // do it the W3C DOM way
			var newCSS=document.createElement('link');
			newCSS.rel='stylesheet';
			newCSS.href=GlossaryJS_css;
			newCSS.type='text/css';
			document.getElementsByTagName("head")[0].appendChild(newCSS);
		}
		//]]>
		
		$(".glossary").each(function(i){
			var cur = this;
			cur.className = "highlightSpan";
		});
		$(".highlightSpan").each(function(i){
			var cur_word = this;
			cur_word.onmouseover = function() {
				GlossaryJS.word = this;
				clearTimeout(GlossaryJS.timer);
				GlossaryJS.getDefinition();
			}
			cur_word.onmouseout = function() {
				var the_div = document.getElementById("glossaryTooltip");
				if(the_div) {
					GlossaryJS.timer = setTimeout("$('#glossaryTooltip').remove()",1200);
				}
			}
			cur_word.onclick = function() {
				var me = this;
				var the_div = document.getElementById("glossaryTooltip");
				the_div.title = "click to close";
				GlossaryJS.word = me;
				GlossaryJS.getDefinition();
			}
		});
		GlossaryJS.loadGlossary();
	},
	loadGlossary: function() {
		$.ajax({
			type: "GET",
			url: GlossaryJS_txt,
			data: "",
			success: function(str){
				// Create the array of glossary terms
				var the_words = str.split("\n");
				for (i = 0; i < the_words.length; i++) {
					GlossaryJS.glossary[i] = {};
					var the_word_arr = the_words[i].split("|");
					if(the_word_arr) {
						GlossaryJS.glossary[i].word = the_word_arr[0];
						GlossaryJS.glossary[i].def = "";
						GlossaryJS.glossary[i].section = "";
						if(the_word_arr.length==3) {
							GlossaryJS.glossary[i].section = " (" + the_word_arr[1] + ")";
							GlossaryJS.glossary[i].def = the_word_arr[2];
						} else if (the_word_arr.length==2) {
							GlossaryJS.glossary[i].def = the_word_arr[1];
						}
					}
				}
				// Make the glossary unordered list (if there's a div for it)
				var str_output = "";
				var GlossaryUL = document.getElementById("GlossaryJS");
				if(GlossaryUL) {
					for (i = 0; i < GlossaryJS.glossary.length; i++) {
						var the_section = "";
						if(GlossaryJS.glossary[i].section.length>0) {
							the_section = " (" + GlossaryJS.glossary[i].section + ")";
						}
						str_output += "<li><strong>"+GlossaryJS.glossary[i].word;
						str_output += the_section+"</strong>: "+GlossaryJS.glossary[i].def+"</li>\n";
			
					}
					$("#GlossaryJS").html("<ul>"+str_output+"</ul>");
				}
			}
		});
	},
	getDefinition : function() {
		for (i = 0; i < GlossaryJS.glossary.length; i++) {
			var the_term = GlossaryJS.word.childNodes[0].nodeValue;
			if(GlossaryJS.glossary[i].word.toUpperCase()==the_term.toUpperCase()) {
				GlossaryJS.createGlossaryTooltip(GlossaryJS.word,GlossaryJS.glossary[i]);
				return true;
			}
		}
		$("#glossaryTooltip").html('<span class="red">not in glossary</span>');
	},
	createGlossaryTooltip : function(word_div,glossary_element) {
		$("#glossaryTooltip").remove();
		var position = $(word_div).position();
		var the_left;
		$(word_div).after('<div id="glossaryTooltip">'+glossary_element.def+'</div>');
		if(position.left > ($(document).width()*0.5)) {  // put tooltip to left of word
			the_left = (position.left-$("#glossaryTooltip").innerWidth()) + "px";
		} else {  // put tooltip to right of word
			the_left = (position.left+$(word_div).width()) + "px";
		}
		$("#glossaryTooltip")
			.css("left",the_left)
			.css("top",(position.top+$(word_div).height())+"px")
			.click(function() {
				$(this).remove();
			})
			.mouseover(function() {
				clearTimeout(GlossaryJS.timer);
			})
			.mouseout(function() {
				GlossaryJS.timer = setTimeout("$('#glossaryTooltip').remove()",1200);
			});
	}
}

$(document).ready(function() {
	GlossaryJS.initialize();
});