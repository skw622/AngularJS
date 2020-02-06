angular.module('register', [])
	.controller('registerCtrl',[function ($scope, $http, $state, $rootScope, urlPrefix) {
		$scope.newUser = {};

		$scope.register = function ()
		{
			$scope.errorMessages = null;

			if ($scope.newUser.Agreement) {
				$scope.newUser.Agreement = undefined;
			}
			else {
				$scope.errorMessages = ['Cannot proceed until you read and agree to the terms of use.'];
			}
			
			$http.post(urlPrefix + '/api/Account-Register', $scope.newUser)
				.success(function (data, status, headers, config) {
					var params = "grant_type=password&username=" + $scope.newUser.Email + "&password=" + $scope.newUser.Password;
					$http({
						url: urlPrefix + '/Token',
						method: "POST",
						headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
						data: params
					})
						.success(function (data, status, headers, config) {
							$rootScope.authSucceeded(data);
							$state.go('devices.list');
						})
						.error(function (data, status, headers, config) {
							$rootScope.authFailed(data);
							if (angular.isArray(data))
								$scope.errorMessages = data;
							else
								$scope.errorMessages = new Array(data.replace(/["']{1}/gi, ""));
							$scope.errorMessages.push('Account created but there was a problem with the sign-on process.');
						});
					$scope.newUser = {};
				})
				.error(function (data, status, headers, config) {
					if (angular.isArray(data))
						$scope.errorMessages = data;
					else
						$scope.errorMessages = new Array(data.replace(/["']{1}/gi, ""));
				});
		}
	}]);