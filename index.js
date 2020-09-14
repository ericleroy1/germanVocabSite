

// VARIABLES FOR FORMS
const nounForm = document.querySelector('#noun');
const verbForm = document.querySelector('#verb');
const adjectiveForm = document.querySelector('#adjective');
const otherForm = document.querySelector('#other');


// ADD NEW WORDS FORMS
nounForm.addEventListener('submit', (e) => {
  let typeField = e.target.id;
    e.preventDefault();
    db.collection('words').add({
        type: typeField,
        item: nounForm.noun.value,
        group: "recent",
        created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    nounForm.noun.value = '';
});

verbForm.addEventListener('submit', (e) => {
  let typeField = e.target.id;
    e.preventDefault();
    db.collection('words').add({
        type: typeField,
        item: verbForm.verb.value,
        group: "recent",
        created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    verbForm.verb.value = '';
});

adjectiveForm.addEventListener('submit', (e) => {
  let typeField = e.target.id;
    e.preventDefault();
    db.collection('words').add({
        type: typeField,
        item: adjectiveForm.adjective.value,
        group: "recent",
        created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    adjectiveForm.adjective.value = '';
});

otherForm.addEventListener('submit', (e) => {
  let typeField = e.target.id;
    e.preventDefault();
    db.collection('words').add({
        type: typeField,
        item: otherForm.other.value,
        group: "recent",
        created: firebase.firestore.FieldValue.serverTimestamp(),
    });
    otherForm.other.value = '';
});

// RECENTLY ADDED LIST GENERATORS
$(".recentButton").click(function(e){
  var recentList = $("#recentList");
  $("#recentList").empty();
  let recentField = e.target.name;
  console.log(e.target.name);
  db.collection("words")
  .orderBy('created')
  .where("group", "==", "recent")
  .where("type", "==", recentField)
  .get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      var recentId = e.target.id;
      console.log(recentId);
      var recentWords = doc.data().item
      let recentLi = document.createElement("li");
      let recentDeleteButton = document.createElement("button");
      let recentFrequencyButton = document.createElement("button");
      let recentLearnedButton = document.createElement("button");
      let article = doc.data().item.substring(0,4);
      console.log(article);

      if (article == "der "){
        recentLi.setAttribute('data-id', doc.id);
        recentLi.setAttribute('class', 'list-group-item list-group-item-primary');
      } else if (article == "die "){
        recentLi.setAttribute('data-id', doc.id);
        recentLi.setAttribute('class', 'list-group-item list-group-item-warning');
      } else if (article == "das "){
        recentLi.setAttribute('data-id', doc.id);
        recentLi.setAttribute('class', 'list-group-item list-group-item-danger');
      } else {
        recentLi.setAttribute('data-id', doc.id);
        recentLi.setAttribute('class', 'list-group-item');
      }

      recentLi.textContent = doc.data().item;

      recentDeleteButton.setAttribute('id', doc.id);
      recentDeleteButton.setAttribute('class', 'btn btn-secondary btn-sm');
      recentDeleteButton.textContent = "Delete";

      recentFrequencyButton.setAttribute('id', doc.id);
      recentFrequencyButton.setAttribute('class', 'btn btn-secondary btn-sm');
      recentFrequencyButton.textContent = "Frequent";

      recentLearnedButton.setAttribute('id', doc.id);
      recentLearnedButton.setAttribute('class', 'btn btn-secondary btn-sm');
      recentLearnedButton.textContent = "Learned";

      recentList.append(recentLi);
      recentLi.append(recentDeleteButton);
      recentLi.append(recentFrequencyButton);
      recentLi.append(recentLearnedButton);

      recentDeleteButton.addEventListener("click", (e)=>{
        e.stopPropagation();
        console.log(e.target.id);
        db.collection("words").doc(e.target.id).delete()
      })

      recentFrequencyButton.addEventListener("click", (e)=>{
        e.stopPropagation();
        console.log(e.target.id);
        db.collection("words").doc(e.target.id).update({
          group: "frequent"
        })
      })

      recentLearnedButton.addEventListener("click", (e)=>{
        e.stopPropagation();
        console.log(e.target.id);
        db.collection("words").doc(e.target.id).update({
          group: "learned"
        })
      })

      })
    })
  })

// HIGH FREQUENCY LIST GENERATORS
//
$(".frequentButton").click(function(e){
  var frequentList = $("#frequentList");
  $("#frequentList").empty();
  let frequentField = e.target.name;
  db.collection("words").orderBy('created').where("type", "==", frequentField).where("group", "==", "frequent").get().then((snapshot)=>{
    snapshot.docs.forEach(doc=>{
      var frequentId = e.target.id;
      console.log("hi");
      var frequentWords = doc.data().item
      let frequentLi = document.createElement("li");
      let frequentDeleteButton = document.createElement("button");
      let frequentLearnedButton = document.createElement("button");
      let article = doc.data().item.substring(0,4);

      if (article == "der "){
        frequentLi.setAttribute('data-id', doc.id);
        frequentLi.setAttribute('class', 'list-group-item list-group-item-primary');
      } else if (article == "die "){
        frequentLi.setAttribute('data-id', doc.id);
        frequentLi.setAttribute('class', 'list-group-item list-group-item-warning');
      } else if (article == "das "){
        frequentLi.setAttribute('data-id', doc.id);
        frequentLi.setAttribute('class', 'list-group-item list-group-item-danger');
      } else {
        frequentLi.setAttribute('data-id', doc.id);
        frequentLi.setAttribute('class', 'list-group-item');
      }

      frequentLi.textContent = doc.data().item;

      frequentDeleteButton.setAttribute('id', doc.id);
      frequentDeleteButton.setAttribute('class', 'btn btn-secondary btn-sm');
      frequentDeleteButton.textContent = "Delete";

      frequentLearnedButton.setAttribute('id', doc.id);
      frequentLearnedButton.setAttribute('class', 'btn btn-secondary btn-sm');
      frequentLearnedButton.textContent = "Learned";

      frequentList.append(frequentLi);
      frequentLi.append(frequentDeleteButton);
      frequentLi.append(frequentLearnedButton);

      frequentDeleteButton.addEventListener("click", (e)=>{
        e.stopPropagation();
        console.log(e.target.id);
        db.collection("words").doc(e.target.id).delete()
      })

      frequentLearnedButton.addEventListener("click", (e)=>{
        e.stopPropagation();
        console.log(e.target.id);
        db.collection("words").doc(e.target.id).update({
          group: "learned"
        })
      })

      })
    })
  })

// LEARNED LIST GENERATORS

  $(".learnedButton").click(function(e){
    var learnedList = $("#learnedList");
    $("#learnedList").empty();
    let learnedField = e.target.name;
    db.collection("words").orderBy('created').where("type", "==", learnedField).where("group", "==", "learned").get().then((snapshot)=>{
      snapshot.docs.forEach(doc=>{
        var learnedId = e.target.id;
        var learnedWords = doc.data().item
        let learnedLi = document.createElement("li");
        let learnedDeleteButton = document.createElement("button");
        let article = doc.data().item.substring(0,4);

        if (article == "der "){
          learnedLi.setAttribute('data-id', doc.id);
          learnedLi.setAttribute('class', 'list-group-item list-group-item-primary');
        } else if (article == "die "){
          learnedLi.setAttribute('data-id', doc.id);
          learnedLi.setAttribute('class', 'list-group-item list-group-item-warning');
        } else if (article == "das "){
          learnedLi.setAttribute('data-id', doc.id);
          learnedLi.setAttribute('class', 'list-group-item list-group-item-danger');
        } else {
          learnedLi.setAttribute('data-id', doc.id);
          learnedLi.setAttribute('class', 'list-group-item');
        }

        learnedLi.textContent = doc.data().item;

        learnedDeleteButton.setAttribute('id', doc.id);
        learnedDeleteButton.setAttribute('class', 'btn btn-secondary btn-sm');
        learnedDeleteButton.textContent = "Delete";

        learnedList.append(learnedLi);
        learnedLi.append(learnedDeleteButton);

        learnedDeleteButton.addEventListener("click", (e)=>{
          e.stopPropagation();
          console.log(e.target.id);
          db.collection("words").doc(e.target.id).delete()
        })
        })
      })
    })
