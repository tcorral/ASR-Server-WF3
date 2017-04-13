import translations from '../i18n/index';
function config($translateProvider, ngToastProvider, $locationProvider) {
  $translateProvider
    .translations('nl', translations.nl)
    .translations('en', translations.en);

  ngToastProvider
    .configure({
      verticalPosition: 'bottom',
      horizontalPosition: 'center',
      maxNumber: 3,
      timeout: 4000
    });

  $locationProvider
    .html5Mode({
      enabled: true,
      requireBase: false
    });
    
    $translateProvider.preferredLanguage('nl');
}

export default config;
