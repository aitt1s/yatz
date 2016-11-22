var players = [
  // For static testing
  /*{"name": "Juha", "turn": true, "id": 0, "idName": "P0", "points": 0, "upperpoints": 0},
  {"name": "Eki",  "turn": false, "id": 1, "idName": "P1", "points": 0, "upperpoints": 0},
  {"name": "Hugo", "turn": false, "id": 2, "idName": "P2", "points": 0, "upperpoints": 0},*/
]

rollCount = 0;
bonus = 50;
var hand = [];
var dices = {
  "0": {"number": 6, "checked": false},
  "1": {"number": 6, "checked": false},
  "2": {"number": 6, "checked": false},
  "3": {"number": 6, "checked": false},
  "4": {"number": 6, "checked": false}
};

function selectPlayers() {
  elements = document.getElementsByClassName('player-input');
  for(i=0; i < elements.length; i++) {
    if(elements[i].value !== "") {
      var turn = false;
      if(i==0) {
        turn = true;
      }

      var newPlayer = {"name": elements[i].value, "turn": turn, "id": i, "idName": 'P'+i, "points": 0, "upperpoints": 0}
      var newarr = players.concat(newPlayer);
      players = newarr;
    }
  }

  document.getElementById('start-screen').style.display = "none";
  renderTable();
  startGame();
  whosTurn();
}

function renderNew(id) {
  var fieldId = parseInt(id);
  var nextInput = fieldId + 1;
  var thisValue = document.getElementById(id).value;
  var nextElement = document.getElementById(nextInput)
  if(!nextElement && thisValue.length > 0) {
    renderNewPlayerInput(nextInput);
  }
}

function renderNewPlayerInput(id) {
  var input = document.createElement("input");
  input.className = "player-input";
  input.setAttribute('id', id);
  input.setAttribute('placeholder', 'Name');
  input.setAttribute('onkeyup', 'renderNew(id)')

  var target = document.getElementById('fields');
  target.append(input);
}

function renderTable() {
  // Create table
  var table = document.createElement("table");
  table.className = "striped higlight";
  table.setAttribute("id", "scoreTable");

  var thead = document.createElement("thead");
  thead.setAttribute("id", "tableHead");

  var th = {"element": "th", "headerText": "name"};
  var td = {"element": "td", "startText": "Ones"};
  var tbody = document.createElement("tbody");
  tbody.setAttribute("id", "tableBody");

  // render table
  element = document.getElementById("scoreBoard");
  element.appendChild(table).appendChild(thead);
  renderElements("tableHead", th);

  table.appendChild(tbody);
  var resultnames = ["Ones", "Twos", "Threes", "Fours",
                     "Fives", "Sixes", "Total Up",
                     "Bonus", "Two of a kind", "Two Pairs",
                     "Three of a kind", "Four of a kind",
                     "Small straight", "Big straight",
                     "Full house", "Chance", "Total"];


  for (var y=0; y<resultnames.length; y++) {
      if ( resultnames[y] == "Total Up" || resultnames[y] == "Bonus" || resultnames[y] == "Total" ) {
        classname = "";
      }
      else {
        classname = "user-value";
      }
    renderElements("tableBody", td, resultnames[y], classname);
  }
}

function renderElements(target, object, startText, classname) {
  where = document.getElementById(target);
  var tr = document.createElement("tr");
  var block = where.appendChild(tr);
  var startBlock = block;
  var headertext = object.headerText;
  var startElement = document.createElement(object.element);

  block.appendChild(startElement);

  if ( startText !== undefined ) {
    var startTextElement = document.createTextNode(startText);
    startElement.innerHTML = startText;
  }

  for (i = 0; i < players.length ; i++) {
    var element = document.createElement(object.element);
    block.appendChild(element)
    element.setAttribute("data-player-id", i);
    if (headertext !== undefined ) {
      var pls = document.createTextNode(headertext);
      block.appendChild(element).appendChild(pls);
    }

    if (classname !== undefined ) {
      shorted = String(startText).replace(/\s+/g, '');
      element.className = classname+' '+shorted.toLowerCase()+' P'+i; //.replace(/\s+/g, '');
    }
  }
}

function startGame() {
  var headers = document.getElementsByTagName('th');

  for(i = 0; i < players.length; i++) {
    if("P"+headers[i+1].getAttribute('data-player-id') == players[i].idName) {
      headers[i+1].innerHTML = players[i].name;
    }
  }
}

function whosTurn(id) {
  for (i = 0; i < players.length ; i++) {
    if (players[i].turn == true) {
      playerID = players[i].id;
      playerName = players[i].name;
      playeridName = players[i].idName;
    }
  }
  document.getElementById("blockq").innerHTML = playerName + "'s turn!";

  if ( id !== undefined ) {
    return playeridName;
  }

  return playerID;
}

function nextPlayer() {
  var whosturn = whosTurn();
  var nextp = next(whosturn);
  players[whosturn].turn = false;
  players[nextp].turn = true;
  whosTurn()
}

function next(number) {
  playersCount = (Object.keys(players).length) -1;
  var index = number;
  index++;
  if ( number >= playersCount) {
    index = 0;
  }
  return index;
}

function randomize() {
  var number = Math.floor((Math.random() * 6) + 1);
  return number;
}

function toggleChecked(dice) {
  var checked = dices[dice]["checked"];
  if (checked == false) {
    dices[dice]["checked"] = true;
  }
  else {
    dices[dice]["checked"] = false;
  }
}

function startSpin() {
  var spinners = document.getElementsByClassName("dice-wrapper");
  for (i=0; i < spinners.length; i++ ) {
    if (!dices[i]["checked"]) {
      spinners[i].classList.add("spin");
    }
  }
}

function stopSpin() {
  var spinners = document.getElementsByClassName("dice-wrapper");
  for (i=0; i < spinners.length; i++ ) {
    spinners[i].classList.remove("spin");
  }
}

function rollDices() {
  document.getElementById("diceOverlay").classList.add("shown");
  if ( rollCount < 3 ) {
    startSpin();
    setTimeout(function(){
      rollCount += 1;
      for (i = 0; i < 5; i++) {
        if (!dices[i]["checked"]) {
          dices[i]["number"] = randomize();
          var element = document.getElementById("dice"+i);
          element.className = "dice dice-"+dices[i]["number"];
        }
      }
      getResults();
      stopSpin();
    }, 500);
  }

  if (rollCount == 2) {
    document.getElementById("throw").classList.add("disabled");
  }
}

function toggleDice(id) {
  var subs = id.substr(id.length - 1);
  var element = document.getElementById(id);
  if (element.classList.contains('checked')) {
    element.classList.remove('checked');
    toggleChecked(subs);
  }
  else {
    element.className = "dice-wrapper checked";
    toggleChecked(subs);
  }
}

function empty(element) {
  if(!element.getAttribute('data-checked')) {
    return true;
  }
}

function emptySet(object, px) {
  var objname = String(object).replace(/\s+/g, '').toLowerCase();
  var result = document.getElementsByClassName(objname+" "+px);
  if(empty(result[0])) {
    return true;
  }
}

function getResults() {
  var px = whosTurn("x");
  document.getElementById('resultArea').classList.remove('hide-results');
  clearBox('resultArea');
  renderBox('resultArea');

  var object = {idName: px};

  if ( rollCount == 3 ) {
    renderSkip();
  }

  for (i = 0; i < 5; i++) {
    number = dices[i].number;
    hand[i] = number;
  }

  var sortedHand = hand.sort();
  sortedHand = sortedHand.join("");

  // Numbers (up ones)
  for (i = 1; i < 7; i++) {
    var patt = new RegExp(i);
    var res = patt.test(sortedHand);

    if ( patt.test(sortedHand) ) {
      var pattg = new RegExp(i,"g");
      var sendtext = sortedHand.match( pattg );
      var sum = sendtext.reduce(getSum, 0);

      if (i==1) {
        object.text = "Ones";
        object.firstSum =  sum;

        if (emptySet(object.text, px)) {
          renderText(object);
        }
      }
      if (i==2) {
          object.text = "Twos";
          object.firstSum =  sum;

        if (emptySet(object.text, px)) {
          renderText(object);
        }
      }
      if (i==3) {
        object.text = "Threes";
        object.firstSum =  sum;

        if (emptySet(object.text, px)) {
          renderText(object);
        }
      }
      if (i==4) {
        object.text = "Fours";
        object.firstSum =  sum;

        if (emptySet(object.text, px)) {
          renderText(object);
        }
      }
      if (i==5) {
        object.text = "Fives";
        object.firstSum =  sum;

        if (emptySet(object.text, px)) {
          renderText(object);
        }
      }
      if (i==6) {
        object.text = "Sixes";
        object.firstSum =  sum;

        if (emptySet(object.text, px)) {
          renderText(object);
        }
      }
    }
  }

  // Yathzee!
  if (/(.)\1{4}/.test(sortedHand)) {
    var sendtext = sortedHand.match(/(.)\1{4}/);
    sum = 50;
    object.text = "Yathzee";
    object.firstSum =  sum;

    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Four of a kind
  if (/(.)\1{3}/.test(sortedHand)) {
    var sendtext = sortedHand.match(/(.)\1{3}/);
    sum = getHandSum(sendtext[0]);
    object.text = "Four of a kind";
    object.firstSum =  sum;

    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Full house
  if (/(.)\1{2}(.)\2|(.)\3(.)\4{2}/.test(sortedHand)) {
    var sendtext = sortedHand.match(/(.)\1{2}(.)\2|(.)\3(.)\4{2}/);
    sum = getHandSum(sendtext[0]);
    object.text = "Full House";
    object.firstSum =  sum;

    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Two pairs
  if (/(.)\1{1}(.)\2|(.)\3(.)\4{2}/.test(sortedHand)) {
    var sendtext = sortedHand.match(/(.)\1{1}(.)\2|(.)\3(.)\4{2}/);
    sum = getHandSum(sendtext[0]);
    object.text = "Two pairs";
    object.firstSum =  sum;

    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Three of a kind
  if (/(.)\1{2}/.test(sortedHand)) {
    var sendtext = sortedHand.match(/(.)\1{2}/);
    sum = getHandSum(sendtext[0]);
    object.text = "Three of a kind";
    object.firstSum =  sum;

    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Big straight
  if (/23456/.test(sortedHand)) {
    var sendtext = sortedHand.match(/23456/)
    sum = getHandSum(sendtext[0]);
    object.text = "Big Straight";
    object.firstSum =  sum;

    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Small straight
  if (/12345/.test(sortedHand)) {
    var sendtext = sortedHand.match(/12345/);
    sum = getHandSum(sendtext[0]);
    object.text = "Small Straight";
    object.firstSum =  sum;
    if (emptySet(object.text, px)) {
      renderText(object);
    }
  }

  // Two of a kind
  if (/(.)\1{1}/g.test(sortedHand)) {
    var sendtext = sortedHand.match(/(.)\1{1}/g);
    sum = getHandSum(sendtext[0]);

    if (sendtext.length > 1) {
      var sum2 = getHandSum(sendtext[1]);
    }

    object.text = "Two of a Kind";
    object.firstSum =  sum;
    object.secondSum =  sum2;

    if (emptySet(object.text, px)) {
      renderText(object);
    }

    delete object.secondSum;
  }

  // Chance
  function getSum(total, num) {
      return parseInt(total) + parseInt(num);
  }
  var sum = hand.reduce(getSum);

  object.text = "Chance";
  object.firstSum =  sum;
    if (emptySet(object.text, px)) {
      renderText(object);
    }

  function getHandSum(sorted) {
    var parsed = String(sorted);
    var array = parsed.split("");
    var count = 0;
    for(var i=0, n=array.length; i < n; i++)
    {
       count += parseInt(array[i]);
    }
    return count;
  }
}

function renderText(object) {
  var text = object.text;
  var sum = object.firstSum;
  var sum2 = object.secondSum;
  var id = object.idName;

  document.getElementById("noResults").innerHTML ="";
  element = document.getElementById("resultTable");

  var li = document.createElement("li");
  li.className = "collection-item"

  var div = document.createElement("div");
  var textnode = document.createTextNode(text);
  var span = document.createElement("span");
  span.className = "strong-span new badge";
  span.setAttribute("data-badge-caption", "");
  span.setAttribute("onClick", 'addChoice(this.id)');
  span.setAttribute("id", text);

  var span2 = document.createElement("span");
  span2.className = "strong-span second-span new badge";
  span2.setAttribute("data-badge-caption", "");
  span2.setAttribute("onClick", 'addChoice(this.id)');
  span2.setAttribute("id", text);

  var i = document.createElement("i");
  i.className = "material-icons";

  var isend = document.createTextNode("send");
  li.appendChild(div).appendChild(textnode);

  var sumnumber = document.createTextNode(sum);
  var sumnumber2 = document.createTextNode(sum2);
  div.appendChild(span).appendChild(sumnumber);

  if (sum2 !== undefined) {
    div.appendChild(span2).appendChild(sumnumber2);
  }

  element.appendChild(li);
}

function addChoice(id) {
  var value = document.getElementById(id).innerHTML;
  var px = whosTurn("id");

  // Add value to player points
  playerPoints(value);

  if ( id == 'TwoOfaKind2') {
    id = "TwoOfaKind";
  }

  // Add value to upper
  if (id ==  "Ones" || id == "Twos" || id == "Threes" || id == "Fours" || id == "Fives" || id == "Sixes" ) {
    renderUpperPoints(value);
  }

  var span = document.createElement("span");
  span.className = "strong-span new badge normal-badge";
  span.setAttribute("data-badge-caption", "");

  var str = String(id).replace(/\s+/g, '').toLowerCase();

  var element = document.getElementsByClassName(str+' '+px);

  removeSkips();
  element[0].setAttribute("data-checked", true);
  element[0].appendChild(span).innerHTML = value;


  clearBox("resultArea");
  newTurn();
}

function clearBox(elementID) {
    document.getElementById(elementID).innerHTML = "";
    document.getElementById(elementID).classList.add('hide-results');
}


function renderBox(elementID) {
  document.getElementById('resultArea').classList.remove('hide-results');
  target = document.getElementById(elementID);
  var ul = document.createElement("ul");
  ul.className = "collection with-header";
  ul.setAttribute("id", "resultTable");

  var li = document.createElement("li");
  li.className = "collection-header";

  var h5 = document.createElement("h5");
  var textnode = document.createTextNode("Results");

  var p = document.createElement("p");
  resultText = "No results. Throw again.."
  p.setAttribute("id","noResults");
  if (rollCount == 3) {
    resultText = "No results. Now you have to skip something :(";
  }
  var textnodep = document.createTextNode(resultText);

  ul.appendChild(li).appendChild(h5).appendChild(textnode);
  ul.appendChild(li).appendChild(p).appendChild(textnodep);
  target.appendChild(ul);
}

function newTurn() {
  rollCount = 0;
  hand = [];
  clearBox('resultArea');

  if (isGameEnded()) {
    endGame();
  }

  document.getElementById("throw").classList.remove("disabled");
  for (i = 0; i < 5; i++) {
    dices[i]["checked"] = false;
    document.getElementById("diceWrapper"+i).classList.remove('checked')
  }

  document.getElementById("diceOverlay").classList.remove("shown");
  nextPlayer();
}

function playerPoints(p) {
  var px = whosTurn("x");

  players[whosTurn()].points += parseInt(p);

  var span = document.createElement("span");
  span.className = "strong-span new badge normal-badge";
  span.setAttribute("data-badge-caption", "");
  span.setAttribute("id", "TotalSpan"+px);
  var element = document.getElementsByClassName('total '+px);

  if(element[0].getAttribute('data-checked') !== "true") {
    element[0].setAttribute("data-checked", true);
    element[0].appendChild(span);
  }
  else {
    element[0].childNodes[0].innerHTML = players[whosTurn()].upperpoints;
  }

  document.getElementById('TotalSpan'+px).innerHTML = players[whosTurn()].points;
}

function renderSkip() {
  var px = whosTurn("x");
  var elements = document.getElementsByClassName("user-value "+px);
  var names = '';
  var skipText = "Skip";

  for(var i=0; i<elements.length; i++) {
    if(elements[i].getAttribute("data-checked") !== "true") {
      removeSpan(elements[i]);
      createSpan(elements[i], skipText, "skip");
    }
  }
}

function createSpan(element,text,skipclass) {
  var classSub = element.className;
  var result = classSub.substr(classSub.indexOf(" ") + 1);
  var span = document.createElement("span");
  span.className = "strong-span new badge normal-badge "+ skipclass;
  span.setAttribute("data-badge-caption", "");
  span.setAttribute("id", result);
  span.setAttribute("onClick", 'skipRow(this.id)');
  element.appendChild(span).innerHTML = text;
}

function removeSpan(element) {
  element.innerHTML = "";
}

function removeSkips() {
  var elements = document.getElementsByClassName("skip");
  elements.remove();
}

Element.prototype.remove = function() {
  this.parentElement.removeChild(this);
}

NodeList.prototype.remove = HTMLCollection.prototype.remove = function() {
    for(var i = this.length - 1; i >= 0; i--) {
        if(this[i] && this[i].parentElement) {
            this[i].parentElement.removeChild(this[i]);
        }
    }
}

function skipRow(id) {
  element = document.getElementById(id);
  parent = element.parentNode;
  parent.setAttribute("data-checked", true);

  object = {
    "className": "strong-span new badge normal-badge",
    "Id": "id",
    "IdName": element.id +"Span"
  }
  var span = renderGoodSpan(object);
  parent.appendChild(span).innerHTML = "-";

  removeSkips();
  newTurn();
}

function renderUpperPoints(points) {
  var px = whosTurn("x");
  players[whosTurn()].upperpoints += parseInt(points);
  var bonusElement = document.getElementsByClassName("bonus "+px)
  if ( players[whosTurn()].upperpoints >= 63 ) {
    if (empty(bonusElement[0])) {
      object = {
        "className": "strong-span new badge normal-badge",
        "Id": "id",
        "IdName": "Bonus"+px+"Span"
      }
      var span = renderGoodSpan(object);
      bonusElement[0].setAttribute("data-checked", true);
      bonusElement[0].appendChild(span).innerHTML = bonus;
      playerPoints(bonus);
    }
  }

  var element = document.getElementsByClassName("totalup "+px);

  object = {
    "className": "strong-span new badge normal-badge",
    "Id": "id",
    "IdName": "TotalUp"+px+"Span"
  }
  var span = renderGoodSpan(object);


  if (empty(element[0])) {
    element[0].setAttribute("data-checked", true);
    element[0].appendChild(span);
  }
  else {
    element[0].childNodes[0].innerHTML = players[whosTurn()].upperpoints;
  }

  elementSpan = document.getElementById("TotalUp"+px+"Span")
  elementSpan.innerHTML = players[whosTurn()].upperpoints;
}

function renderGoodSpan(object) {
  var className = object.className;
  var Id = object.Id;
  var IdName = object.IdName;
  var span = document.createElement("span");
  span.className = className;
  span.setAttribute("data-badge-caption", "");
  span.setAttribute(Id,IdName);

  return span
}

function isGameEnded() {
  numberOfMarks = 0;
  var checkedAmount = document.querySelectorAll("[data-checked=true]");
  var userMarkAmount = document.getElementsByClassName("user-value");

  for (i = 0; i < userMarkAmount.length; i++) {
    if (userMarkAmount[i].hasAttribute("data-checked")) {
        numberOfMarks += 1;
    }
  }
  if (numberOfMarks == userMarkAmount.length) {
    return true;
  }
  else {
    return false;
  }
}

function endGame() {
  var element = document.getElementById("overlay");
  element.classList.remove("hide");

  var target = document.getElementById("results");
  for(i=0; i < players.length; i++) {
    var element = document.createElement('li');
    var result = players[i].points;
    var name = players[i].name;
    row = name + " " + result;
    element.innerHTML = row;
    target.appendChild(element);
  }
}

function playAgain() {
  rollCount = 0;
  points = 0;
  upperpoints = 0;
  playerPoints(0);
  renderUpperPoints(0);
  var dices = {
    "0": {"number": 6, "checked": false},
    "1": {"number": 6, "checked": false},
    "2": {"number": 6, "checked": false},
    "3": {"number": 6, "checked": false},
    "4": {"number": 6, "checked": false}
  };
  var loopItems = document.getElementsByClassName("user-value");
  for (i = 0; i < loopItems.length; i++) {
    loopItems[i].innerHTML = '';
  }

  var checkedItems= document.querySelectorAll("[data-checked=true']");
  for (i = 0; i < loopItems.length; i++) {
    checkedItems[i].removeAttribute("data-checked");
  }

  var TotalUpClear = document.getElementById("TotalUpP1");
  TotalUpClear.innerHTML = "";
  TotalUpClear.removeAttribute("data-checked");

  var TotalClear = document.getElementById("TotalP1")
  TotalClear.innerHTML = "";
  TotalClear.removeAttribute("data-checked");

  var element = document.getElementById("overlay");
  element.classList.add("hide");
}

document.getElementById("bodyId")
    .addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode == 13) {
        document.getElementById("throw").click();
    }
});
