class DocumentService {
  constructor($http, configEnv) {
    this.config = configEnv;
    this.$http =$http;
  }

  // Map Naam: returns a promise with select options
  getDocTypeGroup(query) {
    return this
      .$http({
        url: '', /*This is empty on purpose because we are pinging current url*/
        params: {
          func: 'll',
          objId: this.config.getdocumentgroups,
          filter: query,
          objAction: 'RunReport'
        }
      })
      .then(function (response) {
        const array = [];
        let i;
        let row;
        if (response.data.myRows) {
          for (i = 0; i < response.data.myRows.length; i++) {
            row = response.data.myRows[i];
            array.push({
              name: row.Name,
              value: row.Name
            });
          }
        }
        return array;
      });
  }

  // Document Type: returns a promise with select options
  getDocType(query, query2) {
    return this
      .$http({
        url: '', /*This is empty on purpose because we are pinging current url*/
        params: {
          func: 'll',
          objId: this.config.getdocumenttypes,
          filter: query,
          filter2: encodeURIComponent(query2),
          objAction: 'RunReport'
        }
      })
      .then(function (response) {
        const array = [];
        let i;
        let row;
        if (response.data.myRows) {
          for (i = 0; i < response.data.myRows.length; i++) {
            row = response.data.myRows[i];
            array.push({
              name: row.Name,
              value: row.Name
            })
          }
        }
        return array;
      });
  }
}

export default DocumentService;
