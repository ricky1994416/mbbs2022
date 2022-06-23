applyRandomMascot();
applySectionFront();
fixAcademicYear();
fixHomeIconLink();
redirectToFirstPage();
redirectToSectionPage();
customFro2021();

// apply random mascot to course title
function applyRandomMascot() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			var random = Math.floor( Math.random() * 19 ) + 1;
			$('#page-header').addClass('mascot-'+random.toString());
			$('#page-header .context-header-settings-menu').closest('#page-header').addClass('has-settings-menu');
		}); // jquery-ready
	}); // document-ready
}

function customFro2021(){
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			var $heading = $('.page-header-headings');
		
			$heading.html( '<h1>MBBS Curriculum [2021/22]</h1>' );
		}); // jquery-ready
	}); // document-ready
	
}


// turn section with banner to section-front
function applySectionFront() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$('.section.main > .content > .summary img')
				.addClass('section-banner')
				.parent().addClass('section-banner-wrapper')
				.closest('.section.main').addClass('section-front');
		}); // jquery-ready
	}); // document-ready
}




// fix academic year in course title
function fixAcademicYear() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			var $heading = $('#page-header .page-header-headings h1');
			var headingText = $heading.text().trim();
			var thisYear = headingText.replace(']', '').split('[').pop();
			var nextYear = ( parseInt(thisYear) + 1 ).toString();
			$heading.html( headingText.replace('['+thisYear+']', '['+thisYear+'/'+nextYear.substr(-2)+']') );
		}); // jquery-ready
	}); // document-ready
}




// change link of home icon
function fixHomeIconLink() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			var $link = $('#page-navbar .breadcrumb .breadcrumb-item:nth-child(3) a');
			// show all sections to admin
			if ( $('body').is('.editing') ) {
				$link.attr('href', $link.attr('href')+'&section=0');
			// otherwise, go to first page directly (to avoid redirection)
			} else {
				$link.attr('href', $link.attr('href')+'&section=1');
			}
		}); // jquery-ready
	}); // document-ready
}




// redirect to first page
// ===> go to landing page when only [id] specified
// ===> use [section=0] to view all sections
function redirectToFirstPage() {
	var qs = parseQueryString( document.location.search );
	if ( true
		&& document.location.pathname == '/course/view.php'
		&& Object.keys(qs).join() == 'id'
		&& !document.location.hash
	) {
		document.location.href += '&section=1';
	}
}




// redirect to corresponding page when section specified as hash
// ===> go to section page when only [id] and [#section-] specified
function redirectToSectionPage() {
	var qs = parseQueryString( document.location.search );
	if ( true
		&& document.location.pathname == '/course/view.php'
		&& Object.keys(qs).join() == 'id'
		&& document.location.hash.indexOf('#section-') == 0
	) {
		var url = document.location.href.replace('#section-', '&section=');
		document.location.href = url;
	}
}



