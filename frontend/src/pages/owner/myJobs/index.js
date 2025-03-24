import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/AdminLayout/MyJobs/dataTable";
import {useEffect, useState} from "react"
import { dataTableModel } from "../../../components/AdminLayout/MyJobs/utils"
import {useApi, useLoginStore} from "../../../services/helpers";
import {useLocation, useNavigate} from "react-router-dom";


function HomeOwnerJobs() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const [datatable, setDatatable] = useState({...dataTableModel});
  const [loading, setLoading] = useState(false);


  const getJobs = () => {
    setLoading(true);
    api.getJobs().handle({
      onSuccess: (result) => {
        console.log('jobs ==> ', result)
        // setDatatable({...datatable, data: result.data.results})
      },
      errorMessage: 'Error getting jobs',
      onFinally: () => {
        setLoading(false)
      }
    })
  }

  useEffect(() => {
    getJobs()
  }, [])

  return (
    <AdminLayout
      title={'My Jobs'}
      showCard
    >
      <DataTable
        table={datatable}
      />
    </AdminLayout>

  );
}

export default HomeOwnerJobs;
