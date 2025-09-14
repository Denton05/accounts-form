<script setup lang="ts">
import { QuestionFilled } from '@element-plus/icons-vue'
import type { Account } from './stores/accounts';
import { useAccountsStore } from './stores/accounts';
import AccountRow from './components/AccountRow.vue';

const store = useAccountsStore();

function add() {
  store.addDraft();
}

function formatLabels(account: Account): string {
  return account.labels.length
    ? account.labels.map(l => l.text).join('; ')
    : '-';
}
</script>

<template>
  <main class="container">
    <div class="header-row">
      <div class="header-top">
        <el-text size="large" tag="h1">Учетные записи</el-text>
        <el-button type="primary" size="small" @click="add">+</el-button>
      </div>
      <el-alert 
        type="primary"
        effect="light"
        :closable="false"
        show-icon
      >
        <template #icon>
          <QuestionFilled />
        </template>
        <template #title>
          <span class="hint-text">
            Для указания нескольких меток для одной пары логин/пароль используйте разделитель ;
          </span>
        </template>
      </el-alert>
    </div>

    <el-card v-for="account in store.items" :key="account.id" class="mb12">
      <div class="row">
        <strong>Метки:</strong>
        <span>{{formatLabels(account)}}</span>
      </div>
      <div class="row"><strong>Тип записи:</strong><span>{{account.type}}</span></div>
      <div class="row"><strong>Логин:</strong><span>{{account.login}}</span></div>
      <div class="row"><strong>Пароль:</strong><span>{{account.type==='LDAP' ? '-' : '••••'}}</span></div>
      <div class="account-actions">
        <el-button size="small" @click="store.editItem(account.id)">Редактировать</el-button>
        <el-button size="small" type="danger" @click="store.remove(account.id)">Удалить</el-button>
      </div>
    </el-card>

    <AccountRow v-for="d in store.drafts" :key="d.id" :id="d.id" />
  </main>
</template>

<style scoped>
  .header-row {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
    margin-bottom: 16px;
}

  .header-top {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 12px;
  }

  .hint-text {
    color: #000;
  }

  .row {
    display:flex;
    gap: 8px;
    margin: 4px 0;
  }

  .account-actions {
    margin-top:8px;
    display:flex;
    gap: 8px;
  }
</style>  