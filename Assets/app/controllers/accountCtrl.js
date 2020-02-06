angular.module('account', [])
	.controller('accountCtrl', function ($scope, $http, urlPrefix) {
		$scope.account = null;
		$scope.passChange = null;

		$scope.changePass = function () {
			$scope.errorMessages = null;
			$scope.result = null;
			$scope.processing = true;

			$http.post(urlPrefix + '/api/Account-ChangePassword', $scope.passChange)
				.success(function (data, status, headers, config) {
					$scope.processing = false;
					$scope.result = 'Password successfully changed.';
					$scope.passChange = null;
				})
				.error(function (data, status, headers, config) {
					$scope.processing = false;
					if (angular.isArray(data))
						$scope.errorMessages = data;
					else
						$scope.errorMessages = new Array(data.replace(/["']{1}/gi, ""));
				});
		};

		$scope.getAccount = function () {
			$scope.errorMessages = null;
			$scope.result = null;

			$http.get(urlPrefix + '/api/Account-UserInfo')
				.success(function (data, status, headers, config) {
					$scope.account = data;
				})
				.error(function (data, status, headers, config) {
					if (angular.isArray(data))
						$scope.errorMessages = data;
					else
						$scope.errorMessages = new Array(data.replace(/["']{1}/gi, ""));
				});
		};

		$scope.getAccount();
	});