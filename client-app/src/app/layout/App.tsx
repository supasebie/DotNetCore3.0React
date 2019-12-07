import React, { useEffect, Fragment, useContext } from "react";
import LoadingComponent from './LoadingComponent'
import { Container } from "semantic-ui-react";
import NavBar from "../../features/nav/NavBar";
import ActivitiyDashboard from "../../features/activities/dashboard/AcitivityDashboard";
import ActivityStore from "../stores/activityStore";
import {observer} from 'mobx-react-lite';

const App = () => {
  const activityStore = useContext(ActivityStore);

  useEffect(() => {
    activityStore.loadActivities();
  }, [activityStore]);

  if (activityStore.loadingInitial) return <LoadingComponent content='Loading activities...' />

  return (
    <Fragment>
      <NavBar />
      <Container style={{ marginTop: "7em" }}>
        <ActivitiyDashboard/>
      </Container>
    </Fragment>
  );
};

export default observer(App);
 