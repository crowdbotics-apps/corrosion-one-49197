import Toast from "../../components/Toast";
import {capitalize} from "../helpers";
import numeral from "numeral";

export const useApiMessages = (name, namePlural) => {
  return {
    get: {
      success: `${capitalize(name)} fetched successfully`,
      error: `Error fetching ${name}, please try again`,
    },
    list: {
      success: `${capitalize(namePlural)} fetched successfully`,
      error: `Error fetching ${namePlural.toLowerCase()}, please try again`,
    },
    create: {
      success: `${capitalize(name)} created successfully`,
      error: `Error creating ${name.toLowerCase()}, please correct inputs`,
    },
    update: {
      success: `${capitalize(name)} updated successfully`,
      error: `Error updating ${name.toLowerCase()}, please correct inputs`,
    },
    delete: {
      success: `${capitalize(name)} deleted successfully`,
      error: `Error deleting ${name.toLowerCase()}.`,
    }
  }
}

export const apiMessages = {
  get: {
    success: (name) => `${capitalize(name)} fetched successfully`,
    error: (name) => `Error fetching ${name.toLowerCase()}, please try again`,
  },
  list: {
    success: (namePlural) => `${capitalize(namePlural)} fetched successfully`,
    error: (namePlural) => `Error fetching ${namePlural.toLowerCase()}, please try again`,
  },
  create: {
    success: (name) => `${capitalize(name)} created successfully`,
    error: (name) => `Error creating ${name.toLowerCase()}, please correct inputs`,
  },
  update: {
    success: (name) => `${capitalize(name)} updated successfully`,
    error: (name) => `Error updating ${name.toLowerCase()}, please correct inputs`,
  },
  delete: {
    success: (name) => `${capitalize(name)} deleted successfully`,
    error: (name) => `Error deleting ${name.toLowerCase()}.`,
  }
}


const field_to_human = (field) => {
  return field.replace(/_/g, ' ').replace(/(?: |\b)(\w)/g, function (key) {
    return key.charAt(0).toUpperCase() + key.slice(1)
  });
}
const collect_errors = (value, current_path, collector) => {
  if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
    Object.keys(value).forEach(function (key) {
      const field = field_to_human(key)
      const thispath = current_path.concat(field)
      collect_errors(value[key], thispath, collector)
    });
  } else if (typeof value === 'object' && value !== null && Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
    value.forEach((item, index) => {
      const thispath = current_path.concat(numeral(index + 1).format('0o'))
      collect_errors(item, thispath, collector)
    })
  } else {
    const thistitle = current_path.length > 0 ? `<b>• ${current_path.join(" > ")}: </b>` : `<b>• </b>`
    if (value && (typeof value === 'string' || value instanceof String)) {
      collector.push(`${thistitle} ${value}`)
    } else if (value && Array.isArray(value)) {
      if (value.length === 1) {
        collector.push(`${thistitle} ${value[0]}`)
      } else {
        collector.push(`${thistitle}`)
        value.forEach(item => {
          collector.push(`${"&nbsp;".repeat(thistitle.length)} ${item}`)
        })
      }
    }
  }

}

export const showErrorMessageBasedOnResult = (result_or_error, mainError = 'An error occurred while communicating with the server, please try again in a few moments', type = 'error') => {

  let html = ''
  // result_or_error.errors.non_field_errors
  const kind = result_or_error?.kind || result_or_error?.result?.kind

  //console.log(kind, result_or_error, result_or_error.result)

  function doToast(type, mainError, html) {
    Toast.fire({
      icon: type,
      title: mainError,
      html: `<span style="font-size: 14px">
                ${html}
           </span>`
    })
  }

  if (kind === 'server' || kind === 'network') {
    html = 'An error occurred while communicating with the server, please try again in a few moments'
    doToast(type, mainError, html)
  } else if (kind === 'timeout') {
    html = 'Timeout while communicating with the server, please try again in a few moments'
    doToast(type, mainError, html)
  } else if (kind === 'not-found') {
      html = 'Resource not found'
      doToast(type, mainError, html)
  } else if (kind === 'forbidden') {
      html = 'You do not have permission to perform this action'
      doToast(type, mainError, html)
  } else if (result_or_error.result?.errors || result_or_error.errors) {
    if (result_or_error.message) {
      mainError = result_or_error.message
    }
    const errors = result_or_error.result ? result_or_error.result.errors : result_or_error.errors

    function processErrors(errors) {
      const collector = []
      if (errors?.non_field_errors) {
        if (Array.isArray(errors?.non_field_errors)) {
          errors?.non_field_errors?.forEach(item => {
            collector.push(`${item}`)
          })
        } else {
          collector.push(`${errors?.non_field_errors}`)
        }
        delete errors.non_field_errors
      }
      collect_errors(errors, [], collector)
      html = collector.join('<br/>')

      doToast(type, mainError, html)
    }

    if (errors instanceof Blob) {
      errors.text().then(text => {
        try {
          const json = JSON.parse(text)
          processErrors(json)
        } catch (e) {
          doToast(type, mainError, text)
        }
      })
    } else {
      processErrors(errors)
    }
  } else {
    throw new Error('Invalid error object flow')
  }
}

export const showErrorMessageBasedOnError = showErrorMessageBasedOnResult
