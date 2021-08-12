$userId = "e12356f9-adea-4a31-a797-336989f540d3";

/////////////////////////////////lottery///////////////////////////////
// Initialize variable
const $title = $('#title');
const $description = $('#description')
const $ticketPrice = $('#ticketPrice');
const $adPrice = $('#adPrice');
let $rouletteId = -1;


const socket = io('', {
  reconnectionDelayMax: 10000,
  // auth: {
  //   token: "123"
  // },
  query: {
    mobile: "09156590255",
    tocken: "ef95268e71c03989a4f93aac35817fe0e35b98be8bd7338fa137432bd66a9f43f0a7a3599e7ad0db473ab886478915fec4fdf0c1def1f2b40d478a74eb3b90ed",
    rouletteid: 1
  }
});

// Sends a lottery 
const sendRoulette = () => {
  let title = $title.val();
  let description = $description.val();
  let ticketPrice = $ticketPrice.val();
  let adPrice = $adPrice.val();


  const roulette = {
    title: title,
    description: description,
    image: '',
    ticketPrice: ticketPrice,
    adPrice: adPrice,
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
  <td>
  <button onclick="addPrize(${element.id})">افزودن جایزه</button>
  <button onclick="addTicket(${element.id})">افزودن تیکت</button>
  </td>
  </tr>`
  });
  $('#body').text('')
  $('#body').append(body)
}

socket.on('getRoulettes', (data) => {

  // console.log('-----new message----data-------->', data);
  displayRoulette(data);
});

const addPrize = (rouletteId) => {
//  console.log('--------rouletteId---55555----->', rouletteId);
  $rouletteId = parseInt(rouletteId);
  $("#prize-section").css('visibility', 'visible');

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
let $fieldWork = -1
// Sends a prize 
const sendPrize = () => {
  let titlePrize = $titlePrize.val();
  let descriptionPrize = $descriptionPrize.val();
  let countPrize = $countPrize.val();
  let percentFake = $percentFake.val();
  let multiOwnerPrize = $multiOwnerPrize.prop("checked")

  const roulettePrize = {
    title: titlePrize,
    description: descriptionPrize,
    image: '',
    rouletteId: $rouletteId,
    multiOwnerPrize: multiOwnerPrize,
    countPrize: countPrize,
    percentFake: percentFake,
    userId: $userId,
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
  displayRoulettePrize(data);
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
  displayFieldWork(data);
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
//  console.log('-----$userId-------->', $userId)
  let titleTicket = $titleTicket.val();
  let descriptionTicket = $descriptionTicket.val();
  let countTicket = $countTicket.val();
//  console.log('------$rouletteId-------->', $rouletteId);;
  const ticket = {
    title: titleTicket,
    description: descriptionTicket,
    rouletteId: $rouletteId,
    countTicket: countTicket,
    userId: $userId
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
  displayTicket(data);
});