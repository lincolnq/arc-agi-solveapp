<script lang="ts">

    import type { Pos, InterpState, ProblemData } from '$lib/types';
    import {range} from '$lib/types';

    import { onMount } from 'svelte';
    import Grid from './Grid.svelte';
    import Example from './Example.svelte';
    import Program from './Program.svelte';
    import { gridSelectionView, interp_stmt, makeInterpState } from '$lib/lang/interp';

    let problem_data: ProblemData = {train: [], test: []};

    // for each example, need one interpreter state
    let example_interp_states: InterpState[] = [];

    // need one for test also

    let program = "";

    onMount(async () => {
        //const res = await fetch('/data/evaluation/007bbfb7.json')
        const res = await fetch('/data/training/007bbfb7.json')
        
        problem_data = await res.json();

        // initialize interp states
        example_interp_states = problem_data.train.map((example) => makeInterpState(example.input));
    })

    // called whenever the user types a new (valid parsed) statement in the program
    function onRunStatement(event: any) {

        // run the statement on each interp state
        let new_interp_states = []
        for (let i=0; i < example_interp_states.length; i++) {

            new_interp_states.push(interp_stmt(event.detail.statement, example_interp_states[i]));
            if (i === 0) {
                console.log(new_interp_states[i].getCurrentSelectionView());
            }
        }

        example_interp_states = new_interp_states;
    }

</script>

<h1>Solver</h1>

<div class="main">

<div class="examples">
    {#each problem_data.train as example, i (i)}
        <Example example={example} selectedSets={example_interp_states[i].getCurrentSelectionView()} />
    {/each}
</div>

<div class="program">
    <h2>Program</h2>
    <Program program={program} on:runStatement={onRunStatement} />
</div>
</div>


<style>
.main {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}

</style>