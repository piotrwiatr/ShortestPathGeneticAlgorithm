class Grid {
    constructor(height, width) {
        this.height = height;
        this.width = width;
        // 0 = empty space
        // 1 = starting point
        // 2 = ending point
        // 3 = obstacle
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.width; j++ ) {
                this.grid[i].push(0);
            }
        }
        console.log(this.grid);
    }

    displayGrid(body) {
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
                    default:
                        cell.classList.add("blank");
                }
                cell.id = `${i}S${j}`;
                row.appendChild(cell);
            }
            body.appendChild(row);
        }
    }
}

const createUpdateEvents = (grid, h, w) => {
    return 0;
}

document.addEventListener("DOMContentLoaded", () => {
    const body = document.querySelector("#container");
    const mainGrid = new Grid(10, 10);
    mainGrid.displayGrid(body);
});