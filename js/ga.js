/* Genetic Algorithm Function
    codeLength = # of moves that can be encoded in the DNA sequence
    grid = Grid object
*/
export const ga = (codeLength, grid) => {
    // To encode 5 possible moves at each step in the DNA sequence, we require three bits
    // to avoid nonsense/meaningless DNA sequences, we add redunancy for some moves
    // Note, the reason why STAY is an acceptable option in the DNA sequence is to allow
    // the shortest path to be much less than the codeLength
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
        let ptrRow = grid.startLocation[0];
        let ptrCol = grid.startLocation[1];
        let fitValue = 0;

        for (let i = 0; i < moveList.length; i++) {
            if (UP.includes(moveList[i])) {
                ptrRow--;
            } else if (RIGHT.includes(moveList[i])) {
                ptrCol++;
            } else if (DOWN.includes(moveList[i])) {
                ptrRow++;
            } else if (LEFT.includes(moveList[i])) {
                ptrCol--;
            }

            // Penalize illegal DNA sequences
            if (ptrRow > grid.height | ptrRow < 0 | ptrCol > grid.width | ptrCol < 0 | grid.grid[ptrRow][ptrCol] === 3) {
                return 0;
            }
            fitValue++;
        }

        // Ensure that the final cell we reach is the end block
        if (grid.grid[ptrRow][ptrCol] !== 2) {
            return 0;
        }

        return (1 / (Math.E ** fitValue));
    };

    // DNA: a binary array of size codeLength * 3
    const binaryToMoves = (dna) => {
        const moveList = [];
        for (let i = 0; i < codeLength; i++) {
            moveList.push(dna[3*i]*4 + dna[3*i + 1]*2 + dna[3*i + 2]);
        }
        return moveList;
    };

    // this function may be unnecessary
    const movesToBinary = (moveList) => {
        const conversion = {
            stay: [0,0,0],
            up: [0,0,1],
            right: [0,1,0],
            down: [0,1,1],
            left: [1,0,0]
        };

        const dna = [];
        
        for (let i = 0; i < moveList.length; i++) {
            if (STAY.includes(moveList[i])) {
                dna.concat(conversion.stay);
            } else if (UP.includes(moveList[i])) {
                dna.concat(conversion.up);
            } else if (RIGHT.includes(moveList[i])) {
                dna.concat(conversion.right);
            } else if (DOWN.includes(moveList[i])) {
                dna.concat(conversion.down);
            } else if (LEFT.includes(moveList[i])) {
                dna.concat(conversion.left);
            }
        }

        return dna;
    };

    // How is this not a default JS function?
    const sum = (arr) => {
        let result = 0;
        for (let i = 0; i < arr.length; i++) {
            result += arr[i];
        }
        return result;
    }

    const select = (population, fitValues) => {
        const fitnessSum = sum(fitValues);
        let prob = fitValues[0] / fitnessSum;
        const probabilities = [prob];

        for (let i = 1; i < population.length; i++) {
            prob = fitValues[i] / fitnessSum;
            probabilities.push(prob + probabilities[i-1]);
        }

        const newPopulation = [];
        for (let i = 0; i < popSize; i++) {
            const randomResult = Math.random() // floating point between 0 and 1
            for (let j = 0; j < popSize; j++) {
                if (randomResult < probabilities[j]) {
                    newPopulation.push(population[j]);
                    break;
                }
            }
        }

        return newPopulation;
    };

    const crossover = (parent, population) => {
        
    };

    const mutate = (child) => {

    };

    const generateInitialPop = (number) => {

    };


};


