export const ga = (codeLength, grid) => {
    let STAY = [0];
    let UP = [1, 5];
    let RIGHT = [2,6];
    let DOWN = [3, 7];
    let LEFT = [4];

    let popSize = 100;
    let crossRate = 0.8;
    let mutationRate = 0.003;
    let numGenerations = 100;

    const fitness = (moveList) => {
        let ptrRow;
        let ptrCol;

        for (let i = 0; i < grid.height; i++) {
            for (let j = 0; j < grid.width; j++) {
                if (grid.grid[i][j] === 1) {
                    ptrRow = i;
                    ptrCol = j;
                    break;
                }
            }
        }
    };

    const binaryToMoves = (dna) => {

    };

    // this function may be unnecessary
    const movesToBinary = (dna) => {

    };



};


