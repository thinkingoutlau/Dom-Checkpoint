/* eslint-disable no-alert */

/**************
 *   SLICE 1
 **************/


function updateCoffeeView(coffeeQty) {
  let coffeeCount = document.getElementById('coffee_counter');
  coffeeCount.innerText = coffeeQty;
}

function clickCoffee(data) {
data.coffee += 1;
updateCoffeeView(data.coffee);
renderProducers(data);
}


/**************
 *   SLICE 2
 **************/
function unlockProducers(producers, coffeeCount) {
  for (let i = 0; i < producers.length; i++) {
    if ((coffeeCount * 2) >= producers[i].price) {
      producers[i].unlocked = true;
    }
  }
}

function getUnlockedProducers(data) {
  let output = [];
  for (let i = 0; i < data.producers.length; i++) {
    if (data.producers[i].unlocked === true) {
      output.push(data.producers[i])
    }
  }
  return output;
}

// function getUnlockedProducers(data) {
//   let output = [];
//   data.producers.forEach(obj => output.push(obj))
//   return output.filter(obj => obj.unlocked === true);
// }

function makeDisplayNameFromId(id) {
    let newString = id.split('_');
    for (let i = 0; i < newString.length; i++) { //['input', 'string']
      let splitWord = newString[i].split('') //[i,n,p,u,t]
      splitWord[0] = splitWord[0].toUpperCase(); //['I']
      newString[i] = splitWord.join('')
    }
    return newString.join(' '); //'Input String'
}

// You shouldn't need to edit this function-- its tests should pass once you've written makeDisplayNameFromId
function makeProducerDiv(producer) {
  const containerDiv = document.createElement('div');
  containerDiv.className = 'producer';
  const displayName = makeDisplayNameFromId(producer.id);
  const currentCost = producer.price;
  const html = `
  <div class="producer-column">
    <div class="producer-title">${displayName}</div>
    <button type="button" id="buy_${producer.id}">Buy</button>
  </div>
  <div class="producer-column">
    <div>Quantity: ${producer.qty}</div>
    <div>Coffee/second: ${producer.cps}</div>
    <div>Cost: ${currentCost} coffee</div>
  </div>
  `;
  containerDiv.innerHTML = html;
  return containerDiv;
}

function deleteAllChildNodes(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild)
  }
}

// coffeeCountView function
// if the coffeeCount in coffeeCountView is equal to half the price of the
// coffee productors, you want to append the coffee producer on the page

// unlockProducers function
// you will need unlockProducers function to change the unlock from false to
// true everytime coffeeCountView has reached half the amount of the price

// makeProducerDiv function 
// you will need to append producer div elements for this to actually show up
// the page

function renderProducers(data) {
  updateCoffeeView(data.coffee);
  unlockProducers(data.producers, data.coffee) 

    let allTruePro = getUnlockedProducers(data)
    let parent = document.getElementById('producer_container')
    //when refreshing the page, everything in this container resets/restarts
    if (parent) {
      deleteAllChildNodes(parent);
    }
    allTruePro.forEach(producer => {
      let proContainer = document.getElementById('producer_container')
      proContainer.append(makeProducerDiv(producer));
    })

}


/**************
 *   SLICE 3
 **************/
// filter and find methods will work!! remb to try!!!!
// returns an obj of all the producers
function getProducerById(data, producerId) {
  let obj = {};
  data.producers.forEach(producer => {
    if (producer.id === producerId) {
      obj = producer;
      //obj = { ...producer}
    }
  })
  return obj;
}
//only one producer gets stored in the object

// you can use getProducerById to look through them and check
// if the price of each one is less than or equal to the amount of coffee
// you currently have
function canAffordProducer(data, producerId) {
  let objOfProducer = getProducerById(data, producerId)
  if (data.coffee >= objOfProducer.price) return true;
  else return false;
}

function updateCPSView(cps) {
  let cpsIndicator = document.getElementById('cps');
  cpsIndicator.innerText = cps;
}

function updatePrice(oldPrice) {
  return oldPrice = Math.floor(oldPrice * 1.25)
}

function attemptToBuyProducer(data, producerId) {
  if(canAffordProducer(data, producerId)) {
    let objOfProducer = getProducerById(data, producerId); //object of producers 
    // expectedResult:{ id: 'producer_A', price: 50, cps: 5, qty: 0 },
    // data.producers.map(producer => {
    //   if (producerId === producer.id) {
    //     producer.qty ++;
    //   }
    // })
    objOfProducer.qty++;
    data.coffee -= objOfProducer.price;
    objOfProducer.price = updatePrice(objOfProducer.price);
    data.totalCPS += objOfProducer.cps;
    return true;
  }
  else return false;
}


  //FIRST WORK ON GETTING THE BUY BUTTON TO WORK (((donneeeeeeee)))
  //FIX THE ALERT BUTTON - ALERT SHOULD NOT POPULATE ANYWHERE EXCEPT BUY BUTTON
function buyButtonClick(event, data) {
  //event.target.id === 'buy_producer_A'
  if (event.target.tagName === 'BUTTON') {
    let name = event.target.id.split('_').slice(1,3).join('_');
    if (canAffordProducer(data, name)) {
      attemptToBuyProducer(data, name);
      renderProducers(data);
      updateCPSView(data.totalCPS);
    } else {
      window.alert('Not enough coffee!')
    }
  }
}


function tick(data) {
  data.coffee += data.totalCPS;
  updateCoffeeView(data.coffee)
  renderProducers(data);

  



}

/*************************
 *  Start your engines!
 *************************/

// You don't need to edit any of the code below
// But it is worth reading so you know what it does!

// So far we've just defined some functions; we haven't actually
// called any of them. Now it's time to get things moving.

// We'll begin with a check to see if we're in a web browser; if we're just running this code in node for purposes of testing, we don't want to 'start the engines'.

// How does this check work? Node gives us access to a global variable /// called `process`, but this variable is undefined in the browser. So,
// we can see if we're in node by checking to see if `process` exists.
if (typeof process === 'undefined') {
  // Get starting data from the window object
  // (This comes from data.js)
  const data = window.data;

  // Add an event listener to the giant coffee emoji
  const bigCoffee = document.getElementById('big_coffee');
  bigCoffee.addEventListener('click', () => clickCoffee(data));

  // Add an event listener to the container that holds all of the producers
  // Pass in the browser event and our data object to the event listener
  const producerContainer = document.getElementById('producer_container');
  producerContainer.addEventListener('click', event => {
    buyButtonClick(event, data);
  });

  // Call the tick function passing in the data object once per second
  setInterval(() => tick(data), 1000);
}
// Meanwhile, if we aren't in a browser and are instead in node
// we'll need to exports the code written here so we can import and
// Don't worry if it's not clear exactly what's going on here;
// We just need this to run the tests in Mocha.
else if (process) {
  module.exports = {
    updateCoffeeView,
    clickCoffee,
    unlockProducers,
    getUnlockedProducers,
    makeDisplayNameFromId,
    makeProducerDiv,
    deleteAllChildNodes,
    renderProducers,
    updateCPSView,
    getProducerById,
    canAffordProducer,
    updatePrice,
    attemptToBuyProducer,
    buyButtonClick,
    tick
  };
}
