/*-------------------------------------------
	Glossary-JS version 3.2 
	Michigan State University
	Virtual University Design and Technology
	Creator:  Nathan Lounds
	Project Page: http://code.google.com/p/glossary-js/
	Dependencies:  jquery.js (http://jquery.com)
		auto-highlighting requires jquery.highlight.js (http://bartaz.github.com/sandbox.js/jquery.highlight.html)
		glossary.css
	Copyright (c) 2011 Michigan State University Board of Trustees
	License: http://www.opensource.org/licenses/mit-license.php
--------------------------------------------*/
GlossaryJS_css = window.GlossaryJS_css || "glossary.css";
GlossaryJS_txt = window.GlossaryJS_txt || "glossary.txt";
GlossaryJS_section = window.GlossaryJS_section || "";
GlossaryJS_autohighlight = window.GlossaryJS_autohighlight || false;
GlossaryJS_toc = window.GlossaryJS_toc || true;
GlossaryJS_selector =window.GlossaryJS_selector || document.body;
GlossaryJS_toc_array = window.GlossaryJS_toc_array || "A.B.C.D.E.F.G.H.I.J.K.L.M.N.O.P.Q.R.S.T.U.V.W.X.Y.Z".split(".");
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
		
		$(".highlightSpan")
			.live("mouseover", function() {
				GlossaryJS.word = this;
				clearTimeout(GlossaryJS.timer);
				GlossaryJS.getDefinition();
			})
			.live("mouseout", function() {
				var the_div = document.getElementById("glossaryTooltip");
				if(the_div) {
					GlossaryJS.timer = setTimeout("$('#glossaryTooltip').remove()",1000);
				}
			})
			.live("click", function() {
				var me = this;
				me.blur();
				$("#glossaryTooltip").attr("title","click to close");
				GlossaryJS.word = me;
				GlossaryJS.getDefinition();
			});

		GlossaryJS.loadGlossary();
	},
	loadGlossary: function() {
		$.ajax({
			data: "",
			dataType: 'html',
			url: GlossaryJS_txt,
			success: function(str){
				// Create the array of glossary terms
				var the_words = str.split("\n"), counter = 0, inarray, the_word_arr, highlight_arr = [];
				the_words.sort(function(x,y) {
					if(x.toLowerCase() !== y.toLowerCase()) {
						x = x.toLowerCase();
						y = y.toLowerCase();
					}
					return x > y ? 1 : (x < y ? -1 : 0);
				});
				for (i = 0; i < the_words.length; i++) {
					inarray = false;
					the_word_arr = the_words[i].split("|");
					if(the_word_arr.length<3 || (the_word_arr.length==3&&GlossaryJS_section==the_word_arr[1])) {
						if(the_word_arr) {
							if(the_word_arr[0].length>1 && the_word_arr.length>1) {
								for(k = 0; k < GlossaryJS.glossary.length; k++) {
									if(the_word_arr[0]===GlossaryJS.glossary[k].word) {
										inarray = true;
										k = GlossaryJS.glossary.length;
									}
								}
								if(inarray===false) {
									GlossaryJS.glossary[counter] = {};
									GlossaryJS.glossary[counter].word = the_word_arr[0];
									if(GlossaryJS_autohighlight===true) {
										highlight_arr.push(GlossaryJS.glossary[counter].word);
									}
									GlossaryJS.glossary[counter].def = "";
									GlossaryJS.glossary[counter].section = "";
									if(the_word_arr.length===3) {
										GlossaryJS.glossary[counter].section = the_word_arr[1];
										GlossaryJS.glossary[counter].def = the_word_arr[2];
									} else if (the_word_arr.length===2) {
										GlossaryJS.glossary[counter].def = the_word_arr[1];
									}
									counter++;
								}
							} else {
								//console.log(the_word_arr);  uncomment this line to find lines without def's
							}
						} 
					}
				}
				if(GlossaryJS_autohighlight===true && highlight_arr.length>0) {
					//$("#section_instruct_proc").highlight(highlight_arr, { wordsOnly: true, className: 'highlightSpan' });
					$(GlossaryJS_selector).highlight(highlight_arr, { wordsOnly: true, className: 'highlightSpan' });
				}
				
				// Make the glossary unordered list (if there's a div for it)
				var str_output = "";
				var GlossaryUL = document.getElementById("GlossaryJS");
				var k = 0;
				var tmp_output = "";
				var tmp_first_letter = "";
				var prev_first_letter = "";
				var jump_bar_arr = new Array();
				var jump_bar = "";
				GlossaryJS_toc_array[0].toUpperCase();
				if(GlossaryUL) {
					for (i=0; i <= GlossaryJS.glossary.length-1; i++) {
						//if(GlossaryJS.glossary[i]) {
							tmp_output = "<dt>"+GlossaryJS.glossary[i].word + "</dt>\n<dd>"+GlossaryJS.glossary[i].def+"</dd>\n";
							if(GlossaryJS_toc===true) {
								tmp_first_letter = GlossaryJS.glossary[i].word.substring(0,1).toUpperCase();
								if(prev_first_letter!=tmp_first_letter) {
									// new letter
									while(k<=GlossaryJS_toc_array.length-1) {
										if(GlossaryJS_toc_array[k]===tmp_first_letter) { 
											tmp_output = "<a name='glossary_letter_" + GlossaryJS_toc_array[k] + "' class='anchor'></a><h3 class='toc_letter'>" + GlossaryJS_toc_array[k] + "</h3>" + tmp_output;
											jump_bar_arr.push(new Array(GlossaryJS_toc_array[k], true));
											k++;
											break;
										} else {
											jump_bar_arr.push(new Array(GlossaryJS_toc_array[k], false));
											k++;
										}
									}
								}
								prev_first_letter = tmp_first_letter;
							}
							str_output += tmp_output;
						//} else {
						//	console.log(GlossaryJS.glossary[i-1]);
						//}
					}
					while(k<=GlossaryJS_toc_array.length-1) {
						jump_bar_arr.push(new Array(GlossaryJS_toc_array[k], false));
						k++;
					}
					for ( var i=0, len=jump_bar_arr.length; i<len; ++i ) {
						if(jump_bar_arr[i][1]===true) {
							jump_bar += "<a href='#glossary_letter_"+jump_bar_arr[i][0]+"'>" + jump_bar_arr[i][0] + "</a>";
						} else {
							jump_bar += "<span>" + jump_bar_arr[i][0] + "</span>";
						}
					}
					$("#GlossaryJS").html("<dl>"+str_output+"</dl>");
					if(GlossaryJS_toc===true) {
						jump_bar = "<div class='jump_bar'>" + jump_bar + "</div>";
						//$("#GlossaryJS").before(jump_bar).after(jump_bar);
						$("#GlossaryJS a.anchor").before(jump_bar);
					}
				}
			}
		});
	},
	getDefinition : function() {
		for (i = 0; i < GlossaryJS.glossary.length; i++) {
			var the_term = GlossaryJS.word.childNodes[0].nodeValue;
			if(jQuery.trim(GlossaryJS.glossary[i].word.toUpperCase())==jQuery.trim(the_term.toUpperCase())) {
				GlossaryJS.createGlossaryTooltip(GlossaryJS.word,GlossaryJS.glossary[i]);
				return true;
			}
		}
		var tmp_obj = {};
		tmp_obj.def = "<span style='color:red;font-weight:bold'>Error:</span> not in glossary";
		tmp_obj.word = GlossaryJS.word;
		GlossaryJS.createGlossaryTooltip(GlossaryJS.word,tmp_obj);
	},
	createGlossaryTooltip : function(word_div,glossary_element) {
		$("#glossaryTooltip").remove();
		var position = $(word_div).position();
		var the_left;
		$(word_div).after('<div id="glossaryTooltip"><div class="g_shadow"><div class="g_content"><div class="screen-reader">Definition for '+$(word_div).text()+'</div>'+glossary_element.def+'<div class="screen-reader">End Definition</div></div></div></div>');
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
				GlossaryJS.timer = setTimeout("$('#glossaryTooltip').remove()",1000);
			}).focus();
	}
}

$(document).ready(function() {
	GlossaryJS.initialize();
});