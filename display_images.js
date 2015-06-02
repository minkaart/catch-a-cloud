/**jQuery library? to animate images in a continuous (infinite) loop - scrolling left across a page

TO DO: 
- write function to set divs to appropriate css (see clouds.css) checkcss(){}
- allows you to reuse looping() when updating divs after a cloud has been drawn
**/

(function($){
	$(document).ready(function(){
				
	//note: change these globals to objects.
		var win_width = $(window).width(); //holds the width of the browser window
		var img_width = win_width/4;
		var img_height = img_width*0.75;
		var img_margin = 0; 
		var rows = 0; //number of rows to display images
		var div1_width = 0; //holds width of first animated series (gap fill)
		var div2_width = 0; //holds width of second animated series - remaining images
		var ani1_duration = 0; //holds animation length in seconds*1000 (for millisec)
		var ani2_duration = 0;
		var ani_interval = 0; //holds the animation duration for looping (Timeout)
		var ani1_width = 0; // twice window width (first animation travel distance)
		var ani2_width = 0;
		var px_rate = 120; //# pixels the animation should travel per second


		//holds the images to be displayed	
		var imageArray = [];
		var containerArray = [];
		var holdingContainer = "#images";
		var imageArray_ready = false;
		var imageObjects = [];
		var in_page = 0; 
		var update_needed = false; 
		var ani_running = false;	

pageload();

		function pageload(){

			popimageArray(function(){
				console.log("imageArray_ready: "+imageArray_ready);
				if(imageArray_ready){
					calculaterows(img_height);
					initiatepage(containerArray, imageObjects);
					in_page = imageArray.length;
				});

	/**		var start_timer = setTimeout(function(){
				console.log("imageArray_ready: "+imageArray_ready);
				if(imageArray_ready){
					calculaterows(img_height);
					initiatepage(containerArray, imageObjects);
					in_page = imageArray.length;
				};
			}, 100);
		}**/

		function update(){
			imageArray = [];
			imageArray_ready = false;
			imageObjects = [];
			containerArray = [];
			in_page = 0; 
			$(".images").empty();
			$("#images").empty();

			popimageArray();

			var start_timer = setTimeout(function(){
				if(imageArray_ready){
					calculaterows(img_height);
					populatedivs(containerArray, imageObjects);
					in_page = imageArray.length;

					for (var i = 0; i < containerArray.length; i+=2) {
						update_vars(containerArray[i], containerArray[i+1]);
						$(containerArray[i]).css("left", "0");
						//console.log("animating 1");
						$(containerArray[i]).animate({left : ["-="+win_width, "linear"]},
							{
							queue: true,
							duration: ani1_duration/2,
							complete: function(){
								reset_div(containerArray[i]);
								console.log("reset div "+containerArray[i]+" to "+win_width);
							}
						});
						console.log("animating 2");
						ani_running = true;
						animatediv2(containerArray[i], containerArray[i+1]);
						$("#start_button").hide();
						$("#stop_button").show();
						update_needed = false;

					};

				};
			}, 100);
			
			 
		}


		function initiatepage(containerlist, imagelist) {
			populatedivs(containerlist, imagelist);

			for (var i = 0; i < containerlist.length; i+=2) {
				apply_animations(containerlist[i], containerlist[i+1]);
			};
			
		}	

		//splits content divs into short(fill divs) and long and then populates them with imagecontent from imageObjects 
		function populatedivs(containerlist, imagelist){
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
					looping(shorts[i], imagelist);
					shortcontent++;
				};
				widthcheck = checkwidth(shorts[end]);
			} while (widthcheck)		
			
			var lengthdiff = imagelist.length - shortcontent;

			for (var i = 0; i < lengthdiff; i++) {
				$.each(longs, function(index, val){
					looping(longs[index], imagelist);
				});
			};
			var longwidth = checkwidth(longs[longs.length-1]);
			if(longwidth){
				do{
					for (var i = 0; i < longs.length; i++) {
						looping(longs[i], imagelist);
					};
					longwidth = checkwidth(longs[longs.length-1]);
				}while(longwidth)
			};

			//$(".images figure").css("margin-right", image_margin);

			//add check for longs at least winwidth here
		}

		//function dynamically populates imageObjects based on image JSON file based on files in "images" folder and displays the images scrolling - to only display the images and manually populate imageObject, use initiatepage() alone with imageObject
		function popimageArray(callback){
			console.log("populating images");
			$.getJSON("get_images.php").done(function(data){
				console.log(data);
				$.each(data, function(key, val){
					console.log(key+":"+val);
					var imageObject = {
						"image_ref" : "https://euroclouds.s3.amazonaws.com/"+key,
						"obj_text" : val
					};
					console.log("image_ref: "+imageObject.image_ref);
					console.log("object_text: "+imageObject.obj_text);
					imageObjects.push(imageObject);
					imageArray.push(key);	
				});		
				//make this a callback instead!
				callback(); 
				imageArray_ready = true;
				console.log("popimageArray complete!");		
			});
		}

		//calculates the #of rows needed based on window height and creates a list (array) of divs required to fill given height
		function calculaterows (imageheight){
			var win_height = $(window).height(); 
			var rows = win_height/imageheight>>0;
			var divs = rows*2;
			for (var i = 0; i < divs; i+=2) {
					containerArray.push("#images"+i);
					$(holdingContainer).append('<div id="images'+i+'" class="images"></div>');
					
					containerArray.push("#images"+(i+1));
					$(holdingContainer).append('<div id="images'+(i+1)+'" class="images"></div>');
					
					//update CSS for divs
					var top = imageheight * (i/2);
					var target1 = "#images"+i; 
					var target2 = "#images"+(i+1);
					$(target1).css("top", top);
					$(target2).css("top", top);
			};
		}

		//checks if new images have appeared on server, creates new imageArray of new images
		function checkforupdate(){
			var images_in_file = 0;

			$.get("check.php", function(data){
					//note -3 for Mac OS file system.... change to two for linux or do other checking method
					images_in_file = data; 
					images_ready = true; 
					if(images_in_file > in_page){
						update_needed = true; 
					};
			});
		}

		//stops animations 
		function stopanimation(containerlist){
			$(".images").stop();
			ani_running = false;
			for (var i = 0; i < containerlist.length; i++) {
				if(i%2 == 0){
					$(containerlist[i]).css("left", "0");
				}
				else{
					$(containerlist[i]).css("left", win_width);
				};
			};
			$("#stop_button").hide();
			$("#start_button").show();
		}

		//appends an image to any given target div
		function imagedisplay(targetdiv, image, text) {
			$(targetdiv).append('<figure><img width="'+img_width+'" src="'+image+'"><figcaption>'+text+'</figcaption></figure>');
		}

		//loops through imageArray and appends each image to a given target div - maintains first un-used image at position [0] in the array
		//to use: targetdiv is the id value "#somediv" && imagelist is an array of images to be appended to the div "imageArray" 
		function looping(targetdiv, imagelist){
			var newobject = imagelist[0];
			var newimage = newobject.image_ref;
			var newtext = newobject.obj_text; 
			imagelist.shift();
			imagelist.push(newobject);
			imagedisplay(targetdiv, newimage, newtext);
		}

		//checks if the width of an image-populated div is greater than the width of the window 
		function checkwidth(targetdiv){
			console.log(targetdiv);
			var imgcount = $(targetdiv + ' figure').length;
			if ((imgcount * img_width) < (win_width-img_width)){
				return true;
			}
			else {
				var diff = win_width - (imgcount*img_width);
				image_margin = diff/imgcount; 
				return false;
			}
		}

		//function to update width and animation duration variables	
		//NOTE: Consider moving animation duration vars out of here 
		function update_vars(div1, div2){
			div1_width = $(div1).width(); //should be just < or = win_width -- verify possible removal
			div2_width = $(div2).width();
			win_width = $(window).width();
					
			//first animation calculations
			ani1_width = win_width*2; //first animation travel distance
			ani1_duration = (ani1_width/px_rate)*2000; 

			//second animation calculations
			ani2_width = div2_width+win_width;
			ani2_duration = (ani2_width/px_rate)*2000; 
		}

		//sets the "left" property of the target div to reset location 
		function reset_div (targetdiv){
			targetdiv = $(targetdiv);
			targetdiv.css("left", win_width);
		}

		function apply_animations(div1, div2){
			console.log("applying animations to: "+div1+" & "+div2);
			update_vars(div1, div2);
			animatediv1(div1, div2);
		}

		function animatediv1(target1, target2){
			ani_running = true;
			update_vars(target1, target2);
			var div1_first_run = true; 
			$(target1).animate({left : ["-="+ani1_width, "linear"]},
				{
				queue: true,
				duration: ani1_duration,
					step: function(value_left){
						if(value_left < 1){
							if(div1_first_run){
								div1_first_run = false;
								animatediv2(target1, target2);	
								console.log("animating target 2");
							};
						};
					},
					complete: function(){
						reset_div(target1);
						checkforupdate();
						div1_first_run = true; 
					}
				});
		}

		function animatediv2(target1, target2){
			var div2_first_run = true; 
			var goal_left = win_width - div2_width;
			console.log("div 2: "+div2_width);
			$(target2).animate({left : ["-="+ani2_width, "linear"]},
				{
				queue: true,
				duration: ani2_duration, 
					step: function(target_left){
						if(target_left < goal_left){
							if(div2_first_run){
								div2_first_run = false;
								animatediv1(target1, target2);
								console.log("animating target 1");
							};
						};
					},	
					complete: function(){
						if(update_needed){
							console.log("update detected");
							stopanimation(containerArray);
							update();
						}
						else {
							reset_div(target2);
							div2_first_run = true; 
						};
						
					}
				});
			
		}

		$(window).focusout(function(){
			if (ani_running) {
				stopanimation(containerArray);
			};
		});

		$(window).focusin(function(){
			if (!ani_running) {
				update();
			};	
		});

		$("#stop_button").click(function(){
			if (ani_running) {
				stopanimation(containerArray);
			};
		});

		$("#start_button").click(function(){
			if (!ani_running) {
				update();
			};
		});
	});
}(jQuery));				
