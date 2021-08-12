$userId = "e12356f9-adea-4a31-a797-336989f540d3";
$tocken = "d512461c2f17e3ac6cfe47f0ff6a27ab4ed6729b9fc6d58f0ed1d0dd1c3cc440dca562b9b581ef7f7bb6d395a97daa492ab0a0b8eba0d173d1c2e5a35f12f291";
/////////////////////////////////lottery///////////////////////////////
// Initialize variable
const $title = $('#title');
const $description = $('#description');
const $datepicker = $('#datepicker');
const $timepicker = $('#timepicker');
const $repeat = $('#repeat');
const $imageLottery = $('#imageLottery');
const $ticketPrice = $('#ticketPrice');
const $ticketPriceDiamond = $('#ticketPriceDiamond');
const $adPrice = $('#adPrice');
const $adPriceDiamond = $('#adPriceDiamond');
const $adPriceForDays = $('#adPriceForDays');
const $adPriceDiamondForDays = $('#adPriceDiamondForDays');
const $adPriceAfterWin = $('#adPriceAfterWin');
const $adPriceDiamondAfterWin = $('#adPriceDiamondAfterWin');
const $adPriceShared = $('#adPriceShared');
const $adPriceDiamondShared = $('#adPriceDiamondShared');
let $lotteryid = -1;


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
const sendLottery = () => {
  let title = $title.val();
  let description = $description.val();
  let datepicker = $datepicker.val();
  let timepicker = $timepicker.val();
  let repeat = $repeat.val();
  let imageLottery = $imageLottery.val();
  let ticketPrice = $ticketPrice.val();
  let ticketPriceDiamond = $ticketPriceDiamond.val();
  let adPrice = $adPrice.val();
  let adPriceDiamond = $adPriceDiamond.val();
  let adPriceForDays = $adPriceForDays.val();
  let adPriceDiamondForDays = $adPriceDiamondForDays.val();
  let adPriceAfterWin = $adPriceAfterWin.val();
  let adPriceDiamondAfterWin = $adPriceDiamondAfterWin.val();
  let adPriceShared   = $adPriceShared.val();
  let adPriceDiamondShared   = $adPriceDiamondShared.val();


    const lottery = {
      title: title,
      description: description,
      image: imageLottery,
      runDate: datepicker,
      runTime: timepicker,
      repeat:  parseInt(repeat),
      ticketPrice: parseInt(ticketPrice),
      ticketPriceDiamond: parseInt(ticketPriceDiamond),
      adPrice:  parseInt(adPrice),
      adPriceDiamond:  parseInt(adPriceDiamond),
      adPriceForDays:  parseInt(adPriceForDays),
      adPriceDiamondForDays:  parseInt(adPriceDiamondForDays),
      adPriceAfterWin: parseInt( adPriceAfterWin),
      adPriceDiamondAfterWin: parseInt( adPriceDiamondAfterWin),
      adPriceShared: parseInt(adPriceShared),
      adPriceDiamondShared: parseInt( adPriceDiamondShared),
      
    }

  //  console.log('-------lottery--------->', lottery);

    socket.emit('lottery', lottery);
//  console.log('-------lottery----1----->', lottery);
}

const displayGallery = (data) => {
  var body = ``;
  data.forEach(element => {
    body += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.runTime}</td>
  <td>${element.runDate}</td>
  <td>${element.repeat}</td>
  <td>${element.ticketPrice}</td>
  <td>${element.ticketPriceDiamond}</td>
  <td>${element.adPrice}</td>
  <td>${element.adPriceDiamond}</td>
  <td>${element.adPriceAfterWin}</td>
  <td>${element.adPriceAfterWin}</td>
  <td>${element.adPriceForDays}</td>
  <td>${element.adPriceDiamondForDays}</td>
  <td>${element.adPriceShared}</td>
  <td>${element.adPriceDiamondShared}</td>
  <td>${element.execute}</td>
  <td>${element.lock}</td>
  <td>${element.countExecute}</td>
  <td><img src='/public/upload/${element.image}' width='100' height='100'/></td>
  <td>
  <button onclick="addPrize(${element.id})">افزودن جایزه</button>
  <button onclick="addTicket(${element.id})">افزودن تیکت</button>
  </td>
  </tr>`
  });
  $('#body').text('')
  $('#body').append(body)
}

socket.on('getLoteries', (data) => {

//  console.log('-----new message----data-------->', data);
  if (data.status == 1)
    displayGallery(data.data);
  else
  //  console.log(data.message)
});

const addPrize = (lotteryId) => {
//  console.log('--------lotteryId---55555----->', lotteryId);
  $lotteryid = parseInt(lotteryId);
  $("#prize-section").css('visibility', 'visible');
  socket.emit('addPrize', {
    "lotteryId": lotteryId
  });
}

const addTicket = (lotteryId) => {
//  console.log('--------lotteryId---55555----->', lotteryId);
  $lotteryid = parseInt(lotteryId);
  $("#ticket-section").css('visibility', 'visible');
  socket.emit('addTicket', {
    "lotteryId": lotteryId
  });
}


////////////////////////////////////////////prize///////////////////////////////////////////////////////////

// Initialize variable
const $titlePrize = $('#titlePrize');
const $descriptionPrize = $('#descriptionPrize');
const $multiOwnerPrize = $('#multiOwnerPrize');
const $countPrize = $('#countPrize');
const $imagePrize = $('#imagePrize');
const $countDay = $('#countDay');
let $fieldWork = null
// Sends a prize 
const sendPrize = () => {
  let titlePrize = $titlePrize.val();
  let descriptionPrize = $descriptionPrize.val();
  let countPrize = $countPrize.val();
  let countDay = $countDay.val();
  let imagePrize = $imagePrize.val();
  let multiOwnerPrize = $multiOwnerPrize.prop("checked")

  const prize = {
    title: titlePrize,
    description: descriptionPrize,
    image: imagePrize,
    lotteryId: $lotteryid,
    multiOwnerPrize: multiOwnerPrize,
    countPrize: countPrize,
    countDay: countDay,
    fieldWorkId: $fieldWork
  }

//  console.log('-------prize--------->', prize);

  socket.emit('prize', prize);
//  console.log('-------prize----1----->', prize);
}

const displayPrize = (data) => {
  var bodyPrize = ``;
  data.forEach(element => {
    if (element.lotteryId == $lotteryid)
      bodyPrize += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.lotteryId}</td>
  <td>${element.executeNumber}</td>
  <td><img src='/public/upload/${element.image}' width='100' height='100'/></td>
  </tr>`
  });
  $('#bodyPrize').text('')
  $('#bodyPrize').append(bodyPrize)
}

socket.on('getPrizes', (data) => {

//  console.log('-----new message----getPrizes-------->', data);
  if (data.status == 1)
    displayPrize(data.data);
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

  const ticket = {
    title: titleTicket,
    description: descriptionTicket,
    lotteryId: $lotteryid,
    countTicket: countTicket,
    category: 1
  }

//  console.log('-------ticket--------->', ticket);

  socket.emit('ticket', ticket);
//  console.log('-------ticket----1----->', ticket);
}

const displayTicket = (data) => {
  var bodyTicket = ``;
  data.forEach(element => {
    if (element.lotteryId == $lotteryid)
      bodyTicket += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.lotteryId}</td>
  <td>${element.prizeId}</td>
  </tr>`
  });
  $('#bodyTicket').text('')
  $('#bodyTicket').append(bodyTicket)
}

socket.on('getTickets', (data) => {

//  console.log('-----new message----getTicket-------->', data);
  if (data.status == 1)
    displayTicket(data.data);
  else
  //  console.log(data.message)
});


//////////////////////////////get error//////////////////////////
socket.on('getError', (data) => {
//  console.log(data)
});