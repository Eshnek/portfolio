<template>
    <div class="card">
        <div class="card-title card-text">
            <h1>{{ title }}</h1>
        </div>
        <div class="card-description card-text">
            {{ description }}
        </div>
    </div>
</template>

<script lang="ts">
export default {
    props: {
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
}
</script>

<style scoped lang="scss">
.card {
    min-width: 256px;
    min-height: 128px;
    max-width: 512px;
    max-height: 1024px;

    width: min-content;
    height: min-content;

    border: 1px solid var(--color-border-card);
    border-radius: 8px;

    background-color: var(--color-background-card);

    padding: var(--padding-card);

    box-shadow: 3px 3px 4px 0px var(--color-shadow-card);

    .card-title {

    }
    .card-text {
        width: 100%;

        text-align: center;
        overflow-wrap: break-word;
    }
}
</style>
