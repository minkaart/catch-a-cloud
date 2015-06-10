(function($){
	$(document).ready(function(){

		//GIT HUB GIST TO NORMALIZE TOUCH/MOUSE ACTIONS//

	/* == GLOBAL DECLERATIONS == */
    TouchMouseEvent = {
        DOWN: "touchmousedown",
        UP: "touchmouseup",
        MOVE: "touchmousemove"
    }
   
    /* == EVENT LISTENERS == */
    var onMouseEvent = function(event) {
        var type;
        
        switch (event.type) {
            case "mousedown": type = TouchMouseEvent.DOWN; break;
            case "mouseup":   type = TouchMouseEvent.UP;   break;
            case "mousemove": type = TouchMouseEvent.MOVE; break;
            default: 
                return;
        }
        
        var touchMouseEvent = normalizeEvent(type, event, event.pageX, event.pageY);      
        $(event.target).trigger(touchMouseEvent); 
    }
    
    var onTouchEvent = function(event) {
        var type;
        
        switch (event.type) {
            case "touchstart": type = TouchMouseEvent.DOWN; break;
            case "touchend":   type = TouchMouseEvent.UP;   break;
            case "touchmove":  type = TouchMouseEvent.MOVE; break;
            default: 
                return;
        }
        
        var touch = event.originalEvent.touches[0];
        var touchMouseEvent;
        
        if (type == TouchMouseEvent.UP) 
            touchMouseEvent = normalizeEvent(type, event, null, null);
        else 
            touchMouseEvent = normalizeEvent(type, event, touch.pageX, touch.pageY);
        
        $(event.target).trigger(touchMouseEvent); 
    }
    
    /* == NORMALIZE == */
    var normalizeEvent = function(type, original, x, y) {
        return $.Event(type, {
            pageX: x,
            pageY: y,
            originalEvent: original
        });
    }
    
    /* == LISTEN TO ORIGINAL EVENT == */
    var jQueryDocument = $(document);
   
    if ("ontouchstart" in window) {
        jQueryDocument.on("touchstart", onTouchEvent);
        jQueryDocument.on("touchmove", onTouchEvent);
        jQueryDocument.on("touchend", onTouchEvent); 
    } else {
        jQueryDocument.on("mousedown", onMouseEvent);
        jQueryDocument.on("mouseup", onMouseEvent);
        jQueryDocument.on("mousemove", onMouseEvent);
    }

    		//* == END GIT HUB GIST == *//

    		//DRAWING SCRIPT BEGIN//

    //VARIABLES//

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
		'lineWidth': "8",
		'lineJoin': 'round',
		'lineCap': 'round',
		'strokeStyle': 'blue', 
		'globalCompositeOperation': 'source-over'
	};   

    //FUNCTIONS//
	
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
		});

	}

	//pt1 (start) & pt2 (end) should be points, held as arrays of x,y coordinates : context should be a reference to the context of an html5 canvas element
	function draw_line(pt1, pt2, context){
		var ctx = context;
		ctx.beginPath();
		ctx.moveTo(pt1.x, pt1.y);
		ctx.lineTo(pt2.x, pt2.y);
		ctx.stroke();

	}

	//PAGE INITIALIZATION && EVENT HANDLERS//
	set_drawing_params(drawing_params, ctx);
	set_width();
	set_height();
	$('#pencil').addClass("selected_tool");
	$("#thin").addClass("selected_weight");
	$("#blue").addClass("selected_color");

	j_canvas.on('touchmousedown', function(event){
		var off = j_canvas.offset();
		last_mouse.x = (event.pageX - off.left);
		last_mouse.y = (event.pageY - off.top);
		j_canvas.on('touchmousemove', function(event){
			mouse.x = (event.pageX - off.left);
			mouse.y = (event.pageY- off.top);
			draw_line(last_mouse, mouse, ctx);
			last_mouse.x = mouse.x;
			last_mouse.y = mouse.y;
		});
		$(document).on('touchmouseup',function(){
			j_canvas.unbind("touchmousemove");
		});
	});

	
	$('#eraser').click(function(){
		drawing_params.globalCompositeOperation = 'destination-out';
		set_drawing_params(drawing_params, ctx);
		$('#pencil').removeClass("selected_tool");
		$('#eraser').addClass("selected_tool");
	});

	$('#pencil').click(function(){
		drawing_params.globalCompositeOperation = 'source-over';
		set_drawing_params(drawing_params, ctx); 
		$('#eraser').removeClass("selected_tool");
		$('#pencil').addClass("selected_tool");
	});

	$('#bold').click(function(){
		drawing_params.lineWidth = '15';
		set_drawing_params(drawing_params, ctx); 
		$('#thin').removeClass("selected_weight");
		$('#bold').addClass("selected_weight");
	});

	$('#thin').click(function(){
		drawing_params.lineWidth = '8';
		set_drawing_params(drawing_params, ctx); 
		$('#bold').removeClass("selected_weight");
		$('#thin').addClass("selected_weight");
	});

	$('#black').click(function(){
		drawing_params.strokeStyle = 'black';
		set_drawing_params(drawing_params, ctx); 
		$(".selected_color").removeClass("selected_color");
		$("#black").addClass("selected_color");
	});

	$('#white').click(function(){
		drawing_params.strokeStyle = 'white';
		set_drawing_params(drawing_params, ctx); 
		$(".selected_color").removeClass("selected_color");
		$("#white").addClass("selected_color");
	});

	$('#yellow').click(function(){
		drawing_params.strokeStyle = 'yellow';
		set_drawing_params(drawing_params, ctx); 
		$(".selected_color").removeClass("selected_color");
		$("#yellow").addClass("selected_color");
	});
	
	$('#green').click(function(){
		drawing_params.strokeStyle = 'green';
		set_drawing_params(drawing_params, ctx); 
		$(".selected_color").removeClass("selected_color");
		$("#green").addClass("selected_color");
	});

	$('#blue').click(function(){
		drawing_params.strokeStyle = 'blue';
		set_drawing_params(drawing_params, ctx); 
		$(".selected_color").removeClass("selected_color");
		$("#blue").addClass("selected_color");
	});

	$('#red').click(function(){
		drawing_params.strokeStyle = 'red';
		set_drawing_params(drawing_params, ctx); 
		$(".selected_color").removeClass("selected_color");
		$("#red").addClass("selected_color");
	});

	$('#reset').click(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height); 
	});

	$("#save").click(function(){
		imageData = canvas.toDataURL("image/png");
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$(".add_text_view").show();
		$(".add_view").hide();
	});

	$("#canvas_close").click(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	});

	$("#no").click(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
	});

	//TEXT INPUT FORM HANDLERS//

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
			$("#user_text").val('');
		});
	});

	$("#text_close").click(function(){
		ctx.clearRect(0,0,canvas.width,canvas.height);
		$("#user_text").val('');
	});

	$(window).resize(function(){
		set_width();
		set_height();
	});

});
})(jQuery);