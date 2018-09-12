// file paths for piece icons
const pawn_black = 'icons/noun_Pawn_190272_000000.svg';
const pawn_white = 'icons/noun_Pawn_190272_FFFFFF.svg';
const rook_black = 'icons/noun_rook_190287_000000.svg';
const rook_white = 'icons/noun_rook_190287_FFFFFF.svg';
const knight_black = 'icons/noun_knight_190264_000000.svg';
const knight_white = 'icons/noun_knight_190264_FFFFFF.svg';
const bishop_black = 'icons/noun_Bishop_190251_000000.svg';
const bishop_white = 'icons/noun_Bishop_190251_FFFFFF.svg';
const queen_black = 'icons/noun_queen_190277_000000.svg';
const queen_white = 'icons/noun_queen_190277_FFFFFF.svg';
const king_black = 'icons/noun_King_190257_000000.svg';
const king_white = 'icons/noun_King_190257_FFFFFF.svg';

// game state variables
let selected = undefined;   // selected piece
let moves = [];             // moves for selected piece
let white = [];             // white spaces
let black = [];             // black spaces
let danger = [];            // enemy spaces
let turn = 'white';         // turn state
let game = 'play';          // game state

// 57-64, 49-56, ..., 1-8
const squares = document.querySelectorAll('#board div');
for (const square of squares) {
    square.addEventListener('click', onClick);
    setBoard(square);
}

function setBoard(space) {
    // determine row and col
    const index = parseInt(space.dataset.index);
    let row = Math.floor(index / 8) + 1;
    let col = index % 8;

    if (col === 0) {
        col = 8;
        row--;
    }

    // assign square color
    if ((row + col) % 2 === 1) {
        space.style.backgroundColor = 'peachpuff';
    }

    // assign pieces
    if (row === 1) {
        if (col === 1 || col === 8)
            setPiece(space, 'rook', 'white');
        else if (col === 2 || col === 7)
            setPiece(space, 'knight', 'white');
        else if (col === 3 || col === 6)
            setPiece(space, 'bishop', 'white');
        else if (col === 4)
            setPiece(space, 'queen', 'white');
        else if (col === 5)
            setPiece(space, 'king', 'white');
        white.push(space);
    } else if (row === 2) {
        setPiece(space, 'pawn', 'white');
        white.push(space);
    } else if (row === 7) {
        setPiece(space, 'pawn', 'black');
        black.push(space);
    } else if (row === 8) {
        if (col === 1 || col === 8)
            setPiece(space, 'rook', 'black');
        else if (col === 2 || col === 7)
            setPiece(space, 'knight', 'black');
        else if (col === 3 || col === 6)
            setPiece(space, 'bishop', 'black');
        else if (col === 4)
            setPiece(space, 'queen', 'black');
        else if (col === 5)
            setPiece(space, 'king', 'black');
        black.push(space);
    } else {
        setPiece(space, 'none', 'none');
    }
}

function onClick(event) {
    const space = event.currentTarget;
    const piece = getPiece(space);
    const side = getSide(space);
    if (selected === undefined && isPiece(space) && turn === side) {
        selectPiece(space, piece, side);
    } else if (selected) {
        if (space === selected) {
            selectPiece(space, piece, side);
        } else if (moves.indexOf(space) > -1) {
            if (movePiece(space) === 'checkmate') {
                endGame();
            }
        }
    }
}

function changeTurn() {
    if (turn === 'white') {
        turn = 'black';
    } else if (turn === 'black') {
        turn = 'white';
    }
}

function endGame() {
    for (const square of squares) {
        square.removeEventListener('click', onClick);
    }
    changeTurn();
    const banner = document.getElementById('banner');
    const message = document.createTextNode('WINNER: ' + turn.toUpperCase());
    banner.appendChild(message);
    banner.style.display = 'block';
}

function isPiece(space) {
    return space.dataset.piece !== 'none';
}

function getPiece(space) {
    return space.dataset.piece;
}

function getSide(space) {
    return space.dataset.side;
}

function selectPiece(space, piece, side) {
    if (selected === space) {
        selected = undefined;
    } else {
        selected = space;
    }
    // reset moves
    for (const move of moves) {
        move.style.backgroundImage = '';
    }
    moves = [];

    // determine row and col
    const index = parseInt(space.dataset.index);
    let row = Math.floor(index / 8) + 1;
    let col = index % 8;

    if (col === 0) {
        col = 8;
        row--;
    }

    // determine available moves
    if (piece === 'pawn') {
        // data index of possible moves
        const one_white = index + 8;
        const two_white = index + 16;
        const one_black = index - 8;
        const two_black = index - 16;
        const left_white = index + 7;
        const right_white = index + 9;
        const left_black = index - 9;
        const right_black = index - 7;

        // possible moves
        const one_white_square = document.querySelector('[data-index="' + one_white.toString() + '"]');
        const two_white_square = document.querySelector('[data-index="' + two_white.toString() + '"]');
        const one_black_square = document.querySelector('[data-index="' + one_black.toString() + '"]');
        const two_black_square = document.querySelector('[data-index="' + two_black.toString() + '"]');
        const left_white_square = document.querySelector('[data-index="' + left_white.toString() + '"]');
        const right_white_square = document.querySelector('[data-index="' + right_white.toString() + '"]');
        const left_black_square = document.querySelector('[data-index="' + left_black.toString() + '"]');
        const right_black_square = document.querySelector('[data-index="' + right_black.toString() + '"]');

        /*
        console.log('[one_white="' + one_white.toString() + '"]');
        console.log('[two_white="' + two_white.toString() + '"]');
        console.log('[one_black="' + one_black.toString() + '"]');
        console.log('[two_black="' + two_black.toString() + '"]');
        console.log('[left_white="' + left_white.toString() + '"]');
        console.log('[right_white="' + right_white.toString() + '"]');
        console.log('[left_black="' + left_black.toString() + '"]');
        console.log('[right_black="' + right_black.toString() + '"]');
        */

        if (two_white_square && !isPiece(two_white_square) && side === 'white' && row === 2) {
            moves.push(two_white_square);
        } else if (two_black_square && !isPiece(two_black_square) && side === 'black' && row === 7) {
            moves.push(two_black_square);
        }
        // one forward
        if (one_white_square && !isPiece(one_white_square) && side === 'white') {
            moves.push(one_white_square);
        } else if (one_black_square && !isPiece(one_black_square) && side === 'black') {
            moves.push(one_black_square);
        }
        // left diagonal
        if (left_white >= 0 && col !== 1 && getSide(left_white_square) === 'black' && side === 'white') {
            moves.push(left_white_square);
        } else if (left_black < squares.length && col !== 1 && getSide(left_black_square) === 'white' && side === 'black') {
            moves.push(left_black_square);
        }
        // right diagonal
        if (right_white >= 0 && col !== 8 && getSide(right_white_square) === 'black' && side === 'white') {
            moves.push(right_white_square);
        } else if (right_black < squares.length && col !== 8 && getSide(right_black_square) === 'white' && side === 'black') {
            moves.push(right_black_square);
        }
    } else if (piece === 'rook') {
        // possible directions
        let up = index + 8;
        let down = index - 8;
        let left = index - 1;
        let right = index + 1;

        // possible moves
        let up_square = document.querySelector('[data-index="' + up.toString() + '"]');
        while (up_square) {
            if (isPiece(up_square)) {
                if ((side === 'white' && getSide(up_square) === 'black') || (side === 'black' && getSide(up_square) === 'white'))
                    moves.push(up_square);
                break;
            }
            moves.push(up_square);
            up+=8;
            up_square = document.querySelector('[data-index="' + up.toString() + '"]');
        }

        let down_square = document.querySelector('[data-index="' + down.toString() + '"]');
        while (down_square) {
            if (isPiece(down_square)) {
                if ((side === 'white' && getSide(down_square) === 'black') || (side === 'black' && getSide(down_square) === 'white'))
                    moves.push(down_square);
                break;
            }
            moves.push(down_square);
            down-=8;
            down_square = document.querySelector('[data-index="' + down.toString() + '"]');
        }

        let left_square = document.querySelector('[data-index="' + left.toString() + '"]');
        while (left_square && left % 8 !== 0) {
            if (isPiece(left_square)) {
                if ((side === 'white' && getSide(left_square) === 'black') || (side === 'black' && getSide(left_square) === 'white'))
                    moves.push(left_square);
                break;
            }
            moves.push(left_square);
            left--;
            left_square = document.querySelector('[data-index="' + left.toString() + '"]');
        }

        let right_square = document.querySelector('[data-index="' + right.toString() + '"]');
        while (right_square && right % 8 !== 1) {
            if (isPiece(right_square)) {
                if ((side === 'white' && getSide(right_square) === 'black') || (side === 'black' && getSide(right_square) === 'white'))
                    moves.push(right_square);
                break;
            }
            moves.push(right_square);
            right++;
            right_square = document.querySelector('[data-index="' + right.toString() + '"]');
        }
    } else if (piece === 'knight') {
        // data index of possible moves
        const up_left_flat = index - 2 + 8;
        const up_left_tall = index - 1 + 16;
        const up_right_flat = index + 2 + 8;
        const up_right_tall = index + 1 + 16;
        const down_left_flat = index - 2 - 8;
        const down_left_tall = index - 1 - 16;
        const down_right_flat = index + 2 - 8;
        const down_right_tall = index + 1 - 16;

        // possible moves
        let up_left_flat_square = undefined;
        let down_left_flat_square = undefined;
        let up_left_tall_square = undefined;
        let down_left_tall_square = undefined;
        let up_right_flat_square = undefined;
        let down_right_flat_square = undefined;
        let up_right_tall_square = undefined;
        let down_right_tall_square = undefined;

        if (index - 1 % 8 !== 0 && index - 2 % 8 !== 0) {
            up_left_flat_square = document.querySelector('[data-index="' + up_left_flat.toString() + '"]');
            down_left_flat_square = document.querySelector('[data-index="' + down_left_flat.toString() + '"]');
        }
        if (index - 1 % 8 !== 0) {
            up_left_tall_square = document.querySelector('[data-index="' + up_left_tall.toString() + '"]');
            down_left_tall_square = document.querySelector('[data-index="' + down_left_tall.toString() + '"]');
        }
        if (index + 1 % 8 !== 0 && index + 2 % 8 !== 0) {
            up_right_flat_square = document.querySelector('[data-index="' + up_right_flat.toString() + '"]');
            down_right_flat_square = document.querySelector('[data-index="' + down_right_flat.toString() + '"]');
        }
        if (index + 1 % 8 !== 0) {
            up_right_tall_square = document.querySelector('[data-index="' + up_right_tall.toString() + '"]');
            down_right_tall_square = document.querySelector('[data-index="' + down_right_tall.toString() + '"]');
        }

        if (up_left_flat_square && (!isPiece(up_left_flat_square) || side !== getSide(up_left_flat_square))) {
            moves.push(up_left_flat_square);
        }
        if (down_left_flat_square && (!isPiece(down_left_flat_square) || side !== getSide(down_left_flat_square))) {
            moves.push(down_left_flat_square);
        }
        if (up_left_tall_square && (!isPiece(up_left_tall_square) || side !== getSide(up_left_tall_square))) {
            moves.push(up_left_tall_square);
        }
        if (down_left_tall_square && (!isPiece(down_left_tall_square) || side !== getSide(down_left_tall_square))) {
            moves.push(down_left_tall_square);
        }
        if (up_right_flat_square && (!isPiece(up_right_flat_square) || side !== getSide(up_right_flat_square))) {
            moves.push(up_right_flat_square);
        }
        if (down_right_flat_square && (!isPiece(down_right_flat_square) || side !== getSide(down_right_flat_square))) {
            moves.push(down_right_flat_square);
        }
        if (up_right_tall_square && (!isPiece(up_right_tall_square) || side !== getSide(up_right_tall_square))) {
            moves.push(up_right_tall_square);
        }
        if (down_right_tall_square && (!isPiece(down_right_tall_square) || side !== getSide(down_right_tall_square))) {
            moves.push(down_right_tall_square);
        }
    } else if (piece === 'bishop') {
        // possible directions
        let up_left = index + 8 - 1;
        let up_right = index + 8 + 1;
        let down_left = index - 8 - 1;
        let down_right = index - 8 + 1;

        // possible moves
        let up_left_square = document.querySelector('[data-index="' + up_left.toString() + '"]');
        while (up_left_square && up_left % 8 !== 0) {
            if (isPiece(up_left_square)) {
                if ((side === 'white' && getSide(up_left_square) === 'black') || (side === 'black' && getSide(up_left_square) === 'white'))
                    moves.push(up_left_square);
                break;
            }
            moves.push(up_left_square);
            up_left+=7;
            up_left_square = document.querySelector('[data-index="' + up_left.toString() + '"]');
        }

        let up_right_square = document.querySelector('[data-index="' + up_right.toString() + '"]');
        while (up_right_square && up_right % 8 !== 1) {
            if (isPiece(up_right_square)) {
                if ((side === 'white' && getSide(up_right_square) === 'black') || (side === 'black' && getSide(up_right_square) === 'white'))
                    moves.push(up_right_square);
                break;
            }
            moves.push(up_right_square);
            up_right+=9;
            up_right_square = document.querySelector('[data-index="' + up_right.toString() + '"]');
        }

        let down_left_square = document.querySelector('[data-index="' + down_left.toString() + '"]');
        while (down_left_square && down_left % 8 !== 0) {
            if (isPiece(down_left_square)) {
                if ((side === 'white' && getSide(down_left_square) === 'black') || (side === 'black' && getSide(down_left_square) === 'white'))
                    moves.push(down_left_square);
                break;
            }
            moves.push(down_left_square);
            down_left-=9;
            down_left_square = document.querySelector('[data-index="' + down_left.toString() + '"]');
        }

        let down_right_square = document.querySelector('[data-index="' + down_right.toString() + '"]');
        while (down_right_square && down_right % 8 !== 1) {
            if (isPiece(down_right_square)) {
                if ((side === 'white' && getSide(down_right_square) === 'black') || (side === 'black' && getSide(down_right_square) === 'white'))
                    moves.push(down_right_square);
                break;
            }
            moves.push(down_right_square);
            down_right-=7;
            down_right_square = document.querySelector('[data-index="' + down_right.toString() + '"]');
        }
    } else if (piece === 'queen') {
        // possible directions
        let up = index + 8;
        let down = index - 8;
        let left = index - 1;
        let right = index + 1;
        let up_left = index + 8 - 1;
        let up_right = index + 8 + 1;
        let down_left = index - 8 - 1;
        let down_right = index - 8 + 1;

        // possible moves
        let up_square = document.querySelector('[data-index="' + up.toString() + '"]');
        while (up_square) {
            if (isPiece(up_square)) {
                if ((side === 'white' && getSide(up_square) === 'black') || (side === 'black' && getSide(up_square) === 'white'))
                    moves.push(up_square);
                break;
            }
            moves.push(up_square);
            up+=8;
            up_square = document.querySelector('[data-index="' + up.toString() + '"]');
        }

        let down_square = document.querySelector('[data-index="' + down.toString() + '"]');
        while (down_square) {
            if (isPiece(down_square)) {
                if ((side === 'white' && getSide(down_square) === 'black') || (side === 'black' && getSide(down_square) === 'white'))
                    moves.push(down_square);
                break;
            }
            moves.push(down_square);
            down-=8;
            down_square = document.querySelector('[data-index="' + down.toString() + '"]');
        }

        let left_square = document.querySelector('[data-index="' + left.toString() + '"]');
        while (left_square && left % 8 !== 0) {
            if (isPiece(left_square)) {
                if ((side === 'white' && getSide(left_square) === 'black') || (side === 'black' && getSide(left_square) === 'white'))
                    moves.push(left_square);
                break;
            }
            moves.push(left_square);
            left--;
            left_square = document.querySelector('[data-index="' + left.toString() + '"]');
        }

        let right_square = document.querySelector('[data-index="' + right.toString() + '"]');
        while (right_square && right % 8 !== 1) {
            if (isPiece(right_square)) {
                if ((side === 'white' && getSide(right_square) === 'black') || (side === 'black' && getSide(right_square) === 'white'))
                    moves.push(right_square);
                break;
            }
            moves.push(right_square);
            right++;
            right_square = document.querySelector('[data-index="' + right.toString() + '"]');
        }

        let up_left_square = document.querySelector('[data-index="' + up_left.toString() + '"]');
        while (up_left_square && up_left % 8 !== 0) {
            if (isPiece(up_left_square)) {
                if ((side === 'white' && getSide(up_left_square) === 'black') || (side === 'black' && getSide(up_left_square) === 'white'))
                    moves.push(up_left_square);
                break;
            }
            moves.push(up_left_square);
            up_left+=7;
            up_left_square = document.querySelector('[data-index="' + up_left.toString() + '"]');
        }

        let up_right_square = document.querySelector('[data-index="' + up_right.toString() + '"]');
        while (up_right_square && up_right % 8 !== 1) {
            if (isPiece(up_right_square)) {
                if ((side === 'white' && getSide(up_right_square) === 'black') || (side === 'black' && getSide(up_right_square) === 'white'))
                    moves.push(up_right_square);
                break;
            }
            moves.push(up_right_square);
            up_right+=9;
            up_right_square = document.querySelector('[data-index="' + up_right.toString() + '"]');
        }

        let down_left_square = document.querySelector('[data-index="' + down_left.toString() + '"]');
        while (down_left_square && down_left % 8 !== 0) {
            if (isPiece(down_left_square)) {
                if ((side === 'white' && getSide(down_left_square) === 'black') || (side === 'black' && getSide(down_left_square) === 'white'))
                    moves.push(down_left_square);
                break;
            }
            moves.push(down_left_square);
            down_left-=9;
            down_left_square = document.querySelector('[data-index="' + down_left.toString() + '"]');
        }

        let down_right_square = document.querySelector('[data-index="' + down_right.toString() + '"]');
        while (down_right_square && down_right % 8 !== 1) {
            if (isPiece(down_right_square)) {
                if ((side === 'white' && getSide(down_right_square) === 'black') || (side === 'black' && getSide(down_right_square) === 'white'))
                    moves.push(down_right_square);
                break;
            }
            moves.push(down_right_square);
            down_right-=7;
            down_right_square = document.querySelector('[data-index="' + down_right.toString() + '"]');
        }
    } else if (piece === 'king') {
        // possible directions
        let up = index + 8;
        let down = index - 8;
        let left = index - 1;
        let right = index + 1;
        let up_left = index + 8 - 1;
        let up_right = index + 8 + 1;
        let down_left = index - 8 - 1;
        let down_right = index - 8 + 1;

        // possible moves
        let up_square = document.querySelector('[data-index="' + up.toString() + '"]');
        if (up_square) {
            if (isPiece(up_square)) {
                if ((side === 'white' && getSide(up_square) === 'black') || (side === 'black' && getSide(up_square) === 'white'))
                    moves.push(up_square);
            } else
                moves.push(up_square);
        }

        let down_square = document.querySelector('[data-index="' + down.toString() + '"]');
        if (down_square) {
            if (isPiece(down_square)) {
                if ((side === 'white' && getSide(down_square) === 'black') || (side === 'black' && getSide(down_square) === 'white'))
                    moves.push(down_square);
            } else
                moves.push(down_square);
        }

        let left_square = document.querySelector('[data-index="' + left.toString() + '"]');
        if (left_square && left % 8 !== 0) {
            if (isPiece(left_square)) {
                if ((side === 'white' && getSide(left_square) === 'black') || (side === 'black' && getSide(left_square) === 'white'))
                    moves.push(left_square);
            } else
                moves.push(left_square);
        }

        let right_square = document.querySelector('[data-index="' + right.toString() + '"]');
        if (right_square && right % 8 !== 1) {
            if (isPiece(right_square)) {
                if ((side === 'white' && getSide(right_square) === 'black') || (side === 'black' && getSide(right_square) === 'white'))
                    moves.push(right_square);
            } else
                moves.push(right_square);
        }

        let up_left_square = document.querySelector('[data-index="' + up_left.toString() + '"]');
        if (up_left_square && up_left % 8 !== 0) {
            if (isPiece(up_left_square)) {
                if ((side === 'white' && getSide(up_left_square) === 'black') || (side === 'black' && getSide(up_left_square) === 'white'))
                    moves.push(up_left_square);
            } else
                moves.push(up_left_square);
        }

        let up_right_square = document.querySelector('[data-index="' + up_right.toString() + '"]');
        if (up_right_square && up_right % 8 !== 1) {
            if (isPiece(up_right_square)) {
                if ((side === 'white' && getSide(up_right_square) === 'black') || (side === 'black' && getSide(up_right_square) === 'white'))
                    moves.push(up_right_square);
            } else
                moves.push(up_right_square);
        }

        let down_left_square = document.querySelector('[data-index="' + down_left.toString() + '"]');
        if (down_left_square && down_left % 8 !== 0) {
            if (isPiece(down_left_square)) {
                if ((side === 'white' && getSide(down_left_square) === 'black') || (side === 'black' && getSide(down_left_square) === 'white'))
                    moves.push(down_left_square);
            } else
                moves.push(down_left_square);
        }

        let down_right_square = document.querySelector('[data-index="' + down_right.toString() + '"]');
        if (down_right_square && down_right % 8 !== 1) {
            if (isPiece(down_right_square)) {
                if ((side === 'white' && getSide(down_right_square) === 'black') || (side === 'black' && getSide(down_right_square) === 'white'))
                    moves.push(down_right_square);
            } else
                moves.push(down_right_square);
        }
    }

    // highlight available moves
    if (space === selected) {
        for (const move of moves) {
            move.style.backgroundImage = 'linear-gradient(rgba(255,255,255,0.3), rgba(255,255,255,0.3))';
        }
    }
    return moves;
}

function setPiece(space, piece, side) {
    space.dataset.piece = piece;
    space.dataset.side = side;
    const image = document.createElement('img');

    if (side === 'white') {
        if (piece === 'pawn') {
            image.src = pawn_white;
            image.style.width = '75%';
        } else if (piece === 'rook') {
            image.src = rook_white;
        } else if (piece === 'knight') {
            image.src = knight_white;
        } else if (piece === 'bishop') {
            image.src = bishop_white;
        } else if (piece === 'queen') {
            image.src = queen_white;
        } else if (piece === 'king') {
            image.src = king_white;
        }
        space.appendChild(image);
    } else if (side === 'black') {
        if (piece === 'pawn') {
            image.src = pawn_black;
            image.style.width = '75%';
        } else if (piece === 'rook') {
            image.src = rook_black;
        } else if (piece === 'knight') {
            image.src = knight_black;
        } else if (piece === 'bishop') {
            image.src = bishop_black;
        } else if (piece === 'queen') {
            image.src = queen_black;
        } else if (piece === 'king') {
            image.src = king_black;
        }
        space.appendChild(image);
    }

    if (piece === 'none' || side === 'none') {
        space.innerHTML = '';
    }

    return space.dataset.index;
}

function movePiece(space) {
    const space_piece = getPiece(space);
    const space_side = getSide(space);
    const selected_temp = selected;
    const selected_piece = getPiece(selected);
    const selected_side = getSide(selected);

    // move piece
    setPiece(space, 'none', 'none');
    setPiece(space, selected_piece, selected_side);
    setPiece(selected, 'none', 'none');

    // update arrays
    if (turn === 'white') {
        white[white.indexOf(selected_temp)] = space;
    } else if (turn === 'black') {
        black[black.indexOf(selected_temp)] = space;
    }

    // review move
    if (game === 'check') {
        // check dangerous areas
        for (const d of danger) {
            if (getPiece(d) === 'king' && getSide(d) === turn) {
                // undo move
                setPiece(space, 'none', 'none');
                setPiece(space, space_piece, space_side);
                setPiece(selected_temp, selected_piece, selected_side);
                // update arrays
                if (turn === 'white') {
                    white[white.indexOf(space)] = selected_temp;
                } else if (turn === 'black') {
                    black[black.indexOf(space)] = selected_temp;
                }
                return game;
            }
        }

        // lift check
        danger = [];
        game = 'play';
    }

    // update game
    selectPiece(space, selected_piece, selected_side);
    selected = undefined;
    for (const move of moves) {
        if (getPiece(move) === 'king' && getSide(move) !== getSide(space)) {
            // find dangerous areas
            if (turn === 'black') {
                for (const b of black) {
                    danger = danger.concat(selectPiece(b, getPiece(b), getSide(b)));
                }
            } else if (turn === 'white') {
                for (const w of white) {
                    danger = danger.concat(selectPiece(w, getPiece(w), getSide(w)));
                }
            }
            selected = undefined;

            // check for checkmate
            let king_moves = [];
            let checkmate = true;
            if (turn === 'black') {
                for (const w of white) {
                    if (getPiece(w) === 'king') {
                        king_moves = selectPiece(w, getPiece(w), getSide(w));
                    }
                }
            } else if (turn === 'white') {
                for (const b of black) {
                    if (getPiece(b) === 'king') {
                        king_moves = selectPiece(b, getPiece(b), getSide(b));
                    }
                }
            }
            selected = undefined;

            for (const king_move of king_moves) {
                if (danger.indexOf(king_move) < 0) {
                    checkmate = false;
                }
            }

            if (checkmate) {
                game = 'checkmate';
                break;
            }

            // update game
            game = 'check';
            break;
        }
    }

    // reset moves
    for (const move of moves) {
        move.style.backgroundImage = '';
    }
    moves = [];

    // change turn
    changeTurn();

    // return game
    return game;
}