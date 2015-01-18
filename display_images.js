/**jQuery library to animate images in a continuous (infinite) loop - scrolling left across a page
--needs imageArray to be set !! <NOTE TO ME> create a php function to set the imageArray put a set function in here? maybe

TO DO: 
- deal with imageArray
- write function to set divs to appropriate css (see clouds.css) checkcss(){}
- change looping() to take an Array as an argument (allows you to reuse looping() when updating divs after a cloud has been drawn)
- find a way to evenly disperse images within the target div margin-auto? http://stackoverflow.com/questions/7245018/how-to-evenly-distribute-elements-in-a-div-next-to-each-other use table-display 
- change population of second div logic (initiate page) to fully populate the length of the imageArray minus what was already loaded in the first div 
--- will need to change the speed of movement calculator to ensure that the speed remains the constant from teh first to the second div
**/

(function($){
	$(
		function() {	

			$().ready(function(){	
				var win_width = $(window).width(); //holds the width of the browser window
				var div1_width = 0; //holds width of first animated series (gap fill)
				var div2_width = 0; //holds width of second animated series - remaining images
				var ani1_duration = 0; //holds animation length in seconds*1000 (for millisec)
				var ani2_duration = 0;
				var ani1_width = 0; // twice window width (first animation travel distance)
				var ani2_width = 0;
				var first_run = true; //checks whether animation is running for the first time
				var px_rate = 120; //# pixels the animation should travel per second

				var imageArray = [];
				imageArray[0] = "other/other3.jpg";
				imageArray[1] = "other/other5.jpg";
				imageArray[2] = "other/other7.jpg";
				imageArray[3] = "other/other10.jpg";
				imageArray[4] = "other/other11.jpg";	

				//appends an image to any given target div
				//NOTE: add imageArray as a passed value to increase functionality - appends image from the first position in any given array of images
				function imagedisplay(targetdiv) {
					$(targetdiv).append('<img src="'+imageArray[0]+'">');
				}

				//loops through imageArray and appends each image to a given target div - maintains first un-used image at position [0] in the array
				//NOTE: make imageArray a passed value in order to apply dynamically. 
				function looping(targetdiv){
						var newvalue = imageArray[0];
						imageArray.shift();
						imageArray.push(newvalue);
						imagedisplay(targetdiv);
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
					div1_width = $(div1).width(); //should be just < or = win_width
					div2_width = $(div2).width();
					win_width = $(window).width();
					
					//first animation calculations
					ani1_width = win_width*2; //first animation travel distance
					ani1_duration = (ani1_width/px_rate)*2000; 

					//second animation calculations
					ani2_width = div2_width+win_width;
					ani2_duration = (ani2_width/px_rate)*2000;
				}

				function reset_div (targetdiv){
					targetdiv = $(targetdiv);
					targetdiv.css("left", win_width);
				}

				function apply_animations(div1, div2){
					update_vars(div1, div2);
					animations(div1, div2);
				}

				function animations (div1, div2){
					var target1 = $(div1); 
					var target2 = $(div2);
					target1.animate({
						left : ["-="+ani1_width, "linear"]
					}, ani1_duration, function()
						{reset_div(div1);
						}); 
					if (first_run){
					target2.delay(ani1_duration/2).animate({
							left : ["-="+ani2_width, "linear"]
						}, ani2_duration, function()
							{reset_div(div2);
						});
						first_run = false; 
					} 
					else {
					target2.animate({
							left : ["-="+ani2_width, "linear"]
						}, ani2_duration, function()
							{reset_div(div2);
							});
					}
				}

				function initiatepage(content1, content2){
					reset_div(content1);
					reset_div(content2);
					var widthcheck = checkwidth(content1);

					do {
						looping(content1);
						widthcheck = checkwidth(content1);
					} while (widthcheck == true)

					var widthcheck2 = checkwidth(content2);
				
					do {
						looping(content2);
						widthcheck2 = checkwidth(content2);
					} while (widthcheck2 == true)

					//update_vars();
					setInterval(function(){
						apply_animations(content1, content2);}
						, 0);
					
					}
				
				
				initiatepage("#images1", "#images2");	
});
	});
}(jQuery));				
