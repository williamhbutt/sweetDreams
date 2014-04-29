'use strict';

// TODO filtering
// - concept of secondary details

var d3 = window.d3;

var width = 960,
    height = 500;

var svg = d3.select('body').append('svg')
    .attr('width', width)
    .attr('height', height);

var force = d3.layout.force()
    //.linkDistance(100)
    .linkStrength(0.1) // more elastic links
    .friction(0.5)
    .charge(-100)
    .chargeDistance(500)
    .gravity(0.01)
    .size([width, height]);

var color = d3.scale.category20();

// keywords Array:
// array of objects {keyword, occurances, date[]}
var keywords = [];

// edges Array:
// array of obkects {source, target}
var edges = [];


/*********************************************************
 * Data Parsing
 *********************************************************/

// TODO deal with multiple dates for a keyword
var parseDreamsForKeywords = function(dreamObjectArray) {
    var keywordObjs = [];
    dreamObjectArray.forEach( function(dream) {
        // if the keyword does not already exist in the array,
        // add it, else augment its occurences property

        dream.keywords.forEach( function (keywordInDream) {
            var keywordAlreadyExists = false;

            keywordObjs.forEach( function(existingKeywordObj) {
                // keyword already exists
                if (existingKeywordObj.keyword === keywordInDream) {
                    existingKeywordObj.occurances++;
                    existingKeywordObj.dates.push(dream.date);
                    keywordAlreadyExists = true;
                }
            });

            // keyword not already in array
            if (!keywordAlreadyExists) {
                var newKeyWordObj = {'keyword': keywordInDream,
                    'occurances': 1,
                    'dates': [dream.date]};
                keywordObjs.push(newKeyWordObj);
            }
        });
    });
    return keywordObjs;
};

// TODO add weights to edges based on how many times they are connected
// if 2 keywords occured on the same date, they are connected
var parseDreamsForEdges = function(keywordArray) {
    var edges = [];
    keywordArray.forEach ( function (keywordObj1, index1) {
        if (keywordObj1.occurances > 1) {
            console.log(keywordObj1.keyword);
        }
        keywordObj1.dates.forEach ( function (date1) {
            keywordArray.forEach ( function (keywordObj2, index2) {
                keywordObj2.dates.forEach ( function (date2) {
                    if (keywordObj1.keyword !== keywordObj2.keyword) {
                        if (date1 === date2 && keywordObj1.keyword !== keywordObj2.keyword) {
                            var newEdge = {'source': index1, 'target': index2, 'value': 1};
                            edges.push(newEdge);
                        }
                    }
                });
            });
        });
    });
    return edges;
};


/*********************************************************
 * Dynamic Attributes
 *********************************************************/

// TODO make size proportional to area
var nodeSize = function(d) {
    return d.occurances * 10;
};

/*********************************************************
 * Render Graph
 *********************************************************/

d3.json('dreams.json', function(error, dreams) {
    keywords = parseDreamsForKeywords(dreams);
    edges = parseDreamsForEdges(keywords);

    force
        .nodes(keywords)
        .links(edges)
        .start();

    var link = svg.selectAll('.link')
        .data(edges)
        .enter().append('line')
        .attr('class', 'link');

    var node = svg.selectAll('.node')
        .data(keywords)
        .enter().append('circle')
        .attr('class', 'node')
        .attr('r', nodeSize)
        .style('fill', function(d) { return color(d.group); })
        .on('click', function (d) {
            $('h1').html(d.keyword);
        })
        .call(force.drag);

    node.append('title')
        .text(function(d) { return d.keyword; });

    force.on('tick', function() {
        link.attr('x1', function(d) { return d.source.x; })
        .attr('y1', function(d) { return d.source.y; })
        .attr('x2', function(d) { return d.target.x; })
        .attr('y2', function(d) { return d.target.y; });

        node.attr('cx', function(d) { return d.x; })
            .attr('cy', function(d) { return d.y; });
    });
});
