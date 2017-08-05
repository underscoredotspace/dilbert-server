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

  const image = document.querySelector('IMG#dilbert')
  const prevLink = document.querySelector('A#prev')
  const nextLink = document.querySelector('A#next')
  const dateDisplay = document.querySelector('H1#date')

  function updateDates() {
    const locHash = window.location.hash.substring(2,12)
    const dateRegEx = /^\d{4}\/\d{2}\/\d{2}$/
    if (dateRegEx.test(locHash)) {
      today = selectedDate()
      prev = formatDate(dateAdd(today, -1))
      next = formatDate(dateAdd(today, 1))

      var options = {year: 'numeric', month: 'long', day: 'numeric'}
      dateDisplay.innerText = today.toLocaleDateString('en-GB',options)

      fetch(`https://d.op11.co.uk/images/${formatDate(today)}`).then(res => {
        if (!res.ok) {
          return new Error(res.status)
        } else {
          return res.blob()
        }
      }).then(blob => {
        var imageURL = URL.createObjectURL(blob)
        image.src = imageURL
        image.style.display = 'inline'
        image.style.opacity = 1
        prevLink.href = `#/${prev}`
        nextLink.href = `#/${next}`

      }).catch(err => {
        console.log(err)
        today = formatDate(new Date())
        today = `#/${today}`
        if (window.location.hash !== today) {
          window.location.hash = today
        }
      })

      console.log('Date updated')
    } else {
      console.error('Invalid Date')
      today = formatDate(new Date())
      today = `#/${today}`
      if (window.location.hash !== today) {
        window.location.hash = today
      }
    }
  }

  updateDates()
  window.addEventListener('hashchange', updateDates)

  image.addEventListener('touchstart', touchStart)
  image.addEventListener('touchmove', touchMove)
  image.addEventListener('touchend', touchEnd)

  image.addEventListener('mousedown', touchStart)
  image.addEventListener('mousemove', touchMove)
  image.addEventListener('mouseup', touchEnd)

  let swipe, swipeStart, swipeCurrent, swipeDiff, swipePC, box
  const swipeThreshold = 0.2

  function touchStart(e) {
    console.log('started')
    swipe = true
    swipeStart = e.pageX || e.touches[0].pageX
    swipeCurrent = swipeStart
    swipeDiff = 0
    box = image.getBoundingClientRect()

    e.preventDefault()
  }

  function touchMove(e) {
    if (swipe) {
      swipeCurrent = e.pageX || e.touches[0].pageX
      swipeDiff = swipeCurrent-swipeStart
      swipePC = swipeDiff / box.width
      if (Math.abs(swipePC) > swipeThreshold) {
        image.style.opacity = 0
      } else {
        image.style.opacity = 1 - Math.pow(Math.abs(swipeDiff) / box.width, 0.5)
      }
      image.style.transform = `translateX(${swipeDiff}px)`
    }
  }

  function touchEnd(e) {
    console.log('stopped')
    swipe = false
    if (swipePC > swipeThreshold) {
      image.style.display = 'none'
      window.location = prevLink.href
    } else if (swipePC < -swipeThreshold) {
      image.style.display = 'none'
      window.location = nextLink.href
    }

    image.style.opacity = 1
    image.style.transform = `translateX(0px)`
  }
})();