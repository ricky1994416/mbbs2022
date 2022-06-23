/*
<fusedoc>
	<description>
		Extending admin console features of Moodle
		- add batch search to user enrolment and group assignment
		- add button to atto-editor
	</description>
</fusedoc>
*/
addBatchAssignField();
addBatchEnrolField();
addEditorButton();
fixEditorHeight();




// add button for batch assign user to group
function addBatchAssignField() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			var $form = $('#addmembersform form');
			var $table = $form.find('.generaltable:first');
			// fix colspan
			$('#backcell').attr('colspan', 4);
			// select none
			$('#addselect option').prop('selected', false);
			// create fields & buttons
			$table.after(`
				<fieldset class="mt-5 mb-2 ml-0">
					<legend class="pl-3">
						<span>Batch Search Users</span>
						<small class="text-muted ml-1 d-none">(<span class="count"></span>)</small>
					</legend>
					<div class="container-fluid">
						<div class="form-group row">
							<div class="col">
								<textarea id="batch-assign" class="form-control" style="height: 20em;" placeholder="Please enter user emails here\nRecommended to try both <@hku.hk> and <@connect.hku.hk>"></textarea>
							</div>
							<div class="col d-none">
								<pre id="batch-assign-skip" class="form-control alert-secondary border" style="height: 20em;"><span class="badge badge-secondary">SKIPPED</span> <small>(<span class="count"></span>)</small></pre>
							</div>
							<div class="col d-none">
								<pre id="batch-assign-error" class="form-control alert-danger" style="height: 20em;"><span class="badge badge-danger">NOT FOUND</span> <small>(<span class="count"></span>)</small></pre>
							</div>
						</div>
						<div class="form-group row">
							<div class="col-2"><button type="button" id="batch-assign-start" class="btn btn-block btn-primary">Start <small class="ml-1 d-none">(<span class="count"></span>/<span class="total"></span>)</small></button></div>
						</div>
					</div>
				</fieldset>
			`);
			// assign behavior
			$('#batch-assign-start').on('click', startBatchAssign);
		}); // jquery-ready
	}); // document-load
}




// add fields for batch enrolment
function addBatchEnrolField() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$(document).on('click', 'input[value="Enrol users"]', function(evt){
				// keep checking until modal ready
				var interval = window.setInterval(function(){
					var $modalBody = $('.modal.show .modal-body');
					if ( $modalBody.find('form').length && !$('#batch-enrol').length ) {
						// fix spacing
						$modalBody.find('fieldset').addClass('ml-0');
						// create fields & buttons
						$modalBody.append(`
							<fieldset class="mt-4 mb-2 ml-0">
								<legend>
									<span>Batch Search Users</span>
									<small class="text-muted ml-1 d-none">(<span class="count"></span>)</small>
								</legend>
								<div class="form-group row">
									<div class="col">
										<textarea id="batch-enrol" class="form-control" style="height: 20rem;" placeholder="Please enter user emails here\nRecommended to try both <@hku.hk> and <@connect.hku.hk>"></textarea>
									</div>
									<div class="col d-none">
										<pre id="batch-enrol-skip" class="form-control alert-secondary border" style="height: 20rem;"><span class="badge badge-secondary">SKIPPED</span> <small>(<span class="count"></span>)</small></pre>
									</div>
									<div class="col d-none">
										<pre id="batch-enrol-error" class="form-control alert-danger" style="height: 20rem;"><span class="badge badge-danger">NOT FOUND</span> <small>(<span class="count"></span>)</small></pre>
									</div>
								</div>
								<div class="form-group row">
									<div class="col-2 pr-0"><button type="button" id="batch-enrol-start" class="btn btn-block btn-primary">Start <small class="ml-1 d-none">(<span class="count"></span>/<span class="total"></span>)</small></button></div>
								</div>
							</fieldset>
						`);
						// assign behavior
						$('#batch-enrol-start').on('click', startBatchEnrol);
						// stop checking
						window.clearInterval(interval);
					} // if-modal-body
				}, 1000);
			}); // on-click-enrol-button
		}); // jquery-ready
	}); // document-load
}




// add buttons to insert table template
// ===> hidden pages in MBBS 2020 [General] section

var trigger = 0;

function addEditorButton() {
	if ( typeof ajaxLoad !== 'undefined' && trigger == 0) {
		trigger = 1 ;
		
		console.log ("HIHI");
		
		document.addEventListener("DOMContentLoaded", function(event){
			requirejs(['jquery'], function($){
				// define resources
				var templates = {
					'WCS' : 'https://moodle.hku.hk/mod/page/view.php?id=1832296',
					'Practicals' : 'https://moodle.hku.hk/mod/page/view.php?id=1832329'
				}
				
				// go through each field with editor
				$('#id_summary_editor,#id_introeditor,#id_page').filter('textarea').each(function(){
					console.log ("123");
					// keep checking until editor ready
					var interval = window.setInterval(function($field){
						var $editor = $field.closest('.editor_atto_wrap').find('.editor_atto');
						var $toolbar = $editor.find('.editor_atto_toolbar');
						var $content = $editor.find('.editor_atto_content');
						// when toolbar ready...
						if ( $toolbar.length && $content.length ) {
							var $customGroup = $('<div class="atto_group custom_group"></div>').insertBefore( $toolbar.find('.atto_group.other_group') );
							// create buttons
							for (var key in templates) {	
								$customGroup.append(`<button 
								    onclick="toggleClick('`+templates[key]+`','`+$content.attr('id')+`')"
									type="button"
									tabindex="-1"
									title="Insert WCS Table"
									
								><i class="icon fa fa-table fa-fw"></i> `+key+`</button>`);
							}
							// stop checking
							window.clearInterval(interval);
						}
					}, 2000, $(this));
				});
			}); // jquery-ready
		}); // document-load
	} // if-ajax-load
}

function toggleClick(url,target){
	
	
	$.ajax({ 
                 type: 'GET', 
                 url: url, 
                 success: function (data) { 
				 
					var src = $(data).find('#region-main .table[data-template]').html();
					
					var newDiv = $('<div style="display: none;" >');
					var innerDiv = $('<table data-template="wcs" class="table table-bordered">');
					innerDiv.append($(src));
					newDiv.append($(innerDiv));
 
					newDiv.addClass('show').appendTo('#'+target).show('slow');

                 }
             });
			 
}


// increase height of html editor and expand all features by default
function fixEditorHeight() {
	document.addEventListener("DOMContentLoaded", function(event){
		requirejs(['jquery'], function($){
			$('#id_summary_editor,#id_introeditor,#id_page').filter('textarea').each(function(){
				// keep checking until editor ready
				var interval = window.setInterval(function($field){
					var $editor = $field.closest('.editor_atto_wrap').find('.editor_atto');
					var $button = $editor.find('.atto_collapse_button');
					var $content = $editor.find('.editor_atto_content');
					// when button & field ready...
					if ( $button.length && $content.length ) {
						// click button
						$button.click().blur();
						// enlarge field
						$content.height( $content.height() + 200 );
						// stop checking
						window.clearInterval(interval);
					}
				}, 500, $(this));
			});
		}); // jquery-ready
	}); // document-load
}




// start batch group-assign process
function startBatchAssign() {
	var $field        = $('#batch-assign');
	var $errField     = $('#batch-assign-error');
	var $skipField    = $('#batch-assign-skip');
	var $startBtn     = $('#batch-assign-start');
	var $searchField  = $('#addselect_searchtext');
	var $searchResult = $('#addselect');
	// progress
	var $progress      = $startBtn.find('small');
	var $progressCount = $progress.find('.count');
	var $progressTotal = $progress.find('.total');
	var $errCount      = $errField.find('.count');
	var $skipCount     = $skipField.find('.count');
	var $successCount  = $field.closest('fieldset').find('legend .count');
	// clean-up
	$field.val( $field.val().split('\n').map(item => item.trim()).filter(item => item.length > 0).join('\n') );
	// init progress
	$progress.removeClass('d-none');
	$progressCount.html(0);
	$progressTotal.html( $field.val().split('\n').length );
	// toggle fields & buttons
	$field.prop('readonly', true);
	$startBtn.prop('disabled', true);
	$searchField.prop('readonly', true);
	// (de)select options
	$('[name=userselector_preserveselected]:checkbox:not(:checked)').click();
	$('[name=userselector_autoselectunique]:checkbox:checked').click();
	$('[name=userselector_searchanywhere]:checkbox:checked').click();
	// retrieve users already assigned
	var existing = [];
	$('#removeselect option').each(function(){
		var email = $(this).text().trim();
		email = email.substr(0, email.length-1).split('(').pop();
		if ( email.length ) existing.push(email);
	});
	existing = existing.filter(item => item.length > 0);
	// remove assigned users from the list
	var inputs = $field.val().split('\n');
	$field.val('');
	for (var i=0; i<inputs.length; i++) {
		if ( existing.indexOf(inputs[i]) != -1 ) {
			$skipField.append('\n'+inputs[i]).parent().removeClass('d-none');
			$skipCount.html( parseInt( $skipCount.text() || 0 ) + 1 );
			$progressCount.html( parseInt( $progressCount.text() || 0 ) + 1 );
		} else {
			$field.val($field.val()+'\n'+inputs[i]);
		}
	}
	// go through each row until finished
	var interval = window.setInterval(function(){
		var isLoading = ( $searchResult.attr('style') && $searchResult.attr('style').indexOf('loading') != -1 );
		// only proceed when search stopped
		if ( !isLoading ) {
			var $matches = $searchResult.find('optgroup[label^="Matching"] > option');
			var noMatch  = ( $searchResult.find('optgroup[label^="No users match"]').length > 0 );
			// just start
			if ( !$searchField.val().length ) {
				// (do nothing...)
			// show as error when no-match
			} else if ( noMatch ) {
				$errField.append('\n'+$searchField.val()).parent().removeClass('d-none');
				$errCount.html( parseInt( $errCount.text() || 0 ) + 1 );
				$progressCount.html( parseInt( $progressCount.text() || 0 ) + 1 );
			// check whether there is exact match
			} else if ( $matches.length ) {
				var hasExactMatch = false;
				// go through all matches & select exact match
				$matches.each(function(){
					if ( $(this).text().indexOf('('+$searchField.val()+')') != -1 ) {
						hasExactMatch = true;
						$(this).prop('selected', true);
						$successCount.html( parseInt( $successCount.text() || 0 ) + 1 ).parent().removeClass('d-none');
					}
				});
				// show as error when no-exact-match
				if ( !hasExactMatch ) {
					$errField.append('\n'+$searchField.val()).parent().removeClass('d-none');
					$errCount.html( parseInt( $errCount.text() || 0 ) + 1 );
				}
				$progressCount.html( parseInt( $progressCount.text() || 0 ) + 1 );
			}
			// clear field to start next search
			$searchField.val('');
			// search first item of the list
			if ( $field.val().length ) {
				var rows = $field.val().split('\n');
				var input = rows.shift();
				$field.val( rows.join('\n') );
				// start searching
				// ===> (trigger event by native javascript because the event was binded by YUI not jQuery)
				$searchField.val(input);
				document.querySelector( '#'+$searchField.attr('id') ).dispatchEvent( new KeyboardEvent('keyup') );
			// stop when no more item in the list
			} else {
				// stop repeating
				window.clearInterval(interval);
				// toggle fields & buttons
				$progress.addClass('d-none');
				$field.prop('readonly', false);
				$startBtn.prop('disabled', false);
				$searchField.prop('readonly', false);
			}
		} // if-not-loading
	}, 500); // (don't set too fast, otherwise it will miss some matches)
}




// start batch enrolment process
function startBatchEnrol() {
	var $form         = $('.modal.show').find('form');
	var $field        = $('#batch-enrol');
	var $skipField    = $('#batch-enrol-skip');
	var $errField     = $('#batch-enrol-error');
	var $startBtn     = $('#batch-enrol-start');
	var $searchField  = $form.find('input[id^=form_autocomplete_input]:first');
	// progress
	var $progress      = $startBtn.find('small');
	var $progressCount = $progress.find('.count');
	var $progressTotal = $progress.find('.total');
	var $errCount      = $errField.find('.count');
	var $skipCount     = $skipField.find('.count');
	var $successCount  = $field.closest('fieldset').find('legend .count');
	// clean-up
	$field.val( $field.val().split('\n').map(item => item.trim()).filter(item => item.length > 0).join('\n') );
	// init progress
	$progress.removeClass('d-none');
	$progressCount.html(0);
	$progressTotal.html( $field.val().split('\n').length );
	// toggle fields & buttons
	$field.prop('readonly', true);
	$startBtn.prop('disabled', true);
	$searchField.prop('readonly', true);
	// retrieve already enrolled
	var existing = [];
	var url = document.location.pathname + '?perpage=9999&id=' + $('form[id^=enrolusersbutton]:first input[name=id]').val();
	$.get(url, function(data){
		// prepare list of all enrolled
		$(data).find('td.cell.c2').each(function(){
			var email = $(this).text().trim();
			if ( email.length ) existing.push(email);
		});
		// remove assigned users from the list
		var inputs = $field.val().split('\n');
		$field.val('');
		for (var i=0; i<inputs.length; i++) {
			if ( existing.indexOf(inputs[i]) != -1 ) {
				$skipField.append('\n'+inputs[i]).parent().removeClass('d-none');
				$skipCount.html( parseInt( $skipCount.text() || 0 ) + 1 );
				$progressCount.html( parseInt( $progressCount.text() || 0 ) + 1 );
			} else {
				$field.val($field.val()+'\n'+inputs[i]);
			}
		}
		// go through each row until finished
		var interval = window.setInterval(function(){
			var $searchResult = $form.find('.form-autocomplete-suggestions');
			var isLoading = $searchResult.closest('[data-fieldtype=autocomplete]').find('.loading-icon').is(':visible');
			// only proceed when search stopped
			if ( !isLoading ) {
				var $matches = $searchResult.find('> li');
				var noMatch  = ( $searchResult.text().trim() == 'No suggestions' );
				var tooMany  = ( $searchResult.text().trim().indexOf('Too many users') == 0 );
				// just start
				if ( !$searchField.val().length ) {
					// (do nothing...)
				// show as error when no-match or too-many-match
				} else if ( noMatch || tooMany ) {
					$errField.append('\n'+$searchField.val()).parent().removeClass('d-none');
					$errCount.html( parseInt( $errCount.text() || 0 ) + 1 );
					$progressCount.html( parseInt( $progressCount.text() || 0 ) + 1 );
				// check whether there is exact match
				} else if ( $matches.length ) {
					var hasExactMatch = false;
					// go through all matches & select exact match
					$matches.each(function(){
						if ( $searchField.val() == $(this).find('small').text().trim() ) {
							hasExactMatch = true;
							$(this).click();
							$successCount.html( parseInt( $successCount.text() || 0 ) + 1 ).parent().removeClass('d-none');
						}
					});
					// show as error when no-exact-match
					if ( !hasExactMatch ) {
						$errField.append('\n'+$searchField.val()).parent().removeClass('d-none');
						$errCount.html( parseInt( $errCount.text() || 0 ) + 1 );
					}
					$progressCount.html( parseInt( $progressCount.text() || 0 ) + 1 );
				}
				// clear field to start next search
				$searchField.val('');
				// search first item of the list
				if ( $field.val().length ) {
					var rows = $field.val().split('\n');
					var input = rows.shift();
					$field.val( rows.join('\n') );
					// start searching
					// ===> (trigger event by native javascript because the event was binded by YUI not jQuery)
					$searchField.val(input);
					document.querySelector( '#'+$searchField.attr('id') ).dispatchEvent( new Event('input') );
				// stop when no more item in the list
				} else {
					// stop repeating
					window.clearInterval(interval);
					// toggle fields & buttons
					$progress.addClass('d-none');
					$field.prop('readonly', false);
					$startBtn.prop('disabled', false);
					$searchField.prop('readonly', false);
				}
			} // if-not-loading
		}, 500); // (don't set too fast, otherwise it will miss some matches)
	}); // get-all-enrolled
}
