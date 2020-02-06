var app = angular.module('app', [
	'ui.router',
	'ui.bootstrap',
	'utcToLocal',
	'ngCookies',
	'chart.js',
	'ngMap',
	'angular-focus-first-field',
	'checklist-model',

	'subscriptions',
	'signIn',
	'register',
	'devices',
	'device',
	'deviceManage',
	'deviceExamine',
	'examineBrowse',
	'examineQuery',
	'frameDetail',
	'analyze',
	'deviceAnalyze',
	'preview',
	'previewMap',
	'deviceProvision',
	'provision',
	'provisionImages',
	'adminDevices',
	'adminAccounts',
	'categories',
	'category',
	'account'
]);

app.value('urlPrefix', 'http://test.device.pollensense.com');

app.config(['$provide', '$httpProvider', function ($provide, $httpProvider) {

	//================================================
	// Ignore Template Request errors if a page that was requested was not found or unauthorized.  The GET operation could still show up in the browser debugger, but it shouldn't show a $compile:tpload error.
	//================================================
	$provide.decorator('$templateRequest', ['$delegate', function ($delegate) {
		var mySilentProvider = function (tpl, ignoreRequestError) {
			return $delegate(tpl, true);
		}
		return mySilentProvider;
	}]);

	//================================================
	// Add an interceptor for AJAX errors
	//================================================
	$httpProvider.interceptors.push(['$q', '$location', function ($q, $location) {
		return {
			'responseError': function (response) {
				if (response.status === 401 && $location.path().indexOf('signin') === -1)
					$location.url('/signin?target=' + window.encodeURIComponent($location.url()));
				return $q.reject(response);
			}
		};
	}]);

}]);

app.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$urlRouterProvider.otherwise('/');

	$stateProvider
		.state('subscriptions', {
			url: '/',
			templateUrl: '/App/Subscriptions',
			controller: 'subscriptionsCtrl'
		})
		.state('preview', {            // Map and things here
			url: '/preview',
			templateUrl: "/App/PreviewMap",
			controller: 'previewMapCtrl'
		})
		.state('preview.analyze', {    // All analyze stuff here
			url: '/:deviceId/:period/:mode',
			views: {
				'previewPane': {
					templateUrl: 'App/Preview',
					controller: 'previewCtrl'
				}
			},
			params: {
				period: 'day',
				mode: 'chart'
			}
		})
		.state('devices', {
			abstract: true,
			url: '/devices',
			templateUrl: 'App/Devices',
			controller: 'devicesCtrl'
		})
		.state('devices.list', {
			url: '',
			views: {
				'provision': {
					templateUrl: "/App/ProvisionCollapsed"
				}
			}
		})
		.state('devices.provision', {
			url: '/provision',
			views: {
				'provision': {
					templateUrl: "/App/Provision",
					controller: 'provisionCtrl'
				}
			}
		})
		.state('devices.provisionimages', {
			url: '/provisionimages',
			views: {
				'provision': {
					templateUrl: "/App/ProvisionImages",
					controller: 'provisionImagesCtrl'
				}
			}
		})
		.state('device', {
			abstract: true,
			url: '/device/:deviceId',
			templateUrl: 'App/Device',
			controller: 'deviceCtrl'
		})
		.state('device.manage', {
			url: '',
			views: {
				'deviceDashboard': {
					templateUrl: 'App/DeviceManage',
					controller: 'deviceManageCtrl'
				}
			}
		})
		.state('device.examine', {
			abstract: true,
			url: '/examine',
			views: {
				'deviceDashboard': {
					templateUrl: 'App/DeviceExamine',
					controller: 'deviceExamineCtrl'
				}
			}
		})
		.state('device.examine.browse', {
			abstract: true,
			url: '/browse',
			views: {
				'examinePane': {
					templateUrl: 'App/ExamineBrowse',
					controller: 'examineBrowseCtrl'
				}
			}
		})
		.state('device.examine.browse.unselected', {
			url: '',
			views: {
				'frameDetail': {
					template: '<h3>Select a frame...</h3>'
				}
			}
		})
		.state('device.examine.browse.frame', {
			url: '/frame/:frameId',
			views: {
				'frameDetail': {
					templateUrl: 'App/FrameDetail',
					controller: 'frameDetailCtrl'
				}
			}
		})
		.state('device.examine.query', {
			url: '/query',
			views: {
				'examinePane': {
					templateUrl: 'App/ExamineQuery',
					controller: 'examineQueryCtrl'
				}
			}
		})
		.state('device.analyze', {
			url: '/analyze/:period/:mode',
			views: {
				'deviceDashboard': {
					templateUrl: 'App/DeviceAnalyze',
					controller: 'deviceAnalyzeCtrl'
				}
			},
			params: {
				period: 'day',
				mode: 'chart'
			}
		})
		.state('device.provision', {
			url: '/provision',
			views: {
				'deviceDashboard': {
					templateUrl: 'App/DeviceProvision',
					controller: 'deviceProvisionCtrl'
				}
			}
		})
		.state('register', {
			url: '/register',
			templateUrl: 'App/Register',
			controller: 'registerCtrl'
		})
		.state('terms', {
			url: '/terms',
			templateUrl: 'App/Terms'
		})
		.state('signin', {
			url: '/signin?message&target',
			params: {
				message: null,
				target: null
			},
			templateUrl: 'App/SignIn',
			controller: 'signInCtrl'
		})
		.state('adminDevices', {
			url: '/admin/devices',
			templateUrl: 'App/AdminDevices',
			controller: 'adminDevicesCtrl'
		})
		.state('adminAccounts', {
			url: '/admin/accounts',
			templateUrl: 'App/AdminAccounts',
			controller: 'adminAccountsCtrl'
		})
		.state('categories', {
			url: '/admin/categories',
			templateUrl: 'App/Categories',
			controller: 'categoriesCtrl'
		})
		.state('category', {
			url: '/admin/categories/:code',
			templateUrl: 'App/Category',
			controller: 'categoryCtrl'
		})
		.state('account', {
			url: '/account',
			templateUrl: 'App/Account',
			controller: 'accountCtrl'
		});

}]);

app.run(['$http', '$cookies', '$cookieStore', function ($http, $cookies, $cookieStore) {
	//If a token exists in the cookie, load it after the app is loaded, so that the application can maintain the authenticated state.
	$http.defaults.headers.common.Authorization = 'Bearer ' + $cookieStore.get('_Token');
	$http.defaults.headers.common.RefreshToken = $cookieStore.get('_RefreshToken');
}]);






//GLOBAL FUNCTIONS - pretty much a root/global controller.
//Get userName on each page
//Get updated token on page change.
//Logout available on each page.
app.run(['$rootScope', '$http', '$cookieStore', '$state', 'urlPrefix', function ($rootScope, $http, $cookieStore, $state, urlPrefix) {
	$rootScope.authSucceeded = function (data) {
		$http.defaults.headers.common.Authorization = "Bearer " + data.access_token;
		$http.defaults.headers.common.RefreshToken = data.refresh_token;

		$rootScope.userName = data.userName;
		if (data.roles) {
			$rootScope.roles = arrayToDict(angular.fromJson(data.roles));
		}
		$rootScope.loggedIn = true;

		$cookieStore.put('_Token', data.access_token);
		$cookieStore.put('_RefreshToken', data.refresh_token);

		function arrayToDict(roles) {
			var result = {};
			for (var i = roles.length - 1; i >= 0; --i)
				result[roles[i]] = null;
			return result;
		}
	};

	$rootScope.authFailed = function (data) {
		$rootScope.loggedIn = false;
	};

	$rootScope.logOut = function (nextState) {
		$http.post(urlPrefix + '/api/Account-Logout')
			.success(function (data, status, headers, config) {
				$http.defaults.headers.common.Authorization = null;
				$http.defaults.headers.common.RefreshToken = null;
				$cookieStore.remove('_Token');
				$cookieStore.remove('_RefreshToken');
				$rootScope.userName = '';
				$rootScope.loggedIn = false;

				if (nextState) {
					$state.go(nextState);
				}
			});
	};

	// refresh tokens not working at present; commented to prevent errors
	//$rootScope.$on('$locationChangeSuccess', function (event) {
	//	if ($http.defaults.headers.common.RefreshToken) {
	//		// TODO: only do this after a certain time
	//		var params = "grant_type=refresh_token&refresh_token=" + $http.defaults.headers.common.RefreshToken;
	//		$http({
	//			url: urlPrefix + '/Token',
	//			method: "POST",
	//			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	//			data: params
	//		})
	//			.success(function (data, status, headers, config) {
	//				$rootScope.authSucceeded(data);
	//			})
	//			.error(function (data, status, headers, config) {
	//				$rootScope.authFailed(data);
	//			});
	//	}
	//});
}]);