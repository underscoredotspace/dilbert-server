(function() {
  function dateAdd(date, add) {
    const d = new Date(date)
    
    if (d.toString() === 'Invalid Date') {
      return d
    }
    d.setDate(d.getDate() + add)
    return d
  }

  function formatDate(date) {
    const d = new Date(date)

    if (d.toString() === 'Invalid Date') {
      return d
    }

    let day = d.getDate()
    if (day <10) {
      day = '0' + day
    }
    let month = d.getMonth() + 1 // month is 0-indexed
    if (month <10) {
      month = '0' + month
    }
    let year = d.getFullYear()

    return `${year}/${month}/${day}`
  }

  function selectedDate() {
    const selDate = new Date(window.location.hash.substring(2,12))
    return selDate
  }

  let today, prev, next

  window.addEventListener('load', function(e) {
    function updateDates() {
      const locHash = window.location.hash.substring(2,12)
      const dateRegEx = /^\d{4}\/\d{2}\/\d{2}$/
      if (dateRegEx.test(locHash)) {
        today = selectedDate()
        prev = formatDate(dateAdd(today, -1))
        next = formatDate(dateAdd(today, 1))

        const image = document.querySelector('IMG#dilbert')
        const prevLink = document.querySelector('A#prev')
        const nextLink = document.querySelector('A#next')

        fetch(`https://d.op11.co.uk/images/${formatDate(today)}`).then(res => {
          console.log(res)
          if (!res.ok) {
            // return new Error(res.status)
          } else {
            return res.blob()
          }
        }).then(blob => {
          var imageURL = URL.createObjectURL(blob)
          image.src = imageURL
          prevLink.href = `#/${prev}`
          nextLink.href = `#/${next}`
        }).catch(err => {
          console.log(err)
        })

        console.log('Date updated')
      } else {
        console.error('Invalid Date')
      }
    }
    updateDates()
    window.addEventListener('hashchange', updateDates)
  })
})();