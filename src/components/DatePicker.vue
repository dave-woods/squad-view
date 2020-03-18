<template>
    <v-menu
        v-model="datePopout"
        :close-on-content-click="false"
        transition="scale-transition"
        offset-y
        min-width="290px"
    >
        <template v-slot:activator="{ on }">
            <v-text-field
                :value="value"
                @input="selectDate"
                :label="label"
                prepend-icon="mdi-calendar"
                readonly
                v-on="on"
            ></v-text-field>
        </template>
        <v-date-picker
            :value="value"
            @input="selectDate"
            :min="min"
            :max="max"
        ></v-date-picker>
    </v-menu>
</template>

<script>
export default {
    props: ['value', 'label', 'min', 'max'],
    data() {
        return {
            datePopout: false
        }
    },
    methods: {
        selectDate(val) {
            this.$emit('input', val)
            this.datePopout = false
        }
    }
}
</script>