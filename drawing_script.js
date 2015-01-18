(function($){
	$(window).load(function(){
	//canvas variables
	var canvas = $("#my_canvas").get(0);
	var j_canvas = $("#my_canvas");
	var ctx = canvas.getContext('2d');

	//AJAX variables
	var imageData; 
	var imageText; 

	//position variables
	var off = j_canvas.offset();
	//vars hold current and previous mouse positions
	var mouse = {"x":0, "y":0};
	var last_mouse = {"x":0, "y":0};

	//drawing parameter variable/object
	var drawing_params = {
		'lineWidth': "5",
		'lineJoin': 'round',
		'lineCap': 'round',
		'strokeStyle': 'blue', 
		'globalCompositeOperation': 'source-over'
	};
	
	//dynamically sets the height and width of canvas based on window size
	function set_width(){
		var width = $("#canvas_holder").width();
		canvas.width = width;
	}

	function set_height(){
		var height = $("#canvas_holder").height();
		canvas.height = height;
	};
	
	//sets drawing parameters
	function set_drawing_params(params, context){
		console.log("setting drawing params for "+context);
		var ctx = context; 
		$.each(params, function(key, value){
			console.log(key + ":" + value);
			ctx[key] = value;
		})

	}

	//pt1 (start) & pt2 (end) should be points, held as arrays of x,y coordinates : context should be a reference to the context of an html5 canvas element
	function draw_line(pt1, pt2, context){
		var ctx = context;
		console.log("drawing line in"+context+" from "+pt1+" to "+pt2)
		ctx.beginPath();
		ctx.moveTo(pt1.x, pt1.y);
		ctx.lineTo(pt2.x, pt2.y);
		ctx.stroke();

	}

	
	set_width();
	set_height();
	set_drawing_params(drawing_params, ctx);

	j_canvas.mousedown(function(event){
		var off = j_canvas.offset();
		last_mouse.x = (event.pageX - off.left);
		last_mouse.y = (event.pageY - off.top);
		j_canvas.mousemove(function(event){
			mouse.x = (event.pageX - off.left);
			mouse.y = (event.pageY- off.top);
			draw_line(last_mouse, mouse, ctx);
			console.log("the cursor was at: "+last_mouse.x+","+last_mouse.y);
			last_mouse.x = mouse.x;
			last_mouse.y = mouse.y;
			console.log("the cursor is now at: "+mouse.x+","+mouse.y);
		});
		$(document).mouseup(function(){
		j_canvas.unbind("mousemove");
	});
	});

	$('#eraser').click(function(){
		drawing_params.globalCompositeOperation = 'destination-out';
		set_drawing_params(drawing_params, ctx);
	});

	$('#pencil').click(function(){
		drawing_params.globalCompositeOperation = 'source-over';
		set_drawing_params(drawing_params, ctx); 
	});

	$("#save").click(function(){
		imageData = canvas.toDataURL("image/png");
		console.log(imageData);
		$.ajax({
			type : "POST",
			contentType: "application/x-www-form-urlencoded",
			url: "sandbox.php",
			data: {img : imageData}, 
		}).done(function(o){
			console.log("Data Sent!");
		})
	})
});
})(jQuery);