// Create Content List
function contentList() {
  $('#documentationArea').find('h1').each(function() {
    var $item = $(this);
    var $id = $(this).attr('id');
    var li = $('<li/>');
    var a = $('<a/>', {text: $item.text(), href: '#' + $id, title: $item.text()});
    a.appendTo(li);
    $('#nav ul').append(li);
  });
}

// SmoothScroll
function smoothScroll() {
  $('a[href^="#"]').click(function() {
    var target = $(this.hash);
    var hash = this.hash;
    if (target.length == 0) target = $('a[name="' + this.hash.substr(1) + '"]');
    if (target.length == 0) target = $('html');
    console.log(target);
    // If the Target element is collapsed; expand it...
    if($(target).hasClass('collapsed')) {
      $(target).nextUntil('h1').slideDown();
      $(target).removeClass('collapsed');
    } 
    // Scroll to the element
    $('html, body').animate({ scrollTop: target.offset().top }, 500, function (){
        location.hash = hash;
    });
  return false;
  });
}

// Collapse H1
function collapseH() {
  $('#documentationArea h1').click(function() {
    $(this).toggleClass('collapsed');
    $(this).nextUntil('h1').slideToggle();
//    $('html, body').animate({
//        scrollTop: $(this).offset().top
//    }, 500);
  });
}

// Target External Links
function TargetExt() {
  $(".sg_doc a[href^='http']").attr("target","_blank").addClass("ext");
}


// Sidebar Button
function sidebarButton() {
  var $button = $('.sg_sidebar_button');

  $button.click(function(e) {
    e.preventDefault();
    $(this).parents('.sg-pusher').toggleClass('show_sidebar');
  });
}

// Maturity Count
function maturityCount() {
  var p = $('.sg_label.planned').length
  var d = $('.sg_label.draft').length
  var r = $('.sg_label.ready').length
  var rt = $('.sg_label.retired').length
  var total = parseInt(p) + parseInt(d) + parseInt(r) + parseInt(rt);
  var pp = 100 / total * p;
  var pd = 100 / total * d;
  var pr = 100 / total * r;
  var prt = 100 / total * rt;  
  if (total > 0) { 
    $('.title').append('<div class="count" title="Current Maturity"><span class="planned" style="width:' + pp + '%"></span><span class="draft" style="width:' + pd + '%"></span><span class="ready" style="width:' + pr + '%"></span><span class="retired" style="width:' + prt + '%"></span></div>');
  }
}

//Functions that run when all HTML is loaded
$(document).ready(function() {
  contentList();
  smoothScroll();
  maturityCount();
  collapseH();
  TargetExt();
  sidebarButton();
});

// Create Apis y Troubleshooting


jQuery(function() {
	var $nav = $('.nav'),
		$main = $('.main');

	var found = true;

	var $el;

	$sidebar.find('a').click(function() {
		$('body').removeClass('nav-open');
	});

	$("section > div.highlighter-rouge:first-of-type").each(function(i) {

		var $this = $(this).before("<ul class=\"languages\"></ul>"),
		$languages = $this.prev(),
		$notFirst = $this.nextUntil(":not(div.highlighter-rouge)"),
		$all = $this.add($notFirst);

		$all.add($languages).wrapAll("<div class=\"code-viewer\"></div>");


		listLanguages($all, $languages);

		$this.css('display', 'block');
		$notFirst.css('display', 'none');

		$languages.find('a').first().addClass('active');

		$languages.find('a').click(function() {
			$all.css('display', 'none');
			$all.eq($(this).parent().index()).css('display', 'block');

			$languages.find('a').removeClass('active');
			$(this).addClass('active');
			return false;
		});

		if ($languages.children().length === 0) {
			$languages.remove();
		}
	});

	function listLanguages($el, $insert) {
		$el.each(function(i) {
			var title = $(this).attr('title');
			if (title) {
				$insert.append("<li><a href=\"#\">" + title + "</a></li>");
			}
		});
	}

	var href = $('.sidebar a').first().attr("href");

	if (href !== undefined && href.charAt(0) === "#") {
		setActiveSidebarLink();

		$(window).on("scroll", function(evt) {
			setActiveSidebarLink();
		});
	}

	function setActiveSidebarLink() {
			$('.sidebar a').removeClass('active');
				var $closest = getClosestHeader();
				$closest.addClass('active');
				document.title = $closest.text();

	}
});

function getClosestHeader() {
	var $links = $('.sidebar a'),
	top = window.scrollY,
	$last = $links.first();

	if (top < 300) {
		return $last;
	}

	if (top + window.innerHeight >= $(".main").height()) {
		return $links.last();
	}

	for (var i = 0; i < $links.length; i++) {
		var $link = $links.eq(i),
		href = $link.attr("href");

		if (href !== undefined && href.charAt(0) === "#" && href.length > 1) {
			var $anchor = $(href);

			if ($anchor.length > 0) {
				var offset = $anchor.offset();

				if (top < offset.top - 300) {
					return $last;
				}

				$last = $link;
			}
		}
	}
	return $last;
}
