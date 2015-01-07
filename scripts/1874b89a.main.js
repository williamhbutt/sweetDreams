"use strict";var d3=window.d3,width=960,height=500,svg=d3.select("body").append("svg").attr("class","canvas").attr("width",width).attr("height",height),force=d3.layout.force().linkDistance(100).linkStrength(.1).friction(.5).charge(-200).chargeDistance(500).gravity(.05).size([width,height]),color=d3.scale.category20(),keywords=[],edges=[],dateList=[],parseDreamsForKeywords=function(a){var b=[];return a.forEach(function(a){a.keywords.forEach(function(c){var d=!1;if(b.forEach(function(b){b.keyword===c&&(b.occurances++,b.dates.push(a.date),d=!0)}),!d){var e={keyword:c,occurances:1,dates:[a.date]};b.push(e)}})}),b},parseDreamsForEdges=function(a){var b=[];return a.forEach(function(c,d){c.occurances>1&&console.log(c.keyword),c.dates.forEach(function(e){a.forEach(function(a,f){a.dates.forEach(function(g){if(c.keyword!==a.keyword&&e===g&&c.keyword!==a.keyword){var h={source:d,target:f,value:1};b.push(h)}})})})}),b},nodeSize=function(a){return 10*a.occurances},parseDreamsForDates=function(a){console.log(a);a.forEach(function(a){$("select").append('<option value="'+a.date+'">'+a.date+"</option")})},highlightNeighbors=function(a){svg.selectAll(".node").style("fill",function(b){var c=!1;return b.dates.forEach(function(b){a.dates.forEach(function(a){b===a&&(c=!0)})}),b.keyword===a.keyword?"#FFD700":c?"#000000":color(b.group)})};d3.json("dreams.json",function(a,b){keywords=parseDreamsForKeywords(b),edges=parseDreamsForEdges(keywords),dateList=parseDreamsForDates(b),force.nodes(keywords).links(edges).start();var c=svg.selectAll(".link").data(edges).enter().append("line").attr("class","link"),d=svg.selectAll(".node").data(keywords).enter().append("circle").attr("class","node").attr("r",nodeSize).style("fill",function(a){return color(a.group)}).on("click",function(a){$("h2").html("Selected keyword: "+a.keyword+" occurs in "+a.occurances+" dream(s)"),highlightNeighbors(a)}).call(force.drag);d.append("title").text(function(a){return a.keyword}),force.on("tick",function(){c.attr("x1",function(a){return a.source.x}).attr("y1",function(a){return a.source.y}).attr("x2",function(a){return a.target.x}).attr("y2",function(a){return a.target.y}),d.attr("cx",function(a){return a.x}).attr("cy",function(a){return a.y})}),$("select").change(function(){var a=$("select option:selected").val();"all"===a?($(".node").show(),$(".link").show()):svg.selectAll(".node").style("display",function(b){var c=!1;return b.dates.forEach(function(b){b==a&&(c=!0)}),c?"block":"none"})})});