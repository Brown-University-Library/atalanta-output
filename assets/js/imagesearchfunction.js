// $.get('../data/json/byterm_enh_array.json').then(facets => {
// 	var tdata = {};
// 	var cats = _.uniq(facets.map(fac=>{return fac.category}));
// 	cats.forEach(cat => {
// 		tcdata = {}
// 		var subcats = _.uniq(facets.filter(fac=>fac.category=="Actions")
// 									.map(fac => { return fac.subcategory }));
		
// 		subcats.forEach(subcat => {
// 			tcdata[subcat] = facets.filter(fac=>fac.category=="Actions" && fac.subcategory=="Dynamic")
// 									.map(fac => { return {id: fac.id, term:fac.searchTerm,emblems: fac.emblems}; });
// 		});

// 		tdata[cat] = tcdata;
// 	});
// 	templdata = {'termdata': tdata};
// 	outp = navbarTemplate(templdata);
// 	console.log('tdata:', tdata, outp);
// 	$('nav.image-search-filters').html(outp);
// });