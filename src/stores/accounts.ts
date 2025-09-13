import { defineStore } from 'pinia'

export type AccountType = 'LDAP' | 'LOCAL'
export interface Account {
    id: string;
    labels: {text: string}[];
    type: AccountType;
    login: string;
    password: string | null;
}

export const useAccountsStore = defineStore('accounts', {
    state: () => ({items: [] as Account[]}),
    persist: true,
})