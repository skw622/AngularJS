angular.module('utcToLocal', [])
	.filter('utcToLocal',
		function utcToLocal($filter) {
			return function (utcDateString, format) {
				if (!utcDateString) {
					return;
				}

				// append 'Z' to the date string to indicate UTC time if the timezone isn't already specified
				if (utcDateString.indexOf('Z') === -1 && utcDateString.indexOf('+') === -1) {
					utcDateString += 'Z';
				}

				return $filter('date')(new Date(utcDateString), format);
			};
		}
	);