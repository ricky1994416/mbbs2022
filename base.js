/*
<fusedoc>
	<description>
		Extending the features of Boost theme:
		- addGlobalModal
		- ajaxLoad
		- ajaxModal
		- applyAjaxModal
		- applyAjaxModalToSwitchRole
		- applyIndentClass
		- applyTableResponsive
		- applyAutoClick
		- fixBlockAttribute
		- fixBlockPadding
		- includeCSS
		- parseQueryString
		- setCustomLogo
	</description>
</fusedoc>
*/
addGlobalModal();
ajaxModal();
ajaxLoad();
applyAjaxModalToSwitchRole();
applyIndentClass();
applyAutoClick();
fixBlockAttribute();
fixBlockPadding();
document.addEventListener("DOMContentLoaded", function(event){
	requirejs(['jquery'], function($){
		applyAjaxModal();
		applyTableResponsive();
	});
});




// create different size of empty modals
function addGlobalModal() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$(['xl','lg','md','sm','xs']).each(function(i, size){
				var elementID = 'global-modal-'+size;
				var className = 'modal-'+size;
				if ( !$('#'+elementID).length ) {
					$(`
						<div id="`+elementID+`" class="modal fade" data-backdrop="true" tabindex="-1" role="dialog" aria-modal="true">
							<div class="modal-dialog `+className+`">
								<div class="modal-content">
									<div class="modal-header">
										<div class="modal-title h4"></div>
										<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
									</div>
									<div class="modal-body"></div>
									<div class="modal-footer">
										<small class="text-muted mr-auto"></small>
										<button type="button" class="btn btn-light" data-dismiss="modal">Close</button>
									</div>
								</div>
							</div>
						</div>
					`).appendTo('body');
				}
			});
		}); // jquery-ready
	}); // document-ready
}




// init ajax-load behavior
function ajaxLoad() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$(document).on('click', '[data-toggle=ajax-load]', function(evt){
				evt.preventDefault();
				// useful variables
				var $link = $(this);
				var $target = $( $link.attr('data-target') );
				var url = function(){
					if ( $link.is('[href]') ) return $link.attr('href');
					if ( $link.is('[data-href]') ) return $link.attr('data-href');
					return false
				}();
				var mode = $link.is('[data-mode]') ? $link.attr('data-mode') : 'replace';
				var transition = $link.is('[data-transition]') ? $link.attr('data-transition') : 'slide';
				// validation
				if ( !$link.attr('data-target') ) {
					alert('[ajaxLoad] No target was specified');
					return false;
				} else if ( !$target.length ) {
					alert('[ajaxLoad] Target not found ('+$link.attr('data-target')+')');
					return false;
				} else if ( !url ) {
					alert('[ajaxLoad] No source was specified');
					return false;
				}
				// show loading message
				var $loading = $('<div><span class="spinner-border spinner-border-sm text-secondary"></span> <span class="text-muted ml-1">Loading...</span></div>');
				if ( mode == 'prepend' ) $target.prepend($loading);
				else if ( mode == 'append' ) $target.append($loading);
				else $target.html($loading);
				// load content
				$.ajax(url, {
					cache: false,
					success: function(data, textStatus, jqXHR){
						var $response = $('<div>'+data+'</div>');
						// extract content
						var selector = $link.is('[data-selector]') ? $link.attr('data-selector') : '#region-main [role=main]';
						var body = $response.find(selector);
						// apply ajax-modal to response
						applyAjaxModal(body);
						applyTableResponsive(body);
						// apply content
						$loading.after(body).remove();
						// display with effect (when necessary)
						if ( transition == 'slide' ) {
							$target.hide().slideDown();
						}
					},
					// show error message
					error: function(jqXHR, textStatus, errorThrown){
						alert('[ajaxLoad] ajax error');
					}
				}); // ajax
			});
		}); // jquery-ready
	}); // document-ready
}




// init ajax-modal behavior
function ajaxModal() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$(document).on('click', '[data-toggle=ajax-modal]', function(evt){
				evt.preventDefault();
				// useful variables
				var $link = $(this);
				// define target modal
				var $modal = $( function(){
					if ( $link.is('[data-target]') ) return $link.attr('data-target');
					else if ( !$('#global-modal-xl').is('.show') ) return '#global-modal-xl';
					else if ( !$('#global-modal-lg').is('.show') ) return '#global-modal-lg';
					else if ( !$('#global-modal-md').is('.show') ) return '#global-modal-md';
					else if ( !$('#global-modal-sm').is('.show') ) return '#global-modal-sm';
					else return '#global-modal-xs';
				}() );
				// determine source
				var url = function(){
					if ( $link.is('[href]') ) return $link.attr('href');
					if ( $link.is('[data-href]') ) return $link.attr('data-href');
					return false
				}();
				// validation
				if ( !$modal.length ) {
					alert('[ajaxModal] Target not found ('+$link.attr('data-target')+')');
					return false;
				} else if ( !url ) {
					alert('[ajaxModal] No source was specified');
					return false;
				}
				// show modal & loading message
				$modal.find('.modal-title').html('<span class="spinner-border text-secondary"></span> <span class="text-muted ml-1">Loading...</span>');
				$modal.find('.modal-body').html('').hide();
				$modal.find('.modal-footer small').html('');
				$modal.modal('show');
				// load content
				if ( url ) $.ajax(url, {
					cache: false,
					success: function(data, textStatus, jqXHR){
						var $response = $('<div>'+data+'</div>');
						// extract content
						var title    = $link.is('[data-title]') ? $link.attr('data-title') : $link.text().trim();
						var footer   = $response.find('#region-main [role=main] .modified').remove();
						var selector = $link.is('[data-selector]') ? $link.attr('data-selector') : '#region-main [role=main]';
						var body     = $response.find(selector);
						// apply ajax-modal to response
						applyAjaxModal(body);
						applyTableResponsive(body);
						// show at modal
						$modal.find('.modal-title').html(title);
						$modal.find('.modal-body').html(body).slideDown();
						$modal.find('.modal-footer small').html(footer);
					},
					// show error message
                    error: function (jqXHR, textStatus, errorThrown) {
                        console.log(jqXHR);
                        console.log(textStatus);
                        console.log(errorThrown);
						alert('[ajaxModal] ajax error');
					}
				}); // ajax
			});
			// handling overlay when multiple modals launched
			$(document).on('show.bs.modal', '.modal', function (event) {
				var zIndex = 1040 + (10 * $('.modal:visible').length);
				$(this).css('z-index', zIndex);
				setTimeout(function() {
					$('.modal-backdrop').not('.modal-stack').css('z-index', zIndex - 1).addClass('modal-stack');
				}, 0);
			});
		}); // jquery-ready
	}); // document-ready
}




// suffix any link by caret (^) to open in modal
function applyAjaxModal(scope) {
	var scope = scope || 'body:not(.editing)';
	// remove caret in breadcrumb & section title (when necessary)
	var selectors = [
		'#region-main [role=main] .section.main > .content > .sectionname:first',
		'#region-main [role=main] > #maincontent + h2:first',
		'#page-navbar .breadcrumb-item a',
	].join(',');
	$(scope).find(selectors).each(function(){
		var $item = $(this);
		var itemText = $item.text().trim();
		if ( itemText.substr(-1) == '^' ) $item.html( itemText.substr(0, itemText.length-1) );
	});
	// go through every link
	$(scope).find('a').each(function(){
		var $link = $(this);
		var linkText;
		// check if link is activity
		var isActivity = ( $link.find('.instancename').length != 0 );
		// extract link text
		if ( isActivity ) {
			linkText = $link.find('.accesshide').remove().end().text().trim();
		} else {
			linkText = $link.text().trim();
		}
		// check any special symbol
		if ( linkText.substr(-1) == '^' ) {
			linkText = linkText.substr(0, linkText.length-1);
			// remove caret from link
			if ( isActivity ) {
				$link.find('.instancename').html(linkText);
			} else {
				$link.html(linkText);
			}
			// open link in modal
			$link.attr('data-toggle', 'ajax-modal').attr('data-title', linkText);
		}
	});
}




// open switch-role in modal
function applyAjaxModalToSwitchRole() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$('a[data-title*=switchroleto]').attr({
				'data-title'  : $('a[data-title*=switchroleto] .menu-action-text').text(),
				'data-target' : '#global-modal-sm',
				'data-toggle' : 'ajax-modal'
			});
		}); // jquery-ready
	}); // document-ready
}




// mark level of indent to activity instance
function applyIndentClass() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			// no indent
			$('.activity .mod-indent-outer .mod-indent:not([class*="mod-indent-"])').each(function(){
				$(this).closest('.mod-indent-outer').find('.activityinstance:first,.contentwithoutlink:first').addClass('indent-0');
			});
			// has indent
			$('.activity .mod-indent-outer .mod-indent[class*="mod-indent-"]').each(function(){
				var indent = $(this).attr('class').replace('mod-indent-', 'indent-').replace('mod-indent', '');
				$(this).closest('.mod-indent-outer').find('.activityinstance:first,.contentwithoutlink:first').addClass(indent);
			});
		}); // jquery-ready
	}); // document-ready
}




// apply responsive wrapper on every table
function applyTableResponsive(scope) {
	var scope = scope || 'body';
	$(scope).find('table').parent().not('.table-responsive').wrapInner('<div class="table-responsive"></div>');
}




// auto-click element (use together with ajax-load to include content remotely)
function applyAutoClick() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$('body:not(.editing) [autoclick]').click();
		}); // jquery-ready
	}); // document-ready
}




// convert block title to attribute
function fixBlockAttribute() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$('#block-region-side-pre .block[data-block=html]').each(function(){
				var $block = $(this);
				var title = $block.find('.card-title').text().trim();
				var alias = title.toLowerCase().split(' ').join('_');
				if ( title.length ) $block.attr('data-block', alias);
			});
		}); // jquery-ready
	}); // document-ready
}




// fix block top padding when no header
function fixBlockPadding() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$('#block-region-side-pre .block').each(function(){
				var $title = $(this).find('.card-title');
				var $content = $(this).find('.card-text');
				if ( !$title.length ) $content.removeClass('mt-3');
			});
		}); // jquery-ready
	}); // document-ready
}




// load css file
function includeCSS(src) {
	var link = document.createElement('link');
	link.rel = 'stylesheet';
	link.href = src;
	document.head.appendChild(link);
}




// parse query string into object
function parseQueryString(qs) {
	var result = {};
	while ( qs.charAt(0) == '?' ) {
		qs = qs.substr(1);
	}
	qs.split('&').forEach(function(keyValPair){
		keyValPair = keyValPair.split('=', 2);
		result[keyValPair[0]] = keyValPair[1] || '';
	});
	return result;
}




// change link and apply logo image
function setLogo(img, url) {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			var $brand = $('#page-wrapper > .navbar .navbar-brand');
			// set logo link
			if ( url ) {
				$brand.attr('href', url).attr('target', '_blank');
			} else {
				$brand.attr('href', '#');
			}
			// set logo image
			if ( Array.isArray(img) ) {
				// logo for desktop
				$('<img>').attr('src', img[0]).addClass('d-none d-xl-block d-lg-block d-md-block d-sm-block').appendTo($brand);
				// logo for mobile
				$('<img>').attr('src', img[1]).addClass('d-block d-xl-none d-lg-none d-md-none d-sm-none').appendTo($brand);
			} else {
				// logo for all
				$('<img>').attr('src', img).addClass('d-block').appendTo($brand);
			}
		}); // jquery-ready
	}); // document-ready
}
