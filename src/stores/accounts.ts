import { defineStore } from 'pinia'
import { nanoid } from 'nanoid'

export type AccountType = 'LDAP' | 'LOCAL'

export interface Account {
    id: string;
    labels: { text: string }[];
    type: AccountType;
    login: string;
    password: string | null;
}

export interface AccountDraft{
    id: string;
    labelsInput: string;
    type: AccountType | null;
    login: string;
    password: string;
}

export type DraftErrors = Partial<Record<'type' | 'login' | 'password' | 'labelsInput', string>>;
export type SaveResult = { ok: true} | {ok: false; errors: DraftErrors };

export function parseLabels(input:string): { text: string }[] {
    return input
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0)
        .map(s => ({text: s}));
}

export function validateDraft(draft: AccountDraft): DraftErrors {
    const errors: DraftErrors = {};
    
    const labels = parseLabels(draft.labelsInput);
    if (labels.some(l => l.text.length > 50))
        errors.labelsInput = 'Метка не более 50 символов на элемент';

    if (!draft.type)
        errors.type = 'Укажите тип';

    if (!draft.login.trim())
        errors.login = 'Логин обязателен'
    else if (draft.login.trim().length > 100)
        errors.login = 'Логин не более 100 символов'

    if (draft.type === 'LOCAL') {
        if (!draft.password.trim())
            errors.password = 'Пароль обязателен'
        else if (draft.password.trim().length > 100)
            errors.password = 'Пароль не более 100 символов';
    }

    return errors;
}

export function toAccount(draft: AccountDraft): Account {
    return {
        id: draft.id,
        labels: parseLabels(draft.labelsInput),
        type: draft.type as AccountType,
        login: draft.login.trim(),
        password: (draft.type === 'LDAP') ? null : draft.password.trim()
    };
}

export const useAccountsStore = defineStore('accounts', {
    state: () => ({
        items: [] as Account[],
        drafts: [] as AccountDraft[]
    }),
    getters: {
        getItemById: (state) => (id: string) => state.items.find(i => i.id === id),
        getDraftById: (state) => (id: string) => state.drafts.find(d => d.id === id)
    },
    actions: {
        addDraft() {
            const id = nanoid();
            this.drafts.push({
                id,
                labelsInput: '',
                type: null,
                login: '',
                password: ''
            });
            return id;
        },
        remove(id: string) {
            this.items = this.items.filter(i => i.id !== id);
            this.drafts = this.drafts.filter(d => d.id !== id);
        },
        saveFromDraft(id: string): SaveResult {
            const draft = this.getDraftById(id);
            if (!draft)
                return { ok: false, errors: {}};
            
            const errors = validateDraft(draft);
            if (Object.keys(errors).length)
                return { ok: false, errors }

            if (draft.type === 'LDAP')
                draft.password = '';

            const account = toAccount(draft);
            const idx = this.items.findIndex(a => a.id === id);
            if (idx >= 0)
                this.items.splice(idx, 1, account);
            else
                this.items.push(account);

            this.drafts = this.drafts.filter(x => x.id !== id);
            return { ok: true };
        },
        patchDraft<T extends keyof AccountDraft>(id: string, key: T, value: AccountDraft[T]) {
            const draft = this.getDraftById(id);

            if(!draft)
                return;

            if (key === 'type') {
                draft.type = value as AccountType;

                if(draft.type === 'LDAP')
                    draft.password = '';
            } 
            else {
                (draft[key] as any) = value;
            }
        },
        editItem(id: string) {
            const account = this.getItemById(id);

            if(!account)
                return;

            const existing = this.getDraftById(id);
            if(existing)
                return;

            this.drafts.push({
                id: account.id,
                labelsInput: account.labels.map(x => x.text).join('; '),
                type: account.type,
                login: account.login,
                password: account.type === 'LOCAL' ? (account.password ?? '') : '',
            });
        },
    },
    persist: {
        enabled: true,
        strategies: [{ paths: ['items']} ]
    },
});