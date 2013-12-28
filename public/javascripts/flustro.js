$(function(){
    // TODO: something interesting here lies.
	$("input[type='range']").change(function(e){
		$(this).next().html(e.target.value);
	});
});