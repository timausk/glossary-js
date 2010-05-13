/*-------------------------------------------
	Glossary-JS version 3.1 
	Michigan State University
	Virtual University Design and Technology
	Creator:  Nathan Lounds
	Project Page: http://code.google.com/p/glossary-js/
	Dependencies:  jquery.js (http://jquery.com)
		auto-highlighting requires jquery.highlight.js (http://bartaz.github.com/sandbox.js/jquery.highlight.html)
		glossary.css
	Copyright (c) 2010 Michigan State University Board of Trustees
	License: http://www.opensource.org/licenses/mit-license.php
--------------------------------------------*/
GlossaryJS_css = window.GlossaryJS_css || "/AngelUploads/Content/RESLIB_MSU_VUDAT/_assoc/_javascript/glossary/glossary.css";
GlossaryJS_txt = window.GlossaryJS_txt || "/AngelUploads/Content/RESLIB_MSU_VUDAT/_assoc/_javascript/glossary/glossary.txt";
GlossaryJS_section = window.GlossaryJS_section || "";  

GlossaryJS_css=window.GlossaryJS_css||"glossary.css";GlossaryJS_txt=window.GlossaryJS_txt||"glossary.txt";GlossaryJS_section=window.GlossaryJS_section||"";GlossaryJS_autohighlight=window.GlossaryJS_autohighlight||false;var GlossaryJS={glossary:new Array(),initialize:function(){if(document.createStyleSheet){document.createStyleSheet(GlossaryJS_css);}else{var newCSS=document.createElement('link');newCSS.rel='stylesheet';newCSS.href=GlossaryJS_css;newCSS.type='text/css';document.getElementsByTagName("head")[0].appendChild(newCSS);}
$(".glossary").each(function(i){var cur=this;cur.className="highlightSpan";});$(".highlightSpan").live("mouseover",function(){GlossaryJS.word=this;clearTimeout(GlossaryJS.timer);GlossaryJS.getDefinition();}).live("mouseout",function(){var the_div=document.getElementById("glossaryTooltip");if(the_div){GlossaryJS.timer=setTimeout("$('#glossaryTooltip').remove()",1000);}}).live("click",function(){var me=this;me.blur();$("#glossaryTooltip").attr("title","click to close");GlossaryJS.word=me;GlossaryJS.getDefinition();});GlossaryJS.loadGlossary();},loadGlossary:function(){$.ajax({type:"GET",url:GlossaryJS_txt,data:"",success:function(str){var the_words=str.split("\n"),counter=0,inarray,the_word_arr
for(i=0;i<the_words.length;i++){inarray=false;the_word_arr=the_words[i].split("|");if(the_word_arr.length<3||(the_word_arr.length==3&&GlossaryJS_section==the_word_arr[1])){if(the_word_arr){if(the_word_arr[0].length>1){for(k=0;k<GlossaryJS.glossary.length;k++){if(the_word_arr[0]===GlossaryJS.glossary[k].word){inarray=true;k=GlossaryJS.glossary.length;}}
if(inarray===false){GlossaryJS.glossary[counter]={};GlossaryJS.glossary[counter].word=the_word_arr[0];if(GlossaryJS_autohighlight===true){$(document.body).highlight(GlossaryJS.glossary[counter].word,{wordsOnly:true,className:'highlightSpan'});}
GlossaryJS.glossary[counter].def="";GlossaryJS.glossary[counter].section="";if(the_word_arr.length==3){GlossaryJS.glossary[counter].section=the_word_arr[1];GlossaryJS.glossary[counter].def=the_word_arr[2];}else if(the_word_arr.length==2){GlossaryJS.glossary[counter].def=the_word_arr[1];}
counter++;}}}}}
var str_output="";var GlossaryUL=document.getElementById("GlossaryJS");if(GlossaryUL){for(i=0;i<=GlossaryJS.glossary.length;i++){if(GlossaryJS.glossary[i]){str_output+="<dt>"+GlossaryJS.glossary[i].word;str_output+="</dt><dd>"+GlossaryJS.glossary[i].def+"</dd>\n";}}
$("#GlossaryJS").html("<dl>"+str_output+"</dl>");}}});},getDefinition:function(){for(i=0;i<GlossaryJS.glossary.length;i++){var the_term=GlossaryJS.word.childNodes[0].nodeValue;if(jQuery.trim(GlossaryJS.glossary[i].word.toUpperCase())==jQuery.trim(the_term.toUpperCase())){GlossaryJS.createGlossaryTooltip(GlossaryJS.word,GlossaryJS.glossary[i]);return true;}}
var tmp_obj={};tmp_obj.def="<span style='color:red;font-weight:bold'>Error:</span> not in glossary";tmp_obj.word=GlossaryJS.word;GlossaryJS.createGlossaryTooltip(GlossaryJS.word,tmp_obj);},createGlossaryTooltip:function(word_div,glossary_element){$("#glossaryTooltip").remove();var position=$(word_div).position();var the_left;$(word_div).after('<div id="glossaryTooltip"><div class="g_shadow"><div class="g_content"><div class="screen-reader">Definition for '+$(word_div).text()+'</div>'+glossary_element.def+'<div class="screen-reader">End Definition</div></div></div></div>');if(position.left>($(document).width()*0.5)){the_left=(position.left-$("#glossaryTooltip").innerWidth())+"px";}else{the_left=(position.left+$(word_div).width())+"px";}
$("#glossaryTooltip").css("left",the_left).css("top",(position.top+$(word_div).height())+"px").click(function(){$(this).remove();}).mouseover(function(){clearTimeout(GlossaryJS.timer);}).mouseout(function(){GlossaryJS.timer=setTimeout("$('#glossaryTooltip').remove()",1000);}).focus();}}
$(document).ready(function(){GlossaryJS.initialize();});