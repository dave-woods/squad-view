<template>
    <v-card flat class="mx-auto px-4">
        <v-list light>
            <div v-for="(stat, statIdx) in stats" :key="statIdx">
                <v-divider v-if="statIdx > 0"></v-divider>
                <v-list-item>
                    <v-list-item-content>
                        {{ stat.text[long ? 'long' : 'short'] }}
                    </v-list-item-content>
                    <v-list-item-content>
                        {{ stat.value }}
                    </v-list-item-content>
                </v-list-item>
            </div>
        </v-list>
    </v-card>
</template>
<script>
export default {
    props: {
        stats: Array,
        long: Boolean
    }
}
</script>