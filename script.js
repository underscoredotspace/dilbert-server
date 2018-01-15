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
    const selDate = new Date(window.location.hash.substring(2))
    return selDate
  }

  let today, prev, next
  const currDate = new Date()
  const firstDate = new Date('16 April 1989')

  const imageHolder = document.querySelector('DIV#image-holder')
  const image = document.querySelector('IMG#image')
  const imageStatus = document.querySelector('DIV#image-status')
  const prevLink = document.querySelector('A#prev')
  const nextLink = document.querySelector('A#next')
  const dateDisplay = document.querySelector('H1#date')

  function updateDates() {
    const locHash = window.location.hash.substring(2)
    const dateRegEx = /^\d{4}\/\d{2}\/\d{2}$/
    if (dateRegEx.test(locHash)) {
      today = selectedDate()
      if (selectedDate().toDateString() === firstDate.toDateString()) {
        prevLink.style.display = 'none'
      } else {
        prevLink.style.display = 'inline'
      }
      if (selectedDate().toDateString() === currDate.toDateString()) {
        nextLink.style.display = 'none'
      } else {
        nextLink.style.display = 'inline'
      }
      prev = formatDate(dateAdd(today, -1))
      next = formatDate(dateAdd(today, 1))

      fetch(`https://d.op11.co.uk/images/${formatDate(today)}`).then(res => {
        if (!res.ok) {
          return new Error(res.status)
        } else {
          return res.blob()
        }
      }).then(blob => {
        const imageURL = URL.createObjectURL(blob)
        image.src = imageURL
        image.style.opacity = 1;
        prevLink.href = `#/${prev}`
        nextLink.href = `#/${next}`
        const options = {year: 'numeric', month: 'long', day: 'numeric'}
        dateDisplay.innerText = today.toLocaleDateString('en-GB',options)
        imageStatus.innerText = ''
      }).catch(err => {
        console.log(err)
        today = formatDate(new Date())
        today = `#/${today}`
        if (window.location.hash !== today) {
          window.location.hash = today
        } else {
          // we're at today and still got an error. probably means the cron is not working
          alert('Something is wrong - today\'s strip isn\'t there')
        }
      })
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
  window.addEventListener('keydown', keyPress)

  imageHolder.addEventListener('touchstart', touchStart)
  imageHolder.addEventListener('touchmove', touchMove)
  imageHolder.addEventListener('touchend', touchEnd)

  imageHolder.addEventListener('mousedown', touchStart)
  imageHolder.addEventListener('mousemove', touchMove)
  imageHolder.addEventListener('mouseup', touchEnd)

  let swipe, swipeStart, swipeCurrent, swipeDiff, swipePC, box
  const swipeThreshold = 0.1

  function touchStart(e) {
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
        if (swipeDiff > 0) {
          imageStatus.innerText = 'Prev'
        } else {
          imageStatus.innerText = 'Next'
        }
      } else {
        imageStatus.innerText = ''
        image.style.opacity = 0.25
      }
      imageHolder.style.transform = `translateX(${swipeDiff}px)`
    }
  }

  function touchEnd(e) {
    swipe = false
    if (swipePC > swipeThreshold && prevLink.style.display === 'inline') {
      image.style.opacity = 0
      window.location = prevLink.href
    } else if (swipePC < -swipeThreshold && nextLink.style.display === 'inline') {
      image.style.opacity = 0
      window.location = nextLink.href
    } else {
      image.style.opacity = 1
    }

    imageStatus.innerText = ''
    imageHolder.style.transform = `translateX(0px)`
  }

  function keyPress(e) {
    if (e.key === 'ArrowRight' && nextLink.style.display === 'inline') {
      window.location = nextLink.href
    } else if (e.key === 'ArrowLeft' && prevLink.style.display === 'inline') {
      window.location = prevLink.href
    }
  }
})();