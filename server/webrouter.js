var express = require('express');
var router = express.Router();
var request = require('request');
var util = require('util');
var cheerio = require('cheerio');


var _root = 'http://www.avtb66.com/tag/%E5%9B%BD%E4%BA%A7/%s/'
var _base = 'http://www.avtb66.com';

router.get('/',function(req,res,next){
	var page = req.query.page||3;
	var url = util.format(_root,page);
	console.log(url);
	getAllVideo(url,function(err,video){
		var data = {
			video:video,
			page:page
		};

		res.render('index',data);
	});

});


router.get('/video/:id/:query',function(req,res,next){
	var id = req.params.id;
	var query = req.params.query;

	var url = util.format('%s/%s/%s',_base,id,encodeURIComponent(query));

	getVideo(url,function(err,video){
		res.render('search',{video:video});
	});
	
});


function getAllVideo(url,cb){
	request(url,function(err,req,body){
		var $ = cheerio.load(body);
		
		var $video = $('.video > a');
		var page_info = [];

		for(var i in $video){

			try{
			var href = $($video[i]).attr('href');

			var image = $($video[i]).find('.video-thumb img').attr('src');
			}catch(e){
				console.log(e);
				continue;
			}

			
			if(!href||!image){
				continue;
			}

			page_info.push({
				href:'/video'+href,
				image:image
			});
		}

		cb(null,page_info);
	});
}

function getVideo(url,cb){
	
	console.log(url);

	request(url,function(err,req,body){
		if (err) {
			console.log(err);
			return ;
		}
		var $ = cheerio.load(body);

		var $video = $('video');
		var $source = $('video').find('source');
		var src = $($source).attr('src');
		var poster = $video.attr('poster');
		
		cb(null,{
			src:src,
			poster:poster
		});

	});
};

module.exports = router;