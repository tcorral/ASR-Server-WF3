import constants from '../constants/index';

export default {
  getOTDateFormat(rawDate, $filter, config){
    let newDate = '';
    if (rawDate) { //acc 03/09/2017
      newDate = $filter('date')(rawDate, config.otDateFormat);
    }
    return newDate.toString();
  }
}
