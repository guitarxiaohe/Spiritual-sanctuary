import { defineStore } from "pinia";
import type { UserState } from './type';
 export const useUserStore = defineStore('user', {
  state: (): UserState => ({
    name: '',
    email: '',
    avatar: '',
    phone: '',
    address: '',
    id: ''
  })
});

