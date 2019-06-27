const SURROUNDING_CHARACTERS = 75;
const MERGE_DISTANCE = SURROUNDING_CHARACTERS * 2;

var sectionNames = {
    'fugue-de':     "Fugue (German)",
    'epigram-de':   "Epigram (German)",
    'image-la':     "Title (Latin)",
    'epigram-la':   "Epigram (Latin)",
    'discourse-la': "Discourse (Latin)",
    'title-en':     "Title (English)",
    'epigram-en':   "Epigram (English)",
    'discourse-en': "Discourse (English)",
};

var essaySectionNames = {
    'title':        "Title",
    'subtitle':     "Subtitle",
    'author':       "Author",
    'body':         "Body",
    'footnotes':    "Footnotes",
}

$('html').on('click', '.search-results .results__item--image-terms a', ev=>{
    if ( window.location.pathname.includes('/search/image-search.html') )
        window.location.reload();
})

$("#ataSearch").submit(function(ev) {
    ev.preventDefault();

    $('#results div').hide();
    var searchTerm = $('input', this).val();
    results = doSearch(searchTerm);
    console.log('results', results);
    $('main').html(pageTemplate(results));
    $('main').removeAttr("id");
    $('main').removeAttr("class");
    $('main').removeAttr("data-id");
    $('main').removeAttr("data-page");
    $('body').removeAttr("class");
    $('.fake-header').css("display", "none"); /* essays, 101, about pages */
    $('.header-area').css("display", "none"); /* essays, 101, about pages */
    $('body#maier .header-area').css("display", "block"); /* maier 101 page */
    $('.header-banner').css("display", "none"); /* maier 101 page */
    $('#forced-gutter-fade').css("display", "none"); /* maier 101 page */
});

//searchfunction.js throws this event when it's done loading the search index.
window.addEventListener('atalantaSearchLoad', event => {
    if ( "ready" == event.detail.state ) {
        //Success. We're ready to search; go ahead and set up your UI.
        $("#ataSearch").show();
    } else {
        console.log("Failed to start search:", event);
        //There was a problem loading the data we need to do the search. 
        //event.detail.error may have details.
    }
});