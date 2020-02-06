angular.module('deviceManage', ['utcToLocal'])
	.controller('deviceManageCtrl', function ($scope, $http, $stateParams, $interval, urlPrefix) {
		$scope.deviceId = $stateParams.deviceId;
		$scope.possibleModes = [
			{ "code": 0, "name": 'Offline' },
			{ "code": 1, "name": 'Online' },
			{ "code": 2, "name": 'Testing' },
            { "code": 3, "name": 'Servicing' }
		];
		$scope.state = {
			"modeText": "...",
			"StatusHistory": []
		};
		$scope.modeTexts = {
			"0": 'Offline',
			"1": 'Online',
            "2": 'Testing',
            "3": 'Servicing'
		};
		$scope.statusTexts = {
			"0": "Offline",
			"1": "Online",
			"2": "Testing",
			"3": "Faulted",
			"4": "Updating",
			"5": "AdverseSensory",
			"6": "AdverseConditions",
			"7": "LidOpen",
			"8": "Healthy",
			"9": "Unhealthy"
		};
		$scope.communicating = false;

		$scope.showOnlyErrors = false;

		$scope.getStatus = function (showLoading) {
			$scope.message = null;
			$scope.communicating = showLoading;
			$http.get(urlPrefix + '/api/Device-State/' + $scope.deviceId)
				.success(function (data, status, headers, config) {
					$scope.state = data;
					$scope.state.modeText = $scope.modeTexts[$scope.state.Mode];
					$scope.communicating = false;
				})
				.error(function (data, status, headers, config) {
					$scope.communicating = false;
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to get device state";
				});
		};

		$scope.setMode = function (newMode) {
			$scope.message = null;
			$scope.communicating = true;
			$http.put(urlPrefix + '/api/Device-Mode', { DeviceId: $scope.deviceId, Mode: newMode })
				.success(function (data, status, headers, config) {
					$scope.communicating = false;
					$scope.getStatus();
				})
				.error(function (data, status, headers, config) {
					$scope.communicating = false;
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to set device mode";
				});
		};

		//Get the device's status
		$scope.getStatus(true);
		$scope.refreshTimer = $interval(function () { $scope.getStatus(false); }, 10000);

		$scope.$on('$destroy', function () {
			// Make sure that the interval is destroyed too
			$interval.cancel($scope.refreshTimer);
			$scope.refreshTimer = undefined;
		});
	});