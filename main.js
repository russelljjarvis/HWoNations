


//var dataURL="https://raw.githubuser.accountcontent.com/IsaKiko/D3-visualising-data/gh-pages/code/nations.json"
var dataUrl = "https://raw.githubusercontent.com/IsaKiko/D3-visualising-data/gh-pages/code/nations.json";

d3.json(dataUrl, function(nations){      
		console.log(nations)  


		var filtered_nations = nations.map(function(element){
			return element;
		});

        //var filtered_nations = nations_clone;//Initialise it;
        var chart_area = d3.select("#chart_area");
        var frame = chart_area.append("svg");
        var canvas = frame.append("g");
        var margin = {top: 19.5, right: 19.5, bottom: 19.5, left: 39.5};
        var frame_width = 950;
        var frame_height = 350;
        var canvas_width = frame_width -margin.left - margin.right;
        var canvas_height = frame_height -margin.top - margin.bottom;
        canvas.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


        frame.attr("width", frame_width);
        frame.attr("height", frame_height);	



        var xScale = d3.scale.log();
        xScale.domain([250,1e5]);
        xScale.range([0,canvas_width]);

        var xAxis_generator_function = d3.svg.axis().orient("bottom").scale(xScale);
        canvas.append("g").attr("class","x axis")
           .attr("transform","translate(0,"+canvas_height+")")
           .call(xAxis_generator_function);

        var yScale = d3.scale.linear();
        yScale.domain([10,85]);
        yScale.range([canvas_height,0]);

		var rScale = d3.scale.sqrt();
        rScale.domain([0,5e8]); //hard coded.
		rScale.range([0,40]);
        var region_colour_scale = d3.scale.category20();
        var yAxis_generator_function = d3.svg.axis().orient("left").scale(yScale);
        canvas.append("g").attr("class", "y axis")
	       .call(yAxis_generator_function);


	    var data_canvas = canvas.append("g").attr("class","data_canvas");   
	   
	    var magicaldataboundobject = data_canvas.selectAll(".dot")
	    	.data(nations, function(element){return element.name});
    	function update_graph(){
				var magicaldataboundobject = data_canvas.selectAll(".dot")
				    .data(filtered_nations, function(element){return element.name});

				magicaldataboundobject.enter().append("circle").attr("class","dot")	
				    .attr("cx", function(d) {return xScale(d.income[0]);} )
				    .attr("cy", function(d) {return yScale(d.lifeExpectancy[0]);})
				    .attr("r", function(d) {return rScale(d.population[0]);})
				    .attr("id", function(d) {return d.name})
				    .style("fill", function(d) {return region_colour_scale(d.region)});


                magicaldataboundobject.exit().remove();

                //magicaldataboundobject.transition().ease("linear").duration(200);

				magicaldataboundobject.transition().ease("linear").duration(200)
                	.attr("cx", function(d) { return xScale(d.income[year_idx]); }) // this is how attr knows to work with the data
                	.attr("cy", function(d) { return yScale(d.lifeExpectancy[year_idx]); })
                	.attr("r", function(d) { return rScale(d.population[year_idx]); });



    	}
		var year_idx = parseInt(document.getElementById("year_slider").value)-1950;

		update_graph();
		d3.selectAll(".region_cb").on("change",function(){ //call back within a callback.

    		
    		if (this.checked) {
	    		var type = this.value;
	    		var new_nations = nations.filter(function(element){
	    			return element.region == type;
	    		});
	    		filtered_nations = filtered_nations.concat(new_nations);
    		}

    		else {
	    		var type = this.value;
    			filtered_nations = filtered_nations.filter(function(element){
					return element.region != type; 
    				
    			});
    		}
    	    update_graph();
    	});

    	

    	d3.select("#year_slider").on("input", function () {

    		console.log("listener execs")
		    year_idx = parseInt(this.value) - 1950;
    		update_graph();
		});
});

