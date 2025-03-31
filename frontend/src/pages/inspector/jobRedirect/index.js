import {useApi, useLoginStore} from "../../../services/helpers";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {setLayout, useMaterialUIController} from "../../../context";
import {ROUTES} from "../../../services/constants";
import {runInAction} from "mobx";


function JobRedirect() {
  const api = useApi()
  const navigate = useNavigate()
  const loginStore = useLoginStore();
  const getUrls = window.location.href.split('jtv/')?.[1]
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();

  const loginWithToken = () => {
    const token = getUrls
    api.loginWithToken({token}).handle(
      {
        onSuccess: (result) => {

          const {response} = result
          const {user, job} = response
          runInAction(() => {
            loginStore.setUser(user.user)
            loginStore.setApiToken(user.access)
          })
          navigate(ROUTES.J0B_DETAIL(job))
        },
        errorMessage: 'Invalid token',
        onError: (error) => {
          navigate(ROUTES.LOGIN)
        },
      }
    )
  }

  useEffect(() => {
    setLayout(dispatch, "page");
  }, [pathname]);



  useEffect(() => {
    loginWithToken()
  }, []);

  return <></>

}

export default JobRedirect;
