(function($){
	$(document).ready(function(){
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
		var ctx = context; 
		$.each(params, function(key, value){
			ctx[key] = value;
		})

	}

	//pt1 (start) & pt2 (end) should be points, held as arrays of x,y coordinates : context should be a reference to the context of an html5 canvas element
	function draw_line(pt1, pt2, context){
		var ctx = context;
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
			last_mouse.x = mouse.x;
			last_mouse.y = mouse.y;
		});
		$(document).mouseup(function(){
		j_canvas.unbind("mousemove");
	});
	});

	//mobile - touchscreen
	/**j_canvas.on('touchstart', function(event){
		event.preventDefault();
		var off = j_canvas.offset();
		last_mouse.x = (event.pageX - off.left);
		last_mouse.y = (event.pageY - off.top);
		j_canvas.on('touchmove', function(event){
			event.preventDefault();
			mouse.x = (event.pageX - off.left);
			mouse.y = (event.pageY- off.top);
			draw_line(last_mouse, mouse, ctx);
			last_mouse.x = mouse.x;
			last_mouse.y = mouse.y;
		});
		$(document).on('touchend', function(event){
			event.preventDefault();
			j_canvas.unbind("touchmove");
		});
	});**/

	$('#eraser').click(function(){
		drawing_params.globalCompositeOperation = 'destination-out';
		set_drawing_params(drawing_params, ctx);
	});

	$('#pencil').click(function(){
		drawing_params.globalCompositeOperation = 'source-over';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#bold').click(function(){
		drawing_params.lineWidth = '10';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#thin').click(function(){
		drawing_params.lineWidth = '5';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#black').click(function(){
		drawing_params.strokeStyle = 'black';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#white').click(function(){
		drawing_params.strokeStyle = 'white';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#yellow').click(function(){
		drawing_params.strokeStyle = 'yellow';
		set_drawing_params(drawing_params, ctx); 
	});
	
	$('#green').click(function(){
		drawing_params.strokeStyle = 'green';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#blue').click(function(){
		drawing_params.strokeStyle = 'blue';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#red').click(function(){
		drawing_params.strokeStyle = 'red';
		set_drawing_params(drawing_params, ctx); 
	});

	$('#reset').click(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height); 
	});

	$("#save").click(function(){
		imageData = canvas.toDataURL("image/png");
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#draw").hide();
		$("#text_form").show();
		$("#tool_menu").hide();
	});

	$("#text_input").submit(function(event){
		var user_text = $('#user_text').val();
		event.preventDefault();
		$.ajax({
			type : "POST",
			contentType: "application/x-www-form-urlencoded",
			url: "saveimage.php",
			data: {
				img : imageData,
				text : user_text
			}, 
		}).done(function(o){
			$("#text_form").hide();
		});
	});

	$("#canvas_close").click(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#tool_menu").hide();
	});

	$(window).resize(function(){
		set_width();
		set_height();
	});

});
})(jQuery);