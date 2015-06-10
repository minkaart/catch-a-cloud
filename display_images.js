/**jQuery library? to animate images in a continuous (infinite) loop - scrolling left across a page

**/

(function($){
	$(document).ready(function(){
		var img_width = 0; //holds the width of the image (initiated in calculaterows())		
		var rows = 0; //number of rows to display images
		var div1_width = 0; //holds width of first animated series (gap fill)
		var div2_width = 0; //holds width of second animated series - remaining images
		var ani1_duration = 0; //holds animation length in seconds*1000 (for millisec)
		var ani2_duration = 0;
		var ani_interval = 0; //holds the animation duration for looping (Timeout)
		var ani1_width = 0; // twice window width (first animation travel distance)
		var ani2_width = 0;
		var px_rate = 100; //# pixels the animation should travel per second

		var start_val = 1; //holds the number of php requests sent to server for loading more images
		var more_images = false; //true/false for whether more (historic) images still exist on the server
		var on_server = 0; //remembers number of images on server in last server call

		//holds the images to be displayed	
		//var imageArray = [];
		var containerArray = [];
		var holdingContainer = "#images";
		var imageObjects = [];
		var update_needed = false; 
		var ani_running = 0;	


		//determines whether population is an update or an initial pageload based on update value (passed) and calls respective functions accordingly - either populates divs anew or appends new data to existing divs. 
		function load_route(){
			var update; 

			if(imageObjects.length > 0){
				update = true; 
			}
			else {
				update = false; 
			}

			if (update){

				console.log("updating");
				update_needed = false; 
				imageObjects.length = 0;
				console.log("clear image objects: "+imageObjects);
				containerArray.length = 0;
				$(".images").empty();
				$("#images").empty();

				popimageArray(function(){
					calculaterows();
					populatedivs(containerArray, imageObjects, function (){
						for (var i =0; i< containerArray.length; i+=2){
							update_vars(containerArray[i], containerArray[i+1]);
							$(containerArray[i]).css("left", "0px");
							animatediv1(containerArray[i], containerArray[i+1], $(window).width());
						}
						$("#start_button").hide();
						$(".stop_pause").show();

					});
				});	
			}
			else
			{
				console.log("initiating");
				popimageArray(function(){
					calculaterows();
					initiatepage(containerArray, imageObjects);
				});	
				$("#start_button").hide();
				$(".stop_pause").show();
			}
		}

		function initiatepage(containerlist, imagelist) {
			more_images = false;
			start_val = 1;
		
			populatedivs(containerlist, imagelist);

			for (var i = 0; i < containerlist.length; i+=2) {
				apply_animations(containerlist[i], containerlist[i+1]);
			};
			
		}	

		/**splits content divs into short(fill divs)
		 and long and then populates them with imagecontent from imagelist **/
		function populatedivs(containerlist, imagelist, callback){
			var shorts = [];
			var longs = []; 

			$.each(containerlist, function(i, val){
				if(i%2 == 0){
					shorts.push(val);
					reset_div(val);
				}
				else{
					longs.push(val);
					reset_div(val);
				};
			});
			
			var end = shorts.length - 1;
			var widthcheck = checkwidth(shorts[end]);

			var shortcontent = 0;
			do{
				for (var i = 0; i < shorts.length; i++) {
					looping_image_display(shorts[i], imagelist);
					shortcontent++;
				};
				widthcheck = checkwidth(shorts[end]);
			} while (widthcheck)		
			
			var lengthdiff = imagelist.length - shortcontent;

			for (var i = 0; i < lengthdiff; i++) {
				$.each(longs, function(index, val){
					looping_image_display(longs[index], imagelist);
				});
			};
			var longwidth = checkwidth(longs[longs.length-1]);
			if(longwidth){
				do{
					for (var i = 0; i < longs.length; i++) {
						looping_image_display(longs[i], imagelist);
					};
					longwidth = checkwidth(longs[longs.length-1]);
				}while(longwidth)
			};

			if(callback){
				if (typeof callback === "function"){
					callback();
				}
				else {
					console.log("type error"+callback+"is not a function");
				}
			}
		}


		function popimageArray(callback){
			//console.log("calling get_images...");
			console.log("start is: "+start_val);
			$.getJSON("get_images.php", 'start='+start_val, function(data){
				console.log("data 1-30: "+data.first_30);
				console.log(data.error);
				on_server = data.total;
				console.log(data.total);
				console.log(data.more);
				more_images = data.more;
				if (more_images){
					$("#load_more").show();
				}
				else {
					$("#load_more").hide();
				}
				var image_json = $.parseJSON(data.first_30);
				$.each(image_json, function(key, val){
					var imageObject = {
						"image_ref" : "https://euroclouds.s3.amazonaws.com/"+key,
						"obj_text" : val
					};

					imageObjects.push(imageObject);
					//imageArray.push(key);	
				});		

				if(callback){
					if (typeof callback === "function"){
						callback();
					}
					else {
						console.log("type error"+callback+"is not a function");
					}
				}		
			});
		}

		/**calculates the #of rows needed based on window height and creates a 
		list (array) of divs required to fill given height. 
		(note: the total divs are *2 for short (ani-fill) and long divs). 
		Change variables for image size (height and width) here.
		As img_height and width are set here -- creates square image containers and forces two rows
		in landscape and 1 in portrait
		RETURNS IMAGE WIDTH as calculated based on height variables**/ 
		function calculaterows (){
			var win_width = $(window).width(); //holds the width of the browser window
			var win_height = $(window).height()*.7; 
			var rows = 0;
			
			if ($(window).height() > $(window).width()){ //change here and below to change image size
				img_width = $(window).width();
			} else {
				img_width = win_height/2; 
			}
			
			var img_height = img_width; //and change here 
			rows = win_height/img_height>>0;

			var divs = rows*2;
			var diff = win_height - img_height*rows;

			console.log("rows: "+rows);
			//creates container divs for images
			for (var i = 0; i < divs; i+=2) {
					containerArray.push("#images"+i);
					$(holdingContainer).append('<div id="images'+i+'" class="images"></div>');
					
					containerArray.push("#images"+(i+1));
					$(holdingContainer).append('<div id="images'+(i+1)+'" class="images"></div>');
					
					//update CSS top to properly place divs in window
					if (i > 1){
						var top = ((i/2)*image_height);	
					} else {
						var top = 0;
					}
					
					var target1 = "#images"+i; 
					var target2 = "#images"+(i+1);
					$(target1).css("top", top);
					$(target2).css("top", top);
			};

		}

		//checks if new images have appeared on server
		function checkforupdate(){
			console.log("checking for update");
			var images_in_file = 0;

			$.get("check.php", function(data){
					images_in_file = data; 
					console.log("image number previous: "+on_server);
					console.log("image number current: "+images_in_file);
					if(images_in_file > on_server){
						update_needed = true; 
					};
			});
		}

		//stops animations 
		function stopanimation(containerlist, imagelist){
			//stop animation, clear current images, 
			$(".images").stop(true);
			console.log("stopped");
			ani_running = 0; 
			$(".images").empty();
			console.log("emptied");
			$(".stop_pause").hide();
			$("#start_button").show();

			$("#images").css({
				"height" : "65%",
				"overflow-x" : "auto",
				"overflow-y" : "hidden"
			});
			
			console.log(imagelist);

			//move shorts to left : 0
			for(var i=0; i < containerlist.length; i+=2){
				$(containerlist[i]).css(
				"left","0px");
			}

			//populate shorts with all content?
			for (var j=0; j< imagelist.length; j++){
				console.log("image list length: ");
				for (var i=0; i<containerlist.length; i+=2){
					//console.log("containerlist[i]: "+containerlist[i]);
					looping_image_display(containerlist[i], imagelist);
				}
			}

			
			
			//add listener for start button? 
			$("#start_button").click(function(){
				console.log("running embedded start");
				for(var i=0; i < containerlist.length; i+=2){
					$(containerlist[i]).css(
						"left","");
				}
				$("#images").scrollLeft(0);
				$("#images").css({
						"height" : "",
						"overflow" : ""
					});
				$("#images").empty();
				load_route();
				$("#start_button").hide();
				$(".stop_pause").show();
				$("#start_button").off("click");
			});
			
		}

		function pauseanimation(containerlist){
			if (ani_running === 0){
				console.log("error: animation was not running");
				return ; 
			}

			//stop animation 
			$(".images").stop(true);
			
			//adjust display
			$(".stop_pause").hide();
			$("#start_button").show();
			$(".launch").off("click", launch);

			//check for ani_running at 1, 2, or 3
			if(ani_running%2 !== 0 && ani_running !== 0){ //if ani_running is 1 or 3 and not 0
				// calculate new target/ani_distance for 1 based on left
				var left = parseInt($(containerlist[0]).css("left"));
				var travelled = $(window).width() - left; 
				var remaining = $(window).width()*2 - travelled; 
				/**console.log("travelled: "+travelled+
					"remaining: "+remaining+"left: "+left);**/

				//start handler
				//if 1, call 1 || if 3, call 1
				$("#start_button").click(function(){
					for(i= 0; i < containerlist.length; i+=2){
						//console.log("calling animation 1 on "+containerlist[i]);
						animatediv1(containerlist[i], containerlist[i+1], remaining);
					}
				});

			} else if (ani_running === 2) {
				// calculate new target/ani_distance for 2 based on left 
				var left = parseInt($(containerlist[1]).css("left"));
				var travelled = $(window).width() - left; 
				var remaining = ($(containerlist[1]).width()+$(window).width()) - travelled; 
				/**console.log("travelled: "+travelled+
					"remaining: "+remaining+"left: "+left);**/

				//if 2, call 2
				$("#start_button").click(function(){
					for(i= 0; i < containerlist.length; i+=2){
						//console.log("calling animation 2 on "+containerlist[i]);
						animatediv2(containerlist[i], containerlist[i+1], remaining);
					}
				});
		
			} else {
				console.log("error: ani_running undefined or invalid: ani_running: "+ani_running);
			}


			$("#start_button").click(function(){
				//console.log("calling reset start functions");
				$(".stop_pause").show();
				$("#start_button").hide();
				$("#start_button").off("click");
				//considering overflow on paused animation ... will require back-filling divs 
				/**$("#images").css({
				"height" : $(window).height()-50+"px",
				"overflow" : "auto"
				});**/
			});
		}


		/** adjusts given array to maintain target image in position [0]
			appends target image to target div 
			note: passed imagelist must be an array of IMAGE OBJECTS not IMAGES!!**/
		function looping_image_display(targetdiv, imagelist){
			var newobject = imagelist[0];
			var newimage = newobject.image_ref;
			//console.log("newimage: "+newimage);
			var newtext = newobject.obj_text; 
			imagelist.shift();
			imagelist.push(newobject);
			$(targetdiv).append('<figure><img width="'+img_width+'" src="'+newimage+'"><figcaption>'+newtext+'</figcaption></figure>');				

		}

		//checks if the width of an image-populated div is greater than the width of the window 
		function checkwidth(targetdiv){
			var imgcount = $(targetdiv + ' figure').length;
			if ((imgcount * img_width) < ($(window).width()-img_width)){
				return true;
			}
			else {
				return false;
			}
		}

		//function to update width and animation duration variables	
		//NOTE: Consider moving animation duration vars out of here 
		function update_vars(div1, div2){
			div1_width = $(div1).width(); //should be just < or = win_width -- verify possible removal
			div2_width = $(div2).width();
			//win_width = $(window).width();
					
			//first animation calculations
			ani1_width = $(window).width()*2; //first animation travel distance
			//ani1_duration = (ani1_width/px_rate)*2000; 

			//second animation calculations
			ani2_width = div2_width+$(window).width();
			//ani2_duration = (ani2_width/px_rate)*2000; 
		}

		//sets the "left" property of the target div to reset location 
		function reset_div (targetdiv){
			targetdiv = $(targetdiv);
			targetdiv.css("left", $(window).width());
		}

		function apply_animations(div1, div2){
			console.log("applying animations to: "+div1+" & "+div2);
			update_vars(div1, div2);
			animatediv1(div1, div2, $(window).width()*2);
		}

		function animatediv1(target1, target2, ani_width){
			ani_running = 1;
			update_vars(target1, target2);
			var div1_first_run = true; 
			$(target1).animate({left : ["-="+ani_width, "linear"]},
				{
				queue: true,
				duration: (ani_width/px_rate)*2000,
					step: function(value_left){
						if(value_left < 1){
							if(div1_first_run){
								div1_first_run = false;
								animatediv2(target1, target2, $(target2).width()+$(window).width());	
								ani_running = 3; 
								console.log("animating target 2");
							};
						};
					},
					complete: function(){
						ani_running = 2;
						reset_div(target1);
						checkforupdate();
						div1_first_run = true; 
					}
				});
		}

		function animatediv2(target1, target2, ani_width){
			var div2_first_run = true; 
			var goal_left = $(window).width() - $(target2).width();
			console.log("div 2: "+div2_width);
			$(target2).animate({left : ["-="+ani_width, "linear"]},
				{
				queue: true,
				duration: (ani_width/px_rate)*2000, 
					step: function(target_left){
						if(target_left < goal_left){
							if(div2_first_run){
								div2_first_run = false;
								animatediv1(target1, target2, $(window).width()*2);
								console.log("animating target 1");
							};
						};
					},	
					complete: function(){
						console.log("detecting update?...");
						if(update_needed){
							console.log("update detected");
							//stopanimation(containerArray, imageObjects);
							load_route();
						}
						else {
							reset_div(target2);
							div2_first_run = true; 
						};
						
					}
				});
			
		}

/**EVENT HANDLING**/

		//Home view entry functions//

		var launch = function(){
			load_route();
		};

		$(".launch").on("click", launch);

		$("#text_input").submit(function(){
			load_route();
		});

		//other event functions
		$(".add, .about").click(function(){
			pauseanimation(containerArray);
		});

		//$(window).on("focusout", pause);

		

		$(window).resize(function(){
		console.log(ani_running);
		if(ani_running !== 0){
			if(ani_running === 1){
				for (i=1; i<containerArray.length; i+=2){
					$(containerArray[i]).css("left", $(window).width());
				}
			} else if(ani_running === 2){
				for (i=0; i<containerArray.length; i+=2){
					$(containerArray[i]).css("left", $(window).width());
				}
			}
		}
		update_needed = true;
		});

		$("#stop_button").click(function(){
			stopanimation(containerArray, imageObjects);
		});

		$("#pause_button").click(function(){
			pauseanimation(containerArray);
		});

		$("#load_more").click(function(){
			start_val++;
			load_route();
		});

		$(document).on("click", ".images figure img", function(){
			//console.log("click registered");
			//console.log($(this).attr('src'));
			//console.log($(this).parent().children('figcaption').text());
			$("#single_image").show();
			var img_src = $(this).attr('src');
			var img_text = $(this).parent().children('figcaption').text();
			
			$("#single_image_content").html('<figure><img src="'+img_src+'"><figcaption>'+img_text+'</figcaption></figure>');
		});

	});
}(jQuery));				
