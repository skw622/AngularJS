angular.module('subscriptions', [])
	.controller('subscriptionsCtrl',['$scope','$http', function ($scope, $http) {
		$scope.alert = function () {
			alert("Coming soon");
		}
	}]);