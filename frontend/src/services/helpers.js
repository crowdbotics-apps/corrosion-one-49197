import {useStores} from "models/root-store/root-store-context";
import Toast from "../components/Toast";
import moment from "moment";
import numeral from "numeral";
import {useMediaQuery} from "@mui/material";
import theme from "../assets/theme";

export const useIsMobile = () => {
  return useMediaQuery(theme.breakpoints.down('lg'));
}

export const showMessage = (error = 'An error occurred while communicating with the server, please try again in a few moments', type = 'error') => {
  Toast.fire({
    icon: type,
    title: error
  })
}

export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}


export const money_fmt = (monto) => {
  return numeral(monto).format('$0,0.00')
}

export const count_fmt = (monto) => {
  return numeral(monto).format('0,0')
}

export const date_fmt = (fecha, formato_opcional) => {
  const mm = moment(fecha);
  return mm.format(formato_opcional ? formato_opcional : 'MM/DD/YYYY - hh:mm A')
}


export const useApi = () => {
  const rootStore = useStores()
  return rootStore.environment.api
}

export const useLoginStore = () => {
  const rootStore = useStores()
  return rootStore.loginStore
}

export const truncate = (input, size) => input && input.length > size ? `${input.substring(0, size)}...` : input;

export const getErrorMessages = (err) => {
  let message = ""
  for (let k of Object.keys(err)) {
    message += err[k].join(". ")
  }
  return message
}

export const formatNumberToCurrency = num => new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
}).format(num)

export const loadDictForm = (objBase, objData) => {
  let newObject = {}
  Object.keys(objBase).forEach(function (key, index) {
    newObject[key] = objData[key] ? objData[key] : objBase[key]
  });

  return newObject
}

export const transformObjectsToId = (object, list_of_keys_to_convert) => {
  const newObj = {}
  Object.keys(object).forEach(function (key) {
    if (list_of_keys_to_convert.includes(key)) {
      if (object[key] !== null && object[key].id !== undefined) {
        newObj[key] = object[key].id
      } else {
        newObj[key] = null
      }
    } else {
      newObj[key] = object[key]
    }
  });
  return newObj
}

export const collect_files = (data) => {
  const files = []
  data = collect_files_internal(data, '', files)
  return [data, files]
}

const collect_files_internal = (objekt, current_path, collector) => {

  if (objekt === null || objekt === undefined) {
    return objekt
  }
  if (typeof document !== 'undefined') {
    // I'm on the web!
    if (objekt instanceof File) {
      collector.push([current_path, objekt])
      return null
    }
  }
  else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
    // I'm in react-native
    if (objekt instanceof RNFile) {
      collector.push([current_path, objekt])
      return null
    } else if (objekt instanceof File || objekt instanceof Blob) {
      throw new Error('You are using react-native, but you passed a File/Blob object instead of a RNFile object')
    }
  }
  if (objekt instanceof File) {
    collector.push([current_path, objekt])
    return null
  }
  const sep = current_path === '' ? '' : '.'
  if (objekt.constructor === Array && objekt.map) {
    return objekt.map((el, index) => {
      return collect_files_internal(el, `${current_path}${sep}[${index}]`, collector)
    })
  }
  if (typeof objekt === 'object') {
    const res = {}
    Object.entries(objekt).forEach(([key, el]) => {
      res[key] = collect_files_internal(el, `${current_path}${sep}${key}`, collector)
    })
    return res
  }
  return objekt
}

export const openInNewTab = (url) => {
  window.open(url, '_blank', 'noreferrer');
};

export const convertStringToList = (text) => {
  if (text) {
    return text.replace(/\n/g, '<br/>')
  } else {
    return '';
  }
}

export const dolovo_date_fmt = (fecha) => {
  const mm = moment(fecha);
  const now = moment();

  return mm.format(now.diff(mm, 'day') > 365 ? 'MMM D, YYYY, h:mm A' : 'MMMM D, h:mm A')
}

export class RNFile {
  constructor(uri, name, type) {
    this.name = name;
    this.uri = uri;
    this.type = type;
  }
}

function useCurrentBreakpoint() {

  // Call useMediaQuery for each breakpoint separately, in the same order, unconditionally.
  // That way, React can keep track of the hook calls properly.
  const matchesXL = useMediaQuery(theme.breakpoints.up('xl'));
  const matchesLG = useMediaQuery(theme.breakpoints.up('lg'));
  const matchesMD = useMediaQuery(theme.breakpoints.up('md'));
  const matchesSM = useMediaQuery(theme.breakpoints.up('sm'));

  // Now determine the current breakpoint:
  if (matchesXL) return 'xl';
  if (matchesLG) return 'lg';
  if (matchesMD) return 'md';
  if (matchesSM) return 'sm';
  return 'xs';
}

export default useCurrentBreakpoint;


export const checkUrl = (url) => {
  if (!url) {
    return process.env.REACT_APP_API_URL
  }

  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  } else {
    return process.env.REACT_APP_API_URL + url
  }
}

export const isFile = (file) => {
  return file instanceof File || file instanceof Blob || file instanceof RNFile
}

export function truncateFilename(filename, maxLength = 50) {
  // Find the last dot. If none, there's no extension.
  const dotIndex = filename.lastIndexOf('.');
  if (dotIndex === -1) {
    // If no extension, just slice the entire filename
    return filename.length > maxLength
      ? filename.slice(0, maxLength)
      : filename;
  }

  // Separate base name and extension
  const base = filename.slice(0, dotIndex);
  const extension = filename.slice(dotIndex); // includes the "."

  // If base + extension is longer than maxLength, truncate the base
  if (base.length + extension.length > maxLength) {
    // e.g. if extension is ".pdf" (4 chars), base can only be up to (maxLength - 4)
    const sliceLength = maxLength - extension.length;
    const truncatedBase = base.slice(0, sliceLength);
    return truncatedBase + extension;
  }

  // Otherwise, return as-is
  return filename;
}
