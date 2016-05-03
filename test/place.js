const test = require('tape')
const p = require('tak-game/parse-position')
const getValidPlaceLocations = require('../')

function fewRandomPieces(whoseTurn = 'x') {
	return p(`
		x|  |
		 |  |O
		 |o^|
	`, whoseTurn)
}
function xy(x, y) {
	return { x, y }
}
function compare(coordinatesA, coordinatesB) {
	return coordinatesA.x === coordinatesB.x
		&& coordinatesA.y === coordinatesB.y
}

test('place a new piece', t => {
	const boardState = fewRandomPieces()

	const move = {
		type: 'PLACE',
		piece: 'x',
		standing: false
	}

	const expected = [
		xy(0,0),
		xy(2,0),
		xy(0,1),
		xy(1,1),
		xy(1,2),
		xy(2,2)
	]

	const actual = getValidPlaceLocations(boardState, move)

	t.equal(actual.length, expected.length)
	t.ok(expected.every(coordinates => {
		return actual.findIndex(possibleMatch => compare(coordinates, possibleMatch)) !== -1
	}))

	t.end()
})
