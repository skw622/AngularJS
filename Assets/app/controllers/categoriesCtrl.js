angular.module('categories', [])
	.controller('categoriesCtrl', function ($scope, $http, urlPrefix) {

		$scope.getList = function () {
			$http.get(urlPrefix + '/api/Category')
				.success(function (data, status, headers, config) {
					$scope.categoryList = data;
				});
		};

		$scope.remove = function (category) {
			$http.delete(urlPrefix + '/api/Category/' + category.Code)
				.success(function (data, status, headers, config) {
					$scope.getList();
				});
		};

		$scope.addCategory = function () {
			$scope.newCategory = {};
		};

		$scope.saveCategory = function () {
			$saving = true;
			$http.post(urlPrefix + '/api/Category', $scope.newCategory)
				.success(function (data, status, headers, config) {
					$scope.saving = false;
					$scope.newCategory = null;
					$scope.getList();
				})
				.error(function (data, status, headers, config) {
					$scope.saving = false;
					$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to save category";
				});
		};

		$scope.loadTypes = function () {
			if (!$scope.types) {
				$http.get(urlPrefix + '/api/CategoryType')
					.success(function (data, status, headers, config) {
						$scope.types = data;
					})
					.error(function (data, status, headers, config) {
						$scope.message = data.MessageDetail ? data.MessageDetail.replace(/["']{1}/gi, "") : angular.isString(data) ? data : "Unable to load category types.";
					});
			}
		};

		$scope.setType = function (type) {
			$scope.newCategory.TypeCode = type.Code;
			$scope.newCategory.TypeDescription = type.Description;
		};

		$scope.getList();
	});