const immutableUpdate = require('immutability-helper')
const extend = require('xtend')

const getSquare = require('tak-game/get-square')
const moveIsValid = require('tak-game/move-is-valid')
const squareIsOwnedBy = require('tak-game/square-is-owned-by')
// const { topPieceOfSquare: topPieceOfSquareIsCapstone } = require('tak-game/is-capstone')
const piecesPickedUpFromSquare = require('tak-game/pieces-picked-up-from-square')

module.exports = function(boardState, move) {
	if (move.type === 'PLACE') {
		return getValidPlacementSpaces(boardState, move)
	} else if (move.type === 'MOVE') {
		if (typeof move.x !== 'number' || typeof move.y !== 'number') {
			return getMoveablePieces(boardState, move)
		} else if (!move.axis || !move.direction) {
			return getMoveOptionsNextToStartingSquare(boardState, move)
		} else if (Array.isArray(move.drops) && move.drops.length > 0) {
			return getMoveOptionsAfterStartingAMove(boardState, move)
		} else {
			throw new Error(`What kind of move is that?`)
		}
	} else {
		throw new Error(`${move && move.type} is not a valid move type`)
	}
}

function getMoveablePieces(boardState, move) {
	return getAllCoordinates(boardState, move).map(move => {
		return { move, square: getSquare(boardState, move) }
	})
	.filter(({ move, square }) => squareIsOwnedBy(square, boardState.whoseTurn))
	.map(({move}) => move)
}

function getAllCoordinates(boardState, move) {
	const size = boardState.size

	console.log('move is', move)
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
		}))
	}, [])
}

function justCoordinates({ x, y }) {
	return { x, y }
}

function ad(axis, direction) {
	return { axis, direction }
}

function math(direction, number) {
	return direction === '-' ? number - 1 : number + 1
}

function dropMoveToCoordinates(move) {
	const coordinates = justCoordinates(move)
	coordinates[move.axis] = math(move.direction, coordinates[move.axis])
	return coordinates
}

function getMoveOptionsNextToStartingSquare(boardState, move) {
	const pickedUp = piecesPickedUpFromSquare(boardState, move)
	const currentSquareOption = justCoordinates(move)
	const drops = [0, pickedUp]

	return [
		ad('x', '+'),
		ad('x', '-'),
		ad('y', '+'),
		ad('y', '-'),
	].map(choice => extend(move, choice, { drops }))
	.filter(move => moveIsValid(boardState, move))
	.map(dropMoveToCoordinates)
	.concat(currentSquareOption)
}

function getMoveOptionsAfterStartingAMove(boardState, move) {
	throw new Error('getMoveOptionsAfterStartingAMove')
}

function getValidPlacementSpaces(boardState, move) {
	return getAllCoordinates(boardState, move).filter(move => moveIsValid(boardState, move))
}

function rangeOf(n) {
	const ary = []
	for (var i = 0; i < n; ++i) {
		ary.push(i)
	}
	return ary
}
