# Developing _Furnace and Fugue_
[_Furnace and Fugue_](https://furnaceandfugue.org) is a static site generated via several repositories

## All Repositories Associated with the Development of _Furnace and Fugue_
- [atalanta-output](https://github.com/Brown-University-Library/atalanta-output)
- [atalanta-src](https://github.com/Brown-University-Library/atalanta-src)
- [fugue](https://github.com/Brown-University-Library/fugue)
- [atalanta-search](https://github.com/Brown-University-Library/atalanta-search)
- [atalanta-code](https://github.com/Brown-University-Library/atalanta-code)
- [atalanta-texts](https://github.com/Brown-University-Library/atalanta-texts)
- [atalanta-essays](https://github.com/Brown-University-Library/atalanta-essays)
- [atalanta_hugo](https://github.com/Brown-University-Library/atalanta_hugo)
- [atalanta-media](https://github.com/Brown-University-Library/atalanta-media)
- [furnace-and-fugue-music](https://github.com/Brown-University-Library/furnace-and-fugue-music)
- [atalanta](https://github.com/Brown-University-Library/atalanta)

## How _Furnace and Fugue_ is Generated
[Fugue (formerly furnace)](https://github.com/Brown-University-Library/fugue) is a custom static site generator that uses templates from [atalanta-src](https://github.com/Brown-University-Library/atalanta-src) to assemble various components into the complete publication at [atalanta-output](https://github.com/Brown-University-Library/atalanta-output). These components include:
- scholarly essays from [atalanta-essays](https://github.com/Brown-University-Library/atalanta-essays) that are generated separately by [atalanta_hugo](https://github.com/Brown-University-Library/atalanta_hugo)
- the digital edition of Michael Maier's _Atalanta fugiens_ emblem book, produced with TEI data from [atalanta-texts](https://github.com/Brown-University-Library/atalanta-texts), multimedia from [atalanta-media](https://github.com/Brown-University-Library/atalanta-media), and includes interactive components such as a [zooming-image-viewer](https://github.com/Brown-University-Library/atalanta-code/tree/master/components/zooming-image-viewer) and a [music-player](https://github.com/Brown-University-Library/atalanta-code/tree/master/components/music-player) that is now archived seperately at[furnace-and-fugue-music](https://github.com/Brown-University-Library/furnace-and-fugue-music)
- a user generated emblem collection drawer from [atalanta-hugo](https://github.com/Brown-University-Library/atalanta_hugo/blob/master/themes/atalanta/assets/js/modules/collections.js)
- introductory texts [front-matter](https://github.com/Brown-University-Library/atalanta-code/tree/master/static/front-matter)
- full text and faceted search features from [atalanta-search](https://github.com/Brown-University-Library/atalanta-search)
- the remaining publication interface from [atalanta-code](https://github.com/Brown-University-Library/atalanta-code)

### Data Sources