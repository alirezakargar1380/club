$userId = "e12356f9-adea-4a31-a797-336989f540d3";
$tocken= "d512461c2f17e3ac6cfe47f0ff6a27ab4ed6729b9fc6d58f0ed1d0dd1c3cc440dca562b9b581ef7f7bb6d395a97daa492ab0a0b8eba0d173d1c2e5a35f12f291";
var setting = {};
/////////////////////////////////lottery///////////////////////////////
// Initialize variable
const $title = $('#title');
const $description = $('#description')
const $ticketPrice = $('#ticketPrice');
const $adPrice = $('#adPrice');
const $adPriceAfterWin = $('#adPriceAfterWin');
const $adPriceForDays = $('#adPriceForDays');
let $rouletteId = -1;


const socket = io('', {
  reconnectionDelayMax: 10000,
  // auth: {
  //   token: "123"
  // },
  query: {
    tocken: $tocken,
   
  }
});

// Sends a lottery 
const sendRoulette = () => {
  let title = $title.val();
  let description = $description.val();
  let ticketPrice = $ticketPrice.val();
  let adPrice = $adPrice.val();
  let adPriceForDays = $adPriceForDays.val();
  let adPriceAfterWin = $adPriceAfterWin.val();


  const roulette = {
    title: title,
    description: description,
    image: '',
    ticketPrice: parseInt(ticketPrice),
    adPrice: parseInt(adPrice),
    adPriceForDays: parseInt(adPriceForDays),
    adPriceAfterWin: parseInt(adPriceAfterWin),
  }

//  console.log('-------roulette--------->', roulette);

  socket.emit('roulette', roulette);
//  console.log('-------roulette----1----->', roulette);
}

const displayRoulette = (data) => {
  var body = ``;
  data.forEach(element => {
    body += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.ticketPrice}</td>
  <td>${element.adPrice}</td>
  <td>${element.adPriceForDays}</td>
  <td>${element.adPriceForDays}</td>
  <td>${element.percentFake}</td>
  <td>
  <button onclick="addPrize(${element.id} , ${element.percentFake} )">افزودن جایزه</button>
  <button onclick="addTicket(${element.id})">افزودن تیکت</button>
  </td>
  </tr>`
  });
  $('#body').text('')
  $('#body').append(body)
}

socket.on('getRoulettes', (data) => {

  // console.log('-----new message----data-------->', data);
  if(data.status == 1)
  displayRoulette(data.data);
  else
//  console.log(data.message)
});

const addPrize = (rouletteId , percentFake) => {
//  console.log('--------rouletteId---55555----->', rouletteId);
//  console.log('--------percentFake---55555----->', percentFake);
  $rouletteId = parseInt(rouletteId);
  $("#prize-section").css('visibility', 'visible');

  $('#percentChance').attr('max', Math.ceil((100 - percentFake)/ setting.countRoulettePrize));
  $('#percentChance').attr('value', Math.ceil((100 - percentFake)/ setting.countRoulettePrize));


  socket.emit('addRoulettePrize', {
    "rouletteId": rouletteId
  });
}


const addTicket = (rouletteId) => {
//  console.log('--------rouletteId---55555----->', rouletteId);
  $rouletteId = parseInt(rouletteId);

//  console.log('--------$rouletteId---55555----->', $rouletteId);
  $("#ticket-section").css('visibility', 'visible');

  socket.emit('addRouletteTickets', {
    "rouletteId": rouletteId
  });
}


////////////////////////////////////////////prize///////////////////////////////////////////////////////////

// Initialize variable
const $titlePrize = $('#titlePrize');
const $descriptionPrize = $('#descriptionPrize');
const $multiOwnerPrize = $('#multiOwnerPrize');
const $countPrize = $('#countPrize');
const $percentFake = $('#percentFake');
const $percentChance = $('#percentChance');
let $fieldWork = -1
// Sends a prize 
const sendPrize = () => {
  let titlePrize = $titlePrize.val();
  let descriptionPrize = $descriptionPrize.val();
  let countPrize = $countPrize.val();
  let percentFake = $percentFake.val();
  let percentChance = $percentChance.val();
  let multiOwnerPrize = $multiOwnerPrize.prop("checked")

  const roulettePrize = {
    title: titlePrize,
    description: descriptionPrize,
    image: '',
    rouletteId: $rouletteId,
    multiOwnerPrize: multiOwnerPrize,
    countPrize: countPrize,
    percentFake: percentFake,
    percentChance: percentChance,
    fieldWorkId: $fieldWork
  }

  // console.log('-------prize--------->', prize);

  socket.emit('roulettePrize', roulettePrize);
  // console.log('-------prize----1----->', prize);
}


const displayRoulettePrize = (data) => {
  var bodyPrize = ``;
  data.forEach(element => {
    if (element.rouletteId == $rouletteId)
      bodyPrize += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.lotteryId}</td>
  <td>${element.descriptionPrize}</td>
  </tr>`
  });
  $('#bodyPrize').text('')
  $('#bodyPrize').append(bodyPrize)
}

socket.on('getRoulettePrizes', (data) => {

//  console.log('-----new message----getPrizes-------->', data);
  if(data.status == 1)
  displayRoulettePrize(data.data);
  else
//  console.log(data.message)
});


const displayFieldWork = (data) => {
  var bodyPrize = ``;
  data.forEach(element => {
    bodyPrize += `
    <li><a class="dropdown-item" onclick="selectFieldWork(${element.id} , '${element.title}')">${element.title}</a></li>`
  });
  $('#fieldSharedPrize').text('')
  $('#fieldSharedPrize').append(bodyPrize)
}

socket.on('getFieldWorks', (data) => {

  // console.log('---------getFieldWorks-------->', data);
  if(data.status == 1)
  displayFieldWork(data.data);
  else
//  console.log(data.message)
});

const selectFieldWork = (id, title) => {
  $('#dropdownMenuButton1').text('')
  $('#dropdownMenuButton1').text(title)
  $fieldWork = id
}







////////////////////////////////////////////ticket///////////////////////////////////////////////////////////

// Initialize variable
const $titleTicket = $('#titleTicket');
const $descriptionTicket = $('#descriptionTicket');
const $countTicket = $('#countTicket');
// Sends a prize 
const sendTicket = () => {
  let titleTicket = $titleTicket.val();
  let descriptionTicket = $descriptionTicket.val();
  let countTicket = $countTicket.val();
//  console.log('------$rouletteId-------->', $rouletteId);;
  const ticket = {
    title: titleTicket,
    description: descriptionTicket,
    rouletteId: $rouletteId,
    countTicket: countTicket,
  }

//  console.log('-------ticket--------->', ticket);

  socket.emit('rouletteTickets', ticket);
//  console.log('-------ticket----1----->', ticket);
}


const runRoulette = (ticketId, prizeId) => {
//  console.log('------prizeId------>', prizeId);
  if (prizeId == null) {
    const obj = {
      rouletteId: $rouletteId,
      ticketId: ticketId
    }

    socket.emit('runRoulette', obj);
  }
  // console.log('-------prize----1----->', prize);
}

const displayTicket = (data) => {
  var bodyTicket = ``;
  data.forEach(element => {
    if (element.rouletteId == $rouletteId)
      bodyTicket += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.prizeId}</td>
  <td>${element.used}</td>
  <td>
  <button onclick="runRoulette(${element.id} , ${element.prizeId})">اجرا گردونه</button>
  </td>
  </tr>`
  });

  // console.log('-----new message----bodyTicket-------->', bodyTicket);
  $('#bodyTicket').text('')
  $('#bodyTicket').append(bodyTicket)
}

socket.on('getRouletteTickets', (data) => {

//  console.log('-----new message----getRouletteTickets-------->', data);
  if(data.status == 1)
  displayTicket(data.data);
  else
//  console.log(data.message)
});

//////////////////////////////get error//////////////////////////
socket.on('getError', (data) => {
//  console.log(data.message)
});

//////////////////////////////getSettings//////////////////////////
socket.on('getSettings', (data) => {
//  console.log(data.data)
 setting = data.data[0]
});

