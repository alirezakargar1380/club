$userId = "e12356f9-adea-4a31-a797-336989f540d3";
$tocken = "6fc445d51b9ddb0d9dccaca17df8b449b17ec018f39831d5e83b4a975713a826df56e82759c34ae458918b3568cd284a96248077b5e2a7be4c8c40c00d462a8d";
var setting = {};
/////////////////////////////////lottery///////////////////////////////
// Initialize variable
const $title = $('#title');
const $description = $('#description')
const $ticketPrice = $('#ticketPrice');
const $ticketPriceDiamond = $('#ticketPriceDiamond');
const $adPrice = $('#adPrice');
const $adPriceDiamond = $('#adPriceDiamond');
const $adPriceAfterWin = $('#adPriceAfterWin');
const $adPriceDiamondAfterWin = $('#adPriceDiamondAfterWin');
const $adPriceForDays = $('#adPriceForDays');
const $adPriceDiamondForDays = $('#adPriceDiamondForDays');
const $fromDate = $('#fromDate');
const $countDay = $('#countDay');
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
  let ticketPriceDiamond = $ticketPriceDiamond.val();
  let adPrice = $adPrice.val();
  let adPriceDiamond = $adPriceDiamond.val();
  let adPriceForDays = $adPriceForDays.val();
  let adPriceDiamondForDays = $adPriceDiamondForDays.val();
  let adPriceAfterWin = $adPriceAfterWin.val();
  let adPriceDiamondAfterWin = $adPriceDiamondAfterWin.val();
  let fromDate = $fromDate.val();
  let countDay = $countDay.val();


  const roulette = {
    title: title,
    description: description,
    image: '1615276758483-2.png',
    ticketPrice: parseInt(ticketPrice),
    ticketPriceDiamond: parseInt(ticketPriceDiamond),
    adPrice: parseInt(adPrice),
    adPriceDiamond: parseInt(adPriceDiamond),
    adPriceForDays: parseInt(adPriceForDays),
    adPriceDiamondForDays: parseInt(adPriceDiamondForDays),
    adPriceAfterWin: parseInt(adPriceAfterWin),
    adPriceDiamondAfterWin: parseInt(adPriceDiamondAfterWin),
    fromDate: fromDate,
    countDay: parseInt(countDay),
  }

  //  console.log('-------roulette--------->', roulette);

  socket.emit('roulette', roulette);
  //  console.log('-------roulette----1----->', roulette);
}

const displayRoulette = (data) => {
  var body = ``;
  data.forEach(element => {
    body += `<tr>
  <td>${element.id}</td>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.ticketPrice}</td>
  <td>${element.ticketPriceDiamond}</td>
  <td>${element.adPrice}</td>
  <td>${element.adPriceDiamond}</td>
  <td>${element.adPriceForDays}</td>
  <td>${element.adPriceDiamondForDays}</td>
  <td>${element.adPriceAfterWin}</td>
  <td>${element.adPriceDiamondAfterWin}</td>
  <td>${element.fromDate}</td>
  <td>${element.countDay}</td>
  <td>${element.percentFake}</td>
  <td><img src='/public/upload/${element.image}' width='100' height='100'/></td>
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
  if (data.status == 1)
    displayRoulette(data.data);
  else
    console.log(data.message)
});

const addPrize = (rouletteId, percentFake) => {
  //  console.log('--------rouletteId---55555----->', rouletteId);
  //  console.log('--------percentFake---55555----->', percentFake);
  $rouletteId = parseInt(rouletteId);
  $("#prize-section").css('visibility', 'visible');

  $('#percentChance').attr('max', Math.ceil((100 - percentFake) / setting.countRoulettePrize));
  $('#percentChance').attr('value', Math.ceil((100 - percentFake) / setting.countRoulettePrize));


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
const $prizeDatePicker = $('#prizeDatePicker');
const $prizeTimePicker = $('#prizeTimePicker');
const $sequential = $('#sequential');
let $fieldWork = -1
// Sends a prize 
const sendPrize = () => {
  let titlePrize = $titlePrize.val();
  let descriptionPrize = $descriptionPrize.val();
  let countPrize = $countPrize.val();
  let percentFake = $percentFake.val();
  let percentChance = $percentChance.val();
  let prizeDatePicker = $prizeDatePicker.val();
  let prizeTimePicker = $prizeTimePicker.val();
  let sequential = $sequential.prop("checked");
  let multiOwnerPrize = $multiOwnerPrize.prop("checked")

  const roulettePrize = {
    title: titlePrize,
    description: descriptionPrize,
    image: '1615276758483-2.png',
    rouletteId: $rouletteId,
    countPrize: countPrize,
    percentFake: percentFake,
    percentChance: percentChance,
    sequential: sequential,
    prizeDatePicker: [prizeDatePicker],
    prizeTimePicker: [prizeTimePicker]
  }

  //  console.log('-------roulettePrize--------->', roulettePrize);

  socket.emit('roulettePrize', roulettePrize);
  //  console.log('-------roulettePrize----1----->', roulettePrize);
}


const displayRoulettePrize = (data) => {
  var bodyPrize = ``;
  data.forEach(element => {
    if (element.rouletteId == $rouletteId)
      bodyPrize += `<tr>
  <td>${element.id}</td>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.runDate}</td>
  <td>${element.runTime}</td>
  <td>${element.statusPay}</td>
  <td>${element.sequential}</td>
  <td><img src='/public/upload/${element.image}' width='100' height='100'/></td>
  </tr>`
  });
  $('#bodyPrize').text('')
  $('#bodyPrize').append(bodyPrize)
}

socket.on('getRoulettePrizes', (data) => {

  //  console.log('-----new message----getPrizes-------->', data);
  if (data.status == 1)
    displayRoulettePrize(data.data);
  else
    console.log(data.message)
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
  if (data.status == 1)
    displayFieldWork(data.data);
  else
    console.log(data.message)
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
  <td>${element.id}</td>
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
  if (data.status == 1)
    displayTicket(data.data);
  else
    console.log(data.message)
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