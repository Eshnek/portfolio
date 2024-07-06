<template>
    <div class="card" :class="cardClass" :style="cardStyle" @click="onClickedBroad">
        <img v-if="icon" :src="icon" :alt="title" class="card-icon" :class="iconClass" />
        <Corner class="card-corner" v-if="link" :color="1" :blank="blank" @click="onClickedCorner" />

        <div class="card-title card-text">
            <h1>{{ title }}</h1>
        </div>
        <div v-if="hasDescription" class="divider" />
        <div v-if="hasDescription" class="card-description card-text">
            <slot></slot>
        </div>
    </div>
</template>

<script lang="ts">
import Corner from "@/components/Corner.vue";

export default {
    components: { Corner },
    props: {
        title: {
            type: String,
            required: true,
        },

        link: {
            type: String,
            required: false,
        },
        blank: {
            type: Boolean,
            required: false,
            default: false,
        },
        small: {
            type: Boolean,
            required: false,
            default: false,
        },
        background: {
            type: String,
            required: false,
            default: '',
        },
        foreground: {
            type: String,
            required: false,
            default: '',
        },
        icon: {
            type: String,
            required: false,
        },
        round: {
            type: Boolean,
            required: false,
            default: false,
        }
    },
    computed: {
        cardClass() {
            const link = this.link ? 'card-linked' : 'card-unlinked';
            const small = this.small? 'card-small' : '';

            return `${link} ${small}`;
        },
        cardStyle() {
            const background = this.background !== '' ? `background-color: ${this.background};` : '';
            const foreground = this.foreground !== '' ? `color: ${this.foreground};` : '';

            return background + foreground;
        },

        iconClass() {
            return this.round ? `icon-round` : '';
        },

        hasDescription() {
            return this.$slots.default;
        }
    },
    methods: {
        onClickedBroad() {
            if(!this.small) {
                this.openLink();
            }
        },
        onClickedCorner() {
            if(this.small) {
                this.openLink();
            }
        },

        openLink() {
            if (!this.link) {
                return;
            }

            window.open(this.link, "_blank")?.focus();
        },
    },
};
</script>

<style scoped lang="scss">
.card {
    min-width: 256px;
    min-height: 32px;
    max-width: 512px;
    max-height: 1024px;

    width: min-content;
    height: min-content;

    border: 1px solid var(--color-border-card);
    border-radius: 8px;

    background-color: var(--color-background-card);

    padding: var(--padding-card);
    margin: var(--margin-card);

    box-shadow: 3px 3px 4px 0px var(--color-shadow-card);

    transition: transform 0.2s ease-in-out;
    position: relative;

    overflow: hidden;
    .card-text {
        width: 100%;

        text-align: center;
        overflow-wrap: break-word;
    }

    .card-corner,
    .card-icon {
        position: absolute;
    }

    .card-icon {
        top: var(--pading-card);
        left: var(--padding-card);

        image-rendering: auto;
        image-rendering: crisp-edges;
        image-rendering: pixelated;

        width: 28px;
        height: 28px;
    }
    .card-corner {
        top: 0;
        right: 0;

        width: 32px;
        height: 32px;
    }

    .divider {
        width: 100%;
        height: 1px;

        padding-left: 32px;
        padding-right: 32px;

        margin-top: var(--margin-card-title);
    }
}

.card:hover {
    transform: scale(1.025);
}

.card-linked:not(.card-small) {
    cursor: pointer;
}

.card-unlinked {
    cursor: default;
}

.icon-round {
    border: 0px solid transparent;
    border-radius: 8px;
}
</style>
