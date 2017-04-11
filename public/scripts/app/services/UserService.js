class UserService {
  constructor($http, configEnv) {
    this.config = configEnv;
    this.$http =$http;
  }

  getUserByLogin(login) {
    return this
      .$http({
        url: '', /*This is empty on purpose because we are pinging current url*/
        params: {
          func: 'll',
          objId: this.config.userByLoginService,
          login: login,
          objAction: 'RunReport'
        }
      })
      .then(function (response) {
        let user;
        let transformedUser;
        if (response.data.myRows) {
          user = response.data.myRows[0];
          transformedUser = {
            name: user.FirstName + ' ' + user.LastName + ' (' + user.Name + ')',
            value: user.ID
          };
        }
        return transformedUser;
      });
  }

  asyncFindUser(query) {
    return this
      .$http({
        url: '', /*This is empty on purpose because we are pinging current url*/
        params: {
          func: 'll',
          objId: this.config.autocompleteUsernameService,
          filter: '%' + query + '%',
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
              name: row.FirstName + " " + row.LastName + " (" + row.Name + ")",
              value: row.ID
            });
          }
        }
        return array;
      });
  }
}

export default {
  UserService
};
