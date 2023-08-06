<template>
    <div class="day-night-picker">
        <input v-model="night" class="day-night" type="checkbox" @input="onToggled" />

        <div class="slider" />
        <div class="slider-border" />
    </div>
</template>

<script lang="ts">
const DEFAULT_DAY: boolean = false;

export default {
    data() {
        return {
            night: !DEFAULT_DAY,
        };
    },
    methods: {
        onToggled(event: any) {
            this.night = event.target.checked;

            this.changed();
        },

        changed() {
            this.applyTheme();

            this.save();
        },
        applyTheme() {
            document.documentElement.setAttribute(
                "data-theme",
                this.night ? "darkMode" : ""
            );
        },

        save() {
            localStorage.setItem("night", `${this.night}`);
        },
        restore() {
            const value = localStorage.getItem("night");

            if (value == null) {
                return;
            }

            this.night = value === "true";
        },
    },
    mounted() {
        this.restore();

        this.changed();
    },
};
</script>

<style scoped lang="scss">
.day-night-picker {
    width: 48px;
    height: 100%;

    display: flex;
    align-items: center;
    justify-content: center;

    input.day-night {
        position: absolute;
        height: 24px;
        width: inherit;

        cursor: pointer;

        opacity: 0;
        z-index: 1000;
    }

    .slider {
        width: 16px;
        height: 16px;
        border-radius: 100%;

        background-color: var(--color-background-day);
        transform: translate(-50%, 0%);
        border: 2px solid var(--color-border-day);
        transition: background-color 0.1s ease-in-out, transform 0.1s ease-in-out,
            border 0.1s ease-in-out;

        z-index: 1;
    }

    .day-night:checked~.slider {
        background-color: var(--color-background-night);
        transform: translate(50%, 0%);
        border: 2px solid var(--color-border-night);
    }

    .slider-border {
        position: absolute;
        width: 36px;
        height: 20px;

        border: 1px solid var(--color-border-dark);
        border-radius: 12px;

        background-color: var(--color-background-button);
        z-index: 0;
    }
}
</style>
