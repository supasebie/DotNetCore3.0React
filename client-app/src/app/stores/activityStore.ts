import { setActivityProps, createAttendee } from './../common/util/util';
import { RootStore } from './rootStore';
import { observable, action, computed, runInAction } from 'mobx';
import { SyntheticEvent } from 'react';
import { IActivity } from '../models/activity';
import agent from '../api/agent';
import { history } from '../..';
import { toast } from 'react-toastify';

export default class ActivityStore {
  rootStore: RootStore;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
  }

  @observable activityRegistry = new Map();
  @observable activity: IActivity | null = null;
  @observable loadingInitial: boolean = false;
  @observable submitting = false;
  @observable target = '';
  @observable loading = false;

  @computed get activitiesByDate() {
    return this.groupActivitiesByDate(
      Array.from(this.activityRegistry.values())
    );
  }

  groupActivitiesByDate(activities: IActivity[]) {
    const sortedActivities = activities.sort(
      (a, b) => a.date.getTime() - b.date.getTime()
    );
    return Object.entries(
      sortedActivities.reduce((activities, activity) => {
        const date = activity.date.toISOString().split('T')[0];
        activities[date] = activities[date]
          ? [...activities[date], activity]
          : [activity];
        return activities;
      }, {} as { [key: string]: IActivity[] })
    );
  }

  @action loadActivities = async () => {
    this.loadingInitial = true;
    try {
      const activities = await agent.Activities.list();
      runInAction('loading activities', () => {
        activities.forEach(activity => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activityRegistry.set(activity.id, activity);
        });
        this.loadingInitial = false;
      });
    } catch (error) {
      runInAction('load activities error', () => {
        console.log(error);
        this.loadingInitial = false;
      });
    }
  };

  @action createActivity = async (activity: IActivity) => {
    this.submitting = true;
    const host = this.rootStore.userStore.user;
    try {
      await agent.Activities.create(activity);
      const attendee = createAttendee(this.rootStore.userStore.user!)
      attendee.isHost = true;
      let attendees = [];
      attendees.push(attendee);
      activity.attendees = attendees;
      activity.isHost = true;
      runInAction('creating activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction('create activity error', () => {
        this.target = '';
        this.submitting = false;
        console.log(error.response.status);
        toast.error('Error submitting data');
      });
    }
  };

  @action editActivity = async (activity: IActivity) => {
    this.submitting = true;
    try {
      await agent.Activities.update(activity);
      runInAction('editing activity', () => {
        this.activityRegistry.set(activity.id, activity);
        this.activity = activity;
        this.submitting = false;
      });
      history.push(`/activities/${activity.id}`);
    } catch (error) {
      runInAction('edit activity error', () => {
        this.submitting = false;
        console.log(error);
        toast.error('Error submitting data');
      });
    }
  };

  @action deleteActivity = async (
    event: SyntheticEvent<HTMLButtonElement>,
    id: string
  ) => {
    this.submitting = true;
    this.target = event.currentTarget.name;
    await agent.Activities.delete(id);
    try {
      runInAction('deleting activity', () => {
        this.activityRegistry.delete(id);
        this.submitting = false;
        this.target = '';
      });
    } catch (error) {
      runInAction('deleting activity error', () => {
        this.submitting = false;
        this.target = '';
        console.log(error);
        toast.error('Error submitting data');
      });
    }
  };

  @action loadActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      this.activity = activity;
      return activity;
    } else {
      this.loadingInitial = true;
      try {
        activity = await agent.Activities.details(id);
        runInAction('getting individual activity', () => {
          setActivityProps(activity, this.rootStore.userStore.user!);
          this.activity = activity;
          this.activityRegistry.set(activity.id, activity);
          this.loadingInitial = false;
        });
        return activity;
      } catch (error) {
        runInAction('error getting individual activity', () => {
          this.loadingInitial = false;
        });
        console.log(error);
      }
    }
  };

  @action clearActivity = async (id: string) => {
    let activity = this.getActivity(id);
    if (activity) {
      history.push(`/activities/${activity.id}`);
    }
    history.push(`/activities/$`);
  };

  getActivity = (id: string) => {
    return this.activityRegistry.get(id);
  };

  @action cancelAttendance = async () => {
    this.loading = true;
    await agent.Activities.unattend(this.activity!.id);
    try {
      runInAction('Unattending activity', () => {
        if (this.activity) {
          this.activity.attendees = this.activity?.attendees.filter(
            a => a.username !== this.rootStore.userStore.user!.username
          );
          this.activity.isGoing = false;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        };
      });
    } catch (error) {
      runInAction('Error unattending activity', () => {
        this.loading = false;
      });
      toast.error('Problem unattending activity');
    };
  };

  @action attendActivity = async () => {
    const attendee = createAttendee(this.rootStore.userStore.user!);
    this.loading = true;
    // this.loadingInitial = true;
    try {
      await agent.Activities.attend(this.activity!.id);
      runInAction('attending activity', () => {
        if (this.activity) {
          this.activity.attendees.push(attendee);
          this.activity.isGoing = true;
          this.activityRegistry.set(this.activity.id, this.activity);
          this.loading = false;
        };
      });
    } catch (error) {
      runInAction('error attending activity', () => {
        this.loading = false;
      });
      toast.error('Problem joining activity');
    };
  };
}
