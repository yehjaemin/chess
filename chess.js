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

    if ((selected === undefined || getSide(selected) === side) && isPiece(space) && turn === side) {
        selectPiece(space, piece, side);
    } else if (selected) {
        if (space === selected) {
            selectPiece(space, piece, side);
        } else if (moves.indexOf(space) > -1) {
            movePiece(space);
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

function updateGame(state) {
    const board = document.getElementById('board');
    const banner = document.createElement('header');
    banner.setAttribute('id', 'banner');
    board.appendChild(banner);

    if (state === 'check') {
        const message = document.createTextNode('CHECK');
        banner.appendChild(message);
        banner.classList.add('show');
        setTimeout(function() {
            banner.classList.remove('show');
            board.removeChild(banner);
        }, 500);
    } else if (state === 'checkmate') {
        for (const square of squares) {
            square.removeEventListener('click', onClick);
        }
        const message = document.createTextNode(turn.toUpperCase() + ' CHECKMATE');
        banner.appendChild(message);
        banner.classList.add('show');
    } else if (state === 'stalemate') {
        for (const square of squares) {
            square.removeEventListener('click', onClick);
        }
        const message = document.createTextNode('STALEMATE');
        banner.appendChild(message);
        banner.classList.add('show');
    }
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
            move.style.backgroundImage = 'linear-gradient(rgba(240,255,255,0.5), rgba(240,255,255,0.5))';
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
    setPiece(selected_temp, 'none', 'none');

    // update arrays
    const update_index = updateSideArray(selected_temp, space, -1, selected_side);

    // review move for a check on your king
    // find dangerous areas
    let danger = [];
    if (turn === 'white') {
        danger = findDanger('black');
    } else if (turn === 'black') {
        danger = findDanger('white');
    }
    // check dangerous areas
    for (const d of danger) {
        if (getPiece(d) === 'king' && getSide(d) === turn) {
            // undo move
            setPiece(space, 'none', 'none');
            setPiece(space, space_piece, space_side);
            setPiece(selected_temp, selected_piece, selected_side);
            // update arrays
            updateSideArray(space, selected_temp, update_index, selected_side);
            updateGame('check');
            return game;
        }
    }
    // lift check
    danger = [];
    game = 'play';

    // review move for a check on their king
    // find dangerous areas
    danger = findDanger(turn);
    // check dangerous areas
    for (const d of danger) {
        if (getPiece(d) === 'king' && getSide(d) !== turn) {
            game = 'check';
        }
    }

    // review for checkmate/stalemate
    let end = false;
    // find defendable areas
    let defense = [];
    if (turn === 'white') {
        defense = findDefense('black');
    } else if (turn === 'black') {
        defense = findDefense('white');
    }
    // check all defensive moves
    let end_string = '';
    if (turn === 'white') {
        end_string = checkDefense(defense, 'black');
    } else if (turn === 'black') {
        end_string = checkDefense(defense, 'white');
    }
    if (end_string === 'end') {
        end = true;
    }
    console.log(end_string);

    // checkmate/stalemate
    if (end) {
        if (game === 'check') {
            game = 'checkmate';
        } else if (game === 'play') {
            game = 'stalemate';
        }
        updateGame(game);
    }

    // call updateGame
    updateGame(game);

    // reset selected
    selected = undefined;

    // change turn
    changeTurn();

    // return game
    return game;
}

function updateSideArray(from, to, index, side) {
    if (side === 'white') {
        const b_index = black.indexOf(to);
        white[white.indexOf(from)] = to;
        if (b_index > -1)
            black.splice(b_index, 1);
        if (index > -1)
            black.splice(index, 0, from);
        return b_index;
    } else if (side === 'black') {
        const w_index = white.indexOf(to);
        black[black.indexOf(from)] = to;
        if (w_index > -1)
            white.splice(w_index, 1);
        if (index > -1)
            white.splice(index, 0, from);
        return w_index;
    }
}

function findDanger(side) {
    // find danger areas created by every piece in side
    let danger = [];
    if (side === 'black') {
        for (const b of black) {
            let b_danger = [];  // do NOT set b_danger = moves
            b_danger = b_danger.concat(selectPiece(b, getPiece(b), getSide(b)));
            selectPiece(b, getPiece(b), getSide(b));
            if (getPiece(b) === 'pawn') {
                const one_square = document.querySelector('[data-index="' + (b.dataset.index - 8).toString() + '"]');
                const two_square = document.querySelector('[data-index="' + (b.dataset.index - 16).toString() + '"]');
                const one_square_arr = b_danger.indexOf(one_square);
                const two_square_arr = b_danger.indexOf(two_square);
                if (one_square_arr > -1) {
                    b_danger.splice(one_square_arr, 1);
                }
                if (two_square_arr > -1) {
                    b_danger.splice(two_square_arr, 1);
                }
            }
            danger = danger.concat(b_danger);
        }
    } else if (side === 'white') {
        for (const w of white) {
            let w_danger = [];  // do NOT set w_danger = moves
            w_danger = w_danger.concat(selectPiece(w, getPiece(w), getSide(w)));
            selectPiece(w, getPiece(w), getSide(w));
            if (getPiece(w) === 'pawn') {
                const one_square = document.querySelector('[data-index="' + (w.dataset.index + 8).toString() + '"]');
                const two_square = document.querySelector('[data-index="' + (w.dataset.index + 16).toString() + '"]');
                const one_square_arr = w_danger.indexOf(one_square);
                const two_square_arr = w_danger.indexOf(two_square);
                if (one_square_arr > -1) {
                    w_danger.splice(one_square_arr, 1);
                }
                if (two_square_arr > -1) {
                    w_danger.splice(two_square_arr, 1);
                }
            }
            danger = danger.concat(w_danger);
        }
    }
    // unselect irrelevant piece
    selected = undefined;

    return danger;
}

function findDefense(side) {
    let defense = [];
    if (side === 'black') {
        for (const b of black) {
            let b_defense = [];
            b_defense = b_defense.concat(selectPiece(b, getPiece(b), getSide(b)));
            selectPiece(b, getPiece(b), getSide(b));
            defense.push(b_defense);    // defense[i] is the area defended by black[i]
        }
    } else if (side === 'white') {
        for (const w of white) {
            let w_defense = [];
            w_defense = w_defense.concat(selectPiece(w, getPiece(w), getSide(w)));
            selectPiece(w, getPiece(w), getSide(w));
            defense.push(w_defense);    // defense[i] is the area defended by white[i]
        }
    }
    return defense;
}

function checkDefense(defense, side) {
    let arr = [];
    if (side === 'white') {
        arr = arr.concat(white);
    } else if (side === 'black') {
        arr = arr.concat(black);
    }
    for (let i=0; i < defense.length; i++) {
        const arr_space = arr[i];
        const arr_piece = getPiece(arr_space);
        const arr_side = getSide(arr_space);
        for (let j=0; j < defense[i].length; j++) {
            const def_space = defense[i][j];
            const def_piece = getPiece(def_space);
            const def_side = getSide(def_space);
            // propose defensive move
            setPiece(def_space, 'none', 'none');
            setPiece(def_space, arr_piece, arr_side);
            setPiece(arr_space, 'none', 'none');
            // propose arrays update
            const array_index = updateSideArray(arr_space, def_space, -1, arr_side);
            // find dangerous areas
            let proposed_danger = [];
            if (side === 'white') {
                proposed_danger = findDanger('black');
            } else if (side === 'black') {
                proposed_danger = findDanger('white');
            }
            // check dangerous areas
            let proposed_check = false;
            for (const p of proposed_danger) {
                if (getPiece(p) === 'king' && getSide(p) !== turn) {
                    proposed_check = true;
                }
            }
            // undo defensive move
            setPiece(def_space, 'none', 'none');
            setPiece(def_space, def_piece, def_side);
            setPiece(arr_space, arr_piece, arr_side);
            // undo arrays update
            updateSideArray(def_space, arr_space, array_index, arr_side);
            // return for broken check
            if (proposed_check === false) {
                return 'play';
            }
        }
    }
    return 'end';
}