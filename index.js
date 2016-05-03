const immutableUpdate = require('immutability-helper')

const getSquare = require('tak-game/get-square')
const moveIsValid = require('tak-game/move-is-valid')

module.exports = function(boardState, move) {
	if (move.type === 'PLACE') {
		return getValidPlacementSpaces(boardState, move)
	} else {
		return []
	}
}

function getValidPlacementSpaces(boardState, move) {
	const size = boardState.size

	const dimensions = rangeOf(size)

	return dimensions.reduce((ary, x) => {
		return ary.concat(dimensions.map(y => {
			return immutableUpdate(move, {
				x: {
					$set: x
				},
				y: {
					$set: y
				}
			})
		}).filter(move => moveIsValid(boardState, move)))
	}, [])
}

function rangeOf(n) {
	const ary = []
	for (var i = 0; i < n; ++i) {
		ary.push(i)
	}
	return ary
}
