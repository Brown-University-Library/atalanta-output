//setup.
outp = '';
for ( i=1;i<51;i++ ) {
    outp += '<div class="emblem" id="emblem'+i+'">';
    outp += '    <h4>Emblem '+i+'</h3>';
    outp += '</div>';
}
$('#emblems').append(outp);

var doFilters = function(targ) {  
        //Select or deselect the term.
        $(targ).toggleClass('selected');

        //Get a list for each subcategory of all unique emblems selected in that subcategory.
        var embs = []
        $('li.subcat').each((i, subcat) => {
            embs.push($('.selected', subcat).map((i, el) => {
                outp = $(el).attr('data-emblems').split(',');
                return _.uniq(outp);
            }));
        });

        //Ignore subcategories with no terms selected.
        embs = embs.filter(arr => arr.length > 0);
        
        //Get the intersect--all emblems selected in every category.
        embs = _.intersection(...embs);

        console.log(embs);

        if ( $('.selected').length > 0 ) {
            $('div.emblem').hide();
            embs.forEach(num => {
                $('div#emblem'+num).show();
            })
        } else {
            $('div.emblem').show();
        }
};

var collection = {};
$.get('../data/json/byterm_enh_array.json').then(facets => {
    //Create all the search filter boxes and create a collection we can implant into PourOver.
    facets.forEach((fac) =>{
        var catid = fac.category.toLowerCase().replace(/[^\w]+/g, '-');
        var subcatid = fac.subcategory.toLowerCase().replace(/[^\w]+/g, '-');
        var termid = "term"+fac.id;
        var catcontainer = $('#selectors > #categories > #'+catid);
        if ( !catcontainer.length ) {
            $('#selectors > #categories').append(
                '<li id="'+catid+'">' +
                '<h2>'+fac.category+'</h2><ul/></li>'
            )
            catcontainer = $('#selectors > #categories > #'+catid);
        }
        
        var subcatcontainer = $('.subcat#'+subcatid);
        if ( !subcatcontainer.length ) {
            catcontainer.children('ul').append(
                '<li class="subcat" id="'+subcatid+'">' +
                '<h3>'+fac.subcategory+'</h3><ul/></li>'
            )
            subcatcontainer = $('.subcat#'+subcatid);
        }

        var termcontainer = $('.term#'+termid);
        if ( !termcontainer.length ) {
            subcatcontainer.children('ul').append(
                '<li class="term" id="'+termid+'" data-id="'+fac.id+'" data-emblems="'+fac.emblems+'">' +
                fac.searchTerm+
                '</li>'
            )
            termcontainer = $('.term#'+termid);
        }
    });
    //Return the collection.
    return {};

}).then(pocollection => {
    //Set up the user interface.
    //Try without pourover first.

    //OR within subcategories; AND between.
    $('.subcat > ul > li').on('click', ev=>{
        //Every time the user on a searchterm:
        doFilters(ev.delegateTarget);
    });

    $('h3.clearfilters').on('click', ev => {
        $('li.selected').removeClass('selected')
        doFilters();
    });
});