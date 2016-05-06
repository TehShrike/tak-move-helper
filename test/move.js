const test = require('tape')
const p = require('tak-game/parse-position')
const getValidPlaceLocations = require('../')

function fewRandomPieces(whoseTurn = 'x') {
	return p(`
		 |   |  |x
		 |oxO|ox|
		x|o^ |  |
		o|   |  |
	`, whoseTurn)
}
function xy(x, y) {
	return { x, y }
}
function compare(expectedProperties, move) {
	return Object.keys(expectedProperties).every(key => expectedProperties[key] === move[key])
}

function compareCoordinateArrays(t, actual, expected) {
	t.equal(actual.length, expected.length)
	t.ok(expected.every(expectedCoordinates => {
		return actual.findIndex(actualMove => compare(expectedCoordinates, actualMove)) !== -1
	}))
}

test('find all valid moveable pieces', t => {
	const boardState = fewRandomPieces('o')

	const move = {
		type: 'MOVE',
	}

	const expected = [
		xy(0,0),
		xy(1,1),
		xy(1,2),
	]

	const actual = getValidPlaceLocations(boardState, move)

	compareCoordinateArrays(t, actual, expected)

	t.end()
})

test('find all places you can move a given square', t => {
	const boardState = fewRandomPieces('o')

	const move = {
		type: 'MOVE',
		x: 1,
		y: 2
	}

	const expected = [
		xy(0,2),
		xy(1,3),
		xy(2,2),
		xy(1,2)
	]

	const actual = getValidPlaceLocations(boardState, move)

	compareCoordinateArrays(t, actual, expected)

	t.end()

})
