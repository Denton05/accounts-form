<script setup lang="ts">
import { computed } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import type { AccountType } from '../stores/accounts';

const props = defineProps<{id: string}>();
const store = useAccountsStore();

const draft = computed(() => store.getDraftById(props.id));
const errors = computed(() => store.draftErrors[props.id] || {});

function onBlur() {
    if (!draft.value)
        return;

    store.saveFromDraft(props.id);
}

function onTypeChange(val: AccountType | null) {
    store.patchDraft(props.id, 'type', val);
    store.saveFromDraft(props.id);
}
</script>

<template>
    <el-form :key="props.id" v-if="draft" :model="draft" label-width="auto">
        <el-form-item label="Метки" :error="errors.labelsInput">
            <el-input
                :model-value="draft.labelsInput"
                placeholder="метка1; метка2"
                @update:model-value="value => store.patchDraft(props.id, 'labelsInput', value)"
                @blur="onBlur"
            />
            <el-text type="info" size="small">Несколько через ";", до 50 символов на метку</el-text>
        </el-form-item>

        <el-form-item label="Тип записи" :error="errors.type">
            <el-select
                :model-value="draft.type"
                placeholder="Выберите"
                clearable
                @change="onTypeChange"
            >
                <el-option label="LDAP" value="LDAP" />
                <el-option label="Локальная" value="LOCAL" />
            </el-select>
        </el-form-item>

        <el-form-item label="Логин" :error="errors.login">
            <el-input
                :model-value="draft.login"
                @update:model-value="value => store.patchDraft(props.id, 'login', value)"
                @blur="onBlur"
                :maxlength="100"
                show-word-limit
            />
        </el-form-item>

        <el-form-item
            v-if="draft.type === 'LOCAL'"
            label="Пароль"
            :error="errors.password"
        >
            <el-input
                :model-value="draft.password"
                type="password"
                @update:model-value="value => store.patchDraft(props.id, 'password', value)"
                @blur="onBlur"
                :maxlength="100"
                show-password
            >
                <template #suffix>
                    <el-text type="info" size="small">
                        {{ (draft.password?.length ?? 0) }}/100
                    </el-text>
                </template>
            </el-input>
        </el-form-item>

        <div class="actions">
            <el-button size="small" type="danger" @click="store.remove(props.id)">Удалить</el-button>
        </div>
    </el-form>
</template>

<style scoped>
    .actions {
        margin-top: 12px;
        display: flex;
        gap: 8px;
        justify-content: flex-end;
    }
</style>