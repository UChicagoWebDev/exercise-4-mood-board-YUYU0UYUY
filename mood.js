const bing_api_endpoint = "https://api.bing.microsoft.com/v7.0/images/search"
const bing_api_key = BING_API_KEY

function runSearch () {

  // TODO: Clear the results pane before you run a new search

  openResultsPane()

  // TODO: Build your query by combining the bing_api_endpoint and a query attribute
  //  named 'q' that takes the value from the search bar input field.
  const searchInput = document.getElementById("searchInput").value
  const searchquery = bing_api_endpoint + "?q=" + searchInput
  console.log(searchquery)

  let request = new XMLHttpRequest()

  request.open("GET", searchquery, true)

  // TODO: Construct the request object and add appropriate event listeners to
  // handle responses. See:
  // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest_API/Using_XMLHttpRequest
  //
  //   - You'll want to specify that you want json as your response type

  request.responseType = "json"

  //   - Look for your data in event.target.response
  //   - When adding headers, also include the commented out line below. See the API docs at:
  // https://docs.microsoft.com/en-us/bing/search-apis/bing-image-search/reference/headers
  //   - When you get your responses, add elements to the DOM in #resultsImageContainer to
  //     display them to the user
  //   - HINT: You'll need to ad even listeners to them after you add them to the DOM
  //
  // request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key);

  request.setRequestHeader("Ocp-Apim-Subscription-Key", bing_api_key)
  request.addEventListener("load", reqLisenter)
  // TODO: Send the request
  request.send()

  return false  // Keep this; it keeps the browser from sending the event
  // further up the DOM chain. Here, we don't want to trigger
  // the default form submission behavior
}

function openResultsPane () {
  document.querySelector("#resultsImageContainer").innerHTML = ""
  document.getElementById("suggestedList").innerHTML = ""
  // This will make the results pane visible.
  document.querySelector("#resultsExpander").classList.add("open")
}

function closeResultsPane () {
  // This will make the results pane hidden again.
  document.querySelector("#resultsExpander").classList.remove("open")
}

// This will 
document.querySelector("#runSearchButton").addEventListener("click", runSearch)
document.querySelector(".search input").addEventListener("keypress", (e) => {
  if (e.key == "Enter") { runSearch() }
})

document.querySelector("#closeResultsButton").addEventListener("click", closeResultsPane)
document.querySelector("body").addEventListener("keydown", (e) => {
  if (e.key == "Escape") { closeResultsPane() }
})



function reqLisenter (e) {
  // Get #resultsImageContainer element
  const resImgContainer = document.getElementById("resultsImageContainer")
  // - Look for your data in event.target.response
  const returnImgs = e.target.response.value

  // Add div and image to the #resultsImageContainer
  returnImgs.forEach(image => {
    let div = document.createElement("div")
    let img = document.createElement("img")
    div.append(img)
    img.src = image.contentUrl
    img.classList.add("resultImage")
    // click eventlistener to make the image saved to image board
    div.addEventListener("click", () => clickToBoardLisenter(image))
    resImgContainer.appendChild(div)
  })

  // Add related search recommendation
  const relatedSearch = e.target.response.relatedSearches
  const suggestions = document.getElementById("suggestedList")
  relatedSearch.forEach(singleSearch => {
    console.log(singleSearch)
    let li = document.createElement("li")
    li.innerText = singleSearch.text
    li.src = singleSearch.webSearchUrl
    li.addEventListener("click", () => clickSuggestionsLisenter(singleSearch.text))
    suggestions.appendChild(li)
  })

  console.log(e.target.response)
}

function clickToBoardLisenter (image) {
  // Get #board element
  const moodBoard = document.getElementById("board")

  // copy the image from searching results board to the mood board
  let div = document.createElement("div")
  let img = document.createElement("img")
  div.append(img)
  img.src = image.contentUrl
  img.classList.add("savedImage")
  moodBoard.append(div)
}

function clickSuggestionsLisenter (text) {
  const searchInputElement = document.getElementById("searchInput")
  searchInputElement.value = text
  runSearch()
}

