# Developing _Furnace and Fugue_
[_Furnace and Fugue_](https://furnaceandfugue.org) is a digital publication built as a static site that is generated via several repositories

## All Repositories Associated with the Development of _Furnace and Fugue_
- [fugue](https://github.com/Brown-University-Library/fugue)
- [atalanta-src](https://github.com/Brown-University-Library/atalanta-src)
- [atalanta-output](https://github.com/Brown-University-Library/atalanta-output)
- [atalanta-search](https://github.com/Brown-University-Library/atalanta-search)
- [atalanta-code](https://github.com/Brown-University-Library/atalanta-code)
- [atalanta-texts](https://github.com/Brown-University-Library/atalanta-texts)
- [atalanta-essays](https://github.com/Brown-University-Library/atalanta-essays)
- [atalanta_hugo](https://github.com/Brown-University-Library/atalanta_hugo)
- [atalanta-media](https://github.com/Brown-University-Library/atalanta-media)
- [furnace-and-fugue-music](https://github.com/Brown-University-Library/furnace-and-fugue-music)
- [atalanta](https://github.com/Brown-University-Library/atalanta)


### How _Furnace and Fugue_ is Generated
[Fugue (formerly furnace)](https://github.com/Brown-University-Library/fugue) is a custom static site generator that uses templates from [atalanta-src](https://github.com/Brown-University-Library/atalanta-src) to assemble various components into the complete publication at [atalanta-output](https://github.com/Brown-University-Library/atalanta-output). These components include:
- scholarly essays from [atalanta-essays](https://github.com/Brown-University-Library/atalanta-essays) that are generated separately by [atalanta_hugo](https://github.com/Brown-University-Library/atalanta_hugo)
- the digital edition of Michael Maier's _Atalanta fugiens_ emblem book, produced with [TEI](https://tei-c.org/) data from [atalanta-texts](https://github.com/Brown-University-Library/atalanta-texts), which was formerly [atalanta](https://github.com/Brown-University-Library/atalanta), multimedia from [atalanta-media](https://github.com/Brown-University-Library/atalanta-media), and includes interactive components such as a [zooming-image-viewer](https://github.com/Brown-University-Library/atalanta-code/tree/master/components/zooming-image-viewer) and a [music-player](https://github.com/Brown-University-Library/atalanta-code/tree/master/components/music-player) that is now archived seperately at [furnace-and-fugue-music](https://github.com/Brown-University-Library/furnace-and-fugue-music)
- a user generated emblem collection drawer from [atalanta-hugo](https://github.com/Brown-University-Library/atalanta_hugo/blob/master/themes/atalanta/assets/js/modules/collections.js)
- introductory texts from [front-matter](https://github.com/Brown-University-Library/atalanta-code/tree/master/static/front-matter)
- full text and faceted image search features from [atalanta-search](https://github.com/Brown-University-Library/atalanta-search)
- the remaining publication interface from [atalanta-code](https://github.com/Brown-University-Library/atalanta-code)


### Data Sources
- [XML](https://github.com/Brown-University-Library/atalanta-texts/tree/master/latin) of Latin and German TEI for _Atalanta fugiens_, 1618
- [XML](https://github.com/Brown-University-Library/atalanta-texts/tree/master/english) of English TEI for _Atalanta running, that is, new chymicall emblems relating to the secrets of nature_
- [XML](https://github.com/Brown-University-Library/atalanta-code/tree/master/data/mei) in [MEI](https://music-encoding.org/) for 50 fugues
- [WAV](https://github.com/Brown-University-Library/atalanta-media/tree/master/audio/emblem-music/wav) audio files for 50 fugues in three voices
- [JP2](https://repository.library.brown.edu/studio/item/bdr:698524/) image files for _Atalanta fugiens_, 1618
- [JSON](https://github.com/Brown-University-Library/atalanta-code/blob/master/data/json/byterm_enh_array.json) image search terms for 50 emblem images and the frontispiece


### Technical Specifications
All interactivity in _Furnace and Fugue_ is handled on the client side using JavaScript and no server-side support is necessary after the site has been generated.

The digital edition of _Atalanta fugiens_ is compiled from transcriptions of the original book, a [copy](https://perma.cc/SQ5Y-TJ9D) of which is held in the John Hay Library at Brown University, and a seventeenth-century English translation held at Yale University’s Beinecke Rare Book and Manuscript Library. Both texts are encoded in XML using the TEI (Text Encoding Initiative) schema. Detailed notes documenting the encoding conventions are included in the XML files available on the GitHub text repository. The encoded texts capture more features than were able to be displayed in the digital edition and are available for re-use. The digital edition of Atalanta fugiens is converted from XML source files to HTML with the in-house, custom-coded site generator system Furnace, which is written in Python and uses XSL as its template language. The scholarly essays were built with the static site generator Hugo.

The music notation was created with Sibelius and exported to MEI (Music Encoding Initiative), an XML schema for representing the physical and intellectual characteristics of musical documents, using the Sibelius-to-MEI plugin. Because MEI is a format that is easily manipulated, it was possible to use the Verovio music notation engraving library to generate a web-ready vector notation in SVG and to extract the timing information needed to align audio with the interactive music display.

Indexing and display are handled by JavaScript libraries. Search functionality is provided by the Lunr.js library with custom-built functionality to provide the context of search hits in the search result view. The faceted image search functionality was also built in-house. The digital edition uses OpenSeadragon for the zooming image viewer and MagickSlicer to create the image tiles. Additional animated effects and transitions in the digital edition, faceted image search, navigation menus, and interactive map use the GreenSock Animation API (GSAP), the GSAP ScrollToPlugin, ScrollMagic, and Tumult Hype Pro and the Waypoints JavaScript library, respectively.



