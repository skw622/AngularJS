angular.module('signIn', ['ngCookies'])
	.controller('signInCtrl', function ($scope, $http, $rootScope, $state, $stateParams, $location, urlPrefix) {
		$scope.message = $stateParams.message;
		$scope.communicating = false;

		$scope.signIn = function () {
			$scope.message = null;
			var params = "grant_type=password&username=" + $scope.userName + "&password=" + $scope.password;
			$scope.communicating = true;
			$http({
				url: urlPrefix + '/Token',
				method: "POST",
				headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
				data: params
			})
			.success(function (data, status, headers, config) {
				$rootScope.authSucceeded(data);
				if ($stateParams.target) {
					$location.url($stateParams.target);
				}
				else {
					$state.go('devices.list');
				}
				$scope.communicating = false;
			})
			.error(function (data, status, headers, config) {
				$rootScope.authFailed(data);
				$scope.message = data.error_description ? data.error_description.replace(/["']{1}/gi, "") : 'Unable to sign in';
				$scope.communicating = false;
			});
		}

		if ($rootScope.loggedIn) {
			$rootScope.logOut();
		}
	});