/**jQuery library to animate images in a continuous (infinite) loop - scrolling left across a page

TO DO: 
- write function to set divs to appropriate css (see clouds.css) checkcss(){}
- allows you to reuse looping() when updating divs after a cloud has been drawn
- find a way to evenly disperse images within the target div margin-auto? http://stackoverflow.com/questions/7245018/how-to-evenly-distribute-elements-in-a-div-next-to-each-other use table-display  
**/

(function($){
	$(function() {
			$().ready(function(){
				
	//note: change these globals to objects.
		var win_width = $(window).width(); //holds the width of the browser window
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
		var in_page = 0; 
		var update_needed = false; 
		var ani_2_running = false;
		
popimageArray();

var start_timer = setTimeout(function(){
	if(imageArray_ready){
		calculaterows(400);
		initiatepage(containerArray, imageArray);
		in_page = imageArray.length;
		console.log(in_page);
		//imageArray_ready = false;
		clearTimeout(start_timer);
	};
}, 100);


var update_timer = setInterval(function(){
	console.log("checking...");
	checkforupdate();
}, 1000);

		function initiatepage(containerlist, imagelist) {
			console.log("initiating page");
			populatedivs(containerlist, imagelist);

			for (var i = 0; i < containerlist.length; i+=2) {
				console.log("initiating animations");
				console.log("containerlist at i: "+containerlist[i]);
				console.log("containerlist at i+1 "+containerlist[i+1]);
				apply_animations(containerlist[i], containerlist[i+1]);
			};
			
		}	

		//splits content divs into short(fill divs) and long and then populates them with imagecontent from imageArray 
		function populatedivs(containerlist, imagelist){
			console.log("populating divs");
			var shorts = [];
			var longs = []; 

			$.each(containerlist, function(i, val){
				console.log("containerlist total: "+containerlist);
				if(i%2 == 0){
					shorts.push(val);
					console.log("pushing "+val+" to shorts");
					$(val).css("left", 0);
				}
				else{
					longs.push(val);
					console.log("pushing "+val+" to longs");
					reset_div(val);
				};
				console.log(shorts[0]);
				console.log(longs[0]);
			});
			
			var end = shorts.length - 1;
			console.log("end of shorts: "+end);
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
		}

		//function dynamically populates imageArray based on files in "images" folder and displays the images scrolling - to only display the images and manually populate imageArray, use initiatepage()
		function popimageArray(){
			console.log("populating image array");
			$.getJSON("get_images.php", function(data){
				for (var i = 3; i < data.length; i++) {
						//write in validation from file-system? possibly
						console.log("writing: "+data[i]);
						imageArray[i-3] = "images/"+data[i]; 
					};						
					imageArray_ready = true;
					alert("data received!");	
					console.log("1st image: "+imageArray[0]);		
			});
			console.log("imageArray length"+imageArray.length);
		}

		//calculates the #of rows needed based on window height and creates a list (array) of divs required to fill given height
		function calculaterows (imageheight){
			var win_height = $(window).height(); 
			console.log("window height = "+win_height);
			var rows = win_height/imageheight;
			var divs = rows*2;
			for (var i = 0; i < divs; i+=2) {
					containerArray.push("#images"+i);
					$(holdingContainer).append('<div id="images'+i+'" class="images"></div>');
					
					containerArray.push("#images"+(i+1));
					$(holdingContainer).append('<div id="images'+(i+1)+'" class="images"></div>');
					
					//update CSS for divs
					var top = imageheight * (i/2);
					console.log("top is now: "+top);
					var target1 = "#images"+i; 
					var target2 = "#images"+(i+1);
					$(target1).css("top", top);
					$(target2).css("top", top);
					

					console.log(containerArray[i]);
					console.log($(holdingContainer).children());
				};
		}

		//checks if new images have appeared on server, creates new imageArray of new images
		function checkforupdate(){
			var images_in_file = 0;

			$.getJSON("get_images.php", function(data){
					//note -3 for Mac OS file system.... change to two for linux or do other checking method
					images_in_file = data.length - 3; 
					images_ready = true; 
					if(images_in_file > in_page){
						update_needed = true; 
					};
			});
			
		}

		//must be called before populating divs with new images
		//stops animations and returns current values as left: and width: 
		function stopanimation(targetdiv){
			targetdiv = $(targetdiv);
			targetdiv.stop(); 
			var offset = targetdiv.offset();
		}

		//appends an image to any given target div
		function imagedisplay(targetdiv, image) {
			$(targetdiv).append('<img src="'+image+'">');
		}

		//loops through imageArray and appends each image to a given target div - maintains first un-used image at position [0] in the array
		//to use: targetdiv is the id value "#somediv" && imagelist is an array of images to be appended to the div "imageArray" 
		function looping(targetdiv, imagelist){
			var newvalue = imagelist[0];
			imagelist.shift();
			imagelist.push(newvalue);
			imagedisplay(targetdiv, newvalue);
		}

		//checks if the width of an image-populated div is greater than the width of the window 
		function checkwidth(targetdiv){
			var imgcount = $(targetdiv + ' img').length;
			if ((imgcount * 200) < (win_width-199)){
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
			console.log("div 1 width = "+div1_width);
			div2_width = $(div2).width();
			console.log("div 2 width = "+div2_width);
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
							};
						};
					},
					complete: function(){
						reset_div(target1);
						div1_first_run = true; 
					}
				});
		}

		function animatediv2(target1, target2){
			var div2_first_run = true; 
			var goal_left = win_width - div2_width;
			ani_2_running = true; 
			$(target2).animate({left : ["-="+ani2_width, "linear"]},
				{
				queue: true,
				duration: ani2_duration, 
					step: function(target_left){
						if(target_left < goal_left){
							if(div2_first_run){
								div2_first_run = false;
								animatediv1(target1, target2);
							};
						};
					},	
					complete: function(){
						if(update_needed){
							location.reload();
						}
						else {
							reset_div(target2);
							div2_first_run = true; 
						};
						
					}
				});
			
		}

			});
});
}(jQuery));				
