
$(document).ready(function () {
    loadData();
});


function loadData() {
    //code for Q1 goes here
    d3.csv("data/data.csv", function (d) {
        data = d;
        data.forEach(function (item) {
            item.n = parseInt(item.n);
        });

        //visualizeColorProperty();
        //visualizeColorWheel();
        //visualizeColorHarmony();
    });

}

// function visualizeColorProperty() {
//     var margin = { top: 10, right: 20, bottom: 20, left: 30 },
//         height = 400 - margin.top - margin.bottom;

//     var svg = d3.select('#color-property').append('svg')
//         .attr('width', "100%")
//         .attr('height', height)
//         .append('g')

//     svg.append("rect")
//         .attr("height", height)
//         .attr("width", "50%")
//         .attr("fill", BLUE)

//     svg.append("rect")
//         .attr("x", "50%")
//         .attr("id", "prop-rect")
//         .attr("height", height)
//         .attr("width", "50%")
//         .attr("fill", BLUE)

//     svg.append("text")
//         .attr("id", "prop-label")
//         .attr("x", "50%")
//         .attr("y", height / 2)
//         .text(function () {
//             for (var i = 0; i < data.length; i++)
//                 if (data[i].concept == "Hue")
//                     return "Hue: " + data[i].description;
//         })
//         .style('fill', 'white')
//         .style("text-anchor", "middle")
//         .style("font-size", 16)

//     $(".color-prop h6").hover(
//         function () {
//             var des;
//             var color;
//             var now = $(this).text();
//             for (var i = 0; i < data.length; i++) {
//                 var ele = data[i];
//                 if (ele.concept == now) {
//                     des = ele.description;
//                     color = ele.property;
//                 }
//             }

//             $(this).css("text-decoration", "underline");
//             d3.select("#prop-rect")
//                 .transition()
//                 .attr("fill", color)
//                 .duration(600);
//             d3.select("#prop-label").text(now + ": " + des)
//         }, function () {
//             $(this).find("span:last").remove();
//             $(this).css("text-decoration", "none");
//         }
//     );
// }

// function setDefaultWheelIntro() {
//     d3.select("#wheel-title").text("Color Wheel").call(wrap)
//     d3.select("#wheel-label")
//         .text("A color wheel or colour circle is an abstract illustrative organization of color hues around a circle, which shows the relationships between primary colors, secondary colors, tertiary colors etc").call(wrap)
// }

// function updateWheelIntro() {
//     var title, intro;
//     for (var i = 0; i < data.length; i++) {
//         if (data[i].concept == selected) {
//             title = selected;
//             intro = data[i].description;
//         }
//     }
//     d3.select("#wheel-title").text(title).call(wrap)
//     d3.select("#wheel-label").text(intro).call(wrap)
// }

// function visualizeColorWheel() {
//     var margin = { top: 10, right: 20, bottom: 20, left: 30 },
//         width = 500;
//     var outer_size = width / 2 - 10;
//     var inner_size = outer_size - 50;
//     var count = 12;

//     // draw wheel
//     var svg = d3.select('#color-wheel').append('svg')
//         .attr('width', width)
//         .attr('height', width)
//         .append('g')
//         .attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')');

//     var arc = d3.arc()
//         .outerRadius(outer_size)
//         .innerRadius(inner_size)
//         .startAngle(0)
//         .endAngle((2 * Math.PI) / count);

//     svg.append('g')
//         .selectAll('path').data(WHEEL_COLOR)
//         .enter()
//         .append('path')
//         .attr('fill', function (d) {
//             return d3.color(d)
//         })
//         .attr('id', function (d, i) { return 'arc' + i; })
//         .attr('class', 'arc')
//         .attr('transform', function (d, i) {
//             return 'rotate(' + (i * (360 / count)) + ')'
//         })
//         .attr('d', arc())

//     svg.append("text")
//         .attr("id", "wheel-title")
//         .attr("x", 0)
//         .attr("y", -50)
//         .attr("class", "wrapme")
//         .attr("width", 250)
//         .text("Color Wheel")
//         .style('fill', 'white')
//         .style("text-anchor", "middle")
//         .style("font-size", 20)
//         .call(wrap)

//     svg.append("text")
//         .attr("id", "wheel-label")
//         .attr("x", 0)
//         .attr("y", -30)
//         .attr("class", "wrapme")
//         .attr("width", 250)
//         .text("A color wheel or colour circle is an abstract illustrative organization of color hues around a circle, which shows the relationships between primary colors, secondary colors, tertiary colors etc")
//         .style('fill', 'white')
//         .style("text-anchor", "middle")
//         .style("font-size", 16)
//         .call(wrap)



//     // listen to wheel controllers

//     $(".color-whe h6").hover(
//         function () {
//             var highlights = [];
//             var selected = $(this).text();

//             if (selected == "All")
//                 return;

//             for (var i = 0; i < data.length; i++) {
//                 var ele = data[i];
//                 if (ele.concept == selected) {
//                     des = ele.description;
//                     highlights = ele.property.split("*");
//                 }
//             }

//             $(this).css("text-decoration", "underline");

//             var fade_arcs = arcs.filter(function (num) {
//                 return !highlights.includes(num.toString());
//             })

//             fade_arcs.forEach(function (num) {
//                 d3.select("#arc" + num)
//                     .transition()
//                     .attr("opacity", 0.1)
//                     .duration(600);
//             })

//             var title, intro;
//             for (var i = 0; i < data.length; i++) {
//                 if (data[i].concept == selected) {
//                     title = selected;
//                     intro = data[i].description;
//                 }
//             }
//             d3.select("#wheel-title").text(title).call(wrap)
//             d3.select("#wheel-label").text(intro).call(wrap)

//         }, function () {
//             $(this).css("text-decoration", "none");

//             arcs.forEach(function (num) {
//                 d3.select("#arc" + num)
//                     .transition()
//                     .attr("opacity", 1)
//                     .duration(600);
//             })

//             setDefaultWheelIntro()
//         }
//     );

//     var selected,
//         selectedId;
//     $('.arc').hover(
//         function () {
//             var now = this.id;
//             var highlights;

//             if (now.includes("2") || now.includes("6") || now.includes("10")) {
//                 highlights = [2, 6, 10];
//                 selected = "Secondary Colors";
//                 selectedId = "sec";
//             }
//             else if (now.includes("4") || now.includes("0") || now.includes("8")) {
//                 highlights = [0, 4, 8];
//                 selected = "Primary Colors";
//                 selectedId = "prim";
//             } else {
//                 highlights = [1, 3, 5, 7, 9, 11];
//                 selected = "Tertiary Colors";
//                 selectedId = "tert";
//             }

//             d3.select('#' + selectedId + " h6").style("text-decoration", "underline");

//             var fade_arcs = arcs.filter(function (num) {
//                 return !highlights.includes(num);
//             })

//             fade_arcs.forEach(function (num) {
//                 d3.select("#arc" + num)
//                     .transition()
//                     .attr("opacity", 0.1)
//                     .duration(600);
//             })

//             var title, intro;
//             for (var i = 0; i < data.length; i++) {
//                 if (data[i].concept == selected) {
//                     title = selected;
//                     intro = data[i].description;
//                 }
//             }
//             d3.select("#wheel-title").text(title).call(wrap)
//             d3.select("#wheel-label").text(intro).call(wrap)
//         }, function () {
//             $(this).css("text-decoration", "none");

//             d3.select('#' + selectedId + " h6").style("text-decoration", "none");

//             arcs.forEach(function (num) {
//                 d3.select("#arc" + num)
//                     .transition()
//                     .attr("opacity", 1)
//                     .duration(600);
//             })

//             setDefaultWheelIntro()
//         }
//     )
// }

// function visualizeColorHarmony() {
//     setupCanvas()
//     update();
// }


// function setupCanvas() {
//     var margin = { top: 10, right: 20, bottom: 20, left: 30 },
//         width = 500;
//     var outer_size = width / 2 - 10;
//     var inner_size = outer_size - 50;
//     var count = 12;

//     var svg = d3.select('#color-harmony').append('svg')
//         .attr('width', width)
//         .attr('height', width)
//         .append('g')
//         .attr('transform', 'translate(' + (width / 2) + ',' + (width / 2) + ')');

//     var arc = d3.arc()
//         .outerRadius(outer_size)
//         .innerRadius(inner_size)
//         .startAngle(0)
//         .endAngle((2 * Math.PI) / count);

//     svg.append('g')
//         .selectAll('path').data(WHEEL_COLOR)
//         .enter()
//         .append('path')
//         .attr('fill', function (d) {
//             return d3.color(d)
//         })
//         .attr('id', function (d, i) { return 'harc' + i; })
//         .attr('class', 'harc')
//         .attr('transform', function (d, i) {
//             return 'rotate(' + (i * (360 / count)) + ')'
//         })
//         .attr('d', arc())

//     // mono line
//     svg.append('line')
//         .style('stroke', 'white')
//         .attr('id', 'mono_line')
//         .attr('x1', -130)
//         .attr('y1', -130)
//         .attr('x2', 0)
//         .attr('y2', 0)
//         .attr('opacity', 0)
//         .attr('class', 'temp')

//     // complementary line
//     svg.append('line')
//         .style('stroke', 'white')
//         .attr('id', 'comp_line')
//         .attr('x1', -130)
//         .attr('y1', -130)
//         .attr('x2', 130)
//         .attr('y2', 130)
//         .attr('opacity', 0)
//         .attr('class', 'temp')


//     // split complementary
//     var split_line_data = [{ 'x': -130, 'y': -130 }, { 'x': 53, 'y': 179 }, { 'x': 178, 'y': 50 }, { 'x': -130, 'y': -130 }];
//     var lineFunction = d3.line()
//         .x(function (d) { return d.x; })
//         .y(function (d) { return d.y; })

//     svg.append("path")
//         .attr("d", lineFunction(split_line_data))
//         .attr('id', 'split_comp_line')
//         .attr('class', 'temp')
//         .attr("stroke", "white")
//         .attr("stroke-width", 1)
//         .attr("fill", "none")
//         .attr("opacity", 0)

//     // double complementary
//     svg.append('line')
//         .style('stroke', 'white')
//         .attr('id', 'double_line')
//         .attr('x1', -130)
//         .attr('y1', -130)
//         .attr('x2', 130)
//         .attr('y2', 130)
//         .attr('opacity', 0)
//         .attr('class', 'temp')

//     // Triad
//     var triad_line_data = [{ 'x': -130, 'y': -130 }, { 'x': 176, 'y': -50 }, { 'x': -46, 'y': 178 }, { 'x': -130, 'y': -130 }];
//     var lineFunction = d3.line()
//         .x(function (d) { return d.x; })
//         .y(function (d) { return d.y; })

//     svg.append("path")
//         .attr("d", lineFunction(triad_line_data))
//         .attr('id', 'triad_line')
//         .attr('class', 'temp')
//         .attr("stroke", "white")
//         .attr("stroke-width", 1)
//         .attr("fill", "none")
//         .attr("opacity", 0)

//     // analougus
//     var ana_line_data = [{ 'x': 0, 'y': 0 }, { 'x': 178, 'y': 49 }, { 'x': 0, 'y': 0 }, { 'x': 130, 'y': 130 }, { 'x': 0, 'y': 0 }, { 'x': 55, 'y': 178 }];

//     var lineFunction = d3.line()
//         .x(function (d) { return d.x; })
//         .y(function (d) { return d.y; })

//     svg.append("path")
//         .attr("d", lineFunction(ana_line_data))
//         .attr('id', 'ana_line')
//         .attr('class', 'temp')
//         .attr("stroke", "white")
//         .attr("stroke-width", 1)
//         .attr("fill", "none")
//         .attr("opacity", 0)

//     //intro
//     svg.append("text")
//         .attr("id", "harmony-title")
//         .attr("x", 0)
//         .attr("y", -60)
//         .attr("class", "wrapme")
//         .attr("width", 250)
//         .style('fill', 'white')
//         .style("font-size", 20)
//         .style('text-align', 'center')
//         .style("text-anchor", "middle")
//         .text("Color Harmony")
//         .call(wrap)

//     svg.append("text")
//         .attr("id", "harmony-label")
//         .attr("x", 0)
//         .attr("y", -30)
//         .attr("class", "wrapme")
//         .attr("width", 250)
//         .text("In color theory, color harmony refers to the property that certain aesthetically pleasing color combinations have. These combinations create pleasing contrasts and consonances that are said to be harmonious.")
//         .style('fill', 'white')
//         .style("text-anchor", "middle")
//         .style("font-size", 16)
//         .call(wrap)
// }

// function update() {
//     $(".harc").hover(
//         function () {
//             if (condition == null) {
//                 return;
//             }
//             console.log("update")
//             var selected = this.id;
//             var selectedId = parseInt(selected.substring(4, selected.length));
//             var highlights = [];

//             // monochromatic
//             if (condition == "mono") {
//                 highlights = [selectedId];
//                 var angle = (selectedId + 2) * 30;
//                 d3.select("#mono_line").attr('opacity', 1).attr("transform", "rotate(" + angle + ")");
//             }
//             // complementary
//             else if (condition == "comp") {
//                 if (selectedId < 6) {
//                     highlights = [selectedId, selectedId + 6]
//                 } else {
//                     highlights = [selectedId, selectedId - 6]
//                 }

//                 var angle = (selectedId + 2) * 30;
//                 d3.select("#comp_line").attr('opacity', 1).attr("transform", "rotate(" + angle + ")");
//                 // split complmentary
//             } else if (condition == "split_com") {
//                 if (selectedId < 5) {
//                     highlights = [selectedId, selectedId + 5, selectedId + 7]
//                 } else if (selectedId < 7) {
//                     highlights = [selectedId, selectedId + 5, selectedId - 5]
//                 } else {
//                     highlights = [selectedId, selectedId - 7, selectedId - 5]
//                 }
//                 var angle = (selectedId + 2) * 30;
//                 d3.select("#split_comp_line").attr('opacity', 1).attr("transform", "rotate(" + angle + ",0,0)");
//                 // double complementary
//             } else if (condition == "double") {
//                 if (selectedId < 4) {
//                     highlights = [selectedId, selectedId + 2, selectedId + 6, selectedId + 8]
//                 } else if (selectedId < 6) {
//                     highlights = [selectedId, selectedId + 2, selectedId + 6, selectedId - 4]
//                 } else if (selectedId < 10) {
//                     highlights = [selectedId, selectedId + 2, selectedId - 6, selectedId - 4]
//                 }
//                 else {
//                     highlights = [selectedId, selectedId - 10, selectedId - 6, selectedId - 4]
//                 }
//                 var angle = (selectedId + 2) * 30;
//                 var split_angle = angle + 2 * 30;
//                 d3.select("#comp_line").attr('opacity', 1).attr("transform", "rotate(" + angle + ")");
//                 d3.select("#double_line").attr('opacity', 1).attr("transform", "rotate(" + split_angle + ")");
//             }
//             // triad
//             else if (condition == "triad") {
//                 if (selectedId < 4) {
//                     highlights = [selectedId, selectedId + 4, selectedId + 8]
//                 } else if (selectedId < 8) {
//                     highlights = [selectedId, selectedId + 4, selectedId - 4]
//                 } else {
//                     highlights = [selectedId, selectedId - 8, selectedId - 4]
//                 }

//                 var angle = (selectedId + 2) * 30;
//                 d3.select("#triad_line").attr('opacity', 1).attr("transform", "rotate(" + angle + ")");
//             }
//             // analougues 
//             else if (condition == "ana") {
//                 if (selectedId == 0) {
//                     highlights = [0, 1, 11]
//                 } else if (selectedId == 11) {
//                     highlights = [0, 10, 11]
//                 } else {
//                     highlights = [selectedId, selectedId + 1, selectedId - 1]
//                 }
//                 var angle = (selectedId - 4) * 30;
//                 d3.select("#ana_line").attr('opacity', 1).attr("transform", "rotate(" + angle + ")");
//             }


//             var fade_arcs = arcs.filter(function (num) {
//                 return !highlights.includes(num);
//             })

//             fade_arcs.forEach(function (num) {
//                 d3.select("#harc" + num)
//                     .transition()
//                     .attr("opacity", 0.1)
//                     .duration(600);
//             })

//             d3.select("#harmony-title").text("");
//             d3.select("#harmony-label").text("");
//         },
//         function () {
//             if (condition == null)
//                 return;
//             d3.selectAll(".temp").attr("opacity", "0");
//             arcs.forEach(function (num) {
//                 d3.select("#harc" + num)
//                     .transition()
//                     .attr("opacity", 1)
//                     .duration(600);
//             })
//             updateHarmonyIntro();
//         }
//     )
// }

// function resetHarmonyIntro() {
//     // reset intro
//     d3.select("#harmony-title").text("Color harmony")
//     d3.select("#harmony-label")
//         .text("In color theory, color harmony refers to the property that certain aesthetically pleasing color combinations have. These combinations create pleasing contrasts and consonances that are said to be harmonious.").call(wrap)
// }

// function updateHarmonyIntro() {
//     var title, intro;
//     for (var i = 0; i < data.length; i++) {
//         if (data[i].code == condition) {
//             title = data[i].concept;
//             intro = data[i].description;
//         }
//     }

//     // update introduction
//     d3.select("#harmony-title")
//         .text(title).call(wrap)
//     d3.select("#harmony-label")
//         .text(intro).call(wrap)
// }

// function changeCondition(obj) {
//     if (obj.value == condition) {
//         d3.select("#" + condition).attr("opacity", "0").property('checked', false);
//         condition = null;
//         resetHarmonyIntro()
//         return;
//     }

//     if (condition != null) {
//         d3.select("#" + condition).attr("opacity", "0").property('checked', false);
//         condition = null;
//         resetHarmonyIntro()
//     }

//     condition = obj.value;
//     updateHarmonyIntro();

// }

// // reference: https://codepen.io/goodforenergy/pen/XgNWpR
// function wrap(text) {
//     text.each(function () {
//         var text = d3.select(this);
//         var words = text.text().split(/\s+/).reverse();
//         var lineHeight = 20;
//         var width = parseFloat(text.attr('width'));
//         var y = parseFloat(text.attr('y'));
//         var x = text.attr('x');
//         var anchor = text.attr('text-anchor');

//         var tspan = text.text(null).append('tspan').attr('x', x).attr('y', y).attr('text-anchor', anchor);
//         var lineNumber = 0;
//         var line = [];
//         var word = words.pop();

//         while (word) {
//             line.push(word);
//             tspan.text(line.join(' '));
//             if (tspan.node().getComputedTextLength() > width) {
//                 lineNumber += 1;
//                 line.pop();
//                 tspan.text(line.join(' '));
//                 line = [word];
//                 tspan = text.append('tspan').attr('x', x).attr('y', y + lineNumber * lineHeight).attr('anchor', anchor).text(word);
//             }
//             word = words.pop();
//         }
//     });
// }

