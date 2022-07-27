//declares a variable to target all items with the fa-trash class
const deleteBtn = document.querySelectorAll('.fa-trash')
//declares a variable to target all spans with the item class
const item = document.querySelectorAll('.item span')
//declares a variable to target all spans with the item and completed classes
const itemCompleted = document.querySelectorAll('.item span.completed')

//makes an array with the querySelectorAll results, loop through all, and add a click event that fires the deleteItem function
Array.from(deleteBtn).forEach((element)=>{
    element.addEventListener('click', deleteItem)
})

//makes an array with the querySelectorAll results, loop through all, and add a click event that fires the markComplete function
Array.from(item).forEach((element)=>{
    element.addEventListener('click', markComplete)
})

//makes an array with the querySelectorAll results, loop through all, and add a click event that fires the markUnComplete function
Array.from(itemCompleted).forEach((element)=>{
    element.addEventListener('click', markUnComplete)
})

// a function to delete an item
async function deleteItem(){
     // traverses the dom up the the parent li and gets the text inside of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    // try catch is a clearer way to handle errors, essentially error handling
    try{
         //sends a delete request to the delete item endpoint, sets the header to inform server that it is sending json and item text variable contents in the body
        const response = await fetch('deleteItem', {
            method: 'delete',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              'itemFromJS': itemText
            })
          })
          //   wait for response, parse json
        const data = await response.json()
        console.log(data)
         // relaod the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// a function to mark an item completed
async function markComplete(){
    // traverses the dom up the the parent li and gets the text inside of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    // try catch is a clearer way to handle errors, essentially error ha
    try{
        //sends a put request to the markcomplete endpoint, sets the header to inform server that it is sending json and item text variable contents in the body
        const response = await fetch('markComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
        //   wait for response, parse json
        const data = await response.json()
        console.log(data)
        // relaod the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}

// a function to mark an item uncompleted
async function markUnComplete(){
    // traverses the dom up the the parent li and gets the text inside of the first span element
    const itemText = this.parentNode.childNodes[1].innerText
    // try catch is a clearer way to handle errors, essentially error ha
    try{
           //sends a put request to the markcomplete endpoint, sets the header to inform server that it is sending json and item text variable contents in the body
        const response = await fetch('markUnComplete', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                'itemFromJS': itemText
            })
          })
          //   wait for response, parse json
        const data = await response.json()
        console.log(data)
        // relaod the page
        location.reload()

    }catch(err){
        console.log(err)
    }
}