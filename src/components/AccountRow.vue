<script setup lang="ts">
import { computed } from 'vue';
import { useAccountsStore } from '../stores/accounts';
import type { AccountType } from '../stores/accounts';

const props = defineProps<{id: string}>();
const store = useAccountsStore();

const draft = computed(() => store.getDraftById(props.id));

function onBlur() {
    if (!draft.value)
        return;

    store.saveFromDraft(props.id);
}

function onTypeChange(val: AccountType) {
    store.patchDraft(props.id, 'type', val);
    store.saveFromDraft(props.id);
}
</script>

<template>
    <el-card v-if="draft" class="mb12">
        <div class="form-grid">
            <label>Метки</label>
            <el-input
                :model-value="draft.labelsInput"
                placeholder="метка1; метка2"
                @update:model-value="value => store.patchDraft(props.id, 'labelsInput', value)"
                @blur="onBlur"
            />
            <div></div>
            <el-text type="info" size="small">Несколько через ";", до 50 символов на метку</el-text>

            <label>Тип записи</label>
            <el-select
                :model-value="draft.type"
                placeholder="Выберите"
                clearable
                @change="onTypeChange"
            >
                <el-option label="LDAP" value="LDAP" />
                <el-option label="Локальная" value="LOCAL" />
            </el-select>

            <label>Логин</label>
            <el-input
                :model-value="draft.login"
                @update:model-value="value => store.patchDraft(props.id, 'login', value)"
                @blur="onBlur"
                :maxlength="100"
                show-word-limit
            />

            <template v-if="draft.type === 'LOCAL'">
                <label>Пароль</label>
                <el-input
                    :model-value="draft.password"
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
            </template>
        </div>

        <div class="actions">
            <el-button size="small" type="danger" @click="store.remove(props.id)">Удалить</el-button>
        </div>
    </el-card>
</template>

<style scoped>
.form-grid {
    display: grid;
    grid-template-columns: 160px 1fr;
    gap: 12px;
    align-items: center;
}

.actions {
    margin-top: 12px;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
}
</style>