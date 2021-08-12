
$userId = "e12356f9-adea-4a31-a797-336989f540d3";
$tocken = "d512461c2f17e3ac6cfe47f0ff6a27ab4ed6729b9fc6d58f0ed1d0dd1c3cc440dca562b9b581ef7f7bb6d395a97daa492ab0a0b8eba0d173d1c2e5a35f12f291";

/////////////////////////////////lottery///////////////////////////////
// Initialize variable
const $title = $('#title');
const $description = $('#description')
const $price = $('#price');
const $count = $('#count');
const $type = $('#type');
const $priceOfToman = $('#priceOfToman');
let $goodId = -1;


const socket = io('', {
  reconnectionDelayMax: 10000,
  // auth: {
  //   token: "123"
  // },
  query: {
    mobile: "09156590255",
    rouletteid: 1,
    tocken: $tocken,

  }
});

// send good
const sendGood = () => {
  let title = $title.val();
  let description = $description.val();
  let price = $price.val();
  let count = $count.val();
  let type = $type.val();
  let priceOfToman = $priceOfToman.val();


  const good = {
    title: title,
    description: description,
    image: '',
    price: parseInt(price),
    count: parseInt(count),
    type: parseInt(type),
    priceOfToman: parseInt(priceOfToman)
  }

//  console.log('-------good--------->', good);

  socket.emit('good', good);
//  console.log('-------good----1----->', good);
}

const goodForUsers = (data) => {
  var body = ``;
  data.forEach(element => {
    body += `<tr>
  <td>${element.title}</td>
  <td>${element.description}</td>
  <td>${element.price}</td>
  <td>${element.count}</td>
  <td>${element.userId}</td>
  <td>
<button onclick='buy(${element.id}, "${element.userId}", 1)'>خرید</button>
  </td>
  </tr>`
  });
  $('#body').text('')
  $('#body').append(body)
}

socket.on('goodForUsers', (data) => {

//  console.log('-----new message----goodForUsers-------->', data);
  if (data.status == 1)
  goodForUsers(data.data);
  else
  //  console.log(data.message)
});

const buy = (goodId, userId, count) => {

  $goodId = goodId;

//  console.log('-----buy buy----buy-------->', {
    "goodId": goodId,
    "userId": userId,
    "count": count
  });

  socket.emit('sellGood', {
    "goodId": goodId,
    "userId": userId,
    "count": count
  });
}



//////////////////////////////////////all good /////////////////////////////////
const displayAllGoods = (data) => {
  var bodyTicket = ``;
  data.forEach(element => {

      bodyTicket += `<tr>
  <td>${element.goodId}</td>
  <td>${element.userId}</td>
  <td>${element.count}</td>
  <td><button onclick='buy(${element.id}, "${element.userId}", 20)'>خرید</button></td>
  </tr>`
  });

  // console.log('-----new message----bodyTicket-------->', bodyTicket);
  $('#bodyAllGood').text('')
  $('#bodyAllGood').append(bodyTicket)
}

socket.on('getGoods', (data) => {
//  console.log('-----getGoods------->', data);
  if (data.status == 1)
  displayAllGoods(data.data);
  else
  //  console.log(data.message)
});



////////////////////////////////////////////sellGood///////////////////////////////////////////////////////////



const displaySellGoodForUser = (data) => {
  var bodyTicket = ``;
  data.forEach(element => {
      bodyTicket += `<tr>
  <td>${element.goodId}</td>
  <td>${element.userId}</td>
  <td>${element.count}</td>
  </tr>`
  });

  // console.log('-----new message----bodyTicket-------->', bodyTicket);
  $('#bodySellGoodForUser').text('')
  $('#bodySellGoodForUser').append(bodyTicket)
}

socket.on('getSellGoodForUser', (data) => {
//  console.log('-----getSellGoodForUser------->', data);
  if (data.status == 1)
    displaySellGoodForUser(data.data);
  else
  //  console.log(data.message)
});



// All Sell Good
/////////////////////////////////////////////


const displaySellGood = (data) => {
  var bodyTicket = ``;
  data.forEach(element => {
      bodyTicket += `<tr>
  <td>${element.goodId}</td>
  <td>${element.userId}</td>
  <td>${element.count}</td>
  </tr>`
  });

  // console.log('-----new message----bodyTicket-------->', bodyTicket);
  $('#bodySellGood').text('')
  $('#bodySellGood').append(bodyTicket)
}

socket.on('getSellGood', (data) => {
//  console.log('-----getSellGood------->', data);
  if (data.status == 1)
    displaySellGood(data.data);
  else
  //  console.log(data.message)
});




//////////////////////////////get error//////////////////////////
socket.on('getError', (data) => {
  //  console.log(data.message)
});






