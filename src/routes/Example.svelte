<script lang="ts">
    import type { ColorGrid, GridSelectionView, ProblemExample } from '$lib/types';

    export let example: ProblemExample;
    export let selectedSets: GridSelectionView = new Map();
    import Grid from './Grid.svelte';

</script>

<div class="example">
    <Grid data={example.input} selectedSets={selectedSets} />
    {#if example.output}
        <Grid data={example.output} />
    {/if}
</div>

<style>
    .example {
        display: flex;
        flex-direction: row;
        justify-content: space-around;
    }
</style>