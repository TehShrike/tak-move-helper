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
	t.equal(actual.length, expected.length, 'Same number of coordinates')
	t.ok(expected.every(expectedCoordinates => {
		return actual.findIndex(actualMove => compare(expectedCoordinates, actualMove)) !== -1
	}), 'Same coordinates given')
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

test(`find all places you can move a given square when you haven't picked a direction yet`, t => {
	const boardState = fewRandomPieces('o')

	const expected = [
		xy(0,2),
		xy(1,3),
		xy(2,2),
		xy(1,2)
	]

	function assert(move) {
		const actual = getValidPlaceLocations(boardState, move)

		compareCoordinateArrays(t, actual, expected)
	}

	assert({
		type: 'MOVE',
		x: 1,
		y: 2
	})

	assert({
		type: 'MOVE',
		x: 1,
		y: 2,
		drops: []
	})

	assert({
		type: 'MOVE',
		x: 1,
		y: 2,
		drops: [1]
	})

	t.end()

})

test('After starting a move, where can you go next? x+', t => {
	const boardState = fewRandomPieces('o')

	const move = {
		type: 'MOVE',
		x: 1,
		y: 2,
		axis: 'x',
		direction: '+',
		drops: [1, 1]
	}

	const expected = [
		xy(2,2),
		xy(3,2)
	]

	const actual = getValidPlaceLocations(boardState, move)

	compareCoordinateArrays(t, actual, expected)

	t.end()
})

test('After starting a move, where can you go next? x-', t => {
	const boardState = fewRandomPieces('o')

	const move = {
		type: 'MOVE',
		x: 1,
		y: 2,
		axis: 'x',
		direction: '-',
		drops: [1, 1]
	}

	const expected = [
		xy(0,2),
	]

	const actual = getValidPlaceLocations(boardState, move)

	compareCoordinateArrays(t, actual, expected)

	t.end()
})
