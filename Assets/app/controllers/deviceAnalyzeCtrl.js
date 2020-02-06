angular.module('deviceAnalyze', [])
	.controller('deviceAnalyzeCtrl', function ($scope, $http, $stateParams, $filter, $controller) {

		$controller('analyzeCtrl', { $scope: $scope });

		function saveFile(name, type, data) {
			if (data !== null && navigator.msSaveBlob)
				return navigator.msSaveBlob(new Blob([data], { type: type }), name);
			var a = $("<a style='display: none;'/>");
			var url = window.URL.createObjectURL(new Blob([data], { type: type }));
			a.attr("href", url);
			a.attr("download", name);
			$("body").append(a);
			a[0].click();
			window.URL.revokeObjectURL(url);
			a.remove();
		}

		$scope.export = function () {
			var text = $scope.data.Series.reduce((p, s) => p + ',' + s, 'StartingAt') + '\r\n'
				+ $scope.rawData.Moments.map((moment, rowIndex) =>
					[moment].concat(
						$scope.data.Series.map((c, catIndex) => $scope.data.Data[catIndex][rowIndex])
					).join(',')
				).join('\r\n');
			saveFile('pollensense.csv', 'text/csv', text);
		};
	});