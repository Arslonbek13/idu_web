/*!
 * liScroll 1.0
 * Examples and documentation at:
 * http://www.gcmingati.net/wordpress/wp-content/lab/jquery/newsticker/jq-liscroll/scrollanimate.html
 * 2007-2010 Gian Carlo Mingati
 * Version: 1.0.2.1 (22-APRIL-2011)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 * Requires:
 * jQuery v1.2.x or later
 *
 */


jQuery.fn.liScroll = function(settings) {
		settings = jQuery.extend({
		travelocity: 0.07
		}, settings);
		return this.each(function(){
				let $strip = jQuery(this);
				$strip.addClass("newsticker")
				let stripWidth = 1;
				$strip.find("li").each(function(i){
				stripWidth += jQuery(this, i).outerWidth(true); // thanks to Michael Haszprunar and Fabien Volpi
				});
				const $mask = $strip.wrap("<div class='mask'></div>");
				const $tickercontainer = $strip.parent().wrap("<div class='tickercontainer'></div>");
				const containerWidth = $strip.parent().parent().width();	//a.k.a. 'mask' width
				$strip.width(stripWidth);
				const totalTravel = stripWidth;
				const defTiming = totalTravel/settings.travelocity;	// thanks to Scott Waye
				function scrollnews(spazio, tempo){
				$strip.animate({left: '-='+ spazio}, tempo, "linear", function(){$strip.css("left", containerWidth); scrollnews(totalTravel, defTiming);});
				}
				scrollnews(totalTravel, defTiming);
				$strip.hover(function(){
				jQuery(this).stop();
				},
				function(){
				const offset = jQuery(this).offset();
				const residualSpace = offset.left + stripWidth;
				const residualTime = residualSpace/settings.travelocity;
				scrollnews(residualSpace, residualTime);
				});
		});
};