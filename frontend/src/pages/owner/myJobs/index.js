import AdminLayout from "../../../components/AdminLayout"
import DataTable from "../../../components/DataTable/index";
import {useEffect, useState} from "react"
import {dataTableModel, renderTableRow} from "./utils"
import {showMessage, useApi, useLoginStore} from "../../../services/helpers";
import {useLocation, useNavigate} from "react-router-dom";


function HomeOwnerJobs() {
  const loginStore = useLoginStore();
  const api = useApi()
  const navigate = useNavigate()
  const [datatable, setDatatable] = useState({...dataTableModel});
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [numberOfItemsPage, setNumberOfItemsPage] = useState(0);
  const [order, setOrder] = useState("");
  const [searchQuery, setSearchQuery] = useState('');

  const getJobs = (search = '', page = 1, ordering = order) => {
    setLoading(true)
    api.getJobs({search, page, ordering, page_size: 25}).then((result) => {
      if (result.kind === "ok") {
        const {count, results} = result.data
        const tmp = {...dataTableModel}
        tmp.rows = results.map(e => renderTableRow(e))
        setDatatable(tmp)
        setNumberOfItems(count)
        setNumberOfItemsPage(results.length)
        setOrder(ordering)
      }
    })
      .catch(err => showMessage())
      .finally(() => setLoading(false))
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
        loading={loading}
        loadingText={'Loading...'}
        table={datatable}
        currentPage={currentPage}
        numberOfItems={numberOfItems}
        numberOfItemsPage={numberOfItemsPage}
        searchFunc={getJobs}
        searchQuery={searchQuery}
        onPageChange={page => {
          getJobs(searchQuery , page)
          setCurrentPage(page)
        }}
      />
    </AdminLayout>

  );
}

export default HomeOwnerJobs;
