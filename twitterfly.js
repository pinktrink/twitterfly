(function($){
	$.fn.twitterfly = function(opts){
		var feedDefaults = {
				hide_linked_tweets : false,
				hide_replies : true,
				link_hashtags : true,
				link_handles : true,
				link_links : false,
				hide_retweets : false
			},
			defaults = {
				loading_html : "Loading tweets...",
				max : 5,
				hashtag_class : "tweet-hashtag",
				link_class : "tweet-link",
				handle_class : "tweet-handle",
				hashtag_new : true,
				link_new : true,
				handle_new : true
			},
			placeholders = {
				image : /\{\{IMAGE\}\}/g,
				tweet : /\{\{TWEET\}\}/g,
				time : /\{\{TIME\}\}/g,
				handle : /\{\{HANDLE\}\}/g,
				tweet_id : /\{\{TWEETID\}\}/g
			},
			tweets = [],
			preouthtml = "",
			outhtml = "",
			days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
			months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
			self = this,
			date;

		opts = $.extend({}, defaults, opts);

		if(opts.feeds.length === 0){
			$.error("At least one feed is required for twitterfly.");

			return;
		}

		if(!opts.tweet_html){
			$.error("Tweet HTML is required for twitterfly.");
		}

		this.html(opts.loading_html);

		for(var i = 0, j = opts.feeds.length; i < j; i++){
			opts.feeds[i] = $.extend({}, feedDefaults, opts.feeds[i]);

			if(!opts.feeds[i].handle){
				$.error("Feed " + i + " has no handle, skipping.");
			}

			(function(){
				var o = i;

				$.getJSON("https://api.twitter.com/1/statuses/user_timeline.json?include_entities=true&include_rts=" + (opts.feeds[i].hide_retweets ? "false" : "true") + "&exclude_replies=" + (opts.feeds[i].hide_replies ? "true" : "false") + "&screen_name=" + opts.feeds[i].handle.replace('@', '') + "&count=" + (opts.max * 2) + "&callback=?", function(data){
					for(var k = 0, l = data.length; k < l; k++){
						if(data[k].entities.urls.length && opts.feeds[o].hide_linked_tweets){
							continue;
						}

						data[k].opts = opts.feeds[o];

						tweets.push(data[k]);
					}

					if(!opts.feeds[o + 1]){
						tweets.sort(function(a, b){
							return ((new Date(b.created_at).getTime()) - (new Date(a.created_at).getTime()));
						});

						for(var k = 0, l = opts.max; k < l; k++){
							date = new Date(tweets[k].created_at);

							preouthtml = opts.tweet_html.replace(placeholders.tweet_id, tweets[k].id).replace(placeholders.time, days[date.getDay()] + ", " + months[date.getMonth()] + " " + date.getDate() + ", " + date.getFullYear()).replace(placeholders.image, tweets[k].user.profile_image_url).replace(placeholders.tweet, tweets[k].text);

							if(tweets[k].opts.link_hashtags){
								for(var m = 0, n = tweets[k].entities.hashtags.length; m < n; m++){
									preouthtml = preouthtml.replace(new RegExp("#" + tweets[k].entities.hashtags[m].text, "g"), '<a class=\"' + opts.hashtag_class + '\" href=\"http://twitter.com/#!/search/%23' + tweets[k].entities.hashtags[m].text + '\" ' + (opts.hashtag_new ? 'target="_blank" ' : "") + ">#" + tweets[k].entities.hashtags[m].text + "</a>");
								}
							}

							if(tweets[k].opts.link_handles){
								for(m = 0, n = tweets[k].entities.user_mentions.length; m < n; m++){
									preouthtml = preouthtml.replace(new RegExp("@" + tweets[k].entities.user_mentions[m].screen_name, "g"), '<a class=\"' + opts.handle_class + '\" href=\"http://twitter.com/#!/' + tweets[k].entities.user_mentions[m].screen_name + '\" ' + (opts.handle_new ? 'target="_blank" ' : "") + "/>@" + tweets[k].entities.user_mentions[m].screen_name + "</a>");
								}
							}

							if(tweets[k].opts.link_links){
								for(m = 0, n = tweets[k].entities.urls.length; m < n; m++){
									preouthtml = preouthtml.replace(new RegExp(tweets[k].entities.urls[m].url, "g"), '<a class=\"' + opts.link_class + '\" href=\"' + tweets[k].entities.urls[m].expanded_url + '\" ' + (opts.link_new ? 'target="_blank" ' : "") + ">" + tweets[k].entities.urls[m].display_url + "</a>");
								}
							}

							outhtml += preouthtml.replace(placeholders.handle, "@" + tweets[k].opts.handle.replace("@", ""));
						}

						self.html(outhtml);
					}
				});
			})();
		}
	};
})(jQuery);
