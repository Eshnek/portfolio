<template>
    <div class="home">
        <Bio />

        <div class="cards">
            <Card
                title="Teek"
                description="Game in development. Uses a proprietary engine written with C++20. The game utilizes the ECS design pattern."
                link="https://teek.info" :blank="true"
            />

            <Card
                title="DayForm"
                description="Daily accountability form delivered by text message. Responses are encrypted client-side using a derived key."
                link="https://dayform.io" :blank="true"
            />

            <Card
                title="Match"
                description="High Performance Log Validator"
                link="https://github.com/CitadelStronghold/match"
            />
            <Card
                title="Gem Linux"
                description="Arch Linux® Based ISO Distribution"
                link="https://github.com/CitadelStronghold/gem"
            />

            <Card
                title="C++ Starter"
                description="Starter C++23 Project with CMake and Ninja"
                link="https://github.com/Eshnek/starter"
            />
            <Card
                title="TypeList"
                description="C++ type manipulation header"
                link="https://github.com/Eshnek/typelist"
            />
            <Card
                title="Format"
                description="My official clang-format configuration"
                link="https://github.com/Eshnek/format"
            />

            <Card
                title="Power Commit"
                description="A Visual Studio Code Extension for performing quick Git commits"
                link="https://github.com/CitadelStronghold/power-commit"
            />
            <Card
                title="Smart Backspace"
                description="A Visual Studio Code Extension for deleting empty lines when backspace is pressed"
                link="https://github.com/CitadelStronghold/smart-backspace"
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
    }
}
</style>
