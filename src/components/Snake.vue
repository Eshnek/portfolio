<template>
    <div ref="root" class="snake" />
</template>

<script lang="ts">
import * as Snake from '../snake';

export default {
    mounted() {
        this.hookReload();
        this.goSnake();
    },
    methods: {
        hookReload(): void {
            this.$router.afterEach((to, from) => {
                if (to.path === '/') {
                    location.reload();
                }
            });
        },
        goSnake(): void {
            const elem = this.$refs.root as HTMLElement;

            Snake.go(elem);
        }
    },
}
</script>

<style lang="scss" scoped>
.snake {
    height: 180px;
    width: 882px;

    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-snake);

    overflow: hidden;
}
</style>
