<script lang="ts">
    import type { ColorGrid, GridSelectionView, Pos } from "$lib/types";
    import { makePos } from "$lib/types";

    export let data: ColorGrid;
    export let selectedSets: GridSelectionView = [];

    const cellSize = 15; // You can adjust this value
    const strokeWidth = 2;

    $: width = data[0].length * cellSize;
    $: height = data.length * cellSize;

    $: console.log("refresh grid: ", selectedSets);

    function generateSelectionPath(selection: Set<Pos>): string {
        if (selection.size === 0) return "";

        let path = "";
        const directions = [
            [-1, 0],
            [1, 0],
            [0, 1],
            [0, -1],
        ];

        for (let y = 0; y <= data.length; y++) {
            for (let x = 0; x <= data[0].length; x++) {
                if (selection.has(makePos(y, x))) {
                    for (let [dx, dy] of directions) {
                        const nextX = x + dx;
                        const nextY = y + dy;
                        if (!selection.has(makePos(nextY, nextX))) {
                            // This edge is on the border
                            const startX =
                                x * cellSize + (dx === 1 ? cellSize : 0);
                            const startY =
                                y * cellSize + (dy === 1 ? cellSize : 0);
                            const endX =
                                x * cellSize + (dx === -1 ? 0 : cellSize);
                            const endY =
                                y * cellSize + (dy === -1 ? 0 : cellSize);
                            path += `M ${startX} ${startY} L ${endX} ${endY} `;
                        }
                    }
                }
            }
        }

        return path;
    }
</script>

<svg
    width={width + strokeWidth * 2}
    height={height + strokeWidth * 2}
    viewBox={`0 0 ${width + strokeWidth * 2} ${height + strokeWidth * 2}`}
>
    <g transform="translate({strokeWidth}, {strokeWidth})">
        {#each data as row, rowix}
            {#each row as cell, cellix}
                <rect
                    x={cellix * cellSize}
                    y={rowix * cellSize}
                    width={cellSize}
                    height={cellSize}
                    class="symbol_{cell}"
                />
            {/each}
        {/each}

        {#each selectedSets as selection}
            <path
                d={generateSelectionPath(selection)}
                class="selection-border"
            />
        {/each}
    </g>
</svg>

<style>
    svg {
        background-color: #444;
        margin: 20px;
    }

    rect {
        stroke: #444;
        stroke-width: 1;
        vector-effect: non-scaling-stroke;
    }
    .selection-border {
        stroke: #fff;
        stroke-width: 2;
        pointer-events: none;
        fill: none;
    }
    .symbol_0 {
        fill: #111;
    }
    .symbol_1 {
        fill: #0074d9;
    } /* blue */
    .symbol_2 {
        fill: #ff4136;
    } /* red */
    .symbol_3 {
        fill: #2ecc40;
    } /* green */
    .symbol_4 {
        fill: #ffdc00;
    } /* yellow */
    .symbol_5 {
        fill: #aaaaaa;
    } /* grey */
    .symbol_6 {
        fill: #f012be;
    } /* fuschia */
    .symbol_7 {
        fill: #ff851b;
    } /* orange */
    .symbol_8 {
        fill: #7fdbff;
    } /* teal */
    .symbol_9 {
        fill: #870c25;
    } /* brown */
</style>
