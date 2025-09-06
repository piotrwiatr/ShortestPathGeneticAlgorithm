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

    const popSize = 3000;
    const crossRate = 0.8;
    const mutationRate = 0.003;
    const numGenerations = 100;
    // 3 bits to encode 5 possible moves per iteration
    const dnaSize = codeLength * 3;

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
            if (ptrRow >= grid.height || ptrRow < 0 || ptrCol >= grid.width || ptrCol < 0) {
                return 1 / dnaSize;
            }
            if (grid.grid[ptrRow][ptrCol] === 3) {
                return 1 / dnaSize;
            }
            
            if (STAY.includes(moveList[i]))
                continue;
            fitValue++;
        }

        // Ensure that the final cell we reach is the end block
        if (grid.grid[ptrRow][ptrCol] !== 2) {
            return 1 / dnaSize;
        }

        return (1 / fitValue);
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
    };

    // And this?
    const max = (arr) => {
        let max = 0;

        for (let i = 1; i < arr.length; i++) {
            if (arr[max] < arr[i]) 
                max = i;
        }

        return max;
    };

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
                if (randomResult <= probabilities[j]) {
                    newPopulation.push(population[j]);
                    break;
                }
            }
        }
        
        return newPopulation;
    };

    const crossover = (parent, population) => {
        if (Math.random() > crossRate) return;

        let randParent;
        do {
            randParent = Math.floor(Math.random() * popSize);
        } while (randParent === parent);

        const beginCrossPoint = Math.floor(Math.random() * dnaSize);
        const endCrossPoint = Math.floor(Math.random() * dnaSize);

        // End condition of the for loop is i <= endCrossPoint 
        // because Math.floor(Math.random() * dnaSize) yields a value 
        // of [0, dnaSize-1]
        for (let i = beginCrossPoint; i <= endCrossPoint; i++) {
            population[parent][i] = population[randParent][i];
        }
    };

    const mutate = (child, population) => {
        for (let i = 0; i < dnaSize; i++) {
            if (Math.random() < mutationRate) {
                population[child][i] = population[child][i] === 1 ? 0 : 1;
            }
        }
    };

    const generateInitialPopulationDumbly = () => {
        const newPopulation = [];
        for (let i = 0; i < popSize; i++) {
            const newOrganism = [];
            for (let j = 0; j < dnaSize; j++) {
                newOrganism.push(Math.floor(Math.random() * 7));
            }
            newPopulation.push(newOrganism);
        }
        return newPopulation;
    };

    const bfs = (population, previousMoves, ptrRow, ptrCol) => {
        if (population.length > popSize) return;
        else if (ptrRow === grid.endLocation[0] && ptrCol === grid.endLocation[1]) {
            population.push(previousMoves);
            return;
        } else if (previousMoves.length > codeLength 
                    || ptrRow < 0 
                    || ptrRow >= grid.height 
                    || ptrCol < 0
                    || ptrCol >= grid.width) {
            return;
        } 
        const moveUp = previousMoves.slice();
        moveUp.push(UP[0]);

        const moveDown = previousMoves.slice();
        moveDown.push(DOWN[0]);

        const moveLeft = previousMoves.slice();
        moveLeft.push(LEFT[0]);

        const moveRight = previousMoves.slice();
        moveRight.push(RIGHT[0]);

        // Move up
        bfs(population, moveUp, ptrRow - 1, ptrCol);
        // Move down
        bfs(population, moveDown, ptrRow + 1, ptrCol);
        // Move left
        bfs(population, moveLeft, ptrRow, ptrCol - 1);
        // Move right
        bfs(population, moveRight, ptrRow, ptrCol + 1);
    };

    const generateInitialPopulationIntelligently = () => {
        const population = [];
        bfs(population, [], grid.startLocation[0], grid.startLocation[1]);
        return population.slice(0, popSize);
    };


    const drawPath = (moveList) => {
        let ptrRow = grid.startLocation[0];
        let ptrCol = grid.startLocation[1];

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
            if (ptrRow >= grid.height || ptrRow < 0 || ptrCol >= grid.width || ptrCol < 0) {
                throw Error("Provided path is invalid");
            }
            if (grid.grid[ptrRow][ptrCol] === 3) 
                throw Error("Provided path is invalid");

            if (grid.grid[ptrRow][ptrCol] !== 0)
                 continue;
            grid.grid[ptrRow][ptrCol] = 4;
        }
    };

    // Run the GA simulation
    let population = generateInitialPopulationIntelligently();
    console.log(population);
    let populationPhenotypes = population.map(binaryToMoves);
    let populationFitnesses = populationPhenotypes.map(fitness);

    for (let i = 0; i < numGenerations; i++) {
        console.log(`now at generation ${i}`);
        population = select(population, populationFitnesses);
        for (let j = 0; j < popSize; j++) {
            crossover(j, population);
            mutate(j, population);
        }

        populationPhenotypes = population.map(binaryToMoves);
        populationFitnesses = populationPhenotypes.map(fitness);
    }

    const bestPhenotype = populationPhenotypes[max(populationFitnesses)];
    console.log(bestPhenotype);
    drawPath(bestPhenotype);
};


