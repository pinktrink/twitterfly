(function($){
	$.fn.twitterfly = function(opts){
		var feedDefaults = {
				hide_linked_tweets : false,
				hide_replies : true,
				link_hashtags : true,
				link_handles : true,
				hide_retweets : false
			},
			defaults = {
				tweet_html : "",
				loading_html : "Loading tweets...",
				max : 5
			},
			placeholders = {
				image : "{{IMAGE}}",
				tweet : "{{TWEET}}",
				time : "{{TIME}}"
			};

		$.extend(opts, defaults);

		if(opts.feeds.length === 0){
			$.error("At least one feed is required for twitterfly.");

			return;
		}

		if(opts.tweet_html.length === 0){
			$.error("Tweet HTML is required for twitterfly.");
		}

		this.html(opts.loading_html);

		for(var i = 0, j = opts.feeds.length; i < j; i++){
			$.extend(opts.feeds[i], feedDefaults);

			if(!opts.feeds[i].handle){
				$.error("Feed " + i + " has no handle, skipping.");
			}

			
		}
	};
})(jQuery);