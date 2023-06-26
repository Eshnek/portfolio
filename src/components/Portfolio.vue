<template>
    <div class="home">
        <Bio />

        <div class="cards">
            <Card class="card-top"
                title="Teek"
                description="Game in development. Uses a proprietary engine written with C++20. The game utilizes the ECS design pattern."
                link="https://teek.info" :blank="true"
            />

            <Card class="card-top"
                title="DayForm"
                description="Daily accountability form delivered by text message. Responses are encrypted client-side using a derived key."
                link="https://dayform.io" :blank="true"
            />

            <Card class="card-top"
                title="Match"
                description="High Performance Log Validator"
                link="https://github.com/CitadelStronghold/match"
            />
            <Card class="card-top"
                title="Gem Linux"
                description="Arch Linux® Based ISO Distribution"
                link="https://github.com/CitadelStronghold/gem"
            />

            <Card class="card-middle"
                title="C++ Starter"
                description="Starter C++23 Project with CMake and Ninja"
                link="https://github.com/Eshnek/starter"
            />
            <Card class="card-middle"
                title="TypeList"
                description="C++ type manipulation header"
                link="https://github.com/Eshnek/typelist"
            />
            <Card class="card-middle"
                title="Format"
                description="My official clang-format configuration"
                link="https://github.com/Eshnek/format"
            />

            <Card class="card-middle"
                title="Power Commit"
                description="A Visual Studio Code Extension for performing quick Git commits"
                link="https://github.com/CitadelStronghold/power-commit"
            />
        </div>
    </div>
</template>

<script lang="ts">
import Card from "@/components/Card.vue";
import Bio from "@/components/Bio.vue";

export default {
    components: { Card, Bio },
};
</script>

<style lang="scss" scoped>
.home {
    display: flex;
    flex-direction: column;
    align-items: center;

    padding-top: var(--padding-page);

    .cards {
        width: 100%;
        height: min-content;

        display: grid;

        grid-template-columns: 1fr 1fr 1fr 1fr;
        grid-template-rows: auto;
        justify-items: center;

        padding: var(--padding-page);

        .card-top {
        }
        .card-middle {
        }
    }
}
</style>
