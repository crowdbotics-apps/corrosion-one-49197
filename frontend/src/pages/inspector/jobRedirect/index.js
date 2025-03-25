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
  const [loading, setLoading] = useState(false);
  const getUrls = window.location.href.split('jtv/')?.[1]
  const [, dispatch] = useMaterialUIController();
  const { pathname } = useLocation();

  const loginWithToken = () => {
    setLoading(true)
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

          navigate(ROUTES.DASHBOARD)

        },
        errorMessage: 'Invalid token',
        onError: (error) => {
          console.log(error)
          navigate(ROUTES.LOGIN)
        },
        onFinally: () => setLoading(false)
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
