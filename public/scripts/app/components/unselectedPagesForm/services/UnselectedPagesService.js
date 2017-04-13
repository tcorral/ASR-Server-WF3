class UnselectedPagesService {
  constructor() {}

  getUnselectedPages(pages, documentRanges = []) {
    const definedPages = [];
    const undefinedPages = [];
    //identify defined pages
    for (let i = 0; i < documentRanges.length; i++) {
        for (let j = documentRanges[i].rangefrom; j <= documentRanges[i].rangeto; j++) {
            if (definedPages.indexOf(j) === -1) {
                definedPages.push(j);
            }
        }
    }
    //identify undefined pages by comparing defined pages with PDFrange
    for (let i = 1; i <= pages; i++) {
        if (definedPages.indexOf(i) === -1) {
            undefinedPages.push(i);
        }
    }
    return undefinedPages;
  }
}

export default UnselectedPagesService;
