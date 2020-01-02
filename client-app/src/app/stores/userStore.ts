import { history } from './../../index';
import { runInAction } from 'mobx';
import { RootStore } from './rootStore';
import { IUser, IUserFormValues } from './../models/user';
import { observable, computed, action } from 'mobx';
import agent from '../api/agent';

export default class UserStore {
  rootStore: RootStore;
  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable user: IUser | null = null;

  @computed get isLoggedIn() {
    return !!this.user;
  }

  @action login = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.login(values);
      runInAction('Log in user', () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      throw error;
    }
  };

  @action logout = async () => {
    this.rootStore.commonStore.setToken(null);
    this.user = null;
    history.push('/');
  };

  @action getUser = async () => {
    try {
      const user = await agent.User.current();
      runInAction('Get current user', () => {
        this.user = user;
      });
    } catch (error) {
      console.log(error);
    }
  };

  @action register = async (values: IUserFormValues) => {
    try {
      const user = await agent.User.register(values);
      runInAction('Register user', () => {
        this.user = user;
      });
      this.rootStore.commonStore.setToken(user.token);
      this.rootStore.modalStore.closeModal();
      history.push('/activities');
    } catch (error) {
      console.log(Object.values(error.data.errors).flat());
      throw error;
    }
  };
}
