class Grid {
    startLocation;

    constructor(height, width) {
        this.height = height;
        this.width = width;
        // 0 = empty space
        // 1 = starting point
        // 2 = ending point
        // 3 = obstacle
        // 4 = path, given by GA
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.width; j++ ) {
                this.grid[i].push(0);
            }
        }
        console.log(this.grid);
    }

    displayGrid() {
        const body = document.querySelector("#container");
        body.replaceChildren([]);
        for (let i = 0; i < this.height; i++) {
            const row = (document.createElement("div"));
            row.classList.add("row");
            for (let j = 0; j < this.width; j++) {
                const cell = document.createElement("div");
                cell.classList.add("cell");
                switch (this.grid[i][j]) {
                    case 1:
                        cell.classList.add("start");
                        break;
                    case 2:
                        cell.classList.add("end");
                        break;
                    case 3:
                        cell.classList.add("obstacle");
                        break;
                    case 4:
                        cell.classList.add("path");
                        break;
                    default:
                        cell.classList.add("blank");
                }
                cell.onclick = () => cellOnClick(this, i, j);
                row.appendChild(cell);
            }
            body.appendChild(row);
        }
    }

    placeStart(row, col) {
        if (this.grid[row][col] !== 0) return;
        for (let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                if (this.grid[i][j] === 1) {
                    this.grid[i][j] = 0;
                }
            }
        }
        this.grid[row][col] = 1;
        startLocation = [row, col];
    }

    placeEnd(row, col) {
        if (this.grid[row][col] !== 0) return;
        for (let i = 0; i < this.height; i++) {
            for(let j = 0; j < this.width; j++) {
                if (this.grid[i][j] === 2) {
                    this.grid[i][j] = 0;
                }
            }
        } 
        this.grid[row][col] = 2;
    }

    placeObstacle(row, col) {
        if (this.grid[row][col] !== 0 && this.grid[row][col] !== 3) return;
        if (this.grid[row][col] === 3) {
            this.grid[row][col] = 0;
        } else {
            this.grid[row][col] = 3;
        }
    }
}

const cellOnClick = (grid, row, col) => {
    const startRadio = document.querySelector("#start");
    const endRadio = document.querySelector("#end");
    const obstacleRadio = document.querySelector("#obstacle");

    if (startRadio.checked) {
        grid.placeStart(row,col);
    } else if (endRadio.checked) {
        grid.placeEnd(row,col);
    } else if (obstacleRadio.checked) {
        grid.placeObstacle(row,col);
    }

    grid.displayGrid();
}

document.addEventListener("DOMContentLoaded", () => {
    const mainGrid = new Grid(10, 10);
    mainGrid.displayGrid();
});