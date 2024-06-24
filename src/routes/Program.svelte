<script lang="ts">
	import { createEventDispatcher } from 'svelte';
    import { parse_program, parse_stmt } from '$lib/lang/interp';

    export let program: string = "";

    let parsedProgram = parse_program(program);
    let lastParsedIx = program.length;

    const dispatch = createEventDispatcher();


    function oninput(event: any) {
        console.log(event, event.getTargetRanges(), event.target.value);
        if (event.inputType === "insertLineBreak") {
            // Whenever user types a newline, we want to parse additions to the program and, if it parses, dispatch.
            
            let newProgram = event.target.value.slice(lastParsedIx);
            let stmt = parse_stmt(newProgram);
            if (stmt) {
                lastParsedIx = event.target.value.length;
                dispatch('runStatement', {statement: stmt});
            }
            
        } else {
            // if they have deleted a newline, we want to remove the last line from the program
            
        }
    }

</script>

<textarea on:input={oninput}>{program}</textarea>

<style>

textarea {
    height: 12em;
}

</style>