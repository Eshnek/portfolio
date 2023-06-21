<template>
    <div class="home">
        <Card title="Match" description="High Performance Log Validator" />
        <Card title="Gem Linux" description="Arch Linux® Based ISO Distribution" />
    </div>
</template>

<script lang="ts">
import Card from '@/components/Card.vue';

export default {
    components: { Card },
}
</script>

<style scoped>
.home {
    display: flex;
    justify-content: center;

    padding: var(--padding-page);
}
</style>
